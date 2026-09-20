export type Category = 'hat_bar' | 'jewelry' | 'food_bev' | 'beauty'

export const CATEGORY_META: Record<Category, { label: string; accent: string; bg: string; text: string }> = {
  hat_bar: { label: 'Hat Bar', accent: '#D9622B', bg: '#FBE7DB', text: '#7A2E0E' },
  jewelry: { label: 'Jewelry Experience', accent: '#B0447A', bg: '#F8E1EC', text: '#6E1F41' },
  food_bev: { label: 'Food & Beverage', accent: '#C98A1F', bg: '#FBEBCE', text: '#6E4A0D' },
  beauty: { label: 'Mobile Beauty', accent: '#3C7A6A', bg: '#DDEEE8', text: '#1D4A3E' },
}
