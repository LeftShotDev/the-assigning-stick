import { createClient } from '@/lib/supabase/server'
import JerseyGrid from '@/components/JerseyGrid'
import PlayerSelectionForm from '@/components/PlayerSelectionForm'

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch available jerseys
  const { data: jerseys } = await supabase
    .from('jersey_inventory')
    .select('*')
    .order('number')

  // Fetch all players for the dropdown
  const { data: players } = await supabase
    .from('players')
    .select('*')
    .order('last_name, first_name')

  // Get submission count
  const { count: submissionCount } = await supabase
    .from('player_submissions')
    .select('*', { count: 'exact', head: true })

  const { count: totalPlayers } = await supabase
    .from('players')
    .select('*', { count: 'exact', head: true })

  const playersRemaining = (totalPlayers || 0) - (submissionCount || 0)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#1e3a5f] mb-2">
          Select Your Jersey Number
        </h1>
        <p className="text-gray-600">
          Choose your top 3 jersey number preferences
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Available Jersey Numbers
        </h2>
        <JerseyGrid jerseys={jerseys || []} />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Make Your Selection
        </h2>
        <PlayerSelectionForm
          players={players || []}
          jerseys={jerseys || []}
          playersRemaining={playersRemaining}
        />
      </div>
    </div>
  )
}
