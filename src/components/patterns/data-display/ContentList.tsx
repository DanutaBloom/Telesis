"use client"

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import {
  Calendar,
  Edit,
  ExternalLink,
  Eye,
  Filter,
  Grid3X3,
  List,
  MoreHorizontal,
  Search,
  SortAsc,
  SortDesc,
  Tag,
  Trash2,
  User
} from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/utils/Helpers"

// ============================================================================
// Content List Variants
// ============================================================================

const contentListVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "space-y-1",
        separated: "sage-border divide-y",
        cards: "space-y-4",
        grid: "grid gap-4",
      },
      size: {
        sm: "text-sm",
        default: "",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const contentListItemVariants = cva(
  "group transition-all duration-200",
  {
    variants: {
      variant: {
        default: "sage-hover-primary rounded-md p-3",
        separated: "sage-hover-primary p-4",
        card: "sage-card sage-hover-card rounded-lg border p-4",
        minimal: "sage-hover-primary rounded p-2",
      },
      state: {
        default: "",
        selected: "sage-bg-primary/10 border-sage-quietude",
        disabled: "cursor-not-allowed opacity-50",
        dragging: "scale-95 opacity-50",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "default",
    },
  }
)

// ============================================================================
// Content List Types
// ============================================================================

export type ContentListAction = {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: (item: ContentListItem) => void;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}

export type ContentListItem = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  tags?: string[];
  meta?: Array<{
    label: string;
    value: React.ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  href?: string;
  disabled?: boolean;
  selected?: boolean;
  data?: Record<string, any>;
}

export type ContentListColumn = {
  id: string;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (item: ContentListItem) => React.ReactNode;
}

export type ContentListFilter = {
  id: string;
  label: string;
  type: 'select' | 'checkbox' | 'search';
  options?: Array<{ label: string; value: string }>;
  value?: any;
}

export type ContentListProps = {
  items: ContentListItem[];
  columns?: ContentListColumn[];
  actions?: ContentListAction[];
  moreActions?: ContentListAction[];
  selectable?: boolean;
  selectedItems?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filterable?: boolean;
  filters?: ContentListFilter[];
  onFilterChange?: (filterId: string, value: any) => void;
  sortable?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (sortBy: string, order: 'asc' | 'desc') => void;
  viewMode?: 'list' | 'grid' | 'table';
  onViewModeChange?: (mode: 'list' | 'grid' | 'table') => void;
  loading?: boolean;
  empty?: React.ReactNode;
  onItemClick?: (item: ContentListItem) => void;
  draggable?: boolean;
  onItemDrag?: (fromIndex: number, toIndex: number) => void;
  gridColumns?: number;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof contentListVariants>

// ============================================================================
// Main Content List Component
// ============================================================================

const ContentList = React.forwardRef<HTMLDivElement, ContentListProps>(
  ({
    className,
    variant,
    size,
    items,
    columns,
    actions = [],
    moreActions = [],
    selectable = false,
    selectedItems = [],
    onSelectionChange,
    searchable = false,
    searchPlaceholder = "Search...",
    searchValue,
    onSearchChange,
    filterable = false,
    filters = [],
    onFilterChange,
    sortable = false,
    sortBy,
    sortOrder = 'asc',
    onSortChange,
    viewMode = 'list',
    onViewModeChange,
    loading = false,
    empty,
    onItemClick,
    draggable = false,
    onItemDrag,
    gridColumns = 3,
    asChild = false,
    ...props
  }, ref) => {
    const [draggedItem, setDraggedItem] = React.useState<string | null>(null)
    const [dropTarget, setDropTarget] = React.useState<string | null>(null)

    const Comp = asChild ? Slot : "div"

    const hasToolbar = searchable || filterable || sortable || onViewModeChange || selectable
    const allSelected = selectedItems.length === items.length && items.length > 0
    const someSelected = selectedItems.length > 0 && selectedItems.length < items.length

    const handleSelectAll = () => {
      if (allSelected) {
        onSelectionChange?.([])
      } else {
        onSelectionChange?.(items.map(item => item.id))
      }
    }

    const handleItemSelect = (itemId: string, selected: boolean) => {
      const newSelection = selected
        ? [...selectedItems, itemId]
        : selectedItems.filter(id => id !== itemId)
      onSelectionChange?.(newSelection)
    }

    const handleDragStart = (itemId: string) => (e: React.DragEvent) => {
      setDraggedItem(itemId)
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', itemId)
    }

    const handleDragEnd = () => {
      setDraggedItem(null)
      setDropTarget(null)
    }

    const handleDragOver = (itemId: string) => (e: React.DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      setDropTarget(itemId)
    }

    const handleDrop = (targetId: string) => (e: React.DragEvent) => {
      e.preventDefault()
      const sourceId = e.dataTransfer.getData('text/plain')
      if (sourceId && sourceId !== targetId && onItemDrag) {
        const sourceIndex = items.findIndex(item => item.id === sourceId)
        const targetIndex = items.findIndex(item => item.id === targetId)
        onItemDrag(sourceIndex, targetIndex)
      }
      setDropTarget(null)
    }

    if (loading) {
      return (
        <Comp ref={ref} className={cn("space-y-3", className)} {...props}>
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4 p-4">
                <div className="size-12 rounded bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </Comp>
      )
    }

    if (items.length === 0) {
      return (
        <Comp ref={ref} className={cn("text-center py-12", className)} {...props}>
          {empty || (
            <div className="space-y-2">
              <p className="text-muted-foreground">No items found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </Comp>
      )
    }

    return (
      <Comp ref={ref} className={cn("space-y-4", className)} {...props}>
        {/* Toolbar */}
        {hasToolbar && (
          <ContentListToolbar
            searchable={searchable}
            searchPlaceholder={searchPlaceholder}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            filterable={filterable}
            filters={filters}
            onFilterChange={onFilterChange}
            sortable={sortable}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={onSortChange}
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            selectable={selectable}
            allSelected={allSelected}
            someSelected={someSelected}
            onSelectAll={handleSelectAll}
            selectedCount={selectedItems.length}
            totalCount={items.length}
          />
        )}

        {/* Content */}
        <div className={cn(
          contentListVariants({ variant: viewMode === 'grid' ? 'grid' : variant, size }),
          viewMode === 'grid' && `grid-cols-1 md:grid-cols-2 lg:grid-cols-${gridColumns}`
        )}
        >
          {items.map((item, _index) => (
            <ContentListItemComponent
              key={item.id}
              item={item}
              variant={viewMode === 'grid' ? 'card' : variant === 'cards' ? 'card' : variant === 'separated' ? 'separated' : 'default'}
              selected={selectedItems.includes(item.id)}
              onSelect={selectable ? selected => handleItemSelect(item.id, selected) : undefined}
              onClick={onItemClick}
              actions={actions}
              moreActions={moreActions}
              draggable={draggable}
              onDragStart={handleDragStart(item.id)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver(item.id)}
              onDrop={handleDrop(item.id)}
              isDragging={draggedItem === item.id}
              isDropTarget={dropTarget === item.id}
              columns={columns}
              viewMode={viewMode}
            />
          ))}
        </div>
      </Comp>
    )
  }
)
ContentList.displayName = "ContentList"

// ============================================================================
// Content List Toolbar
// ============================================================================

type ContentListToolbarProps = {
  searchable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filterable?: boolean;
  filters?: ContentListFilter[];
  onFilterChange?: (filterId: string, value: any) => void;
  sortable?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (sortBy: string, order: 'asc' | 'desc') => void;
  viewMode?: 'list' | 'grid' | 'table';
  onViewModeChange?: (mode: 'list' | 'grid' | 'table') => void;
  selectable?: boolean;
  allSelected?: boolean;
  someSelected?: boolean;
  onSelectAll?: () => void;
  selectedCount?: number;
  totalCount?: number;
}

const ContentListToolbar = React.forwardRef<HTMLDivElement, ContentListToolbarProps>(
  ({
    searchable,
    searchPlaceholder,
    searchValue,
    onSearchChange,
    filterable,
    filters,
    onFilterChange,
    sortable,
    sortBy: _sortBy,
    sortOrder,
    onSortChange,
    viewMode,
    onViewModeChange,
    selectable,
    allSelected,
    someSelected,
    onSelectAll,
    selectedCount,
    totalCount,
  }, ref) => {
    return (
      <div ref={ref} className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          {/* Selection */}
          {selectable && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) {
 el.indeterminate = someSelected ?? false
}
                }}
                onChange={onSelectAll}
                className="size-4 rounded border-gray-300 text-sage-quietude focus:ring-sage-quietude"
              />
              {selectedCount && selectedCount > 0 && (
                <span className="text-sm text-muted-foreground">
                  {selectedCount}
{' '}
of
{totalCount}
{' '}
selected
                </span>
              )}
            </div>
          )}

          {/* Search */}
          {searchable && (
            <div className="relative min-w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue || ''}
                onChange={e => onSearchChange?.(e.target.value)}
                className="pl-9"
              />
            </div>
          )}

          {/* Filters */}
          {filterable && filters && filters.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 size-4" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filters</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filters.map(filter => (
                  <DropdownMenuCheckboxItem
                    key={filter.id}
                    checked={!!filter.value}
                    onCheckedChange={checked => onFilterChange?.(filter.id, checked)}
                  >
                    {filter.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort */}
          {sortable && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {sortOrder === 'asc'
? (
                    <SortAsc className="mr-2 size-4" />
                  )
: (
                    <SortDesc className="mr-2 size-4" />
                  )}
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onSortChange?.('title', 'asc')}>
                  Title (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortChange?.('title', 'desc')}>
                  Title (Z-A)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortChange?.('date', 'desc')}>
                  Date (Newest)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortChange?.('date', 'asc')}>
                  Date (Oldest)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* View Mode */}
          {onViewModeChange && (
            <div className="sage-border flex rounded-md border">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-r-none border-r"
                onClick={() => onViewModeChange('list')}
              >
                <List className="size-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-none border-r"
                onClick={() => onViewModeChange('grid')}
              >
                <Grid3X3 className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }
)
ContentListToolbar.displayName = "ContentListToolbar"

// ============================================================================
// Content List Item Component
// ============================================================================

type ContentListItemComponentProps = {
  item: ContentListItem;
  variant?: VariantProps<typeof contentListItemVariants>['variant'];
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  onClick?: (item: ContentListItem) => void;
  actions?: ContentListAction[];
  moreActions?: ContentListAction[];
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  isDragging?: boolean;
  isDropTarget?: boolean;
  columns?: ContentListColumn[];
  viewMode?: 'list' | 'grid' | 'table';
}

const ContentListItemComponent = React.forwardRef<HTMLDivElement, ContentListItemComponentProps>(
  ({
    item,
    variant = 'default',
    selected,
    onSelect,
    onClick,
    actions = [],
    moreActions = [],
    draggable,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    isDragging,
    isDropTarget,
    columns: _columns,
    viewMode,
  }, ref) => {
    const itemState = selected ? 'selected' : item.disabled ? 'disabled' : isDragging ? 'dragging' : 'default'
    const isClickable = onClick || item.href

    const handleClick = () => {
      if (!item.disabled && onClick) {
        onClick(item)
      }
    }

    const content = (
      <div
        ref={ref}
        className={cn(
          contentListItemVariants({ variant, state: itemState }),
          isDropTarget && "border-2 border-dashed border-sage-quietude",
          isClickable && "cursor-pointer",
          draggable && "cursor-move"
        )}
        onClick={handleClick}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <div className="flex items-start gap-3">
          {/* Selection Checkbox */}
          {onSelect && (
            <div className="flex items-center pt-1">
              <input
                type="checkbox"
                checked={selected}
                onChange={e => onSelect(e.target.checked)}
                onClick={e => e.stopPropagation()}
                className="size-4 rounded border-gray-300 text-sage-quietude focus:ring-sage-quietude"
              />
            </div>
          )}

          {/* Image */}
          {item.image && (
            <div className="shrink-0">
              <img
                src={item.image}
                alt={item.imageAlt || item.title}
                className={cn(
                  "rounded object-cover",
                  viewMode === 'grid' ? "w-full h-32" : "w-12 h-12"
                )}
              />
            </div>
          )}

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className={cn(
                  "font-medium text-foreground truncate",
                  isClickable && "group-hover:text-sage-quietude transition-colors"
                )}
                >
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="truncate text-sm text-muted-foreground">
                    {item.subtitle}
                  </p>
                )}
              </div>

              {item.badge && (
                <Badge variant={item.badgeVariant} className="ml-2 shrink-0">
                  {item.badge}
                </Badge>
              )}
            </div>

            {item.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {item.description}
              </p>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +
{item.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Meta */}
            {item.meta && item.meta.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                {item.meta.map((meta, index) => (
                  <div key={index} className="flex items-center gap-1">
                    {meta.icon && <meta.icon className="size-3" />}
                    <span>
{meta.label}
:
{' '}
{meta.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          {(actions.length > 0 || moreActions.length > 0) && (
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              {actions.map(action => (
                <Button
                  key={action.id}
                  variant="ghost"
                  size="icon"
                  className="sage-hover-primary size-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    action.onClick?.(item)
                  }}
                  disabled={action.disabled}
                >
                  {action.icon && <action.icon className="size-4" />}
                </Button>
              ))}

              {moreActions.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="sage-hover-primary size-8"
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
                            action.onClick?.(item)
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
      </div>
    )

    if (item.href) {
      return (
        <a href={item.href} className="block">
          {content}
        </a>
      )
    }

    return content
  }
)
ContentListItemComponent.displayName = "ContentListItemComponent"

// ============================================================================
// Example Usage Component
// ============================================================================

export function ContentListExample() {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([])
  const [searchValue, setSearchValue] = React.useState('')
  const [viewMode, setViewMode] = React.useState<'list' | 'grid' | 'table'>('list')
  const [items, setItems] = React.useState<ContentListItem[]>([
    {
      id: '1',
      title: 'Introduction to React Hooks',
      subtitle: 'Frontend Development Course',
      description: 'Learn the fundamentals of React Hooks and how to use them to build modern React applications.',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=120&fit=crop',
      badge: 'Course',
      tags: ['React', 'JavaScript', 'Hooks'],
      meta: [
        { label: 'Duration', value: '4 hours', icon: Calendar },
        { label: 'Author', value: 'John Doe', icon: User },
        { label: 'Level', value: 'Beginner', icon: Tag }
      ]
    },
    {
      id: '2',
      title: 'Advanced TypeScript Patterns',
      subtitle: 'Programming Tutorial',
      description: 'Explore advanced TypeScript patterns and techniques for building type-safe applications.',
      badge: 'Tutorial',
      badgeVariant: 'secondary',
      tags: ['TypeScript', 'Patterns', 'Advanced'],
      meta: [
        { label: 'Duration', value: '2 hours', icon: Calendar },
        { label: 'Author', value: 'Jane Smith', icon: User }
      ]
    },
    {
      id: '3',
      title: 'Building Responsive Layouts',
      subtitle: 'CSS & Design',
      description: 'Master CSS Grid and Flexbox to create beautiful, responsive web layouts.',
      image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=200&h=120&fit=crop',
      badge: 'Workshop',
      badgeVariant: 'destructive',
      tags: ['CSS', 'Layout', 'Responsive'],
      meta: [
        { label: 'Duration', value: '3 hours', icon: Calendar },
        { label: 'Author', value: 'Mike Johnson', icon: User }
      ]
    },
    {
      id: '4',
      title: 'API Design Best Practices',
      description: 'Learn how to design clean, maintainable, and scalable APIs.',
      badge: 'Guide',
      tags: ['API', 'Backend', 'Design'],
      meta: [
        { label: 'Read time', value: '15 min', icon: Calendar },
        { label: 'Author', value: 'Sarah Wilson', icon: User }
      ]
    }
  ])

  const actions: ContentListAction[] = [
    {
      id: 'view',
      label: 'View',
      icon: Eye,
      onClick: item => console.log('View:', item.title)
    },
    {
      id: 'external',
      label: 'Open External',
      icon: ExternalLink,
      onClick: item => console.log('External:', item.title)
    }
  ]

  const moreActions: ContentListAction[] = [
    {
      id: 'edit',
      label: 'Edit',
      icon: Edit,
      onClick: item => console.log('Edit:', item.title)
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      variant: 'destructive',
      onClick: item => console.log('Delete:', item.title)
    }
  ]

  const filteredItems = items.filter(item =>
    searchValue === ''
    || item.title.toLowerCase().includes(searchValue.toLowerCase())
    || item.description?.toLowerCase().includes(searchValue.toLowerCase())
  )

  const handleItemDrag = (fromIndex: number, toIndex: number) => {
    const newItems = [...items]
    const [draggedItem] = newItems.splice(fromIndex, 1)
    if (draggedItem) {
      newItems.splice(toIndex, 0, draggedItem)
    }
    setItems(newItems)
  }

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Content List Examples</h2>

      {/* Interactive List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Interactive Content List</h3>
        <ContentList
          items={filteredItems}
          variant={viewMode === 'grid' ? 'cards' : 'default'}
          selectable
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          searchable
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search courses and tutorials..."
          sortable
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          actions={actions}
          moreActions={moreActions}
          onItemClick={item => console.log('Clicked:', item.title)}
          draggable={viewMode === 'list'}
          onItemDrag={handleItemDrag}
          gridColumns={2}
        />
      </div>

      {/* Simple List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Simple List</h3>
        <ContentList
          items={items.slice(0, 3)}
          variant="separated"
          onItemClick={item => console.log('Simple click:', item.title)}
        />
      </div>

      {/* Card Layout */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Card Layout</h3>
        <ContentList
          items={items}
          variant="cards"
          viewMode="grid"
          gridColumns={3}
          selectable
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          actions={actions[0] ? [actions[0]] : []}
          moreActions={moreActions}
        />
      </div>

      {/* Selection Summary */}
      {selectedItems.length > 0 && (
        <div className="sage-border mt-6 rounded-lg border bg-sage-mist/30 p-4">
          <p className="mb-2 text-sm font-medium">
            {selectedItems.length}
{' '}
item
{selectedItems.length > 1 ? 's' : ''}
{' '}
selected
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Bulk Edit
            </Button>
            <Button size="sm" variant="outline">
              Export
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedItems([])}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export { ContentList }
