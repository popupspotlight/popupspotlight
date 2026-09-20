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
  city: string | null
  state: string | null
  zip: string | null
  lat: number | null
  lng: number | null
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

export type JobPost = {
  id: string
  popup_id: string
  title: string
  description: string | null
  pay_rate: string | null
  workers_needed: number
  shift_start: string | null
  shift_end: string | null
  status: 'open' | 'filled' | 'closed'
  created_at: string
}

export type WorkerProfile = {
  id: string
  name: string
  email: string
  phone: string | null
  bio: string | null
  skills: string | null
  created_at: string
}

export type WorkerReview = {
  id: string
  worker_id: string
  popup_id: string
  rating: number
  text: string | null
  direction: 'employer_on_worker' | 'worker_on_employer'
  created_at: string
}
