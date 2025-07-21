import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authUtils } from '../lib/api'

// Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  organizationId: string
  dealershipId?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthActions {
  login: (token: string, user: User) => void
  logout: () => void
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
}

type AuthStore = AuthState & AuthActions

// Create auth store with persist middleware
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: (token: string, user: User) => {
        authUtils.setToken(token)
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      logout: () => {
        authUtils.removeToken()
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      setUser: (user: User) => {
        set({ user })
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },
    }),
    {
      name: 'auth', // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)