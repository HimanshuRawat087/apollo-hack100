import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronUp, ChevronDown, ArrowUpDown, Check } from "lucide-react"

import { cn } from "@/lib/utils"

const tableVariants = cva(
  "w-full caption-bottom border-collapse",
  {
    variants: {
      variant: {
        default: "text-sm",
        compact: "text-xs",
        comfortable: "text-base",
      },
      
      style: {
        default: "",
        striped: "[&_tbody_tr:nth-child(odd)]:bg-neutral-50 dark:[&_tbody_tr:nth-child(odd)]:bg-neutral-900",
        bordered: "border border-neutral-200 dark:border-neutral-700",
        minimal: "[&_tr]:border-none",
      },
    },
    defaultVariants: {
      variant: "default",
      style: "default",
    },
  }
)

export interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
  stickyHeader?: boolean
  maxHeight?: string
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant, style, stickyHeader = false, maxHeight, ...props }, ref) => (
    <div 
      className={cn(
        "relative w-full overflow-auto rounded-lg border border-neutral-200 dark:border-neutral-700",
        maxHeight && "max-h-[var(--max-height)]"
      )}
      style={maxHeight ? { "--max-height": maxHeight } as React.CSSProperties : undefined}
    >
      <table
        ref={ref}
        className={cn(
          tableVariants({ variant, style }),
          stickyHeader && "[&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10",
          className
        )}
        {...props}
      />
    </div>
  )
)
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead 
    ref={ref} 
    className={cn(
      "bg-neutral-50 dark:bg-neutral-800 [&_tr]:border-b [&_tr]:border-neutral-200 dark:[&_tr]:border-neutral-700",
      className
    )} 
    {...props} 
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      "bg-white dark:bg-neutral-900 [&_tr:last-child]:border-0",
      className
    )}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const tableRowVariants = cva(
  "border-b border-neutral-200 dark:border-neutral-700 transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "hover:bg-neutral-50 dark:hover:bg-neutral-800",
        interactive: "hover:bg-blueberry-50 dark:hover:bg-blueberry-950 cursor-pointer",
        selected: "bg-blueberry-100 dark:bg-blueberry-900 hover:bg-blueberry-200 dark:hover:bg-blueberry-800",
        danger: "hover:bg-error-50 dark:hover:bg-error-950",
        success: "hover:bg-success-50 dark:hover:bg-success-950",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement>,
    VariantProps<typeof tableRowVariants> {
  selected?: boolean
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, variant, selected, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        tableRowVariants({ variant: selected ? "selected" : variant }),
        className
      )}
      data-state={selected ? "selected" : undefined}
      {...props}
    />
  )
)
TableRow.displayName = "TableRow"

const tableHeadVariants = cva(
  "text-left align-middle font-semibold text-neutral-700 dark:text-neutral-300 [&:has([role=checkbox])]:pr-0",
  {
    variants: {
      size: {
        sm: "h-8 px-2 text-xs",
        default: "h-12 px-4 text-sm",
        lg: "h-14 px-6 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement>,
    VariantProps<typeof tableHeadVariants> {
  sortable?: boolean
  sortDirection?: "asc" | "desc" | null
  onSort?: () => void
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, size, sortable, sortDirection, onSort, children, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        tableHeadVariants({ size }),
        sortable && "cursor-pointer select-none hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200",
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable && (
          <div className="ml-auto">
            {sortDirection === "asc" && <ChevronUp className="h-4 w-4 text-blueberry-600 dark:text-blueberry-400" />}
            {sortDirection === "desc" && <ChevronDown className="h-4 w-4 text-blueberry-600 dark:text-blueberry-400" />}
            {sortDirection === null && <ArrowUpDown className="h-4 w-4 text-neutral-400" />}
          </div>
        )}
      </div>
    </th>
  )
)
TableHead.displayName = "TableHead"

const tableCellVariants = cva(
  "align-middle text-neutral-900 dark:text-neutral-100 [&:has([role=checkbox])]:pr-0",
  {
    variants: {
      size: {
        sm: "p-2 text-xs",
        default: "p-4 text-sm",
        lg: "p-6 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement>,
    VariantProps<typeof tableCellVariants> {}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, size, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(tableCellVariants({ size }), className)}
      {...props}
    />
  )
)
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 body-text text-neutral-600 dark:text-neutral-400", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

// Specialized Table Components
const TableCheckbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    indeterminate?: boolean
  }
>(({ className, indeterminate, ...props }, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  
  React.useImperativeHandle(ref, () => inputRef.current!)
  
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = !!indeterminate
    }
  }, [indeterminate])

  return (
    <input
      ref={inputRef}
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border-neutral-300 text-blueberry-600 focus:ring-blueberry-500 dark:border-neutral-600 dark:bg-neutral-800",
        className
      )}
      {...props}
    />
  )
})
TableCheckbox.displayName = "TableCheckbox"

const TableActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200", className)}
    {...props}
  >
    {children}
  </div>
))
TableActions.displayName = "TableActions"

const TableStatus = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    status: "success" | "warning" | "error" | "info" | "neutral"
  }
>(({ className, status, children, ...props }, ref) => {
  const statusConfig = {
    success: "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200",
    warning: "bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200", 
    error: "bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200",
    info: "bg-blueberry-100 text-blueberry-800 dark:bg-blueberry-900 dark:text-blueberry-200",
    neutral: "bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        statusConfig[status],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
TableStatus.displayName = "TableStatus"

const TableEmpty = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & {
    colSpan: number
    icon?: React.ReactNode
    title?: string
    description?: string
  }
>(({ className, colSpan, icon, title = "No data", description = "No data available to display", ...props }, ref) => (
  <tr ref={ref} className={className} {...props}>
    <td colSpan={colSpan} className="py-16 text-center">
      <div className="flex flex-col items-center gap-3">
        {icon && (
          <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
            {icon}
          </div>
        )}
        <div className="space-y-1">
          <p className="subtitle text-neutral-900 dark:text-neutral-100">{title}</p>
          <p className="body-text text-neutral-600 dark:text-neutral-400">{description}</p>
        </div>
      </div>
    </td>
  </tr>
))
TableEmpty.displayName = "TableEmpty"

const TableLoading = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & {
    colSpan: number
    rows?: number
  }
>(({ className, colSpan, rows = 5, ...props }, ref) => (
  <>
    {Array.from({ length: rows }).map((_, index) => (
      <tr key={index} ref={index === 0 ? ref : undefined} className={className} {...props}>
        <td colSpan={colSpan} className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse w-1/2" />
            </div>
          </div>
        </td>
      </tr>
    ))}
  </>
))
TableLoading.displayName = "TableLoading"

const TablePagination = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    page: number
    totalPages: number
    pageSize: number
    totalItems: number
    onPageChange: (page: number) => void
    onPageSizeChange?: (pageSize: number) => void
  }
>(({ 
  className, 
  page, 
  totalPages, 
  pageSize, 
  totalItems, 
  onPageChange, 
  onPageSizeChange,
  ...props 
}, ref) => {
  const startItem = (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, totalItems)

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between px-4 py-3 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-4">
        <p className="body-text text-neutral-600 dark:text-neutral-400">
          Showing {startItem} to {endItem} of {totalItems} results
        </p>
        
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="body-text text-neutral-600 dark:text-neutral-400">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 text-sm border border-neutral-300 dark:border-neutral-600 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  "w-8 h-8 text-sm rounded",
                  pageNum === page
                    ? "bg-blueberry-600 text-white"
                    : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                )}
              >
                {pageNum}
              </button>
            )
          })}
        </div>
        
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 text-sm border border-neutral-300 dark:border-neutral-600 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
})
TablePagination.displayName = "TablePagination"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableCheckbox,
  TableActions,
  TableStatus,
  TableEmpty,
  TableLoading,
  TablePagination,
  tableVariants,
  tableRowVariants,
  tableHeadVariants,
  tableCellVariants,
}
