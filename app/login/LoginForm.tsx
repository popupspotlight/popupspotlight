'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const TITLES: Record<string, string> = {
  business: 'Log in as a business.',
  worker: 'Log in as talent.',
}

function RoleChooser() {
  return (
    <main className="max-w-md mx-auto px-6 py-20 text-center">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Log in.</h1>
      <p className="mt-2 text-[var(--ink-soft)]">Choose how you're using PopupSpotlight.</p>

      <div className="mt-8 space-y-3">
        <Link
          href="/login?role=business"
          className="block px-6 py-3 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:opacity-90"
        >
          Log in as a business
        </Link>
        <Link
          href="/login?role=worker"
          className="block px-6 py-3 rounded-full font-medium border-2 border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
        >
          Log in as talent
        </Link>
        <Link
          href="/my-events/login"
          className="block px-6 py-3 rounded-full font-medium border-2 border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
        >
          Track my event
        </Link>
      </div>
    </main>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role')
  const next = searchParams.get('next') || '/account'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    router.push(next)
    router.refresh()
  }

  if (!roleParam) return <RoleChooser />

  const role = roleParam === 'worker' ? 'worker' : 'business'

  return (
    <main className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl font-semibold tracking-tight">{TITLES[role]}</h1>

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
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      {role === 'business' ? (
        <p className="text-sm text-[var(--ink-soft)] mt-4">
          No account yet? <Link href="/list-your-business" className="underline">Claim your spot</Link>
        </p>
      ) : (
        <p className="text-sm text-[var(--ink-soft)] mt-4">
          No account yet? <Link href="/signup?role=worker" className="underline">Sign up</Link>
        </p>
      )}
      {role === 'business' ? (
        <p className="text-xs text-[var(--ink-soft)] mt-2">
          <Link href="/login?role=worker" className="underline">Log in as talent instead</Link>
        </p>
      ) : (
        <p className="text-xs text-[var(--ink-soft)] mt-2">
          <Link href="/login?role=business" className="underline">Log in as a business instead</Link>
        </p>
      )}
      <p className="text-xs text-[var(--ink-soft)] mt-4">
        <Link href="/login" className="underline">← Back to all login options</Link>
      </p>
    </main>
  )
}
