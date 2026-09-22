'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { supabase, EventRequest, EventBid } from '@/lib/supabase'

type Access = 'checking' | 'needs-login' | 'needs-business' | 'granted'

const BID_CREDIT_PACKS = [
  { credits: '1 credit', price: '$20', perCredit: '$20 / bid' },
  { credits: '10 credits', price: '$170', perCredit: '$17 / bid — save 15%' },
  { credits: '25 credits', price: '$400', perCredit: '$16 / bid — save 20%' },
  { credits: '50 credits', price: '$650', perCredit: '$13 / bid — save 35%', highlight: true },
  { credits: '75 credits', price: '$900', perCredit: '$12 / bid — save 40%' },
  { credits: '100 credits', price: '$1,000', perCredit: '$10 / bid — save 50%' },
]

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
              Submitting a proposal uses 1 bid credit. Buy credits below, then email us
              your proposal.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
              {BID_CREDIT_PACKS.map((pack) => (
                <div
                  key={pack.credits}
                  className={`border-2 rounded-lg p-3 text-center ${pack.highlight ? 'border-[var(--gold)]' : 'border-[var(--line)]'}`}
                >
                  {pack.highlight && (
                    <span className="text-[10px] font-medium bg-[var(--gold)] text-[var(--ink)] px-1.5 py-0.5 rounded-full">Best value</span>
                  )}
                  <p className="font-display text-base font-semibold mt-1">{pack.credits}</p>
                  <p className="font-display text-xl font-semibold">{pack.price}</p>
                  <p className="text-[11px] text-[var(--ink-soft)]">{pack.perCredit}</p>
                </div>
              ))}
            </div>
            <a
              href="mailto:popupspotlightinfo@gmail.com?subject=Buy bid credits"
              className="block text-center px-6 py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--gold)] text-[var(--ink)] hover:opacity-90"
            >
              Buy bid credits
            </a>
            <p className="text-xs text-[var(--ink-soft)] mt-3 text-center">
              Posting and bidding often? The{' '}
              <a href="https://buy.stripe.com/6oU8wRckR9IA9kB8ifcAo00" target="_blank" rel="noopener noreferrer" className="underline">
                $79/mo bundle
              </a>{' '}
              includes 5 free bid credits every month.
            </p>
            <a
              href={`mailto:popupspotlightinfo@gmail.com?subject=${encodeURIComponent(
                `Bid on event: ${event.event_type || 'Event'} (${event.id})`
              )}&body=${encodeURIComponent(
                'Include your proposal, price quote, and business name. We\'ll confirm your credit balance (or take payment) and get your bid live.'
              )}`}
              className="mt-4 block text-center px-6 py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:opacity-90"
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
