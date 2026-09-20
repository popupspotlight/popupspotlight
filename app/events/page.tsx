import Link from 'next/link'
import { supabase, EventRequest, EventBid } from '@/lib/supabase'

async function getOpenEvents() {
  const { data, error } = await supabase
    .from('event_requests')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }
  return (data ?? []) as EventRequest[]
}

async function getBidCounts() {
  const { data } = await supabase.from('event_bids').select('event_request_id')
  const counts: Record<string, number> = {}
  ;(data as { event_request_id: string }[] | null)?.forEach((b) => {
    counts[b.event_request_id] = (counts[b.event_request_id] ?? 0) + 1
  })
  return counts
}

export default async function EventsPage() {
  const [events, bidCounts] = await Promise.all([getOpenEvents(), getBidCounts()])

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-semibold tracking-tight">
        Event requests looking for pop-ups.
      </h1>
      <p className="mt-3 text-[var(--ink-soft)] max-w-xl">
        Submit a proposal directly to the customer. Each event is capped at 5 bids, so
        act early.
      </p>

      <div className="mt-10 space-y-4">
        {events.length === 0 ? (
          <div className="border-2 border-dashed border-[var(--line)] rounded-xl p-12 text-center text-[var(--ink-soft)]">
            No open event requests right now. Check back soon.
          </div>
        ) : (
          events.map((event) => {
            const count = bidCounts[event.id] ?? 0
            const full = count >= 5
            return (
              <Link
                href={`/events/${event.id}`}
                key={event.id}
                className="block border-2 border-[var(--ink)] rounded-xl p-5 bg-white hover:-translate-y-0.5 transition-transform"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold">
                    {event.event_type || 'Open to any pop-up'}
                  </h3>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${full ? 'bg-[var(--line)] text-[var(--ink-soft)]' : 'bg-[var(--gold)] text-white'}`}>
                    {count}/5 bids
                  </span>
                </div>
                <div className="flex gap-4 mt-2 text-sm text-[var(--ink-soft)]">
                  {event.event_date && <span>{new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                  {(event.city || event.state) && <span>{[event.city, event.state].filter(Boolean).join(', ')}</span>}
                  {event.guest_count && <span>{event.guest_count} guests</span>}
                </div>
              </Link>
            )
          })
        )}
      </div>
    </main>
  )
}

export const revalidate = 30
