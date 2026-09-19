'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { createWorkerProfile } from '@/lib/actions'
import Link from 'next/link'

const initialState: { error?: string; success?: boolean; workerId?: string } = {}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 disabled:opacity-50"
    >
      {pending ? 'Creating…' : 'Create my profile'}
    </button>
  )
}

export default function WorkerSignupForm() {
  const [state, formAction] = useFormState(createWorkerProfile, initialState)

  if (state.success) {
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
    <form action={formAction} className="border-2 border-[var(--ink)] rounded-xl p-6 bg-white space-y-3">
      <div>
        <label className="text-xs text-[var(--ink-soft)]">Name</label>
        <input name="name" required className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1" />
      </div>
      <div>
        <label className="text-xs text-[var(--ink-soft)]">Email</label>
        <input name="email" type="email" required className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1" />
      </div>
      <div>
        <label className="text-xs text-[var(--ink-soft)]">Phone (optional)</label>
        <input name="phone" className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1" />
      </div>
      <div>
        <label className="text-xs text-[var(--ink-soft)]">Skills (comma separated)</label>
        <input
          name="skills"
          placeholder="hat shaping, retail sales, food service, customer service"
          className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1"
        />
      </div>
      <div>
        <label className="text-xs text-[var(--ink-soft)]">Tell businesses about yourself</label>
        <textarea
          name="bio"
          placeholder="Your experience, availability, what makes you a great hire for a pop-up shift"
          className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1 min-h-[100px]"
        />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton />
    </form>
  )
}
