"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cva, type VariantProps } from "class-variance-authority"
import { Circle, Check, Dot } from "lucide-react"

import { cn } from "@/lib/utils"

const radioGroupVariants = cva(
  "grid",
  {
    variants: {
      orientation: {
        vertical: "grid-cols-1 gap-3",
        horizontal: "grid-flow-col auto-cols-max gap-6",
      },
      
      spacing: {
        sm: "gap-2",
        default: "gap-3",
        lg: "gap-4",
        xl: "gap-6",
      },
    },
    defaultVariants: {
      orientation: "vertical",
      spacing: "default",
    },
  }
)

const radioItemVariants = cva(
  "aspect-square rounded-full border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blueberry-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-neutral-300 text-blueberry-500 hover:border-blueberry-400 data-[state=checked]:border-blueberry-500 data-[state=checked]:bg-blueberry-500 data-[state=checked]:text-white dark:border-neutral-600 dark:hover:border-blueberry-400 dark:data-[state=checked]:border-blueberry-400 dark:data-[state=checked]:bg-blueberry-400",
        
        outline:
          "border-2 border-neutral-300 text-blueberry-500 hover:border-blueberry-400 data-[state=checked]:border-blueberry-500 data-[state=checked]:bg-blueberry-50 dark:border-neutral-600 dark:hover:border-blueberry-400 dark:data-[state=checked]:border-blueberry-400 dark:data-[state=checked]:bg-blueberry-950",
        
        filled:
          "border-neutral-200 bg-neutral-50 text-blueberry-500 hover:bg-neutral-100 hover:border-neutral-300 data-[state=checked]:border-blueberry-500 data-[state=checked]:bg-blueberry-500 data-[state=checked]:text-white dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:data-[state=checked]:bg-blueberry-400",
        
        success:
          "border-success-300 text-success-500 hover:border-success-400 data-[state=checked]:border-success-500 data-[state=checked]:bg-success-500 data-[state=checked]:text-white dark:border-success-600 dark:data-[state=checked]:bg-success-400",
        
        warning:
          "border-warning-300 text-warning-500 hover:border-warning-400 data-[state=checked]:border-warning-500 data-[state=checked]:bg-warning-500 data-[state=checked]:text-white dark:border-warning-600 dark:data-[state=checked]:bg-warning-400",
        
        error:
          "border-error-300 text-error-500 hover:border-error-400 data-[state=checked]:border-error-500 data-[state=checked]:bg-error-500 data-[state=checked]:text-white dark:border-error-600 dark:data-[state=checked]:bg-error-400",
      },
      
      size: {
        sm: "h-4 w-4",
        default: "h-5 w-5",
        lg: "h-6 w-6",
        xl: "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
    VariantProps<typeof radioGroupVariants> {
  label?: string
  description?: string
  error?: string
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, orientation, spacing, label, description, error, children, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="subtitle text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      
      {description && (
        <p className="body-text text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      )}
      
      <RadioGroupPrimitive.Root
        className={cn(radioGroupVariants({ orientation, spacing }), className)}
        {...props}
        ref={ref}
      >
        {children}
      </RadioGroupPrimitive.Root>
      
      {error && (
        <p className="body-text text-error-600 dark:text-error-400">
          {error}
        </p>
      )}
    </div>
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioItemVariants> {
  label?: string
  description?: string
  icon?: 'circle' | 'dot' | 'check'
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, variant, size, label, description, icon = 'circle', children, ...props }, ref) => {
  const IconComponent = {
    circle: Circle,
    dot: Dot,
    check: Check,
  }[icon]

  const iconSizes = {
    sm: "h-2 w-2",
    default: "h-2.5 w-2.5", 
    lg: "h-3 w-3",
    xl: "h-3.5 w-3.5",
  }

  if (label || description) {
    return (
      <div className="flex items-start gap-3">
        <RadioGroupPrimitive.Item
          ref={ref}
          className={cn(radioItemVariants({ variant, size }), "mt-0.5", className)}
          {...props}
        >
          <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
            <IconComponent className={cn(iconSizes[size || 'default'], "fill-current text-current")} />
          </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
        
        <div className="flex-1 space-y-1">
          {label && (
            <label 
              className="body-text font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer"
              onClick={() => {
                // Trigger the radio item when label is clicked
                const radioElement = ref as React.RefObject<HTMLButtonElement>
                radioElement.current?.click()
              }}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    )
  }

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(radioItemVariants({ variant, size }), className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <IconComponent className={cn(iconSizes[size || 'default'], "fill-current text-current")} />
      </RadioGroupPrimitive.Indicator>
      {children}
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

// Specialized Radio Components
const RadioCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<RadioGroupItemProps, 'label' | 'description'> & {
    title: string
    description?: string
    icon?: React.ReactNode
    badge?: React.ReactNode
    price?: string
  }
>(({ 
  className, 
  variant = "outline", 
  title, 
  description, 
  icon, 
  badge, 
  price,
  children,
  ...props 
}, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blueberry-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      "border-neutral-200 data-[state=checked]:border-blueberry-500 data-[state=checked]:bg-blueberry-50",
      "dark:border-neutral-700 dark:hover:bg-neutral-800 dark:data-[state=checked]:border-blueberry-400 dark:data-[state=checked]:bg-blueberry-950",
      className
    )}
    {...props}
  >
    <div className="flex w-full items-start gap-3">
      {icon && (
        <div className="mt-1 text-blueberry-500 dark:text-blueberry-400">
          {icon}
        </div>
      )}
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="subtitle text-neutral-900 dark:text-neutral-100">
            {title}
          </h3>
          {badge && badge}
        </div>
        
        {description && (
          <p className="body-text text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        )}
        
        {price && (
          <p className="text-lg font-semibold text-blueberry-600 dark:text-blueberry-400">
            {price}
          </p>
        )}
        
        {children}
      </div>
      
      <RadioGroupPrimitive.Indicator className="mt-1">
        <div className="h-5 w-5 rounded-full border-2 border-blueberry-500 bg-blueberry-500 flex items-center justify-center">
          <Circle className="h-2.5 w-2.5 fill-white text-white" />
        </div>
      </RadioGroupPrimitive.Indicator>
    </div>
  </RadioGroupPrimitive.Item>
))
RadioCard.displayName = "RadioCard"

const RadioButton = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<RadioGroupItemProps, 'variant'> & {
    variant?: 'default' | 'outline' | 'ghost'
  }
>(({ 
  className, 
  variant = "outline",
  label,
  children,
  ...props 
}, ref) => {
  const buttonVariants = {
    default: "border-neutral-200 bg-white hover:bg-neutral-50 data-[state=checked]:border-blueberry-500 data-[state=checked]:bg-blueberry-500 data-[state=checked]:text-white dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:data-[state=checked]:bg-blueberry-400",
    outline: "border-2 border-neutral-300 bg-transparent hover:border-blueberry-300 hover:bg-blueberry-50 data-[state=checked]:border-blueberry-500 data-[state=checked]:bg-blueberry-50 data-[state=checked]:text-blueberry-700 dark:border-neutral-600 dark:hover:border-blueberry-400 dark:hover:bg-blueberry-950 dark:data-[state=checked]:bg-blueberry-950",
    ghost: "border-transparent bg-transparent hover:bg-neutral-100 data-[state=checked]:bg-blueberry-100 data-[state=checked]:text-blueberry-700 dark:hover:bg-neutral-800 dark:data-[state=checked]:bg-blueberry-950",
  }

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "cursor-pointer rounded-lg border px-4 py-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blueberry-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        buttonVariants[variant],
        className
      )}
      {...props}
    >
      <span className="body-text font-medium">
        {label || children}
      </span>
    </RadioGroupPrimitive.Item>
  )
})
RadioButton.displayName = "RadioButton"

export { 
  RadioGroup, 
  RadioGroupItem, 
  RadioCard, 
  RadioButton,
  radioGroupVariants,
  radioItemVariants,
}
