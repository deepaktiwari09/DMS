import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { organizationSchema, type OrganizationFormData } from '../../types/schemas'

export interface OnboardingFormProps {
  onCreateOrganization?: (data: OrganizationFormData) => Promise<void> | void
  onJoinOrganization?: (orgId: string) => Promise<void> | void
  onBack?: () => void
  isLoading?: boolean
  availableOrganizations?: Array<{ 
    id: string
    name: string 
    memberCount?: number 
  }>
}

export function OnboardingForm({
  onCreateOrganization,
  onJoinOrganization,
  onBack,
  isLoading = false,
  availableOrganizations = []
}: OnboardingFormProps) {
  const [selectedOrgId, setSelectedOrgId] = useState<string>('')
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema)
  })

  const isFormLoading = isLoading || isSubmitting

  const handleJoinOrganization = async (orgId: string) => {
    if (onJoinOrganization) {
      await onJoinOrganization(orgId)
    }
  }

  return (
    <div className="bg-white p-8 sm:p-12 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[var(--text-primary)]">
          Welcome to DealerFlow!
        </h2>
        <p className="mt-2 text-lg text-[var(--text-secondary)]">
          Let's set up your organization to get started.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Create New Organization */}
        <div className="bg-[var(--secondary-color)] p-8 rounded-lg border border-gray-200">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
            Create a New Organization
          </h3>
          <p className="text-[var(--text-secondary)] mb-6">
            Set up a new company profile for your dealership.
          </p>
          
          <form onSubmit={handleSubmit(onCreateOrganization || (() => {}))} className="space-y-4">
            <Input
              label="Organization Name"
              type="text"
              placeholder="e.g., Apex Motors"
              {...register('name')}
              error={errors.name?.message}
              disabled={isFormLoading}
            />

            <Input
              label="Contact Phone"
              type="tel"
              placeholder="(555) 123-4567"
              {...register('phone')}
              error={errors.phone?.message}
              disabled={isFormLoading}
            />

            <Input
              label="Address"
              type="text"
              placeholder="123 Main St, Anytown"
              {...register('address')}
              error={errors.address?.message}
              disabled={isFormLoading}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="City"
                type="text"
                placeholder="City"
                {...register('city')}
                error={errors.city?.message}
                disabled={isFormLoading}
              />

              <Input
                label="State"
                type="text"
                placeholder="State"
                {...register('state')}
                error={errors.state?.message}
                disabled={isFormLoading}
              />
            </div>

            <Input
              label="ZIP Code"
              type="text"
              placeholder="12345"
              {...register('zipCode')}
              error={errors.zipCode?.message}
              disabled={isFormLoading}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isFormLoading}
                disabled={isFormLoading}
              >
                {isFormLoading ? 'Creating...' : 'Create & Continue'}
              </Button>
            </div>
          </form>
        </div>

        {/* Join Existing Organization */}
        <div className="bg-[var(--secondary-color)] p-8 rounded-lg border border-gray-200">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
            Join an Existing Organization
          </h3>
          <p className="text-[var(--text-secondary)] mb-6">
            Select from a list of organizations you've been invited to or have previously joined.
          </p>

          <div className="space-y-3">
            {availableOrganizations.length > 0 ? (
              availableOrganizations.map((org) => (
                <div
                  key={org.id}
                  className={`flex items-center justify-between p-4 bg-white rounded-md border cursor-pointer transition-all ${
                    selectedOrgId === org.id 
                      ? 'border-[var(--primary-color)] ring-2 ring-[var(--primary-color)]/20' 
                      : 'border-gray-300 hover:border-[var(--primary-color)]'
                  }`}
                  onClick={() => setSelectedOrgId(org.id)}
                >
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">
                      {org.name}
                    </p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {org.memberCount ? `${org.memberCount} Members` : 'No member info'}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 5l7 7-7 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              ))
            ) : (
              <div className="text-center p-8 text-[var(--text-secondary)]">
                <p>No organizations available to join.</p>
              </div>
            )}

            {selectedOrgId && (
              <div className="pt-4">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handleJoinOrganization(selectedOrgId)}
                  isLoading={isFormLoading}
                  disabled={isFormLoading}
                >
                  {isFormLoading ? 'Joining...' : 'Join Organization'}
                </Button>
              </div>
            )}

            <div className="text-center pt-4">
              <button className="text-sm font-medium text-[var(--primary-color)] hover:text-blue-700 transition-colors">
                Don't see your organization? Request access.
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={isFormLoading}
        >
          ← Back to Login
        </Button>
      </div>
    </div>
  )
}