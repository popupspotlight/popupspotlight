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
      'Post jobs to the job board',
      'Collaborate with other businesses on events',
    ],
    highlight: true,
    checkoutUrl: 'https://buy.stripe.com/6oU8wRckR9IA9kB8ifcAo00',
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
      'Priority placement for job posts',
    ],
    checkoutUrl: 'https://buy.stripe.com/4gMcN70C9bQIfIZfKHcAo01',
  },
]

export default function ListYourBusinessPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight max-w-xl">
        More than a listing. Your spot in the pop-up community.
      </h1>
      <p className="mt-4 text-lg text-[var(--ink-soft)] max-w-xl">
        Get discovered by customers, post shifts to the job board, and team up with other
        businesses for events — all from one membership. Pick a pass. Upgrade or
        downgrade any time.
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
              <a
                href={tier.checkoutUrl ?? 'mailto:popupspotlightinfo@gmail.com?subject=List my pop-up (Free)'}
                target={tier.checkoutUrl ? '_blank' : undefined}
                rel={tier.checkoutUrl ? 'noopener noreferrer' : undefined}
                className="mt-6 block text-center w-full py-2.5 rounded-full font-medium border-2 border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
              >
                {tier.price === 'Free' ? 'Get listed' : 'Get started'}
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
