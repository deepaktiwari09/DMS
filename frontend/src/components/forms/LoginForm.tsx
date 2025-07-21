import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Button, Input } from '../ui'
import { loginSchema, LoginFormData } from '../../types/schemas'
import { useAuthStore } from '../../stores/auth-store'
import { authService } from '../../services/auth.service'
import { cn } from '../../lib/utils'

interface LoginFormProps {
  onSuccess?: () => void
  className?: string
}

export function LoginForm({ onSuccess, className }: LoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  const login = useAuthStore((state) => state.login)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await authService.login(data)
      login(response.token, response.user)
      onSuccess?.()
    } catch (error: any) {
      setSubmitError(error.message || 'Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn('w-full max-w-md', className)}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register('email')}
            leftIcon={
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            }
          />
        </div>

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register('password')}
            leftIcon={
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            }
          />
        </div>

        {submitError && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {submitError}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isSubmitting}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </Button>

        <div className="text-center">
          <a
            href="#"
            className="text-sm text-primary-color hover:underline"
            onClick={(e) => {
              e.preventDefault()
              // Handle forgot password
            }}
          >
            Forgot your password?
          </a>
        </div>
      </form>
    </div>
  )
}