'use client'

import { useState } from 'react'
import { runAssignmentAlgorithm, finalizeAssignments } from '@/app/admin/actions'
import type { AssignmentWithPlayer } from '@/lib/types'

type AssignmentManagerProps = {
  isFinalized: boolean
}

export default function AssignmentManager({ isFinalized: initialFinalized }: AssignmentManagerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [assignments, setAssignments] = useState<AssignmentWithPlayer[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [isFinalized, setIsFinalized] = useState(initialFinalized)

  const handleRunAlgorithm = async () => {
    setIsRunning(true)
    try {
      const result = await runAssignmentAlgorithm()
      if (result.assignments) {
        setAssignments(result.assignments)
        setShowPreview(true)
      }
    } catch (error) {
      console.error('Assignment algorithm error:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const handleFinalize = async () => {
    if (confirm('Are you sure you want to finalize these assignments? This will make them public.')) {
      await finalizeAssignments()
      setIsFinalized(true)
      setShowPreview(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Jersey Assignment
      </h2>

      {isFinalized ? (
        <div className="text-center py-8">
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-green-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            Assignments Finalized
          </h3>
          <p className="text-gray-600">
            Jersey assignments have been finalized and are now public.
          </p>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">
            Run the automated assignment algorithm to assign jersey numbers to all players
            based on their preferences and priority criteria.
          </p>

          <button
            onClick={handleRunAlgorithm}
            disabled={isRunning}
            className="bg-[#1e3a5f] text-white px-6 py-3 rounded-md hover:bg-[#2a4a7f] transition-colors disabled:bg-gray-400"
          >
            {isRunning ? 'Running Algorithm...' : 'Run Assignment Algorithm'}
          </button>

          {showPreview && assignments.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Assignment Preview</h3>
                <button
                  onClick={handleFinalize}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Finalize Assignments
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Player
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Jersey #
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Size
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Method
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assignments.map((assignment) => (
                      <tr key={assignment.id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          {assignment.player.first_name} {assignment.player.last_name}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-bold">
                          #{assignment.jersey_number}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          {assignment.assigned_size}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              assignment.assignment_method === 'kept_old'
                                ? 'bg-blue-100 text-blue-800'
                                : assignment.assignment_method === 'first_choice'
                                ? 'bg-green-100 text-green-800'
                                : assignment.assignment_method === 'second_choice'
                                ? 'bg-yellow-100 text-yellow-800'
                                : assignment.assignment_method === 'third_choice'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {assignment.assignment_method.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
