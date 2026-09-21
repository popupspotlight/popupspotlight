'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase, EventRequest, PopupBusiness } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Access = 'checking' | 'needs-login' | 'needs-upgrade' | 'granted'

export default function EventsPage() {
  const router = useRouter()
  const [access, setAccess] = useState<Access>('checking')
  const [events, setEvents] = useState<EventRequest[]>([])
  const [bidCounts, setBidCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        setAccess('needs-login')
        return
      }

      const { data: paidBusiness } = await supabase
        .from('popup_businesses')
        .select('id')
        .eq('owner_id', data.session.user.id)
        .eq('tier', 'spotlighted')
        .eq('status', 'active')
        .limit(1)
        .maybeSingle()

      if (!paidBusiness) {
        setAccess('needs-upgrade')
        return
      }

      setAccess('granted')

      const { data: openEvents } = await supabase
        .from('event_requests')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })

      const eventList = (openEvents as EventRequest[]) ?? []
      setEvents(eventList)

      const { data: bids } = await supabase.from('event_bids').select('event_request_id')
      const counts: Record<string, number> = {}
      ;(bids as { event_request_id: string }[] | null)?.forEach((b) => {
        counts[b.event_request_id] = (counts[b.event_request_id] ?? 0) + 1
      })
      setBidCounts(counts)
    })
  }, [router])

  if (access === 'checking') return null

  if (access === 'needs-login') {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
          Want to bid on more events in your area?
        </h1>
        <p className="mt-4 text-lg text-[var(--ink-soft)]">
          People post their events here, and pop-up businesses like yours submit proposals
          directly. List your business to start bidding.
        </p>
        <Link
          href="/list-your-business"
          className="mt-8 inline-block px-6 py-3 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--gold)] text-[var(--ink)] hover:opacity-90"
        >
          Bid Events
        </Link>
        <p className="mt-3 text-sm text-[var(--ink-soft)]">
          Already have an account?{' '}
          <Link href="/login?role=business&next=/events" className="underline">
            Log in here →
          </Link>
        </p>
      </main>
    )
  }

  if (access === 'needs-upgrade') {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
          Want to bid on more events in your area?
        </h1>
        <p className="mt-4 text-lg text-[var(--ink-soft)]">
          Bidding on events is exclusive to the Spotlighted plan — upgrade
          your listing to start submitting proposals.
        </p>
        <Link
          href="/list-your-business"
          className="mt-8 inline-block px-6 py-3 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--gold)] text-[var(--ink)] hover:opacity-90"
        >
          Bid Events
        </Link>
      </main>
    )
  }

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
