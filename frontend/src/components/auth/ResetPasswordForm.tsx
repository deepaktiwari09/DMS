import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { resetPasswordSchema, type ResetPasswordFormData } from '../../types/schemas'

export interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordFormData) => Promise<void> | void
  token?: string
  onBackToLogin?: () => void
  isLoading?: boolean
  successMessage?: string
  error?: string
  isTokenValid?: boolean
}

export function ResetPasswordForm({ 
  onSubmit, 
  token = '',
  onBackToLogin, 
  isLoading = false, 
  successMessage,
  error,
  isTokenValid = true
}: ResetPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
    }
  })

  const isFormLoading = isLoading || isSubmitting
  const newPassword = watch('newPassword')

  // Don't show the form if token is invalid
  if (!isTokenValid) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-1">
          Invalid Reset Link
        </h2>
        <p className="text-center text-[var(--text-secondary)] mb-6">
          This password reset link is invalid or has expired.
        </p>
        
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          The password reset token is invalid or has expired. Please request a new password reset link.
        </div>

        {onBackToLogin && (
          <div className="text-center">
            <Button
              type="button"
              onClick={onBackToLogin}
              variant="primary"
              className="w-full button_primary_auth"
            >
              Back to Login
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-1">
        Reset Your Password
      </h2>
      <p className="text-center text-[var(--text-secondary)] mb-6">
        Enter your new password below.
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
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Hidden token field */}
        <input
          type="hidden"
          {...register('token')}
        />

        <Input
          label="New Password"
          type="password"
          placeholder="Enter your new password"
          {...register('newPassword')}
          error={errors.newPassword?.message}
          disabled={isFormLoading}
          helperText="Password must be at least 6 characters and contain at least one letter and one number"
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
              <div className={`h-1 rounded flex-1 ${/(?=.*[A-Za-z])/.test(newPassword) ? 'bg-green-500' : 'bg-gray-200'}`} />
              <div className={`h-1 rounded flex-1 ${/(?=.*\d)/.test(newPassword) ? 'bg-green-500' : 'bg-gray-200'}`} />
              <div className={`h-1 rounded flex-1 ${/(?=.*[A-Z])/.test(newPassword) ? 'bg-green-500' : 'bg-gray-200'}`} />
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full button_primary_auth"
          isLoading={isFormLoading}
          disabled={isFormLoading}
        >
          {isFormLoading ? 'Resetting Password...' : 'Reset Password'}
        </Button>

        {onBackToLogin && (
          <div className="text-center">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-[var(--primary-color)] hover:underline text-sm"
              disabled={isFormLoading}
            >
              ← Back to Login
            </button>
          </div>
        )}
      </form>
    </div>
  )
}