import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type PopupBusiness = {
  id: string
  name: string
  category: 'hat_bar' | 'jewelry' | 'food_bev' | 'beauty'
  description: string | null
  phone: string | null
  status: string
  tier: 'listed' | 'featured' | 'spotlighted'
}

export type PopupPhoto = {
  id: string
  popup_id: string
  url: string
  sort_order: number
}

export type Review = {
  id: string
  popup_id: string
  reviewer_name: string
  rating: number
  text: string | null
  owner_response: string | null
  verified: boolean
  created_at: string
}
