import Link from 'next/link'
import { CATEGORY_META, Category } from '@/lib/categories'

function CategoryIcon({ category, color }: { category: Category; color: string }) {
  const common = { width: 28, height: 28, viewBox: '0 0 32 32', fill: color }
  switch (category) {
    case 'hat_bar':
      return (
        <svg {...common}>
          <path d="M6 20 Q6 8 16 8 Q26 8 26 20 Z" />
          <rect x="2" y="20" width="28" height="4" rx="2" />
        </svg>
      )
    case 'jewelry':
      return (
        <svg {...common}>
          <path d="M16 3 L28 13 L16 29 L4 13 Z" />
        </svg>
      )
    case 'food_bev':
      return (
        <svg {...common}>
          <rect x="8" y="11" width="16" height="18" rx="3" />
          <rect x="14.5" y="2" width="3" height="10" rx="1.5" />
        </svg>
      )
    case 'beauty':
      return (
        <svg {...common}>
          <path d="M16 2 L19 13 L30 16 L19 19 L16 30 L13 19 L2 16 L13 13 Z" />
        </svg>
      )
    case 'kids_parties':
      return (
        <svg {...common}>
          <ellipse cx="16" cy="12" rx="10" ry="12" />
          <path d="M13 24 L19 24 L16 29 Z" />
          <line x1="16" y1="24" x2="16" y2="24" stroke={color} strokeWidth="2" />
        </svg>
      )
  }
}

export default function HomePage() {
  const categories = Object.keys(CATEGORY_META) as Category[]

  return (
    <main className="max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
      <h1 className="font-display text-[clamp(1.1rem,4.2vw,4rem)] font-semibold tracking-tight leading-[1.05] whitespace-nowrap">
        Book a pop-up for your next event
      </h1>
      <p className="mt-4 text-lg text-[var(--ink-soft)]">
        For your private or corporate event, anywhere in the country.
      </p>

      <div className="mt-7 flex flex-wrap justify-center gap-x-7 gap-y-4">
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat]
          return (
            <div key={cat} className="flex flex-col items-center gap-1.5 w-20">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-[var(--ink)]"
                style={{ background: meta.bg }}
              >
                <CategoryIcon category={cat} color={meta.accent} />
              </div>
              <span className="text-xs text-[var(--ink-soft)] leading-tight">{meta.label}</span>
            </div>
          )
        })}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <div className="relative border-2 border-[var(--ink)] rounded-xl bg-white flex flex-col overflow-hidden min-h-[280px]">
          <div className="h-2" style={{ background: 'linear-gradient(90deg, #FFC94D, #F2941C, #E4482B)' }} />
          <div className="p-6 flex-1 flex flex-col">
            <h2 className="font-display text-xl font-semibold">Post your event</h2>
            <p className="text-sm text-[var(--ink-soft)] mt-2 flex-1">
              Not sure who to book? Describe your event and let pop-up businesses come to
              you with proposals — capped at 5 bids, so you won't be overwhelmed.
            </p>
            <Link
              href="/post-an-event"
              className="text-center px-5 py-2.5 rounded-full font-medium bg-[var(--gold)] text-[var(--ink)] border-2 border-[var(--ink)] hover:opacity-90"
            >
              Post your event
            </Link>
            <Link href="/my-events/login" className="text-center mt-3 text-xs text-[var(--ink-soft)] hover:underline">
              Already posted? Track your event →
            </Link>
          </div>
        </div>

        <div className="border-2 border-[var(--ink)] rounded-xl bg-white flex flex-col overflow-hidden min-h-[280px]">
          <div className="h-2 bg-[var(--ink)]" />
          <div className="p-6 flex-1 flex flex-col">
            <h2 className="font-display text-xl font-semibold">Search the directory</h2>
            <p className="text-sm text-[var(--ink-soft)] mt-2">
              Know what you're looking for? Search by zip code to find and book pop-ups
              near you.
            </p>
            <form method="get" action="/search" className="mt-5 space-y-3">
              <input
                name="zip"
                required
                pattern="[0-9]{5}"
                maxLength={5}
                placeholder="Zip code"
                className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2"
              />
              <select
                name="category"
                defaultValue=""
                className="w-full border-2 border-[var(--line)] rounded-lg px-3 py-2 bg-white"
              >
                <option value="">All categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_META[cat].label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full py-2.5 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:opacity-90"
              >
                Search
              </button>
            </form>
            <p className="mt-2 text-xs text-[var(--ink-soft)]">Shows results within 60 miles.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
