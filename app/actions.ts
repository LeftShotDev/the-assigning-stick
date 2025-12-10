'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { JerseySize } from '@/lib/types'

export async function submitPlayerSelection(data: {
  playerId: string
  firstChoice: number
  secondChoice: number
  thirdChoice: number
  requestedSize: JerseySize
}) {
  const supabase = await createClient()

  // Check if player has already submitted
  const { data: existing } = await supabase
    .from('player_submissions')
    .select('*')
    .eq('player_id', data.playerId)
    .single()

  if (existing) {
    return { error: 'You have already submitted your preferences' }
  }

  // Insert submission
  const { error } = await supabase.from('player_submissions').insert({
    player_id: data.playerId,
    first_choice: data.firstChoice,
    second_choice: data.secondChoice,
    third_choice: data.thirdChoice,
    requested_size: data.requestedSize,
  })

  if (error) {
    console.error('Submission error:', error)
    return { error: 'Failed to submit preferences. Please try again.' }
  }

  revalidatePath('/')
  return { success: true }
}
