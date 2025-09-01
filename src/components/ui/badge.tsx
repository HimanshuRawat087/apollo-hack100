import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blueberry-500 focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        // Primary Blueberry
        default:
          "border-transparent bg-blueberry-500 text-white shadow-sm hover:bg-blueberry-600 hover:shadow-md active:bg-blueberry-700",
        
        // Secondary Neutral
        secondary:
          "border-transparent bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600",
        
        // Success
        success:
          "border-transparent bg-success-500 text-white shadow-sm hover:bg-success-600 hover:shadow-md active:bg-success-700",
        
        // Error/Destructive
        destructive:
          "border-transparent bg-error-500 text-white shadow-sm hover:bg-error-600 hover:shadow-md active:bg-error-700",
        
        // Warning
        warning:
          "border-transparent bg-warning-500 text-white shadow-sm hover:bg-warning-600 hover:shadow-md active:bg-warning-700",
        
        // Outline variants
        outline:
          "border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800",
        
        "outline-primary":
          "border-blueberry-300 bg-transparent text-blueberry-700 hover:bg-blueberry-50 hover:border-blueberry-400 dark:border-blueberry-600 dark:text-blueberry-300 dark:hover:bg-blueberry-950",
        
        "outline-success":
          "border-success-300 bg-transparent text-success-700 hover:bg-success-50 hover:border-success-400 dark:border-success-600 dark:text-success-300 dark:hover:bg-success-950",
        
        "outline-error":
          "border-error-300 bg-transparent text-error-700 hover:bg-error-50 hover:border-error-400 dark:border-error-600 dark:text-error-300 dark:hover:bg-error-950",
        
        "outline-warning":
          "border-warning-300 bg-transparent text-warning-700 hover:bg-warning-50 hover:border-warning-400 dark:border-warning-600 dark:text-warning-300 dark:hover:bg-warning-950",
        
        // Soft variants (light backgrounds)
        "soft-primary":
          "border-transparent bg-blueberry-50 text-blueberry-700 hover:bg-blueberry-100 dark:bg-blueberry-950 dark:text-blueberry-300 dark:hover:bg-blueberry-900",
        
        "soft-success":
          "border-transparent bg-success-50 text-success-700 hover:bg-success-100 dark:bg-success-950 dark:text-success-300 dark:hover:bg-success-900",
        
        "soft-error":
          "border-transparent bg-error-50 text-error-700 hover:bg-error-100 dark:bg-error-950 dark:text-error-300 dark:hover:bg-error-900",
        
        "soft-warning":
          "border-transparent bg-warning-50 text-warning-700 hover:bg-warning-100 dark:bg-warning-950 dark:text-warning-300 dark:hover:bg-warning-900",
        
        // Special variants
        gradient:
          "border-transparent bg-gradient-to-r from-blueberry-500 to-blueberry-600 text-white shadow-sm hover:from-blueberry-600 hover:to-blueberry-700 hover:shadow-md",
        
        ghost:
          "border-transparent bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200",
      },
      
      size: {
        sm: "px-2 py-0.5 text-xs font-medium",
        default: "px-3 py-1 text-sm font-semibold",
        lg: "px-4 py-1.5 text-sm font-semibold",
        xl: "px-5 py-2 text-base font-semibold",
      },
      
      rounded: {
        default: "rounded-full",
        sm: "rounded-md",
        lg: "rounded-xl",
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

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

function Badge({ 
  className, 
  variant, 
  size, 
  rounded, 
  asChild = false, 
  ...props 
}: BadgeProps) {
  return (
    <div 
      className={cn(badgeVariants({ variant, size, rounded }), className)} 
      {...props} 
    />
  )
}

// Preset badge components for common use cases
const StatusBadge = React.forwardRef<
  HTMLDivElement,
  Omit<BadgeProps, 'variant'> & { 
    status: 'active' | 'inactive' | 'pending' | 'success' | 'error' | 'warning' 
  }
>(({ status, ...props }, ref) => {
  const statusVariants = {
    active: 'success',
    inactive: 'secondary',
    pending: 'warning',
    success: 'success',
    error: 'destructive',
    warning: 'warning',
  } as const

  return (
    <Badge
      ref={ref}
      variant={statusVariants[status]}
      {...props}
    />
  )
})
StatusBadge.displayName = "StatusBadge"

const PriorityBadge = React.forwardRef<
  HTMLDivElement,
  Omit<BadgeProps, 'variant'> & { 
    priority: 'low' | 'medium' | 'high' | 'urgent' 
  }
>(({ priority, ...props }, ref) => {
  const priorityVariants = {
    low: 'soft-success',
    medium: 'soft-warning',
    high: 'warning',
    urgent: 'destructive',
  } as const

  return (
    <Badge
      ref={ref}
      variant={priorityVariants[priority]}
      {...props}
    />
  )
})
PriorityBadge.displayName = "PriorityBadge"

export { Badge, badgeVariants, StatusBadge, PriorityBadge }
