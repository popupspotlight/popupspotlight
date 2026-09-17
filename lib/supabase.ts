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
}
