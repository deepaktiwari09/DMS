import { apiMethods } from '../lib/api'
import { type LoginFormData, type RegisterFormData, type OrganizationFormData, type ForgotPasswordFormData, type ResetPasswordFormData, type ChangePasswordFormData } from '../types/schemas'
import { type AuthResponse, type User, type Organization } from '../types/api'

export const authService = {
  // User Authentication
  login: async (credentials: LoginFormData): Promise<AuthResponse> => {
    return await apiMethods.post<AuthResponse>('auth/login', credentials)
  },

  register: async (userData: RegisterFormData): Promise<AuthResponse> => {
    return await apiMethods.post<AuthResponse>('auth/register', userData)
  },

  // Organization Management
  createOrganization: async (orgData: OrganizationFormData): Promise<Organization> => {
    return await apiMethods.post<Organization>('organizations', orgData)
  },

  getAvailableOrganizations: async (): Promise<Organization[]> => {
    return await apiMethods.get<Organization[]>('organizations')
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    return await apiMethods.get<User>('auth/profile')
  },

  // Refresh token
  refreshToken: async (): Promise<AuthResponse> => {
    return await apiMethods.post<AuthResponse>('auth/refresh')
  },

  // Logout (server-side cleanup if needed)
  logout: async (): Promise<void> => {
    try {
      await apiMethods.post('auth/logout')
    } catch (error) {
      // Handle logout gracefully - even if server call fails, we should clear local state
      console.warn('Server logout failed:', error)
    }
  },


  // Password Management - New Methods
  // Request password reset (forgot password)
  forgotPassword: async (forgotPasswordData: ForgotPasswordFormData): Promise<{ message: string }> => {
    return await apiMethods.post<{ message: string }>('auth/forgot-password', forgotPasswordData)
  },

  // Reset password with form data
  resetPasswordWithForm: async (resetPasswordData: ResetPasswordFormData): Promise<{ message: string }> => {
    return await apiMethods.post<{ message: string }>('auth/reset-password', {
      token: resetPasswordData.token,
      newPassword: resetPasswordData.newPassword,
    })
  },

  // Change password for authenticated user
  changePassword: async (changePasswordData: ChangePasswordFormData): Promise<{ message: string }> => {
    return await apiMethods.put<{ message: string }>('auth/change-password', {
      currentPassword: changePasswordData.currentPassword,
      newPassword: changePasswordData.newPassword,
    })
  },
}