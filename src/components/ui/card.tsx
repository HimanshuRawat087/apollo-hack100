import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-lg bg-card text-card-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "border border-neutral-200 shadow-card hover:shadow-lg hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600",
        
        elevated:
          "border border-neutral-200 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-blueberry-200 dark:border-neutral-700 dark:hover:border-blueberry-600",
        
        outlined:
          "border-2 border-neutral-300 shadow-none hover:border-blueberry-400 hover:shadow-sm dark:border-neutral-600 dark:hover:border-blueberry-500",
        
        ghost:
          "border-none shadow-none bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800",
        
        gradient:
          "border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 shadow-card hover:shadow-lg hover:from-blueberry-25 hover:to-white dark:from-neutral-800 dark:to-neutral-750 dark:border-neutral-700",
        
        glass:
          "border border-white/20 bg-white/10 backdrop-blur-md shadow-xl text-white hover:bg-white/20 hover:border-white/30",
        
        interactive:
          "border border-neutral-200 shadow-card hover:shadow-xl hover:border-blueberry-300 hover:-translate-y-1 cursor-pointer group dark:border-neutral-700 dark:hover:border-blueberry-500",
        
        feature:
          "border-2 border-blueberry-200 bg-gradient-to-br from-blueberry-25 to-white shadow-lg hover:shadow-xl hover:border-blueberry-300 dark:from-blueberry-950 dark:to-neutral-800 dark:border-blueberry-700",
        
        success:
          "border border-success-200 bg-gradient-to-br from-success-25 to-white shadow-card hover:shadow-lg dark:from-success-950 dark:to-neutral-800 dark:border-success-700",
        
        warning:
          "border border-warning-200 bg-gradient-to-br from-warning-25 to-white shadow-card hover:shadow-lg dark:from-warning-950 dark:to-neutral-800 dark:border-warning-700",
        
        error:
          "border border-error-200 bg-gradient-to-br from-error-25 to-white shadow-card hover:shadow-lg dark:from-error-950 dark:to-neutral-800 dark:border-error-700",
      },
      
      size: {
        sm: "p-4",
        default: "",
        lg: "p-8",
        xl: "p-10",
      },
      
      rounded: {
        default: "rounded-lg",
        sm: "rounded-md",
        lg: "rounded-xl",
        xl: "rounded-2xl",
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

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, rounded, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, size, rounded }), className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    compact?: boolean
  }
>(({ className, compact = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5",
      compact ? "p-4 pb-2" : "p-6 pb-4",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: "sm" | "default" | "lg" | "xl"
    gradient?: boolean
  }
>(({ className, size = "default", gradient = false, ...props }, ref) => {
  const sizeClasses = {
    sm: "text-lg font-semibold",
    default: "heading-3",
    lg: "heading-2", 
    xl: "heading-1",
  }

  return (
    <div
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
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: "sm" | "default" | "lg"
  }
>(({ className, size = "default", ...props }, ref) => {
  const sizeClasses = {
    sm: "text-xs",
    default: "text-sm",
    lg: "text-base",
  }

  return (
    <div
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
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    compact?: boolean
    noPadding?: boolean
  }
>(({ className, compact = false, noPadding = false, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      !noPadding && (compact ? "px-4 pb-4" : "p-6 pt-0"),
      className
    )} 
    {...props} 
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    compact?: boolean
    justify?: "start" | "center" | "end" | "between"
  }
>(({ className, compact = false, justify = "start", ...props }, ref) => {
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
        "flex items-center gap-3",
        compact ? "px-4 pb-4" : "p-6 pt-0",
        justifyClasses[justify],
        className
      )}
      {...props}
    />
  )
})
CardFooter.displayName = "CardFooter"

// Specialized card components
const FeatureCard = React.forwardRef<
  HTMLDivElement,
  CardProps & {
    icon?: React.ReactNode
    title: string
    description?: string
    children?: React.ReactNode
  }
>(({ icon, title, description, children, className, ...props }, ref) => (
  <Card
    ref={ref}
    variant="feature"
    className={cn("group", className)}
    {...props}
  >
    <CardHeader>
      {icon && (
        <div className="w-12 h-12 rounded-lg bg-blueberry-100 dark:bg-blueberry-900 flex items-center justify-center text-blueberry-600 dark:text-blueberry-400 mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      )}
      <CardTitle gradient>{title}</CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    {children && <CardContent>{children}</CardContent>}
  </Card>
))
FeatureCard.displayName = "FeatureCard"

const StatsCard = React.forwardRef<
  HTMLDivElement,
  CardProps & {
    label: string
    value: string | number
    change?: string
    trend?: "up" | "down" | "neutral"
    icon?: React.ReactNode
  }
>(({ label, value, change, trend, icon, className, ...props }, ref) => {
  const trendColors = {
    up: "text-success-600 dark:text-success-400",
    down: "text-error-600 dark:text-error-400", 
    neutral: "text-neutral-600 dark:text-neutral-400",
  }

  return (
    <Card
      ref={ref}
      variant="elevated"
      className={cn("group", className)}
      {...props}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {label}
            </p>
            <p className="text-3xl font-bold text-neutral-900 dark:text-white">
              {value}
            </p>
            {change && (
              <p className={cn("text-sm font-medium", trend && trendColors[trend])}>
                {change}
              </p>
            )}
          </div>
          {icon && (
            <div className="text-blueberry-500 dark:text-blueberry-400 group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
})
StatsCard.displayName = "StatsCard"

const ActionCard = React.forwardRef<
  HTMLDivElement,
  CardProps & {
    title: string
    description?: string
    action?: React.ReactNode
    image?: string
  }
>(({ title, description, action, image, className, ...props }, ref) => (
  <Card
    ref={ref}
    variant="interactive"
    className={className}
    {...props}
  >
    {image && (
      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
    )}
    <CardHeader compact={!!image}>
      <CardTitle size="default">{title}</CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    {action && (
      <CardFooter compact={!!image} justify="end">
        {action}
      </CardFooter>
    )}
  </Card>
))
ActionCard.displayName = "ActionCard"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  FeatureCard,
  StatsCard,
  ActionCard,
  cardVariants
}
