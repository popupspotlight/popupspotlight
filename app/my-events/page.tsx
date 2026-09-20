'use client'

import { useEffect, useState } from 'react'
import { supabase, EventRequest } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type BidWithBusiness = {
  id: string
  proposal: string
  price_quote: string | null
  created_at: string
  popup_businesses: { name: string; phone: string | null } | null
}

export default function MyEventsPage() {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [events, setEvents] = useState<EventRequest[]>([])
  const [bidsByEvent, setBidsByEvent] = useState<Record<string, BidWithBusiness[]>>({})

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session?.user.email) {
        router.push('/my-events/login')
        return
      }

      const { data: myEvents } = await supabase
        .from('event_requests')
        .select('*')
        .eq('email', data.session.user.email)
        .order('created_at', { ascending: false })

      const eventList = (myEvents as EventRequest[]) ?? []
      setEvents(eventList)

      if (eventList.length > 0) {
        const { data: bids } = await supabase
          .from('event_bids')
          .select('*, popup_businesses(name, phone)')
          .in('event_request_id', eventList.map((e) => e.id))

        const grouped: Record<string, BidWithBusiness[]> = {}
        ;(bids as BidWithBusiness[] & { event_request_id: string }[] | null)?.forEach(
          (b: any) => {
            if (!grouped[b.event_request_id]) grouped[b.event_request_id] = []
            grouped[b.event_request_id].push(b)
          }
        )
        setBidsByEvent(grouped)
      }

      setLoaded(true)
    })
  }, [router])

  if (!loaded) return null

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Your events</h1>

      {events.length === 0 ? (
        <p className="text-[var(--ink-soft)] mt-6">You haven't posted an event yet.</p>
      ) : (
        <div className="mt-8 space-y-6">
          {events.map((event) => {
            const bids = bidsByEvent[event.id] ?? []
            return (
              <div key={event.id} className="border-2 border-[var(--ink)] rounded-xl p-6 bg-white">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold">
                    {event.event_type || 'Open to any pop-up'}
                  </h2>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--gold)] text-white">
                    {bids.length}/5 bids
                  </span>
                </div>
                {event.event_date && (
                  <p className="text-sm text-[var(--ink-soft)] mt-1">
                    {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                )}

                {bids.length === 0 ? (
                  <p className="text-sm text-[var(--ink-soft)] mt-4">No bids yet.</p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {bids.map((bid) => (
                      <div key={bid.id} className="border-t border-[var(--line)] pt-4">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{bid.popup_businesses?.name}</p>
                          {bid.price_quote && (
                            <span className="text-sm font-medium">{bid.price_quote}</span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--ink-soft)] mt-1">{bid.proposal}</p>
                        {bid.popup_businesses?.phone && (
                          <p className="text-sm mt-2">{bid.popup_businesses.phone}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
