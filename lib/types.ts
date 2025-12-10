export type JerseySize = 'YS' | 'YM' | 'YL' | 'AS' | 'AM' | 'AL'

export const JERSEY_SIZE_LABELS: Record<JerseySize, string> = {
  YS: 'Youth Small',
  YM: 'Youth Medium',
  YL: 'Youth Large',
  AS: 'Adult Small',
  AM: 'Adult Medium',
  AL: 'Adult Large',
}

export const JERSEY_SIZE_ORDER: JerseySize[] = ['YS', 'YM', 'YL', 'AS', 'AM', 'AL']

export type Player = {
  id: string
  first_name: string
  last_name: string
  grade: 6 | 7 | 8
  is_returning: boolean
  participated_fall_ball: boolean
  previous_jersey_number: number | null
  created_at: string
}

export type JerseyInventory = {
  id: string
  number: number
  sizes: JerseySize[]
  is_available: boolean
  created_at: string
}

export type PlayerSubmission = {
  id: string
  player_id: string
  first_choice: number
  second_choice: number
  third_choice: number
  requested_size: JerseySize
  submitted_at: string
}

export type Assignment = {
  id: string
  player_id: string
  jersey_number: number
  assigned_size: JerseySize
  assignment_method: 'kept_old' | 'first_choice' | 'second_choice' | 'third_choice' | 'fallback'
  is_finalized: boolean
  created_at: string
}

export type AssignmentWithPlayer = Assignment & {
  player: Player
}

export type PlayerWithSubmission = Player & {
  submission: PlayerSubmission | null
}

export type AdminSettings = {
  id: string
  key: string
  value: any
  created_at: string
  updated_at: string
}
