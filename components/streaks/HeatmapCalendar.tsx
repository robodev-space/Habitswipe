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
      <div className="flex justify-center min-w-fit">
        <div className="flex gap-1">
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
          <div className="flex flex-col gap-2 flex-1">
            {/* Month labels at top */}
            <div className="flex gap-1.5 mb-2">
              {weeks.map((week, wi) => {
                const firstDay = week[0]?.date
                const label =
                  firstDay && new Date(firstDay).getDate() <= 7
                    ? format(parseISO(firstDay), "MMM")
                    : ""
                return (
                  <div
                    key={wi}
                    className="w-5 text-[10px] font-medium text-fore-3 truncate text-center"
                  >
                    {label}
                  </div>
                )
              })}
            </div>

            {/* Grid rows — one row per day of week */}
            {Array.from({ length: 7 }, (_, dayOfWeek) => (
              <div key={dayOfWeek} className="flex gap-1.5">
                {weeks.map((week, wi) => {
                  const cell = week[dayOfWeek]
                  if (!cell) {
                    return <div key={wi} className="w-5 h-5" />
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
                        "w-5 h-5 rounded-[3px] transition-all duration-300",
                        "hover:scale-125 hover:z-10 cursor-default",
                        isToday && "ring-2 ring-primary ring-offset-2",
                        isEmpty && "bg-[#ebedf0] dark:bg-[#161b22] border border-black/5 dark:border-white/5"
                      )}
                      style={
                        isDone
                          ? { backgroundColor: "#39d353", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)" }
                          : isSkipped
                            ? { backgroundColor: "#f85149", opacity: 0.9 }
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
        <div className="flex items-center gap-6 mt-6 text-[12px] text-fore-3 font-medium">
          <div className="flex items-center gap-2">
            <span className="opacity-70">Less</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded-[2px] bg-[#ebedf0] dark:bg-[#161b22] border border-black/5 dark:border-white/5" />
              <div className="w-4 h-4 rounded-[2px] bg-[#39d353] opacity-30" />
              <div className="w-4 h-4 rounded-[2px] bg-[#39d353] opacity-60" />
              <div className="w-4 h-4 rounded-[2px] bg-[#39d353]" />
            </div>
            <span className="opacity-70">More</span>
          </div>
          <div className="flex items-center gap-2 border-l border-theme pl-6">
            <div
              className="w-4 h-4 rounded-[2px]"
              style={{ backgroundColor: "#f85149", opacity: 0.9 }}
            />
            <span className="opacity-70">Skipped</span>
          </div>
        </div>
    </div>
  </div>
  )
}
