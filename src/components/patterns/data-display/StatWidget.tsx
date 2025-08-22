"use client"

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import {
  Activity,
  BarChart3,
  DollarSign,
  Download,
  Info,
  Minus,
  MoreHorizontal,
  RefreshCw,
  Share,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Zap
} from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/utils/Helpers"

// ============================================================================
// Stat Widget Variants
// ============================================================================

const statWidgetVariants = cva(
  "relative rounded-lg transition-all duration-200",
  {
    variants: {
      variant: {
        default: "sage-card border",
        minimal: "bg-transparent",
        outlined: "sage-border border-2 bg-background",
        elevated: "sage-card border shadow-lg",
        gradient: "sage-border border bg-gradient-to-br from-sage-quietude/10 to-sage-growth/10",
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const statValueVariants = cva(
  "font-bold text-foreground",
  {
    variants: {
      size: {
        sm: "text-xl",
        default: "text-2xl md:text-3xl",
        lg: "text-3xl md:text-4xl",
        xl: "text-4xl md:text-5xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

// ============================================================================
// Stat Widget Types
// ============================================================================

export type StatWidgetTrend = {
  value: number;
  label?: string;
  period?: string;
  direction: 'up' | 'down' | 'neutral';
  isPercentage?: boolean;
}

export type StatWidgetProgress = {
  value: number;
  max: number;
  label?: string;
  color?: 'default' | 'success' | 'warning' | 'danger';
}

export type StatWidgetAction = {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}

export type StatWidgetProps = {
  title: string;
  value: string | number;
  valueSize?: VariantProps<typeof statValueVariants>['size'];
  subtitle?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  trend?: StatWidgetTrend;
  progress?: StatWidgetProgress;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  actions?: StatWidgetAction[];
  loading?: boolean;
  error?: string;
  helpText?: string;
  chart?: React.ReactNode;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof statWidgetVariants>

// ============================================================================
// Main Stat Widget Component
// ============================================================================

const StatWidget = React.forwardRef<HTMLDivElement, StatWidgetProps>(
  ({
    className,
    variant,
    size,
    title,
    value,
    valueSize,
    subtitle,
    description,
    icon: Icon,
    iconColor = 'default',
    trend,
    progress,
    badge,
    badgeVariant = 'secondary',
    actions = [],
    loading = false,
    error,
    helpText,
    chart,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "div"

    const iconColorClass = {
      default: "text-sage-quietude",
      primary: "text-primary",
      success: "text-sage-growth",
      warning: "text-orange-500",
      danger: "text-destructive",
    }[iconColor]

    const trendIcon = trend
? (
      trend.direction === 'up'
? TrendingUp
      : trend.direction === 'down'
? TrendingDown
      : Minus
    )
: null

    const trendColor = trend
? (
      trend.direction === 'up'
? 'text-sage-growth'
      : trend.direction === 'down'
? 'text-destructive'
      : 'text-muted-foreground'
    )
: undefined

    if (loading) {
      return (
        <Comp
          ref={ref}
          className={cn(statWidgetVariants({ variant, size }), "animate-pulse", className)}
          {...props}
        >
          <div className="space-y-3">
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="h-8 w-3/4 rounded bg-muted" />
            <div className="h-3 w-1/3 rounded bg-muted" />
          </div>
        </Comp>
      )
    }

    if (error) {
      return (
        <Comp
          ref={ref}
          className={cn(statWidgetVariants({ variant, size }), className)}
          {...props}
        >
          <div className="flex h-full items-center justify-center text-destructive">
            <div className="text-center">
              <p className="text-sm font-medium">Error</p>
              <p className="mt-1 text-xs">{error}</p>
            </div>
          </div>
        </Comp>
      )
    }

    return (
      <Comp
        ref={ref}
        className={cn(statWidgetVariants({ variant, size }), className)}
        {...props}
      >
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={cn(
                "p-2 rounded-lg",
                variant === 'minimal' ? "sage-bg-mist/50" : "sage-bg-mist"
              )}
              >
                <Icon className={cn("h-5 w-5", iconColorClass)} />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className={cn(
                  "font-medium text-muted-foreground",
                  size === 'sm' ? "text-sm" : "text-base"
                )}
                >
                  {title}
                </h3>

                {helpText && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-4 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <Info className="size-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-sm">{helpText}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {badge && (
                  <Badge variant={badgeVariant} className="text-xs">
                    {badge}
                  </Badge>
                )}
              </div>

              {subtitle && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          {actions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="sage-hover-primary size-8"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {actions.map(action => (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={action.onClick}
                  >
                    {action.icon && (
                      <action.icon className="mr-2 size-4" />
                    )}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Value */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className={cn(statValueVariants({ size: valueSize }))}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>

            {trend && (
              <div className={cn("flex items-center gap-1", trendColor)}>
                {trendIcon && <trendIcon className="size-4" />}
                <span className="text-sm font-medium">
                  {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}
                  {Math.abs(trend.value)}
{trend.isPercentage ? '%' : ''}
                </span>
              </div>
            )}
          </div>

          {trend?.label && (
            <p className="text-xs text-muted-foreground">
              {trend.label}
{trend.period && ` ${trend.period}`}
            </p>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {/* Progress */}
        {progress && (
          <div className="mt-4 space-y-2">
            {progress.label && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{progress.label}</span>
                <span className="font-medium">
                  {progress.value}
{' '}
/
{progress.max}
                </span>
              </div>
            )}
            <Progress
              value={(progress.value / progress.max) * 100}
              className="h-2"
            />
          </div>
        )}

        {/* Chart */}
        {chart && (
          <div className="mt-4">
            {chart}
          </div>
        )}

        {/* Custom Content */}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </Comp>
    )
  }
)
StatWidget.displayName = "StatWidget"

// ============================================================================
// Compact Stat Widget
// ============================================================================

export type CompactStatWidgetProps = {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: Pick<StatWidgetTrend, 'value' | 'direction'>;
  className?: string;
}

const CompactStatWidget = React.forwardRef<HTMLDivElement, CompactStatWidgetProps>(
  ({ label, value, icon: Icon, trend, className }, ref) => {
    const trendIcon = trend
? (
      trend.direction === 'up'
? TrendingUp
      : trend.direction === 'down'
? TrendingDown
      : Minus
    )
: null

    const trendColor = trend
? (
      trend.direction === 'up'
? 'text-sage-growth'
      : trend.direction === 'down'
? 'text-destructive'
      : 'text-muted-foreground'
    )
: undefined

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between p-3 rounded-lg sage-card border",
          className
        )}
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="sage-bg-mist rounded p-1.5">
              <Icon className="size-4 text-sage-quietude" />
            </div>
          )}

          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-semibold text-foreground">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          </div>
        </div>

        {trend && (
          <div className={cn("flex items-center gap-1", trendColor)}>
            {trendIcon && <trendIcon className="size-3" />}
            <span className="text-xs font-medium">
              {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}
              {Math.abs(trend.value)}
%
            </span>
          </div>
        )}
      </div>
    )
  }
)
CompactStatWidget.displayName = "CompactStatWidget"

// ============================================================================
// Progress Stat Widget
// ============================================================================

export type ProgressStatWidgetProps = {
  title: string;
  current: number;
  target: number;
  unit?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

const ProgressStatWidget = React.forwardRef<HTMLDivElement, ProgressStatWidgetProps>(
  ({
    title,
    current,
    target,
    unit,
    showPercentage = true,
    variant = 'default',
    className
  }, ref) => {
    const percentage = Math.min((current / target) * 100, 100)

    const progressColor = {
      default: 'sage-bg-primary',
      success: 'bg-sage-growth',
      warning: 'bg-orange-500',
      danger: 'bg-destructive',
    }[variant]

    return (
      <div
        ref={ref}
        className={cn(
          "p-4 rounded-lg sage-card border space-y-3",
          className
        )}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-foreground">{title}</h3>
          {showPercentage && (
            <span className="text-sm font-medium text-muted-foreground">
              {percentage.toFixed(1)}
%
            </span>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current</span>
            <span className="font-medium">
              {current.toLocaleString()}
{unit && ` ${unit}`}
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className={cn("h-2 rounded-full transition-all duration-300", progressColor)}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Target</span>
            <span className="font-medium">
              {target.toLocaleString()}
{unit && ` ${unit}`}
            </span>
          </div>
        </div>
      </div>
    )
  }
)
ProgressStatWidget.displayName = "ProgressStatWidget"

// ============================================================================
// Example Usage Component
// ============================================================================

export function StatWidgetExample() {
  const [refreshing, setRefreshing] = React.useState<Record<string, boolean>>({})

  const handleRefresh = (widgetId: string) => {
    setRefreshing(prev => ({ ...prev, [widgetId]: true }))
    setTimeout(() => {
      setRefreshing(prev => ({ ...prev, [widgetId]: false }))
    }, 2000)
  }

  const actions: StatWidgetAction[] = [
    {
      id: 'refresh',
      label: 'Refresh Data',
      icon: RefreshCw,
      onClick: () => handleRefresh('widget1')
    },
    {
      id: 'download',
      label: 'Download Report',
      icon: Download,
      onClick: () => console.log('Download clicked')
    },
    {
      id: 'share',
      label: 'Share Widget',
      icon: Share,
      onClick: () => console.log('Share clicked')
    }
  ]

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Stat Widget Examples</h2>

      {/* Main Stat Widgets */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatWidget
          title="Total Revenue"
          value="$124,563"
          subtitle="This month"
          icon={DollarSign}
          iconColor="success"
          trend={{
            value: 12.5,
            direction: 'up',
            label: 'vs last month',
            isPercentage: true
          }}
          loading={refreshing.widget1}
          actions={actions}
          helpText="Total revenue generated from all sources this month"
        />

        <StatWidget
          title="Active Users"
          value={8924}
          subtitle="Online now"
          icon={Users}
          iconColor="primary"
          trend={{
            value: 3.2,
            direction: 'up',
            label: 'vs yesterday'
          }}
          badge="Live"
          badgeVariant="sage-accent"
          progress={{
            value: 8924,
            max: 10000,
            label: 'Monthly target'
          }}
        />

        <StatWidget
          title="Conversion Rate"
          value="3.24%"
          subtitle="Average"
          icon={Target}
          iconColor="warning"
          trend={{
            value: 0.8,
            direction: 'down',
            label: 'vs last week',
            isPercentage: true
          }}
          variant="elevated"
        />

        <StatWidget
          title="System Performance"
          value="99.9%"
          subtitle="Uptime"
          icon={Activity}
          iconColor="success"
          trend={{
            value: 0,
            direction: 'neutral',
            label: 'stable'
          }}
          variant="gradient"
          chart={(
            <div className="flex h-16 items-end justify-center rounded bg-gradient-to-r from-sage-growth/20 to-sage-growth/40">
              <div className="text-xs font-medium text-sage-growth">Performance Chart</div>
            </div>
          )}
        />
      </div>

      {/* Compact Widgets */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Compact Widgets</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CompactStatWidget
            label="Page Views"
            value={45623}
            icon={BarChart3}
            trend={{ value: 8.1, direction: 'up' }}
          />

          <CompactStatWidget
            label="Bounce Rate"
            value="32.1%"
            icon={Activity}
            trend={{ value: 2.3, direction: 'down' }}
          />

          <CompactStatWidget
            label="Session Duration"
            value="4m 32s"
            icon={Zap}
            trend={{ value: 15.7, direction: 'up' }}
          />

          <CompactStatWidget
            label="Error Rate"
            value="0.02%"
            icon={Activity}
            trend={{ value: 0.01, direction: 'neutral' }}
          />
        </div>
      </div>

      {/* Progress Widgets */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Progress Widgets</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ProgressStatWidget
            title="Sales Target"
            current={87500}
            target={100000}
            unit="$"
            variant="success"
          />

          <ProgressStatWidget
            title="User Acquisition"
            current={1842}
            target={2500}
            unit="users"
            variant="warning"
          />

          <ProgressStatWidget
            title="Storage Usage"
            current={847}
            target={1000}
            unit="GB"
            variant="danger"
          />
        </div>
      </div>

      {/* Widget States */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Widget States</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatWidget
            title="Loading State"
            value={0}
            loading
          />

          <StatWidget
            title="Error State"
            value={0}
            error="Failed to load data"
          />

          <StatWidget
            title="Minimal Variant"
            value="42K"
            subtitle="Subscribers"
            icon={Users}
            variant="minimal"
            trend={{
              value: 5.2,
              direction: 'up',
              label: 'this week'
            }}
          />
        </div>
      </div>
    </div>
  )
}

export {
  CompactStatWidget,
  ProgressStatWidget,
  StatWidget,
  type StatWidgetAction,
  type StatWidgetProgress,
  type StatWidgetTrend,
}
