'use client'

import { useState } from 'react'
import Link from 'next/link'
import AuthNav from './AuthNav'

const LINKS = [
  { href: '/', label: 'Discover' },
  { href: '/job-board', label: 'Job Board' },
  { href: '/events', label: 'Bid Events' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b-2 border-[var(--ink)] relative">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.png" alt="" className="h-12 w-auto" />
          <span className="font-display text-xl font-semibold tracking-tight">PopupSpotlight</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]">
              {link.label}
            </Link>
          ))}
          <AuthNav />
          <Link
            href="/list-your-business"
            className="text-sm font-medium bg-[var(--gold)] text-[var(--ink)] px-4 py-2 rounded-full hover:opacity-90 border-2 border-[var(--ink)]"
          >
            Claim Your Spot
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="sm:hidden flex flex-col gap-1.5 p-2"
        >
          <span className={`block w-6 h-0.5 bg-[var(--ink)] transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block w-6 h-0.5 bg-[var(--ink)] transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-[var(--ink)] transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <nav className="sm:hidden border-t-2 border-[var(--ink)] bg-[var(--paper)] px-6 py-4 flex flex-col gap-4">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-base text-[var(--ink)]"
            >
              {link.label}
            </Link>
          ))}
          <div onClick={() => setOpen(false)}>
            <AuthNav />
          </div>
          <Link
            href="/list-your-business"
            onClick={() => setOpen(false)}
            className="text-sm font-medium bg-[var(--gold)] text-[var(--ink)] px-4 py-2.5 rounded-full hover:opacity-90 border-2 border-[var(--ink)] text-center"
          >
            Claim Your Spot
          </Link>
        </nav>
      )}
    </header>
  )
}
