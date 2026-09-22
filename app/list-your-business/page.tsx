'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CATEGORY_META, Category } from '@/lib/categories'

const PILLARS = [
  {
    title: 'The Directory',
    description: 'A real profile — photos, your story, and reviews from real customers — that shows up when people search by zip code, anywhere in the country. It\'s how people find you when they\'re planning something and don\'t know who to book yet.',
  },
  {
    title: 'The Job Board',
    description: 'Need an extra set of hands for a busy weekend? Post the shift and gig workers apply directly to you. You see every applicant and decide who to hire — no algorithm making that call for you.',
  },
  {
    title: 'Bid Events',
    description: 'People post real events here — birthdays, weddings, corporate parties — and businesses like yours submit a proposal to win the booking. A direct line to customers actively looking to book someone right now.',
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

const STEPS = ['You', 'Business', 'Location', 'Your story']

function LeadForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const categories = Object.keys(CATEGORY_META) as Category[]

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    business_name: '',
    category: '',
    years_in_business: '',
    city: '',
    state: '',
    zip: '',
    description: '',
  })

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function stepValid() {
    if (step === 0) return form.name.trim() && form.email.trim()
    if (step === 1) return form.business_name.trim() && form.category
    if (step === 2) return form.city.trim() && form.state.trim() && form.zip.trim()
    return true
  }

  async function handleSubmit() {
    setLoading(true)
    setError(null)

    const { error } = await supabase.from('leads').insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      business_name: form.business_name,
      category: form.category || null,
      years_in_business: form.years_in_business || null,
      city: form.city || null,
      state: form.state || null,
      zip: form.zip || null,
      description: form.description || null,
    })

    setLoading(false)
    if (error) {
      console.error(error)
      setError('Something went wrong. Please try again.')
      return
    }
    onSubmitted()
  }

  const inputClass = 'w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1'

  return (
    <div className="border-2 border-[var(--ink)] rounded-xl p-6 bg-white max-w-lg">
      <div className="flex items-center gap-2 mb-5">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1">
            <div className={`h-1.5 rounded-full ${i <= step ? 'bg-[var(--gold)]' : 'bg-[var(--line)]'}`} />
          </div>
        ))}
      </div>
      <p className="text-xs text-[var(--ink-soft)] mb-4">
        Step {step + 1} of {STEPS.length} — {STEPS[step]}
      </p>

      {step === 0 && (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--ink-soft)]">Your name</label>
            <input value={form.name} onChange={(e) => update('name', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-[var(--ink-soft)]">Email</label>
            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-[var(--ink-soft)]">Phone</label>
            <input value={form.phone} onChange={(e) => update('phone', e.target.value)} className={inputClass} />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--ink-soft)]">Business name</label>
            <input value={form.business_name} onChange={(e) => update('business_name', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-[var(--ink-soft)]">What kind of pop-up?</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)} className={`${inputClass} bg-white`}>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={CATEGORY_META[cat].label}>{CATEGORY_META[cat].label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--ink-soft)]">How long have you been in business?</label>
            <select value={form.years_in_business} onChange={(e) => update('years_in_business', e.target.value)} className={`${inputClass} bg-white`}>
              <option value="">Select one</option>
              <option value="Just starting out">Just starting out</option>
              <option value="Less than 1 year">Less than 1 year</option>
              <option value="1-2 years">1-2 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <p className="text-xs text-[var(--ink-soft)]">
            Your home base — this is how customers searching by zip code will find you.
          </p>
          <div>
            <label className="text-xs text-[var(--ink-soft)]">City</label>
            <input value={form.city} onChange={(e) => update('city', e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[var(--ink-soft)]">State</label>
              <input value={form.state} onChange={(e) => update('state', e.target.value)} maxLength={2} placeholder="CO" className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-[var(--ink-soft)]">Zip code</label>
              <input value={form.zip} onChange={(e) => update('zip', e.target.value)} pattern="[0-9]{5}" maxLength={5} className={inputClass} />
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--ink-soft)]">Tell customers what makes your pop-up special</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="What you offer, what makes you different, the experience customers can expect"
              className={`${inputClass} min-h-[110px]`}
            />
            <p className="text-xs text-[var(--ink-soft)] mt-1">This becomes your public listing description.</p>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="px-5 py-2.5 rounded-full font-medium border-2 border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
          >
            Back
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => stepValid() && setStep((s) => s + 1)}
            disabled={!stepValid()}
            className="flex-1 py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--gold)] text-[var(--ink)] hover:opacity-90 disabled:opacity-40"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--gold)] text-[var(--ink)] hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Submitting…' : 'List my business free'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function ListYourBusinessPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight max-w-2xl">
        List your pop-up business — free.
      </h1>
      <p className="mt-4 text-lg text-[var(--ink-soft)] max-w-xl">
        Get discovered by people planning private and corporate events, hire gig talent
        when you need extra hands, and win new bookings by bidding directly on events
        people post. Your listing costs nothing — you only pay for the extras you
        actually use.
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {PILLARS.map((p) => (
          <div key={p.title} className="border-2 border-[var(--line)] rounded-xl p-5 bg-white">
            <h2 className="font-display text-base font-semibold">{p.title}</h2>
            <p className="text-sm text-[var(--ink-soft)] mt-2">{p.description}</p>
          </div>
        ))}
      </div>

      {!unlocked ? (
        <div className="mt-10">
          <h2 className="font-display text-lg font-semibold mb-1">Step 1: list for free</h2>
          <p className="text-sm text-[var(--ink-soft)] mb-4">
            Takes less than a minute. No credit card, no commitment.
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
            <h2 className="font-display text-xl font-semibold">Confirm your free listing</h2>
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

          <div>
            <h2 className="font-display text-2xl font-semibold">Once you're listed</h2>
            <p className="text-[var(--ink-soft)] mt-2 max-w-xl">
              Here's how PopupSpotlight can help you find talent and win more bookings —
              all optional, and you only pay if and when you actually use them.
            </p>
          </div>

          <div className="relative border-2 border-[var(--ink)] rounded-xl p-6 bg-white max-w-lg">
            <span className="absolute -top-3 left-6 text-xs font-medium bg-[var(--gold)] text-[var(--ink)] px-2.5 py-1 rounded-full">
              Optional
            </span>
            <h3 className="font-display text-xl font-semibold">Monthly bundle</h3>
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
            <h3 className="font-display text-xl font-semibold">Bid credits</h3>
            <p className="text-sm text-[var(--ink-soft)] mt-1 mb-5">
              Businesses post events, you submit proposals to win the booking. 1 credit =
              1 bid. Buy in bulk to save.
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
            <h3 className="font-display text-xl font-semibold">Job posts</h3>
            <p className="text-sm text-[var(--ink-soft)] mt-1 mb-5">
              Need extra hands for a shift? Post it to the Job Board and gig workers
              apply directly to you. Pay per post, priced by how long and how many
              people you need.
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
