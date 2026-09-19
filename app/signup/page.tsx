'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
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
          We sent a confirmation link to <strong>{email}</strong>. Click it, then come back
          and log in.
        </p>
      </main>
    )
  }

  return (
    <main className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Create your account.</h1>
      <p className="mt-2 text-[var(--ink-soft)]">
        One account for everything — list a business, apply to jobs, or both.
      </p>

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
        Already have an account? <Link href="/login" className="underline">Log in</Link>
      </p>
    </main>
  )
}
