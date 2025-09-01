// src/components/ui/loading-spinner.tsx
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, RotateCcw, RefreshCw } from 'lucide-react';
import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  "transition-all duration-200",
  {
    variants: {
      variant: {
        default: "text-blueberry-500 dark:text-blueberry-400",
        primary: "text-blueberry-600 dark:text-blueberry-400",
        secondary: "text-neutral-500 dark:text-neutral-400",
        success: "text-success-500 dark:text-success-400",
        warning: "text-warning-500 dark:text-warning-400",
        error: "text-error-500 dark:text-error-400",
        muted: "text-neutral-400 dark:text-neutral-500",
        white: "text-white",
        inherit: "text-current",
      },
      size: {
        xs: "w-3 h-3",
        sm: "w-4 h-4",
        default: "w-6 h-6",
        lg: "w-8 h-8",
        xl: "w-12 h-12",
        "2xl": "w-16 h-16",
        custom: "",
      },
      speed: {
        slow: "",
        default: "",
        fast: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      speed: "default",
    },
  }
);

const containerVariants = cva(
  "flex items-center justify-center",
  {
    variants: {
      layout: {
        inline: "",
        centered: "w-full h-full min-h-[120px]",
        overlay: "absolute inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm z-50",
        fullscreen: "fixed inset-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm z-50",
      },
    },
    defaultVariants: {
      layout: "inline",
    },
  }
);

// Simple Dots Loader
const DotsLoader = ({ 
  size = "default",
  variant = "default",
  className = "" 
}: { 
  size?: "xs" | "sm" | "default" | "lg" | "xl" | "2xl";
  variant?: string;
  className?: string;
}) => {
  const sizeMap = {
    xs: "w-1 h-1",
    sm: "w-1.5 h-1.5", 
    default: "w-2 h-2",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
    "2xl": "w-5 h-5"
  };

  const gapMap = {
    xs: "gap-1",
    sm: "gap-1", 
    default: "gap-1.5",
    lg: "gap-2",
    xl: "gap-2.5",
    "2xl": "gap-3"
  };

  const dotSize = sizeMap[size];
  const gap = gapMap[size];

  const getVariantColor = (variant: string) => {
    switch (variant) {
      case 'primary': return 'bg-blueberry-600 dark:bg-blueberry-400';
      case 'secondary': return 'bg-neutral-500 dark:bg-neutral-400';
      case 'success': return 'bg-success-500 dark:bg-success-400';
      case 'warning': return 'bg-warning-500 dark:bg-warning-400';
      case 'error': return 'bg-error-500 dark:bg-error-400';
      case 'muted': return 'bg-neutral-400 dark:bg-neutral-500';
      case 'white': return 'bg-white';
      default: return 'bg-blueberry-500 dark:bg-blueberry-400';
    }
  };

  const colorClass = getVariantColor(variant);

  return (
    <div className={cn(`flex items-center ${gap}`, className)}>
      <div 
        className={cn(`${dotSize} ${colorClass} rounded-full`)}
        style={{
          animation: 'dotPulse 1.4s ease-in-out infinite',
          animationDelay: '0s'
        }}
      />
      <div 
        className={cn(`${dotSize} ${colorClass} rounded-full`)}
        style={{
          animation: 'dotPulse 1.4s ease-in-out infinite',
          animationDelay: '0.2s'
        }}
      />
      <div 
        className={cn(`${dotSize} ${colorClass} rounded-full`)}
        style={{
          animation: 'dotPulse 1.4s ease-in-out infinite',
          animationDelay: '0.4s'
        }}
      />
    </div>
  );
};

