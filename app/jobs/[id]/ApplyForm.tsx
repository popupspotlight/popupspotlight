'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ApplyForm({ jobPostId }: { jobPostId: string }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const [workerId, setWorkerId] = useState<string | null>(null)
  const [needsProfile, setNeedsProfile] = useState(false)
  const [needsLogin, setNeedsLogin] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        setNeedsLogin(true)
        setChecked(true)
        return
      }
      const { data: worker } = await supabase
        .from('worker_profiles')
        .select('id')
        .eq('user_id', data.session.user.id)
        .maybeSingle()

      if (!worker) {
        setNeedsProfile(true)
      } else {
        setWorkerId(worker.id)
      }
      setChecked(true)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!workerId) return
    setLoading(true)
    setError(null)

    const { error } = await supabase
      .from('job_applications')
      .insert({ job_post_id: jobPostId, worker_id: workerId, message: message || null })

    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setSuccess(true)
  }

  if (!checked) return null

  if (needsLogin) {
    return (
      <div className="border-2 border-[var(--ink)] rounded-xl p-6 bg-white">
        <p className="text-sm text-[var(--ink-soft)] mb-3">Log in to apply to this job.</p>
        <Link
          href={`/login?role=worker&next=/jobs/${jobPostId}`}
          className="inline-block px-5 py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:opacity-90"
        >
          Log in
        </Link>
      </div>
    )
  }

  if (needsProfile) {
    return (
      <div className="border-2 border-[var(--ink)] rounded-xl p-6 bg-white">
        <p className="text-sm text-[var(--ink-soft)] mb-3">
          Create a worker profile first — it only takes a minute.
        </p>
        <Link
          href="/workers/new"
          className="inline-block px-5 py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:opacity-90"
        >
          Create worker profile
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="border-2 border-[var(--ink)] rounded-xl p-6 bg-white">
        <p className="font-medium">Application sent.</p>
        <p className="text-sm text-[var(--ink-soft)] mt-1">
          The business will reach out directly if it's a fit.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="border-2 border-[var(--ink)] rounded-xl p-6 bg-white space-y-3">
      <div>
        <label className="text-xs text-[var(--ink-soft)]">Why you're a fit (optional)</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1 min-h-[80px]"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Submitting…' : 'Apply now'}
      </button>
    </form>
  )
}
