"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const tabsListVariants = cva(
  "inline-flex items-center justify-center transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "rounded-lg bg-neutral-100 dark:bg-neutral-800 p-1 text-neutral-600 dark:text-neutral-400",
        underline: "border-b border-neutral-200 dark:border-neutral-700 bg-transparent text-neutral-600 dark:text-neutral-400",
        pills: "gap-2 bg-transparent text-neutral-600 dark:text-neutral-400",
        cards: "gap-1 bg-transparent text-neutral-600 dark:text-neutral-400",
        minimal: "gap-4 bg-transparent text-neutral-600 dark:text-neutral-400",
      },
      
      size: {
        sm: "h-8 text-xs",
        default: "h-10 text-sm",
        lg: "h-12 text-base",
      },
      
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
)

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, size, fullWidth, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant, size, fullWidth }), className)}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueberry-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative",
  {
    variants: {
      variant: {
        default: 
          "rounded-md px-3 py-1.5 hover:bg-neutral-50 hover:text-neutral-900 dark:hover:bg-neutral-700 dark:hover:text-neutral-100 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-900 dark:data-[state=active]:text-neutral-100",
        
        underline:
          "rounded-none px-4 py-3 border-b-2 border-transparent hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-300 dark:hover:border-neutral-600 data-[state=active]:text-blueberry-600 dark:data-[state=active]:text-blueberry-400 data-[state=active]:border-blueberry-600 dark:data-[state=active]:border-blueberry-400",
        
        pills:
          "rounded-full px-4 py-2 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 data-[state=active]:bg-blueberry-600 data-[state=active]:text-white dark:data-[state=active]:bg-blueberry-500",
        
        cards:
          "rounded-lg px-4 py-3 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:border-blueberry-300 data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-900 dark:data-[state=active]:text-neutral-100 dark:data-[state=active]:border-blueberry-600",
        
        minimal:
          "rounded-md px-3 py-2 hover:text-blueberry-600 dark:hover:text-blueberry-400 data-[state=active]:text-blueberry-600 dark:data-[state=active]:text-blueberry-400 data-[state=active]:bg-blueberry-50 dark:data-[state=active]:bg-blueberry-950",
      },
      
      size: {
        sm: "text-xs px-2 py-1",
        default: "text-sm px-3 py-1.5",
        lg: "text-base px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
    compoundVariants: [
      {
        variant: "underline",
        size: "sm",
        class: "px-3 py-2",
      },
      {
        variant: "underline", 
        size: "lg",
        class: "px-5 py-4",
      },
      {
        variant: "pills",
        size: "sm",
        class: "px-3 py-1.5",
      },
      {
        variant: "pills",
        size: "lg", 
        class: "px-5 py-2.5",
      },
      {
        variant: "cards",
        size: "sm",
        class: "px-3 py-2",
      },
      {
        variant: "cards",
        size: "lg",
        class: "px-5 py-4",
      },
    ],
  }
)

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {
  icon?: React.ReactNode
  badge?: React.ReactNode
  count?: number
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, size, icon, badge, count, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      tabsTriggerVariants({ variant, size }),
      "group flex-1 data-[state=active]:flex-1",
      className
    )}
    {...props}
  >
    <div className="flex items-center gap-2">
      {icon && (
        <span className="text-current [&>svg]:size-4">
          {icon}
        </span>
      )}
      
      <span className="truncate">{children}</span>
      
      {count !== undefined && (
        <span className="ml-1 rounded-full bg-neutral-200 dark:bg-neutral-700 px-1.5 py-0.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 group-data-[state=active]:bg-blueberry-200 group-data-[state=active]:text-blueberry-800 dark:group-data-[state=active]:bg-blueberry-800 dark:group-data-[state=active]:text-blueberry-200">
          {count}
        </span>
      )}
      
      {badge && badge}
    </div>
  </TabsPrimitive.Trigger>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const tabsContentVariants = cva(
  "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueberry-500 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "mt-4",
        flush: "mt-0",
        padded: "mt-6 p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700",
        card: "mt-4 p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TabsContentProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>,
    VariantProps<typeof tabsContentVariants> {}

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(tabsContentVariants({ variant }), className)}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

// Specialized Tab Components
const VerticalTabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
    listClassName?: string
    contentClassName?: string
  }
>(({ className, listClassName, contentClassName, children, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    orientation="vertical"
    className={cn("flex gap-6", className)}
    {...props}
  >
    <div className="flex flex-col">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TabsList) {
          return React.cloneElement(child, {
            className: cn("flex-col h-auto w-48 bg-neutral-50 dark:bg-neutral-800", listClassName, child.props.className),
          })
        }
        return null
      })}
    </div>
    
    <div className="flex-1">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TabsContent) {
          return React.cloneElement(child, {
            className: cn("mt-0", contentClassName, child.props.className),
          })
        }
        return null
      })}
    </div>
  </TabsPrimitive.Root>
))
VerticalTabs.displayName = "VerticalTabs"

const ScrollableTabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps & {
    showScrollButtons?: boolean
  }
>(({ className, showScrollButtons = true, children, ...props }, ref) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  const checkScroll = React.useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }, [])

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  React.useEffect(() => {
    checkScroll()
    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', checkScroll)
      window.addEventListener('resize', checkScroll)
    }
    
    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener('scroll', checkScroll)
      }
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  return (
    <div className="relative flex items-center">
      {showScrollButtons && canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 z-10 p-1 rounded-full bg-white dark:bg-neutral-900 shadow-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <TabsList
          ref={ref}
          className={cn("flex-nowrap", className)}
          {...props}
        >
          {children}
        </TabsList>
      </div>
      
      {showScrollButtons && canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 z-10 p-1 rounded-full bg-white dark:bg-neutral-900 shadow-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  )
})
ScrollableTabs.displayName = "ScrollableTabs"

const TabsWithActions = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
    actions?: React.ReactNode
    headerClassName?: string
  }
>(({ className, actions, headerClassName, children, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    className={className}
    {...props}
  >
    <div className={cn("flex items-center justify-between", headerClassName)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TabsList) {
          return child
        }
        return null
      })}
      
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
    
    {React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === TabsContent) {
        return child
      }
      return null
    })}
  </TabsPrimitive.Root>
))
TabsWithActions.displayName = "TabsWithActions"

export { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent,
  VerticalTabs,
  ScrollableTabs,
  TabsWithActions,
  tabsListVariants,
  tabsTriggerVariants,
  tabsContentVariants,
}
