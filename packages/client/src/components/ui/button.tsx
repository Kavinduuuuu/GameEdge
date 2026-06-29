'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-gameedge-primary text-white hover:bg-gameedge-primary/90',
        destructive: 'bg-gameedge-danger text-white hover:bg-gameedge-danger/90',
        outline: 'border border-gameedge-primary/50 bg-transparent hover:bg-gameedge-primary/10 text-foreground',
        secondary: 'bg-gameedge-secondary text-white hover:bg-gameedge-secondary/90',
        ghost: 'hover:bg-white/10 text-foreground',
        link: 'text-gameedge-primary underline-offset-4 hover:underline',
        success: 'bg-gameedge-success text-white hover:bg-gameedge-success/90',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-lg px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
