"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import { PanelLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

// Constants
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_COLLAPSED = "4rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

// Types
type SidebarContext = {
  isOpen: boolean;
  isMobile: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
};

// Context
const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

// Provider Component
const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
  }
>(({ defaultOpen = true, className, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const [isMobile, setIsMobile] = React.useState(false);

  // Mobile detection
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Keyboard shortcut (Cmd/Ctrl + B)
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const contextValue = React.useMemo<SidebarContext>(
    () => ({
      isOpen,
      isMobile,
      toggle: () => setIsOpen((prev) => !prev),
      close: () => setIsOpen(false),
      open: () => setIsOpen(true),
    }),
    [isOpen, isMobile]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        ref={ref}
        className={cn("flex min-h-screen w-full", className)}
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-collapsed": SIDEBAR_WIDTH_COLLAPSED,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
});
SidebarProvider.displayName = "SidebarProvider";

// Sidebar Component
const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    collapsible?: boolean;
  }
>(({ collapsible = true, className, children, ...props }, ref) => {
  const { isOpen, isMobile, close } = useSidebar();

  // Mobile: Sheet overlay
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={close}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={cn(
            "fixed left-0 top-0 z-50 h-screen w-72 transform transition-transform duration-300",
            "bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700 shadow-2xl",
            isOpen ? "translate-x-0" : "-translate-x-full",
            className
          )}
        >
          <div className="flex h-full flex-col">{children}</div>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div
      ref={ref}
      className={cn(
        "fixed left-0 top-0 z-30 h-screen transition-all duration-300 ease-in-out",
        "bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700",
        collapsible
          ? isOpen
            ? "w-[--sidebar-width]"
            : "w-[--sidebar-width-collapsed]"
          : "w-[--sidebar-width]",
        className
      )}
      {...props}
    >
      <div className="flex h-full flex-col">{children}</div>
    </div>
  );
});
Sidebar.displayName = "Sidebar";

// Toggle Button
const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggle } = useSidebar();

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon-sm"
      className={cn(
        "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100",
        className
      )}
      onClick={(event) => {
        onClick?.(event);
        toggle();
      }}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

// Main Content Area
const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  const { isOpen, isMobile } = useSidebar();

  return (
    <main
      ref={ref}
      className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        !isMobile &&
          (isOpen ? "ml-[--sidebar-width]" : "ml-[--sidebar-width-collapsed]"),
        className
      )}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent";

// Header Section
const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { isOpen, isMobile } = useSidebar();
  const isCollapsed = !isOpen && !isMobile;

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-3 p-4 border-b border-neutral-200 dark:border-neutral-700",
        isCollapsed && "justify-center",
        className
      )}
      {...props}
    />
  );
});
SidebarHeader.displayName = "SidebarHeader";

// Navigation Section
const SidebarNav = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <nav
      ref={ref}
      className={cn("flex-1 overflow-y-auto p-4 space-y-2", className)}
      {...props}
    />
  );
});
SidebarNav.displayName = "SidebarNav";

// Footer Section
const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "p-4 border-t border-neutral-200 dark:border-neutral-700",
        className
      )}
      {...props}
    />
  );
});
SidebarFooter.displayName = "SidebarFooter";

// Navigation Item Variants
const sidebarNavItemVariants = cva(
  "flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200 body-text group relative",
  {
    variants: {
      variant: {
        default:
          "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800",
        active:
          "bg-blueberry-100 text-blueberry-900 dark:bg-blueberry-950 dark:text-blueberry-100 font-medium",
      },
      size: {
        sm: "h-8 px-2 text-sm gap-2",
        default: "h-10 px-3",
        lg: "h-12 px-4 text-base gap-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const SidebarNavItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof sidebarNavItemVariants> & {
      asChild?: boolean;
      icon?: React.ReactNode;
      badge?: React.ReactNode;
      href?: string;
      active?: boolean;
    }
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      icon,
      badge,
      href,
      active = false,
      children,
      ...props
    },
    ref
  ) => {
    const { isOpen, isMobile } = useSidebar();
    const isCollapsed = !isOpen && !isMobile;
    const actualVariant = active ? "active" : variant;

    const Component = asChild ? Slot : href ? "a" : "button";
    const componentProps = href ? { href } : props;

    return (
      <Component
        ref={ref}
        className={cn(
          sidebarNavItemVariants({ variant: actualVariant, size }),
          isCollapsed && "justify-center px-3",
          className
        )}
        {...componentProps}
      >
        {/* Icon */}
        {icon && (
          <span className="flex-shrink-0 text-current">
            {React.cloneElement(icon as React.ReactElement, {
              className: "w-5 h-5",
            })}
          </span>
        )}

        {/* Label - hidden when collapsed */}
        {(!isCollapsed || isMobile) && (
          <>
            <span className="truncate text-sm font-medium">{children}</span>
            {badge && (
              <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400">
                {badge}
              </span>
            )}
          </>
        )}

        {/* Tooltip for collapsed state */}
        {isCollapsed && !isMobile && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
            {children}
          </div>
        )}
      </Component>
    );
  }
);
SidebarNavItem.displayName = "SidebarNavItem";

// Close button for mobile
const SidebarClose = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { close, isMobile } = useSidebar();

  if (!isMobile) return null;

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon-sm"
      className={cn("absolute top-4 right-4", className)}
      onClick={close}
      {...props}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close Sidebar</span>
    </Button>
  );
});
SidebarClose.displayName = "SidebarClose";

// Separator Component
const SidebarSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "mx-4 my-2 h-px bg-neutral-200 dark:bg-neutral-700",
        className
      )}
      {...props}
    />
  );
});
SidebarSeparator.displayName = "SidebarSeparator";

// Group Component
const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    title?: string;
  }
>(({ className, title, children, ...props }, ref) => {
  const { isOpen, isMobile } = useSidebar();
  const isCollapsed = !isOpen && !isMobile;

  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      {title && (!isCollapsed || isMobile) && (
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}
      {children}
    </div>
  );
});
SidebarGroup.displayName = "SidebarGroup";

// Export all components
export {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarNav,
  SidebarNavItem,
  SidebarFooter,
  SidebarClose,
  SidebarSeparator,
  SidebarGroup,
  useSidebar,
  sidebarNavItemVariants,
};

// Export types
export type { SidebarContext };