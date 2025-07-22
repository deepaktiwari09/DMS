import { z } from 'zod'

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
  role: z.enum(['admin', 'manager', 'sales', 'service', 'viewer']).default('admin'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Organization Schema for new organization creation
export const organizationSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Please enter a valid address'),
  city: z.string().min(2, 'City is required').optional(),
  state: z.string().min(2, 'State is required').optional(),
  zipCode: z.string().min(5, 'ZIP code is required').optional(),
})

// Customer Schemas
export const customerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['lead', 'active', 'inactive']).default('lead'),
})

// Inventory Schemas
export const inventorySchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  category: z.enum(['motorcycle', 'part', 'accessory']),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  price: z.number().positive('Price must be greater than 0'),
  cost: z.number().positive('Cost must be greater than 0').optional(),
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
  minStock: z.number().int().min(0, 'Minimum stock cannot be negative').default(0),
  location: z.string().optional(),
})

// Sales Schemas
export const saleSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  inventoryItems: z.array(z.object({
    inventoryId: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
  })).min(1, 'At least one item is required'),
  stage: z.enum(['inquiry', 'quote', 'negotiation', 'closed_won', 'closed_lost']).default('inquiry'),
  notes: z.string().optional(),
  expectedCloseDate: z.string().optional(),
  probability: z.number().int().min(0).max(100).default(50),
})

// Service Appointment Schemas
export const serviceAppointmentSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  vehicleInfo: z.string().min(1, 'Vehicle information is required'),
  serviceType: z.enum(['maintenance', 'repair', 'inspection', 'warranty']),
  description: z.string().min(10, 'Please provide a detailed description'),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  estimatedDuration: z.number().positive('Duration must be greater than 0'),
  assignedTechnician: z.string().optional(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).default('scheduled'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  notes: z.string().optional(),
})

// User Schemas
export const userSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  role: z.enum(['admin', 'manager', 'sales', 'service', 'viewer']),
  dealershipId: z.string().optional(),
  isActive: z.boolean().default(true),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain at least one letter and one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Export types for TypeScript
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type OrganizationFormData = z.infer<typeof organizationSchema>
export type CustomerFormData = z.infer<typeof customerSchema>
export type InventoryFormData = z.infer<typeof inventorySchema>
export type SaleFormData = z.infer<typeof saleSchema>
export type ServiceAppointmentFormData = z.infer<typeof serviceAppointmentSchema>
export type UserFormData = z.infer<typeof userSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>