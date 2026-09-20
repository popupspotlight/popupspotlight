import Link from 'next/link'
import { supabase, PopupBusiness } from '@/lib/supabase'
import { CATEGORY_META, Category } from '@/lib/categories'

async function getBusinesses(category?: string, city?: string): Promise<PopupBusiness[]> {
  let query = supabase.from('popup_businesses').select('*').eq('status', 'active')

  if (category) query = query.eq('category', category)
  if (city) query = query.ilike('city', `%${city}%`)

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
  const diff = now.getTime() - start.getTime()
  return Math.floor(diff / 86400000)
}

function rotate<T>(arr: T[], offset: number): T[] {
  if (arr.length === 0) return arr
  const n = offset % arr.length
  return [...arr.slice(n), ...arr.slice(0, n)]
}

const TIER_WEIGHT: Record<string, number> = { spotlighted: 0, featured: 1, listed: 2 }

export default async function DiscoveryPage({
  searchParams,
}: {
  searchParams: { sort?: string; category?: string; city?: string }
}) {
  const category = searchParams.category ?? ''
  const city = searchParams.city ?? ''
  const sort = searchParams.sort ?? 'suggested'

  const [businesses, reviewStats] = await Promise.all([
    getBusinesses(category, city),
    getReviewStats(),
  ])
  const categories = Object.keys(CATEGORY_META) as Category[]

  let spotlighted = businesses.filter((b) => b.tier === 'spotlighted')
  spotlighted = rotate(spotlighted, dayOfYear()).slice(0, 5)
  const spotlightedIds = new Set(spotlighted.map((b) => b.id))
  const rest = businesses.filter((b) => !spotlightedIds.has(b.id))

  let sorted: PopupBusiness[]
  if (sort === 'top_rated') {
    sorted = [...businesses].sort(
      (a, b) => (reviewStats[b.id]?.avg ?? 0) - (reviewStats[a.id]?.avg ?? 0)
    )
  } else if (sort === 'most_reviewed') {
    sorted = [...businesses].sort(
      (a, b) => (reviewStats[b.id]?.count ?? 0) - (reviewStats[a.id]?.count ?? 0)
    )
  } else {
    sorted = [
      ...spotlighted,
      ...rest.sort((a, b) => TIER_WEIGHT[a.tier] - TIER_WEIGHT[b.tier]),
    ]
  }

  function sortLink(key: string) {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (city) params.set('city', city)
    if (key !== 'suggested') params.set('sort', key)
    const qs = params.toString()
    return qs ? `/?${qs}` : '/'
  }

  return (
    <main>
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-10">
        <h1 className="font-display text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.05] max-w-2xl">
          Find what's popping up near you.
        </h1>
        <p className="mt-5 text-lg text-[var(--ink-soft)] max-w-xl">
          Hat bars, jewelry pop-ups, food trucks, and mobile beauty — temporary
          storefronts from around the country, in one place.
        </p>

        <form
          method="get"
          className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl border-2 border-[var(--ink)] rounded-xl p-3 bg-white"
        >
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
          <input
            name="city"
            defaultValue={city}
            placeholder="City (e.g. Denver)"
            className="flex-1 border-2 border-[var(--line)] rounded-lg px-3 py-2"
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-lg font-medium bg-[var(--ink)] text-[var(--paper)] hover:opacity-90"
          >
            Search
          </button>
        </form>

        <div className="mt-4 flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/?category=${cat}${city ? `&city=${encodeURIComponent(city)}` : ''}`}
              className={`text-sm px-4 py-1.5 rounded-full border-2 border-[var(--ink)] font-medium ${
                category === cat ? 'bg-[var(--ink)] text-[var(--paper)]' : ''
              }`}
            >
              {CATEGORY_META[cat].label}
            </Link>
          ))}
          {(category || city) && (
            <Link
              href="/"
              className="text-sm px-4 py-1.5 rounded-full text-[var(--ink-soft)] underline"
            >
              Clear filters
            </Link>
          )}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-[var(--ink-soft)]">
            {businesses.length} {businesses.length === 1 ? 'listing' : 'listings'}
            {city ? ` in ${city}` : ''}
          </span>
          <div className="flex gap-2">
            {[
              { key: 'suggested', label: 'Suggested' },
              { key: 'top_rated', label: 'Top rated' },
              { key: 'most_reviewed', label: 'Most reviews' },
            ].map((opt) => (
              <Link
                key={opt.key}
                href={sortLink(opt.key)}
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
            {category || city
              ? 'No listings match that search yet. Try clearing a filter.'
              : 'No active listings yet. Once a pop-up owner publishes, it shows up here.'}
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
                        <span className="text-xs font-medium text-[var(--gold)]">
                          ★ Spotlighted
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-semibold mt-3">{b.name}</h3>
                    {(b.city || b.state) && (
                      <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                        {[b.city, b.state].filter(Boolean).join(', ')}
                      </p>
                    )}
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
      </section>
    </main>
  )
}

export const revalidate = 60
