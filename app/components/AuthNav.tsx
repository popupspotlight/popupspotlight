'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

export default function AuthNav() {
  const [session, setSession] = useState<Session | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoaded(true)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (!loaded) return null

  if (session) {
    return (
      <Link href="/account" className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]">
        Account
      </Link>
    )
  }

  return (
    <Link href="/login?role=business" className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]">
      Log in
    </Link>
  )
}
