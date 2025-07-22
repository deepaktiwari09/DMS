import React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { AuthBackground, AuthCard } from '../../components/auth'
import { LoginForm } from '../../components/auth/LoginForm'
import { useAuthStore } from '../../stores/auth-store'
import { type LoginFormData } from '../../types/schemas'

export interface LoginPageProps {
  /**
   * Background image URL (optional, uses default if not provided)
   */
  backgroundImage?: string
  /**
   * Callback for successful login (optional, uses default navigation if not provided)
   */
  onLoginSuccess?: () => void
}

export function LoginPage({ 
  backgroundImage,
  onLoginSuccess 
}: LoginPageProps) {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuthStore()

  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data)
      
      if (onLoginSuccess) {
        onLoginSuccess()
      } else {
        // Default navigation after successful login
        navigate({ to: '/dashboard' })
      }
    } catch (error) {
      // Error handling is done by the auth store
      console.error('Login failed:', error)
    }
  }

  const handleForgotPassword = () => {
    navigate({ to: '/auth/forgot-password' })
  }

  return (
    <AuthBackground imageUrl={backgroundImage}>
      <AuthCard
        title="DealerFlow DMS"
        subtitle="Access your dealership management system."
        showLogo={true}
      >
        <LoginForm 
          onSubmit={handleLogin}
          isLoading={isLoading}
          onForgotPassword={handleForgotPassword}
          error={error}
        />
      </AuthCard>
      
      {/* Footer link */}
      <p className="text-center text-sm text-gray-200 mt-6">
        Don't have an account?{' '}
        <Link
          to="/auth/register"
          className="font-medium text-white hover:text-gray-100 transition-colors"
        >
          Contact Support
        </Link>
      </p>
    </AuthBackground>
  )
}