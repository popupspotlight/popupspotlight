'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CATEGORY_META, Category } from '@/lib/categories'
import Link from 'next/link'

export default function PostEventForm() {
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const categories = Object.keys(CATEGORY_META) as Category[]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const { error } = await supabase.from('event_requests').insert({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || null,
      event_type: formData.get('event_type') || null,
      event_date: formData.get('event_date') || null,
      zip: formData.get('zip') || null,
      city: formData.get('city') || null,
      state: formData.get('state') || null,
      guest_count: formData.get('guest_count') ? Number(formData.get('guest_count')) : null,
      budget_range: formData.get('budget_range') || null,
      description: formData.get('description') || null,
    })

    setLoading(false)
    if (error) {
      console.error(error)
      setError('Could not submit your event. Please try again.')
      return
    }

    // Send a passwordless login link so they can come back and track bids
    // without a separate signup step.
    await supabase.auth.signInWithOtp({
      email: formData.get('email') as string,
      options: { shouldCreateUser: true },
    })

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="border-2 border-[var(--ink)] rounded-xl p-6 bg-white text-center">
        <p className="font-medium">Event posted.</p>
        <p className="text-sm text-[var(--ink-soft)] mt-1 mb-4">
          Businesses can now submit proposals — up to 5 per event, so you won't be
          overwhelmed. We've sent a login link to your email so you can come back and
          see bids anytime, no password needed.
        </p>
        <Link href="/" className="text-sm underline">Back to home</Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="border-2 border-[var(--ink)] rounded-xl p-6 bg-white space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--ink-soft)]">Your name</label>
          <input name="name" required className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-xs text-[var(--ink-soft)]">Email</label>
          <input name="email" type="email" required className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--ink-soft)]">Phone (optional)</label>
          <input name="phone" className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-xs text-[var(--ink-soft)]">What kind of pop-up?</label>
          <select name="event_type" className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1 bg-white">
            <option value="">Not sure / open to any</option>
            {categories.map((cat) => (
              <option key={cat} value={CATEGORY_META[cat].label}>{CATEGORY_META[cat].label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-[var(--ink-soft)]">Event date</label>
          <input name="event_date" type="date" className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-xs text-[var(--ink-soft)]">Zip code</label>
          <input name="zip" pattern="[0-9]{5}" maxLength={5} className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-xs text-[var(--ink-soft)]">Guest count</label>
          <input name="guest_count" type="number" min={1} className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--ink-soft)]">City</label>
          <input name="city" className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-xs text-[var(--ink-soft)]">State</label>
          <input name="state" maxLength={2} placeholder="CO" className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1" />
        </div>
      </div>
      <div>
        <label className="text-xs text-[var(--ink-soft)]">Budget range (optional)</label>
        <select name="budget_range" defaultValue="" className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1 bg-white">
          <option value="">Prefer not to say</option>
          <option value="Under $2,500">Under $2,500</option>
          <option value="$2,500 - $5,000">$2,500 - $5,000</option>
          <option value="$5,000 - $10,000">$5,000 - $10,000</option>
          <option value="$10,000+">$10,000+</option>
        </select>
      </div>
      <div>
        <label className="text-xs text-[var(--ink-soft)]">Tell businesses about your event</label>
        <textarea
          name="description"
          required
          placeholder="What are you celebrating, what are you hoping for, anything businesses should know"
          className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1 min-h-[100px]"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Posting…' : 'Post my event'}
      </button>
    </form>
  )
}
