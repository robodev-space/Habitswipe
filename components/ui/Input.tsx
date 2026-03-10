// components/ui/Input.tsx
// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE INPUT — With label, error, and icon support
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-")

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-fore-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fore-3">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full h-11 rounded-xl px-3 text-sm",
              "bg-surface border border-theme text-fore",
              "placeholder:text-fore-3",
              "transition-all duration-150",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              leftIcon && "pl-9",
              error && "border-red-400 focus:ring-red-500/30 focus:border-red-400",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-fore-3">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"
