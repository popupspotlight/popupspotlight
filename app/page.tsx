import { supabase, PopupBusiness } from '@/lib/supabase'

const CATEGORY_LABELS: Record<string, string> = {
  hat_bar: 'Hat bar',
  jewelry: 'Jewelry',
  food_bev: 'Food and bev',
  beauty: 'Beauty',
}

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

export default async function DiscoveryPage() {
  const businesses = await getBusinesses()

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium mb-1">PopupSpotlight</h1>
      <p className="text-gray-500 mb-6">Denver and Boulder pop-up businesses</p>

      {businesses.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500">
          No active listings yet. Once a pop-up owner publishes, it will show up here.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {businesses.map((b) => (
            <div key={b.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
              <div className="p-4">
                <p className="font-medium">{b.name}</p>
                <p className="text-sm text-gray-500 mt-1">{CATEGORY_LABELS[b.category] ?? b.category}</p>
                {b.description && <p className="text-sm text-gray-600 mt-2">{b.description}</p>}
                {b.phone && <p className="text-sm text-gray-500 mt-2">{b.phone}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export const revalidate = 60
