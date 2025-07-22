import React from 'react'
import { createRouter, RouterProvider, Outlet } from '@tanstack/react-router'
import { createRoute, createRootRoute } from '@tanstack/react-router'
import { LandingPage } from '../pages/landing/LandingPage'
import { AuthPage } from '../pages/auth/AuthPage'
import { useAuthStore } from '../stores/auth-store'

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

// Landing page route
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    const { login, register, createOrganization, joinOrganization, isLoading, availableOrganizations } = useAuthStore()

    return (
      <LandingPage
        onLoginClick={() => window.location.href = '/auth'}
        onRegisterClick={() => window.location.href = '/auth'}
        onDemoClick={() => window.location.href = '/auth'}
        onExploreModulesClick={() => {
          const modulesSection = document.getElementById('modules')
          modulesSection?.scrollIntoView({ behavior: 'smooth' })
        }}
        onChoosePlan={(planId) => {
          console.log('Plan chosen:', planId)
          window.location.href = '/auth'
        }}
        onContactSales={() => {
          alert('Contact sales functionality would be implemented here')
        }}
        onGetStartedClick={() => window.location.href = '/auth'}
        onPrivacyClick={() => {
          alert('Privacy policy would be shown here')
        }}
        onTermsClick={() => {
          alert('Terms of service would be shown here')
        }}
        onContactClick={() => {
          alert('Contact page would be shown here')
        }}
      />
    )
  },
})

// Auth page route
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: () => {
    const { 
      login, 
      register, 
      createOrganization, 
      joinOrganization, 
      fetchAvailableOrganizations,
      isLoading, 
      availableOrganizations, 
      error 
    } = useAuthStore()

    // Fetch available organizations on mount
    React.useEffect(() => {
      fetchAvailableOrganizations()
    }, [fetchAvailableOrganizations])

    return (
      <AuthPage
        onLogin={async (data) => {
          await login(data)
          // Redirect to dashboard on successful login
          window.location.href = '/dashboard'
        }}
        onRegister={async (data) => {
          await register(data)
          // Stay on auth page to show onboarding
        }}
        onCreateOrganization={async (data) => {
          await createOrganization(data)
          // Redirect to dashboard after organization creation
          window.location.href = '/dashboard'
        }}
        onJoinOrganization={async (orgId) => {
          await joinOrganization(orgId)
          // Redirect to dashboard after joining organization
          window.location.href = '/dashboard'
        }}
        onForgotPassword={() => {
          alert('Password reset functionality would be implemented here')
        }}
        isLoading={isLoading}
        availableOrganizations={availableOrganizations.map(org => ({
          id: org.id,
          name: org.name,
          memberCount: undefined // This would come from API
        }))}
      />
    )
  },
})

// Dashboard route (existing functionality)
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
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
const routeTree = rootRoute.addChildren([
  landingRoute,
  authRoute,
  dashboardRoute,
])

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