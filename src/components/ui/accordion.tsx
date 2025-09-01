"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "group rounded-lg border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-blueberry-200 data-[state=open]:shadow-lg data-[state=open]:border-blueberry-300 data-[state=open]:bg-gradient-to-br data-[state=open]:from-white data-[state=open]:to-blueberry-25",
      "dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-blueberry-600 dark:data-[state=open]:border-blueberry-500 dark:data-[state=open]:from-neutral-800 dark:data-[state=open]:to-neutral-750",
      className
    )}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between p-6 subtitle text-left transition-all duration-300 group-hover:text-blueberry-600 group-data-[state=open]:text-blueberry-700",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueberry-500 focus-visible:ring-offset-2 rounded-lg",
        "dark:group-hover:text-blueberry-400 dark:group-data-[state=open]:text-blueberry-300",
        "[&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg]:text-blueberry-600 dark:[&[data-state=open]>svg]:text-blueberry-400",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-5 w-5 shrink-0 text-neutral-500 transition-all duration-300 group-hover:text-blueberry-500 dark:text-neutral-400 dark:group-hover:text-blueberry-400" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden transition-all duration-300 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn(
      "px-6 pb-6 pt-0 body-text text-neutral-700 dark:text-neutral-300",
      className
    )}>
      {children}
    </div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
