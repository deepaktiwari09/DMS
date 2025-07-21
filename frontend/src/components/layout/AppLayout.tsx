import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { useAuthStore } from '../../stores/auth-store'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  // Don't show layout for unauthenticated users
  if (!isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}