import { useState, useEffect } from 'react'
import { useRouter, useSearch } from '@tanstack/react-router'
import { ResetPasswordForm } from '../../components/auth/ResetPasswordForm'
import { useAuthStore } from '../../stores/auth-store'
import { type ResetPasswordFormData } from '../../types/schemas'

export function ResetPasswordPage() {
  const router = useRouter()
  const search = useSearch({ from: '/reset-password' }) as { token?: string }
  const { resetPassword, isLoading, error, clearError } = useAuthStore()
  
  const [successMessage, setSuccessMessage] = useState<string>()
  const [isTokenValid, setIsTokenValid] = useState(true)
  
  // Get token from URL parameters
  const token = search?.token || ''

  useEffect(() => {
    // Clear any existing errors when component mounts
    clearError()
    
    // Validate token presence
    if (!token) {
      setIsTokenValid(false)
    }
  }, [token, clearError])

  const handleSubmit = async (data: ResetPasswordFormData) => {
    try {
      const message = await resetPassword(data)
      setSuccessMessage(message)
      
      // Redirect to login after successful password reset
      setTimeout(() => {
        router.navigate({ to: '/auth' })
      }, 3000)
    } catch (error) {
      // Error is handled by the store
      console.error('Password reset failed:', error)
    }
  }

  const handleBackToLogin = () => {
    router.navigate({ to: '/auth' })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="flex justify-center items-center gap-3 mb-6">
          <svg
            className="h-10 w-10 text-[var(--primary-color)]"
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
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            DealerFlow
          </h1>
        </div>

        {/* Reset Password Form Container */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <ResetPasswordForm
            token={token}
            onSubmit={handleSubmit}
            onBackToLogin={handleBackToLogin}
            isLoading={isLoading}
            successMessage={successMessage}
            error={error || undefined}
            isTokenValid={isTokenValid}
          />
        </div>
      </div>
    </div>
  )
}