'use client'

import { useState } from 'react'
import { addPlayer, updatePlayer, deletePlayer } from '@/app/admin/actions'
import type { Player } from '@/lib/types'

type RosterManagementProps = {
  players: Player[]
}

export default function RosterManagement({ players: initialPlayers }: RosterManagementProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)

  const handleEdit = (player: Player) => {
    setEditingPlayer(player)
    setShowForm(true)
  }

  const handleDelete = async (playerId: string) => {
    if (confirm('Are you sure you want to delete this player?')) {
      await deletePlayer(playerId)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingPlayer(null)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Team Roster</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#1e3a5f] text-white px-4 py-2 rounded-md hover:bg-[#2a4a7f] transition-colors text-sm"
        >
          Add Player
        </button>
      </div>

      {showForm && (
        <PlayerForm player={editingPlayer} onClose={handleCloseForm} />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Grade
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Returning
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Fall Ball
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {initialPlayers.map((player) => (
              <tr key={player.id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  {player.first_name} {player.last_name}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{player.grade}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  {player.is_returning ? '✓' : ''}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  {player.participated_fall_ball ? '✓' : ''}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(player)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(player.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PlayerForm({
  player,
  onClose,
}: {
  player: Player | null
  onClose: () => void
}) {
  const [firstName, setFirstName] = useState(player?.first_name || '')
  const [lastName, setLastName] = useState(player?.last_name || '')
  const [grade, setGrade] = useState(player?.grade || 6)
  const [isReturning, setIsReturning] = useState(player?.is_returning || false)
  const [participatedFallBall, setParticipatedFallBall] = useState(
    player?.participated_fall_ball || false
  )
  const [previousJerseyNumber, setPreviousJerseyNumber] = useState(
    player?.previous_jersey_number?.toString() || ''
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = {
      first_name: firstName,
      last_name: lastName,
      grade,
      is_returning: isReturning,
      participated_fall_ball: participatedFallBall,
      previous_jersey_number: previousJerseyNumber ? parseInt(previousJerseyNumber) : null,
    }

    if (player) {
      await updatePlayer(player.id, data)
    } else {
      await addPlayer(data)
    }

    onClose()
  }

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">
        {player ? 'Edit Player' : 'Add New Player'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
            <select
              value={grade}
              onChange={(e) => setGrade(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value={6}>6th Grade</option>
              <option value={7}>7th Grade</option>
              <option value={8}>8th Grade</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Previous Jersey #
            </label>
            <input
              type="number"
              value={previousJerseyNumber}
              onChange={(e) => setPreviousJerseyNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Only for returning players"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isReturning}
              onChange={(e) => setIsReturning(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Returning Player</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={participatedFallBall}
              onChange={(e) => setParticipatedFallBall(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Participated in Fall Ball</span>
          </label>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-[#1e3a5f] text-white px-4 py-2 rounded-md hover:bg-[#2a4a7f]"
          >
            {player ? 'Update' : 'Add'} Player
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
