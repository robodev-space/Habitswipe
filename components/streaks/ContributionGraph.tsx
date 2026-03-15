"use client"

import { useMemo } from "react"
import { format, startOfYear, endOfYear, eachDayOfInterval, isSameMonth, startOfMonth } from "date-fns"
import { cn } from "@/lib/utils"

interface ContributionGraphProps {
  data: { date: string; count: number }[]
}

export function ContributionGraph({ data }: ContributionGraphProps) {
  // Map data for quick lookup
  const dataMap = useMemo(() => {
    return new Map(data.map((d) => [d.date, d.count]))
  }, [data])

  // Get color based on count - Multi-color ramp for variety
  const getColor = (count: number) => {
    if (count === 0) return "bg-slate-100 dark:bg-slate-800"
    if (count === 1) return "bg-emerald-400 dark:bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
    if (count === 2) return "bg-indigo-500 dark:bg-indigo-700 shadow-[0_0_10px_rgba(99,102,241,0.2)]"
    if (count === 3) return "bg-violet-600 dark:bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
    return "bg-fuchsia-600 dark:bg-fuchsia-500 shadow-[0_0_12px_rgba(192,38,211,0.4)]"
  }

  // Generate grid: 7 rows (Mon-Sun) x 53 columns
  // We'll align it so each column is a week
  const days = useMemo(() => {
    // We want the last 365 days available in 'data'
    // But for a nice grid, we can just use the data array itself if it's ordered
    return data
  }, [data])

  // To group by weeks (columns), we need to know which week each day belongs to
  const weeks = useMemo(() => {
    const w: { date: string; count: number }[][] = []
    let currentWeek: { date: string; count: number }[] = []

    // Find the day of week for the first day to pad correctly if needed
    // But since the API gives a continuous sequence, we can just chunk every 7
    days.forEach((day, i) => {
      currentWeek.push(day)
      if (currentWeek.length === 7 || i === days.length - 1) {
        w.push(currentWeek)
        currentWeek = []
      }
    })
    return w
  }, [days])

  // Month labels (placed above columns where the month changes)
  const monthLabels = useMemo(() => {
    const labels: { index: number; label: string }[] = []
    let lastMonth = ""

    weeks.forEach((week, i) => {
      const firstDay = new Date(week[0].date)
      const monthName = format(firstDay, "MMM")
      if (monthName !== lastMonth) {
        labels.push({ index: i, label: monthName })
        lastMonth = monthName
      }
    })
    return labels
  }, [weeks])

  return (
    <div className="bg-surface border border-theme rounded-3xl p-4 md:p-8 card-shadow overflow-x-auto">
      <h3 className="text-base font-semibold text-fore mb-8">Yearly Consistency</h3>
      
      <div className="w-full">
        {/* Month Labels */}
        <div className="flex text-[11px] font-medium text-fore-3 mb-3 ml-10 h-4 relative">
          {monthLabels.map((m) => (
            <div 
              key={`${m.label}-${m.index}`}
              className="absolute"
              style={{ left: `${m.index * 17}px` }}
            >
              {m.label}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {/* Day Labels */}
          <div className="flex flex-col gap-[9px] text-[10px] font-medium text-fore-3 pr-2 pt-[3px]">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* The Grid */}
          <div className="flex gap-[4px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[4px]">
                {week.map((day) => (
                  <div
                    key={day.date}
                    title={`${day.date}: ${day.count} habits`}
                    className={cn(
                      "w-[13px] h-[13px] rounded-[3px] transition-all duration-200 hover:scale-125 hover:z-10 cursor-pointer shadow-sm",
                      getColor(day.count)
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-fore-3">
          <span>Less</span>
          <div className="w-[10px] h-[10px] rounded-[2px] bg-slate-100 dark:bg-slate-800" />
          <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-400 dark:bg-emerald-600" />
          <div className="w-[10px] h-[10px] rounded-[2px] bg-indigo-500 dark:bg-indigo-700" />
          <div className="w-[10px] h-[10px] rounded-[2px] bg-violet-600 dark:bg-violet-500" />
          <div className="w-[10px] h-[10px] rounded-[2px] bg-fuchsia-600 dark:bg-fuchsia-500" />
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
