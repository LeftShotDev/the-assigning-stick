'use client'

import { useState } from 'react'
import { submitPlayerSelection } from '@/app/actions'
import type { Player, JerseyInventory, JerseySize } from '@/lib/types'
import { JERSEY_SIZE_LABELS } from '@/lib/types'

type PlayerSelectionFormProps = {
  players: Player[]
  jerseys: JerseyInventory[]
  playersRemaining: number
}

export default function PlayerSelectionForm({
  players,
  jerseys,
  playersRemaining,
}: PlayerSelectionFormProps) {
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [firstChoice, setFirstChoice] = useState('')
  const [secondChoice, setSecondChoice] = useState('')
  const [thirdChoice, setThirdChoice] = useState('')
  const [size, setSize] = useState<JerseySize>('YM')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedPlayer || !firstChoice || !secondChoice || !thirdChoice) {
      setError('Please fill in all fields')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await submitPlayerSelection({
        playerId: selectedPlayer,
        firstChoice: parseInt(firstChoice),
        secondChoice: parseInt(secondChoice),
        thirdChoice: parseInt(thirdChoice),
        requestedSize: size,
      })

      if (result.error) {
        setError(result.error)
      } else {
        setSubmitted(true)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto text-center">
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
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Submission Successful!
        </h3>
        <p className="text-gray-600 mb-2">
          Your jersey number preferences have been submitted.
        </p>
        <p className="text-gray-700 font-semibold">
          Coach is waiting for {playersRemaining - 1} more {playersRemaining - 1 === 1 ? 'player' : 'players'} to respond.
        </p>
        <p className="text-gray-600 mt-2">
          Assignments will be posted by <span className="font-bold">February 1, 2026</span>
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="player" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <select
            id="player"
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
            required
          >
            <option value="">Select your name</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.first_name} {player.last_name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="first-choice" className="block text-sm font-medium text-gray-700 mb-2">
              First Choice
            </label>
            <select
              id="first-choice"
              value={firstChoice}
              onChange={(e) => setFirstChoice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
              required
            >
              <option value="">Select Number</option>
              {jerseys.map((jersey) => (
                <option key={jersey.number} value={jersey.number}>
                  #{jersey.number}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="second-choice" className="block text-sm font-medium text-gray-700 mb-2">
              Second Choice
            </label>
            <select
              id="second-choice"
              value={secondChoice}
              onChange={(e) => setSecondChoice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
              required
            >
              <option value="">Select Number</option>
              {jerseys.map((jersey) => (
                <option key={jersey.number} value={jersey.number}>
                  #{jersey.number}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="third-choice" className="block text-sm font-medium text-gray-700 mb-2">
              Third Choice
            </label>
            <select
              id="third-choice"
              value={thirdChoice}
              onChange={(e) => setThirdChoice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
              required
            >
              <option value="">Select Number</option>
              {jerseys.map((jersey) => (
                <option key={jersey.number} value={jersey.number}>
                  #{jersey.number}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
            Jersey Size
          </label>
          <select
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value as JerseySize)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
            required
          >
            {Object.entries(JERSEY_SIZE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#1e3a5f] text-white py-3 px-6 rounded-md font-semibold hover:bg-[#2a4a7f] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Your Choices'}
        </button>
      </form>
    </div>
  )
}
