import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { LoginForm } from '../../components/forms'
import { useAuthStore } from '../../stores/auth-store'

export function LoginPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/' })
    }
  }, [isAuthenticated, navigate])

  const handleLoginSuccess = () => {
    // Navigation will be handled automatically by the route guard
    // when isAuthenticated becomes true
    console.log('🎉 Login completed - route guard will handle navigation')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <svg
              className="h-12 w-12 text-primary-color"
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
          </div>
          
          <h1 className="typography_h1 !mb-2">MotoCorp DMS</h1>
          <p className="typography_body">
            Sign in to your dealership management system
          </p>
        </div>

        {/* Login Form */}
        <LoginForm onSuccess={handleLoginSuccess} />

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-text-secondary">
            Don't have an account?{' '}
            <a
              href="#"
              className="text-primary-color hover:underline font-medium"
              onClick={(e) => {
                e.preventDefault()
                // Navigate to register page when implemented
              }}
            >
              Contact your administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}