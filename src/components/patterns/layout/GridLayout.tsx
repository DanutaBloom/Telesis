"use client"

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { GripVertical } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/utils/Helpers"

// ============================================================================
// Grid Layout Variants
// ============================================================================

const gridLayoutVariants = cva(
  "grid w-full transition-all duration-200",
  {
    variants: {
      variant: {
        default: "gap-6",
        compact: "gap-4",
        spacious: "gap-8",
        tight: "gap-2",
      },
      columns: {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
        6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
        auto: "grid-cols-[repeat(auto-fit,minmax(280px,1fr))]",
        custom: "", // For custom grid-template-columns
      },
      alignment: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
      },
    },
    defaultVariants: {
      variant: "default",
      columns: "auto",
      alignment: "stretch",
    },
  }
)

const gridItemVariants = cva(
  "transition-all duration-200",
  {
    variants: {
      span: {
        1: "col-span-1",
        2: "col-span-1 md:col-span-2",
        3: "col-span-1 md:col-span-2 lg:col-span-3",
        4: "col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4",
        full: "col-span-full",
        auto: "col-auto",
      },
      order: {
        first: "order-first",
        last: "order-last",
        1: "order-1",
        2: "order-2",
        3: "order-3",
        4: "order-4",
        5: "order-5",
        none: "order-none",
      },
    },
    defaultVariants: {
      span: "auto",
      order: "none",
    },
  }
)

// ============================================================================
// Grid Layout Types
// ============================================================================

