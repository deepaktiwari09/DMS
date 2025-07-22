import { useRouter } from '@tanstack/react-router';

export class Navigation {
  private static getRouter() {
    // Get router instance from window or global state
    return (window as any).__router;
  }

  static navigate(path: string) {
    const router = this.getRouter();
    if (router) {
      router.navigate({ to: path });
    } else {
      // Fallback to window.location for SSR or when router isn't ready
      window.location.href = path;
    }
  }

  static replace(path: string) {
    const router = this.getRouter();
    if (router) {
      router.navigate({ to: path, replace: true });
    } else {
      window.location.replace(path);
    }
  }

  static back() {
    window.history.back();
  }

  static forward() {
    window.history.forward();
  }

  static reload() {
    window.location.reload();
  }
}

// React hook-based navigation (preferred)
export function useNavigation() {
  const router = useRouter();

  const navigate = (path: string) => {
    router.navigate({ to: path });
  };

  const replace = (path: string) => {
    router.navigate({ to: path, replace: true });
  };

  return { navigate, replace };
}

// Convenience functions for class-based usage
export const navigateTo = (path: string) => Navigation.navigate(path);
export const replaceTo = (path: string) => Navigation.replace(path);