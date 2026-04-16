"use client"

import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { API_ROUTES } from "@/lib/constants/api-routes"
import type { AnalyticsStats } from "@/types"

export default function StatsPage() {
  const [data, setData] = useState<AnalyticsStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"Month" | "Year">("Month")

  useEffect(() => {
    const controller = new AbortController()

    setIsLoading(true)
    fetch(`${API_ROUTES.STATS.BASE}?period=${filter.toLowerCase()}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((json) => {
        if (json.data?.analytics) {
          setData(json.data.analytics)
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return
        console.error("Stats fetch error:", err)
      })
      .finally(() => setIsLoading(false))

    return () => controller.abort()
  }, [filter])

  if (isLoading) {
    return (
      <div className="tab active" id="tab-stats">
        {/* Header Skeleton */}
        <div className="skeleton-header">
          <div className="skel-hdr-left">
            <div className="skel-date"></div>
            <div className="skel-title"></div>
          </div>
          <div className="skel-btn"></div>
        </div>

        {/* Big 4 Skeletons */}
        <div className="big4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bc relative overflow-hidden">
              <div className="shimmer-sweep absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent animate-shimmer"></div>
              <div className="bc-lbl w-3/4 h-3 bg-surf2 rounded mb-3"></div>
              <div className="bc-val w-1/2 h-8 bg-surf2 rounded mb-2"></div>
              <div className="bc-sub w-2/3 h-3 bg-surf2 rounded"></div>
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="skeleton-chart">
          <div className="skel-chart-h"></div>
          <div className="skel-bars">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} className="skel-bar" style={{ height: `${Math.random() * 60 + 20}%` }}></div>
            ))}
          </div>
        </div>

        {/* Donut Skeletons */}
        <div className="donuts">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton-donut">
              <div className="skel-donut-circle"></div>
              <div className="skel-donut-txt">
                <div className="skel-donut-v"></div>
                <div className="skel-donut-l"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderTrend = (val: number, isPercent = true) => {
    const isUp = val >= 0
    return (
      <div className={`trend ${isUp ? 'up' : 'dn'}`}>
        {isUp ? "↑" : "↓"} {isUp ? "+" : ""}{val}{isPercent ? "%" : ""} vs last {filter.toLowerCase()}
      </div>
    )
  }

  // Calculate chart bar heights
  const maxCompletions = Math.max(...(data?.chartData ?? [1]), 1)

  return (
    <div className="tab active skeleton-loaded" id="tab-stats">
      {/* Header */}
      <div className="ph">
        <div>
          <div className="pd">Analytics</div>
          <div className="pt">Your <em>progress</em> story</div>
          <div className="ps">{data?.periodLabel} · all habits</div>
        </div>
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          <div
            className={`pill ${filter === "Month" ? "on" : "off"}`}
            onClick={() => setFilter("Month")}
            style={{ padding: "7px 14px" }}
          >
            Month
          </div>
          <div
            className={`pill ${filter === "Year" ? "on" : "off"}`}
            onClick={() => setFilter("Year")}
            style={{ padding: "7px 14px" }}
          >
            Year
          </div>
        </div>
      </div>

      {/* Big 4 */}
      <div className="big4">
        <div className="bc">
          <div className="bc-lbl">Completion rate</div>
          <div className="bc-val">{data?.completionRate}%</div>
          <div className="bc-sub">of all habits this {filter.toLowerCase()}</div>
          {renderTrend(data?.completionRateTrend ?? 0)}
        </div>
        <div className="bc">
          <div className="bc-lbl">Total check-ins</div>
          <div className="bc-val">{data?.totalCheckIns}</div>
          <div className="bc-sub">across {data?.habitPerformance?.length} habits</div>
          {renderTrend(data?.totalCheckInsTrend ?? 0, false)}
        </div>
        <div className="bc">
          <div className="bc-lbl">Perfect days</div>
          <div className="bc-val">{data?.perfectDays}</div>
          <div className="bc-sub">all habits completed</div>
          {renderTrend(data?.perfectDaysTrend ?? 0, false)}
        </div>
        <div className="bc">
          <div className="bc-lbl">Longest streak</div>
          <div className="bc-val">{data?.longestStreak}d</div>
          <div className="bc-sub">{data?.bestHabitName} habit</div>
          <div className="trend up">All-time record</div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="chart-card" style={{ marginBottom: 10 }}>
        <div className="chart-head">
          <div className="chart-title">
            {filter === 'Month' ? 'Daily completions — this week' : 'Monthly completions — this year'}
          </div>
          <div className="chart-sub">Habits per {filter === 'Month' ? 'day' : 'month'}</div>
        </div>
        <div className="bars">
          {data?.chartLabels?.map((label, i) => {
            const val = data?.chartData?.[i] ?? 0
            const height = (val / maxCompletions) * 100
            
            // Highlight today/current month
            let isCurrent = false
            if (filter === 'Month') {
              isCurrent = new Date().getDay() === (i === 6 ? 0 : i + 1)
            } else {
              isCurrent = new Date().getMonth() === i
            }

            return (
              <div key={label} className="bar-col">
                <div
                  className="bar-fill"
                  style={{
                    height: `${Math.max(height, 5)}%`,
                    background: isCurrent ? "var(--ind)" : "var(--ind-m)",
                    borderRadius: "4px 4px 0 0",
                    opacity: val === 0 ? 0.2 : 1
                  }}
                />
                <div className="bar-lbl">{label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Donuts */}
      <div className="donuts">
        <div className="donut-c">
          <svg width="52" height="52" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="20" fill="none" stroke="var(--ind-s)" strokeWidth="8" />
            <circle cx="26" cy="26" r="20" fill="none" stroke="var(--ind)" strokeWidth="8" strokeDasharray="125.6" strokeDashoffset={125.6 * (1 - (data?.overallRate ?? 0) / 100)} strokeLinecap="round" transform="rotate(-90 26 26)" />
          </svg>
          <div><div className="dv" style={{ color: "var(--ind)" }}>{data?.overallRate}%</div><div className="dl">Overall rate</div></div>
        </div>
        <div className="donut-c">
          <svg width="52" height="52" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="20" fill="none" stroke="var(--org-s)" strokeWidth="8" />
            <circle cx="26" cy="26" r="20" fill="none" stroke="var(--org)" strokeWidth="8" strokeDasharray="125.6" strokeDashoffset={125.6 * (1 - (data?.morningRate ?? 0) / 100)} strokeLinecap="round" transform="rotate(-90 26 26)" />
          </svg>
          <div><div className="dv" style={{ color: "var(--org)" }}>{data?.morningRate}%</div><div className="dl">Morning habits</div></div>
        </div>
        <div className="donut-c">
          <svg width="52" height="52" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="20" fill="none" stroke="var(--grn-s)" strokeWidth="8" />
            <circle cx="26" cy="26" r="20" fill="none" stroke="var(--grn)" strokeWidth="8" strokeDasharray="125.6" strokeDashoffset={125.6 * (1 - (data?.eveningRate ?? 0) / 100)} strokeLinecap="round" transform="rotate(-90 26 26)" />
          </svg>
          <div><div className="dv" style={{ color: "var(--grn)" }}>{data?.eveningRate}%</div><div className="dl">Evening habits</div></div>
        </div>
        {data?.habitPerformance?.[0] && (
          <div className="donut-c">
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="20" fill="none" stroke="var(--surf2)" strokeWidth="8" />
              <circle cx="26" cy="26" r="20" fill="none" stroke={data.habitPerformance[0].color} strokeWidth="8" strokeDasharray="125.6" strokeDashoffset={125.6 * (1 - data.habitPerformance[0].completionRate / 100)} strokeLinecap="round" transform="rotate(-90 26 26)" />
            </svg>
            <div><div className="dv" style={{ color: data.habitPerformance[0].color }}>{data.habitPerformance[0].completionRate}%</div><div className="dl">{data.habitPerformance[0].name}</div></div>
          </div>
        )}
      </div>

      {/* Perf list */}
      <div className="sh" style={{ marginTop: 10 }}>
        <div className="st">Habit performance</div>
      </div>
      <div className="card">
        <div className="perf-list">
          {data?.habitPerformance?.map(habit => (
            <div className="perf-row" key={habit.id}>
              <div className="perf-name">{habit.icon} {habit.name}</div>
              <div className="perf-track">
                <div className="perf-fill" style={{ width: `${habit.completionRate}%`, background: habit.color }}></div>
              </div>
              <div className="perf-pct" style={{ color: habit.color }}>{habit.completionRate}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
