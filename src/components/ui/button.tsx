import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueberry-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0 active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        // Primary - Blueberry Magic
        default:
          "bg-blueberry-500 text-white shadow-button hover:bg-blueberry-600 hover:shadow-button-hover active:bg-blueberry-700 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-none",
        
        // Secondary - Neutral Elegance
        secondary:
          "bg-neutral-100 text-neutral-800 border border-neutral-200 hover:bg-neutral-200 hover:border-neutral-300 active:bg-neutral-300 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-neutral-200 dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600 dark:hover:bg-neutral-600",
        
        // Success - Green Power
        success:
          "bg-success-500 text-white shadow-button hover:bg-success-600 hover:shadow-button-hover active:bg-success-700 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-none",
        
        // Destructive - Red Alert
        destructive:
          "bg-error-500 text-white shadow-button hover:bg-error-600 hover:shadow-button-hover active:bg-error-700 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-none",
        
        // Warning - Orange Attention
        warning:
          "bg-warning-500 text-white shadow-button hover:bg-warning-600 hover:shadow-button-hover active:bg-warning-700 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-none",
        
        // Outline Variants
        outline:
          "border-2 border-blueberry-500 text-blueberry-600 bg-transparent hover:bg-blueberry-500 hover:text-white active:bg-blueberry-600 disabled:border-neutral-300 disabled:text-neutral-400 disabled:bg-transparent dark:text-blueberry-400 dark:border-blueberry-400 dark:hover:bg-blueberry-400 dark:hover:text-white",
        
        "outline-secondary":
          "border-2 border-neutral-300 text-neutral-700 bg-transparent hover:bg-neutral-100 hover:border-neutral-400 active:bg-neutral-200 disabled:border-neutral-200 disabled:text-neutral-400 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700",
        
        "outline-success":
          "border-2 border-success-500 text-success-600 bg-transparent hover:bg-success-500 hover:text-white active:bg-success-600 disabled:border-neutral-300 disabled:text-neutral-400 dark:text-success-400 dark:border-success-400",
        
        "outline-destructive":
          "border-2 border-error-500 text-error-600 bg-transparent hover:bg-error-500 hover:text-white active:bg-error-600 disabled:border-neutral-300 disabled:text-neutral-400 dark:text-error-400 dark:border-error-400",
        
        // Ghost Variants
        ghost:
          "text-blueberry-600 bg-transparent hover:bg-blueberry-50 hover:text-blueberry-700 active:bg-blueberry-100 disabled:text-neutral-400 disabled:bg-transparent dark:text-blueberry-400 dark:hover:bg-blueberry-950 dark:hover:text-blueberry-300",
        
        "ghost-secondary":
          "text-neutral-700 bg-transparent hover:bg-neutral-100 hover:text-neutral-800 active:bg-neutral-200 disabled:text-neutral-400 dark:text-neutral-300 dark:hover:bg-neutral-800",
        
        "ghost-success":
          "text-success-600 bg-transparent hover:bg-success-50 hover:text-success-700 active:bg-success-100 disabled:text-neutral-400 dark:text-success-400 dark:hover:bg-success-950",
        
        "ghost-destructive":
          "text-error-600 bg-transparent hover:bg-error-50 hover:text-error-700 active:bg-error-100 disabled:text-neutral-400 dark:text-error-400 dark:hover:bg-error-950",
        
        // Special Variants
        gradient:
          "bg-gradient-to-r from-blueberry-500 to-blueberry-600 text-white shadow-button hover:from-blueberry-600 hover:to-blueberry-700 hover:shadow-button-hover active:from-blueberry-700 active:to-blueberry-800 disabled:from-neutral-300 disabled:to-neutral-300 disabled:text-neutral-500 disabled:shadow-none",
        
        link:
          "text-blueberry-600 underline-offset-4 hover:underline hover:text-blueberry-700 active:text-blueberry-800 disabled:text-neutral-400 disabled:no-underline dark:text-blueberry-400 dark:hover:text-blueberry-300",
        
        glass:
          "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 active:bg-white/30 shadow-lg disabled:bg-white/5 disabled:text-white/50 disabled:border-white/10",
      },
      
      size: {
        xs: "h-7 px-2 text-xs [&_svg]:size-3",
        sm: "h-8 px-3 text-sm [&_svg]:size-3.5",
        default: "h-10 px-4 text-sm [&_svg]:size-4",
        lg: "h-12 px-6 text-base [&_svg]:size-5",
        xl: "h-14 px-8 text-lg [&_svg]:size-6",
        icon: "h-10 w-10 [&_svg]:size-4",
        "icon-sm": "h-8 w-8 [&_svg]:size-3.5",
        "icon-lg": "h-12 w-12 [&_svg]:size-5",
        "icon-xl": "h-14 w-14 [&_svg]:size-6",
      },
      
      rounded: {
        default: "rounded-button",
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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    rounded,
    asChild = false, 
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const isDisabled = disabled || loading
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded }), className)}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        <>
          {loading && <Loader2 className="animate-spin" />}
          {!loading && leftIcon && leftIcon}
          {loading ? (loadingText || children) : children}
          {!loading && rightIcon && rightIcon}
        </>
      </Comp>
    )
  }
)
Button.displayName = "Button"

// Preset button components for common patterns
const IconButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'size'> & { 
    size?: 'sm' | 'default' | 'lg' | 'xl'
    icon: React.ReactNode
    tooltip?: string
  }
>(({ icon, size = 'default', children, ...props }, ref) => {
  const iconSizes = {
    sm: 'icon-sm',
    default: 'icon',
    lg: 'icon-lg',
    xl: 'icon-xl',
  } as const

  return (
    <Button
      ref={ref}
      size={iconSizes[size]}
      title={props.tooltip}
      {...props}
    >
      {icon}
      {children && <span className="sr-only">{children}</span>}
    </Button>
  )
})
IconButton.displayName = "IconButton"

const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { 
    loadingVariant?: ButtonProps['variant']
  }
>(({ loadingVariant, loading, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant={loading ? loadingVariant || props.variant : props.variant}
      loading={loading}
      {...props}
    />
  )
})
LoadingButton.displayName = "LoadingButton"

export { Button, buttonVariants, IconButton, LoadingButton }
