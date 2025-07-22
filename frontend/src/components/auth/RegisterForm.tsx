import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { registerSchema, type RegisterFormData } from '../../types/schemas'

export interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void> | void
  isLoading?: boolean
  error?: string | null
}

export function RegisterForm({ 
  onSubmit, 
  isLoading = false,
  error 
}: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const isFormLoading = isLoading || isSubmitting

  const EyeIcon = ({ isVisible }: { isVisible: boolean }) => (
    <svg
      className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {isVisible ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
        />
      )}
    </svg>
  )

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-1">
        Create an Account
      </h2>
      <p className="text-center text-[var(--text-secondary)] mb-6">
        Join DealerFlow and streamline your business.
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
                  Registration Failed
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={<>First Name <span className="text-red-500">*</span></>}
            type="text"
            {...register('firstName')}
            error={errors.firstName?.message}
            disabled={isFormLoading}
          />

          <Input
            label={<>Last Name <span className="text-red-500">*</span></>}
            type="text"
            {...register('lastName')}
            error={errors.lastName?.message}
            disabled={isFormLoading}
          />
        </div>

        <Input
          label={<>Email address <span className="text-red-500">*</span></>}
          type="email"
          {...register('email')}
          error={errors.email?.message}
          disabled={isFormLoading}
        />

        <Input
          label={<>Password <span className="text-red-500">*</span></>}
          type={showPassword ? 'text' : 'password'}
          {...register('password')}
          error={errors.password?.message}
          disabled={isFormLoading}
          rightIcon={<div onClick={() => setShowPassword(!showPassword)}><EyeIcon isVisible={showPassword} /></div>}
        />

        <Input
          label={<>Confirm Password <span className="text-red-500">*</span></>}
          type={showConfirmPassword ? 'text' : 'password'}
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
          disabled={isFormLoading}
          rightIcon={<div onClick={() => setShowConfirmPassword(!showConfirmPassword)}><EyeIcon isVisible={showConfirmPassword} /></div>}
        />

        <Input
          label={<>Organization Name <span className="text-red-500">*</span></>}
          type="text"
          placeholder="Enter your dealership name"
          {...register('organizationName')}
          error={errors.organizationName?.message}
          disabled={isFormLoading}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isFormLoading}
          disabled={isFormLoading}
        >
          {isFormLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
    </div>
  )
}