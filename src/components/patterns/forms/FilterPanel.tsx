"use client"

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import {
  Check,
  Search,
  SlidersHorizontal,
  X
} from "lucide-react"
import * as React from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/utils/Helpers"

// ============================================================================
// Filter Panel Variants
// ============================================================================

const filterPanelVariants = cva(
  "flex flex-col rounded-lg border bg-background transition-all duration-200",
  {
    variants: {
      variant: {
        default: "sage-border",
        card: "sage-card shadow-sm",
        minimal: "border-0 bg-transparent",
        sidebar: "sage-border h-full border-r bg-background",
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

const filterGroupVariants = cva(
  "space-y-3",
  {
    variants: {
      variant: {
        default: "",
        collapsible: "sage-border rounded-md border",
        card: "sage-card rounded-lg p-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// ============================================================================
// Filter Types
// ============================================================================

export type FilterOption = {
  id: string;
  label: string;
  value: string | number | boolean;
  count?: number;
  disabled?: boolean;
  description?: string;
}

export type FilterGroup = {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'date' | 'search' | 'select';
  options?: FilterOption[];
  value?: any;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  multiple?: boolean;
  searchable?: boolean;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export type ActiveFilter = {
  groupId: string;
  optionId?: string;
  label: string;
  value: any;
}

export type FilterPanelProps = {
  groups: FilterGroup[];
  activeFilters?: ActiveFilter[];
  onFilterChange?: (groupId: string, value: any) => void;
  onClearAll?: () => void;
  showActiveCount?: boolean;
  showClearAll?: boolean;
  collapsible?: boolean;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof filterPanelVariants>

// ============================================================================
// Main Filter Panel Component
// ============================================================================

const FilterPanel = React.forwardRef<HTMLDivElement, FilterPanelProps>(
  ({
    className,
    variant,
    size,
    groups,
    activeFilters = [],
    onFilterChange,
    onClearAll,
    showActiveCount = true,
    showClearAll = true,
    collapsible = false,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "div"
    const activeCount = activeFilters.length

    const handleClearAll = () => {
      onClearAll?.()
    }

    const handleFilterChange = (groupId: string, value: any) => {
      onFilterChange?.(groupId, value)
    }

    return (
      <Comp
        ref={ref}
        className={cn(filterPanelVariants({ variant, size, className }))}
        {...props}
      >
        {/* Filter Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-sage-quietude" />
            <h3 className="text-sm font-semibold">Filters</h3>
            {showActiveCount && activeCount > 0 && (
              <Badge variant="sage-accent" className="text-xs">
                {activeCount}
              </Badge>
            )}
          </div>

          {showClearAll && activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="sage-hover-primary h-auto p-1 text-xs"
            >
              Clear all
            </Button>
          )}
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mb-4">
            <Label className="mb-2 block text-xs text-muted-foreground">
              Active Filters
            </Label>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <ActiveFilterBadge
                  key={`${filter.groupId}-${filter.optionId || index}`}
                  filter={filter}
                  onRemove={() => {
                    // Find the group and clear the specific filter
                    const group = groups.find(g => g.id === filter.groupId)
                    if (group) {
                      if (group.type === 'checkbox' && group.multiple) {
                        // Remove from array
                        const currentValue = group.value || []
                        const newValue = currentValue.filter((v: any) => v !== filter.value)
                        handleFilterChange(filter.groupId, newValue)
                      } else {
                        // Clear single value
                        handleFilterChange(filter.groupId, null)
                      }
                    }
                  }}
                />
              ))}
            </div>
            <Separator className="mt-4" />
          </div>
        )}

        {/* Filter Groups */}
        <div className="flex-1 space-y-4">
          {collapsible
? (
            <Accordion type="multiple" className="space-y-2">
              {groups.map(group => (
                <AccordionItem
                  key={group.id}
                  value={group.id}
                  className="sage-border rounded-md border"
                >
                  <AccordionTrigger className="sage-hover-primary px-3 py-2 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{group.label}</span>
                      {getGroupActiveCount(group, activeFilters) > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {getGroupActiveCount(group, activeFilters)}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3">
                    <FilterGroupComponent
                      group={group}
                      activeFilters={activeFilters}
                      onFilterChange={handleFilterChange}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )
: (
            groups.map(group => (
              <div key={group.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">{group.label}</Label>
                  {getGroupActiveCount(group, activeFilters) > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {getGroupActiveCount(group, activeFilters)}
                    </Badge>
                  )}
                </div>
                <FilterGroupComponent
                  group={group}
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                />
                <Separator className="!mt-4" />
              </div>
            ))
          )}
        </div>

        {children}
      </Comp>
    )
  }
)
FilterPanel.displayName = "FilterPanel"

// ============================================================================
// Filter Group Component
// ============================================================================

type FilterGroupComponentProps = {
  group: FilterGroup;
  activeFilters: ActiveFilter[];
  onFilterChange: (groupId: string, value: any) => void;
}

const FilterGroupComponent = React.forwardRef<HTMLDivElement, FilterGroupComponentProps>(
  ({ group, activeFilters, onFilterChange }, ref) => {
    const [searchQuery, setSearchQuery] = React.useState("")

    const groupActiveFilters = activeFilters.filter(f => f.groupId === group.id)
    const currentValue = group.value

    const filteredOptions = React.useMemo(() => {
      if (!group.options || !searchQuery) {
 return group.options || []
}
      return group.options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }, [group.options, searchQuery])

    const handleOptionChange = (option: FilterOption, checked: boolean) => {
      if (group.type === 'checkbox' && group.multiple) {
        const currentValues = currentValue || []
        const newValues = checked
          ? [...currentValues, option.value]
          : currentValues.filter((v: any) => v !== option.value)
        onFilterChange(group.id, newValues)
      } else if (group.type === 'radio' || (group.type === 'checkbox' && !group.multiple)) {
        onFilterChange(group.id, checked ? option.value : null)
      }
    }

    const isOptionActive = (option: FilterOption) => {
      if (group.multiple && Array.isArray(currentValue)) {
        return currentValue.includes(option.value)
      }
      return currentValue === option.value
    }

    return (
      <div ref={ref} className="space-y-3">
        {/* Search within options */}
        {group.searchable && group.options && group.options.length > 5 && (
          <div className="relative">
            <Search className="absolute left-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={`Search ${group.label.toLowerCase()}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-8 pl-7 text-xs"
            />
          </div>
        )}

        {/* Render based on filter type */}
        {group.type === 'checkbox' || group.type === 'radio'
? (
          <div className="max-h-48 space-y-2 overflow-y-auto">
            {filteredOptions.map(option => (
              <FilterOptionItem
                key={option.id}
                option={option}
                type={group.type}
                checked={isOptionActive(option)}
                onChange={checked => handleOptionChange(option, checked)}
              />
            ))}
          </div>
        )
: group.type === 'search'
? (
          <Input
            placeholder={group.placeholder || `Search ${group.label.toLowerCase()}...`}
            value={currentValue || ""}
            onChange={e => onFilterChange(group.id, e.target.value)}
            className="h-8"
          />
        )
: group.type === 'range'
? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                min={group.min}
                max={group.max}
                step={group.step}
                value={currentValue?.min || ""}
                onChange={e => onFilterChange(group.id, {
                  ...currentValue,
                  min: e.target.value ? Number(e.target.value) : undefined
                })}
                className="h-8"
              />
              <Input
                type="number"
                placeholder="Max"
                min={group.min}
                max={group.max}
                step={group.step}
                value={currentValue?.max || ""}
                onChange={e => onFilterChange(group.id, {
                  ...currentValue,
                  max: e.target.value ? Number(e.target.value) : undefined
                })}
                className="h-8"
              />
            </div>
          </div>
        )
: group.type === 'date'
? (
          <div className="space-y-2">
            <Input
              type="date"
              value={currentValue?.start || ""}
              onChange={e => onFilterChange(group.id, {
                ...currentValue,
                start: e.target.value
              })}
              className="h-8"
            />
            <Input
              type="date"
              value={currentValue?.end || ""}
              onChange={e => onFilterChange(group.id, {
                ...currentValue,
                end: e.target.value
              })}
              className="h-8"
            />
          </div>
        )
: null}
      </div>
    )
  }
)
FilterGroupComponent.displayName = "FilterGroupComponent"

// ============================================================================
// Filter Option Item
// ============================================================================

type FilterOptionItemProps = {
  option: FilterOption;
  type: 'checkbox' | 'radio';
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const FilterOptionItem = React.forwardRef<HTMLDivElement, FilterOptionItemProps>(
  ({ option, type, checked, onChange }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 rounded-sm p-2 cursor-pointer transition-colors",
          "sage-hover-primary",
          checked && "sage-bg-mist/30",
          option.disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => !option.disabled && onChange(!checked)}
      >
        <div className={cn(
          "h-3 w-3 border transition-colors flex items-center justify-center",
          type === 'radio' ? "rounded-full" : "rounded-sm",
          checked
            ? "sage-bg-primary border-sage-quietude"
            : "border-muted-foreground"
        )}
        >
          {checked && (
            <Check className="size-2 text-primary-foreground" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="truncate text-sm">{option.label}</span>
            {option.count !== undefined && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {option.count}
              </Badge>
            )}
          </div>
          {option.description && (
            <p className="mt-1 text-xs text-muted-foreground">
              {option.description}
            </p>
          )}
        </div>
      </div>
    )
  }
)
FilterOptionItem.displayName = "FilterOptionItem"

// ============================================================================
// Active Filter Badge
// ============================================================================

type ActiveFilterBadgeProps = {
  filter: ActiveFilter;
  onRemove: () => void;
}

const ActiveFilterBadge = React.forwardRef<HTMLDivElement, ActiveFilterBadgeProps>(
  ({ filter, onRemove }, ref) => {
    return (
      <Badge
        ref={ref}
        variant="sage-accent"
        className="flex items-center gap-1 pr-1 text-xs"
      >
        <span className="max-w-24 truncate">{filter.label}</span>
        <Button
          variant="ghost"
          size="icon"
          className="size-3 p-0 hover:bg-transparent"
          onClick={onRemove}
          aria-label={`Remove ${filter.label} filter`}
        >
          <X className="size-2" />
        </Button>
      </Badge>
    )
  }
)
ActiveFilterBadge.displayName = "ActiveFilterBadge"

// ============================================================================
// Utility Functions
// ============================================================================

function getGroupActiveCount(group: FilterGroup, activeFilters: ActiveFilter[]): number {
  return activeFilters.filter(f => f.groupId === group.id).length
}

// ============================================================================
// Example Usage Component
// ============================================================================

export function FilterPanelExample() {
  const [filters, setFilters] = React.useState<Record<string, any>>({})
  const [activeFilters, setActiveFilters] = React.useState<ActiveFilter[]>([])

  const filterGroups: FilterGroup[] = [
    {
      id: 'category',
      label: 'Category',
      type: 'checkbox',
      multiple: true,
      searchable: true,
      options: [
        { id: 'course', label: 'Courses', value: 'course', count: 24 },
        { id: 'module', label: 'Modules', value: 'module', count: 156 },
        { id: 'assessment', label: 'Assessments', value: 'assessment', count: 43 },
        { id: 'resource', label: 'Resources', value: 'resource', count: 89 },
      ]
    },
    {
      id: 'difficulty',
      label: 'Difficulty Level',
      type: 'radio',
      options: [
        { id: 'beginner', label: 'Beginner', value: 'beginner', count: 67 },
        { id: 'intermediate', label: 'Intermediate', value: 'intermediate', count: 124 },
        { id: 'advanced', label: 'Advanced', value: 'advanced', count: 45 },
      ]
    },
    {
      id: 'duration',
      label: 'Duration (minutes)',
      type: 'range',
      min: 0,
      max: 240,
      step: 15
    },
    {
      id: 'dateRange',
      label: 'Created Date',
      type: 'date'
    },
    {
      id: 'search',
      label: 'Title Search',
      type: 'search',
      placeholder: 'Search by title...'
    }
  ]

  const handleFilterChange = (groupId: string, value: any) => {
    setFilters(prev => ({ ...prev, [groupId]: value }))

    // Update active filters for display
    const newActiveFilters = Object.entries({ ...filters, [groupId]: value })
      .filter(([_, val]) => val !== null && val !== undefined && val !== "")
      .flatMap(([id, val]) => {
        const group = filterGroups.find(g => g.id === id)
        if (!group) {
 return []
}

        if (Array.isArray(val)) {
          return val.map((v) => {
            const option = group.options?.find(o => o.value === v)
            return {
              groupId: id,
              optionId: option?.id,
              label: option?.label || String(v),
              value: v
            }
          })
        } else if (group.type === 'range' && val.min !== undefined || val.max !== undefined) {
          return [{
            groupId: id,
            label: `${group.label}: ${val.min || 0}-${val.max || '∞'}`,
            value: val
          }]
        } else if (group.type === 'date' && (val.start || val.end)) {
          return [{
            groupId: id,
            label: `${group.label}: ${val.start || ''} - ${val.end || ''}`,
            value: val
          }]
        } else {
          const option = group.options?.find(o => o.value === val)
          return [{
            groupId: id,
            optionId: option?.id,
            label: option?.label || String(val),
            value: val
          }]
        }
      })

    setActiveFilters(newActiveFilters)
  }

  const handleClearAll = () => {
    setFilters({})
    setActiveFilters([])
  }

  return (
    <div className="space-y-8 p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h3 className="mb-4 text-lg font-semibold">Default Filter Panel</h3>
          <FilterPanel
            groups={filterGroups.map(g => ({ ...g, value: filters[g.id] }))}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
          />
        </div>

        <div className="lg:col-span-1">
          <h3 className="mb-4 text-lg font-semibold">Card Variant</h3>
          <FilterPanel
            variant="card"
            groups={filterGroups.slice(0, 3).map(g => ({ ...g, value: filters[g.id] }))}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
          />
        </div>

        <div className="lg:col-span-1">
          <h3 className="mb-4 text-lg font-semibold">Collapsible Variant</h3>
          <FilterPanel
            variant="default"
            collapsible
            groups={filterGroups.map(g => ({ ...g, value: filters[g.id] }))}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
          />
        </div>
      </div>

      <div className="mt-8">
        <h4 className="mb-2 font-medium">Current Filter State:</h4>
        <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">
          {JSON.stringify(filters, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export {
  type ActiveFilter,
  type FilterGroup,
  type FilterOption,
  FilterPanel,
}
