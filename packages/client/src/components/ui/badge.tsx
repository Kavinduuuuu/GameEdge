'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'secondary';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-gameedge-primary/20 text-gameedge-primary border-gameedge-primary/30',
      success: 'bg-gameedge-success/20 text-gameedge-success border-gameedge-success/30',
      warning: 'bg-gameedge-warning/20 text-gameedge-warning border-gameedge-warning/30',
      danger: 'bg-gameedge-danger/20 text-gameedge-danger border-gameedge-danger/30',
      secondary: 'bg-gameedge-secondary/20 text-gameedge-secondary border-gameedge-secondary/30',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };
