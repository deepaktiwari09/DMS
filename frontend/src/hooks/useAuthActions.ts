import { useCallback } from 'react';
import { useAuthStore } from '../stores/auth-store';
import { useAppNavigation } from './useNavigation';

export function useAuthActions() {
  const {
    login,
    register,
    createOrganization,
    joinOrganization,
    fetchAvailableOrganizations,
    isLoading,
    availableOrganizations,
    error,
  } = useAuthStore();

  const { goToDashboard, goToAuth } = useAppNavigation();

  const handleLogin = useCallback(
    async (data: any) => {
      await login(data);
      goToDashboard();
    },
    [login, goToDashboard]
  );

  const handleRegister = useCallback(
    async (data: any) => {
      await register(data);
      // Stay on auth page to show onboarding
    },
    [register]
  );

  const handleCreateOrganization = useCallback(
    async (data: any) => {
      await createOrganization(data);
      goToDashboard();
    },
    [createOrganization, goToDashboard]
  );

  const handleJoinOrganization = useCallback(
    async (orgId: string) => {
      await joinOrganization(orgId);
      goToDashboard();
    },
    [joinOrganization, goToDashboard]
  );

  const handleForgotPassword = useCallback(() => {
    // TODO: Implement proper forgot password modal/page
    alert('Password reset functionality would be implemented here');
  }, []);

  return {
    handleLogin,
    handleRegister,
    handleCreateOrganization,
    handleJoinOrganization,
    handleForgotPassword,
    fetchAvailableOrganizations,
    isLoading,
    availableOrganizations,
    error,
  };
}