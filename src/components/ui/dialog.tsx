"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const dialogOverlayVariants = cva(
  "fixed inset-0 z-50 transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  {
    variants: {
      variant: {
        default: "bg-black/60 backdrop-blur-sm",
        dark: "bg-black/80 backdrop-blur-md",
        light: "bg-white/40 backdrop-blur-lg",
        glass: "bg-gradient-to-br from-black/20 to-black/40 backdrop-blur-xl",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> &
    VariantProps<typeof dialogOverlayVariants>
>(({ className, variant, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(dialogOverlayVariants({ variant }), className)}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const dialogContentVariants = cva(
  "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-6 border bg-background shadow-2xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
  {
    variants: {
      variant: {
        default:
          "border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800",
        
        feature:
          "border-blueberry-200 bg-gradient-to-br from-white to-blueberry-25 dark:border-blueberry-700 dark:from-neutral-800 dark:to-blueberry-950",
        
        success:
          "border-success-200 bg-gradient-to-br from-white to-success-25 dark:border-success-700 dark:from-neutral-800 dark:to-success-950",
        
        warning:
          "border-warning-200 bg-gradient-to-br from-white to-warning-25 dark:border-warning-700 dark:from-neutral-800 dark:to-warning-950",
        
        error:
          "border-error-200 bg-gradient-to-br from-white to-error-25 dark:border-error-700 dark:from-neutral-800 dark:to-error-950",
        
        glass:
          "border-white/20 bg-white/10 backdrop-blur-xl text-white shadow-2xl",
      },
      
      size: {
        sm: "max-w-md p-4",
        default: "max-w-lg p-6",
        lg: "max-w-2xl p-8",
        xl: "max-w-4xl p-10",
        full: "max-w-[95vw] max-h-[95vh] p-6",
      },
      
      rounded: {
        default: "rounded-xl",
        sm: "rounded-lg",
        lg: "rounded-2xl",
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

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
    VariantProps<typeof dialogContentVariants> & {
      overlayVariant?: VariantProps<typeof dialogOverlayVariants>['variant']
      hideClose?: boolean
    }
>(({ className, variant, size, rounded, overlayVariant, hideClose = false, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay variant={overlayVariant} />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(dialogContentVariants({ variant, size, rounded }), className)}
      {...props}
    >
      {children}
      {!hideClose && (
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-lg p-2 text-neutral-500 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blueberry-500 focus:ring-offset-2 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-100">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    centered?: boolean
    icon?: React.ReactNode
  }
>(({ className, centered = false, icon, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-3",
      centered ? "text-center items-center" : "text-left",
      className
    )}
    {...props}
  >
    {icon && (
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center mb-2",
        centered ? "mx-auto" : ""
      )}>
        {icon}
      </div>
    )}
    {children}
  </div>
))
DialogHeader.displayName = "DialogHeader"

const DialogFooter = React.forwardRef<
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
        "flex",
        directionClasses[direction],
        justifyClasses[justify],
        className
      )}
      {...props}
    />
  )
})
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> & {
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
    <DialogPrimitive.Title
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
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> & {
    size?: "sm" | "default" | "lg"
  }
>(({ className, size = "default", ...props }, ref) => {
  const sizeClasses = {
    sm: "text-xs",
    default: "body-text",
    lg: "text-base",
  }

  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn(
        sizeClasses[size],
        "text-neutral-600 dark:text-neutral-400 leading-relaxed",
        className
      )}
      {...props}
    />
  )
})
DialogDescription.displayName = DialogPrimitive.Description.displayName

// Preset Dialog Components
const ConfirmDialog = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  Omit<React.ComponentPropsWithoutRef<typeof DialogContent>, 'children'> & {
    title: string
    description?: string
    confirmText?: string
    cancelText?: string
    variant?: 'default' | 'destructive'
    onConfirm: () => void
    onCancel?: () => void
    loading?: boolean
  }
>(({ 
  title, 
  description, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  variant: dialogVariant = "default",
  onConfirm, 
  onCancel, 
  loading = false,
  ...props 
}, ref) => {
  const iconMap = {
    default: <Info className="text-blueberry-500" />,
    destructive: <AlertTriangle className="text-error-500" />,
  }

  const contentVariant = dialogVariant === 'destructive' ? 'error' : 'default'

  return (
    <DialogContent
      ref={ref}
      variant={contentVariant}
      size="sm"
      {...props}
    >
      <DialogHeader centered icon={iconMap[dialogVariant]}>
        <DialogTitle size="lg">{title}</DialogTitle>
        {description && (
          <DialogDescription size="default">{description}</DialogDescription>
        )}
      </DialogHeader>
      
      <DialogFooter justify="center" direction="row">
        <DialogClose asChild>
          <button 
            className="btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
        </DialogClose>
        <button
          className={dialogVariant === 'destructive' ? 'btn-error' : 'btn-primary'}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Processing...' : confirmText}
        </button>
      </DialogFooter>
    </DialogContent>
  )
})
ConfirmDialog.displayName = "ConfirmDialog"

const AlertDialog = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  Omit<React.ComponentPropsWithoutRef<typeof DialogContent>, 'children'> & {
    type: 'success' | 'warning' | 'error' | 'info'
    title: string
    description?: string
    actionText?: string
    onAction?: () => void
  }
>(({ 
  type, 
  title, 
  description, 
  actionText = "OK",
  onAction,
  ...props 
}, ref) => {
  const config = {
    success: {
      icon: <CheckCircle className="text-success-500" />,
      variant: 'success' as const,
    },
    warning: {
      icon: <AlertTriangle className="text-warning-500" />,
      variant: 'warning' as const,
    },
    error: {
      icon: <AlertCircle className="text-error-500" />,
      variant: 'error' as const,
    },
    info: {
      icon: <Info className="text-blueberry-500" />,
      variant: 'feature' as const,
    },
  }

  const { icon, variant } = config[type]

  return (
    <DialogContent
      ref={ref}
      variant={variant}
      size="sm"
      {...props}
    >
      <DialogHeader centered icon={icon}>
        <DialogTitle size="lg">{title}</DialogTitle>
        {description && (
          <DialogDescription>{description}</DialogDescription>
        )}
      </DialogHeader>
      
      <DialogFooter justify="center">
        <DialogClose asChild>
          <button 
            className="btn-primary"
            onClick={onAction}
          >
            {actionText}
          </button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
})
AlertDialog.displayName = "AlertDialog"

const FormDialog = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogContent> & {
    title: string
    description?: string
    submitText?: string
    cancelText?: string
    onSubmit?: () => void
    loading?: boolean
  }
>(({ 
  title, 
  description, 
  submitText = "Save",
  cancelText = "Cancel",
  onSubmit,
  loading = false,
  children,
  ...props 
}, ref) => (
  <DialogContent
    ref={ref}
    variant="feature"
    {...props}
  >
    <DialogHeader>
      <DialogTitle gradient>{title}</DialogTitle>
      {description && (
        <DialogDescription>{description}</DialogDescription>
      )}
    </DialogHeader>
    
    <div className="space-y-4">
      {children}
    </div>
    
    <DialogFooter>
      <DialogClose asChild>
        <button 
          className="btn-secondary"
          disabled={loading}
        >
          {cancelText}
        </button>
      </DialogClose>
      <button
        className="btn-primary"
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? 'Saving...' : submitText}
      </button>
    </DialogFooter>
  </DialogContent>
))
FormDialog.displayName = "FormDialog"

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  ConfirmDialog,
  AlertDialog,
  FormDialog,
}
