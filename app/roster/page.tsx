import { createClient } from '@/lib/supabase/server'
import JerseyCard from '@/components/JerseyCard'
import type { AssignmentWithPlayer } from '@/lib/types'

export default async function RosterPage() {
  const supabase = await createClient()

  // Check if assignments are finalized
  const { data: settings } = await supabase
    .from('admin_settings')
    .select('*')
    .eq('key', 'assignments_finalized')
    .single()

  const isFinalized = settings?.value === true

  if (!isFinalized) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#1e3a5f] mb-6">Public Roster</h1>

          <div className="bg-white rounded-lg shadow-md p-12">
            <div className="mb-6">
              <svg
                className="w-20 h-20 text-gray-400 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Jersey assignments have not been finalized yet. Check back soon!
            </h2>

            <p className="text-gray-600 text-lg">
              Assignments will be posted by <span className="font-bold text-[#1e3a5f]">February 1, 2026</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Fetch finalized assignments with player details
  const { data: assignments } = await supabase
    .from('assignments')
    .select(`
      *,
      player:players(*)
    `)
    .eq('is_finalized', true)
    .order('jersey_number')

  const assignmentsWithPlayers = assignments as unknown as AssignmentWithPlayer[]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#1e3a5f] mb-2">Team Roster</h1>
        <p className="text-gray-600">2026 Season Jersey Assignments</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {assignmentsWithPlayers?.map((assignment) => (
          <div key={assignment.id} className="flex justify-center">
            <JerseyCard
              number={assignment.jersey_number}
              playerName={`${assignment.player.first_name} ${assignment.player.last_name}`}
              size="medium"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
