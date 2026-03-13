// components/ui/Button.tsx
// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE BUTTON — Variants: primary, secondary, ghost, danger
// Built with class-variance-authority for type-safe variant props
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export const buttonVariants = cva(
  // Base styles applied to ALL buttons
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-xl font-medium text-sm",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "select-none cursor-pointer",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-indigo-500 text-white",
          "hover:bg-indigo-600 active:scale-[0.97]",
          "shadow-sm shadow-indigo-200 dark:shadow-indigo-900/40",
          "focus-visible:ring-indigo-500",
        ],
        secondary: [
          "bg-surface border border-theme text-fore",
          "hover:bg-surface-2 active:scale-[0.97]",
          "focus-visible:ring-indigo-500",
        ],
        ghost: [
          "text-fore-2 hover:bg-surface-2 hover:text-fore",
          "active:scale-[0.97]",
        ],
        danger: [
          "bg-red-500 text-white",
          "hover:bg-red-600 active:scale-[0.97]",
          "shadow-sm shadow-red-200 dark:shadow-red-900/40",
          "focus-visible:ring-red-500",
        ],
        gradient: [
          "bg-gradient-to-r from-indigo-500 to-violet-500 text-white",
          "hover:from-indigo-600 hover:to-violet-600 active:scale-[0.97]",
          "shadow-md shadow-indigo-200/60 dark:shadow-indigo-900/40",
          "focus-visible:ring-indigo-500",
        ],
      },
      size: {
        sm: "h-8  px-3 text-xs rounded-lg",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-base rounded-2xl",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
