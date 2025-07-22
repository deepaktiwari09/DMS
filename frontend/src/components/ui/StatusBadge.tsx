import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const statusBadgeVariants = cva(
  'status-badge',
  {
    variants: {
      status: {
        active: 'active',
        pending: 'pending',
        lead: 'lead',
        scheduled: 'scheduled',
        'in-progress': 'in-progress',
        completed: 'completed',
        'awaiting-parts': 'awaiting-parts',
        available: 'available',
        busy: 'busy',
      },
    },
    defaultVariants: {
      status: 'pending',
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  className,
  status,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(statusBadgeVariants({ status }), className)}
      {...props}
    >
      {children}
    </span>
  );
};

export default StatusBadge;