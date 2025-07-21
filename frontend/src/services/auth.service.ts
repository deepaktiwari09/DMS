import { apiMethods } from '../lib/api'
import { LoginFormData, RegisterFormData } from '../types/schemas'
import { AuthResponse, User } from '../types/api'

export const authService = {
  // User Authentication
  login: async (credentials: LoginFormData): Promise<AuthResponse> => {
    return await apiMethods.post<AuthResponse>('auth/login', credentials)
  },

  register: async (userData: RegisterFormData): Promise<AuthResponse> => {
    return await apiMethods.post<AuthResponse>('auth/register', userData)
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

  // Change password
  changePassword: async (passwords: {
    currentPassword: string
    newPassword: string
  }): Promise<void> => {
    await apiMethods.put('auth/change-password', passwords)
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<void> => {
    await apiMethods.post('auth/forgot-password', { email })
  },

  // Reset password with token
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiMethods.post('auth/reset-password', { token, newPassword })
  },
}