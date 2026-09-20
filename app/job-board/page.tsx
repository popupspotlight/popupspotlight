'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Access = 'checking' | 'guest' | 'granted'

export default function JobBoardPage() {
  const [access, setAccess] = useState<Access>('checking')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        setAccess('guest')
        return
      }
      const { data: paidBusiness } = await supabase
        .from('popup_businesses')
        .select('id')
        .eq('owner_id', data.session.user.id)
        .in('tier', ['featured', 'spotlighted'])
        .eq('status', 'active')
        .limit(1)
        .maybeSingle()

      setAccess(paidBusiness ? 'granted' : 'guest')
    })
  }, [])

  if (access === 'checking') return null

  if (access === 'granted') {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Job Board</h1>
        <p className="mt-3 text-[var(--ink-soft)]">
          Post a shift, browse who's applied, and check the events board for
          collaboration opportunities.
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/post-a-job" className="border-2 border-[var(--ink)] rounded-xl p-6 bg-white hover:-translate-y-0.5 transition-transform">
            <h2 className="font-display text-lg font-semibold">Post a job</h2>
            <p className="text-sm text-[var(--ink-soft)] mt-2">Find gig workers for your next pop-up.</p>
          </Link>
          <Link href="/jobs" className="border-2 border-[var(--ink)] rounded-xl p-6 bg-white hover:-translate-y-0.5 transition-transform">
            <h2 className="font-display text-lg font-semibold">Browse open shifts</h2>
            <p className="text-sm text-[var(--ink-soft)] mt-2">See what's posted across the platform.</p>
          </Link>
          <Link href="/events" className="border-2 border-[var(--ink)] rounded-xl p-6 bg-white hover:-translate-y-0.5 transition-transform sm:col-span-2">
            <h2 className="font-display text-lg font-semibold">Bid on events</h2>
            <p className="text-sm text-[var(--ink-soft)] mt-2">Collaborate with other businesses by bidding on posted events.</p>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-center">
      <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
        Having trouble finding workers for your pop-up?
      </h1>
      <p className="mt-4 text-lg text-[var(--ink-soft)]">
        List your business to post jobs, find gig workers, and collaborate with other
        pop-up businesses on events.
      </p>
      <Link
        href="/list-your-business"
        className="mt-8 inline-block px-6 py-3 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:opacity-90"
      >
        List your business
      </Link>

      <div className="mt-14 pt-10 border-t border-[var(--line)]">
        <p className="text-sm text-[var(--ink-soft)]">
          Looking for pop-up work instead?
        </p>
        <Link href="/workers/new" className="text-sm underline mt-1 inline-block">
          Create your free worker profile →
        </Link>
      </div>
    </main>
  )
}
