import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode } from 'react'

// Create QueryClient with default configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except 429
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return error?.response?.status === 429 && failureCount < 3
        }
        // Retry on 5xx and network errors
        return failureCount < 3
      },
    },
    mutations: {
      retry: false,
    },
  },
})

// Provider component
interface QueryProviderProps {
  children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}