import { createRouter, RouterProvider } from '@tanstack/react-router'
import { createRoute, createRootRoute } from '@tanstack/react-router'

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background">
      <div className="main_container">
        <header className="mb-8">
          <h1 className="typography_h1">MotoCorp DMS</h1>
          <p className="typography_body">Dealership Management System Dashboard</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-text-primary mb-2">Customers</h3>
            <p className="typography_body">Manage customer relationships and leads</p>
          </div>
          
          <div className="card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-text-primary mb-2">Inventory</h3>
            <p className="typography_body">Track vehicles, parts, and accessories</p>
          </div>
          
          <div className="card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-text-primary mb-2">Sales</h3>
            <p className="typography_body">Monitor sales pipeline and deals</p>
          </div>
          
          <div className="card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-text-primary mb-2">Service</h3>
            <p className="typography_body">Schedule and manage service appointments</p>
          </div>
        </div>
      </div>
    </div>
  ),
})

// Create route tree
const routeTree = rootRoute

// Create router instance
export const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
})

// Register types for better TypeScript support
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export type Router = typeof router

// Router component
export function AppRouter() {
  return <RouterProvider router={router} />
}