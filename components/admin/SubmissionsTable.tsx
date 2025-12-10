import type { Player, PlayerSubmission } from '@/lib/types'

type PlayerWithSubmission = Player & {
  submission: PlayerSubmission[]
}

type SubmissionsTableProps = {
  players: PlayerWithSubmission[]
}

export default function SubmissionsTable({ players }: SubmissionsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Submission Status
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Grade
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Returning
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fall Ball
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Submitted
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Choices
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Size
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {players.map((player) => {
              const submission = player.submission?.[0]
              return (
                <tr key={player.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    {player.first_name} {player.last_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{player.grade}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {player.is_returning ? '✓' : '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {player.participated_fall_ball ? '✓' : '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {submission ? (
                      <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {submission
                      ? `#${submission.first_choice}, #${submission.second_choice}, #${submission.third_choice}`
                      : '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {submission?.requested_size || '-'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
