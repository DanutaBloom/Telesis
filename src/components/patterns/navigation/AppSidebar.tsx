"use client"

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import {
  BarChart3,
  BookOpen,
  ChevronRight,
  FileText,
  Home,
  Menu,
  Settings,
  User,
  X
} from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/utils/Helpers"

// ============================================================================
// Sidebar Context
// ============================================================================

type SidebarContextValue = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

// ============================================================================
// Sidebar Variants
// ============================================================================

const sidebarVariants = cva(
  "flex h-full flex-col border-r bg-background transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "sage-border",
        primary: "sage-bg-mist border-sage-quietude/20",
        accent: "border-sage-growth/20 bg-sage-growth/5",
      },
      collapsed: {
        true: "w-16",
        false: "w-64",
      },
    },
    defaultVariants: {
      variant: "default",
      collapsed: false,
    },
  }
)

const sidebarItemVariants = cva(
  "flex w-full items-center justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "sage-hover-primary sage-ring",
        active: "sage-bg-primary text-primary-foreground",
        destructive: "hover:bg-destructive/10 hover:text-destructive focus-visible:ring-destructive",
      },
      size: {
        default: "h-10",
        sm: "h-9 px-2",
        lg: "h-11 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// ============================================================================
// Sidebar Provider
// ============================================================================

export type SidebarProviderProps = {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  collapsedBreakpoint?: number;
}

export function SidebarProvider({
  children,
  defaultCollapsed = false,
  collapsedBreakpoint = 768
}: SidebarProviderProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < collapsedBreakpoint
      setIsMobile(mobile)
      if (mobile && !collapsed) {
        setCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [collapsed, collapsedBreakpoint])

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, isMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

// ============================================================================
// Main Sidebar Component
// ============================================================================

export type AppSidebarProps = {
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof sidebarVariants>

const AppSidebar = React.forwardRef<HTMLDivElement, AppSidebarProps>(
  ({ className, variant, asChild = false, children, ...props }, ref) => {
    const { collapsed } = useSidebar()
    const Comp = asChild ? Slot : "div"

    return (
      <Comp
        ref={ref}
        className={cn(sidebarVariants({ variant, collapsed, className }))}
        data-collapsed={collapsed}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
AppSidebar.displayName = "AppSidebar"

// ============================================================================
// Sidebar Header
// ============================================================================

export type SidebarHeaderProps = {
  showToggle?: boolean;
} & React.HTMLAttributes<HTMLDivElement>

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, showToggle = true, children, ...props }, ref) => {
    const { collapsed, setCollapsed } = useSidebar()

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between p-4",
          collapsed && "justify-center px-2",
          className
        )}
        {...props}
      >
        {!collapsed && (
          <div className="flex-1">
            {children}
          </div>
        )}
        {showToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="sage-hover-primary"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <Menu className="size-4" /> : <X className="size-4" />}
          </Button>
        )}
      </div>
    )
  }
)
SidebarHeader.displayName = "SidebarHeader"

// ============================================================================
// Sidebar Content
// ============================================================================

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-y-auto px-3 py-2", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

// ============================================================================
// Sidebar Footer
// ============================================================================

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-auto border-t pt-4 px-3 pb-4 sage-border", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

// ============================================================================
// Sidebar Navigation
// ============================================================================

const SidebarNav = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn("space-y-1", className)}
    {...props}
  />
))
SidebarNav.displayName = "SidebarNav"

// ============================================================================
// Sidebar Group
// ============================================================================

export type SidebarGroupProps = {
  title?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
} & React.HTMLAttributes<HTMLDivElement>

const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, title, collapsible = false, defaultOpen = true, children, ...props }, ref) => {
    const { collapsed } = useSidebar()
    const [isOpen, setIsOpen] = React.useState(defaultOpen)

    if (collapsed && title) {
      return (
        <div className="px-2 py-1">
          <Separator className="sage-border" />
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn("space-y-1", className)}
        {...props}
      >
        {title && !collapsed && (
          <div className="px-3 py-2">
            {collapsible
? (
              <Button
                variant="ghost"
                className="sage-hover-primary h-auto p-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                onClick={() => setIsOpen(!isOpen)}
              >
                <ChevronRight
                  className={cn(
                    "mr-2 h-3 w-3 transition-transform",
                    isOpen && "rotate-90"
                  )}
                />
                {title}
              </Button>
            )
: (
              <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {title}
              </h3>
            )}
          </div>
        )}
        {(!collapsible || isOpen) && (
          <div className="space-y-1">
            {children}
          </div>
        )}
      </div>
    )
  }
)
SidebarGroup.displayName = "SidebarGroup"

// ============================================================================
// Sidebar Item
// ============================================================================

export type SidebarItemProps = {
  asChild?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  active?: boolean;
  href?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof sidebarItemVariants>

const SidebarItem = React.forwardRef<HTMLButtonElement, SidebarItemProps>(
  ({
    className,
    variant,
    size,
    asChild = false,
    icon: Icon,
    badge,
    active = false,
    children,
    ...props
  }, ref) => {
    const { collapsed } = useSidebar()
    const Comp = asChild ? Slot : "button"
    const itemVariant = active ? "active" : variant

    return (
      <Comp
        ref={ref}
        className={cn(sidebarItemVariants({ variant: itemVariant, size, className }))}
        aria-current={active ? "page" : undefined}
        {...props}
      >
        {Icon && (
          <Icon className={cn(
            "h-4 w-4 flex-shrink-0",
            collapsed ? "mx-auto" : "mr-3"
          )}
          />
        )}
        {!collapsed && (
          <span className="flex-1 truncate text-left">{children}</span>
        )}
        {!collapsed && badge && (
          <Badge variant="secondary" className="ml-auto">
            {badge}
          </Badge>
        )}
      </Comp>
    )
  }
)
SidebarItem.displayName = "SidebarItem"

// ============================================================================
// Example Usage Component
// ============================================================================

export function AppSidebarExample() {
  return (
    <SidebarProvider defaultCollapsed={false}>
      <AppSidebar variant="default">
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="sage-bg-primary size-8 rounded-lg" />
            <span className="font-semibold">Modern Sage</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarNav>
            <SidebarGroup>
              <SidebarItem icon={Home} active>
                Dashboard
              </SidebarItem>
              <SidebarItem icon={BookOpen} badge="3">
                Learning Paths
              </SidebarItem>
              <SidebarItem icon={FileText}>
                Materials
              </SidebarItem>
              <SidebarItem icon={BarChart3}>
                Analytics
              </SidebarItem>
            </SidebarGroup>

            <SidebarGroup title="Account" collapsible>
              <SidebarItem icon={User}>
                Profile
              </SidebarItem>
              <SidebarItem icon={Settings}>
                Settings
              </SidebarItem>
            </SidebarGroup>
          </SidebarNav>
        </SidebarContent>

        <SidebarFooter>
          <SidebarItem icon={User}>
            John Doe
          </SidebarItem>
        </SidebarFooter>
      </AppSidebar>
    </SidebarProvider>
  )
}

export {
  AppSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarNav,
  SidebarProvider,
  useSidebar,
}
