"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const tooltipVariants = cva(
  "z-50 overflow-hidden rounded-lg shadow-xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        default: "border border-neutral-200 bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100",
        
        inverse: "bg-neutral-900 text-white border-none dark:bg-white dark:text-neutral-900",
        
        primary: "border border-blueberry-200 bg-blueberry-50 text-blueberry-900 dark:border-blueberry-700 dark:bg-blueberry-950 dark:text-blueberry-100",
        
        success: "border border-success-200 bg-success-50 text-success-900 dark:border-success-700 dark:bg-success-950 dark:text-success-100",
        
        warning: "border border-warning-200 bg-warning-50 text-warning-900 dark:border-warning-700 dark:bg-warning-950 dark:text-warning-100",
        
        error: "border border-error-200 bg-error-50 text-error-900 dark:border-error-700 dark:bg-error-950 dark:text-error-100",
        
        glass: "border border-white/20 bg-white/10 backdrop-blur-xl text-white shadow-2xl",
      },
      
      size: {
        sm: "px-2 py-1 text-xs max-w-xs",
        default: "px-3 py-1.5 text-sm max-w-sm",
        lg: "px-4 py-2 text-base max-w-md",
        xl: "px-5 py-3 text-lg max-w-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipVariants> {
  sideOffset?: number
  icon?: React.ReactNode
  title?: string
  shortcut?: string
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ 
  className, 
  sideOffset = 8, 
  variant, 
  size,
  icon,
  title,
  shortcut,
  children,
  ...props 
}, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(tooltipVariants({ variant, size }), className)}
    {...props}
  >
    <div className="flex items-start gap-2">
      {icon && (
        <div className="flex-shrink-0 mt-0.5">
          {React.cloneElement(icon as React.ReactElement, {
            className: cn("h-4 w-4", (icon as React.ReactElement).props?.className)
          })}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        {title ? (
          <div className="space-y-1">
            <div className="font-semibold leading-tight">{title}</div>
            {children && (
              <div className="text-xs opacity-90 leading-relaxed">{children}</div>
            )}
          </div>
        ) : (
          <div className="leading-tight">{children}</div>
        )}
        
        {shortcut && (
          <div className="mt-2 pt-1 border-t border-current/20">
            <kbd className="px-1.5 py-0.5 text-xs font-mono bg-current/10 rounded border border-current/20">
              {shortcut}
            </kbd>
          </div>
        )}
      </div>
    </div>
  </TooltipPrimitive.Content>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

// Specialized Tooltip Components
const SimpleTooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> & {
    content: string
    variant?: VariantProps<typeof tooltipVariants>['variant']
    size?: VariantProps<typeof tooltipVariants>['size']
    side?: "top" | "bottom" | "left" | "right"
    delayDuration?: number
    children: React.ReactNode
  }
>(({ 
  content, 
  variant = "inverse", 
  size = "default",
  side = "top",
  delayDuration = 700,
  children, 
  ...props 
}, ref) => (
  <Tooltip delayDuration={delayDuration} {...props}>
    <TooltipTrigger asChild>
      {children}
    </TooltipTrigger>
    <TooltipContent variant={variant} size={size} side={side}>
      {content}
    </TooltipContent>
  </Tooltip>
))
SimpleTooltip.displayName = "SimpleTooltip"

const HelpTooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> & {
    title: string
    description?: string
    variant?: VariantProps<typeof tooltipVariants>['variant']
    children?: React.ReactNode
  }
>(({ 
  title, 
  description, 
  variant = "primary",
  children = (
    <button className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 hover:bg-neutral-300 hover:text-neutral-900 dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-600 dark:hover:text-neutral-100 transition-colors">
      <span className="text-xs font-medium">?</span>
    </button>
  ),
  ...props 
}, ref) => (
  <Tooltip delayDuration={300} {...props}>
    <TooltipTrigger asChild>
      {children}
    </TooltipTrigger>
    <TooltipContent variant={variant} size="lg" title={title}>
      {description}
    </TooltipContent>
  </Tooltip>
))
HelpTooltip.displayName = "HelpTooltip"

const ShortcutTooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> & {
    content: string
    shortcut: string
    variant?: VariantProps<typeof tooltipVariants>['variant']
    children: React.ReactNode
  }
>(({ 
  content, 
  shortcut,
  variant = "inverse",
  children, 
  ...props 
}, ref) => (
  <Tooltip delayDuration={700} {...props}>
    <TooltipTrigger asChild>
      {children}
    </TooltipTrigger>
    <TooltipContent variant={variant} shortcut={shortcut}>
      {content}
    </TooltipContent>
  </Tooltip>
))
ShortcutTooltip.displayName = "ShortcutTooltip"

const StatusTooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> & {
    status: "success" | "warning" | "error" | "info"
    title?: string
    description: string
    children: React.ReactNode
  }
>(({ 
  status, 
  title,
  description,
  children, 
  ...props 
}, ref) => {
  const statusConfig = {
    success: { variant: "success" as const, icon: "✓" },
    warning: { variant: "warning" as const, icon: "⚠" },
    error: { variant: "error" as const, icon: "✕" },
    info: { variant: "primary" as const, icon: "i" },
  }

  const config = statusConfig[status]

  return (
    <Tooltip delayDuration={300} {...props}>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent 
        variant={config.variant} 
        icon={<span className="font-bold">{config.icon}</span>}
        title={title}
      >
        {description}
      </TooltipContent>
    </Tooltip>
  )
})
StatusTooltip.displayName = "StatusTooltip"

const RichTooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> & {
    title: string
    description?: string
    icon?: React.ReactNode
    actions?: Array<{
      label: string
      shortcut?: string
      onClick?: () => void
    }>
    variant?: VariantProps<typeof tooltipVariants>['variant']
    children: React.ReactNode
  }
>(({ 
  title, 
  description,
  icon,
  actions = [],
  variant = "default",
  children, 
  ...props 
}, ref) => (
  <Tooltip delayDuration={500} {...props}>
    <TooltipTrigger asChild>
      {children}
    </TooltipTrigger>
    <TooltipContent variant={variant} size="lg" icon={icon} title={title}>
      {description && <div className="mb-2">{description}</div>}
      
      {actions.length > 0 && (
        <div className="space-y-1 pt-2 border-t border-current/20">
          {actions.map((action, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span>{action.label}</span>
              {action.shortcut && (
                <kbd className="px-1.5 py-0.5 font-mono bg-current/10 rounded border border-current/20">
                  {action.shortcut}
                </kbd>
              )}
            </div>
          ))}
        </div>
      )}
    </TooltipContent>
  </Tooltip>
))
RichTooltip.displayName = "RichTooltip"

const InteractiveTooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> & {
    content: React.ReactNode
    variant?: VariantProps<typeof tooltipVariants>['variant']
    size?: VariantProps<typeof tooltipVariants>['size']
    children: React.ReactNode
  }
>(({ 
  content,
  variant = "default",
  size = "lg",
  children, 
  ...props 
}, ref) => (
  <Tooltip delayDuration={300} {...props}>
    <TooltipTrigger asChild>
      {children}
    </TooltipTrigger>
    <TooltipContent 
      variant={variant} 
      size={size}
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      {content}
    </TooltipContent>
  </Tooltip>
))
InteractiveTooltip.displayName = "InteractiveTooltip"

export { 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent, 
  TooltipProvider,
  SimpleTooltip,
  HelpTooltip,
  ShortcutTooltip,
  StatusTooltip,
  RichTooltip,
  InteractiveTooltip,
  tooltipVariants,
}
