import { supabase, WorkerProfile, WorkerReview } from '@/lib/supabase'
import { notFound } from 'next/navigation'

function Stars({ rating }: { rating: number }) {
  return (
    <span>
      {'★'.repeat(Math.round(rating))}
      <span style={{ opacity: 0.25 }}>{'★'.repeat(5 - Math.round(rating))}</span>
    </span>
  )
}

export default async function WorkerProfilePage({ params }: { params: { id: string } }) {
  const [{ data: worker }, { data: reviews }] = await Promise.all([
    supabase.from('worker_profiles').select('*').eq('id', params.id).single(),
    supabase
      .from('worker_reviews')
      .select('*')
      .eq('worker_id', params.id)
      .eq('direction', 'employer_on_worker')
      .order('created_at', { ascending: false }),
  ])

  if (!worker) notFound()

  const w = worker as WorkerProfile
  const reviewList = (reviews as WorkerReview[]) ?? []
  const avgRating = reviewList.length
    ? reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length
    : null

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-semibold tracking-tight">{w.name}</h1>

      <div className="mt-3 text-sm text-[var(--ink-soft)]">
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

      {w.bio && <p className="mt-6 text-[var(--ink-soft)] leading-relaxed">{w.bio}</p>}
      {w.skills && (
        <div className="mt-4 flex gap-2 flex-wrap">
          {w.skills.split(',').map((s) => (
            <span
              key={s}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--paper)] border-2 border-[var(--line)]"
            >
              {s.trim()}
            </span>
          ))}
        </div>
      )}

      <div className="mt-12">
        <h2 className="font-display text-lg font-semibold mb-4">Reviews from employers</h2>
        {reviewList.length === 0 ? (
          <p className="text-sm text-[var(--ink-soft)]">No reviews yet.</p>
        ) : (
          <div className="space-y-6">
            {reviewList.map((r) => (
              <div key={r.id} className="border-t border-[var(--line)] pt-5">
                <div className="text-[var(--gold)] text-sm">
                  <Stars rating={r.rating} />
                </div>
                {r.text && <p className="text-sm mt-2 text-[var(--ink-soft)]">{r.text}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export const revalidate = 60
