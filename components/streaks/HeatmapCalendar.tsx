"use client"

// components/streaks/HeatmapCalendar.tsx
// ─────────────────────────────────────────────────────────────────────────────
// 12-WEEK HEATMAP — Shows daily habit completion as a colour grid
// Green = DONE, Red = SKIPPED, Empty = no log
// ─────────────────────────────────────────────────────────────────────────────

import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import type { HeatmapDay } from "@/types"

interface HeatmapCalendarProps {
  data: HeatmapDay[]
  color: string           // habit color for DONE cells
}

const DAYS = ["Mon", "Wed", "Fri"]
const WEEKS = 12

export function HeatmapCalendar({ data, color }: HeatmapCalendarProps) {
  // Split flat array into columns of 7 (one per week)
  const weeks: HeatmapDay[][] = []
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7))
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-1 min-w-0">
        {/* Day labels on the left */}
        <div className="flex flex-col gap-1 mr-1 pt-5">
          {["", "Mon", "", "Wed", "", "Fri", ""].map((label, i) => (
            <div
              key={i}
              className="h-3 w-6 text-[9px] text-fore-3 flex items-center"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Week columns */}
        <div className="flex flex-col gap-1">
          {/* Month labels at top */}
          <div className="flex gap-1 mb-1">
            {weeks.map((week, wi) => {
              const firstDay = week[0]?.date
              const label =
                firstDay && new Date(firstDay).getDate() <= 7
                  ? format(parseISO(firstDay), "MMM")
                  : ""
              return (
                <div
                  key={wi}
                  className="w-3 text-[9px] text-fore-3 truncate"
                >
                  {label}
                </div>
              )
            })}
          </div>

          {/* Grid rows — one row per day of week */}
          {Array.from({ length: 7 }, (_, dayOfWeek) => (
            <div key={dayOfWeek} className="flex gap-1">
              {weeks.map((week, wi) => {
                const cell = week[dayOfWeek]
                if (!cell) {
                  return <div key={wi} className="w-3 h-3" />
                }

                const isDone = cell.status === "DONE"
                const isSkipped = cell.status === "SKIPPED"
                const isEmpty = !cell.status
                const isToday = cell.date === format(new Date(), "yyyy-MM-dd")

                return (
                  <div
                    key={wi}
                    title={`${cell.date}: ${cell.status ?? "no log"}`}
                    className={cn(
                      "w-3 h-3 rounded-[2px] transition-all duration-200",
                      "hover:scale-125 cursor-default",
                      isToday && "ring-1 ring-offset-1 ring-indigo-400",
                      isEmpty && "bg-slate-100 dark:bg-slate-800"
                    )}
                    style={
                      isDone
                        ? { backgroundColor: color, opacity: 0.9 }
                        : isSkipped
                        ? { backgroundColor: "#ef4444", opacity: 0.4 }
                        : undefined
                    }
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-3 text-[10px] text-fore-3">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-[2px] bg-slate-100 dark:bg-slate-800" />
          No log
        </div>
        <div className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded-[2px]"
            style={{ backgroundColor: color, opacity: 0.9 }}
          />
          Done
        </div>
        <div className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded-[2px]"
            style={{ backgroundColor: "#ef4444", opacity: 0.4 }}
          />
          Skipped
        </div>
      </div>
    </div>
  )
}
