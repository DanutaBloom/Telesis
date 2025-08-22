"use client"

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Info
} from "lucide-react"
import * as React from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/utils/Helpers"

// ============================================================================
// Form Section Variants
// ============================================================================

const formSectionVariants = cva(
  "space-y-4 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "",
        card: "sage-card rounded-lg border p-6",
        minimal: "",
        highlighted: "sage-bg-mist/30 sage-border rounded-lg border p-4",
      },
      size: {
        sm: "space-y-3",
        default: "space-y-4",
        lg: "space-y-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const formSectionHeaderVariants = cva(
  "flex items-center justify-between",
  {
    variants: {
      variant: {
        default: "sage-border border-b pb-2",
        minimal: "pb-1",
        card: "pb-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// ============================================================================
// Form Section Types
// ============================================================================

export type FormSectionProps = {
  title?: string;
  description?: string;
  required?: boolean;
  collapsible?: boolean;
  defaultOpen?: boolean;
  badge?: string;
  error?: string;
  warning?: string;
  info?: string;
  success?: string;
  helpText?: string;
  actions?: React.ReactNode;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof formSectionVariants>

// ============================================================================
// Main Form Section Component
// ============================================================================

const FormSection = React.forwardRef<HTMLDivElement, FormSectionProps>(
  ({
    className,
    variant,
    size,
    title,
    description,
    required = false,
    collapsible = false,
    defaultOpen = true,
    badge,
    error,
    warning,
    info,
    success,
    helpText,
    actions,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen)
    const Comp = asChild ? Slot : "div"

    const hasAlert = error || warning || info || success
    const headerVariant = variant === "card" ? "card" : variant === "minimal" ? "minimal" : "default"

    const toggleOpen = () => {
      if (collapsible) {
        setIsOpen(!isOpen)
      }
    }

    return (
      <Comp
        ref={ref}
        className={cn(formSectionVariants({ variant, size, className }))}
        {...props}
      >
        {/* Section Header */}
        {(title || description || badge || actions) && (
          <div className={cn(formSectionHeaderVariants({ variant: headerVariant }))}>
            <div className="min-w-0 flex-1">
              {title && (
                <div className="mb-1 flex items-center gap-2">
                  {collapsible && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="sage-hover-primary size-5 p-0"
                      onClick={toggleOpen}
                      aria-label={isOpen ? "Collapse section" : "Expand section"}
                      aria-expanded={isOpen}
                    >
                      {isOpen
? (
                        <ChevronDown className="size-3" />
                      )
: (
                        <ChevronRight className="size-3" />
                      )}
                    </Button>
                  )}

                  <h3 className={cn(
                    "font-semibold text-foreground",
                    variant === "card" ? "text-lg" : "text-base"
                  )}
                  >
                    {title}
                    {required && (
                      <span className="ml-1 text-destructive" aria-label="Required">
                        *
                      </span>
                    )}
                  </h3>

                  {badge && (
                    <Badge variant="secondary" className="text-xs">
                      {badge}
                    </Badge>
                  )}

                  {helpText && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-4 p-0 text-muted-foreground hover:text-foreground"
                          >
                            <HelpCircle className="size-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p className="text-sm">{helpText}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              )}

              {description && (
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>

            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        )}

        {/* Alerts */}
        {hasAlert && (
          <div className="space-y-2">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {warning && (
              <Alert className="border-orange-200 bg-orange-50 text-orange-800">
                <AlertCircle className="size-4" />
                <AlertDescription>{warning}</AlertDescription>
              </Alert>
            )}

            {info && (
              <Alert className="border-blue-200 bg-blue-50 text-blue-800">
                <Info className="size-4" />
                <AlertDescription>{info}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-sage-growth/20 bg-sage-growth/10 text-sage-growth">
                <CheckCircle className="size-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Section Content */}
        {(!collapsible || isOpen) && (
          <div className={cn(
            "space-y-4",
            size === "sm" && "space-y-3",
            size === "lg" && "space-y-6"
          )}
          >
            {children}
          </div>
        )}
      </Comp>
    )
  }
)
FormSection.displayName = "FormSection"

// ============================================================================
// Form Field Component
// ============================================================================

export type FormFieldProps = {
  label?: string;
  description?: string;
  error?: string;
  warning?: string;
  success?: string;
  required?: boolean;
  optional?: boolean;
  htmlFor?: string;
  orientation?: 'vertical' | 'horizontal';
} & React.HTMLAttributes<HTMLDivElement>

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({
    className,
    label,
    description,
    error,
    warning,
    success,
    required = false,
    optional = false,
    htmlFor,
    orientation = 'vertical',
    children,
    ...props
  }, ref) => {
    const fieldId = htmlFor || React.useId()
    const descriptionId = description ? `${fieldId}-description` : undefined
    const errorId = error ? `${fieldId}-error` : undefined

    return (
      <div
        ref={ref}
        className={cn(
          "space-y-2",
          orientation === 'horizontal' && "flex items-start gap-4 space-y-0",
          className
        )}
        {...props}
      >
        {/* Label */}
        {label && (
          <div className={cn(
            orientation === 'horizontal' && "flex-shrink-0 w-32 pt-2"
          )}
          >
            <Label
              htmlFor={fieldId}
              className={cn(
                "text-sm font-medium",
                error && "text-destructive",
                success && "text-sage-growth"
              )}
            >
              {label}
              {required && (
                <span className="ml-1 text-destructive" aria-label="Required">
                  *
                </span>
              )}
              {optional && (
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  (optional)
                </span>
              )}
            </Label>
          </div>
        )}

        {/* Field and Messages */}
        <div className={cn(
          "space-y-2",
          orientation === 'horizontal' && "flex-1"
        )}
        >
          {/* Form Control */}
          <div>
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                  "id": fieldId,
                  'aria-describedby': cn(
                    descriptionId,
                    errorId
                  ).trim() || undefined,
                  'aria-invalid': error ? 'true' : undefined,
                  ...child.props,
                } as any)
              }
              return child
            })}
          </div>

          {/* Description */}
          {description && (
            <p
              id={descriptionId}
              className="text-xs text-muted-foreground"
            >
              {description}
            </p>
          )}

          {/* Error Message */}
          {error && (
            <p
              id={errorId}
              className="flex items-center gap-1 text-xs text-destructive"
              role="alert"
            >
              <AlertCircle className="size-3" />
              {error}
            </p>
          )}

          {/* Warning Message */}
          {warning && (
            <p className="flex items-center gap-1 text-xs text-orange-600">
              <AlertCircle className="size-3" />
              {warning}
            </p>
          )}

          {/* Success Message */}
          {success && (
            <p className="flex items-center gap-1 text-xs text-sage-growth">
              <CheckCircle className="size-3" />
              {success}
            </p>
          )}
        </div>
      </div>
    )
  }
)
FormField.displayName = "FormField"

// ============================================================================
// Form Actions Component
// ============================================================================

export type FormActionsProps = {
  variant?: 'default' | 'centered' | 'space-between' | 'right';
  sticky?: boolean;
} & React.HTMLAttributes<HTMLDivElement>

const FormActions = React.forwardRef<HTMLDivElement, FormActionsProps>(
  ({ className, variant = 'default', sticky = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-3 pt-4",
          variant === 'centered' && "justify-center",
          variant === 'space-between' && "justify-between",
          variant === 'right' && "justify-end",
          sticky && "sticky bottom-0 bg-background border-t sage-border p-4 -mx-4 -mb-4",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
FormActions.displayName = "FormActions"

// ============================================================================
// Form Step Indicator
// ============================================================================

export type FormStep = {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  current?: boolean;
  error?: boolean;
}

export type FormStepsProps = {
  steps: FormStep[];
  currentStep?: string;
  onStepClick?: (stepId: string) => void;
  className?: string;
}

const FormSteps = React.forwardRef<HTMLDivElement, FormStepsProps>(
  ({ steps, currentStep, onStepClick, className }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-4", className)}>
        <nav aria-label="Form progress">
          <ol className="space-y-2">
            {steps.map((step, index) => {
              const isCurrent = step.current || step.id === currentStep
              const isClickable = onStepClick && (step.completed || isCurrent)

              return (
                <li key={step.id}>
                  <div
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-md transition-colors",
                      isClickable && "cursor-pointer sage-hover-primary",
                      isCurrent && "sage-bg-mist/50",
                      step.error && "bg-destructive/10"
                    )}
                    onClick={() => isClickable && onStepClick(step.id)}
                  >
                    {/* Step Number/Status */}
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium",
                      step.completed && "sage-bg-primary border-sage-quietude text-primary-foreground",
                      isCurrent && "border-sage-quietude text-sage-quietude",
                      step.error && "border-destructive text-destructive",
                      !step.completed && !isCurrent && !step.error && "border-muted-foreground text-muted-foreground"
                    )}
                    >
                      {step.completed
? (
                        <CheckCircle className="size-4" />
                      )
: step.error
? (
                        <AlertCircle className="size-4" />
                      )
: (
                        index + 1
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="min-w-0 flex-1">
                      <p className={cn(
                        "text-sm font-medium",
                        isCurrent && "sage-text-primary",
                        step.error && "text-destructive"
                      )}
                      >
                        {step.title}
                      </p>
                      {step.description && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </nav>
      </div>
    )
  }
)
FormSteps.displayName = "FormSteps"

// ============================================================================
// Example Usage Component
// ============================================================================

export function FormSectionExample() {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    confirmPassword: '',
    notifications: false
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = React.useState('account')

  const steps: FormStep[] = [
    {
      id: 'account',
      title: 'Account Details',
      description: 'Basic account information',
      completed: formData.email && formData.password,
      current: currentStep === 'account'
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Password confirmation',
      completed: formData.confirmPassword && formData.password === formData.confirmPassword,
      current: currentStep === 'security',
      error: formData.confirmPassword && formData.password !== formData.confirmPassword
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Notification settings',
      current: currentStep === 'preferences'
    }
  ]

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <h2 className="mb-6 text-2xl font-bold">Form Section Examples</h2>

      {/* Form Steps */}
      <FormSection
        title="Multi-Step Form"
        description="Track progress through form sections"
        variant="card"
      >
        <FormSteps
          steps={steps}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />
      </FormSection>

      {/* Basic Form Section */}
      <FormSection
        title="Account Information"
        description="Enter your account details"
        required
        helpText="This information is used to create your account"
        variant="highlighted"
        success={formData.email && formData.password ? "Account details look good!" : undefined}
      >
        <FormField
          label="Email Address"
          description="We'll use this email for account verification"
          required
          error={errors.email}
        >
          <input
            type="email"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
        </FormField>

        <FormField
          label="Password"
          description="Must be at least 8 characters long"
          required
          error={errors.password}
        >
          <input
            type="password"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter a secure password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
          />
        </FormField>
      </FormSection>

      {/* Collapsible Section */}
      <FormSection
        title="Advanced Options"
        description="Optional advanced configuration"
        collapsible
        defaultOpen={false}
        badge="Optional"
        variant="card"
      >
        <FormField
          label="Notification Preferences"
          orientation="horizontal"
        >
          <input
            type="checkbox"
            className="size-4 rounded border-gray-300"
            checked={formData.notifications}
            onChange={e => setFormData({ ...formData, notifications: e.target.checked })}
          />
        </FormField>
      </FormSection>

      {/* Form Actions */}
      <FormActions variant="space-between">
        <Button variant="outline">Cancel</Button>
        <div className="flex gap-2">
          <Button variant="outline">Save Draft</Button>
          <Button>Continue</Button>
        </div>
      </FormActions>
    </div>
  )
}

export {
  FormActions,
  FormField,
  FormSection,
  type FormStep,
  FormSteps,
}
