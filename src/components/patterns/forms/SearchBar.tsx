"use client"

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import {
  ArrowRight,
  Loader2,
  Search,
  SlidersHorizontal,
  X
} from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/utils/Helpers"

// ============================================================================
// Search Bar Variants
// ============================================================================

const searchBarVariants = cva(
  "relative flex w-full items-center transition-all duration-200",
  {
    variants: {
      variant: {
        default: "rounded-md border bg-background",
        filled: "sage-bg-mist/50 rounded-md border",
        minimal: "border-0 bg-transparent",
        floating: "rounded-lg border bg-background/95 shadow-sm backdrop-blur-sm",
      },
      size: {
        sm: "h-9",
        default: "h-10",
        lg: "h-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const searchInputVariants = cva(
  "flex-1 border-0 bg-transparent placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0",
  {
    variants: {
      size: {
        sm: "h-7 px-3 py-1 text-sm",
        default: "h-8 px-3 py-2 text-sm",
        lg: "h-10 px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

// ============================================================================
// Search Bar Types
// ============================================================================

export type SearchFilter = {
  id: string;
  label: string;
  value: string;
  count?: number;
}

export type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  loading?: boolean;
  disabled?: boolean;
  showFilters?: boolean;
  filters?: SearchFilter[];
  activeFilters?: string[];
  onFilterChange?: (filters: string[]) => void;
  autoFocus?: boolean;
  debounceMs?: number;
  maxLength?: number;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof searchBarVariants>

// ============================================================================
// Main Search Bar Component
// ============================================================================

const SearchBar = React.forwardRef<HTMLDivElement, SearchBarProps>(
  ({
    className,
    variant,
    size,
    placeholder = "Search...",
    value,
    onValueChange,
    onSearch,
    onClear,
    loading = false,
    disabled = false,
    showFilters = false,
    filters = [],
    activeFilters = [],
    onFilterChange,
    autoFocus = false,
    debounceMs = 300,
    maxLength,
    asChild = false,
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || "")
    const [isSearching, setIsSearching] = React.useState(false)
    const debounceRef = React.useRef<NodeJS.Timeout>()
    const inputRef = React.useRef<HTMLInputElement>(null)

    const Comp = asChild ? Slot : "div"

    // Sync external value with internal state
    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value)
      }
    }, [value])

    // Debounced search
    React.useEffect(() => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      if (internalValue && onSearch) {
        setIsSearching(true)
        debounceRef.current = setTimeout(() => {
          onSearch(internalValue)
          setIsSearching(false)
        }, debounceMs)
      } else {
        setIsSearching(false)
      }

      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current)
        }
      }
    }, [internalValue, onSearch, debounceMs])

    const handleValueChange = (newValue: string) => {
      setInternalValue(newValue)
      onValueChange?.(newValue)
    }

    const handleClear = () => {
      setInternalValue("")
      onValueChange?.("")
      onClear?.()
      inputRef.current?.focus()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && internalValue) {
        onSearch?.(internalValue)
      }
      if (e.key === "Escape") {
        handleClear()
      }
    }

    const handleFilterToggle = (filterId: string) => {
      if (!onFilterChange) {
 return
}

      const newFilters = activeFilters.includes(filterId)
        ? activeFilters.filter(id => id !== filterId)
        : [...activeFilters, filterId]

      onFilterChange(newFilters)
    }

    const hasValue = internalValue.length > 0
    const hasActiveFilters = activeFilters.length > 0
    const showLoading = loading || isSearching

    return (
      <Comp
        ref={ref}
        className={cn(
          searchBarVariants({ variant, size }),
          "sage-border focus-within:sage-ring focus-within:ring-1",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {/* Search Icon */}
        <div className="flex items-center pl-3">
          <Search className={cn(
            "h-4 w-4 text-muted-foreground",
            showLoading && "animate-pulse"
          )}
          />
        </div>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={internalValue}
          onChange={e => handleValueChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          maxLength={maxLength}
          className={cn(searchInputVariants({ size }))}
          aria-label="Search input"
          aria-describedby={hasActiveFilters ? "search-filters" : undefined}
        />

        {/* Loading Indicator */}
        {showLoading && (
          <div className="flex items-center px-2">
            <Loader2 className="size-4 animate-spin text-sage-quietude" />
          </div>
        )}

        {/* Clear Button */}
        {hasValue && !disabled && (
          <Button
            variant="ghost"
            size="icon"
            className="sage-hover-primary mr-2 size-6"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X className="size-3" />
          </Button>
        )}

        {/* Filter Toggle */}
        {showFilters && filters.length > 0 && (
          <div className="sage-border mr-2 flex items-center border-l pl-2">
            <SearchFilterDropdown
              filters={filters}
              activeFilters={activeFilters}
              onFilterChange={handleFilterToggle}
              disabled={disabled}
            />
          </div>
        )}

        {/* Search Button */}
        <Button
          variant="ghost"
          size="icon"
          className="sage-hover-primary mr-2 size-6"
          onClick={() => onSearch?.(internalValue)}
          disabled={disabled || !hasValue}
          aria-label="Execute search"
        >
          <ArrowRight className="size-3" />
        </Button>

        {/* Active Filters Indicator */}
        {hasActiveFilters && (
          <div id="search-filters" className="sr-only">
            {activeFilters.length}
{' '}
filter
{activeFilters.length > 1 ? 's' : ''}
{' '}
active
          </div>
        )}
      </Comp>
    )
  }
)
SearchBar.displayName = "SearchBar"

// ============================================================================
// Search Filter Dropdown
// ============================================================================

type SearchFilterDropdownProps = {
  filters: SearchFilter[];
  activeFilters: string[];
  onFilterChange: (filterId: string) => void;
  disabled?: boolean;
}

const SearchFilterDropdown = React.forwardRef<HTMLDivElement, SearchFilterDropdownProps>(
  ({ filters, activeFilters, onFilterChange, disabled }, ref) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-6 w-6 sage-hover-primary relative",
              activeFilters.length > 0 && "sage-text-primary"
            )}
            disabled={disabled}
            aria-label={`Filters${activeFilters.length > 0 ? ` (${activeFilters.length} active)` : ''}`}
          >
            <SlidersHorizontal className="size-3" />
            {activeFilters.length > 0 && (
              <Badge
                variant="sage-accent"
                className="absolute -right-1 -top-1 size-4 p-0 text-xs"
              >
                {activeFilters.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Filters</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {filters.map((filter) => {
            const isActive = activeFilters.includes(filter.id)
            return (
              <DropdownMenuItem
                key={filter.id}
                className="cursor-pointer justify-between"
                onClick={() => onFilterChange(filter.id)}
              >
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "h-3 w-3 rounded-sm border transition-colors",
                    isActive
                      ? "sage-bg-primary border-sage-quietude"
                      : "border-muted-foreground"
                  )}
                  />
                  <span>{filter.label}</span>
                </div>
                {filter.count !== undefined && (
                  <Badge variant="secondary" className="text-xs">
                    {filter.count}
                  </Badge>
                )}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)
SearchFilterDropdown.displayName = "SearchFilterDropdown"

// ============================================================================
// Compact Search Bar
// ============================================================================

export type CompactSearchBarProps = {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const CompactSearchBar = React.forwardRef<HTMLDivElement, CompactSearchBarProps>(
  ({ placeholder = "Search...", onSearch, className }, ref) => {
    const [query, setQuery] = React.useState("")
    const [isExpanded, setIsExpanded] = React.useState(false)

    const handleSearch = () => {
      if (query.trim()) {
        onSearch?.(query.trim())
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch()
      }
      if (e.key === "Escape") {
        setQuery("")
        setIsExpanded(false)
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-center transition-all duration-200",
          isExpanded ? "w-64" : "w-10",
          className
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="sage-hover-primary size-10 shrink-0"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle search"
          aria-expanded={isExpanded}
        >
          <Search className="size-4" />
        </Button>

        {isExpanded && (
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="sage-border sage-ring absolute left-10 right-0 h-10 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1"
            autoFocus
          />
        )}
      </div>
    )
  }
)
CompactSearchBar.displayName = "CompactSearchBar"

// ============================================================================
// Example Usage Component
// ============================================================================

export function SearchBarExample() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeFilters, setActiveFilters] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(false)

  const filters: SearchFilter[] = [
    { id: "course", label: "Courses", count: 24 },
    { id: "module", label: "Modules", count: 156 },
    { id: "assessment", label: "Assessments", count: 43 },
    { id: "resource", label: "Resources", count: 89 },
  ]

  const handleSearch = async (query: string) => {
    setLoading(true)
    console.log('Searching for:', query, 'with filters:', activeFilters)
    // Simulate API call
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Default Search Bar</h3>
        <SearchBar
          placeholder="Search courses, modules, and resources..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          onSearch={handleSearch}
          loading={loading}
          showFilters
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={setActiveFilters}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Filled Variant</h3>
        <SearchBar
          variant="filled"
          size="lg"
          placeholder="Large filled search bar..."
          onSearch={handleSearch}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Compact Search</h3>
        <div className="flex justify-end">
          <CompactSearchBar
            placeholder="Quick search..."
            onSearch={handleSearch}
          />
        </div>
      </div>
    </div>
  )
}

export {
  CompactSearchBar,
  SearchBar,
  type SearchFilter,
}
