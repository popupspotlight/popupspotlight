'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
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

  return (
    <main className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Log in.</h1>

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

      <p className="text-sm text-[var(--ink-soft)] mt-4">
        No account yet? <Link href="/signup" className="underline">Sign up</Link>
      </p>
    </main>
  )
}
