import { createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { AuthGuard } from '../lib/route-guards';
import { LandingRoute } from './LandingRoute';
import { AuthRoute } from './AuthRoute';
import { DashboardRoute } from './DashboardRoute';

// Root route
export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Public routes (no auth required)
export const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <AuthGuard requireAuth={false}>
      <LandingRoute />
    </AuthGuard>
  ),
});

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: () => (
    <AuthGuard requireAuth={false}>
      <AuthRoute />
    </AuthGuard>
  ),
});

// Protected routes (auth required)
export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <AuthGuard requireAuth={true}>
      <DashboardRoute />
    </AuthGuard>
  ),
});

// Route tree
export const routeTree = rootRoute.addChildren([
  landingRoute,
  authRoute,
  dashboardRoute,
]);