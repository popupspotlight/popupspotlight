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

const STEPS = ['Business', 'Your story', 'Location', 'You']

function LeadForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const categories = Object.keys(CATEGORY_META) as Category[]

  const [form, setForm] = useState({
    business_name: '',
    category: '',
    years_in_business: '',
    description: '',
    city: '',
    state: '',
    zip: '',
    name: '',
    email: '',
    phone: '',
  })

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function stepValid() {
    if (step === 0) return form.business_name.trim() && form.category
    if (step === 1) return true
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
    <div className="border-2 border-[var(--ink)] rounded-xl p-6 bg-white max-w-lg mx-auto text-left">
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

      {step === 1 && (
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
            {loading ? 'Submitting…' : 'Claim My Spot'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function ListYourBusinessPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-center">
      <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
        Claim Your Spot
      </h1>
      <p className="mt-3 text-[var(--ink-soft)]">
        Free to list — takes less than a minute.
      </p>

      <div className="mt-8">
        {!submitted ? (
          <LeadForm onSubmitted={() => setSubmitted(true)} />
        ) : (
          <div className="border-2 border-[var(--ink)] rounded-xl p-6 bg-white max-w-lg mx-auto text-left">
            <p className="font-medium">You're all set.</p>
            <p className="text-sm text-[var(--ink-soft)] mt-1">
              We'll get your free listing live within a day and follow up by email. Once
              you're listed, you can post jobs and bid on events any time — we'll walk you
              through pricing right when you're ready to use them.
            </p>
          </div>
        )}
      </div>

      <div className="mt-16 text-left">
        <p className="text-lg text-[var(--ink-soft)] max-w-xl mx-auto text-center">
          Get discovered by people planning private and corporate events, hire gig talent
          when you need extra hands, and win new bookings by bidding directly on events
          people post.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PILLARS.map((p) => (
            <div key={p.title} className="border-2 border-[var(--line)] rounded-xl p-5 bg-white">
              <h2 className="font-display text-base font-semibold">{p.title}</h2>
              <p className="text-sm text-[var(--ink-soft)] mt-2">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
