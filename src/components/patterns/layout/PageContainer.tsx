"use client"

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, Loader2 } from "lucide-react"
import * as React from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/utils/Helpers"

// ============================================================================
// Page Container Variants
// ============================================================================

const pageContainerVariants = cva(
  "w-full transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-background",
        muted: "bg-muted/50",
        card: "sage-border rounded-lg border bg-background",
        gradient: "bg-gradient-to-br from-background to-muted/30",
      },
      size: {
        sm: "max-w-2xl",
        default: "max-w-4xl",
        lg: "max-w-6xl",
        xl: "max-w-7xl",
        full: "max-w-none",
        container: "container",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-12",
      },
      center: {
        true: "mx-auto",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      padding: "default",
      center: true,
    },
  }
)

const pageContentVariants = cva(
  "w-full",
  {
    variants: {
      spacing: {
        none: "space-y-0",
        sm: "space-y-4",
        default: "space-y-6",
        lg: "space-y-8",
        xl: "space-y-12",
      },
    },
    defaultVariants: {
      spacing: "default",
    },
  }
)

// ============================================================================
// Page Container Types
// ============================================================================

export type PageContainerProps = {
  spacing?: VariantProps<typeof pageContentVariants>['spacing'];
  loading?: boolean;
  error?: string | React.ReactNode;
  loadingMessage?: string;
  minHeight?: string | number;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof pageContainerVariants>

// ============================================================================
// Main Page Container Component
// ============================================================================

const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  ({
    className,
    variant,
    size,
    padding,
    center,
    spacing,
    loading = false,
    error,
    loadingMessage = "Loading...",
    minHeight,
    asChild = false,
    children,
    style,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "div"

    const containerStyle = {
      ...style,
      ...(minHeight && { minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight })
    }

    // Loading state
    if (loading) {
      return (
        <Comp
          ref={ref}
          className={cn(pageContainerVariants({ variant, size, padding, center, className }))}
          style={containerStyle}
          {...props}
        >
          <PageLoadingState message={loadingMessage} />
        </Comp>
      )
    }

    // Error state
    if (error) {
      return (
        <Comp
          ref={ref}
          className={cn(pageContainerVariants({ variant, size, padding, center, className }))}
          style={containerStyle}
          {...props}
        >
          <PageErrorState error={error} />
        </Comp>
      )
    }

    // Normal content
    return (
      <Comp
        ref={ref}
        className={cn(pageContainerVariants({ variant, size, padding, center, className }))}
        style={containerStyle}
        {...props}
      >
        <div className={cn(pageContentVariants({ spacing }))}>
          {children}
        </div>
      </Comp>
    )
  }
)
PageContainer.displayName = "PageContainer"

// ============================================================================
// Page Section Component
// ============================================================================

export type PageSectionProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'muted' | 'card' | 'bordered';
  size?: 'sm' | 'default' | 'lg';
  asChild?: boolean;
} & React.HTMLAttributes<HTMLElement>

const pageSectionVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "",
        muted: "rounded-lg bg-muted/50",
        card: "sage-card rounded-lg border",
        bordered: "border-l-4 border-sage-quietude pl-4",
      },
      size: {
        sm: "space-y-3 p-4",
        default: "space-y-4 p-6",
        lg: "space-y-6 p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const PageSection = React.forwardRef<HTMLElement, PageSectionProps>(
  ({
    className,
    variant,
    size,
    title,
    description,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "section"

    return (
      <Comp
        ref={ref}
        className={cn(
          variant === 'default' ? "space-y-4" : pageSectionVariants({ variant, size }),
          className
        )}
        {...props}
      >
        {(title || description) && (
          <div className="space-y-2">
            {title && (
              <h2 className={cn(
                "font-semibold text-foreground",
                size === 'sm' ? "text-lg" : size === 'lg' ? "text-xl" : "text-lg"
              )}
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="max-w-2xl text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </Comp>
    )
  }
)
PageSection.displayName = "PageSection"

// ============================================================================
// Page Content Area
// ============================================================================

export type PageContentProps = {
  sidebar?: React.ReactNode;
  sidebarWidth?: string;
  sidebarPosition?: 'left' | 'right';
  sidebarCollapsible?: boolean;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement>

const PageContent = React.forwardRef<HTMLDivElement, PageContentProps>(
  ({
    className,
    sidebar,
    sidebarWidth = "320px",
    sidebarPosition = 'left',
    sidebarCollapsible = false,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(true)
    const Comp = asChild ? Slot : "div"

    if (!sidebar) {
      return (
        <Comp
          ref={ref}
          className={cn("w-full", className)}
          {...props}
        >
          {children}
        </Comp>
      )
    }

    return (
      <Comp
        ref={ref}
        className={cn("flex gap-6", className)}
        {...props}
      >
        {/* Left Sidebar */}
        {sidebarPosition === 'left' && (
          <aside
            className={cn(
              "flex-shrink-0 transition-all duration-200",
              sidebarCollapsible && !sidebarOpen && "hidden"
            )}
            style={{ width: sidebarOpen ? sidebarWidth : '0' }}
          >
            {sidebar}
          </aside>
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          {children}
        </main>

        {/* Right Sidebar */}
        {sidebarPosition === 'right' && (
          <aside
            className={cn(
              "flex-shrink-0 transition-all duration-200",
              sidebarCollapsible && !sidebarOpen && "hidden"
            )}
            style={{ width: sidebarOpen ? sidebarWidth : '0' }}
          >
            {sidebar}
          </aside>
        )}
      </Comp>
    )
  }
)
PageContent.displayName = "PageContent"

// ============================================================================
// Loading State Component
// ============================================================================

type PageLoadingStateProps = {
  message?: string;
  className?: string;
}

const PageLoadingState = React.forwardRef<HTMLDivElement, PageLoadingStateProps>(
  ({ message = "Loading...", className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center py-12 space-y-4",
          className
        )}
        role="status"
        aria-live="polite"
      >
        <Loader2 className="size-8 animate-spin text-sage-quietude" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    )
  }
)
PageLoadingState.displayName = "PageLoadingState"

// ============================================================================
// Error State Component
// ============================================================================

type PageErrorStateProps = {
  error: string | React.ReactNode;
  className?: string;
}

const PageErrorState = React.forwardRef<HTMLDivElement, PageErrorStateProps>(
  ({ error, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("py-8", className)}
        role="alert"
      >
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            {typeof error === 'string' ? error : error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }
)
PageErrorState.displayName = "PageErrorState"

// ============================================================================
// Empty State Component
// ============================================================================

export type PageEmptyStateProps = {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

const PageEmptyState = React.forwardRef<HTMLDivElement, PageEmptyStateProps>(
  ({ title, description, icon: Icon, action, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center py-12 space-y-4 text-center",
          className
        )}
      >
        {Icon && (
          <div className="sage-bg-mist flex size-12 items-center justify-center rounded-full">
            <Icon className="size-6 text-sage-quietude" />
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="max-w-md text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {action && (
          <div className="pt-2">
            {action.href
? (
              <a
                href={action.href}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                {action.label}
              </a>
            )
: (
              <button
                onClick={action.onClick}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                {action.label}
              </button>
            )}
          </div>
        )}
      </div>
    )
  }
)
PageEmptyState.displayName = "PageEmptyState"

// ============================================================================
// Responsive Container Hook
// ============================================================================

export function usePageContainer() {
  const [dimensions, setDimensions] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  React.useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = dimensions.width < 768
  const isTablet = dimensions.width >= 768 && dimensions.width < 1024
  const isDesktop = dimensions.width >= 1024

  return {
    dimensions,
    isMobile,
    isTablet,
    isDesktop,
  }
}

// ============================================================================
// Example Usage Component
// ============================================================================

export function PageContainerExample() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const { isMobile } = usePageContainer()

  const simulateLoading = () => {
    setLoading(true)
    setError(null)
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  const simulateError = () => {
    setError("Failed to load content. Please try again.")
    setLoading(false)
  }

  const sidebar = (
    <div className="space-y-4">
      <div className="sage-card rounded-lg p-4">
        <h3 className="mb-2 font-semibold">Navigation</h3>
        <nav className="space-y-2">
          <a href="#" className="sage-hover-primary block rounded p-2 text-sm">Overview</a>
          <a href="#" className="sage-hover-primary block rounded p-2 text-sm">Settings</a>
          <a href="#" className="sage-hover-primary block rounded p-2 text-sm">Help</a>
        </nav>
      </div>
    </div>
  )

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Page Container Examples</h2>
        <div className="flex gap-2">
          <button
            onClick={simulateLoading}
            className="rounded bg-primary px-4 py-2 text-primary-foreground"
          >
            Test Loading
          </button>
          <button
            onClick={simulateError}
            className="rounded bg-destructive px-4 py-2 text-destructive-foreground"
          >
            Test Error
          </button>
          <button
            onClick={() => {
 setLoading(false); setError(null)
}}
            className="rounded bg-secondary px-4 py-2 text-secondary-foreground"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Default Container */}
      <PageContainer
        loading={loading}
        error={error}
        minHeight={400}
      >
        <PageSection
          title="Default Container"
          description="Standard page container with default styling"
        >
          <p className="text-sm text-muted-foreground">
            This is the default page container. It provides consistent spacing and layout for your content.
          </p>
        </PageSection>
      </PageContainer>

      {/* Card Container with Sidebar */}
      <PageContainer
        variant="card"
        size="lg"
        padding="lg"
      >
        <PageContent
          sidebar={!isMobile ? sidebar : undefined}
          sidebarWidth="280px"
          sidebarPosition="left"
        >
          <PageSection
            title="Card Container with Sidebar"
            description="Container with card styling and optional sidebar"
            variant="bordered"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="sage-card rounded p-4">
                <h4 className="mb-2 font-medium">Feature 1</h4>
                <p className="text-sm text-muted-foreground">
                  Description of feature 1
                </p>
              </div>
              <div className="sage-card rounded p-4">
                <h4 className="mb-2 font-medium">Feature 2</h4>
                <p className="text-sm text-muted-foreground">
                  Description of feature 2
                </p>
              </div>
            </div>
          </PageSection>
        </PageContent>
      </PageContainer>

      {/* Full Width Container */}
      <PageContainer
        size="full"
        padding="none"
        center={false}
        variant="muted"
      >
        <div className="p-6">
          <PageSection
            title="Full Width Container"
            description="Container that spans the full width of the viewport"
            variant="card"
          >
            <PageEmptyState
              title="No data available"
              description="There's nothing to show here yet. Create your first item to get started."
              action={{
                label: "Create Item",
                onClick: () => console.log('Create clicked')
              }}
            />
          </PageSection>
        </div>
      </PageContainer>
    </div>
  )
}

export {
  PageContainer,
  PageContent,
  PageEmptyState,
  PageErrorState,
  PageLoadingState,
  PageSection,
  usePageContainer,
}
