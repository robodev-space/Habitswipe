"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"

// Simple chart container to match the user's provided snippet style
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: any
    children: React.ReactElement
  }
>(({ className, children, config, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-area]:fill-primary/10 [&_.recharts-curve.recharts-area]:stroke-primary [&_.recharts-dot]:stroke-primary [&_.recharts-dot]:fill-background [&_.recharts-pie-label-line]:stroke-muted-foreground [&_.recharts-sector]:stroke-background [&_.recharts-sector:focus]:outline-none [&_.recharts-surface]:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = RechartsPrimitive.Tooltip

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<string, string> }
  )
>

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
  }
>(({ active, payload, className, hideLabel, hideIndicator, indicator = "dot", label, labelKey, nameKey }, ref) => {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-theme bg-surface px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {!hideLabel && (
        <div className="font-medium text-fore">{label as string}</div>
      )}
      <div className="grid gap-1.5">
        {payload.map((item: any, index: number) => (
          <div
            key={index}
            className="flex flex-1 items-center justify-between gap-2"
          >
            <div className="flex items-center gap-1.5">
              {!hideIndicator && (
                <div
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    indicator === "dot" && "bg-current",
                    indicator === "line" && "w-1",
                    indicator === "dashed" && "border-b border-dashed"
                  )}
                  style={{ backgroundColor: item.color }}
                />
              )}
              <span className="text-fore-2">
                {item.name || item.dataKey}
              </span>
            </div>
            <span className="font-mono font-medium text-fore tabular-nums">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

export { ChartContainer, ChartTooltip, ChartTooltipContent }
