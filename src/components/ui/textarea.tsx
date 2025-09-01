import * as React from 'react'
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, Check } from "lucide-react"

import { cn } from '@/lib/utils'

const textareaVariants = cva(
  "flex w-full rounded-lg border bg-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-neutral-400 resize-none",
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
        sm: "min-h-20 px-3 py-2 text-sm",
        default: "min-h-24 px-3 py-2 text-sm",
        lg: "min-h-32 px-4 py-3 text-base",
        xl: "min-h-40 px-5 py-4 text-lg",
      },
      
      rounded: {
        default: "rounded-lg",
        sm: "rounded-md",
        lg: "rounded-xl",
        none: "rounded-none",
      },
      
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
      resize: "vertical",
    },
  }
)

export interface TextareaProps
  extends Omit<React.ComponentProps<'textarea'>, 'size'>,
    VariantProps<typeof textareaVariants> {
  label?: string
  description?: string
  error?: string
  success?: string
  minLength?: number
  maxLength?: number
  showCount?: boolean
  autoResize?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant, 
    size, 
    rounded,
    resize,
    label,
    description,
    error,
    success,
    minLength,
    maxLength,
    showCount = false,
    autoResize = false,
    value,
    onChange,
    disabled,
    ...props 
  }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const [charCount, setCharCount] = React.useState(0)
    
    // Combine refs
    React.useImperativeHandle(ref, () => textareaRef.current!)
    
    // Auto-resize functionality
    const adjustHeight = React.useCallback(() => {
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }
    }, [autoResize])
    
    // Handle value changes
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      setCharCount(newValue.length)
      
      if (maxLength && newValue.length > maxLength) {
        return
      }
      
      onChange?.(e)
      
      // Auto-resize after state update
      if (autoResize) {
        setTimeout(adjustHeight, 0)
      }
    }
    
    // Initialize character count
    React.useEffect(() => {
      if (value) {
        setCharCount(value.toString().length)
      }
    }, [value])
    
    // Auto-resize on mount and value changes
    React.useEffect(() => {
      if (autoResize) {
        adjustHeight()
      }
    }, [adjustHeight, value])
    
    // Determine the actual variant based on state
    const isOverLimit = maxLength && charCount > maxLength;
    const isUnderLimit = minLength && charCount < minLength;
    const isInvalid = isOverLimit || isUnderLimit;

    const actualVariant = isInvalid ? "error" : error ? "error" : success ? "success" : variant;

    return (
      <div className="space-y-2">
        {label && (
          <label className="subtitle text-neutral-700 dark:text-neutral-300">
            {label}
          </label>
        )}
        
        <div className="relative">
          <textarea
            ref={textareaRef}
            className={cn(
              textareaVariants({ variant: actualVariant, size, rounded, resize: autoResize ? "none" : resize }),
              showCount && "pb-8",
              className
            )}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            maxLength={maxLength}
            {...props}
          />
          
          {showCount && (
            <div className="absolute bottom-2 right-3 flex items-center gap-2">
              <span className={cn(
                "text-xs tabular-nums",
                isInvalid ? "text-error-600 dark:text-error-400" : "text-neutral-500 dark:text-neutral-400"
              )}>
                {charCount}
                {(minLength || maxLength) && '/'}
                {minLength && `${minLength}-`}
                {maxLength && maxLength}
              </span>
              
              {success && (
                <Check className="h-4 w-4 text-success-500" />
              )}
              
              {error && (
                <AlertCircle className="h-4 w-4 text-error-500" />
              )}
            </div>
          )}
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
Textarea.displayName = 'Textarea'

// Specialized Textarea Components
const CommentTextarea = React.forwardRef<
  HTMLTextAreaElement,
  Omit<TextareaProps, 'variant' | 'size'> & {
    onSubmit?: () => void
    onCancel?: () => void
    submitText?: string
    cancelText?: string
    loading?: boolean
  }
>(({ 
  onSubmit, 
  onCancel, 
  submitText = "Comment", 
  cancelText = "Cancel",
  loading = false,
  className,
  ...props 
}, ref) => (
  <div className="space-y-3">
    <Textarea
      ref={ref}
      variant="filled"
      size="default"
      placeholder="Write a comment..."
      className={className}
      {...props}
    />
    
    <div className="flex items-center justify-end gap-2">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="btn-secondary"
        >
          {cancelText}
        </button>
      )}
      
      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="btn-primary"
      >
        {loading ? 'Posting...' : submitText}
      </button>
    </div>
  </div>
))
CommentTextarea.displayName = "CommentTextarea"

const CodeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  Omit<TextareaProps, 'variant'>
>(({ className, ...props }, ref) => (
  <Textarea
    ref={ref}
    variant="filled"
    className={cn("font-mono text-sm", className)}
    {...props}
  />
))
CodeTextarea.displayName = "CodeTextarea"

const NoteTextarea = React.forwardRef<
  HTMLTextAreaElement,
  Omit<TextareaProps, 'variant' | 'autoResize'> & {
    timestamp?: string
  }
>(({ timestamp, className, ...props }, ref) => (
  <div className="space-y-2">
    <Textarea
      ref={ref}
      variant="ghost"
      autoResize
      placeholder="Add a note..."
      className={cn("min-h-16", className)}
      {...props}
    />
    
    {timestamp && (
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        {timestamp}
      </p>
    )}
  </div>
))
NoteTextarea.displayName = "NoteTextarea"

const FeedbackTextarea = React.forwardRef<
  HTMLTextAreaElement,
  Omit<TextareaProps, 'variant' | 'size'> & {
    rating?: number
    onRatingChange?: (rating: number) => void
  }
>(({ rating, onRatingChange, className, ...props }, ref) => (
  <div className="space-y-4">
    {onRatingChange && (
      <div className="flex items-center gap-2">
        <span className="body-text text-neutral-700 dark:text-neutral-300">Rating:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRatingChange(star)}
              className={cn(
                "p-1 rounded transition-colors",
                star <= (rating || 0) 
                  ? "text-warning-500" 
                  : "text-neutral-300 dark:text-neutral-600 hover:text-warning-400"
              )}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    )}
    
    <Textarea
      ref={ref}
      variant="outline"
      size="lg"
      placeholder="Share your feedback..."
      maxLength={500}
      showCount
      className={className}
      {...props}
    />
  </div>
))
FeedbackTextarea.displayName = "FeedbackTextarea"

export { 
  Textarea, 
  CommentTextarea,
  CodeTextarea,
  NoteTextarea,
  FeedbackTextarea,
  textareaVariants,
}
