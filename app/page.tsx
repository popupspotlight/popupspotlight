import { supabase, PopupBusiness } from '@/lib/supabase'
import { CATEGORY_META, Category } from '@/lib/categories'

async function getBusinesses(): Promise<PopupBusiness[]> {
  const { data, error } = await supabase
    .from('popup_businesses')
    .select('id, name, category, description, phone, status')
    .eq('status', 'active')

  if (error) {
    console.error(error)
    return []
  }
  return data ?? []
}

function formatPhone(phone: string | null) {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (digits.length !== 10) return phone
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export default async function DiscoveryPage() {
  const businesses = await getBusinesses()
  const categories = Object.keys(CATEGORY_META) as Category[]

  return (
    <main>
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-10">
        <h1 className="font-display text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.05] max-w-2xl">
          Find what's popping up near you.
        </h1>
        <p className="mt-5 text-lg text-[var(--ink-soft)] max-w-xl">
          Hat bars, jewelry pop-ups, food trucks, and mobile beauty — all the temporary
          storefronts in Denver and Boulder, in one place.
        </p>

        <div className="mt-8 flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <span
              key={cat}
              className="text-sm px-4 py-1.5 rounded-full border-2 border-[var(--ink)] font-medium"
            >
              {CATEGORY_META[cat].label}
            </span>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        {businesses.length === 0 ? (
          <div className="border-2 border-dashed border-[var(--line)] rounded-xl p-12 text-center text-[var(--ink-soft)]">
            No active listings yet. Once a pop-up owner publishes, it shows up here.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {businesses.map((b) => {
              const meta = CATEGORY_META[b.category as Category]
              return (
                <div
                  key={b.id}
                  className="border-2 border-[var(--ink)] rounded-xl overflow-hidden bg-white flex flex-col"
                >
                  <div
                    className="h-2"
                    style={{ background: meta?.accent ?? 'var(--ink)' }}
                  />
                  <div className="p-5 flex-1 flex flex-col">
                    <span
                      className="self-start text-xs font-medium px-2.5 py-1 rounded-full mb-3"
                      style={{ background: meta?.bg, color: meta?.text }}
                    >
                      {meta?.label ?? b.category}
                    </span>
                    <h3 className="font-display text-lg font-semibold">{b.name}</h3>
                    {b.description && (
                      <p className="text-sm text-[var(--ink-soft)] mt-2 flex-1">
                        {b.description}
                      </p>
                    )}
                    {b.phone && (
                      <p className="text-sm text-[var(--ink)] mt-4 font-medium">
                        {formatPhone(b.phone)}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

export const revalidate = 60
