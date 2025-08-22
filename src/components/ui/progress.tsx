"use client"

import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/utils/Helpers"

const progressVariants = cva(
  "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
  {
    variants: {
      variant: {
        default: "bg-secondary",
        sage: "bg-sage-mist/50",
        accent: "bg-sage-growth/10",
        subtle: "bg-muted",
      },
      size: {
        default: "h-4",
        sm: "h-2",
        lg: "h-6",
        xl: "h-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const progressIndicatorVariants = cva(
  "size-full flex-1 bg-primary transition-all",
  {
    variants: {
      variant: {
        default: "bg-primary",
        sage: "sage-gradient-primary bg-sage-quietude",
        accent: "bg-sage-growth",
        success: "bg-sage-growth",
        warning: "bg-orange-500",
        destructive: "bg-destructive",
        subtle: "bg-sage-stone",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type ProgressProps = {
  value?: number;
  max?: number;
  indicatorVariant?: VariantProps<typeof progressIndicatorVariants>["variant"];
} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof progressVariants>

const Progress = React.forwardRef<
  HTMLDivElement,
  ProgressProps
>(({ className, value = 0, max = 100, variant, size, indicatorVariant, ...props }, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(progressVariants({ variant, size }), className)}
      {...props}
    >
      <div
        className={cn(progressIndicatorVariants({ variant: indicatorVariant || variant }))}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
})
Progress.displayName = "Progress"

// Compound component for labeled progress
type LabeledProgressProps = {
  label?: string;
  showValue?: boolean;
  valueFormat?: (value: number) => string;
} & ProgressProps

const LabeledProgress = React.forwardRef<
  HTMLDivElement,
  LabeledProgressProps
>(({ label, showValue = true, valueFormat = v => `${v}%`, value = 0, className, ...props }, ref) => (
  <div className="space-y-2">
    {(label || showValue) && (
      <div className="flex justify-between text-sm">
        {label && <span className="text-muted-foreground">{label}</span>}
        {showValue && <span className="font-medium text-sage-stone">{valueFormat(value)}</span>}
      </div>
    )}
    <Progress
      ref={ref}
      value={value}
      className={className}
      {...props}
    />
  </div>
))
LabeledProgress.displayName = "LabeledProgress"

export { LabeledProgress, Progress }
