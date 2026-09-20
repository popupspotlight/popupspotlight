import { CATEGORY_META, Category } from '@/lib/categories'

export default function HomePage() {
  const categories = Object.keys(CATEGORY_META) as Category[]

  return (
    <main className="max-w-2xl mx-auto px-6 pt-24 pb-32 text-center">
      <h1 className="font-display text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.05]">
        Book a pop-up for your next event.
      </h1>
      <p className="mt-5 text-lg text-[var(--ink-soft)] max-w-lg mx-auto">
        Hat bars, jewelry pop-ups, food trucks, and mobile beauty — search by zip code to
        find and book pop-up businesses for your private or corporate event, anywhere in
        the country.
      </p>

      <form
        method="get"
        action="/search"
        className="mt-10 flex flex-col sm:flex-row gap-3 border-2 border-[var(--ink)] rounded-xl p-3 bg-white text-left"
      >
        <input
          name="zip"
          required
          pattern="[0-9]{5}"
          maxLength={5}
          placeholder="Zip code"
          className="flex-1 border-2 border-[var(--line)] rounded-lg px-3 py-2"
        />
        <select
          name="category"
          defaultValue=""
          className="flex-1 border-2 border-[var(--line)] rounded-lg px-3 py-2 bg-white"
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
          className="px-6 py-2 rounded-lg font-medium bg-[var(--ink)] text-[var(--paper)] hover:opacity-90"
        >
          Search
        </button>
      </form>
      <p className="mt-3 text-xs text-[var(--ink-soft)]">Shows results within 60 miles.</p>
    </main>
  )
}
