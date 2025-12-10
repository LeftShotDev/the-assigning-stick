type JerseyCardProps = {
  number: number
  playerName?: string
  size?: 'small' | 'medium' | 'large'
  onClick?: () => void
  isAvailable?: boolean
  className?: string
}

export default function JerseyCard({
  number,
  playerName,
  size = 'medium',
  onClick,
  isAvailable = true,
  className = '',
}: JerseyCardProps) {
  const sizeClasses = {
    small: 'w-20 h-24',
    medium: 'w-28 h-32',
    large: 'w-36 h-40',
  }

  const numberSizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-5xl',
  }

  const nameSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  }

  return (
    <div
      className={`relative ${sizeClasses[size]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Jersey shape - powder blue */}
      <svg
        viewBox="0 0 100 120"
        className={`w-full h-full ${!isAvailable ? 'opacity-40' : ''}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main jersey body */}
        <path
          d="M 20 25 L 20 100 Q 20 110 30 110 L 70 110 Q 80 110 80 100 L 80 25 L 70 15 Q 65 10 60 10 L 55 10 L 55 5 Q 55 0 50 0 Q 45 0 45 5 L 45 10 L 40 10 Q 35 10 30 15 Z"
          fill="#87CEEB"
          stroke="#1e3a5f"
          strokeWidth="1"
        />

        {/* Sleeves */}
        <path
          d="M 20 25 L 10 35 L 5 45 Q 5 50 10 48 L 20 40 Z"
          fill="#87CEEB"
          stroke="#1e3a5f"
          strokeWidth="1"
        />
        <path
          d="M 80 25 L 90 35 L 95 45 Q 95 50 90 48 L 80 40 Z"
          fill="#87CEEB"
          stroke="#1e3a5f"
          strokeWidth="1"
        />
      </svg>

      {/* Jersey number with white outline */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="relative">
          {/* White outline - multiple text shadows */}
          <div
            className={`${numberSizeClasses[size]} font-bold text-[#1e3a5f] absolute top-0 left-0`}
            style={{
              textShadow:
                '-2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 2px 2px 0 #fff, -2px 0 0 #fff, 2px 0 0 #fff, 0 -2px 0 #fff, 0 2px 0 #fff',
            }}
          >
            {number}
          </div>
          {/* Actual number */}
          <div className={`${numberSizeClasses[size]} font-bold text-[#1e3a5f] relative`}>
            {number}
          </div>
        </div>

        {/* Player name if provided */}
        {playerName && (
          <div className={`${nameSizeClasses[size]} font-semibold text-[#1e3a5f] mt-1 text-center px-1`}>
            {playerName}
          </div>
        )}
      </div>

      {/* Unavailable overlay */}
      {!isAvailable && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-red-600 font-bold text-xs bg-white/80 px-2 py-1 rounded">
            Taken
          </div>
        </div>
      )}
    </div>
  )
}
