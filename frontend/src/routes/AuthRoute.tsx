import React from 'react';
import { AuthPage } from '../pages/auth/AuthPage';
import { useAuthActions } from '../hooks/useAuthActions';

export function AuthRoute() {
  const {
    handleLogin,
    handleRegister,
    handleCreateOrganization,
    handleJoinOrganization,
    handleForgotPassword,
    fetchAvailableOrganizations,
    isLoading,
    availableOrganizations,
  } = useAuthActions();

  // Fetch available organizations on mount
  React.useEffect(() => {
    fetchAvailableOrganizations();
  }, [fetchAvailableOrganizations]);

  return (
    <AuthPage
      onLogin={handleLogin}
      onRegister={handleRegister}
      onCreateOrganization={handleCreateOrganization}
      onJoinOrganization={handleJoinOrganization}
      onForgotPassword={handleForgotPassword}
      isLoading={isLoading}
      availableOrganizations={availableOrganizations.map((org) => ({
        id: org.id,
        name: org.name,
        memberCount: undefined, // This would come from API
      }))}
    />
  );
}