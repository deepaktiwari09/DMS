import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { changePasswordSchema, type ChangePasswordFormData } from '../../types/schemas'

export interface ChangePasswordFormProps {
  onSubmit: (data: ChangePasswordFormData) => Promise<void> | void
  isLoading?: boolean
  successMessage?: string
  error?: string
  onCancel?: () => void
}

export function ChangePasswordForm({ 
  onSubmit, 
  isLoading = false, 
  successMessage,
  error,
  onCancel
}: ChangePasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema)
  })

  const isFormLoading = isLoading || isSubmitting
  const newPassword = watch('newPassword')

  const handleFormSubmit = async (data: ChangePasswordFormData) => {
    try {
      await onSubmit(data)
      // Clear form on success
      reset()
    } catch {
      // Error handling is managed by parent component
    }
  }

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="typography_h2 text-center mb-1">
        Change Password
      </h2>
      <p className="text-center text-[var(--text-secondary)] mb-6">
        Update your account password for better security.
      </p>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <Input
          label="Current Password"
          type="password"
          placeholder="Enter your current password"
          {...register('currentPassword')}
          error={errors.currentPassword?.message}
          disabled={isFormLoading}
        />

        <Input
          label="New Password"
          type="password"
          placeholder="Enter your new password"
          {...register('newPassword')}
          error={errors.newPassword?.message}
          disabled={isFormLoading}
          helperText="Password must be at least 6 characters long"
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Confirm your new password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
          disabled={isFormLoading}
        />

        {/* Password strength indicator */}
        {newPassword && (
          <div className="space-y-2">
            <div className="text-sm text-[var(--text-secondary)]">Password strength:</div>
            <div className="flex space-x-1">
              <div className={`h-1 rounded flex-1 ${newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-200'}`} />
              <div className={`h-1 rounded flex-1 ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`} />
              <div className={`h-1 rounded flex-1 ${/(?=.*[A-Za-z])(?=.*\d)/.test(newPassword) ? 'bg-green-500' : 'bg-gray-200'}`} />
              <div className={`h-1 rounded flex-1 ${/(?=.*[A-Z])/.test(newPassword) ? 'bg-green-500' : 'bg-gray-200'}`} />
            </div>
            <div className="flex justify-between text-xs text-[var(--text-secondary)]">
              <span>Length</span>
              <span>8+ chars</span>
              <span>Letter + Number</span>
              <span>Uppercase</span>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onCancel}
              disabled={isFormLoading}
            >
              Cancel
            </Button>
          )}
          
          <Button
            type="submit"
            variant="primary"
            className={onCancel ? 'flex-1' : 'w-full'}
            isLoading={isFormLoading}
            disabled={isFormLoading}
          >
            {isFormLoading ? 'Updating...' : 'Change Password'}
          </Button>
        </div>
      </form>
    </div>
  )
}