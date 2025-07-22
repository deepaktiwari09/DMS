import React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { AuthCard } from '../../components/auth'
import { RegisterForm } from '../../components/auth/RegisterForm'
import { useAuthStore } from '../../stores/auth-store'
import { type RegisterFormData } from '../../types/schemas'

export interface RegisterPageProps {
  /**
   * Callback for successful registration (optional, uses default navigation if not provided)
   */
  onRegisterSuccess?: () => void
}

export function RegisterPage({ onRegisterSuccess }: RegisterPageProps) {
  const navigate = useNavigate()
  const { register, isLoading, error } = useAuthStore()

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await register(data)
      
      if (onRegisterSuccess) {
        onRegisterSuccess()
      } else {
        // Default navigation after successful registration to onboarding
        navigate({ to: '/auth/onboarding' })
      }
    } catch (error) {
      // Error handling is done by the auth store
      console.error('Registration failed:', error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="flex justify-center items-center gap-3 mb-8">
          <svg
            className="h-10 w-10 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21a3 3 0 01-4.242 0c-1.172-1.172-1.172-3.07 0-4.242l4.62-4.621a3 3 0 012.122-.88h1.007M14.25 9.75h1.007a3 3 0 012.122.88l4.62 4.621a3 3 0 010 4.242 3 3 0 01-4.242 0l-1.621-1.622m-7.5-6.379a3 3 0 00-4.242 0L3 14.25m18-4.5l-4.62-4.621a3 3 0 00-2.122-.88H12.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900">DealerFlow</h1>
        </div>
        
        {/* Registration Card */}
        <AuthCard
          title="Create Your Account" 
          subtitle="Get started with the best DMS for your business."
          showLogo={false}
        >
          <RegisterForm 
            onSubmit={handleRegister}
            isLoading={isLoading}
            error={error}
          />
        </AuthCard>
        
        {/* Footer link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}