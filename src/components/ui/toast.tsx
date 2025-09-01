"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start space-x-4 overflow-hidden rounded-lg border p-4 shadow-xl transition-all duration-300 data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border-neutral-200 bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100",
        
        success: "border-success-200 bg-gradient-to-r from-white to-success-25 text-success-900 dark:border-success-700 dark:from-neutral-900 dark:to-success-950 dark:text-success-100",
        
        error: "border-error-200 bg-gradient-to-r from-white to-error-25 text-error-900 dark:border-error-700 dark:from-neutral-900 dark:to-error-950 dark:text-error-100",
        
        warning: "border-warning-200 bg-gradient-to-r from-white to-warning-25 text-warning-900 dark:border-warning-700 dark:from-neutral-900 dark:to-warning-950 dark:text-warning-100",
        
        info: "border-blueberry-200 bg-gradient-to-r from-white to-blueberry-25 text-blueberry-900 dark:border-blueberry-700 dark:from-neutral-900 dark:to-blueberry-950 dark:text-blueberry-100",
        
        destructive: "border-error-200 bg-gradient-to-r from-white to-error-25 text-error-900 dark:border-error-700 dark:from-neutral-900 dark:to-error-950 dark:text-error-100",
      },
      
      size: {
        default: "p-4",
        sm: "p-3",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>,
    VariantProps<typeof toastVariants> {
  icon?: React.ReactNode
  showIcon?: boolean
}

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ className, variant, size, icon, showIcon = true, children, ...props }, ref) => {
  const variantIcons = {
    default: <Info className="h-5 w-5 text-blueberry-600 dark:text-blueberry-400" />,
    success: <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-400" />,
    error: <AlertCircle className="h-5 w-5 text-error-600 dark:text-error-400" />,
    warning: <AlertTriangle className="h-5 w-5 text-warning-600 dark:text-warning-400" />,
    info: <Info className="h-5 w-5 text-blueberry-600 dark:text-blueberry-400" />,
    destructive: <AlertCircle className="h-5 w-5 text-error-600 dark:text-error-400" />,
  }

  const displayIcon = icon || (showIcon && variant ? variantIcons[variant] : null)

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant, size }), className)}
      {...props}
    >
      {displayIcon && (
        <div className="flex-shrink-0 mt-0.5">
          {displayIcon}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        {children}
      </div>
      
      <ToastClose />
    </ToastPrimitives.Root>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action> & {
    variant?: "default" | "outline" | "ghost"
  }
>(({ className, variant = "outline", ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blueberry-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      {
        default: "bg-blueberry-600 text-white hover:bg-blueberry-700 dark:bg-blueberry-500 dark:hover:bg-blueberry-400",
        outline: "border border-current bg-transparent hover:bg-current/10",
        ghost: "bg-transparent hover:bg-current/10",
      }[variant],
      // Variant-specific styling for different toast types
      "group-[.success]:text-success-600 dark:group-[.success]:text-success-400",
      "group-[.error]:text-error-600 dark:group-[.error]:text-error-400",
      "group-[.warning]:text-warning-600 dark:group-[.warning]:text-warning-400",
      "group-[.info]:text-blueberry-600 dark:group-[.info]:text-blueberry-400",
      "group-[.destructive]:text-error-600 dark:group-[.destructive]:text-error-400",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-3 top-3 rounded-lg p-1 text-neutral-500 opacity-0 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-900 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blueberry-500 group-hover:opacity-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
      // Variant-specific hover colors
      "group-[.success]:hover:bg-success-100 dark:group-[.success]:hover:bg-success-900",
      "group-[.error]:hover:bg-error-100 dark:group-[.error]:hover:bg-error-900",
      "group-[.warning]:hover:bg-warning-100 dark:group-[.warning]:hover:bg-warning-900",
      "group-[.info]:hover:bg-blueberry-100 dark:group-[.info]:hover:bg-blueberry-900",
      "group-[.destructive]:hover:bg-error-100 dark:group-[.destructive]:hover:bg-error-900",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("subtitle leading-tight", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("body-text text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

// Specialized Toast Components
const SuccessToast = React.forwardRef<
  React.ElementRef<typeof Toast>,
  Omit<ToastProps, 'variant'> & {
    title: string
    description?: string
    action?: React.ComponentProps<typeof ToastAction>
  }
>(({ title, description, action, ...props }, ref) => (
  <Toast ref={ref} variant="success" {...props}>
    <div className="space-y-1">
      <ToastTitle>{title}</ToastTitle>
      {description && <ToastDescription>{description}</ToastDescription>}
    </div>
    {action && <ToastAction {...action} />}
  </Toast>
))
SuccessToast.displayName = "SuccessToast"

const ErrorToast = React.forwardRef<
  React.ElementRef<typeof Toast>,
  Omit<ToastProps, 'variant'> & {
    title: string
    description?: string
    action?: React.ComponentProps<typeof ToastAction>
  }
>(({ title, description, action, ...props }, ref) => (
  <Toast ref={ref} variant="error" {...props}>
    <div className="space-y-1">
      <ToastTitle>{title}</ToastTitle>
      {description && <ToastDescription>{description}</ToastDescription>}
    </div>
    {action && <ToastAction {...action} />}
  </Toast>
))
ErrorToast.displayName = "ErrorToast"

const WarningToast = React.forwardRef<
  React.ElementRef<typeof Toast>,
  Omit<ToastProps, 'variant'> & {
    title: string
    description?: string
    action?: React.ComponentProps<typeof ToastAction>
  }
>(({ title, description, action, ...props }, ref) => (
  <Toast ref={ref} variant="warning" {...props}>
    <div className="space-y-1">
      <ToastTitle>{title}</ToastTitle>
      {description && <ToastDescription>{description}</ToastDescription>}
    </div>
    {action && <ToastAction {...action} />}
  </Toast>
))
WarningToast.displayName = "WarningToast"

const InfoToast = React.forwardRef<
  React.ElementRef<typeof Toast>,
  Omit<ToastProps, 'variant'> & {
    title: string
    description?: string
    action?: React.ComponentProps<typeof ToastAction>
  }
>(({ title, description, action, ...props }, ref) => (
  <Toast ref={ref} variant="info" {...props}>
    <div className="space-y-1">
      <ToastTitle>{title}</ToastTitle>
      {description && <ToastDescription>{description}</ToastDescription>}
    </div>
    {action && <ToastAction {...action} />}
  </Toast>
))
InfoToast.displayName = "InfoToast"

const LoadingToast = React.forwardRef<
  React.ElementRef<typeof Toast>,
  Omit<ToastProps, 'variant' | 'icon'> & {
    title: string
    description?: string
  }
>(({ title, description, ...props }, ref) => (
  <Toast 
    ref={ref} 
    variant="default" 
    icon={
      <div className="w-5 h-5 border-2 border-blueberry-600 border-t-transparent rounded-full animate-spin" />
    }
    {...props}
  >
    <div className="space-y-1">
      <ToastTitle>{title}</ToastTitle>
      {description && <ToastDescription>{description}</ToastDescription>}
    </div>
  </Toast>
))
LoadingToast.displayName = "LoadingToast"

const ProgressToast = React.forwardRef<
  React.ElementRef<typeof Toast>,
  Omit<ToastProps, 'variant'> & {
    title: string
    description?: string
    progress: number
    showPercentage?: boolean
  }
>(({ title, description, progress, showPercentage = true, ...props }, ref) => (
  <Toast ref={ref} variant="info" showIcon={false} {...props}>
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <ToastTitle>{title}</ToastTitle>
        {showPercentage && (
          <span className="text-sm font-medium text-blueberry-600 dark:text-blueberry-400">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      
      {description && <ToastDescription>{description}</ToastDescription>}
      
      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
        <div 
          className="bg-blueberry-600 dark:bg-blueberry-400 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  </Toast>
))
ProgressToast.displayName = "ProgressToast"

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  SuccessToast,
  ErrorToast,
  WarningToast,
  InfoToast,
  LoadingToast,
  ProgressToast,
  toastVariants,
}
