import Link from 'next/link'
import { supabase, PopupBusiness } from '@/lib/supabase'
import { CATEGORY_META, Category } from '@/lib/categories'
import { geocodeZip, distanceMiles } from '@/lib/geocode'

const RADIUS_MILES = 60

async function getBusinesses(category?: string): Promise<PopupBusiness[]> {
  let query = supabase.from('popup_businesses').select('*').eq('status', 'active')
  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error) {
    console.error(error)
    return []
  }
  return data ?? []
}

async function getReviewStats() {
  const { data } = await supabase.from('reviews').select('popup_id, rating')
  const stats: Record<string, { avg: number; count: number }> = {}
  ;(data as { popup_id: string; rating: number }[] | null)?.forEach((r) => {
    if (!stats[r.popup_id]) stats[r.popup_id] = { avg: 0, count: 0 }
    stats[r.popup_id].avg += r.rating
    stats[r.popup_id].count += 1
  })
  Object.keys(stats).forEach((id) => {
    stats[id].avg = stats[id].avg / stats[id].count
  })
  return stats
}

function formatPhone(phone: string | null) {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (digits.length !== 10) return phone
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function dayOfYear() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now.getTime() - start.getTime()) / 86400000)
}

function rotate<T>(arr: T[], offset: number): T[] {
  if (arr.length === 0) return arr
  const n = offset % arr.length
  return [...arr.slice(n), ...arr.slice(0, n)]
}

