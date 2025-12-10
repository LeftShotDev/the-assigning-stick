import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardMetrics from '@/components/admin/DashboardMetrics'
import RosterManagement from '@/components/admin/RosterManagement'
import JerseyInventoryManager from '@/components/admin/JerseyInventoryManager'
import SubmissionsTable from '@/components/admin/SubmissionsTable'
import AssignmentManager from '@/components/admin/AssignmentManager'

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirectTo=/admin')
  }

  // Fetch dashboard data
  const { count: totalPlayers } = await supabase
    .from('players')
    .select('*', { count: 'exact', head: true })

  const { count: submissionCount } = await supabase
    .from('player_submissions')
    .select('*', { count: 'exact', head: true })

  const { data: players } = await supabase
    .from('players')
    .select(`
      *,
      submission:player_submissions(*)
    `)
    .order('last_name, first_name')

  const { data: jerseys } = await supabase
    .from('jersey_inventory')
    .select('*')
    .order('number')

  const { data: settings } = await supabase
    .from('admin_settings')
    .select('*')
    .eq('key', 'assignments_finalized')
    .single()

  const isFinalized = settings?.value === true

  const completionRate = totalPlayers ? Math.round((submissionCount || 0) / totalPlayers * 100) : 0

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#1e3a5f]">Admin Dashboard</h1>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Sign Out
          </button>
        </form>
      </div>

      <DashboardMetrics
        totalPlayers={totalPlayers || 0}
        submitted={submissionCount || 0}
        completionRate={completionRate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RosterManagement players={players || []} />
        <JerseyInventoryManager jerseys={jerseys || []} />
      </div>

      <SubmissionsTable players={players || []} />

      <AssignmentManager isFinalized={isFinalized} />
    </div>
  )
}
