import React from 'react';
import { useRouter, useRouterState } from '@tanstack/react-router';
import {
  HomeIcon,
  UsersIcon,
  CubeIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Customers',
    href: '/dashboard/customers',
    icon: UsersIcon,
  },
  {
    name: 'Inventory',
    href: '/dashboard/inventory',
    icon: CubeIcon,
  },
  {
    name: 'Sales',
    href: '/dashboard/sales',
    icon: ChartBarIcon,
  },
  {
    name: 'Service',
    href: '/dashboard/service',
    icon: WrenchScrewdriverIcon,
  },
  {
    name: 'Finance',
    href: '/dashboard/finance',
    icon: CurrencyDollarIcon,
  },
];

export const DashboardSidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onToggle,
}) => {
  // Safely use router hooks with fallbacks for Storybook
  let router = null;
  let routerState = null;
  
  try {
    router = useRouter();
    routerState = useRouterState();
  } catch (error) {
    // Router context not available (e.g., in Storybook)
    console.warn('Router context not available');
  }

  // Handle cases where router context might not be available
  const isActiveRoute = (href: string) => {
    if (!routerState?.location) {
      return href === '/dashboard'; // Default to dashboard active for demo
    }
    if (href === '/dashboard') {
      return routerState.location.pathname === '/dashboard';
    }
    return routerState.location.pathname.startsWith(href);
  };

  const handleNavigation = (href: string) => {
    if (router?.navigate) {
      router.navigate({ to: href });
    } else {
      console.log('Navigate to:', href);
    }
  };

  return (
    <aside
      className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-center p-6 border-b border-gray-200">
        <h1
          className={`text-xl font-bold text-[var(--text-primary)] transition-opacity ${
            isCollapsed ? 'opacity-0' : 'opacity-100'
          }`}
        >
          MotoCorp
        </h1>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="flex flex-col gap-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);

            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`sidebar-nav-item ${isActive ? 'active' : ''} ${
                  isCollapsed ? 'justify-center px-3' : ''
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="h-6 w-6 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-gray-200">
        <button
          className={`sidebar-nav-item w-full ${
            isCollapsed ? 'justify-center px-3' : ''
          }`}
          title={isCollapsed ? 'Settings' : undefined}
        >
          <CogIcon className="h-6 w-6 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
        </button>
      </div>

      {/* Toggle Button */}
      {onToggle && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={`h-5 w-5 transition-transform ${
                isCollapsed ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      )}
    </aside>
  );
};

export default DashboardSidebar;