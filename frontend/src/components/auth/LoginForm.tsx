import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { loginSchema, type LoginFormData } from '../../types/schemas'

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void> | void
  isLoading?: boolean
  onForgotPassword?: () => void
}

export function LoginForm({ onSubmit, isLoading = false, onForgotPassword }: LoginFormProps) {
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