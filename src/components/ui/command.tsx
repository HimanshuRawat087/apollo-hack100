"use client"

import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-lg bg-white text-neutral-900 shadow-xl border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

interface CommandDialogProps extends DialogProps {
  commandProps?: React.ComponentPropsWithoutRef<typeof CommandPrimitive>
}

const CommandDialog = ({ children, commandProps, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl max-w-2xl border-neutral-200 dark:border-neutral-700 bg-transparent">
        <div className="bg-gradient-to-br from-white via-white to-blueberry-25 dark:from-neutral-800 dark:via-neutral-800 dark:to-neutral-750 rounded-lg overflow-hidden">
          <Command 
            className="border-none shadow-none bg-transparent [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:overline [&_[cmdk-group-heading]]:text-blueberry-600 [&_[cmdk-group-heading]]:dark:text-blueberry-400 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-14 [&_[cmdk-item]]:px-4 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
            {...commandProps}
          >
            {children}
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> & {
    icon?: React.ReactNode
    showSparkles?: boolean
  }
>(({ className, icon, showSparkles = false, ...props }, ref) => (
  <div className="flex items-center border-b border-neutral-200 dark:border-neutral-700 px-4 py-2 bg-gradient-to-r from-transparent to-blueberry-25/50 dark:to-blueberry-950/20" cmdk-input-wrapper="">
    {icon || <Search className="mr-3 h-5 w-5 shrink-0 text-blueberry-500 dark:text-blueberry-400" />}
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-md bg-transparent py-3 body-text outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
    {showSparkles && (
      <Sparkles className="ml-2 h-4 w-4 text-blueberry-400 animate-pulse" />
    )}
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-80 overflow-y-auto overflow-x-hidden px-2 pb-2", className)}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty> & {
    icon?: React.ReactNode
    title?: string
    description?: string
  }
>(({ className, icon, title, description, children, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className={cn("py-12 text-center", className)}
    {...props}
  >
    {children || (
      <div className="flex flex-col items-center gap-3">
        {icon && (
          <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
            {icon}
          </div>
        )}
        <div className="space-y-1">
          <p className="subtitle text-neutral-900 dark:text-neutral-100">
            {title || "No results found"}
          </p>
          {description && (
            <p className="body-text text-neutral-600 dark:text-neutral-400">
              {description}
            </p>
          )}
        </div>
      </div>
    )}
  </CommandPrimitive.Empty>
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden py-2 text-foreground [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:overline [&_[cmdk-group-heading]]:text-blueberry-600 [&_[cmdk-group-heading]]:dark:text-blueberry-400",
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("mx-2 h-px bg-neutral-200 dark:bg-neutral-700 my-2", className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> & {
    icon?: React.ReactNode
    shortcut?: string
    badge?: React.ReactNode
    description?: string
  }
>(({ className, icon, shortcut, badge, description, children, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex items-center gap-3 rounded-lg px-4 py-3 body-text cursor-pointer select-none outline-none transition-all duration-200",
      "hover:bg-blueberry-50 hover:text-blueberry-900 dark:hover:bg-blueberry-950 dark:hover:text-blueberry-100",
      "aria-selected:bg-blueberry-100 aria-selected:text-blueberry-900 dark:aria-selected:bg-blueberry-900 dark:aria-selected:text-blueberry-100",
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
      "group",
      className
    )}
    {...props}
  >
    {icon && (
      <div className="w-5 h-5 flex items-center justify-center text-neutral-500 group-aria-selected:text-blueberry-600 dark:group-aria-selected:text-blueberry-400 transition-colors">
        {icon}
      </div>
    )}
    
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="truncate">{children}</span>
        {badge}
      </div>
      {description && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
          {description}
        </p>
      )}
    </div>

    {shortcut && (
      <CommandShortcut>{shortcut}</CommandShortcut>
    )}
  </CommandPrimitive.Item>
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "ml-auto px-2 py-1 text-xs tracking-wider text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-700 rounded border font-mono group-aria-selected:bg-blueberry-200 dark:group-aria-selected:bg-blueberry-800 group-aria-selected:text-blueberry-700 dark:group-aria-selected:text-blueberry-300 transition-colors",
        className
      )}
      {...props}
    />
  )
})
CommandShortcut.displayName = "CommandShortcut"

// Preset Command Components
const CommandQuickActions = React.forwardRef<
  React.ElementRef<typeof CommandGroup>,
  React.ComponentPropsWithoutRef<typeof CommandGroup> & {
    actions?: Array<{
      icon: React.ReactNode
      label: string
      shortcut?: string
      onSelect: () => void
    }>
  }
>(({ actions = [], ...props }, ref) => (
  <CommandGroup ref={ref} heading="Quick Actions" {...props}>
    {actions.map((action, index) => (
      <CommandItem
        key={index}
        icon={action.icon}
        shortcut={action.shortcut}
        onSelect={action.onSelect}
      >
        {action.label}
      </CommandItem>
    ))}
  </CommandGroup>
))
CommandQuickActions.displayName = "CommandQuickActions"

const CommandSearchResults = React.forwardRef<
  React.ElementRef<typeof CommandGroup>,
  React.ComponentPropsWithoutRef<typeof CommandGroup> & {
    results?: Array<{
      icon?: React.ReactNode
      title: string
      description?: string
      badge?: React.ReactNode
      onSelect: () => void
    }>
    emptyMessage?: string
  }
>(({ results = [], emptyMessage = "No results found", ...props }, ref) => (
  <CommandGroup ref={ref} heading="Search Results" {...props}>
    {results.length === 0 ? (
      <CommandEmpty>
        <div className="text-neutral-500 dark:text-neutral-400 py-4">
          {emptyMessage}
        </div>
      </CommandEmpty>
    ) : (
      results.map((result, index) => (
        <CommandItem
          key={index}
          icon={result.icon}
          badge={result.badge}
          description={result.description}
          onSelect={result.onSelect}
        >
          {result.title}
        </CommandItem>
      ))
    )}
  </CommandGroup>
))
CommandSearchResults.displayName = "CommandSearchResults"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
  CommandQuickActions,
  CommandSearchResults,
}
