import React from 'react';
import { redirect } from '@tanstack/react-router';
import { useAuthStore } from '../stores/auth-store';

export function requireAuth() {
  const { isAuthenticated } = useAuthStore.getState();
  
  if (!isAuthenticated) {
    throw redirect({
      to: '/auth',
      search: {
        redirect: window.location.pathname,
      },
    });
  }
}

export function requireNoAuth() {
  const { isAuthenticated } = useAuthStore.getState();
  
  if (isAuthenticated) {
    throw redirect({
      to: '/dashboard',
    });
  }
}

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    throw redirect({ to: '/auth' });
  }

  if (!requireAuth && isAuthenticated) {
    throw redirect({ to: '/dashboard' });
  }

  return <>{children}</>;
}