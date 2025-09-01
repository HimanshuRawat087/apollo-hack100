import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Eye, EyeOff, Search, X, Check, AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-lg border bg-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-neutral-400",
  {
    variants: {
      variant: {
        default:
          "border-neutral-300 text-neutral-900 focus-visible:border-blueberry-500 focus-visible:ring-2 focus-visible:ring-blueberry-500/20 hover:border-neutral-400 dark:border-neutral-600 dark:text-neutral-100 dark:focus-visible:border-blueberry-400 dark:hover:border-neutral-500",
        
        filled:
          "border-neutral-200 bg-neutral-50 text-neutral-900 focus-visible:border-blueberry-500 focus-visible:ring-2 focus-visible:ring-blueberry-500/20 focus-visible:bg-white hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus-visible:bg-neutral-700 dark:hover:bg-neutral-750",
        
        outline:
          "border-2 border-neutral-300 bg-transparent text-neutral-900 focus-visible:border-blueberry-500 focus-visible:ring-2 focus-visible:ring-blueberry-500/20 hover:border-blueberry-300 dark:border-neutral-600 dark:text-neutral-100 dark:focus-visible:border-blueberry-400 dark:hover:border-blueberry-500",
        
        ghost:
          "border-transparent bg-transparent text-neutral-900 focus-visible:border-blueberry-500 focus-visible:ring-2 focus-visible:ring-blueberry-500/20 focus-visible:bg-white hover:bg-neutral-50 dark:text-neutral-100 dark:focus-visible:bg-neutral-800 dark:hover:bg-neutral-800",
        
        success:
          "border-success-300 bg-success-25 text-success-900 focus-visible:border-success-500 focus-visible:ring-2 focus-visible:ring-success-500/20 dark:border-success-600 dark:bg-success-950 dark:text-success-100",
        
        error:
          "border-error-300 bg-error-25 text-error-900 focus-visible:border-error-500 focus-visible:ring-2 focus-visible:ring-error-500/20 dark:border-error-600 dark:bg-error-950 dark:text-error-100",
        
        warning:
          "border-warning-300 bg-warning-25 text-warning-900 focus-visible:border-warning-500 focus-visible:ring-2 focus-visible:ring-warning-500/20 dark:border-warning-600 dark:bg-warning-950 dark:text-warning-100",
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

export interface InputProps
  extends Omit<React.ComponentProps<"input">, 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  label?: string
  description?: string
  error?: string
  success?: string
  clearable?: boolean
  loading?: boolean
  onClear?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    size, 
    rounded,
    type = "text",
    leftIcon,
    rightIcon,
    label,
    description,
    error,
    success,
    clearable = false,
    loading = false,
    onClear,
    value,
    disabled,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const isPassword = type === "password"
    const hasValue = value && value.toString().length > 0
    
    // Determine the actual variant based on state
    const actualVariant = error ? "error" : success ? "success" : variant
    
    // Calculate icon sizes based on input size
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
          {leftIcon && (
            <div className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400",
              iconSize
            )}>
              {leftIcon}
            </div>
          )}
          
          <input
            type={isPassword ? (showPassword ? "text" : "password") : type}
            className={cn(
              inputVariants({ variant: actualVariant, size, rounded }),
              leftIcon && (size === "sm" ? "pl-8" : size === "lg" ? "pl-12" : size === "xl" ? "pl-14" : "pl-10"),
              (rightIcon || isPassword || clearable || loading) && (size === "sm" ? "pr-8" : size === "lg" ? "pr-12" : size === "xl" ? "pr-14" : "pr-10"),
              className
            )}
            ref={ref}
            value={value}
            disabled={disabled || loading}
            {...props}
          />
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {loading && (
              <div className={cn("animate-spin rounded-full border-2 border-neutral-300 border-t-blueberry-500", 
                size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : size === "xl" ? "h-6 w-6" : "h-4 w-4"
              )} />
            )}
            
            {!loading && clearable && hasValue && !disabled && (
              <button
                type="button"
                onClick={onClear}
                className={cn(
                  "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors",
                  iconSize
                )}
              >
                <X />
              </button>
            )}
            
            {!loading && isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors",
                  iconSize
                )}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            )}
            
            {!loading && !clearable && !isPassword && rightIcon && (
              <div className={cn("text-neutral-500 dark:text-neutral-400", iconSize)}>
                {rightIcon}
              </div>
            )}
            
            {!loading && success && (
              <Check className={cn("text-success-500", iconSize)} />
            )}
            
            {!loading && error && (
              <AlertCircle className={cn("text-error-500", iconSize)} />
            )}
          </div>
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
  }
)
Input.displayName = "Input"

// Specialized Input Components
const SearchInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, 'leftIcon' | 'type'> & {
    onSearch?: (value: string) => void
  }
>(({ onSearch, onClear, ...props }, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(e.currentTarget.value)
    }
    props.onKeyDown?.(e)
  }

  return (
    <Input
      ref={ref}
      type="search"
      leftIcon={<Search />}
      clearable
      onKeyDown={handleKeyDown}
      onClear={onClear}
      {...props}
    />
  )
})
SearchInput.displayName = "SearchInput"

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, 'type'>
>(({ ...props }, ref) => {
  return (
    <Input
      ref={ref}
      type="password"
      {...props}
    />
  )
})
PasswordInput.displayName = "PasswordInput"

const NumberInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, 'type'> & {
    min?: number
    max?: number
    step?: number
  }
>(({ min, max, step, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      type="number"
      min={min}
      max={max}
      step={step}
      {...props}
    />
  )
})
NumberInput.displayName = "NumberInput"

const EmailInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, 'type'>
>(({ ...props }, ref) => {
  return (
    <Input
      ref={ref}
      type="email"
      {...props}
    />
  )
})
EmailInput.displayName = "EmailInput"

const URLInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, 'type'>
>(({ ...props }, ref) => {
  return (
    <Input
      ref={ref}
      type="url"
      {...props}
    />
  )
})
URLInput.displayName = "URLInput"

// Input Group Component for multiple inputs
const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    direction?: 'row' | 'column'
    spacing?: 'sm' | 'default' | 'lg'
  }
>(({ className, direction = 'column', spacing = 'default', children, ...props }, ref) => {
  const spacingMap = {
    sm: direction === 'row' ? 'gap-2' : 'space-y-2',
    default: direction === 'row' ? 'gap-4' : 'space-y-4',
    lg: direction === 'row' ? 'gap-6' : 'space-y-6',
  }

  return (
    <div
      ref={ref}
      className={cn(
        direction === 'row' ? 'flex items-end' : 'flex flex-col',
        spacingMap[spacing],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
InputGroup.displayName = "InputGroup"

export { 
  Input, 
  SearchInput, 
  PasswordInput, 
  NumberInput, 
  EmailInput, 
  URLInput,
  InputGroup,
  inputVariants 
}
