import Link from 'next/link'
import { supabase, JobPost, PopupBusiness } from '@/lib/supabase'
import { CATEGORY_META, Category } from '@/lib/categories'

async function getJobs() {
  const { data, error } = await supabase
    .from('job_posts')
    .select('*, popup_businesses(id, name, category, tier)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }
  return (data ?? []) as (JobPost & { popup_businesses: PopupBusiness })[]
}

function formatShift(start: string | null, end: string | null) {
  if (!start) return null
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  const startStr = new Date(start).toLocaleDateString('en-US', opts)
  if (!end) return startStr
  const endStr = new Date(end).toLocaleDateString('en-US', opts)
  return startStr === endStr ? startStr : `${startStr} – ${endStr}`
}

export default async function JobsPage() {
  const jobs = await getJobs()

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-semibold tracking-tight">
        Work the pop-ups.
      </h1>
      <p className="mt-3 text-[var(--ink-soft)] max-w-xl">
        Shifts at hat bars, jewelry experiences, food & beverage pop-ups, mobile beauty,
        and kids party businesses around the country. Apply directly — no account needed
        to browse.
      </p>

      <div className="mt-10">
        {jobs.length === 0 ? (
          <div className="border-2 border-dashed border-[var(--line)] rounded-xl p-12 text-center text-[var(--ink-soft)]">
            No open shifts right now. Check back soon.
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const meta = CATEGORY_META[job.popup_businesses.category as Category]
              return (
                <Link
                  href={`/jobs/${job.id}`}
                  key={job.id}
                  className="block border-2 border-[var(--ink)] rounded-xl p-5 bg-white hover:-translate-y-0.5 transition-transform"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ background: meta?.bg, color: meta?.text }}
                    >
                      {job.popup_businesses.name}
                    </span>
                    {job.pay_rate && (
                      <span className="text-sm font-medium">{job.pay_rate}</span>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-semibold mt-3">{job.title}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-[var(--ink-soft)]">
                    {formatShift(job.shift_start, job.shift_end) && (
                      <span>{formatShift(job.shift_start, job.shift_end)}</span>
                    )}
                    <span>
                      {job.workers_needed} {job.workers_needed === 1 ? 'person' : 'people'} needed
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

export const revalidate = 60