// Circle Spinner
const CircleSpinner = ({ 
  size = "default",
  variant = "default",
  className = "" 
}: { 
  size?: "xs" | "sm" | "default" | "lg" | "xl" | "2xl";
  variant?: string;
  className?: string;
}) => {
  const sizeMap = {
    xs: "w-4 h-4",
    sm: "w-5 h-5",
    default: "w-6 h-6", 
    lg: "w-8 h-8",
    xl: "w-12 h-12",
    "2xl": "w-16 h-16"
  };

  const strokeMap = {
    xs: "2",
    sm: "2",
    default: "2",
    lg: "3", 
    xl: "3",
    "2xl": "4"
  };

  const getVariantColor = (variant: string) => {
    switch (variant) {
      case 'primary': return 'stroke-blueberry-600 dark:stroke-blueberry-400';
      case 'secondary': return 'stroke-neutral-500 dark:stroke-neutral-400';
      case 'success': return 'stroke-success-500 dark:stroke-success-400';
      case 'warning': return 'stroke-warning-500 dark:stroke-warning-400';
      case 'error': return 'stroke-error-500 dark:stroke-error-400';
      case 'muted': return 'stroke-neutral-400 dark:stroke-neutral-500';
      case 'white': return 'stroke-white';
      default: return 'stroke-blueberry-500 dark:stroke-blueberry-400';
    }
  };

  const circleSize = sizeMap[size];
  const strokeWidth = strokeMap[size];
  const colorClass = getVariantColor(variant);

  return (
    <div className={cn(circleSize, className)}>
      <svg 
        className="w-full h-full" 
        viewBox="0 0 50 50"
        style={{
          animation: 'spin 2s linear infinite'
        }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="31.416"
          className={cn(colorClass, "opacity-25")}
        />
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="15.708"
          className={colorClass}
          style={{
            animation: 'dash 1.5s ease-in-out infinite'
          }}
        />
      </svg>
    </div>
  );
};

export interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants>, VariantProps<typeof containerVariants> {
  className?: string;
  iconClassName?: string;
  label?: string;
  description?: string;
  type?: 'dots' | 'circle' | 'icon';
  icon?: 'loader' | 'rotate' | 'refresh';
  size?: VariantProps<typeof spinnerVariants>['size'] | number;
  showLabel?: boolean;
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({
    className,
    iconClassName,
    variant,
    size,
    speed,
    layout,
    label = "Loading",
    description,
    type = 'dots', // Default to dots loader
    icon = 'loader',
    showLabel = false,
    ...props
  }, ref) => {
    const IconComponent = {
      loader: Loader2,
      rotate: RotateCcw,
      refresh: RefreshCw,
    }[icon];

    const isCustomSize = typeof size === 'number';
    const spinnerSize = isCustomSize ? 'custom' : size;

    const getSpeedDuration = (speed?: string) => {
      switch (speed) {
        case 'slow': return '3s';
        case 'fast': return '0.8s';
        default: return '1.5s';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(containerVariants({ layout }), className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          {type === 'dots' && (
            <DotsLoader 
              size={spinnerSize as any}
              variant={variant}
              className={iconClassName}
            />
          )}
          
          {type === 'circle' && (
            <CircleSpinner 
              size={spinnerSize as any}
              variant={variant}
              className={iconClassName}
            />
          )}
          
          {type === 'icon' && IconComponent && (
            <IconComponent
              className={cn(
                spinnerVariants({ variant, size: spinnerSize }),
                iconClassName
              )}
              style={{
                animation: `spin ${getSpeedDuration(speed)} linear infinite`
              }}
              aria-label={label}
            />
          )}
          
          {/* Labels */}
          {(showLabel || description) && (
            <div className="text-center space-y-1">
              {showLabel && (
                <p className={cn(
                  "font-semibold text-neutral-700 dark:text-neutral-300",
                  spinnerSize === 'xs' ? 'text-xs' : 
                  spinnerSize === 'sm' ? 'text-sm' :
                  spinnerSize === 'lg' ? 'text-lg' :
                  spinnerSize === 'xl' ? 'text-xl' :
                  spinnerSize === '2xl' ? 'text-2xl' : 'text-base'
                )}>
                  {label}
                </p>
              )}
              {description && (
                <p className={cn(
                  "text-neutral-600 dark:text-neutral-400",
                  spinnerSize === 'xs' ? 'text-xs' : 
                  spinnerSize === 'sm' ? 'text-xs' :
                  spinnerSize === 'lg' ? 'text-base' :
                  spinnerSize === 'xl' ? 'text-lg' :
                  spinnerSize === '2xl' ? 'text-xl' : 'text-sm'
                )}>
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";

// Add custom CSS animations
const spinnerCSS = `
@keyframes dotPulse {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
`;

// Inject CSS if not already present
if (typeof document !== 'undefined' && !document.getElementById('spinner-css')) {
  const style = document.createElement('style');
  style.id = 'spinner-css';
  style.textContent = spinnerCSS;
  document.head.appendChild(style);
}

// Named export (as used in Apollo Design System)
export { LoadingSpinner };

// Also provide a default export for convenience
export default LoadingSpinner;