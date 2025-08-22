import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/Helpers';

const inputVariants = cva(
  'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'sage-ring border-input focus-visible:ring-1 focus-visible:ring-ring',
        error: 'border-destructive focus-visible:ring-1 focus-visible:ring-destructive',
        success: 'border-sage-growth focus-visible:ring-1 focus-visible:ring-sage-growth',
        sage: 'sage-border sage-ring focus-visible:ring-1',
      },
      inputSize: {
        default: 'h-10 px-3 py-2',
        sm: 'h-8 px-2 py-1 text-xs',
        lg: 'h-12 px-4 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  },
);

export type InputProps = {
  variant?: VariantProps<typeof inputVariants>['variant'];
  inputSize?: VariantProps<typeof inputVariants>['inputSize'];
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', variant, inputSize, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

// Enhanced input with icons
type InputWithIconProps = InputProps & {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, startIcon, endIcon, variant, inputSize, ...props }, ref) => {
    return (
      <div className="relative">
        {startIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {startIcon}
          </div>
        )}
        <input
          className={cn(
            inputVariants({ variant, inputSize }),
            startIcon && 'pl-10',
            endIcon && 'pr-10',
            className
          )}
          ref={ref}
          {...props}
        />
        {endIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {endIcon}
          </div>
        )}
      </div>
    );
  },
);
InputWithIcon.displayName = 'InputWithIcon';

export { Input, inputVariants, InputWithIcon };
