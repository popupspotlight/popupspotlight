const POST_TIERS = [
  {
    name: 'Single shift',
    price: '$15',
    description: 'One person, up to 3 days. Good for a single weekend pop-up.',
  },
  {
    name: 'Full run',
    price: '$35',
    description: 'Up to 3 people, up to 14 days. Good for a multi-week residency.',
  },
  {
    name: 'Team build',
    price: '$60',
    description: 'Unlimited people, up to 30 days. Good for launching a new location.',
  },
]

export default function PostAJobPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl font-semibold tracking-tight max-w-xl">
        Find your crew.
      </h1>
      <p className="mt-4 text-lg text-[var(--ink-soft)] max-w-xl">
        Post a shift, talent applies directly, you pick who to hire. PopupSpotlight isn't
        the employer — you handle hiring, pay, and paperwork directly with whoever you
        bring on.
      </p>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {POST_TIERS.map((tier) => (
          <div key={tier.name} className="border-2 border-[var(--ink)] rounded-xl p-5 bg-white">
            <h2 className="font-display text-lg font-semibold">{tier.name}</h2>
            <p className="font-display text-2xl font-semibold mt-1">{tier.price}</p>
            <p className="text-sm text-[var(--ink-soft)] mt-2">{tier.description}</p>
          </div>
        ))}
      </div>

      <a
        href="mailto:popupspotlightinfo@gmail.com?subject=Post a job"
        className="mt-8 inline-block px-6 py-3 rounded-full font-medium border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:opacity-90"
      >
        Email us your posting
      </a>
      <p className="text-xs text-[var(--ink-soft)] mt-3">
        Job posting is manual for now while we build self-serve posting. Send us the role,
        pay, dates, and how many people you need — we'll get it live within a day.
      </p>
    </main>
  )
}
