import { supabase, PopupBusiness, PopupPhoto, Review } from '@/lib/supabase'
import { CATEGORY_META, Category } from '@/lib/categories'
import { notFound } from 'next/navigation'

function formatPhone(phone: string | null) {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (digits.length !== 10) return phone
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function Stars({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(Math.round(rating))}
      <span style={{ opacity: 0.25 }}>{'★'.repeat(5 - Math.round(rating))}</span>
    </span>
  )
}

export default async function BusinessProfilePage({ params }: { params: { id: string } }) {
  const [{ data: business }, { data: photos }, { data: reviews }] = await Promise.all([
    supabase.from('popup_businesses').select('*').eq('id', params.id).single(),
    supabase
      .from('popup_photos')
      .select('*')
      .eq('popup_id', params.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('reviews')
      .select('*')
      .eq('popup_id', params.id)
      .order('created_at', { ascending: false }),
  ])

  if (!business) notFound()

  const biz = business as PopupBusiness
  const meta = CATEGORY_META[biz.category as Category]
  const reviewList = (reviews as Review[]) ?? []
  const photoList = (photos as PopupPhoto[]) ?? []
  const avgRating = reviewList.length
    ? reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length
    : null
  const hasPhotos = photoList.length > 0

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      {!hasPhotos && meta?.image && (
        <img
          src={meta.image}
          alt=""
          className="w-full h-56 sm:h-72 object-cover rounded-xl border-2 border-[var(--ink)] mb-6"
        />
      )}

      <span
        className="text-xs font-medium px-2.5 py-1 rounded-full"
        style={{ background: meta?.bg, color: meta?.text }}
      >
        {meta?.label ?? biz.category}
      </span>

      <h1 className="font-display text-4xl font-semibold tracking-tight mt-4">{biz.name}</h1>

      <div className="flex items-center gap-3 mt-3 text-sm text-[var(--ink-soft)]">
        {avgRating !== null ? (
          <span className="text-[var(--gold)]">
            <Stars rating={avgRating} />{' '}
            <span className="text-[var(--ink)] font-medium">{avgRating.toFixed(1)}</span> (
            {reviewList.length} {reviewList.length === 1 ? 'review' : 'reviews'})
          </span>
        ) : (
          <span>No reviews yet</span>
        )}
      </div>

      {biz.description && (
        <p className="mt-6 text-[var(--ink-soft)] leading-relaxed">{biz.description}</p>
      )}

      {biz.phone && (
        <p className="mt-4 font-medium">{formatPhone(biz.phone)}</p>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <a
          href={`mailto:popupspotlightinfo@gmail.com?subject=${encodeURIComponent(
            `Booking request: ${biz.name}`
          )}&body=${encodeURIComponent(
            'Tell us about your event: date, location, guest count, and what you have in mind.'
          )}`}
          className="text-center px-6 py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:opacity-90"
        >
          Request to book
        </a>
        {biz.phone && (
          <a
            href={`tel:${biz.phone}`}
            className="text-center px-6 py-2.5 rounded-full font-medium border-2 border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
          >
            Call to book
          </a>
        )}
      </div>
      <p className="text-xs text-[var(--ink-soft)] mt-2">
        Booking requests are handled directly for now while we build online booking.
      </p>

      {hasPhotos && (
        <div className="mt-10">
          <h2 className="font-display text-lg font-semibold mb-3">Photos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photoList.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={p.id}
                src={p.url}
                alt={`${biz.name} photo`}
                className="w-full aspect-square object-cover rounded-lg border-2 border-[var(--ink)]"
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-12">
        <h2 className="font-display text-lg font-semibold mb-4">Reviews</h2>
        {reviewList.length === 0 ? (
          <p className="text-sm text-[var(--ink-soft)]">No reviews yet — be the first to visit and leave one.</p>
        ) : (
          <div className="space-y-6">
            {reviewList.map((r) => (
              <div key={r.id} className="border-t border-[var(--line)] pt-5">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{r.reviewer_name}</span>
                  {r.verified && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--gold)] text-white">
                      Verified visit
                    </span>
                  )}
                </div>
                <div className="text-[var(--gold)] text-sm mt-1">
                  <Stars rating={r.rating} />
                </div>
                {r.text && <p className="text-sm mt-2 text-[var(--ink-soft)]">{r.text}</p>}
                {r.owner_response && (
                  <div className="mt-3 ml-4 pl-4 border-l-2 border-[var(--line)]">
                    <p className="text-xs font-medium text-[var(--ink-soft)]">
                      Response from {biz.name}
                    </p>
                    <p className="text-sm mt-1">{r.owner_response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export const revalidate = 60
