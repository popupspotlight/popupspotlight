const PILLARS = [
  {
    title: 'The Directory',
    description: 'A real profile — photos, reviews, and your story — searchable by zip code across the country.',
  },
  {
    title: 'The Job Board',
    description: 'Post shifts, find gig talent, no algorithm managing who you hire. You see every applicant and choose.',
  },
  {
    title: 'Bid Events',
    description: 'Private and corporate event requests posted directly by customers. Submit a proposal, win the booking.',
  },
]

const TIERS = [
  {
    name: 'Listed',
    price: 'Free',
    cadence: '',
    description: 'Get discovered. List your pop-up in the directory at no cost.',
    features: [
      'Public listing with photo, description, and contact info',
      'Appear in category browsing',
      'Consumers can call you directly',
    ],
    buttonLabel: 'Get Listed',
  },
  {
    name: 'Featured',
    price: '$79',
    cadence: '/month',
    description: 'A professional presence, plus a real way to find gig talent when you need it.',
    features: [
      'Everything in Listed',
      'Photo gallery on your listing',
      'Featured Placement on the Directory',
      'Respond publicly to reviews',
      'Post jobs to the Job Board',
      'Find and hire gig talent for shifts',
    ],
    highlight: true,
    checkoutUrl: 'https://buy.stripe.com/6oU8wRckR9IA9kB8ifcAo00',
    buttonLabel: 'Get Featured',
  },
  {
    name: 'Spotlighted',
    price: '$199',
    cadence: '/month',
    description: 'Everything in Featured, plus the growth engine: exclusive access to Bid Events.',
    features: [
      'Everything in Featured',
      'Exclusive access to Bid Events — private and corporate event requests',
      'Spotlight placement on the Directory',
      'Homepage feature rotation',
      'Full view and booking analytics',
      'Priority placement for your job posts',
      'Verified Spotlight Partner badge',
    ],
    checkoutUrl: 'https://buy.stripe.com/4gMcN70C9bQIfIZfKHcAo01',
    buttonLabel: 'Get Spotlighted',
  },
]

export default function ListYourBusinessPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight max-w-2xl">
        More than a listing. Your spot in the pop-up economy.
      </h1>
      <p className="mt-4 text-lg text-[var(--ink-soft)] max-w-xl">
        One membership covers all three ways PopupSpotlight helps your business grow.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {PILLARS.map((p) => (
          <div key={p.title} className="border-2 border-[var(--line)] rounded-xl p-5 bg-white">
            <h2 className="font-display text-base font-semibold">{p.title}</h2>
            <p className="text-sm text-[var(--ink-soft)] mt-2">{p.description}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-[var(--ink-soft)]">
        Pick a pass. Upgrade or downgrade any time — there's no contract.
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {TIERS.map((tier) => (
          <div key={tier.name} className="ticket flex flex-col h-full relative">
            {tier.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-medium bg-[var(--gold)] text-white px-2.5 py-1 rounded-full whitespace-nowrap">
                Most popular
              </span>
            )}
            <div className="p-6" style={{ height: 104 }}>
              <h2 className="font-display text-xl font-semibold">{tier.name}</h2>
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
                    <span aria-hidden="true" className="text-[var(--ink-soft)]">—</span>
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
                {tier.buttonLabel}
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
