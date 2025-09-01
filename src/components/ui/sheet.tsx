"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X, Menu, Settings, User, Filter, Search } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const overlayVariants = cva(
  "fixed inset-0 z-50 transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  {
    variants: {
      variant: {
        default: "bg-black/60 backdrop-blur-sm",
        dark: "bg-black/80 backdrop-blur-md", 
        light: "bg-white/40 backdrop-blur-lg",
        glass: "bg-gradient-to-br from-black/20 to-black/40 backdrop-blur-xl",
        minimal: "bg-black/20 backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay> &
    VariantProps<typeof overlayVariants>
>(({ className, variant, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(overlayVariants({ variant }), className)}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 bg-background shadow-2xl transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out ease-in-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b border-neutral-200 dark:border-neutral-700 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top rounded-b-xl",
        bottom: "inset-x-0 bottom-0 border-t border-neutral-200 dark:border-neutral-700 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom rounded-t-xl",
        left: "inset-y-0 left-0 h-full border-r border-neutral-200 dark:border-neutral-700 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left rounded-r-xl",
        right: "inset-y-0 right-0 h-full border-l border-neutral-200 dark:border-neutral-700 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right rounded-l-xl",
      },
      
      size: {
        sm: "",
        default: "",
        lg: "",
        xl: "",
        full: "",
      },
      
      variant: {
        default: "bg-white dark:bg-neutral-900",
        feature: "bg-gradient-to-br from-white to-blueberry-25 dark:from-neutral-900 dark:to-blueberry-950",
        glass: "bg-white/90 backdrop-blur-xl dark:bg-neutral-900/90",
        minimal: "bg-white/95 backdrop-blur-md border-none shadow-xl dark:bg-neutral-900/95",
      },
    },
    defaultVariants: {
      side: "right",
      size: "default",
      variant: "default",
    },
    compoundVariants: [
      // Top/Bottom sizing
      {
        side: ["top", "bottom"],
        size: "sm",
        class: "h-1/3",
      },
      {
        side: ["top", "bottom"],
        size: "default",
        class: "h-1/2",
      },
      {
        side: ["top", "bottom"],
        size: "lg",
        class: "h-2/3",
      },
      {
        side: ["top", "bottom"],
        size: "xl",
        class: "h-5/6",
      },
      {
        side: ["top", "bottom"],
        size: "full",
        class: "h-full rounded-none",
      },
      // Left/Right sizing
      {
        side: ["left", "right"],
        size: "sm",
        class: "w-80 max-w-[90vw]",
      },
      {
        side: ["left", "right"],
        size: "default",
        class: "w-96 max-w-[90vw]",
      },
      {
        side: ["left", "right"],
        size: "lg",
        class: "w-[32rem] max-w-[90vw]",
      },
      {
        side: ["left", "right"],
        size: "xl",
        class: "w-[40rem] max-w-[90vw]",
      },
      {
        side: ["left", "right"],
        size: "full",
        class: "w-full rounded-none",
      },
    ],
  }
)

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  overlayVariant?: VariantProps<typeof overlayVariants>['variant']
  hideClose?: boolean
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ 
  side = "right", 
  size,
  variant,
  overlayVariant,
  hideClose = false,
  className, 
  children, 
  ...props 
}, ref) => (
  <SheetPortal>
    <SheetOverlay variant={overlayVariant} />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side, size, variant }), className)}
      {...props}
    >
      <div className="flex flex-col h-full p-6">
        {children}
      </div>
      {!hideClose && (
        <SheetPrimitive.Close className="absolute right-4 top-4 rounded-lg p-2 text-neutral-500 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blueberry-500 focus:ring-offset-2 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      )}
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    icon?: React.ReactNode
    centered?: boolean
  }
>(({ className, icon, centered = false, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-3 pb-4 border-b border-neutral-200 dark:border-neutral-700",
      centered ? "text-center items-center" : "text-left",
      className
    )}
    {...props}
  >
    {icon && (
      <div className={cn(
        "w-12 h-12 rounded-lg bg-blueberry-100 dark:bg-blueberry-900 flex items-center justify-center text-blueberry-600 dark:text-blueberry-400",
        centered ? "mx-auto" : ""
      )}>
        {icon}
      </div>
    )}
    {children}
  </div>
))
SheetHeader.displayName = "SheetHeader"

const SheetBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 py-4 space-y-4 overflow-y-auto", className)}
    {...props}
  />
))
SheetBody.displayName = "SheetBody"

const SheetFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    justify?: "start" | "center" | "end" | "between"
    direction?: "row" | "column"
  }
>(({ className, justify = "end", direction = "row", ...props }, ref) => {
  const justifyClasses = {
    start: "justify-start",
    center: "justify-center", 
    end: "justify-end",
    between: "justify-between",
  }

  const directionClasses = {
    row: "flex-row space-x-3",
    column: "flex-col space-y-3",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex pt-4 border-t border-neutral-200 dark:border-neutral-700",
        directionClasses[direction],
        justifyClasses[justify],
        className
      )}
      {...props}
    />
  )
})
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title> & {
    size?: "sm" | "default" | "lg"
    gradient?: boolean
  }
