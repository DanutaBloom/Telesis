"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { ChevronRight, Home, MoreHorizontal } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/utils/Helpers"

// ============================================================================
// Breadcrumbs Context
// ============================================================================

type BreadcrumbsContextValue = {
  maxItems?: number;
  separator?: React.ReactNode;
}

const BreadcrumbsContext = React.createContext<BreadcrumbsContextValue>({})

function useBreadcrumbs() {
  return React.useContext(BreadcrumbsContext)
}

// ============================================================================
// Breadcrumbs Variants
// ============================================================================

const breadcrumbsVariants = cva(
  "flex items-center space-x-1 text-sm text-muted-foreground",
  {
    variants: {
      variant: {
        default: "",
        compact: "text-xs",
        large: "space-x-2 text-base",
      },
      style: {
        default: "",
        card: "sage-card rounded-lg p-3",
        minimal: "border-0",
      },
    },
    defaultVariants: {
      variant: "default",
      style: "default",
    },
  }
)

const breadcrumbItemVariants = cva(
  "inline-flex items-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "sage-hover-primary",
        active: "sage-text-primary font-medium",
        disabled: "cursor-default text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// ============================================================================
// Breadcrumb Item Interface
// ============================================================================

export type BreadcrumbItem = {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

// ============================================================================
// Main Breadcrumbs Component
// ============================================================================

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  maxItems?: number;
  separator?: React.ReactNode;
  showHome?: boolean;
  homeHref?: string;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
} & React.HTMLAttributes<HTMLElement> & VariantProps<typeof breadcrumbsVariants>

const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({
    className,
    variant,
    style,
    items,
    maxItems = 3,
    separator = <ChevronRight className="size-4" />,
    showHome = true,
    homeHref = "/",
    onItemClick,
    ...props
  }, ref) => {
    const contextValue = React.useMemo(() => ({ maxItems, separator }), [maxItems, separator])

    // Prepare items with home
    const allItems = React.useMemo(() => {
      const homeItem: BreadcrumbItem = {
        label: "Home",
        href: homeHref,
        icon: Home
      }
      return showHome ? [homeItem, ...items] : items
    }, [items, showHome, homeHref])

    // Handle item collapsing
    const { visibleItems, collapsedItems } = React.useMemo(() => {
      if (allItems.length <= maxItems) {
        return { visibleItems: allItems, collapsedItems: [] }
      }

      // Always show first, last, and up to maxItems-2 items
      // Reserve space for ellipsis
      const first = allItems[0]
      const last = allItems[allItems.length - 1]
      const middle = allItems.slice(1, -1)

      if (middle.length > maxItems - 2) {
        const visibleMiddleCount = Math.max(0, maxItems - 3) // Reserve space for first, last, and ellipsis
        const visibleMiddle = middle.slice(-visibleMiddleCount)
        const collapsed = middle.slice(0, middle.length - visibleMiddleCount)

        return {
          visibleItems: [first, ...visibleMiddle, last],
          collapsedItems: collapsed
        }
      }

      return { visibleItems: allItems, collapsedItems: [] }
    }, [allItems, maxItems])

    const handleItemClick = (item: BreadcrumbItem, index: number) => {
      onItemClick?.(item, index)
    }

    return (
      <BreadcrumbsContext.Provider value={contextValue}>
        <nav
          ref={ref}
          className={cn(breadcrumbsVariants({ variant, style, className }))}
          aria-label="Breadcrumb navigation"
          {...props}
        >
          <ol className="flex items-center space-x-1">
            {visibleItems.map((item, index) => {
              const isLast = index === visibleItems.length - 1
              const shouldShowEllipsis = index === 1 && collapsedItems.length > 0

              return (
                <React.Fragment key={`${item.label}-${index}`}>
                  {shouldShowEllipsis && (
                    <>
                      <BreadcrumbEllipsis items={collapsedItems} onItemClick={handleItemClick} />
                      <BreadcrumbSeparator />
                    </>
                  )}

                  <li className="flex items-center">
                    <BreadcrumbItemComponent
                      item={item}
                      index={index}
                      isLast={isLast}
                      onClick={() => handleItemClick(item, index)}
                    />
                  </li>

                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              )
            })}
          </ol>
        </nav>
      </BreadcrumbsContext.Provider>
    )
  }
)
Breadcrumbs.displayName = "Breadcrumbs"

// ============================================================================
// Breadcrumb Item Component
// ============================================================================

type BreadcrumbItemComponentProps = {
  item: BreadcrumbItem;
  index: number;
  isLast: boolean;
  onClick: () => void;
}

