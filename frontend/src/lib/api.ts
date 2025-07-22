import ky from 'ky'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Create ky instance with default configuration
export const api = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 30000,
  retry: {
    limit: 2,
    methods: ['get', 'put', 'delete'],
  },
  hooks: {
    beforeRequest: [
      (request) => {
        // Add JWT token if available
        const token = localStorage.getItem('auth_token')
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
        
        // Add content-type for JSON requests
        if (request.method !== 'GET' && !request.headers.get('content-type')) {
          request.headers.set('Content-Type', 'application/json')
        }
      },
    ],
    beforeError: [
      async (error) => {
        const { response } = error
        if (response && response.body) {
          const errorBody = await response.text()
          try {
            const parsedError = JSON.parse(errorBody)
            error.name = 'APIError'
            error.message = parsedError.message || `HTTP ${response.status}`
          } catch {
            error.message = errorBody || `HTTP ${response.status}`
          }
        }
        return error
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        // Handle 401 Unauthorized - but only redirect if it's not a login attempt
        if (response.status === 401) {
          const url = new URL(request.url)
          const isLoginAttempt = url.pathname.includes('/auth/login') || url.pathname.includes('/auth/register')
          
          if (!isLoginAttempt) {
            // This is likely an expired token, redirect to login
            localStorage.removeItem('auth_token')
            window.location.href = '/auth/login'
          }
          // If it's a login attempt, let the error bubble up to show the error message
        }
        return response
      },
    ],
  },
})

// API Response Types
export interface APIResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface APIError {
  message: string
  statusCode: number
  error?: string
}

// Generic API methods
export const apiMethods = {
  // GET request
  get: <T = any>(url: string, options?: any): Promise<T> =>
    api.get(url, options).json(),

  // POST request  
  post: <T = any>(url: string, data?: any, options?: any): Promise<T> =>
    api.post(url, { json: data, ...options }).json(),

  // PUT request
  put: <T = any>(url: string, data?: any, options?: any): Promise<T> =>
    api.put(url, { json: data, ...options }).json(),

  // PATCH request
  patch: <T = any>(url: string, data?: any, options?: any): Promise<T> =>
    api.patch(url, { json: data, ...options }).json(),

  // DELETE request
  delete: <T = any>(url: string, options?: any): Promise<T> =>
    api.delete(url, options).json(),
}

// Auth utilities
export const authUtils = {
  setToken: (token: string) => {
    localStorage.setItem('auth_token', token)
  },
  
  getToken: (): string | null => {
    return localStorage.getItem('auth_token')
  },
  
  removeToken: () => {
    localStorage.removeItem('auth_token')
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token')
  },
}