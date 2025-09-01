"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const separatorVariants = cva(
  "shrink-0 transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "bg-neutral-200 dark:bg-neutral-700",
        subtle: "bg-neutral-100 dark:bg-neutral-800",
        bold: "bg-neutral-300 dark:bg-neutral-600",
        primary: "bg-blueberry-200 dark:bg-blueberry-700",
        gradient: "bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-600",
        dashed: "border-dashed border-neutral-300 dark:border-neutral-600 bg-transparent",
        dotted: "border-dotted border-neutral-300 dark:border-neutral-600 bg-transparent",
      },
      
      size: {
        thin: "",
        default: "",
        thick: "",
        thicker: "",
      },
      
      spacing: {
        none: "",
        sm: "",
        default: "",
        lg: "",
        xl: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      spacing: "default",
    },
    compoundVariants: [
      // Horizontal spacing and sizing
      {
        size: "thin",
        class: "h-px",
      },
      {
        size: "default", 
        class: "h-px",
      },
      {
        size: "thick",
        class: "h-0.5",
      },
      {
        size: "thicker",
        class: "h-1",
      },
      // Vertical spacing and sizing would be handled by orientation
    ],
  }
)

export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>,
    VariantProps<typeof separatorVariants> {
  orientation?: "horizontal" | "vertical"
  label?: string
  icon?: React.ReactNode
}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(({
  className,
  orientation = "horizontal",
  decorative = true,
  variant,
  size,
  spacing,
  label,
  icon,
  ...props
}, ref) => {
  // Handle dashed and dotted variants differently
  const isDashedOrDotted = variant === "dashed" || variant === "dotted"
  
  const orientationClasses = orientation === "horizontal" 
    ? {
        container: spacing === "none" ? "" : spacing === "sm" ? "my-2" : spacing === "lg" ? "my-6" : spacing === "xl" ? "my-8" : "my-4",
        separator: "w-full",
        borderSize: isDashedOrDotted ? (size === "thick" ? "border-t-2" : size === "thicker" ? "border-t-4" : "border-t") : "",
      }
    : {
        container: spacing === "none" ? "" : spacing === "sm" ? "mx-2" : spacing === "lg" ? "mx-6" : spacing === "xl" ? "mx-8" : "mx-4", 
        separator: "h-full",
        borderSize: isDashedOrDotted ? (size === "thick" ? "border-l-2" : size === "thicker" ? "border-l-4" : "border-l") : "",
      }

  // If we have a label or icon, render as a labeled separator
  if (label || icon) {
    return (
      <div className={cn("flex items-center", orientationClasses.container)}>
        <SeparatorPrimitive.Root
          ref={ref}
          decorative={decorative}
          orientation={orientation}
          className={cn(
            separatorVariants({ variant, size }),
            orientation === "horizontal" ? "flex-1" : "flex-1",
            isDashedOrDotted && orientationClasses.borderSize,
            className
          )}
          {...props}
        />
        
        {(label || icon) && (
          <div className={cn(
            "flex items-center gap-2 px-3 py-1",
            orientation === "horizontal" ? "flex-row" : "flex-col"
          )}>
            {icon && (
              <div className="text-neutral-500 dark:text-neutral-400">
                {icon}
              </div>
            )}
            {label && (
              <span className="overline text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                {label}
              </span>
            )}
          </div>
        )}
        
        <SeparatorPrimitive.Root
          decorative={decorative}
          orientation={orientation}
          className={cn(
            separatorVariants({ variant, size }),
            orientation === "horizontal" ? "flex-1" : "flex-1",
            isDashedOrDotted && orientationClasses.borderSize
          )}
        />
      </div>
    )
  }

  // Regular separator without label
  return (
    <div className={orientationClasses.container}>
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          separatorVariants({ variant, size }),
          orientationClasses.separator,
          orientation === "vertical" && (
            size === "thin" ? "w-px" :
            size === "thick" ? "w-0.5" :
            size === "thicker" ? "w-1" : "w-px"
          ),
          isDashedOrDotted && orientationClasses.borderSize,
          className
        )}
        {...props}
      />
    </div>
  )
})
Separator.displayName = SeparatorPrimitive.Root.displayName

// Specialized Separator Components
const SectionSeparator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  Omit<SeparatorProps, 'variant' | 'spacing'> & {
    title?: string
  }
>(({ title, icon, ...props }, ref) => (
  <Separator
    ref={ref}
    variant="gradient"
    spacing="lg"
    label={title}
    icon={icon}
    {...props}
  />
))
SectionSeparator.displayName = "SectionSeparator"

const MenuSeparator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  Omit<SeparatorProps, 'variant' | 'spacing' | 'size'>
>(({ ...props }, ref) => (
  <Separator
    ref={ref}
    variant="subtle"
    spacing="sm"
    size="thin"
    {...props}
  />
))
MenuSeparator.displayName = "MenuSeparator"

const ContentSeparator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  Omit<SeparatorProps, 'variant'>
>(({ spacing = "lg", ...props }, ref) => (
  <Separator
    ref={ref}
    variant="default"
    spacing={spacing}
    {...props}
  />
))
ContentSeparator.displayName = "ContentSeparator"

const FeatureSeparator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  Omit<SeparatorProps, 'variant' | 'size'>
>(({ ...props }, ref) => (
  <Separator
    ref={ref}
    variant="primary"
    size="thick"
    {...props}
  />
))
FeatureSeparator.displayName = "FeatureSeparator"

const DividerText = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode
    variant?: "default" | "muted" | "primary"
  }
>(({ className, children, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "bg-white text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400",
    muted: "bg-neutral-50 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500",
    primary: "bg-white text-blueberry-600 dark:bg-neutral-900 dark:text-blueberry-400",
  }

  return (
    <div className="relative flex items-center justify-center my-6">
      <Separator variant="subtle" spacing="none" />
      <div
        ref={ref}
        className={cn(
          "absolute px-4 py-1 rounded-full border border-neutral-200 dark:border-neutral-700",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <span className="overline">{children}</span>
      </div>
    </div>
  )
})
DividerText.displayName = "DividerText"

const TimelineSeparator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  Omit<SeparatorProps, 'orientation' | 'variant' | 'size'> & {
    active?: boolean
  }
>(({ active = false, className, ...props }, ref) => (
  <Separator
    ref={ref}
    orientation="vertical"
    variant={active ? "primary" : "subtle"}
    size="thick"
    spacing="none"
    className={cn("min-h-8", className)}
    {...props}
  />
))
TimelineSeparator.displayName = "TimelineSeparator"

export { 
  Separator,
  SectionSeparator,
  MenuSeparator,
  ContentSeparator,
  FeatureSeparator,
  DividerText,
  TimelineSeparator,
  separatorVariants,
}
