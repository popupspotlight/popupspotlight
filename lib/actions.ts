'use server'

import { supabase } from './supabase'
import { revalidatePath } from 'next/cache'

export async function createWorkerProfile(
  _prevState: { error?: string; success?: boolean; workerId?: string },
  formData: FormData
): Promise<{ error?: string; success?: boolean; workerId?: string }> {
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const phone = (formData.get('phone') as string)?.trim() || null
  const bio = (formData.get('bio') as string)?.trim() || null
  const skills = (formData.get('skills') as string)?.trim() || null

  if (!name || !email) {
    return { error: 'Name and email are required.' }
  }

  const { data: existing } = await supabase
    .from('worker_profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (existing) {
    return { error: 'A profile with that email already exists.' }
  }

  const { data: created, error } = await supabase
    .from('worker_profiles')
    .insert({ name, email, phone, bio, skills })
    .select('id')
    .single()

  if (error) {
    console.error(error)
    return { error: 'Could not create your profile. Please try again.' }
  }

  return { success: true, workerId: created.id }
}

export async function applyToJob(_prevState: { error?: string; success?: boolean }, formData: FormData) {
  const jobPostId = formData.get('jobPostId') as string
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const phone = (formData.get('phone') as string)?.trim() || null
  const message = (formData.get('message') as string)?.trim() || null

  if (!jobPostId || !name || !email) {
    return { error: 'Name and email are required.' }
  }

  // Find an existing worker profile by email, or create one.
  const { data: existing } = await supabase
    .from('worker_profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  let workerId = existing?.id

  if (!workerId) {
    const { data: created, error: createError } = await supabase
      .from('worker_profiles')
      .insert({ name, email, phone })
      .select('id')
      .single()

    if (createError) {
      console.error(createError)
      return { error: 'Could not create your worker profile. Please try again.' }
    }
    workerId = created.id
  }

  const { error: applyError } = await supabase
    .from('job_applications')
    .insert({ job_post_id: jobPostId, worker_id: workerId, message })

  if (applyError) {
    console.error(applyError)
    return { error: 'Could not submit your application. Please try again.' }
  }

  revalidatePath(`/jobs/${jobPostId}`)
  return { success: true, workerId }
}
