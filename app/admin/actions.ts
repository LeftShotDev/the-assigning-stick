'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { JerseySize } from '@/lib/types'
import { assignJerseyNumbers } from '@/lib/assignment-algorithm'

// Player Management Actions
export async function addPlayer(data: {
  first_name: string
  last_name: string
  grade: number
  is_returning: boolean
  participated_fall_ball: boolean
  previous_jersey_number: number | null
}) {
  const supabase = await createClient()

  const { error } = await supabase.from('players').insert(data)

  if (error) {
    console.error('Add player error:', error)
    return { error: 'Failed to add player' }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function updatePlayer(
  id: string,
  data: {
    first_name: string
    last_name: string
    grade: number
    is_returning: boolean
    participated_fall_ball: boolean
    previous_jersey_number: number | null
  }
) {
  const supabase = await createClient()

  const { error } = await supabase.from('players').update(data).eq('id', id)

  if (error) {
    console.error('Update player error:', error)
    return { error: 'Failed to update player' }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function deletePlayer(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('players').delete().eq('id', id)

  if (error) {
    console.error('Delete player error:', error)
    return { error: 'Failed to delete player' }
  }

  revalidatePath('/admin')
  return { success: true }
}

// Jersey Inventory Actions
export async function updateJerseyInventory(number: number, sizes: JerseySize[]) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('jersey_inventory')
    .update({ sizes })
    .eq('number', number)

  if (error) {
    console.error('Update jersey inventory error:', error)
    return { error: 'Failed to update jersey inventory' }
  }

  revalidatePath('/admin')
  return { success: true }
}

// Assignment Actions
export async function runAssignmentAlgorithm() {
  const supabase = await createClient()

  try {
    // Fetch all necessary data
    const { data: players } = await supabase
      .from('players')
      .select(`
        *,
        submission:player_submissions(*)
      `)

    const { data: jerseys } = await supabase
      .from('jersey_inventory')
      .select('*')

    if (!players || !jerseys) {
      return { error: 'Failed to fetch data' }
    }

    // Run the assignment algorithm
    const assignments = await assignJerseyNumbers(players, jerseys)

    // Clear existing non-finalized assignments
    await supabase.from('assignments').delete().eq('is_finalized', false)

    // Insert new assignments
    const { error } = await supabase.from('assignments').insert(
      assignments.map((a) => ({
        player_id: a.player_id,
        jersey_number: a.jersey_number,
        assigned_size: a.assigned_size,
        assignment_method: a.assignment_method,
        is_finalized: false,
      }))
    )

    if (error) {
      console.error('Insert assignments error:', error)
      return { error: 'Failed to save assignments' }
    }

    // Fetch the created assignments with player details
    const { data: createdAssignments } = await supabase
      .from('assignments')
      .select(`
        *,
        player:players(*)
      `)
      .eq('is_finalized', false)

    revalidatePath('/admin')
    return { success: true, assignments: createdAssignments }
  } catch (error) {
    console.error('Assignment algorithm error:', error)
    return { error: 'Failed to run assignment algorithm' }
  }
}

export async function finalizeAssignments() {
  const supabase = await createClient()

  // Update all assignments to finalized
  const { error } = await supabase
    .from('assignments')
    .update({ is_finalized: true })
    .eq('is_finalized', false)

  if (error) {
    console.error('Finalize assignments error:', error)
    return { error: 'Failed to finalize assignments' }
  }

  // Update admin settings
  await supabase
    .from('admin_settings')
    .update({ value: true })
    .eq('key', 'assignments_finalized')

  revalidatePath('/admin')
  revalidatePath('/roster')
  return { success: true }
}
