"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, ChevronDown, ChevronUp, Search, X, AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const selectTriggerVariants = cva(
  "flex w-full items-center justify-between rounded-lg border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blueberry-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
  {
    variants: {
      variant: {
        default:
          "border-neutral-300 bg-background text-neutral-900 hover:border-neutral-400 focus-visible:border-blueberry-500 dark:border-neutral-600 dark:text-neutral-100 dark:hover:border-neutral-500",
        
        filled:
          "border-neutral-200 bg-neutral-50 text-neutral-900 hover:bg-neutral-100 hover:border-neutral-300 focus-visible:bg-white focus-visible:border-blueberry-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-750",
        
        outline:
          "border-2 border-neutral-300 bg-transparent text-neutral-900 hover:border-blueberry-300 focus-visible:border-blueberry-500 dark:border-neutral-600 dark:text-neutral-100 dark:hover:border-blueberry-500",
        
        ghost:
          "border-transparent bg-transparent text-neutral-900 hover:bg-neutral-50 focus-visible:bg-white focus-visible:border-blueberry-500 dark:text-neutral-100 dark:hover:bg-neutral-800",
        
        success:
          "border-success-300 bg-success-25 text-success-900 focus-visible:border-success-500 dark:border-success-600 dark:bg-success-950 dark:text-success-100",
        
        error:
          "border-error-300 bg-error-25 text-error-900 focus-visible:border-error-500 dark:border-error-600 dark:bg-error-950 dark:text-error-100",
        
        warning:
          "border-warning-300 bg-warning-25 text-warning-900 focus-visible:border-warning-500 dark:border-warning-600 dark:bg-warning-950 dark:text-warning-100",
      },
      
      size: {
        sm: "h-8 px-3 py-1 text-sm",
        default: "h-10 px-3 py-2 text-sm",
        lg: "h-12 px-4 py-3 text-base",
        xl: "h-14 px-5 py-4 text-lg",
      },
      
      rounded: {
        default: "rounded-lg",
        sm: "rounded-md",
        lg: "rounded-xl",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {
  label?: string
  description?: string
  error?: string
  success?: string
  leftIcon?: React.ReactNode
  clearable?: boolean
  onClear?: () => void
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ 
  className, 
  variant, 
  size, 
  rounded,
  label,
  description,
  error,
  success,
  leftIcon,
  clearable = false,
  onClear,
  children, 
  ...props 
}, ref) => {
  // Determine the actual variant based on state
  const actualVariant = error ? "error" : success ? "success" : variant
  
  // Calculate icon sizes based on select size
  const iconSizeMap = {
    sm: "h-3.5 w-3.5",
    default: "h-4 w-4", 
    lg: "h-5 w-5",
    xl: "h-6 w-6",
  }
  const iconSize = iconSizeMap[size || "default"]

  return (
    <div className="space-y-2">
      {label && (
        <label className="subtitle text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        <SelectPrimitive.Trigger
          ref={ref}
          className={cn(
            selectTriggerVariants({ variant: actualVariant, size, rounded }),
            leftIcon && (size === "sm" ? "pl-8" : size === "lg" ? "pl-12" : size === "xl" ? "pl-14" : "pl-10"),
            clearable && (size === "sm" ? "pr-12" : size === "lg" ? "pr-16" : size === "xl" ? "pr-18" : "pr-14"),
            className
          )}
          {...props}
        >
          {leftIcon && (
            <div className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400",
              iconSize
            )}>
              {leftIcon}
            </div>
          )}
          
          {children}
          
          <div className="flex items-center gap-1">
            {clearable && onClear && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onClear()
                }}
                className={cn(
                  "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors",
                  iconSize
                )}
              >
                <X />
              </button>
            )}
            
            <SelectPrimitive.Icon asChild>
              <ChevronDown className={cn("text-neutral-500 transition-transform duration-200", iconSize)} />
            </SelectPrimitive.Icon>
            
            {success && (
              <Check className={cn("text-success-500", iconSize)} />
            )}
            
            {error && (
              <AlertCircle className={cn("text-error-500", iconSize)} />
            )}
          </div>
        </SelectPrimitive.Trigger>
      </div>
      
      {description && !error && !success && (
        <p className="body-text text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      )}
      
      {success && (
        <p className="body-text text-success-600 dark:text-success-400 flex items-center gap-1">
          <Check className="h-3.5 w-3.5" />
          {success}
        </p>
      )}
      
      {error && (
        <p className="body-text text-error-600 dark:text-error-400 flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  )
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const selectContentVariants = cva(
  "relative z-50 overflow-hidden rounded-lg border bg-white text-neutral-900 shadow-xl transition-all duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:bg-neutral-800 dark:text-neutral-100",
  {
    variants: {
      variant: {
        default: "border-neutral-200 dark:border-neutral-700",
        feature: "border-blueberry-200 bg-gradient-to-br from-white to-blueberry-25 dark:border-blueberry-700 dark:from-neutral-800 dark:to-blueberry-950",
        minimal: "border-neutral-100 shadow-2xl dark:border-neutral-800",
      },
      
      size: {
        sm: "min-w-32 max-h-64",
        default: "min-w-40 max-h-80",
        lg: "min-w-48 max-h-96",
        xl: "min-w-56 max-h-[32rem]",
        auto: "min-w-[8rem] max-h-96",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "auto",
    },
  }
)

export interface SelectContentProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>,
    VariantProps<typeof selectContentVariants> {}

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(({ className, children, position = "popper", variant, size, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        selectContentVariants({ variant, size }),
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-2",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-3 py-2 overline text-blueberry-600 dark:text-blueberry-400", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    icon?: React.ReactNode
    description?: string
    badge?: React.ReactNode
  }
>(({ className, children, icon, description, badge, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:bg-blueberry-50 focus:text-blueberry-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-blueberry-950 dark:focus:text-blueberry-100",
      "hover:bg-neutral-50 dark:hover:bg-neutral-700",
      icon ? "pl-10" : "pl-8",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-3.5 w-3.5 text-blueberry-600 dark:text-blueberry-400" />
      </SelectPrimitive.ItemIndicator>
    </span>

    {icon && (
      <span className="absolute left-7 flex h-4 w-4 items-center justify-center text-neutral-500 dark:text-neutral-400">
        {icon}
      </span>
    )}

    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <SelectPrimitive.ItemText className="truncate font-medium">
          {children}
        </SelectPrimitive.ItemText>
        {badge && badge}
      </div>
      {description && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
          {description}
        </p>
      )}
    </div>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("mx-2 my-1 h-px bg-neutral-200 dark:bg-neutral-700", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

// Specialized Select Components
const SearchableSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps & {
    searchPlaceholder?: string
    onSearch?: (value: string) => void
  }
>(({ searchPlaceholder = "Search...", onSearch, leftIcon, ...props }, ref) => {
  const [searchValue, setSearchValue] = React.useState("")

  return (
    <>
      <SelectTrigger
        ref={ref}
        leftIcon={leftIcon || <Search className="h-4 w-4" />}
        {...props}
      />
      {/* This would typically be implemented with a custom content that includes search */}
    </>
  )
})
SearchableSelect.displayName = "SearchableSelect"

const MultiSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps & {
    selectedCount?: number
    maxDisplay?: number
  }
>(({ selectedCount = 0, maxDisplay = 3, children, ...props }, ref) => (
  <SelectTrigger ref={ref} {...props}>
    {selectedCount === 0 ? (
      children
    ) : selectedCount <= maxDisplay ? (
      `${selectedCount} selected`
    ) : (
      `${selectedCount} items selected`
    )}
  </SelectTrigger>
))
MultiSelect.displayName = "MultiSelect"

const StatusSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  Omit<SelectTriggerProps, 'variant'> & {
    status: 'default' | 'success' | 'warning' | 'error'
  }
>(({ status, ...props }, ref) => (
  <SelectTrigger
    ref={ref}
    variant={status === 'default' ? 'default' : status}
    {...props}
  />
))
StatusSelect.displayName = "StatusSelect"

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SearchableSelect,
  MultiSelect,
  StatusSelect,
  selectTriggerVariants,
  selectContentVariants,
}
