import { useCallback } from 'react';
import { useRouter } from '@tanstack/react-router';

export function useAppNavigation() {
  const router = useRouter();

  const navigate = useCallback((path: string) => {
    router.navigate({ to: path });
  }, [router]);

  const replace = useCallback((path: string) => {
    router.navigate({ to: path, replace: true });
  }, [router]);

  const goToAuth = useCallback(() => {
    navigate('/auth');
  }, [navigate]);

  const goToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const goToLanding = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return {
    navigate,
    replace,
    goToAuth,
    goToDashboard,
    goToLanding,
  };
}