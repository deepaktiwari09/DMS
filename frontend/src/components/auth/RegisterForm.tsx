import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { registerSchema, type RegisterFormData } from '../../types/schemas'

export interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void> | void
  isLoading?: boolean
  availableOrganizations?: Array<{ id: string; name: string; memberCount?: number }>
}

export function RegisterForm({ 
  onSubmit, 
  isLoading = false, 
  availableOrganizations = [] 
}: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'sales'
    }
  })

  const isFormLoading = isLoading || isSubmitting

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-1">
        Create an Account
      </h2>
      <p className="text-center text-[var(--text-secondary)] mb-6">
        Join DealerFlow and streamline your business.
      </p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            {...register('firstName')}
            error={errors.firstName?.message}
            disabled={isFormLoading}
          />

          <Input
            label="Last Name"
            type="text"
            {...register('lastName')}
            error={errors.lastName?.message}
            disabled={isFormLoading}
          />
        </div>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization
          </label>
          <select
            {...register('organizationId')}
            className="input_field"
            disabled={isFormLoading}
          >
            <option value="">Select an organization</option>
            {availableOrganizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name} {org.memberCount && `(${org.memberCount} members)`}
              </option>
            ))}
          </select>
          {errors.organizationId && (
            <p className="text-sm text-red-600 mt-1">{errors.organizationId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            {...register('role')}
            className="input_field"
            disabled={isFormLoading}
          >
            <option value="sales">Sales</option>
            <option value="service">Service</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
          {errors.role && (
            <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>
          )}
        </div>

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