import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '../ui'
import { customerSchema, CustomerFormData } from '../../types/schemas'
import { Customer } from '../../types/api'
import { cn } from '../../lib/utils'

interface CustomerFormProps {
  customer?: Customer
  onSubmit: (data: CustomerFormData) => Promise<void>
  onCancel?: () => void
  className?: string
}

export function CustomerForm({ 
  customer, 
  onSubmit, 
  onCancel, 
  className 
}: CustomerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer ? {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      zipCode: customer.zipCode || '',
      notes: customer.notes || '',
      status: customer.status,
    } : {
      status: 'lead',
    },
    mode: 'onChange',
  })

  const handleFormSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await onSubmit(data)
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to save customer. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={cn('w-full max-w-2xl', className)}>
      <CardHeader>
        <CardTitle>
          {customer ? 'Edit Customer' : 'Add New Customer'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="Enter first name"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            
            <Input
              label="Last Name"
              placeholder="Enter last name"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              error={errors.email?.message}
              {...register('email')}
              leftIcon={
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              }
            />
            
            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter phone number"
              error={errors.phone?.message}
              {...register('phone')}
              leftIcon={
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              }
            />
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <Input
              label="Address"
              placeholder="Enter street address"
              error={errors.address?.message}
              {...register('address')}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                placeholder="Enter city"
                error={errors.city?.message}
                {...register('city')}
              />
              
              <Input
                label="State"
                placeholder="Enter state"
                error={errors.state?.message}
                {...register('state')}
              />
              
              <Input
                label="ZIP Code"
                placeholder="Enter ZIP code"
                error={errors.zipCode?.message}
                {...register('zipCode')}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Status
            </label>
            <select
              className="input"
              {...register('status')}
            >
              <option value="lead">Lead</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Notes
            </label>
            <textarea
              className="input min-h-[100px] resize-y"
              placeholder="Add any additional notes about this customer..."
              {...register('notes')}
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>

          {/* Error Display */}
          {submitError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {submitError}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={!isValid || (!isDirty && !!customer) || isSubmitting}
            >
              {isSubmitting 
                ? (customer ? 'Updating...' : 'Creating...') 
                : (customer ? 'Update Customer' : 'Create Customer')
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}