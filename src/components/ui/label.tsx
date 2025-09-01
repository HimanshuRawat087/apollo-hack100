"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { Info, AlertCircle, CheckCircle, AlertTriangle, Asterisk } from "lucide-react"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "text-neutral-700 dark:text-neutral-300",
        muted: "text-neutral-600 dark:text-neutral-400",
        primary: "text-blueberry-700 dark:text-blueberry-300",
        success: "text-success-700 dark:text-success-300",
        warning: "text-warning-700 dark:text-warning-300",
        error: "text-error-700 dark:text-error-300",
      },
      
      size: {
        xs: "text-xs font-medium",
        sm: "text-sm font-medium", 
        default: "subtitle",
        lg: "text-base font-semibold",
        xl: "text-lg font-semibold",
      },
      
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      weight: "medium",
    },
  }
)

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  required?: boolean
  optional?: boolean
  tooltip?: string
  description?: string
  icon?: React.ReactNode
  badge?: React.ReactNode
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ 
  className, 
  variant, 
  size, 
  weight,
  required = false,
  optional = false,
  tooltip,
  description,
  icon,
  badge,
  children,
  ...props 
}, ref) => (
  <div className="space-y-1">
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        labelVariants({ variant, size, weight }),
        "flex items-center gap-2",
        className
      )}
      {...props}
    >
      {icon && (
        <span className="text-current">
          {icon}
        </span>
      )}
      
      <span className="flex items-center gap-1">
        {children}
        
        {required && (
          <Asterisk className="h-3 w-3 text-error-500" />
        )}
        
        {optional && (
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">
            (optional)
          </span>
        )}
        
        {badge && badge}
      </span>
      
      {tooltip && (
        <div className="group relative">
          <Info className="h-3.5 w-3.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 cursor-help transition-colors" />
          <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-neutral-900 rounded whitespace-nowrap z-10 dark:bg-neutral-100 dark:text-neutral-900">
            {tooltip}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-2 border-transparent border-t-neutral-900 dark:border-t-neutral-100" />
          </div>
        </div>
      )}
    </LabelPrimitive.Root>
    
    {description && (
      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
        {description}
      </p>
    )}
  </div>
))
Label.displayName = LabelPrimitive.Root.displayName

// Specialized Label Components
const FieldLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps & {
    error?: string
    success?: string
  }
>(({ error, success, variant, ...props }, ref) => {
  const statusVariant = error ? "error" : success ? "success" : variant

  return (
    <div className="space-y-1">
      <Label
        ref={ref}
        variant={statusVariant}
        {...props}
      />
      
      {error && (
        <div className="flex items-center gap-1 text-xs text-error-600 dark:text-error-400">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}
      
      {success && !error && (
        <div className="flex items-center gap-1 text-xs text-success-600 dark:text-success-400">
          <CheckCircle className="h-3 w-3" />
          {success}
        </div>
      )}
    </div>
  )
})
FieldLabel.displayName = "FieldLabel"

const SectionLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ size = "lg", weight = "semibold", ...props }, ref) => (
  <Label
    ref={ref}
    size={size}
    weight={weight}
    {...props}
  />
))
SectionLabel.displayName = "SectionLabel"

const StatusLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  Omit<LabelProps, 'variant'> & {
    status: 'info' | 'success' | 'warning' | 'error'
  }
>(({ status, icon, ...props }, ref) => {
  const statusConfig = {
    info: {
      variant: 'primary' as const,
      icon: <Info className="h-3.5 w-3.5" />,
    },
    success: {
      variant: 'success' as const,
      icon: <CheckCircle className="h-3.5 w-3.5" />,
    },
    warning: {
      variant: 'warning' as const,
      icon: <AlertTriangle className="h-3.5 w-3.5" />,
    },
    error: {
      variant: 'error' as const,
      icon: <AlertCircle className="h-3.5 w-3.5" />,
    },
  }

  const config = statusConfig[status]

  return (
    <Label
      ref={ref}
      variant={config.variant}
      icon={icon || config.icon}
      {...props}
    />
  )
})
StatusLabel.displayName = "StatusLabel"

const InlineLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps & {
    value?: React.ReactNode
    separator?: string
  }
>(({ value, separator = ":", children, className, ...props }, ref) => (
  <Label
    ref={ref}
    className={cn("flex items-center gap-2", className)}
    {...props}
  >
    <span>{children}{separator}</span>
    {value && (
      <span className="font-normal text-neutral-600 dark:text-neutral-400">
        {value}
      </span>
    )}
  </Label>
))
InlineLabel.displayName = "InlineLabel"

export { 
  Label, 
  FieldLabel, 
  SectionLabel, 
  StatusLabel, 
  InlineLabel,
  labelVariants 
}
