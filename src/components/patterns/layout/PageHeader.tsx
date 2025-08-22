"use client"

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import {
  ArrowLeft,
  Bookmark,
  Download,
  Edit,
  MoreHorizontal,
  Share,
  Trash2
} from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/utils/Helpers"

import { type BreadcrumbItem, Breadcrumbs } from "../navigation/Breadcrumbs"

// ============================================================================
// Page Header Variants
// ============================================================================

const pageHeaderVariants = cva(
  "flex flex-col space-y-4 pb-4 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "sage-border border-b",
        minimal: "",
        card: "sage-card rounded-lg border p-6",
        gradient: "rounded-lg bg-gradient-to-r from-sage-quietude/10 to-sage-growth/10 p-6",
      },
      size: {
        sm: "space-y-2 pb-2",
        default: "space-y-4 pb-4",
        lg: "space-y-6 pb-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const pageHeaderTitleVariants = cva(
  "font-bold text-foreground",
  {
    variants: {
      size: {
        sm: "text-lg",
        default: "text-xl md:text-2xl",
        lg: "text-2xl md:text-3xl",
        xl: "text-3xl md:text-4xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

// ============================================================================
// Page Header Types
// ============================================================================

export type PageHeaderAction = {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  href?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'destructive';
  disabled?: boolean;
}

export type PageHeaderProps = {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  titleSize?: VariantProps<typeof pageHeaderTitleVariants>['size'];
  breadcrumbs?: BreadcrumbItem[];
  showBack?: boolean;
  backLabel?: string;
  onBack?: () => void;
  actions?: PageHeaderAction[];
  primaryAction?: PageHeaderAction;
  moreActions?: PageHeaderAction[];
  meta?: React.ReactNode;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof pageHeaderVariants>

// ============================================================================
// Main Page Header Component
// ============================================================================

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({
    className,
    variant,
    size,
    title,
    subtitle,
    description,
    badge,
    badgeVariant = 'secondary',
    titleSize,
    breadcrumbs,
    showBack = false,
    backLabel = 'Back',
    onBack,
    actions = [],
    primaryAction,
    moreActions = [],
    meta,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "div"
    const resolvedTitleSize = titleSize || (size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default')

    return (
      <Comp
        ref={ref}
        className={cn(pageHeaderVariants({ variant, size, className }))}
        {...props}
      >
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="-mb-2">
            <Breadcrumbs
              items={breadcrumbs}
              variant="compact"
              style="minimal"
            />
          </div>
        )}

        {/* Header Content */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          {/* Left Section - Title & Content */}
          <div className="min-w-0 flex-1">
            {/* Title Row */}
            <div className="flex items-start gap-3">
              {/* Back Button */}
              {showBack && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBack}
                  className="sage-hover-primary mt-1 shrink-0"
                  aria-label={backLabel}
                >
                  <ArrowLeft className="size-4" />
                </Button>
              )}

              {/* Title & Badge */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className={cn(
                    pageHeaderTitleVariants({ size: resolvedTitleSize }),
                    "truncate"
                  )}
                  >
                    {title}
                  </h1>

                  {badge && (
                    <Badge variant={badgeVariant} className="shrink-0">
                      {badge}
                    </Badge>
                  )}
                </div>

                {/* Subtitle */}
                {subtitle && (
                  <p className="mt-1 text-sm font-medium text-muted-foreground">
                    {subtitle}
                  </p>
                )}

                {/* Description */}
                {description && (
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    {description}
                  </p>
                )}

                {/* Meta Information */}
                {meta && (
                  <div className="mt-3">
                    {meta}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          {(actions.length > 0 || primaryAction || moreActions.length > 0) && (
            <div className="flex shrink-0 items-center gap-2">
              {/* Regular Actions */}
              {actions.map(action => (
                <PageHeaderActionButton
                  key={action.id}
                  action={action}
                />
              ))}

              {/* Primary Action */}
              {primaryAction && (
                <PageHeaderActionButton
                  action={{
                    ...primaryAction,
                    variant: primaryAction.variant || 'primary'
                  }}
                />
              )}

              {/* More Actions Dropdown */}
              {moreActions.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="sage-hover-primary"
                      aria-label="More actions"
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {moreActions.map((action, index) => (
                      <React.Fragment key={action.id}>
                        <DropdownMenuItem
                          onClick={action.onClick}
                          disabled={action.disabled}
                          className={cn(
                            action.variant === 'destructive' && "text-destructive focus:text-destructive"
                          )}
                        >
                          {action.icon && (
                            <action.icon className="mr-2 size-4" />
                          )}
                          {action.label}
                        </DropdownMenuItem>
                        {index < moreActions.length - 1
                        && moreActions[index + 1]?.variant === 'destructive' && (
                          <DropdownMenuSeparator />
                        )}
                      </React.Fragment>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </div>

        {/* Additional Content */}
        {children && (
          <div className="pt-2">
            {children}
          </div>
        )}
      </Comp>
    )
  }
)
PageHeader.displayName = "PageHeader"

// ============================================================================
// Page Header Action Button
// ============================================================================

type PageHeaderActionButtonProps = {
  action: PageHeaderAction;
}

const PageHeaderActionButton = React.forwardRef<HTMLButtonElement, PageHeaderActionButtonProps>(
  ({ action }, ref) => {
    const buttonVariant = (() => {
      switch (action.variant) {
        case 'primary': return 'default'
        case 'secondary': return 'secondary'
        case 'destructive': return 'destructive'
        default: return 'outline'
      }
    })()

    const buttonProps = {
      ref,
      "variant": buttonVariant,
      "onClick": action.onClick,
      "disabled": action.disabled,
      'aria-label': action.label,
    } as const

    if (action.href) {
      return (
        <Button
          {...buttonProps}
          asChild
        >
          <a href={action.href}>
            {action.icon && <action.icon className="mr-2 size-4" />}
            {action.label}
          </a>
        </Button>
      )
    }

    return (
      <Button {...buttonProps}>
        {action.icon && <action.icon className="mr-2 size-4" />}
        {action.label}
      </Button>
    )
  }
)
PageHeaderActionButton.displayName = "PageHeaderActionButton"

// ============================================================================
// Page Header Meta Components
// ============================================================================

export type PageHeaderMetaProps = {
  items: Array<{
    label: string;
    value: React.ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  className?: string;
}

const PageHeaderMeta = React.forwardRef<HTMLDivElement, PageHeaderMetaProps>(
  ({ items, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground",
          className
        )}
      >
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            {item.icon && (
              <item.icon className="size-4" />
            )}
            <span className="font-medium">
{item.label}
:
            </span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    )
  }
)
PageHeaderMeta.displayName = "PageHeaderMeta"

// ============================================================================
// Page Header Tabs
// ============================================================================

export type PageHeaderTab = {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
  href?: string;
}

export type PageHeaderTabsProps = {
  tabs: PageHeaderTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

const PageHeaderTabs = React.forwardRef<HTMLDivElement, PageHeaderTabsProps>(
  ({ tabs, activeTab, onTabChange, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("border-b sage-border", className)}
      >
        <nav className="flex space-x-8" aria-label="Page sections">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab
            const isClickable = !tab.disabled && (onTabChange || tab.href)

            const tabContent = (
              <>
                {tab.label}
                {tab.count !== undefined && (
                  <Badge
                    variant="secondary"
                    className="ml-2 text-xs"
                  >
                    {tab.count}
                  </Badge>
                )}
              </>
            )

            if (tab.href) {
              return (
                <a
                  key={tab.id}
                  href={tab.href}
                  className={cn(
                    "border-b-2 py-3 px-1 text-sm font-medium transition-colors",
                    isActive
                      ? "border-sage-quietude sage-text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground sage-hover-primary",
                    tab.disabled && "opacity-50 cursor-not-allowed"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {tabContent}
                </a>
              )
            }

            return (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && onTabChange?.(tab.id)}
                disabled={tab.disabled}
                className={cn(
                  "border-b-2 py-3 px-1 text-sm font-medium transition-colors",
                  isActive
                    ? "border-sage-quietude sage-text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground sage-hover-primary",
                  tab.disabled && "opacity-50 cursor-not-allowed"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {tabContent}
              </button>
            )
          })}
        </nav>
      </div>
    )
  }
)
PageHeaderTabs.displayName = "PageHeaderTabs"

// ============================================================================
// Example Usage Component
// ============================================================================

export function PageHeaderExample() {
  const [activeTab, setActiveTab] = React.useState('overview')

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Learning Paths', href: '/learning-paths' },
    { label: 'Frontend Development', href: '/learning-paths/frontend' },
    { label: 'React Fundamentals' },
  ]

  const actions: PageHeaderAction[] = [
    {
      id: 'share',
      label: 'Share',
      icon: Share,
      onClick: () => console.log('Share clicked')
    },
    {
      id: 'bookmark',
      label: 'Bookmark',
      icon: Bookmark,
      onClick: () => console.log('Bookmark clicked')
    }
  ]

  const primaryAction: PageHeaderAction = {
    id: 'enroll',
    label: 'Enroll Now',
    variant: 'primary',
    onClick: () => console.log('Enroll clicked')
  }

  const moreActions: PageHeaderAction[] = [
    {
      id: 'edit',
      label: 'Edit Course',
      icon: Edit,
      onClick: () => console.log('Edit clicked')
    },
    {
      id: 'download',
      label: 'Download Materials',
      icon: Download,
      onClick: () => console.log('Download clicked')
    },
    {
      id: 'delete',
      label: 'Delete Course',
      icon: Trash2,
      variant: 'destructive',
      onClick: () => console.log('Delete clicked')
    }
  ]

  const metaItems = [
    { label: 'Duration', value: '8 weeks' },
    { label: 'Level', value: 'Beginner' },
    { label: 'Students', value: '1,234 enrolled' },
    { label: 'Rating', value: '4.8/5' }
  ]

  const tabs: PageHeaderTab[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: 'Curriculum', count: 12 },
    { id: 'reviews', label: 'Reviews', count: 89 },
    { id: 'discussions', label: 'Discussions', count: 23 }
  ]

  return (
    <div className="space-y-8 p-6">
      {/* Default Header */}
      <PageHeader
        title="React Fundamentals"
        subtitle="Master the basics of React development"
        description="Learn the core concepts of React including components, props, state, and hooks through hands-on projects and exercises."
        badge="Beginner"
        breadcrumbs={breadcrumbs}
        actions={actions}
        primaryAction={primaryAction}
        moreActions={moreActions}
        meta={<PageHeaderMeta items={metaItems} />}
      >
        <PageHeaderTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </PageHeader>

      {/* Card Variant */}
      <PageHeader
        variant="card"
        title="Course Analytics"
        description="Track student progress and engagement metrics"
        badge="Updated"
        badgeVariant="sage-accent"
        showBack
        onBack={() => console.log('Back clicked')}
        primaryAction={{
          id: 'export',
          label: 'Export Report',
          icon: Download
        }}
      />

      {/* Minimal Header */}
      <PageHeader
        variant="minimal"
        size="sm"
        title="Settings"
        description="Manage your account preferences"
      />

      {/* Gradient Header */}
      <PageHeader
        variant="gradient"
        size="lg"
        titleSize="xl"
        title="Welcome to Telesis"
        subtitle="Your personalized learning journey starts here"
        description="Discover AI-powered micro-learning experiences tailored to your goals."
        primaryAction={{
          id: 'start',
          label: 'Start Learning',
          variant: 'primary'
        }}
      />
    </div>
  )
}

export {
  PageHeader,
  type PageHeaderAction,
  PageHeaderMeta,
  type PageHeaderTab,
  PageHeaderTabs,
}
