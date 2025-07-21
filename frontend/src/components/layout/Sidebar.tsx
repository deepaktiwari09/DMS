import { Link } from '@tanstack/react-router'
import { useAuthStore } from '../../stores/auth-store'
import { cn } from '../../lib/utils'

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: (
      <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24">
        <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77Z" />
      </svg>
    ),
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: (
      <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24">
        <path d="M164.47,195.63a8,8,0,0,1-6.7,12.37H10.23a8,8,0,0,1-6.7-12.37,95.83,95.83,0,0,1,47.22-37.71,60,60,0,1,1,66.5,0A95.83,95.83,0,0,1,164.47,195.63Z" />
      </svg>
    ),
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: (
      <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24">
        <path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15Z" />
      </svg>
    ),
  },
  {
    name: 'Sales',
    href: '/sales',
    icon: (
      <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24">
        <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Z" />
      </svg>
    ),
  },
  {
    name: 'Service',
    href: '/service',
    icon: (
      <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24">
        <path d="M226.76,69a8,8,0,0,0-12.84-2.88l-40.3,37.19-17.23-3.7-3.7-17.23,37.19-40.3A8,8,0,0,0,187,29.24,72,72,0,0,0,88,96,72.34,72.34,0,0,0,94,124.94L33.79,177c-.15.12-.29.26-.43.39a32,32,0,0,0,45.26,45.26c.13-.13.27-.28.39-.42L131.06,162A72,72,0,0,0,232,96,71.56,71.56,0,0,0,226.76,69Z" />
      </svg>
    ),
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className={cn('flex flex-col w-64 bg-white border-r border-gray-200', className)}>
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <svg
            className="h-8 w-8 text-primary-color"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21a3 3 0 01-4.242 0c-1.172-1.172-1.172-3.07 0-4.242l4.62-4.621a3 3 0 012.122-.88h1.007M14.25 9.75h1.007a3 3 0 012.122.88l4.62 4.621a3 3 0 010 4.242 3 3 0 01-4.242 0l-1.621-1.622m-7.5-6.379a3 3 0 00-4.242 0L3 14.25m18-4.5l-4.62-4.621a3 3 0 00-2.122-.88H12.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          <h2 className="text-xl font-bold text-text-primary">MotoCorp</h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 text-text-secondary hover:bg-secondary-color hover:text-primary-color rounded-md transition-colors',
              '[&.active]:bg-secondary-color [&.active]:text-primary-color'
            )}
          >
            {item.icon}
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* User Menu */}
      <div className="p-4 border-t border-gray-200">
        {user && (
          <div className="space-y-3">
            <div className="text-sm">
              <p className="font-medium text-text-primary">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-text-secondary">{user.email}</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-secondary hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}