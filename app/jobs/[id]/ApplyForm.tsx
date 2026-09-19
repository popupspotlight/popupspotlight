'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { applyToJob } from '@/lib/actions'

const initialState: { error?: string; success?: boolean } = {}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 disabled:opacity-50"
    >
      {pending ? 'Submitting…' : 'Apply now'}
    </button>
  )
}

export default function ApplyForm({ jobPostId }: { jobPostId: string }) {
  const [state, formAction] = useFormState(applyToJob, initialState)

  if (state.success) {
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
    <form action={formAction} className="border-2 border-[var(--ink)] rounded-xl p-6 bg-white space-y-3">
      <input type="hidden" name="jobPostId" value={jobPostId} />
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
        <label className="text-xs text-[var(--ink-soft)]">Why you're a fit (optional)</label>
        <textarea name="message" className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 mt-1 min-h-[80px]" />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton />
    </form>
  )
}
