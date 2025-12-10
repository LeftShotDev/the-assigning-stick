'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  const linkClass = (path: string) =>
    `px-4 py-2 rounded transition-colors ${
      isActive(path)
        ? 'bg-white text-[#1e3a5f]'
        : 'text-white hover:bg-white/10'
    }`

  return (
    <nav className="bg-[#1e3a5f] text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-xl font-bold">The Assigning Stick</div>

          <div className="flex gap-2">
            <Link href="/" className={linkClass('/')}>
              Player Selection
            </Link>
            <Link href="/admin" className={linkClass('/admin')}>
              Admin
            </Link>
            <Link href="/roster" className={linkClass('/roster')}>
              Public Roster
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