const TIER_WEIGHT: Record<string, number> = { spotlighted: 0, featured: 1, listed: 2 }

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { zip?: string; category?: string; sort?: string }
}) {
  const zip = searchParams.zip ?? ''
  const category = searchParams.category ?? ''
  const sort = searchParams.sort ?? 'suggested'
  const categories = Object.keys(CATEGORY_META) as Category[]

  const [allBusinesses, reviewStats] = await Promise.all([
    getBusinesses(category),
    getReviewStats(),
  ])

  let origin: { lat: number; lng: number } | null = null
  let geocodeFailed = false
  if (zip) {
    origin = await geocodeZip(zip)
    if (!origin) geocodeFailed = true
  }

  let businesses: (PopupBusiness & { distance?: number })[] = allBusinesses
  if (origin) {
    businesses = allBusinesses
      .filter((b) => b.lat !== null && b.lng !== null)
      .map((b) => ({
        ...b,
        distance: distanceMiles(origin!.lat, origin!.lng, b.lat as number, b.lng as number),
      }))
      .filter((b) => (b.distance as number) <= RADIUS_MILES)
  }

  let spotlighted = businesses.filter((b) => b.tier === 'spotlighted')
  spotlighted = rotate(spotlighted, dayOfYear()).slice(0, 5)
  const spotlightedIds = new Set(spotlighted.map((b) => b.id))
  const rest = businesses.filter((b) => !spotlightedIds.has(b.id))

  let sorted: (PopupBusiness & { distance?: number })[]
  if (sort === 'closest' && origin) {
    // Pure distance sort — no Spotlighted priority here, since "closest"
    // should mean exactly that.
    sorted = [...businesses].sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
  } else if (sort === 'top_rated') {
    sorted = [...businesses].sort(
      (a, b) => (reviewStats[b.id]?.avg ?? 0) - (reviewStats[a.id]?.avg ?? 0)
    )
  } else if (sort === 'most_reviewed') {
    sorted = [...businesses].sort(
      (a, b) => (reviewStats[b.id]?.count ?? 0) - (reviewStats[a.id]?.count ?? 0)
    )
  } else if (origin) {
    // Suggested with a zip entered: closest first, but Spotlighted still gets
    // its fair rotated boost within the radius.
    sorted = [
      ...spotlighted,
      ...rest.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0)),
    ]
  } else {
    sorted = [...spotlighted, ...rest.sort((a, b) => TIER_WEIGHT[a.tier] - TIER_WEIGHT[b.tier])]
  }

  function buildUrl(overrides: Record<string, string>) {
    const params = new URLSearchParams()
    const merged = { zip, category, sort, ...overrides }
    if (merged.zip) params.set('zip', merged.zip)
    if (merged.category) params.set('category', merged.category)
    if (merged.sort && merged.sort !== 'suggested') params.set('sort', merged.sort)
    const qs = params.toString()
    return qs ? `/search?${qs}` : '/search'
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <form
        method="get"
        action="/search"
        className="flex flex-col sm:flex-row gap-3 border-2 border-[var(--ink)] rounded-xl p-3 bg-white"
      >
        <input
          name="zip"
          defaultValue={zip}
          pattern="[0-9]{5}"
          maxLength={5}
          placeholder="Zip code"
          className="flex-1 border-2 border-[var(--line)] rounded-lg px-3 py-2"
        />
        <select
          name="category"
          defaultValue={category}
          className="flex-1 border-2 border-[var(--line)] rounded-lg px-3 py-2 bg-white"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_META[cat].label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-6 py-2 rounded-lg font-medium bg-[var(--ink)] text-[var(--paper)] hover:opacity-90"
        >
          Search
        </button>
      </form>

      {geocodeFailed && (
        <p className="mt-3 text-sm text-red-600">
          Couldn't find that zip code — showing all listings instead.
        </p>
      )}

      <div className="flex items-center justify-between mt-8 mb-6">
        <span className="text-sm text-[var(--ink-soft)]">
          {sorted.length} {sorted.length === 1 ? 'listing' : 'listings'}
          {origin ? ` within ${RADIUS_MILES} miles of ${zip}` : ''}
        </span>
        <div className="flex gap-2">
          {[
            { key: 'suggested', label: 'Suggested' },
            ...(origin ? [{ key: 'closest', label: 'Closest' }] : []),
            { key: 'top_rated', label: 'Top rated' },
            { key: 'most_reviewed', label: 'Most reviews' },
          ].map((opt) => (
            <Link
              key={opt.key}
              href={buildUrl({ sort: opt.key })}
              className={`text-sm px-3 py-1.5 rounded-full border-2 border-[var(--ink)] ${
                sort === opt.key ? 'bg-[var(--ink)] text-[var(--paper)]' : ''
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="border-2 border-dashed border-[var(--line)] rounded-xl p-12 text-center text-[var(--ink-soft)]">
          {origin
            ? `No listings within ${RADIUS_MILES} miles of ${zip} yet.`
            : 'No active listings yet.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {sorted.map((b) => {
            const meta = CATEGORY_META[b.category as Category]
            const stats = reviewStats[b.id]
            return (
              <Link
                href={`/business/${b.id}`}
                key={b.id}
                className="border-2 border-[var(--ink)] rounded-xl overflow-hidden bg-white flex flex-col hover:-translate-y-0.5 transition-transform"
              >
                <div className="h-2" style={{ background: meta?.accent ?? 'var(--ink)' }} />
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ background: meta?.bg, color: meta?.text }}
                    >
                      {meta?.label ?? b.category}
                    </span>
                    {b.tier === 'spotlighted' && (
                      <span className="text-xs font-medium text-[var(--gold)]">★ Spotlighted</span>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-semibold mt-3">{b.name}</h3>
                  <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                    {b.distance !== undefined
                      ? `${b.distance.toFixed(0)} mi away`
                      : [b.city, b.state].filter(Boolean).join(', ')}
                  </p>
                  {stats && (
                    <p className="text-sm text-[var(--gold)] mt-1">
                      {stats.avg.toFixed(1)} ★{' '}
                      <span className="text-[var(--ink-soft)]">
                        ({stats.count} {stats.count === 1 ? 'review' : 'reviews'})
                      </span>
                    </p>
                  )}
                  {b.description && (
                    <p className="text-sm text-[var(--ink-soft)] mt-2 flex-1 line-clamp-3">
                      {b.description}
                    </p>
                  )}
                  {b.phone && (
                    <p className="text-sm text-[var(--ink)] mt-4 font-medium">
                      {formatPhone(b.phone)}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}

export const revalidate = 0
