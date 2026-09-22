'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { supabase, EventRequest, EventBid } from '@/lib/supabase'

type Access = 'checking' | 'needs-login' | 'needs-business' | 'granted'

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [access, setAccess] = useState<Access>('checking')
  const [event, setEvent] = useState<EventRequest | null>(null)
  const [bids, setBids] = useState<EventBid[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        setAccess('needs-login')
        return
      }

      const { data: business } = await supabase
        .from('popup_businesses')
        .select('id')
        .eq('owner_id', data.session.user.id)
        .eq('status', 'active')
        .limit(1)
        .maybeSingle()

      if (!business) {
        setAccess('needs-business')
        return
      }

      setAccess('granted')

      const [{ data: eventData }, { data: bidData }] = await Promise.all([
        supabase.from('event_requests').select('*').eq('id', id).single(),
        supabase.from('event_bids').select('*').eq('event_request_id', id),
      ])

      setEvent(eventData as EventRequest)
      setBids((bidData as EventBid[]) ?? [])
    })
  }, [id, router])

  if (access === 'checking') return null

  if (access === 'needs-login' || access === 'needs-business') {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
          Want to bid on more events in your area?
        </h1>
        <p className="mt-4 text-lg text-[var(--ink-soft)]">
          People post their events here, and pop-up businesses like yours submit proposals
          directly. List your business — it's free — to start bidding.
        </p>
        <Link
          href="/list-your-business"
          className="mt-8 inline-block px-6 py-3 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--gold)] text-[var(--ink)] hover:opacity-90"
        >
          Bid Events
        </Link>
        {access === 'needs-login' && (
          <p className="mt-3 text-sm text-[var(--ink-soft)]">
            Already have an account?{' '}
            <Link href={`/login?role=business&next=/events/${id}`} className="underline">
              Log in here →
            </Link>
          </p>
        )}
      </main>
    )
  }

  if (!event) return null

  const full = bids.length >= 5

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {event.event_type || 'Open to any pop-up'}
      </h1>
      <div className="flex gap-4 mt-3 text-sm text-[var(--ink-soft)]">
        {event.event_date && (
          <span>{new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        )}
        {(event.city || event.state) && <span>{[event.city, event.state].filter(Boolean).join(', ')}</span>}
        {event.guest_count && <span>{event.guest_count} guests</span>}
        {event.budget_range && <span>Budget: {event.budget_range}</span>}
      </div>

      {event.description && (
        <p className="mt-6 text-[var(--ink-soft)] leading-relaxed">{event.description}</p>
      )}

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold mb-4">{bids.length}/5 bids submitted</h2>

        {full ? (
          <div className="border-2 border-dashed border-[var(--line)] rounded-xl p-6 text-center text-[var(--ink-soft)]">
            This event has reached its 5-bid limit.
          </div>
        ) : (
          <div className="border-2 border-[var(--ink)] rounded-xl p-6 bg-white">
            <p className="text-sm text-[var(--ink-soft)] mb-4">
              Submitting a proposal costs <strong>1 bid credit ($20)</strong>. Buying
              credits in bulk brings the price down — see{' '}
              <Link href="/list-your-business" className="underline">bid credit packs</Link>.
            </p>
            <a
              href={`mailto:popupspotlightinfo@gmail.com?subject=${encodeURIComponent(
                `Bid on event: ${event.event_type || 'Event'} (${event.id})`
              )}&body=${encodeURIComponent(
                'Include your proposal, price quote, and business name. We\'ll confirm your credit balance (or take payment) and get your bid live.'
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
