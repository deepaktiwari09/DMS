import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authUtils } from '../lib/api'
import { authService } from '../services/auth.service'
import { type LoginFormData, type RegisterFormData, type OrganizationFormData, type ForgotPasswordFormData, type ResetPasswordFormData, type ChangePasswordFormData } from '../types/schemas'
import { type User, type Organization } from '../types/api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  availableOrganizations: Organization[]
  error: string | null
}

interface AuthActions {
  // Core auth actions
  login: (credentials: LoginFormData) => Promise<void>
  register: (userData: RegisterFormData) => Promise<void>
  logout: () => Promise<void>
  
  // Organization actions
  createOrganization: (orgData: OrganizationFormData) => Promise<Organization>
  joinOrganization: (orgId: string) => Promise<void>
  fetchAvailableOrganizations: () => Promise<void>
  
  // Password management actions
  forgotPassword: (forgotPasswordData: ForgotPasswordFormData) => Promise<string>
  resetPassword: (resetPasswordData: ResetPasswordFormData) => Promise<string>
  changePassword: (changePasswordData: ChangePasswordFormData) => Promise<string>
  
  // Utility actions
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  
  // Development helper
  setMockAuth: () => void
}

type AuthStore = AuthState & AuthActions

// Create auth store with persist middleware
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      availableOrganizations: [],
      error: null,

      // Core auth actions
      login: async (credentials: LoginFormData) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authService.login(credentials)
          
          authUtils.setToken(response.token)
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error?.message || 'Login failed',
          })
          throw error
        }
      },

      register: async (userData: RegisterFormData) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authService.register(userData)
          
          authUtils.setToken(response.token)
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error?.message || 'Registration failed',
          })
          throw error
        }
      },

      logout: async () => {
        try {
          await authService.logout()
        } catch (error) {
          // Continue with logout even if server call fails
          console.warn('Server logout failed:', error)
        } finally {
          authUtils.removeToken()
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            availableOrganizations: [],
            error: null,
          })
        }
      },

      // Organization actions
      createOrganization: async (orgData: OrganizationFormData) => {
        try {
          set({ isLoading: true, error: null })
          
          const organization = await authService.createOrganization(orgData)
          
          // Update user's organization association if needed
          const currentUser = get().user
          if (currentUser) {
            set({
              user: { ...currentUser, organizationId: organization.id },
              isLoading: false,
            })
          } else {
            set({ isLoading: false })
          }
          
          return organization
        } catch (error: any) {
          set({
            isLoading: false,
            error: error?.message || 'Failed to create organization',
          })
          throw error
        }
      },

      joinOrganization: async (orgId: string) => {
        try {
          set({ isLoading: true, error: null })
          
          // In a real implementation, this would be an API call
          // For now, we'll just update the user's organization
          const currentUser = get().user
          if (currentUser) {
            set({
              user: { ...currentUser, organizationId: orgId },
              isLoading: false,
            })
          } else {
            set({ isLoading: false })
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error?.message || 'Failed to join organization',
          })
          throw error
        }
      },

      fetchAvailableOrganizations: async () => {
        try {
          const organizations = await authService.getAvailableOrganizations()
          set({ availableOrganizations: organizations })
        } catch (error: any) {
          set({
            error: error?.message || 'Failed to fetch organizations',
          })
        }
      },

      // Password management actions
      forgotPassword: async (forgotPasswordData: ForgotPasswordFormData) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authService.forgotPassword(forgotPasswordData)
          
          set({ isLoading: false })
          return response.message
        } catch (error: any) {
          set({
            isLoading: false,
            error: error?.message || 'Failed to send password reset email',
          })
          throw error
        }
      },

      resetPassword: async (resetPasswordData: ResetPasswordFormData) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authService.resetPasswordWithForm(resetPasswordData)
          
          set({ isLoading: false })
          return response.message
        } catch (error: any) {
          set({
            isLoading: false,
            error: error?.message || 'Failed to reset password',
          })
          throw error
        }
      },

      changePassword: async (changePasswordData: ChangePasswordFormData) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authService.changePassword(changePasswordData)
          
          set({ isLoading: false })
          return response.message
        } catch (error: any) {
          set({
            isLoading: false,
            error: error?.message || 'Failed to change password',
          })
          throw error
        }
      },

      // Utility actions
      setUser: (user: User) => {
        set({ user })
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      clearError: () => {
        set({ error: null })
      },

      // Development helper - remove in production
      setMockAuth: () => {
        set({
          isAuthenticated: true,
          user: {
            id: 'dev-user',
            email: 'dev@motocorp.com',
            firstName: 'Dev',
            lastName: 'User',
            role: 'admin',
            organizationId: 'dev-org',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: 'dev-token',
          error: null,
        })
      },
    }),
    {
      name: 'auth', // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        availableOrganizations: state.availableOrganizations,
      }),
    }
  )
)