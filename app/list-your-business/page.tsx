const TIERS = [
  {
    name: 'Listed',
    price: 'Free',
    cadence: '',
    description: 'Get discovered. List your pop-up in the directory at no cost.',
    features: [
      'Public listing with photo, description, and contact info',
      'Appears in category browsing',
      'Consumers can call you directly',
    ],
  },
  {
    name: 'Featured',
    price: '$79',
    cadence: '/month',
    description: 'Stand out in your category and start building repeat visitors.',
    features: [
      'Everything in Listed',
      'Photo gallery on your listing',
      'Featured placement within your category',
      'Respond publicly to reviews',
    ],
    highlight: true,
  },
  {
    name: 'Spotlighted',
    price: '$199',
    cadence: '/month',
    description: 'Top billing across the whole platform, plus the data to prove it.',
    features: [
      'Everything in Featured',
      'Top placement across all categories',
      'Homepage feature rotation',
      'View and booking analytics',
      'Priority access to the job board',
    ],
  },
]

export default function ListYourBusinessPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight max-w-xl">
        Get your pop-up in front of the neighborhood.
      </h1>
      <p className="mt-4 text-lg text-[var(--ink-soft)] max-w-xl">
        Pick a pass. Upgrade or downgrade any time — there's no contract, because pop-ups
        shouldn't have to sign one either.
      </p>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {TIERS.map((tier) => (
          <div key={tier.name} className="ticket flex flex-col">
            <div className="p-6" style={{ minHeight: 168 }}>
              {tier.highlight && (
                <span className="text-xs font-medium bg-[var(--gold)] text-white px-2.5 py-1 rounded-full">
                  Most popular
                </span>
              )}
              <h2 className="font-display text-xl font-semibold mt-3">{tier.name}</h2>
              <p className="mt-2">
                <span className="font-display text-3xl font-semibold">{tier.price}</span>
                <span className="text-[var(--ink-soft)]">{tier.cadence}</span>
              </p>
            </div>
            <div className="ticket-stub px-6 pb-6 flex-1 flex flex-col">
              <p className="text-sm text-[var(--ink-soft)] mb-4">{tier.description}</p>
              <ul className="space-y-2.5 text-sm flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span aria-hidden="true">—</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-6 w-full py-2.5 rounded-full font-medium border-2 border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors">
                {tier.price === 'Free' ? 'Get listed' : 'Get started'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
