"use client"

import * as React from "react"

import { cn } from "@/utils/Helpers"

// Custom Tabs implementation without Radix dependency
type TabsContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue>({})

type TabsProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ value: controlledValue, defaultValue, onValueChange, children, className, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || '')
    const value = controlledValue ?? internalValue

    const handleValueChange = React.useCallback((newValue: string) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    }, [controlledValue, onValueChange])

    return (
      <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = 'Tabs'

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="tablist"
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      "sage-border border",
      className
    )}
    {...props}
  />
))
TabsList.displayName = 'TabsList'

type TabsTriggerProps = {
  value: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value: triggerValue, onClick, children, ...props }, ref) => {
    const { value, onValueChange } = React.useContext(TabsContext)
    const isActive = value === triggerValue

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onValueChange?.(triggerValue)
      onClick?.(event)
    }

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        aria-controls={`tabpanel-${triggerValue}`}
        tabIndex={isActive ? 0 : -1}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all",
          "focus-visible:outline-none sage-ring focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          isActive && "bg-background text-foreground shadow-sm sage-text-primary border-sage-quietude/20",
          "hover:text-sage-quietude hover:bg-sage-mist/50 transition-colors",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    )
  }
)
TabsTrigger.displayName = 'TabsTrigger'

type TabsContentProps = {
  value: string;
} & React.HTMLAttributes<HTMLDivElement>

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value: contentValue, ...props }, ref) => {
    const { value } = React.useContext(TabsContext)
    const isActive = value === contentValue

    if (!isActive) {
 return null
}

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`tabpanel-${contentValue}`}
        aria-labelledby={`tab-${contentValue}`}
        tabIndex={0}
        className={cn(
          "mt-2 ring-offset-background",
          "focus-visible:outline-none sage-ring focus-visible:ring-2 focus-visible:ring-offset-2",
          className
        )}
        {...props}
      />
    )
  }
)
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsContent, TabsList, TabsTrigger }