>(({ className, size = "default", gradient = false, ...props }, ref) => {
  const sizeClasses = {
    sm: "text-lg font-semibold",
    default: "heading-3",
    lg: "heading-2",
  }

  return (
    <SheetPrimitive.Title
      ref={ref}
      className={cn(
        sizeClasses[size],
        "leading-tight tracking-tight",
        gradient && "bg-gradient-to-r from-blueberry-600 to-blueberry-700 bg-clip-text text-transparent dark:from-blueberry-400 dark:to-blueberry-500",
        className
      )}
      {...props}
    />
  )
})
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("body-text text-neutral-600 dark:text-neutral-400 leading-relaxed", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

// Specialized Sheet Components
const NavigationSheet = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  Omit<SheetContentProps, 'side' | 'variant'>
>(({ size = "sm", ...props }, ref) => (
  <SheetContent
    ref={ref}
    side="left"
    size={size}
    variant="default"
    {...props}
  />
))
NavigationSheet.displayName = "NavigationSheet"

const FilterSheet = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  Omit<SheetContentProps, 'side' | 'variant'> & {
    title?: string
    onApply?: () => void
    onReset?: () => void
  }
>(({ size = "sm", title = "Filters", onApply, onReset, children, ...props }, ref) => (
  <SheetContent
    ref={ref}
    side="right"
    size={size}
    variant="feature"
    {...props}
  >
    <SheetHeader icon={<Filter className="h-6 w-6" />}>
      <SheetTitle gradient>{title}</SheetTitle>
    </SheetHeader>
    
    <SheetBody>
      {children}
    </SheetBody>
    
    <SheetFooter justify="between">
      <button 
        className="btn-secondary"
        onClick={onReset}
      >
        Reset
      </button>
      <SheetClose asChild>
        <button 
          className="btn-primary"
          onClick={onApply}
        >
          Apply Filters
        </button>
      </SheetClose>
    </SheetFooter>
  </SheetContent>
))
FilterSheet.displayName = "FilterSheet"

const SearchSheet = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  Omit<SheetContentProps, 'side' | 'size' | 'variant'>
>(({ ...props }, ref) => (
  <SheetContent
    ref={ref}
    side="top"
    size="sm"
    variant="minimal"
    {...props}
  />
))
SearchSheet.displayName = "SearchSheet"

const SettingsSheet = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  Omit<SheetContentProps, 'variant'> & {
    title?: string
  }
>(({ title = "Settings", size = "default", children, ...props }, ref) => (
  <SheetContent
    ref={ref}
    size={size}
    variant="feature"
    {...props}
  >
    <SheetHeader icon={<Settings className="h-6 w-6" />}>
      <SheetTitle size="lg" gradient>{title}</SheetTitle>
      <SheetDescription>
        Manage your preferences and account settings
      </SheetDescription>
    </SheetHeader>
    
    <SheetBody>
      {children}
    </SheetBody>
  </SheetContent>
))
SettingsSheet.displayName = "SettingsSheet"

const ProfileSheet = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  Omit<SheetContentProps, 'variant'> & {
    user?: {
      name: string
      email: string
      avatar?: string
    }
  }
>(({ user, size = "sm", children, ...props }, ref) => (
  <SheetContent
    ref={ref}
    size={size}
    variant="default"
    {...props}
  >
    <SheetHeader icon={<User className="h-6 w-6" />} centered>
      <SheetTitle size="lg">Profile</SheetTitle>
      {user && (
        <div className="space-y-1">
          <p className="subtitle text-neutral-900 dark:text-neutral-100">{user.name}</p>
          <p className="body-text text-neutral-600 dark:text-neutral-400">{user.email}</p>
        </div>
      )}
    </SheetHeader>
    
    <SheetBody>
      {children}
    </SheetBody>
  </SheetContent>
))
ProfileSheet.displayName = "ProfileSheet"

const ActionSheet = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  Omit<SheetContentProps, 'side' | 'size' | 'variant'> & {
    title?: string
    actions?: Array<{
      icon?: React.ReactNode
      label: string
      description?: string
      onClick: () => void
      variant?: 'default' | 'destructive'
    }>
  }
>(({ title, actions = [], children, ...props }, ref) => (
  <SheetContent
    ref={ref}
    side="bottom"
    size="sm"
    variant="default"
    {...props}
  >
    {title && (
      <SheetHeader>
        <SheetTitle>{title}</SheetTitle>
      </SheetHeader>
    )}
    
    <SheetBody>
      {children}
      {actions.length > 0 && (
        <div className="space-y-2">
          {actions.map((action, index) => (
            <SheetClose key={index} asChild>
              <button
                onClick={action.onClick}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors",
                  "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                  action.variant === 'destructive' && "text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-950"
                )}
              >
                {action.icon && (
                  <div className="text-current">
                    {action.icon}
                  </div>
                )}
                <div className="flex-1">
                  <p className="subtitle">{action.label}</p>
                  {action.description && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {action.description}
                    </p>
                  )}
                </div>
              </button>
            </SheetClose>
          ))}
        </div>
      )}
    </SheetBody>
  </SheetContent>
))
ActionSheet.displayName = "ActionSheet"

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  NavigationSheet,
  FilterSheet,
  SearchSheet,
  SettingsSheet,
  ProfileSheet,
  ActionSheet,
  sheetVariants,
  overlayVariants,
}
