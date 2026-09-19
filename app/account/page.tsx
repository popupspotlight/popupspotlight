'use client'

import { useEffect, useState } from 'react'
import { supabase, WorkerProfile } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Session } from '@supabase/supabase-js'

export default function AccountPage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [worker, setWorker] = useState<WorkerProfile | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.push('/login')
        return
      }
      setSession(data.session)

      const { data: workerData } = await supabase
        .from('worker_profiles')
        .select('*')
        .eq('user_id', data.session.user.id)
        .maybeSingle()

      setWorker(workerData)
      setLoaded(true)
    })
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (!loaded) return null

  return (
    <main className="max-w-xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Your account</h1>
      <p className="text-[var(--ink-soft)] mt-2">{session?.user.email}</p>

      <div className="mt-10 border-2 border-[var(--ink)] rounded-xl p-6 bg-white">
        <h2 className="font-display text-lg font-semibold">Worker profile</h2>
        {worker ? (
          <>
            <p className="text-sm text-[var(--ink-soft)] mt-2">
              You're set up as <strong>{worker.name}</strong>. Ready to apply to jobs.
            </p>
            <Link href="/jobs" className="text-sm underline mt-3 inline-block">
              Browse open jobs →
            </Link>
          </>
        ) : (
          <>
            <p className="text-sm text-[var(--ink-soft)] mt-2">
              No worker profile yet — create one to apply to jobs, even if you also own a
              business.
            </p>
            <Link
              href="/workers/new"
              className="mt-4 inline-block px-5 py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:opacity-90"
            >
              Create worker profile
            </Link>
          </>
        )}
      </div>

      <div className="mt-6 border-2 border-[var(--ink)] rounded-xl p-6 bg-white">
        <h2 className="font-display text-lg font-semibold">Business listing</h2>
        <p className="text-sm text-[var(--ink-soft)] mt-2">
          Business listings are still set up manually while we build self-serve editing.
          Email us if you need changes to yours.
        </p>
        <a
          href="mailto:popupspotlightinfo@gmail.com"
          className="text-sm underline mt-3 inline-block"
        >
          popupspotlightinfo@gmail.com
        </a>
      </div>

      <button onClick={handleLogout} className="mt-8 text-sm text-[var(--ink-soft)] underline">
        Log out
      </button>
    </main>
  )
}
