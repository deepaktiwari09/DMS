import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { StepIndicator } from '../../components/auth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuthStore } from '../../stores/auth-store'
import { z } from 'zod'
import { apiMethods } from '../../lib/api'

export interface OnboardingPageProps {
  /**
   * Callback for completion of onboarding process
   */
  onComplete?: () => void
}

// Step 1: Dealership Setup Form Data
interface DealershipStepData {
  dealershipName: string
  location: string
  timezone: string
  businessHoursStart: string
  businessHoursEnd: string
  dealershipId?: string
}

// Step 2: User Invite Form Data
interface UserInviteStepData {
  userEmail: string
  userPermissions: string
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const navigate = useNavigate()
  const { isLoading, setLoading, setError } = useAuthStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [dealershipData, setDealershipData] = useState<DealershipStepData | null>(null)

  const steps = [
    'Add your first Dealership', 
    'Invite a User'
  ]

  const handleDealershipSubmit = async (data: DealershipStepData) => {
    try {
      setLoading(true)
      
      // Create dealership using API
      const dealership = await apiMethods.post('dealerships', {
        name: data.dealershipName,
        location: {
          address: data.location
        },
        timezone: data.timezone,
        businessHours: {
          monday: { open: data.businessHoursStart, close: data.businessHoursEnd },
          tuesday: { open: data.businessHoursStart, close: data.businessHoursEnd },
          wednesday: { open: data.businessHoursStart, close: data.businessHoursEnd },
          thursday: { open: data.businessHoursStart, close: data.businessHoursEnd },
          friday: { open: data.businessHoursStart, close: data.businessHoursEnd },
          saturday: { closed: true },
          sunday: { closed: true }
        }
      })
      
      setDealershipData({ ...data, dealershipId: dealership.id })
      setCurrentStep(2)
      setLoading(false)
    } catch (error: any) {
      console.error('Dealership creation failed:', error)
      setError(error?.message || 'Failed to create dealership')
      setLoading(false)
    }
  }

  const handleSkipDealership = () => {
    setCurrentStep(2)
  }

  const handleUserInviteSubmit = async (data: UserInviteStepData) => {
    try {
      setLoading(true)
      
      // Create user invitation using API
      await apiMethods.post('users', {
        email: data.userEmail,
        firstName: 'Invited',
        lastName: 'User',
        password: 'TempPassword123!', // This should be handled by email invitation
        role: data.userPermissions,
        dealershipId: dealershipData?.dealershipId
      })
      
      // Complete onboarding
      setLoading(false)
      if (onComplete) {
        onComplete()
      } else {
        navigate({ to: '/dashboard' })
      }
    } catch (error: any) {
      console.error('User invite failed:', error)
      setError(error?.message || 'Failed to invite user')
      setLoading(false)
    }
  }

  const handleSkipToFinish = () => {
    if (onComplete) {
      onComplete()
    } else {
      navigate({ to: '/dashboard' })
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl mx-auto">
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

        {/* Main Card */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          {/* Step Indicator */}
          <div className="mb-8">
            <StepIndicator
              currentStep={currentStep}
              totalSteps={2}
              steps={steps}
            />
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <DealershipSetupStep 
              onSubmit={handleDealershipSubmit}
              onSkip={handleSkipDealership}
              isLoading={isLoading}
            />
          )}

          {currentStep === 2 && (
            <UserInviteStep 
              onSubmit={handleUserInviteSubmit}
              onSkip={handleSkipToFinish}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Step 1: Dealership Setup Component
function DealershipSetupStep({ 
  onSubmit, 
  onSkip, 
  isLoading 
}: { 
  onSubmit: (data: DealershipStepData) => void
  onSkip: () => void
  isLoading: boolean 
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<DealershipStepData>()

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            1
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Add your first Dealership
            </h2>
            <p className="text-md text-gray-600 mt-1">
              You can add your first dealership now, or do it later.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Dealership Name"
          placeholder="e.g., Apex Downtown"
          {...register('dealershipName')}
          error={errors.dealershipName?.message}
          disabled={isLoading}
        />

        <Input
          label="Location"
          placeholder="e.g., 123 Main St, Anytown, USA"
          {...register('location')}
          error={errors.location?.message}
          disabled={isLoading}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
            {...register('timezone')}
            disabled={isLoading}
          >
            <option value="GMT-07:00">(GMT-07:00) Mountain Time (US & Canada)</option>
            <option value="GMT-05:00">(GMT-05:00) Eastern Time (US & Canada)</option>
            <option value="GMT-06:00">(GMT-06:00) Central Time (US & Canada)</option>
            <option value="GMT-08:00">(GMT-08:00) Pacific Time (US & Canada)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="e.g., 9:00 AM"
              {...register('businessHoursStart')}
              error={errors.businessHoursStart?.message}
              disabled={isLoading}
            />
            <Input
              placeholder="e.g., 6:00 PM"
              {...register('businessHoursEnd')}
              error={errors.businessHoursEnd?.message}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onSkip}
            disabled={isLoading}
          >
            Skip & Add User
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            Add Dealership & Continue
          </Button>
        </div>

        <div className="text-center">
          <button
            type="button"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            onClick={onSkip}
            disabled={isLoading}
          >
            Skip for now
          </button>
        </div>
      </form>
    </div>
  )
}

// Step 3: User Invite Component
function UserInviteStep({ 
  onSubmit, 
  onSkip, 
  isLoading 
}: { 
  onSubmit: (data: UserInviteStepData) => void
  onSkip: () => void
  isLoading: boolean 
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<UserInviteStepData>()

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            2
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Invite a User
            </h2>
            <p className="text-md text-gray-600 mt-1">
              Add a team member to your organization.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="User Email"
          type="email"
          placeholder="teammate@example.com"
          {...register('userEmail')}
          error={errors.userEmail?.message}
          disabled={isLoading}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
            {...register('userPermissions')}
            disabled={isLoading}
          >
            <option value="admin">Admin (All Dealerships)</option>
            <option value="manager">Manager (Specific Dealership)</option>
            <option value="sales">Sales (Specific Dealership)</option>
            <option value="viewer">Viewer (Read-only)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onSkip}
            disabled={isLoading}
          >
            Skip
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            Invite User & Finish
          </Button>
        </div>
      </form>
    </div>
  )
}