'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function WorkerSignupForm() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [skills, setSkills] = useState('')
  const [bio, setBio] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/login?next=/workers/new')
        return
      }
      setUserId(data.session.user.id)
      setChecked(true)
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    setLoading(true)
    setError(null)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase.from('worker_profiles').insert({
      user_id: userId,
      name,
      email: user?.email ?? '',
      phone: phone || null,
      bio: bio || null,
      skills: skills || null,
    })

    setLoading(false)
    if (error) {
      setError(error.message.includes('duplicate') ? 'You already have a worker profile.' : error.message)
      return
    }
    setSuccess(true)
  }

  if (!checked) return null

  if (success) {
    return (
      <div className="border-2 border-[var(--ink)] rounded-xl p-6 bg-white text-center">
        <p className="font-medium">Profile created.</p>
        <p className="text-sm text-[var(--ink-soft)] mt-1 mb-4">
          You can now browse and apply to open shifts.
        </p>
        <Link
          href="/jobs"
          className="inline-block px-5 py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:opacity-90"
        >
          Browse open jobs
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="border-2 border-[var(--ink)] rounded-xl p-6 bg-white space-y-3">
      <div>
        <label className="text-xs text-[var(--ink-soft)]">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1"
        />
      </div>
      <div>
        <label className="text-xs text-[var(--ink-soft)]">Phone (optional)</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1"
        />
      </div>
      <div>
        <label className="text-xs text-[var(--ink-soft)]">Skills (comma separated)</label>
        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="hat shaping, retail sales, food service, customer service"
          className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1"
        />
      </div>
      <div>
        <label className="text-xs text-[var(--ink-soft)]">Tell businesses about yourself</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Your experience, availability, what makes you a great hire for a pop-up shift"
          className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1 min-h-[100px]"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Creating…' : 'Create my profile'}
      </button>
    </form>
  )
}
