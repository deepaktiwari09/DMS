import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { loginSchema, type LoginFormData } from '../../types/schemas'

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void> | void
  isLoading?: boolean
  onForgotPassword?: () => void
  error?: string | null
}

export function LoginForm({ onSubmit, isLoading = false, onForgotPassword, error }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const isFormLoading = isLoading || isSubmitting

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-1">
        Welcome Back!
      </h2>
      <p className="text-center text-[var(--text-secondary)] mb-6">
        Log in to manage your dealership.
      </p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Display API error */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Login Failed
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <Input
          label="Email address"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          disabled={isFormLoading}
        />

        <Input
          label="Password"
          type="password"
          {...register('password')}
          error={errors.password?.message}
          disabled={isFormLoading}
        />

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <button
              type="button"
              className="font-medium text-[var(--primary-color)] hover:text-blue-700 transition-colors"
              onClick={onForgotPassword}
              disabled={isFormLoading}
            >
              Forgot your password?
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isFormLoading}
          disabled={isFormLoading}
        >
          {isFormLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  )
}