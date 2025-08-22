"use client"

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import {
  Bookmark,
  Calendar,
  Download,
  Edit,
  ExternalLink,
  Eye,
  Heart,
  MoreHorizontal,
  Share,
  Star,
  Tag,
  Trash2,
  User
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
import { Separator } from "@/components/ui/separator"
import { cn } from "@/utils/Helpers"

// ============================================================================
// Data Card Variants
// ============================================================================

const dataCardVariants = cva(
  "group rounded-lg transition-all duration-200",
  {
    variants: {
      variant: {
        default: "sage-card sage-hover-card border",
        outlined: "sage-border border-2 bg-background hover:border-sage-quietude/50",
        elevated: "sage-card border shadow-lg hover:shadow-xl",
        minimal: "bg-transparent hover:bg-muted/50",
        interactive: "sage-card sage-hover-card cursor-pointer border hover:scale-[1.02]",
      },
      size: {
        sm: "p-3",
        default: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const dataCardHeaderVariants = cva(
  "flex items-start justify-between",
  {
    variants: {
      spacing: {
        sm: "mb-2",
        default: "mb-3",
        lg: "mb-4",
      },
    },
    defaultVariants: {
      spacing: "default",
    },
  }
)

// ============================================================================
// Data Card Types
// ============================================================================

export type DataCardAction = {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  href?: string;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}

export type DataCardMeta = {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}

export type DataCardProps = {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  tags?: string[];
  meta?: DataCardMeta[];
  actions?: DataCardAction[];
  primaryAction?: DataCardAction;
  moreActions?: DataCardAction[];
  footer?: React.ReactNode;
  loading?: boolean;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  href?: string;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof dataCardVariants>

// ============================================================================
// Main Data Card Component
// ============================================================================

const DataCard = React.forwardRef<HTMLDivElement, DataCardProps>(
  ({
    className,
    variant,
    size,
    title,
    subtitle,
    description,
    image,
    imageAlt,
    badge,
    badgeVariant = 'secondary',
    tags = [],
    meta = [],
    actions = [],
    primaryAction,
    moreActions = [],
    footer,
    loading = false,
    selected = false,
    onSelect,
    href,
    asChild = false,
    onClick,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : href ? "a" : "div"
    const isInteractive = href || onClick
    const headerSpacing = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'

    const cardProps = {
      ref,
      className: cn(
        dataCardVariants({
          variant: isInteractive && !variant ? 'interactive' : variant,
          size
        }),
        selected && "ring-2 ring-sage-quietude ring-offset-2",
        loading && "opacity-50 pointer-events-none",
        className
      ),
      onClick: isInteractive ? onClick : undefined,
      ...(href && { href }),
      ...props,
    }

    return (
      <Comp {...cardProps}>
        {/* Selection Checkbox */}
        {onSelect && (
          <div className="absolute left-2 top-2 z-10">
            <input
              type="checkbox"
              checked={selected}
              onChange={e => onSelect(e.target.checked)}
              className="size-4 rounded border-gray-300 text-sage-quietude focus:ring-sage-quietude"
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}

        {/* Image */}
        {image && (
          <div className="relative mb-4 overflow-hidden rounded-md">
            <img
              src={image}
              alt={imageAlt || title || 'Card image'}
              className="h-48 w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            {badge && (
              <div className="absolute right-2 top-2">
                <Badge variant={badgeVariant} className="shadow-sm">
                  {badge}
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Header */}
        {(title || subtitle || badge || actions.length > 0 || primaryAction || moreActions.length > 0) && (
          <div className={cn(dataCardHeaderVariants({ spacing: headerSpacing }))}>
            <div className="min-w-0 flex-1">
              {/* Title and Badge */}
              <div className="mb-1 flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  {title && (
                    <h3 className={cn(
                      "font-semibold text-foreground",
                      size === 'sm' ? "text-sm" : size === 'lg' ? "text-lg" : "text-base",
                      href && "group-hover:text-sage-quietude transition-colors"
                    )}
                    >
                      {title}
                    </h3>
                  )}
                  {subtitle && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {subtitle}
                    </p>
                  )}
                </div>
                {badge && !image && (
                  <Badge variant={badgeVariant} className="shrink-0">
                    {badge}
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            {(actions.length > 0 || primaryAction || moreActions.length > 0) && (
              <div className="flex shrink-0 items-center gap-1">
                {/* Regular Actions */}
                {actions.map(action => (
                  <DataCardActionButton
                    key={action.id}
                    action={action}
                    size="icon"
                  />
                ))}

                {/* Primary Action */}
                {primaryAction && (
                  <DataCardActionButton
                    action={primaryAction}
                    size="sm"
                  />
                )}

                {/* More Actions Dropdown */}
                {moreActions.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="sage-hover-primary size-8 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={e => e.stopPropagation()}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {moreActions.map((action, index) => (
                        <React.Fragment key={action.id}>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              action.onClick?.()
                            }}
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
        )}

        {/* Description */}
        {description && (
          <p className={cn(
            "text-muted-foreground mb-3",
            size === 'sm' ? "text-xs" : "text-sm"
          )}
          >
            {description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Meta Information */}
        {meta.length > 0 && (
          <div className={cn(
            "grid gap-2 mb-3",
            meta.length === 1
? "grid-cols-1"
            : meta.length === 2
? "grid-cols-2"
            : "grid-cols-2 sm:grid-cols-3"
          )}
          >
            {meta.map((item, index) => (
              <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground">
                {item.icon && (
                  <item.icon className="size-3" />
                )}
                <span className="font-medium">
{item.label}
:
                </span>
                <span className="truncate">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Custom Content */}
        {children && (
          <div className="mb-3">
            {children}
          </div>
        )}

        {/* Footer */}
        {footer && (
          <>
            <Separator className="mb-3" />
            <div className="text-xs text-muted-foreground">
              {footer}
            </div>
          </>
        )}
      </Comp>
    )
  }
)
DataCard.displayName = "DataCard"

// ============================================================================
// Data Card Action Button
// ============================================================================

type DataCardActionButtonProps = {
  action: DataCardAction;
  size?: 'icon' | 'sm' | 'default';
}

const DataCardActionButton = React.forwardRef<HTMLButtonElement, DataCardActionButtonProps>(
  ({ action, size = 'icon' }, ref) => {
    const buttonProps = {
      ref,
      variant: 'ghost' as const,
      size,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        action.onClick?.()
      },
      disabled: action.disabled,
      className: cn(
        "sage-hover-primary",
        size === 'icon' && "h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
      ),
    }

    if (action.href) {
      return (
        <Button
          {...buttonProps}
          asChild
        >
          <a href={action.href} onClick={e => e.stopPropagation()}>
            {action.icon && <action.icon className="size-4" />}
            {size !== 'icon' && action.label}
          </a>
        </Button>
      )
    }

    return (
      <Button {...buttonProps}>
        {action.icon && <action.icon className="size-4" />}
        {size !== 'icon' && action.label}
      </Button>
    )
  }
)
DataCardActionButton.displayName = "DataCardActionButton"

// ============================================================================
// Content Card Component
// ============================================================================

export type ContentCardProps = {
  category?: string;
  author?: string;
  publishDate?: string;
  readTime?: string;
  rating?: number;
  maxRating?: number;
  views?: number;
  likes?: number;
  bookmarked?: boolean;
  onToggleBookmark?: () => void;
  onToggleLike?: () => void;
} & Omit<DataCardProps, 'meta'>

const ContentCard = React.forwardRef<HTMLDivElement, ContentCardProps>(
  ({
    category,
    author,
    publishDate,
    readTime,
    rating,
    maxRating = 5,
    views,
    likes,
    bookmarked = false,
    onToggleBookmark,
    onToggleLike,
    ...dataCardProps
  }, ref) => {
    const meta: DataCardMeta[] = []

    if (author) {
      meta.push({ label: 'Author', value: author, icon: User })
    }

    if (publishDate) {
      meta.push({ label: 'Published', value: publishDate, icon: Calendar })
    }

    if (readTime) {
      meta.push({ label: 'Read time', value: readTime })
    }

    if (views) {
      meta.push({ label: 'Views', value: views.toLocaleString(), icon: Eye })
    }

    const actions: DataCardAction[] = []

    if (onToggleLike) {
      actions.push({
        id: 'like',
        label: `${likes || 0} likes`,
        icon: Heart,
        onClick: onToggleLike,
      })
    }

    if (onToggleBookmark) {
      actions.push({
        id: 'bookmark',
        label: bookmarked ? 'Remove bookmark' : 'Bookmark',
        icon: Bookmark,
        onClick: onToggleBookmark,
      })
    }

    const ratingDisplay = rating
? (
      <div className="flex items-center gap-1">
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3 w-3",
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            )}
          />
        ))}
        <span className="ml-1 text-xs text-muted-foreground">
          {rating}
/
{maxRating}
        </span>
      </div>
    )
: null

    return (
      <DataCard
        ref={ref}
        meta={meta}
        actions={actions}
        badge={category}
        footer={ratingDisplay}
        {...dataCardProps}
      />
    )
  }
)
ContentCard.displayName = "ContentCard"

// ============================================================================
// Stats Card Component
// ============================================================================

export type StatsCardProps = {
  value: string | number;
  label: string;
  change?: {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: React.ComponentType<{ className?: string }>;
  chart?: React.ReactNode;
} & Omit<DataCardProps, 'children'>

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({
    value,
    label,
    change,
    icon: Icon,
    chart,
    ...dataCardProps
  }, ref) => {
    const trendColor = change
? (
      change.trend === 'up'
? 'text-sage-growth'
      : change.trend === 'down'
? 'text-destructive'
      : 'text-muted-foreground'
    )
: undefined

    return (
      <DataCard
        ref={ref}
        variant="elevated"
        {...dataCardProps}
      >
        <div className="mb-2 flex items-center justify-between">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              {Icon && (
                <div className="sage-bg-mist rounded-lg p-2">
                  <Icon className="size-4 text-sage-quietude" />
                </div>
              )}
              <p className="text-sm font-medium text-muted-foreground">
                {label}
              </p>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>

            {change && (
              <div className={cn("flex items-center gap-1 mt-1", trendColor)}>
                <span className="text-xs font-medium">
                  {change.trend === 'up' ? '+' : change.trend === 'down' ? '-' : ''}
                  {Math.abs(change.value)}
%
                </span>
                {change.label && (
                  <span className="text-xs text-muted-foreground">
                    {change.label}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {chart && (
          <div className="mt-4">
            {chart}
          </div>
        )}
      </DataCard>
    )
  }
)
StatsCard.displayName = "StatsCard"

// ============================================================================
// Example Usage Component
// ============================================================================

export function DataCardExample() {
  const [selectedCards, setSelectedCards] = React.useState<string[]>([])
  const [bookmarked, setBookmarked] = React.useState<Record<string, boolean>>({})
  const [liked, setLiked] = React.useState<Record<string, boolean>>({})

  const toggleSelection = (cardId: string, selected: boolean) => {
    setSelectedCards(prev =>
      selected
        ? [...prev, cardId]
        : prev.filter(id => id !== cardId)
    )
  }

  const toggleBookmark = (cardId: string) => {
    setBookmarked(prev => ({ ...prev, [cardId]: !prev[cardId] }))
  }

  const toggleLike = (cardId: string) => {
    setLiked(prev => ({ ...prev, [cardId]: !prev[cardId] }))
  }

  const contentActions: DataCardAction[] = [
    {
      id: 'share',
      label: 'Share',
      icon: Share,
      onClick: () => console.log('Share clicked')
    },
    {
      id: 'external',
      label: 'Open External',
      icon: ExternalLink,
      href: '#'
    }
  ]

  const moreActions: DataCardAction[] = [
    {
      id: 'edit',
      label: 'Edit',
      icon: Edit,
      onClick: () => console.log('Edit clicked')
    },
    {
      id: 'download',
      label: 'Download',
      icon: Download,
      onClick: () => console.log('Download clicked')
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      variant: 'destructive',
      onClick: () => console.log('Delete clicked')
    }
  ]

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Data Card Examples</h2>

      {/* Stats Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Stats Cards</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            value={1234}
            label="Total Users"
            change={{ value: 12.5, trend: 'up', label: 'from last month' }}
            icon={User}
          />
          <StatsCard
            value="$45.2K"
            label="Revenue"
            change={{ value: 8.2, trend: 'up' }}
          />
          <StatsCard
            value={89}
            label="Active Sessions"
            change={{ value: 2.1, trend: 'down', label: 'from yesterday' }}
          />
          <StatsCard
            value="98.5%"
            label="Uptime"
            change={{ value: 0, trend: 'neutral' }}
          />
        </div>
      </div>

      {/* Content Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Content Cards</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ContentCard
            title="Introduction to React Hooks"
            subtitle="Learning Path: Frontend Development"
            description="Learn the fundamentals of React Hooks and how to use them to build modern React applications."
            image="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop"
            category="Course"
            author="John Doe"
            publishDate="2024-01-15"
            readTime="45 min"
            rating={4}
            views={1234}
            likes={89}
            bookmarked={bookmarked.course1}
            onToggleBookmark={() => toggleBookmark('course1')}
            onToggleLike={() => toggleLike('course1')}
            onSelect={selected => toggleSelection('course1', selected)}
            selected={selectedCards.includes('course1')}
            href="#"
            actions={contentActions}
            moreActions={moreActions}
          />

          <ContentCard
            title="Advanced TypeScript Patterns"
            subtitle="Tutorial Series"
            description="Explore advanced TypeScript patterns and techniques for building type-safe applications."
            category="Tutorial"
            author="Jane Smith"
            publishDate="2024-01-20"
            readTime="30 min"
            rating={5}
            views={2456}
            likes={156}
            bookmarked={bookmarked.course2}
            onToggleBookmark={() => toggleBookmark('course2')}
            onToggleLike={() => toggleLike('course2')}
            onSelect={selected => toggleSelection('course2', selected)}
            selected={selectedCards.includes('course2')}
            href="#"
            variant="elevated"
          />

          <DataCard
            title="Custom Data Card"
            description="This is a custom data card with various features and content."
            badge="New"
            tags={['React', 'TypeScript', 'UI']}
            meta={[
              { label: 'Status', value: 'Active', icon: Tag },
              { label: 'Updated', value: '2 hours ago', icon: Calendar }
            ]}
            primaryAction={{
              id: 'view',
              label: 'View Details',
              onClick: () => console.log('View clicked')
            }}
            moreActions={moreActions}
            onSelect={selected => toggleSelection('custom1', selected)}
            selected={selectedCards.includes('custom1')}
          >
            <div className="flex h-20 items-center justify-center rounded bg-gradient-to-r from-sage-quietude/20 to-sage-growth/20">
              <span className="text-sm text-muted-foreground">Custom Content</span>
            </div>
          </DataCard>
        </div>
      </div>

      {/* Selection Summary */}
      {selectedCards.length > 0 && (
        <div className="sage-border mt-6 rounded-lg border bg-sage-mist/30 p-4">
          <p className="text-sm font-medium">
            Selected
{' '}
{selectedCards.length}
{' '}
card
{selectedCards.length > 1 ? 's' : ''}
          </p>
          <div className="mt-2 flex gap-2">
            <Button size="sm" variant="outline">
              Export Selected
            </Button>
            <Button size="sm" variant="outline">
              Bulk Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedCards([])}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export {
  ContentCard,
  DataCard,
  type DataCardAction,
  type DataCardMeta,
  StatsCard,
}
