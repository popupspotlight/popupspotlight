export type Category = 'hat_bar' | 'jewelry' | 'food_bev' | 'beauty' | 'kids_parties'

export const CATEGORY_META: Record<Category, { label: string; accent: string; bg: string; text: string; image?: string }> = {
  hat_bar: {
    label: 'Hat Bar',
    accent: '#D9622B',
    bg: '#FBE7DB',
    text: '#7A2E0E',
    image: 'https://images.unsplash.com/photo-1753723824009-c9a8350f825b?auto=format&fit=crop&w=800&q=60',
  },
  jewelry: {
    label: 'Jewelry Experience',
    accent: '#B0447A',
    bg: '#F8E1EC',
    text: '#6E1F41',
    image: 'https://images.unsplash.com/photo-1715374033196-0ff662284a7e?auto=format&fit=crop&w=800&q=60',
  },
  food_bev: {
    label: 'Food & Beverage',
    accent: '#C98A1F',
    bg: '#FBEBCE',
    text: '#6E4A0D',
    image: 'https://images.unsplash.com/photo-1764512680758-387420ff9245?auto=format&fit=crop&w=800&q=60',
  },
  beauty: { label: 'Mobile Beauty', accent: '#3C7A6A', bg: '#DDEEE8', text: '#1D4A3E' },
  kids_parties: { label: 'Kids Parties & Entertainment', accent: '#3E6FB0', bg: '#DEE9F8', text: '#1E3E66' },
}
