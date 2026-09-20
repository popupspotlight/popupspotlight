import Link from 'next/link'
import AuthNav from './AuthNav'

export default function Navbar() {
  return (
    <header className="border-b-2 border-[var(--ink)]">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight">
          PopupSpotlight
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]">
            Discover
          </Link>
          <Link href="/job-board" className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]">
            Job Board
          </Link>
          <Link href="/events" className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]">
            Bid Events
          </Link>
          <AuthNav />
          <Link
            href="/list-your-business"
            className="text-sm font-medium bg-[var(--ink)] text-[var(--paper)] px-4 py-2 rounded-full hover:opacity-90"
          >
            List your business
          </Link>
        </nav>
      </div>
    </header>
  )
}
