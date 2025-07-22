import { createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { useAuthStore } from '../stores/auth-store';
import { useAppNavigation } from '../hooks/useNavigation';
import { LandingRoute } from './LandingRoute';
import { AuthRoute } from './AuthRoute';
import { LoginPage, ResetPasswordPage } from '../pages/auth';
import {
  DashboardHome,
  CustomersPage,
  InventoryPage,
  SalesPage,
  ServicePage,
  FinancePage,
} from '../pages/dashboard';

// Root route
export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Public routes (no auth required)
export const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingRoute,
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
});

// Auth parent route (no component, just for grouping)
export const authParentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
});

// Login route component
const LoginRouteComponent = () => {
  const { goToDashboard } = useAppNavigation();
  return <LoginPage onSuccess={goToDashboard} />;
};

// Register route component
const RegisterRouteComponent = () => <AuthRoute />;

// Login route
export const loginRoute = createRoute({
  getParentRoute: () => authParentRoute,
  path: '/login',
  component: LoginRouteComponent,
});

// Register route  
export const registerRoute = createRoute({
  getParentRoute: () => authParentRoute,
  path: '/register',
  component: RegisterRouteComponent,
});

export const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  component: ResetPasswordPage,
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
});

// Helper function for authentication check
const requireAuth = () => {
  const { isAuthenticated } = useAuthStore.getState();
  
  // For development: Allow access to dashboard if no auth is set up
  // Remove this in production
  if (typeof window !== 'undefined' && window.location.search.includes('dev=true')) {
    console.log('Development mode: bypassing authentication');
    return;
  }
  
  if (!isAuthenticated) {
    throw redirect({ 
      to: '/auth/login',
      search: {
        redirect: window.location.pathname,
      },
    });
  }
};

// Dashboard routes (protected)
export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardHome,
  beforeLoad: requireAuth,
});

export const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/customers',
  component: CustomersPage,
  beforeLoad: requireAuth,
});

export const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/inventory',
  component: InventoryPage,
  beforeLoad: requireAuth,
});

export const salesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/sales',
  component: SalesPage,
  beforeLoad: requireAuth,
});

export const serviceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/service',
  component: ServicePage,
  beforeLoad: requireAuth,
});

export const financeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/finance',
  component: FinancePage,
  beforeLoad: requireAuth,
});

// Route tree
export const routeTree = rootRoute.addChildren([
  landingRoute,
  authParentRoute.addChildren([
    loginRoute,
    registerRoute,
  ]),
  resetPasswordRoute,
  dashboardRoute,
  customersRoute,
  inventoryRoute,
  salesRoute,
  serviceRoute,
  financeRoute,
]);