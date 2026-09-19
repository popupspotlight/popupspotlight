import { supabase, JobPost, PopupBusiness } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ApplyForm from './ApplyForm'

function formatShift(start: string | null, end: string | null) {
  if (!start) return null
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }
  const startStr = new Date(start).toLocaleString('en-US', opts)
  if (!end) return startStr
  const endStr = new Date(end).toLocaleString('en-US', opts)
  return `${startStr} – ${endStr}`
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const { data: job } = await supabase
    .from('job_posts')
    .select('*, popup_businesses(id, name, category)')
    .eq('id', params.id)
    .single()

  if (!job) notFound()

  const j = job as JobPost & { popup_businesses: PopupBusiness }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <Link href={`/business/${j.popup_businesses.id}`} className="text-sm text-[var(--ink-soft)] hover:underline">
        {j.popup_businesses.name}
      </Link>
      <h1 className="font-display text-3xl font-semibold tracking-tight mt-2">{j.title}</h1>

      <div className="flex gap-4 mt-3 text-sm text-[var(--ink-soft)]">
        {j.pay_rate && <span className="font-medium text-[var(--ink)]">{j.pay_rate}</span>}
        {formatShift(j.shift_start, j.shift_end) && <span>{formatShift(j.shift_start, j.shift_end)}</span>}
        <span>{j.workers_needed} {j.workers_needed === 1 ? 'worker' : 'workers'} needed</span>
      </div>

      {j.description && (
        <p className="mt-6 text-[var(--ink-soft)] leading-relaxed">{j.description}</p>
      )}

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold mb-4">Apply</h2>
        <ApplyForm jobPostId={j.id} />
      </div>
    </main>
  )
}

export const revalidate = 30
