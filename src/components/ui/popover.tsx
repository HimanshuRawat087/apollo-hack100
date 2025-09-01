"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cva, type VariantProps } from "class-variance-authority"
import { X, Info, Settings, User, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverClose = PopoverPrimitive.Close

const popoverContentVariants = cva(
  "z-50 rounded-lg border bg-popover text-popover-foreground shadow-xl outline-none transition-all duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        default:
          "border-neutral-200 bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100",
        
        feature:
          "border-blueberry-200 bg-gradient-to-br from-white to-blueberry-25 text-neutral-900 dark:border-blueberry-700 dark:from-neutral-800 dark:to-blueberry-950 dark:text-neutral-100",
        
        success:
          "border-success-200 bg-gradient-to-br from-white to-success-25 text-success-900 dark:border-success-700 dark:from-neutral-800 dark:to-success-950 dark:text-success-100",
        
        warning:
          "border-warning-200 bg-gradient-to-br from-white to-warning-25 text-warning-900 dark:border-warning-700 dark:from-neutral-800 dark:to-warning-950 dark:text-warning-100",
        
        error:
          "border-error-200 bg-gradient-to-br from-white to-error-25 text-error-900 dark:border-error-700 dark:from-neutral-800 dark:to-error-950 dark:text-error-100",
        
        glass:
          "border-white/20 bg-white/10 backdrop-blur-xl text-white shadow-2xl",
        
        minimal:
          "border-none bg-white/95 backdrop-blur-md text-neutral-900 shadow-2xl dark:bg-neutral-900/95 dark:text-neutral-100",
      },
      
      size: {
        sm: "w-48 p-3",
        default: "w-72 p-4",
        lg: "w-80 p-6",
        xl: "w-96 p-6",
        auto: "max-w-sm p-4",
        wide: "w-[32rem] p-6",
      },
      
      rounded: {
        default: "rounded-lg",
        sm: "rounded-md",
        lg: "rounded-xl",
        xl: "rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    VariantProps<typeof popoverContentVariants> {
  hideClose?: boolean
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(({ 
  className, 
  align = "center", 
  sideOffset = 8,
  variant,
  size,
  rounded,
  hideClose = false,
  children,
  ...props 
}, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(popoverContentVariants({ variant, size, rounded }), className)}
      {...props}
    >
      {children}
      {!hideClose && (
        <PopoverPrimitive.Close className="absolute right-3 top-3 rounded-lg p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-blueberry-500 focus:ring-offset-2 dark:text-neutral-500 dark:hover:bg-neutral-700 dark:hover:text-neutral-300">
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Close</span>
        </PopoverPrimitive.Close>
      )}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

// Popover building blocks
const PopoverHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    icon?: React.ReactNode
    title?: string
    description?: string
  }
>(({ className, icon, title, description, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 border-b border-neutral-200 pb-3 mb-4 dark:border-neutral-700", className)}
    {...props}
  >
    {(icon || title) && (
      <div className="flex items-center gap-2">
        {icon && (
          <div className="text-blueberry-500 dark:text-blueberry-400">
            {icon}
          </div>
        )}
        {title && (
          <h3 className="subtitle text-neutral-900 dark:text-neutral-100">
            {title}
          </h3>
        )}
      </div>
    )}
    {description && (
      <p className="body-text text-neutral-600 dark:text-neutral-400">
        {description}
      </p>
    )}
    {children}
  </div>
))
PopoverHeader.displayName = "PopoverHeader"

const PopoverBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-3", className)}
    {...props}
  />
))
PopoverBody.displayName = "PopoverBody"

const PopoverFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    justify?: "start" | "center" | "end" | "between"
  }
>(({ className, justify = "end", ...props }, ref) => {
  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end", 
    between: "justify-between",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2 border-t border-neutral-200 pt-3 mt-4 dark:border-neutral-700",
        justifyClasses[justify],
        className
      )}
      {...props}
    />
  )
})
PopoverFooter.displayName = "PopoverFooter"

// Specialized Popover Components
const InfoPopover = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  Omit<PopoverContentProps, 'children'> & {
    title: string
    description?: string
    content?: React.ReactNode
  }
>(({ title, description, content, ...props }, ref) => (
  <PopoverContent
    ref={ref}
    variant="feature"
    size="sm"
    hideClose
    {...props}
  >
    <PopoverHeader
      icon={<Info className="h-4 w-4" />}
      title={title}
      description={description}
    />
    {content && <PopoverBody>{content}</PopoverBody>}
  </PopoverContent>
))
InfoPopover.displayName = "InfoPopover"

const MenuPopover = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  Omit<PopoverContentProps, 'children'> & {
    items: Array<{
      icon?: React.ReactNode
      label: string
      description?: string
      onClick: () => void
      variant?: 'default' | 'destructive'
      disabled?: boolean
    }>
  }
>(({ items, ...props }, ref) => (
  <PopoverContent
    ref={ref}
    size="sm"
    hideClose
    {...props}
  >
    <PopoverBody>
      <div className="space-y-1">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            disabled={item.disabled}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors",
              "hover:bg-neutral-100 dark:hover:bg-neutral-700",
              item.variant === 'destructive' && "text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-950",
              item.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent"
            )}
          >
            {item.icon && (
              <div className="text-current">
                {item.icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="body-text font-medium">{item.label}</p>
              {item.description && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {item.description}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </PopoverBody>
  </PopoverContent>
))
MenuPopover.displayName = "MenuPopover"

const FormPopover = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps & {
    title?: string
    description?: string
    onSubmit?: () => void
    onCancel?: () => void
    submitText?: string
    cancelText?: string
    loading?: boolean
  }
>(({ 
  title, 
  description, 
  onSubmit, 
  onCancel, 
  submitText = "Save",
  cancelText = "Cancel",
  loading = false,
  children, 
  ...props 
}, ref) => (
  <PopoverContent
    ref={ref}
    variant="feature"
    {...props}
  >
    {(title || description) && (
      <PopoverHeader title={title} description={description} />
    )}
    
    <PopoverBody>
      {children}
    </PopoverBody>
    
    <PopoverFooter justify="between">
      <PopoverClose asChild>
        <button 
          className="btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          {cancelText}
        </button>
      </PopoverClose>
      <button
        className="btn-primary"
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? 'Saving...' : submitText}
      </button>
    </PopoverFooter>
  </PopoverContent>
))
FormPopover.displayName = "FormPopover"

const TooltipPopover = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  Omit<PopoverContentProps, 'children'> & {
    content: React.ReactNode
  }
>(({ content, ...props }, ref) => (
  <PopoverContent
    ref={ref}
    variant="minimal"
    size="auto"
    hideClose
    sideOffset={4}
    {...props}
  >
    <div className="body-text">
      {content}
    </div>
  </PopoverContent>
))
TooltipPopover.displayName = "TooltipPopover"

export { 
  Popover, 
  PopoverTrigger, 
  PopoverContent,
  PopoverClose,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  InfoPopover,
  MenuPopover,
  FormPopover,
  TooltipPopover,
  popoverContentVariants,
}
