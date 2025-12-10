import type { Player, JerseyInventory, PlayerSubmission, JerseySize } from './types'
import { JERSEY_SIZE_ORDER } from './types'

type PlayerWithSubmission = Player & {
  submission: PlayerSubmission[]
}

type AssignmentResult = {
  player_id: string
  jersey_number: number
  assigned_size: JerseySize
  assignment_method: 'kept_old' | 'first_choice' | 'second_choice' | 'third_choice' | 'fallback'
}

type PlayerPriority = {
  player: PlayerWithSubmission
  submission: PlayerSubmission
  tier: number
  sortKey: number
}

export async function assignJerseyNumbers(
  players: PlayerWithSubmission[],
  jerseys: JerseyInventory[]
): Promise<AssignmentResult[]> {
  const assignments: AssignmentResult[] = []
  const availableNumbers = new Set(jerseys.map((j) => j.number))
  const jerseyMap = new Map(jerseys.map((j) => [j.number, j]))

  // Filter players who have submitted
  const playersWithSubmissions = players.filter(
    (p) => p.submission && p.submission.length > 0
  )

  // Tier 1: Returning players who want to keep their old number
  const tier1Players = playersWithSubmissions.filter((player) => {
    const submission = player.submission[0]
    return (
      player.is_returning &&
      player.previous_jersey_number !== null &&
      (submission.first_choice === player.previous_jersey_number ||
        submission.second_choice === player.previous_jersey_number ||
        submission.third_choice === player.previous_jersey_number)
    )
  })

  // Process Tier 1
  for (const player of tier1Players) {
    const submission = player.submission[0]
    const oldNumber = player.previous_jersey_number!

    if (availableNumbers.has(oldNumber)) {
      assignments.push({
        player_id: player.id,
        jersey_number: oldNumber,
        assigned_size: submission.requested_size,
        assignment_method: 'kept_old',
      })
      availableNumbers.delete(oldNumber)
    }
  }

  // Tier 2: Returning players changing numbers
  const tier2Players = playersWithSubmissions.filter((player) => {
    const alreadyAssigned = assignments.some((a) => a.player_id === player.id)
    return player.is_returning && !alreadyAssigned
  })

  // Tier 3: New players
  const tier3Players = playersWithSubmissions.filter((player) => {
    const alreadyAssigned = assignments.some((a) => a.player_id === player.id)
    return !player.is_returning && !alreadyAssigned
  })

  // Create priority list for Tier 2
  const tier2Priority: PlayerPriority[] = tier2Players.map((player) => {
    const submission = player.submission[0]
    // Sort key: participated_fall_ball (1 or 0) * 100 + grade
    // Higher is better priority
    const sortKey = (player.participated_fall_ball ? 100 : 0) + player.grade
    return { player, submission, tier: 2, sortKey }
  })

  // Create priority list for Tier 3
  const tier3Priority: PlayerPriority[] = tier3Players.map((player) => {
    const submission = player.submission[0]
    // Same sort key calculation
    const sortKey = (player.participated_fall_ball ? 100 : 0) + player.grade
    return { player, submission, tier: 3, sortKey }
  })

  // Combine and sort: Tier 2 first, then Tier 3, both sorted by sortKey descending
  const sortedPlayers = [...tier2Priority, ...tier3Priority].sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier
    if (b.sortKey !== a.sortKey) return b.sortKey - a.sortKey
    // Tie breaker: returning players get priority
    if (a.player.is_returning !== b.player.is_returning) {
      return a.player.is_returning ? -1 : 1
    }
    return 0
  })

  // Process assignments for Tier 2 and 3
  for (const { player, submission } of sortedPlayers) {
    const choices = [
      submission.first_choice,
      submission.second_choice,
      submission.third_choice,
    ]

    let assigned = false

    // Try each choice in order
    for (let i = 0; i < choices.length; i++) {
      const choice = choices[i]
      if (availableNumbers.has(choice)) {
        const method =
          i === 0 ? 'first_choice' : i === 1 ? 'second_choice' : 'third_choice'

        assignments.push({
          player_id: player.id,
          jersey_number: choice,
          assigned_size: submission.requested_size,
          assignment_method: method,
        })
        availableNumbers.delete(choice)
        assigned = true
        break
      }
    }

    // Fallback: assign smallest available number in requested size
    if (!assigned) {
      const fallbackNumber = findFallbackNumber(
        availableNumbers,
        jerseyMap,
        submission.requested_size
      )

      if (fallbackNumber !== null) {
        assignments.push({
          player_id: player.id,
          jersey_number: fallbackNumber,
          assigned_size: submission.requested_size,
          assignment_method: 'fallback',
        })
        availableNumbers.delete(fallbackNumber)
      }
    }
  }

  return assignments
}

function findFallbackNumber(
  availableNumbers: Set<number>,
  jerseyMap: Map<number, JerseyInventory>,
  requestedSize: JerseySize
): number | null {
  // Try to find smallest number in requested size
  const numbersInSize = Array.from(availableNumbers)
    .filter((num) => {
      const jersey = jerseyMap.get(num)
      return jersey && jersey.sizes.includes(requestedSize)
    })
    .sort((a, b) => a - b)

  if (numbersInSize.length > 0) {
    return numbersInSize[0]
  }

  // Find closest size
  const sizeIndex = JERSEY_SIZE_ORDER.indexOf(requestedSize)
  const closestSizes: JerseySize[] = []

  // Add sizes in order of proximity
  for (let i = 1; i < JERSEY_SIZE_ORDER.length; i++) {
    if (sizeIndex - i >= 0) {
      closestSizes.push(JERSEY_SIZE_ORDER[sizeIndex - i])
    }
    if (sizeIndex + i < JERSEY_SIZE_ORDER.length) {
      closestSizes.push(JERSEY_SIZE_ORDER[sizeIndex + i])
    }
  }

  // Try each closest size
  for (const size of closestSizes) {
    const numbersInSize = Array.from(availableNumbers)
      .filter((num) => {
        const jersey = jerseyMap.get(num)
        return jersey && jersey.sizes.includes(size)
      })
      .sort((a, b) => a - b)

    if (numbersInSize.length > 0) {
      return numbersInSize[0]
    }
  }

  // Last resort: just return the smallest available number
  const allAvailable = Array.from(availableNumbers).sort((a, b) => a - b)
  return allAvailable.length > 0 ? allAvailable[0] : null
}
