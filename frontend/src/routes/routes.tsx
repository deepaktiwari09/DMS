import {
  createRoute,
  createRootRoute,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { useAuthStore } from "../stores/auth-store";
import { useAppNavigation } from "../hooks/useNavigation";
import { LandingRoute } from "./LandingRoute";

import {
  DashboardHome,
  CustomersPage,
  InventoryPage,
  SalesPage,
  ServicePage,
  FinancePage,
} from "../pages/dashboard";

import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  OnboardingPage,
} from "../pages/auth";

// Root route
export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Public routes (no auth required)
export const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingRoute,
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
});

// Helper function for authentication check
const requireAuth = () => {
  const { isAuthenticated } = useAuthStore.getState();

  // For development: Allow access to dashboard if no auth is set up
  // Remove this in production
  if (
    typeof window !== "undefined" &&
    window.location.search.includes("dev=true")
  ) {
    console.log("Development mode: bypassing authentication");
    return;
  }

  if (!isAuthenticated) {
    throw redirect({
      to: "/auth/login",
      search: {
        redirect: window.location.pathname,
      },
    });
  }
};

// Helper function to redirect authenticated users away from auth pages
const redirectIfAuthenticated = () => {
  const { isAuthenticated } = useAuthStore.getState();
  if (isAuthenticated) {
    throw redirect({ to: "/dashboard" });
  }
};

// Auth routes (public, redirect to dashboard if authenticated)
export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/login",
  component: LoginPage,
  beforeLoad: redirectIfAuthenticated,
});

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/register",
  component: RegisterPage,
  beforeLoad: redirectIfAuthenticated,
});

export const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/forgot-password",
  component: ForgotPasswordPage,
  beforeLoad: redirectIfAuthenticated,
});

export const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/onboarding",
  component: OnboardingPage,
  // Note: Onboarding might be accessible to authenticated users who haven't completed setup
  // beforeLoad: redirectIfAuthenticated, // Commented out for now
});

// Dashboard routes (protected)
export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardHome,
  beforeLoad: requireAuth,
});

export const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/customers",
  component: CustomersPage,
  beforeLoad: requireAuth,
});

export const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/inventory",
  component: InventoryPage,
  beforeLoad: requireAuth,
});

export const salesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/sales",
  component: SalesPage,
  beforeLoad: requireAuth,
});

export const serviceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/service",
  component: ServicePage,
  beforeLoad: requireAuth,
});

export const financeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/finance",
  component: FinancePage,
  beforeLoad: requireAuth,
});

// Route tree
export const routeTree = rootRoute.addChildren([
  landingRoute,
  // Auth routes
  loginRoute,
  registerRoute,
  forgotPasswordRoute,
  onboardingRoute,
  // Dashboard routes
  dashboardRoute,
  customersRoute,
  inventoryRoute,
  salesRoute,
  serviceRoute,
  financeRoute,
]);
