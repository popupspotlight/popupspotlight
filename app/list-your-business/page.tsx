'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CATEGORY_META, Category } from '@/lib/categories'

const PILLARS = [
  {
    title: 'The Directory',
    description: 'A real profile — photos, reviews, and your story — searchable by zip code across the country. Free, full-featured, always.',
  },
  {
    title: 'The Job Board',
    description: 'Post shifts, find gig talent, no algorithm managing who you hire. You only pay when you post.',
  },
  {
    title: 'Bid Events',
    description: 'Private and corporate event requests posted directly by customers. You only pay when you bid.',
  },
]

const BID_CREDIT_PACKS = [
  { credits: '1 credit', price: '$20', perCredit: '$20 / bid' },
  { credits: '10 credits', price: '$170', perCredit: '$17 / bid — save 15%' },
  { credits: '25 credits', price: '$400', perCredit: '$16 / bid — save 20%' },
  { credits: '50 credits', price: '$650', perCredit: '$13 / bid — save 35%', highlight: true },
  { credits: '75 credits', price: '$900', perCredit: '$12 / bid — save 40%' },
  { credits: '100 credits', price: '$1,000', perCredit: '$10 / bid — save 50%' },
]

const JOB_POST_TIERS = [
  { name: 'Single shift', price: '$15', description: 'One worker, up to 3 days.' },
  { name: 'Full run', price: '$35', description: 'Up to 3 workers, up to 14 days.' },
  { name: 'Team build', price: '$60', description: 'Unlimited workers, up to 30 days.' },
]

function LeadForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const categories = Object.keys(CATEGORY_META) as Category[]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const { error } = await supabase.from('leads').insert({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || null,
      business_name: formData.get('business_name'),
      category: formData.get('category') || null,
    })

    setLoading(false)
    if (error) {
      console.error(error)
      setError('Something went wrong. Please try again.')
      return
    }
    onSubmitted()
  }

  return (
    <form onSubmit={handleSubmit} className="border-2 border-[var(--ink)] rounded-xl p-6 bg-white space-y-3 max-w-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--ink-soft)]">Your name</label>
          <input name="name" required className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-xs text-[var(--ink-soft)]">Business name</label>
          <input name="business_name" required className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--ink-soft)]">Email</label>
          <input name="email" type="email" required className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-xs text-[var(--ink-soft)]">Phone</label>
          <input name="phone" className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1" />
        </div>
      </div>
      <div>
        <label className="text-xs text-[var(--ink-soft)]">What kind of pop-up?</label>
        <select name="category" defaultValue="" className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1 bg-white">
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={CATEGORY_META[cat].label}>{CATEGORY_META[cat].label}</option>
          ))}
        </select>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--gold)] text-[var(--ink)] hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Submitting…' : 'Continue'}
      </button>
    </form>
  )
}

