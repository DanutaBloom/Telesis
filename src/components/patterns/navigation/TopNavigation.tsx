"use client"

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import {
  Bell,
  LogOut,
  Menu,
  Monitor,
  Moon,
  Search,
  Settings,
  Sun,
  User
} from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/utils/Helpers"

// ============================================================================
// Navigation Variants
// ============================================================================

const topNavigationVariants = cva(
  "flex w-full items-center justify-between border-b bg-background px-4 py-3 transition-colors",
  {
    variants: {
      variant: {
        default: "sage-border",
        primary: "sage-bg-mist/50 border-sage-quietude/20",
        floating: "border-0 bg-background/95 shadow-sm backdrop-blur-md",
        transparent: "border-0 bg-transparent",
      },
      size: {
        default: "h-16",
        sm: "h-14 py-2",
        lg: "h-20 py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const navigationItemVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "sage-hover-primary sage-ring",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        active: "sage-bg-primary text-primary-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// ============================================================================
// Main Navigation Component
// ============================================================================

export type TopNavigationProps = {
  asChild?: boolean;
} & React.HTMLAttributes<HTMLElement> & VariantProps<typeof topNavigationVariants>

const TopNavigation = React.forwardRef<HTMLElement, TopNavigationProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "header"

    return (
      <Comp
        ref={ref}
        className={cn(topNavigationVariants({ variant, size, className }))}
        role="banner"
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
TopNavigation.displayName = "TopNavigation"

// ============================================================================
// Navigation Brand
// ============================================================================

export type NavigationBrandProps = {
  logo?: React.ReactNode;
  title?: string;
  href?: string;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement>

const NavigationBrand = React.forwardRef<HTMLDivElement, NavigationBrandProps>(
  ({ className, logo, title, href, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : href ? "a" : "div"
    const brandProps = href ? { href } : {}

    return (
      <Comp
        ref={ref}
        className={cn(
          "flex items-center gap-3 font-semibold text-lg",
          href && "sage-hover-primary rounded-md px-2 py-1 transition-colors",
          className
        )}
        {...brandProps}
        {...props}
      >
        {logo && (
          <div className="size-8 shrink-0">
            {logo}
          </div>
        )}
        {title && (
          <span className="sage-text-primary">{title}</span>
        )}
        {children}
      </Comp>
    )
  }
)
NavigationBrand.displayName = "NavigationBrand"

// ============================================================================
// Navigation Menu
// ============================================================================

const NavigationMenu = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn("flex items-center space-x-1", className)}
    {...props}
  />
))
NavigationMenu.displayName = "NavigationMenu"

// ============================================================================
// Navigation Item
// ============================================================================

export type NavigationItemProps = {
  asChild?: boolean;
  active?: boolean;
  href?: string;
  badge?: string | number;
} & React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof navigationItemVariants>

const NavigationItem = React.forwardRef<HTMLButtonElement, NavigationItemProps>(
  ({
    className,
    variant,
    size,
    asChild = false,
    active = false,
    badge,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    const itemVariant = active ? "active" : variant

    return (
      <Comp
        ref={ref}
        className={cn(navigationItemVariants({ variant: itemVariant, size, className }))}
        aria-current={active ? "page" : undefined}
        {...props}
      >
        <span className="relative">
          {children}
          {badge && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 size-5 p-0 text-xs"
            >
              {badge}
            </Badge>
          )}
        </span>
      </Comp>
    )
  }
)
NavigationItem.displayName = "NavigationItem"

// ============================================================================
// Navigation Search
// ============================================================================

export type NavigationSearchProps = {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const NavigationSearch = React.forwardRef<HTMLDivElement, NavigationSearchProps>(
  ({ placeholder = "Search...", onSearch, className, ...props }, ref) => {
    const [query, setQuery] = React.useState("")

    const handleSearch = React.useCallback((e: React.FormEvent) => {
      e.preventDefault()
      onSearch?.(query)
    }, [query, onSearch])

    return (
      <div
        ref={ref}
        className={cn("relative flex-1 max-w-sm", className)}
        {...props}
      >
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={placeholder}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="sage-ring pl-9"
            />
          </div>
        </form>
      </div>
    )
  }
)
NavigationSearch.displayName = "NavigationSearch"

// ============================================================================
// Navigation Actions
// ============================================================================

const NavigationActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center space-x-2", className)}
    {...props}
  />
))
NavigationActions.displayName = "NavigationActions"

// ============================================================================
// User Menu Component
// ============================================================================

export type UserMenuProps = {
  user?: {
    name: string;
    email?: string;
    avatar?: string;
    initials?: string;
  };
  onSignOut?: () => void;
  className?: string;
}

const UserMenu = React.forwardRef<HTMLDivElement, UserMenuProps>(
  ({ user, onSignOut, className }, ref) => {
    return (
      <div ref={ref} className={className}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="sage-ring relative size-8 rounded-full"
            >
              {user?.avatar
? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="size-8 rounded-full object-cover"
                />
              )
: (
                <div className="sage-bg-primary flex size-8 items-center justify-center rounded-full text-sm font-medium text-primary-foreground">
                  {user?.initials || user?.name?.charAt(0) || "U"}
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || "User"}
                </p>
                {user?.email && (
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 size-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 size-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Monitor className="mr-2 size-4" />
                <span>Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Sun className="mr-2 size-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Moon className="mr-2 size-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Monitor className="mr-2 size-4" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut}>
              <LogOut className="mr-2 size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
)
UserMenu.displayName = "UserMenu"

// ============================================================================
// Mobile Menu Toggle
// ============================================================================

export type MobileMenuToggleProps = {
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

const MobileMenuToggle = React.forwardRef<HTMLButtonElement, MobileMenuToggleProps>(
  ({ isOpen = false, onToggle, className }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("md:hidden sage-hover-primary", className)}
        onClick={onToggle}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <Menu className="size-4" />
      </Button>
    )
  }
)
MobileMenuToggle.displayName = "MobileMenuToggle"

// ============================================================================
// Example Usage Component
// ============================================================================

export function TopNavigationExample() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const user = {
    name: "John Doe",
    email: "john@example.com",
    initials: "JD"
  }

  return (
    <TopNavigation variant="default">
      <div className="flex items-center gap-4">
        <MobileMenuToggle
          isOpen={mobileMenuOpen}
          onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <NavigationBrand
          title="Modern Sage"
          logo={
            <div className="sage-bg-primary size-8 rounded-lg" />
          }
        />
      </div>

      <NavigationMenu className="hidden md:flex">
        <NavigationItem active>Dashboard</NavigationItem>
        <NavigationItem>Learning Paths</NavigationItem>
        <NavigationItem>Materials</NavigationItem>
        <NavigationItem>Analytics</NavigationItem>
      </NavigationMenu>

      <NavigationActions>
        <NavigationSearch
          placeholder="Search courses..."
          onSearch={setSearchQuery}
          className="hidden sm:flex"
        />

        <NavigationItem variant="ghost" size="icon" badge="3">
          <Bell className="size-4" />
        </NavigationItem>

        <UserMenu
          user={user}
          onSignOut={() => console.log("Sign out")}
        />
      </NavigationActions>
    </TopNavigation>
  )
}

export {
  MobileMenuToggle,
  NavigationActions,
  NavigationBrand,
  NavigationItem,
  NavigationMenu,
  NavigationSearch,
  TopNavigation,
  UserMenu,
}
