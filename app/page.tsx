import Link from 'next/link'
import { CATEGORY_META, Category } from '@/lib/categories'

export default function HomePage() {
  const categories = Object.keys(CATEGORY_META) as Category[]

  return (
    <main className="max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
      <h1 className="font-display text-[clamp(1.5rem,4.2vw,4rem)] font-semibold tracking-tight leading-[1.05] whitespace-nowrap">
        Book a pop-up for your next event
      </h1>
      <p className="mt-5 text-lg text-[var(--ink-soft)] max-w-lg mx-auto">
        Hat Bars, Jewelry Experiences, Food & Beverage, Mobile Beauty, and Kids Parties &
        Entertainment — for your private or corporate event, anywhere in the country.
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <div className="border-2 border-[var(--ink)] rounded-xl p-6 bg-[var(--ink)] text-[var(--paper)] flex flex-col">
          <h2 className="font-display text-xl font-semibold">Post your event</h2>
          <p className="text-sm opacity-80 mt-2 flex-1">
            Not sure who to book? Describe your event and let pop-up businesses come to
            you with proposals — capped at 5 bids, so you won't be overwhelmed.
          </p>
          <Link
            href="/post-an-event"
            className="mt-5 text-center px-5 py-2.5 rounded-full font-medium bg-[var(--paper)] text-[var(--ink)] hover:opacity-90"
          >
            Post your event
          </Link>
          <Link href="/my-events/login" className="text-center mt-3 text-xs opacity-70 hover:underline">
            Already posted? Track your event →
          </Link>
        </div>

        <div className="border-2 border-[var(--ink)] rounded-xl p-6 bg-white flex flex-col">
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

      <div className="mt-14">
        <p className="text-xs text-[var(--ink-soft)] uppercase tracking-wide mb-3">
          What's on PopupSpotlight
        </p>
        <div className="grid grid-cols-3 gap-3">
          {categories
            .filter((cat) => CATEGORY_META[cat].image)
            .map((cat) => (
              <div key={cat} className="relative rounded-xl overflow-hidden border-2 border-[var(--ink)] aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={CATEGORY_META[cat].image} alt="" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 text-xs font-medium px-2 py-1 rounded-full bg-white/90 text-[var(--ink)]">
                  {CATEGORY_META[cat].label}
                </span>
              </div>
            ))}
        </div>
      </div>
    </main>
  )
}
