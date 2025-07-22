import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { OnboardingForm } from './OnboardingForm'
import { type LoginFormData, type RegisterFormData, type OrganizationFormData } from '../../types/schemas'

export interface AuthTabsProps {
  onLogin?: (data: LoginFormData) => Promise<void> | void
  onRegister?: (data: RegisterFormData) => Promise<void> | void
  onCreateOrganization?: (data: OrganizationFormData) => Promise<void> | void
  onJoinOrganization?: (orgId: string) => Promise<void> | void
  onForgotPassword?: () => void
  isLoading?: boolean
  availableOrganizations?: Array<{ 
    id: string
    name: string 
    memberCount?: number 
  }>
}

type TabType = 'login' | 'register' | 'onboarding'

export function AuthTabs({
  onLogin,
  onRegister,
  onCreateOrganization,
  onJoinOrganization,
  onForgotPassword,
  isLoading = false,
  availableOrganizations = []
}: AuthTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('login')

  const handleRegisterSuccess = async (data: RegisterFormData) => {
    if (onRegister) {
      await onRegister(data)
      // After successful registration, move to onboarding
      setActiveTab('onboarding')
    }
  }

  const handleLoginSuccess = async (data: LoginFormData) => {
    if (onLogin) {
      await onLogin(data)
      // After successful login, could redirect or show dashboard
      // For demo purposes, move to onboarding
      setActiveTab('onboarding')
    }
  }

  if (activeTab === 'onboarding') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl mx-auto">
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

          <OnboardingForm
            onCreateOrganization={onCreateOrganization}
            onJoinOrganization={onJoinOrganization}
            onBack={() => setActiveTab('login')}
            isLoading={isLoading}
            availableOrganizations={availableOrganizations}
          />
        </div>
      </div>
    )
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

        {/* Auth Form Container */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-3 px-1 text-center font-medium focus:outline-none transition-colors duration-300 ${
                  activeTab === 'login'
                    ? 'border-b-2 border-[var(--primary-color)] text-[var(--primary-color)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--primary-color)]'
                }`}
                disabled={isLoading}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-3 px-1 text-center font-medium focus:outline-none transition-colors duration-300 ${
                  activeTab === 'register'
                    ? 'border-b-2 border-[var(--primary-color)] text-[var(--primary-color)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--primary-color)]'
                }`}
                disabled={isLoading}
              >
                Register
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'login' && (
            <LoginForm
              onSubmit={handleLoginSuccess}
              isLoading={isLoading}
              onForgotPassword={onForgotPassword}
            />
          )}

          {activeTab === 'register' && (
            <RegisterForm
              onSubmit={handleRegisterSuccess}
              isLoading={isLoading}
              availableOrganizations={availableOrganizations}
            />
          )}
        </div>
      </div>
    </div>
  )
}