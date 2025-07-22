import React from 'react';
import { ChevronRightIcon, Bars3Icon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DashboardHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  onMenuToggle?: () => void;
  showMenuToggle?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  breadcrumbs,
  actions,
  onMenuToggle,
  showMenuToggle = false,
}) => {
  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        {showMenuToggle && onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        )}

        <div>
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center text-sm text-[var(--text-secondary)] mb-1">
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <ChevronRightIcon className="h-4 w-4 mx-2 text-gray-400" />
                  )}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="hover:text-[var(--primary-color)] transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-[var(--text-primary)] font-medium">
                      {item.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}

          {/* Page Title */}
          <h1 className="typography_h1">{title}</h1>
        </div>
      </div>

      {/* Actions */}
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
};

export default DashboardHeader;