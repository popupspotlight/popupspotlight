'use client'

import { useEffect, useState } from 'react'
import { supabase, WorkerProfile, PopupBusiness } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Session } from '@supabase/supabase-js'
import { CATEGORY_META, Category } from '@/lib/categories'

export default function AccountPage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [worker, setWorker] = useState<WorkerProfile | null>(null)
  const [business, setBusiness] = useState<PopupBusiness | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.push('/login')
        return
      }
      setSession(data.session)

      const [{ data: workerData }, { data: businessData }] = await Promise.all([
        supabase.from('worker_profiles').select('*').eq('user_id', data.session.user.id).maybeSingle(),
        supabase.from('popup_businesses').select('*').eq('owner_id', data.session.user.id).maybeSingle(),
      ])

      setWorker(workerData)
      setBusiness(businessData)
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
        <h2 className="font-display text-lg font-semibold">Talent profile</h2>
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
              No talent profile yet — create one to apply to jobs, even if you also own a
              business.
            </p>
            <Link
              href="/workers/new"
              className="mt-4 inline-block px-5 py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:opacity-90"
            >
              Create talent profile
            </Link>
          </>
        )}
      </div>

      <div className="mt-6 border-2 border-[var(--ink)] rounded-xl p-6 bg-white">
        <h2 className="font-display text-lg font-semibold">Business listing</h2>
        {business ? (
          <>
            <div className="flex items-center justify-between mt-2">
              <p className="font-medium">{business.name}</p>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  background: CATEGORY_META[business.category as Category]?.bg,
                  color: CATEGORY_META[business.category as Category]?.text,
                }}
              >
                {CATEGORY_META[business.category as Category]?.label ?? business.category}
              </span>
            </div>
            <p className="text-xs text-[var(--ink-soft)] mt-1">
              Status: {business.status} · Plan: {business.tier}
            </p>
            <Link href={`/business/${business.id}`} className="text-sm underline mt-3 inline-block">
              View your public listing →
            </Link>
            <p className="text-xs text-[var(--ink-soft)] mt-4">
              Self-serve editing (photos, description) is coming soon. For now, email us
              for any changes.
            </p>
            <a
              href="mailto:popupspotlightinfo@gmail.com"
              className="text-sm underline mt-1 inline-block"
            >
              popupspotlightinfo@gmail.com
            </a>
          </>
        ) : (
          <>
            <p className="text-sm text-[var(--ink-soft)] mt-2">
              No business listed on this account yet.
            </p>
            <Link
              href="/list-your-business"
              className="mt-4 inline-block px-5 py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--gold)] text-[var(--ink)] hover:opacity-90"
            >
              Claim your spot
            </Link>
          </>
        )}
      </div>

      <button onClick={handleLogout} className="mt-8 text-sm text-[var(--ink-soft)] underline">
        Log out
      </button>
    </main>
  )
}