const BreadcrumbItemComponent = React.forwardRef<HTMLAnchorElement, BreadcrumbItemComponentProps>(
  ({ item, index, isLast, onClick }, ref) => {
    const { icon: Icon } = item
    const variant = isLast ? "active" : item.disabled ? "disabled" : "default"

    if (item.disabled || isLast) {
      return (
        <span
          className={cn(
            breadcrumbItemVariants({ variant }),
            "px-1 py-0.5",
            isLast && "font-medium sage-text-primary"
          )}
          aria-current={isLast ? "page" : undefined}
        >
          {Icon && index === 0
? (
            <Icon className="mr-1 size-4" />
          )
: null}
          <span className="max-w-[150px] truncate">{item.label}</span>
        </span>
      )
    }

    if (item.href) {
      return (
        <a
          ref={ref}
          href={item.href}
          className={cn(
            breadcrumbItemVariants({ variant }),
            "px-1 py-0.5 rounded-sm"
          )}
          onClick={(e) => {
            e.preventDefault()
            onClick()
          }}
        >
          {Icon && index === 0
? (
            <Icon className="mr-1 size-4" />
          )
: null}
          <span className="max-w-[150px] truncate">{item.label}</span>
        </a>
      )
    }

    return (
      <button
        className={cn(
          breadcrumbItemVariants({ variant }),
          "px-1 py-0.5 rounded-sm"
        )}
        onClick={onClick}
      >
        {Icon && index === 0
? (
          <Icon className="mr-1 size-4" />
        )
: null}
        <span className="max-w-[150px] truncate">{item.label}</span>
      </button>
    )
  }
)
BreadcrumbItemComponent.displayName = "BreadcrumbItemComponent"

// ============================================================================
// Breadcrumb Separator
// ============================================================================

const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => {
  const { separator } = useBreadcrumbs()

  return (
    <li
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className={cn("flex items-center text-sage-stone", className)}
      {...props}
    >
      {separator}
    </li>
  )
})
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

// ============================================================================
// Breadcrumb Ellipsis
// ============================================================================

type BreadcrumbEllipsisProps = {
  items: BreadcrumbItem[];
  onItemClick: (item: BreadcrumbItem, index: number) => void;
}

const BreadcrumbEllipsis = React.forwardRef<HTMLDivElement, BreadcrumbEllipsisProps>(
  ({ items, onItemClick }, ref) => {
    return (
      <li className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="sage-hover-primary h-auto p-1 text-sage-stone hover:text-foreground"
              aria-label="Show hidden breadcrumb items"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {items.map((item, index) => (
              <DropdownMenuItem
                key={`${item.label}-${index}`}
                onClick={() => onItemClick(item, index)}
                disabled={item.disabled}
                className="cursor-pointer"
              >
                {item.icon && (
                  <item.icon className="mr-2 size-4" />
                )}
                <span className="truncate">{item.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
    )
  }
)
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

// ============================================================================
// Simple Breadcrumbs (using existing ui/breadcrumb)
// ============================================================================

export type SimpleBreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

const SimpleBreadcrumbs = React.forwardRef<HTMLElement, SimpleBreadcrumbsProps>(
  ({ items, className, onItemClick }, ref) => {
    const handleItemClick = (item: BreadcrumbItem, index: number) => {
      onItemClick?.(item, index)
    }

    return (
      <nav
        ref={ref}
        className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}
        aria-label="Breadcrumb navigation"
      >
        <ol className="flex items-center space-x-1">
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            const { icon: Icon } = item

            return (
              <React.Fragment key={`${item.label}-${index}`}>
                <li className="flex items-center">
                  {item.href && !isLast
? (
                    <a
                      href={item.href}
                      className="sage-hover-primary rounded-sm px-1 py-0.5 transition-colors"
                      onClick={(e) => {
                        e.preventDefault()
                        handleItemClick(item, index)
                      }}
                    >
                      {Icon && index === 0 && <Icon className="mr-1 size-4" />}
                      <span>{item.label}</span>
                    </a>
                  )
: (
                    <span
                      className={cn(
                        "px-1 py-0.5",
                        isLast && "font-medium sage-text-primary"
                      )}
                      aria-current={isLast ? "page" : undefined}
                    >
                      {Icon && index === 0 && <Icon className="mr-1 size-4" />}
                      {item.label}
                    </span>
                  )}
                </li>
                {!isLast && (
                  <li
                    role="presentation"
                    aria-hidden="true"
                    className="text-sage-stone"
                  >
                    <ChevronRight className="size-4" />
                  </li>
                )}
              </React.Fragment>
            )
          })}
        </ol>
      </nav>
    )
  }
)
SimpleBreadcrumbs.displayName = "SimpleBreadcrumbs"

// ============================================================================
// Example Usage Component
// ============================================================================

export function BreadcrumbsExample() {
  const [currentPath, setCurrentPath] = React.useState([
    { label: "Learning Paths", href: "/learning-paths" },
    { label: "Frontend Development", href: "/learning-paths/frontend" },
    { label: "React Fundamentals", href: "/learning-paths/frontend/react" },
    { label: "Components", href: "/learning-paths/frontend/react/components" },
    { label: "Props and State" }, // Current page, no href
  ])

  const handleItemClick = (item: BreadcrumbItem, index: number) => {
    console.log('Breadcrumb clicked:', item.label, 'at index:', index)
    // Navigate to the item
    if (item.href) {
      // router.push(item.href)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Default Breadcrumbs</h3>
        <Breadcrumbs
          items={currentPath}
          maxItems={4}
          onItemClick={handleItemClick}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Card Style Breadcrumbs</h3>
        <Breadcrumbs
          items={currentPath}
          maxItems={3}
          style="card"
          onItemClick={handleItemClick}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Simple Breadcrumbs</h3>
        <SimpleBreadcrumbs
          items={currentPath.slice(0, 3)}
          onItemClick={handleItemClick}
        />
      </div>
    </div>
  )
}

export {
  type BreadcrumbItem,
  Breadcrumbs,
  SimpleBreadcrumbs,
}
