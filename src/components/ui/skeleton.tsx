import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const skeletonVariants = cva(
  "animate-pulse rounded-md transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "bg-neutral-200 dark:bg-neutral-700",
        subtle: "bg-neutral-100 dark:bg-neutral-800",
        shimmer: "bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 bg-[length:200%_100%] animate-shimmer",
        pulse: "bg-neutral-200 dark:bg-neutral-700 animate-pulse-slow",
        wave: "bg-neutral-200 dark:bg-neutral-700 animate-wave",
      },
      
      size: {
        xs: "h-3",
        sm: "h-4", 
        default: "h-5",
        lg: "h-6",
        xl: "h-8",
      },
      
      rounded: {
        default: "rounded-md",
        sm: "rounded-sm",
        lg: "rounded-lg",
        xl: "rounded-xl",
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

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number
  height?: string | number
}

function Skeleton({
  className,
  variant,
  size,
  rounded,
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant, size, rounded }), className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  )
}

// Specialized Skeleton Components
const SkeletonText = React.forwardRef<
  HTMLDivElement,
  SkeletonProps & {
    lines?: number
    lineSpacing?: "sm" | "default" | "lg"
  }
>(({ lines = 3, lineSpacing = "default", className, ...props }, ref) => {
  const spacingClasses = {
    sm: "space-y-1",
    default: "space-y-2", 
    lg: "space-y-3",
  }

  return (
    <div ref={ref} className={cn("w-full", spacingClasses[lineSpacing], className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? "75%" : "100%"}
          {...props}
        />
      ))}
    </div>
  )
})
SkeletonText.displayName = "SkeletonText"

const SkeletonAvatar = React.forwardRef<
  HTMLDivElement,
  SkeletonProps & {
    size?: "xs" | "sm" | "default" | "lg" | "xl" | "2xl"
  }
>(({ size = "default", className, ...props }, ref) => {
  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    default: "w-10 h-10",
    lg: "w-12 h-12", 
    xl: "w-16 h-16",
    "2xl": "w-20 h-20",
  }

  return (
    <Skeleton
      ref={ref}
      rounded="full"
      className={cn(sizeClasses[size], className)}
      {...props}
    />
  )
})
SkeletonAvatar.displayName = "SkeletonAvatar"

const SkeletonCard = React.forwardRef<
  HTMLDivElement,
  SkeletonProps & {
    hasImage?: boolean
    hasAvatar?: boolean
    textLines?: number
  }
>(({ hasImage = false, hasAvatar = false, textLines = 3, className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 space-y-4", className)}>
    {hasImage && (
      <Skeleton className="w-full h-48" rounded="lg" {...props} />
    )}
    
    <div className="space-y-3">
      {hasAvatar && (
        <div className="flex items-center space-x-3">
          <SkeletonAvatar size="sm" {...props} />
          <div className="space-y-1 flex-1">
            <Skeleton width="40%" {...props} />
            <Skeleton width="60%" size="sm" {...props} />
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <Skeleton width="90%" size="lg" {...props} />
        <SkeletonText lines={textLines} {...props} />
      </div>
    </div>
  </div>
))
SkeletonCard.displayName = "SkeletonCard"

const SkeletonTable = React.forwardRef<
  HTMLDivElement,
  SkeletonProps & {
    rows?: number
    columns?: number
    hasHeader?: boolean
  }
>(({ rows = 5, columns = 4, hasHeader = true, className, ...props }, ref) => (
  <div ref={ref} className={cn("w-full space-y-3", className)}>
    {hasHeader && (
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="flex-1 h-6" {...props} />
        ))}
      </div>
    )}
    
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="flex-1" {...props} />
          ))}
        </div>
      ))}
    </div>
  </div>
))
SkeletonTable.displayName = "SkeletonTable"

const SkeletonList = React.forwardRef<
  HTMLDivElement,
  SkeletonProps & {
    items?: number
    hasAvatar?: boolean
    hasBadge?: boolean
  }
>(({ items = 5, hasAvatar = false, hasBadge = false, className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-3", className)}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3">
        {hasAvatar && <SkeletonAvatar size="sm" {...props} />}
        
        <div className="flex-1 space-y-1">
          <Skeleton width="70%" {...props} />
          <Skeleton width="50%" size="sm" {...props} />
        </div>
        
        {hasBadge && <Skeleton width="60px" size="sm" rounded="full" {...props} />}
      </div>
    ))}
  </div>
))
SkeletonList.displayName = "SkeletonList"

