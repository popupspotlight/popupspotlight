'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const COPY = {
  business: {
    title: 'Sign up as a business.',
    subtitle: 'List your pop-up, post jobs, and bid on events.',
    afterConfirm: 'Click the link, then come back and log in. Email us to get your business listed.',
  },
  worker: {
    title: 'Sign up to find work.',
    subtitle: 'Create a FREE talent profile and apply to pop-up shifts near you.',
    afterConfirm: "Click the link, then come back and log in — you'll be able to create your talent profile right away.",
  },
}

export default function SignupForm() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') === 'worker' ? 'worker' : 'business'
  const copy = COPY[role]
  const next = role === 'worker' ? '/workers/new' : '/account'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({ email, password })

    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <main className="max-w-md mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Check your email.</h1>
        <p className="text-[var(--ink-soft)] mt-3">
          We sent a confirmation link to <strong>{email}</strong>. {copy.afterConfirm}
        </p>
      </main>
    )
  }

  return (
    <main className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl font-semibold tracking-tight">{copy.title}</h1>
      <p className="mt-2 text-[var(--ink-soft)]">{copy.subtitle}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-3">
        <div>
          <label className="text-xs text-[var(--ink-soft)]">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--ink-soft)]">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Creating account…' : 'Sign up'}
        </button>
      </form>

      <p className="text-sm text-[var(--ink-soft)] mt-4">
        Already have an account?{' '}
        <Link href={`/login?role=${role}${next !== '/account' ? `&next=${next}` : ''}`} className="underline">
          Log in
        </Link>
      </p>
      {role === 'business' ? (
        <p className="text-xs text-[var(--ink-soft)] mt-2">
          Looking for pop-up work instead?{' '}
          <Link href="/signup?role=worker" className="underline">Sign up as talent</Link>
        </p>
      ) : (
        <p className="text-xs text-[var(--ink-soft)] mt-2">
          Own a pop-up business?{' '}
          <Link href="/list-your-business" className="underline">List your business</Link>
        </p>
      )}
    </main>
  )
}
