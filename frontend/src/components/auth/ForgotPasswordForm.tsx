import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../../types/schemas'

export interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => Promise<string | void> | void
  onBackToLogin?: () => void
  isLoading?: boolean
  successMessage?: string
  error?: string
}

export function ForgotPasswordForm({ 
  onSubmit, 
  onBackToLogin, 
  isLoading = false, 
  successMessage,
  error 
}: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const isFormLoading = isLoading || isSubmitting

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-1">
        Forgot Password?
      </h2>
      <p className="text-center text-[var(--text-secondary)] mb-6">
        Enter your email address and we'll send you a link to reset your password.
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
        <Input
          label="Email address"
          type="email"
          placeholder="Enter your email address"
          {...register('email')}
          error={errors.email?.message}
          disabled={isFormLoading}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full button_primary_auth"
          isLoading={isFormLoading}
          disabled={isFormLoading}
        >
          {isFormLoading ? 'Sending...' : 'Send Reset Link'}
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