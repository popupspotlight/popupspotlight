import Link from 'next/link'

export default function JobBoardLandingPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight max-w-2xl">
        The job board for pop-ups.
      </h1>
      <p className="mt-4 text-lg text-[var(--ink-soft)] max-w-xl">
        Short-term shifts at pop-up businesses across the country — hat bars, jewelry
        pop-ups, food trucks, mobile beauty, and more.
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-[var(--ink)] rounded-xl p-7 bg-white flex flex-col">
          <span
            className="self-start text-xs font-medium px-2.5 py-1 rounded-full mb-4"
            style={{ background: '#DDEEE8', color: '#1D4A3E' }}
          >
            For workers
          </span>
          <h2 className="font-display text-xl font-semibold">
            Hat shaper, retail pro, or server?
          </h2>
          <p className="text-sm text-[var(--ink-soft)] mt-3 flex-1">
            Create a free profile, highlight your experience, and apply to pop-up shifts
            in your area — or wherever you're willing to travel.
          </p>
          <Link
            href="/workers/new"
            className="mt-6 text-center py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:opacity-90"
          >
            Create your profile
          </Link>
        </div>

        <div className="border-2 border-[var(--ink)] rounded-xl p-7 bg-white flex flex-col">
          <span
            className="self-start text-xs font-medium px-2.5 py-1 rounded-full mb-4"
            style={{ background: '#FBE7DB', color: '#7A2E0E' }}
          >
            For businesses
          </span>
          <h2 className="font-display text-xl font-semibold">Need more hands on deck?</h2>
          <p className="text-sm text-[var(--ink-soft)] mt-3 flex-1">
            List your business to unlock job posting — post a shift, review applicants,
            and interview candidates directly.
          </p>
          <Link
            href="/list-your-business"
            className="mt-6 text-center py-2.5 rounded-full font-medium border-2 border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
          >
            List your business
          </Link>
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link href="/jobs" className="text-sm text-[var(--ink-soft)] hover:underline">
          Already have a profile? Browse open jobs →
        </Link>
      </div>
    </main>
  )
}