export type GridLayoutProps = {
  minItemWidth?: string;
  maxItemWidth?: string;
  aspectRatio?: string;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof gridLayoutVariants>

export type GridItemProps = {
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof gridItemVariants>

// ============================================================================
// Main Grid Layout Component
// ============================================================================

const GridLayout = React.forwardRef<HTMLDivElement, GridLayoutProps>(
  ({
    className,
    variant,
    columns,
    alignment,
    minItemWidth,
    maxItemWidth,
    aspectRatio,
    asChild = false,
    style,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "div"

    // Custom grid template columns based on min/max width
    const customStyle = React.useMemo(() => {
      const styles: React.CSSProperties = { ...style }

      if (columns === "custom" || minItemWidth || maxItemWidth) {
        const minWidth = minItemWidth || "280px"
        const maxWidth = maxItemWidth || "1fr"
        styles.gridTemplateColumns = `repeat(auto-fit, minmax(${minWidth}, ${maxWidth}))`
      }

      if (aspectRatio) {
        styles.gridAutoRows = `minmax(0, ${aspectRatio})`
      }

      return styles
    }, [style, columns, minItemWidth, maxItemWidth, aspectRatio])

    return (
      <Comp
        ref={ref}
        className={cn(gridLayoutVariants({ variant, columns, alignment, className }))}
        style={customStyle}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
GridLayout.displayName = "GridLayout"

// ============================================================================
// Grid Item Component
// ============================================================================

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({
    className,
    span,
    order,
    draggable = false,
    onDragStart,
    onDragEnd,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "div"

    return (
      <Comp
        ref={ref}
        className={cn(
          gridItemVariants({ span, order }),
          draggable && "cursor-move",
          className
        )}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
GridItem.displayName = "GridItem"

// ============================================================================
// Responsive Grid Component
// ============================================================================

export type ResponsiveGridProps = {
  breakpoints?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
} & Omit<GridLayoutProps, 'columns'>

const ResponsiveGrid = React.forwardRef<HTMLDivElement, ResponsiveGridProps>(
  ({ breakpoints = { sm: 1, md: 2, lg: 3, xl: 4 }, className, ...props }, ref) => {
    const [currentColumns, setCurrentColumns] = React.useState(1)

    React.useEffect(() => {
      const updateColumns = () => {
        const width = window.innerWidth

        if (width >= 1280 && breakpoints.xl) {
          setCurrentColumns(breakpoints.xl)
        } else if (width >= 1024 && breakpoints.lg) {
          setCurrentColumns(breakpoints.lg)
        } else if (width >= 768 && breakpoints.md) {
          setCurrentColumns(breakpoints.md)
        } else if (width >= 640 && breakpoints.sm) {
          setCurrentColumns(breakpoints.sm)
        } else {
          setCurrentColumns(1)
        }
      }

      updateColumns()
      window.addEventListener('resize', updateColumns)
      return () => window.removeEventListener('resize', updateColumns)
    }, [breakpoints])

    const gridClasses = cn(
      "grid w-full transition-all duration-200",
      `grid-cols-${currentColumns}`,
      className
    )

    return (
      <div
        ref={ref}
        className={gridClasses}
        {...props}
      />
    )
  }
)
ResponsiveGrid.displayName = "ResponsiveGrid"

// ============================================================================
// Masonry Grid Component
// ============================================================================

export type MasonryGridProps = {
  columns?: number;
  gap?: string;
  minItemWidth?: string;
} & React.HTMLAttributes<HTMLDivElement>

const MasonryGrid = React.forwardRef<HTMLDivElement, MasonryGridProps>(
  ({
    className,
    columns = 3,
    gap = "1rem",
    minItemWidth = "300px",
    children,
    ...props
  }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [columnElements, setColumnElements] = React.useState<React.ReactNode[][]>([])

    React.useEffect(() => {
      if (!containerRef.current) {
 return
}

      const childArray = React.Children.toArray(children)
      const newColumns: React.ReactNode[][] = Array.from({ length: columns }, () => [])

      childArray.forEach((child, index) => {
        const columnIndex = index % columns
        newColumns[columnIndex].push(child)
      })

      setColumnElements(newColumns)
    }, [children, columns])

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          className
        )}
        style={{
          gap,
          gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`
        }}
        {...props}
      >
        {columnElements.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className="flex flex-1 flex-col"
            style={{ gap }}
          >
            {column}
          </div>
        ))}
      </div>
    )
  }
)
MasonryGrid.displayName = "MasonryGrid"

// ============================================================================
// Grid Card Component
// ============================================================================

export type GridCardProps = {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated' | 'minimal';
  padding?: 'none' | 'sm' | 'default' | 'lg';
} & GridItemProps

const gridCardVariants = cva(
  "rounded-lg transition-all duration-200",
  {
    variants: {
      variant: {
        default: "sage-card border",
        outlined: "sage-border border-2 bg-background",
        elevated: "sage-card border shadow-lg",
        minimal: "bg-transparent",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        default: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
)

const GridCard = React.forwardRef<HTMLDivElement, GridCardProps>(
  ({
    className,
    variant = "default",
    padding = "default",
    title,
    description,
    actions,
    children,
    ...gridItemProps
  }, ref) => {
    return (
      <GridItem
        ref={ref}
        className={cn(
          gridCardVariants({ variant, padding }),
          className
        )}
        {...gridItemProps}
      >
        {(title || description || actions) && (
          <div className="mb-4 flex items-start justify-between">
            <div className="min-w-0 flex-1">
              {title && (
                <h3 className="mb-1 truncate font-semibold text-foreground">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            {actions && (
              <div className="ml-4 shrink-0">
                {actions}
              </div>
            )}
          </div>
        )}
        {children}
      </GridItem>
    )
  }
)
GridCard.displayName = "GridCard"

// ============================================================================
// Dashboard Grid Component
// ============================================================================

export type DashboardWidget = {
  id: string;
  title: string;
  content: React.ReactNode;
  span?: GridItemProps['span'];
  order?: GridItemProps['order'];
  draggable?: boolean;
}

export type DashboardGridProps = {
  widgets: DashboardWidget[];
  onWidgetDrag?: (widgetId: string, newPosition: number) => void;
  editable?: boolean;
} & GridLayoutProps

const DashboardGrid = React.forwardRef<HTMLDivElement, DashboardGridProps>(
  ({
    widgets,
    onWidgetDrag,
    editable = false,
    className,
    ...gridProps
  }, ref) => {
    const [draggedWidget, setDraggedWidget] = React.useState<string | null>(null)

    const handleDragStart = (widgetId: string) => (e: React.DragEvent) => {
      setDraggedWidget(widgetId)
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', widgetId)
    }

    const handleDragEnd = () => {
      setDraggedWidget(null)
    }

    const handleDrop = (targetIndex: number) => (e: React.DragEvent) => {
      e.preventDefault()
      const widgetId = e.dataTransfer.getData('text/plain')
      if (widgetId && onWidgetDrag) {
        onWidgetDrag(widgetId, targetIndex)
      }
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    }

    return (
      <GridLayout
        ref={ref}
        className={cn("relative", className)}
        {...gridProps}
      >
        {widgets.map((widget, index) => (
          <GridCard
            key={widget.id}
            title={widget.title}
            span={widget.span}
            order={widget.order}
            draggable={editable && widget.draggable}
            onDragStart={handleDragStart(widget.id)}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop(index)}
            onDragOver={handleDragOver}
            className={cn(
              editable && widget.draggable && "cursor-move",
              draggedWidget === widget.id && "opacity-50"
            )}
            actions={
              editable && widget.draggable
? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 text-muted-foreground hover:text-foreground"
                  aria-label="Drag widget"
                >
                  <GripVertical className="size-3" />
                </Button>
              )
: undefined
            }
          >
            {widget.content}
          </GridCard>
        ))}
      </GridLayout>
    )
  }
)
DashboardGrid.displayName = "DashboardGrid"

// ============================================================================
// Example Usage Component
// ============================================================================

export function GridLayoutExample() {
  const [editable, setEditable] = React.useState(false)
  const [widgets, setWidgets] = React.useState<DashboardWidget[]>([
    {
      id: 'stats',
      title: 'Statistics',
      span: '2',
      content: (
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Users</span>
            <span className="font-semibold">1,234</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Active Sessions</span>
            <span className="font-semibold">89</span>
          </div>
        </div>
      ),
      draggable: true
    },
    {
      id: 'chart',
      title: 'Performance Chart',
      span: '2',
      content: (
        <div className="flex h-32 items-center justify-center rounded bg-gradient-to-r from-sage-quietude/20 to-sage-growth/20">
          <span className="text-sm text-muted-foreground">Chart Component</span>
        </div>
      ),
      draggable: true
    },
    {
      id: 'recent',
      title: 'Recent Activity',
      span: '1',
      content: (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">User logged in</div>
          <div className="text-xs text-muted-foreground">New course created</div>
          <div className="text-xs text-muted-foreground">Assessment completed</div>
        </div>
      ),
      draggable: true
    },
    {
      id: 'notifications',
      title: 'Notifications',
      span: '1',
      content: (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">3 new messages</div>
          <div className="text-xs text-muted-foreground">Update available</div>
        </div>
      ),
      draggable: true
    }
  ])

  const handleWidgetDrag = (widgetId: string, newPosition: number) => {
    const widget = widgets.find(w => w.id === widgetId)
    if (widget) {
      const newWidgets = widgets.filter(w => w.id !== widgetId)
      newWidgets.splice(newPosition, 0, widget)
      setWidgets(newWidgets)
    }
  }

  const sampleCards = Array.from({ length: 12 }, (_, i) => (
    <GridCard
      key={i}
      title={`Card ${i + 1}`}
      description={`Description for card ${i + 1}`}
      variant={i % 3 === 0 ? "elevated" : "default"}
    >
      <div className="flex h-24 items-center justify-center rounded bg-gradient-to-br from-sage-quietude/10 to-sage-growth/10">
        <span className="text-sm text-muted-foreground">
Content
{i + 1}
        </span>
      </div>
    </GridCard>
  ))

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Grid Layout Examples</h2>

        {/* Dashboard Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Dashboard Grid</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditable(!editable)}
            >
              {editable ? 'Lock' : 'Edit'}
{' '}
Layout
            </Button>
          </div>

          <DashboardGrid
            widgets={widgets}
            onWidgetDrag={handleWidgetDrag}
            editable={editable}
            variant="default"
            columns={4}
          />
        </div>
      </div>

      {/* Auto-fit Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Auto-fit Grid</h3>
        <GridLayout
          variant="default"
          columns="auto"
          minItemWidth="280px"
          maxItemWidth="400px"
        >
          {sampleCards.slice(0, 6)}
        </GridLayout>
      </div>

      {/* Fixed Columns Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">3-Column Grid</h3>
        <GridLayout
          variant="compact"
          columns={3}
          alignment="start"
        >
          {sampleCards.slice(0, 9)}
        </GridLayout>
      </div>

      {/* Masonry Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Masonry Grid</h3>
        <MasonryGrid columns={3} gap="1.5rem">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="sage-card rounded-lg border p-4"
              style={{ height: `${120 + (i % 3) * 40}px` }}
            >
              <h4 className="mb-2 font-medium">
Masonry Item
{i + 1}
              </h4>
              <p className="text-sm text-muted-foreground">
                Variable height content
{' '}
{i + 1}
              </p>
            </div>
          ))}
        </MasonryGrid>
      </div>
    </div>
  )
}

export {
  DashboardGrid,
  type DashboardWidget,
  GridCard,
  GridItem,
  GridLayout,
  MasonryGrid,
  ResponsiveGrid,
}
