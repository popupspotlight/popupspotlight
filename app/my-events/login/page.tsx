'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function MyEventsLoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })
    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <main className="max-w-md mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Check your email.</h1>
        <p className="text-[var(--ink-soft)] mt-3">
          We sent a login link to <strong>{email}</strong>. Click it to see your events
          and bids — no password needed.
        </p>
      </main>
    )
  }

  return (
    <main className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Track your event.</h1>
      <p className="mt-2 text-[var(--ink-soft)]">
        Enter the email you used to post your event and we'll send you a link — no
        password to remember.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Sending…' : 'Send login link'}
        </button>
      </form>
    </main>
  )
}
