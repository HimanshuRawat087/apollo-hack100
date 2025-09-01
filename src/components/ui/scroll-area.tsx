"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const scrollAreaVariants = cva(
  "relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border border-neutral-200 dark:border-neutral-700 rounded-lg",
        shadow: "shadow-sm border border-neutral-200 dark:border-neutral-700 rounded-lg",
        inset: "bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg",
      },
      
      size: {
        sm: "max-h-32",
        default: "max-h-64",
        lg: "max-h-96", 
        xl: "max-h-[32rem]",
        "2xl": "max-h-[40rem]",
        full: "h-full",
        auto: "", // No height constraint
      },
    },
    defaultVariants: {
      variant: "default",
      size: "auto",
    },
  }
)

const scrollBarVariants = cva(
  "flex touch-none select-none transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800",
  {
    variants: {
      variant: {
        default: "",
        thin: "",
        thick: "",
        minimal: "opacity-40 hover:opacity-100",
        accent: "",
      },
      
      orientation: {
        vertical: "h-full border-l border-l-transparent",
        horizontal: "flex-col border-t border-t-transparent",
      },
      
      size: {
        thin: "",
        default: "",
        thick: "",
      },
    },
    defaultVariants: {
      variant: "default",
      orientation: "vertical",
      size: "default",
    },
    compoundVariants: [
      // Vertical sizes
      {
        orientation: "vertical",
        size: "thin",
        class: "w-1.5 p-[1px]",
      },
      {
        orientation: "vertical", 
        size: "default",
        class: "w-2.5 p-[1px]",
      },
      {
        orientation: "vertical",
        size: "thick", 
        class: "w-3.5 p-[2px]",
      },
      // Horizontal sizes
      {
        orientation: "horizontal",
        size: "thin",
        class: "h-1.5 p-[1px]",
      },
      {
        orientation: "horizontal",
        size: "default",
        class: "h-2.5 p-[1px]",
      },
      {
        orientation: "horizontal",
        size: "thick",
        class: "h-3.5 p-[2px]",
      },
    ],
  }
)

const scrollThumbVariants = cva(
  "relative flex-1 rounded-full transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500",
        thin: "bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500",
        thick: "bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500",
        minimal: "bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600",
        accent: "bg-blueberry-400 hover:bg-blueberry-500 dark:bg-blueberry-500 dark:hover:bg-blueberry-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>,
    VariantProps<typeof scrollAreaVariants> {
  scrollBarVariant?: VariantProps<typeof scrollBarVariants>['variant']
  scrollBarSize?: VariantProps<typeof scrollBarVariants>['size']
  hideScrollBar?: boolean
}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ 
  className, 
  variant, 
  size, 
  scrollBarVariant = "default",
  scrollBarSize = "default",
  hideScrollBar = false,
  children, 
  ...props 
}, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn(scrollAreaVariants({ variant, size }), className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    {!hideScrollBar && (
      <>
        <ScrollBar variant={scrollBarVariant} size={scrollBarSize} />
        <ScrollBar 
          variant={scrollBarVariant} 
          size={scrollBarSize} 
          orientation="horizontal" 
        />
      </>
    )}
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

export interface ScrollBarProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
    VariantProps<typeof scrollBarVariants> {}

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ className, orientation = "vertical", variant, size, ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      scrollBarVariants({ variant, orientation, size }),
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb 
      className={cn(scrollThumbVariants({ variant }))} 
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

// Specialized Scroll Area Components
const ChatScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  Omit<ScrollAreaProps, 'variant' | 'size'>
>(({ className, ...props }, ref) => (
  <ScrollArea
    ref={ref}
    variant="default"
    size="full"
    scrollBarVariant="minimal"
    scrollBarSize="thin"
    className={cn("flex-1", className)}
    {...props}
  />
))
ChatScrollArea.displayName = "ChatScrollArea"

const CodeScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  Omit<ScrollAreaProps, 'variant'>
>(({ className, scrollBarVariant = "accent", ...props }, ref) => (
  <ScrollArea
    ref={ref}
    variant="inset"
    scrollBarVariant={scrollBarVariant}
    className={cn("font-mono", className)}
    {...props}
  />
))
CodeScrollArea.displayName = "CodeScrollArea"

const TableScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  Omit<ScrollAreaProps, 'variant'>
>(({ className, ...props }, ref) => (
  <ScrollArea
    ref={ref}
    variant="bordered"
    scrollBarSize="thin"
    className={className}
    {...props}
  />
))
TableScrollArea.displayName = "TableScrollArea"

const SidebarScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  Omit<ScrollAreaProps, 'variant' | 'size'>
>(({ className, scrollBarVariant = "minimal", ...props }, ref) => (
  <ScrollArea
    ref={ref}
    variant="default"
    size="full"
    scrollBarVariant={scrollBarVariant}
    scrollBarSize="thin"
    className={className}
    {...props}
  />
))
SidebarScrollArea.displayName = "SidebarScrollArea"

const ModalScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ className, size = "lg", scrollBarVariant = "default", ...props }, ref) => (
  <ScrollArea
    ref={ref}
    variant="default"
    size={size}
    scrollBarVariant={scrollBarVariant}
    scrollBarSize="thin"
    className={className}
    {...props}
  />
))
ModalScrollArea.displayName = "ModalScrollArea"

// Utility component for fade effects at scroll boundaries
const FadeScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps & {
    fadeHeight?: number
    showTopFade?: boolean
    showBottomFade?: boolean
  }
>(({ 
  className, 
  fadeHeight = 20,
  showTopFade = true,
  showBottomFade = true,
  children,
  ...props 
}, ref) => (
  <div className="relative">
    <ScrollArea
      ref={ref}
      className={className}
      {...props}
    >
      {children}
    </ScrollArea>
    
    {showTopFade && (
      <div 
        className="absolute top-0 left-0 right-0 pointer-events-none bg-gradient-to-b from-white to-transparent dark:from-neutral-900 z-10"
        style={{ height: `${fadeHeight}px` }}
      />
    )}
    
    {showBottomFade && (
      <div 
        className="absolute bottom-0 left-0 right-0 pointer-events-none bg-gradient-to-t from-white to-transparent dark:from-neutral-900 z-10"
        style={{ height: `${fadeHeight}px` }}
      />
    )}
  </div>
))
FadeScrollArea.displayName = "FadeScrollArea"

export { 
  ScrollArea, 
  ScrollBar,
  ChatScrollArea,
  CodeScrollArea,
  TableScrollArea,
  SidebarScrollArea,
  ModalScrollArea,
  FadeScrollArea,
  scrollAreaVariants,
  scrollBarVariants,
  scrollThumbVariants,
}
