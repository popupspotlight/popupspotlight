import { supabase, EventRequest, EventBid } from '@/lib/supabase'
import { notFound } from 'next/navigation'

const BID_TIERS = [
  { label: 'Up to 50 guests', fee: '$15' },
  { label: '51–150 guests', fee: '$30' },
  { label: '150+ guests', fee: '$50' },
]

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const [{ data: event }, { data: bids }] = await Promise.all([
    supabase.from('event_requests').select('*').eq('id', params.id).single(),
    supabase.from('event_bids').select('*').eq('event_request_id', params.id),
  ])

  if (!event) notFound()

  const e = event as EventRequest
  const bidList = (bids as EventBid[]) ?? []
  const full = bidList.length >= 5

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {e.event_type || 'Open to any pop-up'}
      </h1>
      <div className="flex gap-4 mt-3 text-sm text-[var(--ink-soft)]">
        {e.event_date && (
          <span>{new Date(e.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        )}
        {(e.city || e.state) && <span>{[e.city, e.state].filter(Boolean).join(', ')}</span>}
        {e.guest_count && <span>{e.guest_count} guests</span>}
        {e.budget_range && <span>Budget: {e.budget_range}</span>}
      </div>

      {e.description && (
        <p className="mt-6 text-[var(--ink-soft)] leading-relaxed">{e.description}</p>
      )}

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold mb-4">
          {bidList.length}/5 bids submitted
        </h2>

        {full ? (
          <div className="border-2 border-dashed border-[var(--line)] rounded-xl p-6 text-center text-[var(--ink-soft)]">
            This event has reached its 5-bid limit.
          </div>
        ) : (
          <div className="border-2 border-[var(--ink)] rounded-xl p-6 bg-white">
            <p className="text-sm text-[var(--ink-soft)] mb-4">
              Submitting a proposal has a small fee, scaled to event size:
            </p>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {BID_TIERS.map((tier) => (
                <div key={tier.label} className="border-2 border-[var(--line)] rounded-lg p-3 text-center">
                  <p className="font-display text-lg font-semibold">{tier.fee}</p>
                  <p className="text-xs text-[var(--ink-soft)] mt-1">{tier.label}</p>
                </div>
              ))}
            </div>
            <a
              href={`mailto:popupspotlightinfo@gmail.com?subject=${encodeURIComponent(
                `Bid on event: ${e.event_type || 'Event'} (${e.id})`
              )}&body=${encodeURIComponent(
                'Include your proposal, price quote, and business name. We\'ll confirm your fee and get your bid live.'
              )}`}
              className="block text-center px-6 py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:opacity-90"
            >
              Email us your proposal
            </a>
            <p className="text-xs text-[var(--ink-soft)] mt-3 text-center">
              Bidding is manual for now while we build self-serve submission.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

export const revalidate = 30