const SkeletonButton = React.forwardRef<
  HTMLDivElement,
  SkeletonProps & {
    size?: "sm" | "default" | "lg"
  }
>(({ size = "default", className, ...props }, ref) => {
  const sizeClasses = {
    sm: "h-8 w-20",
    default: "h-10 w-24",
    lg: "h-12 w-28",
  }

  return (
    <Skeleton
      ref={ref}
      rounded="lg"
      className={cn(sizeClasses[size], className)}
      {...props}
    />
  )
})
SkeletonButton.displayName = "SkeletonButton"

const SkeletonInput = React.forwardRef<
  HTMLDivElement,
  SkeletonProps & {
    hasLabel?: boolean
  }
>(({ hasLabel = false, className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)}>
    {hasLabel && <Skeleton width="30%" size="sm" {...props} />}
    <Skeleton className="w-full h-10" rounded="lg" {...props} />
  </div>
))
SkeletonInput.displayName = "SkeletonInput"

const SkeletonChart = React.forwardRef<
  HTMLDivElement,
  SkeletonProps & {
    type?: "bar" | "line" | "pie"
  }
>(({ type = "bar", className, ...props }, ref) => {
  if (type === "pie") {
    return (
      <div ref={ref} className={cn("flex justify-center", className)}>
        <Skeleton className="w-48 h-48" rounded="full" {...props} />
      </div>
    )
  }

  return (
    <div ref={ref} className={cn("w-full h-64 space-y-2", className)}>
      <div className="flex items-end space-x-2 h-full">
        {Array.from({ length: 8 }).map((_, index) => {
          const height = Math.floor(Math.random() * 60) + 20
          return (
            <Skeleton
              key={index}
              className="flex-1"
              height={`${height}%`}
              {...props}
            />
          )
        })}
      </div>
    </div>
  )
})
SkeletonChart.displayName = "SkeletonChart"

// Loading Page Component
const PageSkeleton = React.forwardRef<
  HTMLDivElement,
  {
    variant?: "dashboard" | "article" | "profile" | "table"
    className?: string
  }
>(({ variant = "dashboard", className }, ref) => {
  const skeletonProps = { variant: "shimmer" as const }

  const variants = {
    dashboard: (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton width="200px" size="xl" {...skeletonProps} />
          <SkeletonButton {...skeletonProps} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonCard {...skeletonProps} />
          <SkeletonCard {...skeletonProps} />
          <SkeletonCard {...skeletonProps} />
        </div>
        
        <SkeletonChart {...skeletonProps} />
      </div>
    ),
    
    article: (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-4">
          <Skeleton className="w-full h-12" {...skeletonProps} />
          <div className="flex items-center space-x-3">
            <SkeletonAvatar {...skeletonProps} />
            <div className="space-y-1">
              <Skeleton width="120px" {...skeletonProps} />
              <Skeleton width="80px" size="sm" {...skeletonProps} />
            </div>
          </div>
        </div>
        
        <Skeleton className="w-full h-64" rounded="lg" {...skeletonProps} />
        <SkeletonText lines={8} {...skeletonProps} />
      </div>
    ),
    
    profile: (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <SkeletonAvatar size="2xl" className="mx-auto" {...skeletonProps} />
          <div className="space-y-2">
            <Skeleton width="150px" size="lg" className="mx-auto" {...skeletonProps} />
            <Skeleton width="200px" className="mx-auto" {...skeletonProps} />
          </div>
        </div>
        
        <SkeletonList items={6} hasAvatar {...skeletonProps} />
      </div>
    ),
    
    table: (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton width="150px" size="lg" {...skeletonProps} />
          <SkeletonButton {...skeletonProps} />
        </div>
        <SkeletonTable {...skeletonProps} />
      </div>
    ),
  }

  return (
    <div ref={ref} className={cn("w-full p-6", className)}>
      {variants[variant]}
    </div>
  )
})
PageSkeleton.displayName = "PageSkeleton"

export { 
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonTable,
  SkeletonList,
  SkeletonButton,
  SkeletonInput,
  SkeletonChart,
  PageSkeleton,
  skeletonVariants,
}
