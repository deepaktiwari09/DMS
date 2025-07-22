import React, { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { AuthBackground, AuthCard } from '../../components/auth'
import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm'
import { useAuthStore } from '../../stores/auth-store'
import { type ForgotPasswordFormData } from '../../types/schemas'

export interface ForgotPasswordPageProps {
  /**
   * Background image URL (optional, uses default if not provided)
   */
  backgroundImage?: string
  /**
   * Callback for successful password reset request
   */
  onSuccess?: (message: string) => void
}

export function ForgotPasswordPage({ 
  backgroundImage,
  onSuccess 
}: ForgotPasswordPageProps) {
  const navigate = useNavigate()
  const { forgotPassword, isLoading, error } = useAuthStore()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    try {
      // Clear any previous success message
      setSuccessMessage(null)
      
      const message = await forgotPassword(data)
      
      if (onSuccess) {
        onSuccess(message)
      } else {
        // Show success message in the form
        setSuccessMessage(message)
      }
    } catch (error) {
      // Error handling is done by the auth store
      console.error('Forgot password request failed:', error)
    }
  }

  const handleBackToLogin = () => {
    navigate({ to: '/auth/login' })
  }

  return (
    <AuthBackground imageUrl={backgroundImage} overlayOpacity={0.6}>
      <AuthCard
        showLogo={true}
      >
        {/* Custom header for forgot password */}
        <div className="text-center mb-8">
          <svg
            className="mx-auto h-12 w-auto text-blue-600 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900">
            Forgot Password?
          </h1>
          <p className="text-md text-gray-600 mt-2">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <ForgotPasswordForm 
          onSubmit={handleForgotPassword}
          onBackToLogin={handleBackToLogin}
          isLoading={isLoading}
          error={error}
          successMessage={successMessage}
        />
      </AuthCard>
      
      {/* Footer link */}
      <p className="text-center text-sm text-gray-200 mt-6">
        <Link
          to="/auth/login"
          className="font-medium text-white hover:text-gray-100 transition-colors"
        >
          ← Back to Login
        </Link>
      </p>
    </AuthBackground>
  )
}