export default function ListYourBusinessPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight max-w-2xl">
        Free to list. Pay only for what you use.
      </h1>
      <p className="mt-4 text-lg text-[var(--ink-soft)] max-w-xl">
        No subscription required. Your listing is free forever — pay as you go, or save
        with an optional monthly bundle if you post and bid often.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {PILLARS.map((p) => (
          <div key={p.title} className="border-2 border-[var(--line)] rounded-xl p-5 bg-white">
            <h2 className="font-display text-base font-semibold">{p.title}</h2>
            <p className="text-sm text-[var(--ink-soft)] mt-2">{p.description}</p>
          </div>
        ))}
      </div>

      {!unlocked ? (
        <div className="mt-10">
          <p className="text-sm text-[var(--ink-soft)] mb-4">
            Tell us about your business to get your free listing started.
          </p>
          <LeadForm onSubmitted={() => setUnlocked(true)} />
        </div>
      ) : confirmed ? (
        <div className="mt-10 border-2 border-[var(--ink)] rounded-xl p-6 bg-white max-w-lg">
          <p className="font-medium">You're all set.</p>
          <p className="text-sm text-[var(--ink-soft)] mt-1">
            We'll get your free listing live within a day and follow up by email.
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          <div className="border-2 border-[var(--ink)] rounded-xl p-6 bg-white max-w-lg">
            <h2 className="font-display text-xl font-semibold">Your free listing</h2>
            <p className="text-sm text-[var(--ink-soft)] mt-2">
              Full profile with photos, description, and reviews — everything included,
              no cost, ever.
            </p>
            <button
              onClick={() => setConfirmed(true)}
              className="mt-5 w-full py-2.5 rounded-full font-medium border-2 border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
            >
              Get listed free
            </button>
          </div>

          <div className="relative border-2 border-[var(--ink)] rounded-xl p-6 bg-white max-w-lg">
            <span className="absolute -top-3 left-6 text-xs font-medium bg-[var(--gold)] text-[var(--ink)] px-2.5 py-1 rounded-full">
              Optional
            </span>
            <h2 className="font-display text-xl font-semibold">Monthly bundle</h2>
            <p className="mt-2">
              <span className="font-display text-3xl font-semibold">$79</span>
              <span className="text-[var(--ink-soft)]">/month</span>
            </p>
            <p className="text-sm text-[var(--ink-soft)] mt-2">
              If you're posting jobs or bidding on events regularly, this pays for itself.
              Included every month:
            </p>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li className="flex gap-2"><span className="text-[var(--ink-soft)]">—</span><span>1 free job post</span></li>
              <li className="flex gap-2"><span className="text-[var(--ink-soft)]">—</span><span>5 free bid credits</span></li>
              <li className="flex gap-2"><span className="text-[var(--ink-soft)]">—</span><span>Need more? Buy extra credits or posts at the pay-as-you-go rates below</span></li>
            </ul>
            <a
              href="https://buy.stripe.com/6oU8wRckR9IA9kB8ifcAo00"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 block text-center w-full py-2.5 rounded-full font-medium bg-[var(--gold)] text-[var(--ink)] border-2 border-[var(--ink)] hover:opacity-90"
            >
              Subscribe
            </a>
            <p className="text-xs text-[var(--ink-soft)] mt-2 text-center">Cancel any time. No effect on your free listing either way.</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold">Bid credits</h2>
            <p className="text-sm text-[var(--ink-soft)] mt-1 mb-5">
              1 credit = 1 bid on an event. Buy in bulk to save.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {BID_CREDIT_PACKS.map((pack) => (
                <div
                  key={pack.credits}
                  className={`border-2 rounded-xl p-4 text-center ${pack.highlight ? 'border-[var(--gold)] bg-white' : 'border-[var(--line)] bg-white'}`}
                >
                  {pack.highlight && (
                    <span className="text-xs font-medium bg-[var(--gold)] text-[var(--ink)] px-2 py-0.5 rounded-full">Best value</span>
                  )}
                  <p className="font-display text-lg font-semibold mt-2">{pack.credits}</p>
                  <p className="font-display text-2xl font-semibold mt-1">{pack.price}</p>
                  <p className="text-xs text-[var(--ink-soft)] mt-1">{pack.perCredit}</p>
                </div>
              ))}
            </div>
            <a
              href="mailto:popupspotlightinfo@gmail.com?subject=Buy bid credits"
              className="mt-5 inline-block px-6 py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--gold)] text-[var(--ink)] hover:opacity-90"
            >
              Buy bid credits
            </a>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold">Job posts</h2>
            <p className="text-sm text-[var(--ink-soft)] mt-1 mb-5">
              Pay per post, priced by how long and how many people you need.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {JOB_POST_TIERS.map((tier) => (
                <div key={tier.name} className="border-2 border-[var(--line)] rounded-xl p-4 bg-white">
                  <h3 className="font-display text-base font-semibold">{tier.name}</h3>
                  <p className="font-display text-2xl font-semibold mt-1">{tier.price}</p>
                  <p className="text-sm text-[var(--ink-soft)] mt-1">{tier.description}</p>
                </div>
              ))}
            </div>
            <a
              href="mailto:popupspotlightinfo@gmail.com?subject=Post a job"
              className="mt-5 inline-block px-6 py-2.5 rounded-full font-medium border-2 border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
            >
              Post a job
            </a>
          </div>
        </div>
      )}
    </main>
  )
}
