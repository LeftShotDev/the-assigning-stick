import JerseyCard from './JerseyCard'
import type { JerseyInventory } from '@/lib/types'

type JerseyGridProps = {
  jerseys: JerseyInventory[]
  showPlayerNames?: boolean
  assignments?: Map<number, { playerName: string }>
}

export default function JerseyGrid({
  jerseys,
  showPlayerNames = false,
  assignments = new Map(),
}: JerseyGridProps) {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
      {jerseys.map((jersey) => {
        const assignment = assignments.get(jersey.number)
        return (
          <JerseyCard
            key={jersey.number}
            number={jersey.number}
            isAvailable={jersey.is_available}
            playerName={showPlayerNames && assignment ? assignment.playerName : undefined}
            size="small"
          />
        )
      })}
    </div>
  )
}
