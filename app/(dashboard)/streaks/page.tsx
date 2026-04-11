"use client"

import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { API_ROUTES } from "@/lib/constants/api-routes"
import { AddHabitDialog } from "@/components/shared/AddHabitDialog"
import type { StreakPageData } from "@/types"

export default function StreaksPage() {
  const [data, setData] = useState<StreakPageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"month" | "year">("year")

  useEffect(() => {
    const controller = new AbortController()

    fetch(API_ROUTES.STREAKS.BASE, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Failed request")
        return r.json()
      })
      .then((json) => {
        if (json.data) setData(json.data)
      })
      .catch((err) => {
        if (err.name === "AbortError") return
        console.error("Streaks fetch error:", err)
      })
      .finally(() => setIsLoading(false))

    return () => controller.abort()
  }, [])

  if (isLoading) {
    return (
      <div className="tab active" id="tab-streaks">
        {/* Header Skeleton */}
        <div className="skeleton-header">
          <div className="skel-hdr-left">
            <div className="skel-date"></div>
            <div className="skel-title"></div>
          </div>
          <div className="skel-btn"></div>
        </div>

        {/* Hero Skeleton */}
        <div className="skeleton-streak-hero">
          <div className="skel-sh-big"></div>
          <div className="skel-sh-sub"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="skeleton-stats">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="skel-stat">
              <div className="skel-ico"></div>
              <div className="skel-val"></div>
              <div className="skel-lbl"></div>
            </div>
          ))}
        </div>

        {/* Heatmap Skeleton */}
        <div className="sh">
          <div className="st" style={{ width: 120, height: 12, background: 'var(--surf2)', borderRadius: 6 }}></div>
          <div className="sl" style={{ width: 80, height: 12, background: 'var(--surf2)', borderRadius: 6 }}></div>
        </div>
        <div className="skeleton-cal">
          <div className="skel-cal-grid">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="skel-cal-cell"></div>
            ))}
          </div>
        </div>

        {/* Habit List Skeleton */}
        <div className="sh">
          <div className="st" style={{ width: 100, height: 12, background: 'var(--surf2)', borderRadius: 6 }}></div>
        </div>
        <div className="str-list">
          {[1, 2, 3].map(i => (
            <div key={i} className="skel-str-item">
              <div className="skel-str-ico"></div>
              <div className="skel-str-bod">
                <div className="skel-str-name"></div>
                <div className="skel-str-bar"></div>
                <div className="skel-str-meta"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Fallbacks if data empty
  const current = data?.overallCurrentStreak || 0
  const best = data?.overallLongestStreak || 0
  const totalLogs = data?.totalDaysTracked || 0
  const perfect = data?.perfectDays || 0
  // For 'Done today' we would theoretically need `useHabits`. 
  // We'll stub 'Completion' and 'Best month' and 'Done today' slightly.

  // Heatmap generation logic
  // Assume current month
  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay()
  // Adjust so Monday is 0
  const offset = firstDay === 0 ? 6 : firstDay - 1

  // Map globalHeatmap to an easy lookup `{ "YYYY-MM-DD": count }`
  const heatMapRecord: Record<string, number> = {}
  data?.globalHeatmap?.forEach(item => {
    // Expected local ISO format e.g. "2026-03-20"
    heatMapRecord[item.date] = item.count
  })

  // Annual view generation
  const yearDays = Array.from({ length: 365 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (364 - i))
    return d
  })
  const firstDayOfYearView = yearDays[0].getDay() // 0 = Sun
  const yearOffset = firstDayOfYearView === 0 ? 6 : firstDayOfYearView - 1

  // Colors for generic list styling
  const colors = ["#a855f7", "#10b981", "#6366f1", "#f97316", "#3b82f6", "#eab308"]

  return (
    <div className="tab active skeleton-loaded" id="tab-streaks">
      {/* Header */}
      <div className="ph">
        <div>
          <div className="pd">Your streaks</div>
          <div className="pt">Stay on <em style={{ color: "var(--org)" }}>fire</em> 🔥</div>
          <div className="ps">Current best: {current} days running</div>
        </div>
        <AddHabitDialog>
          <button className="btn-primary">
            <svg viewBox="0 0 14 14"><path d="M7 2v10M2 7h10" /></svg>New habit
          </button>
        </AddHabitDialog>
      </div>

      {/* Hero */}
      <div className="str-hero">
        <div className="str-big">{current}</div>
        <div className="str-lbl">day streak</div>
        <div className="str-sub">Best ever: {best} days · Keep pushing!</div>
        <div className="str-badges">
          <div className="str-badge">🏅 {current >= 14 ? '2 weeks+' : 'Active'}</div>
          <div className="str-badge">⚡ On track</div>
          <div className="str-badge">🎯 {perfect} perfect days</div>
        </div>
      </div>

      {/* Stats 6 */}
      <div className="str6">
        <div className="s6c"><div className="s6i">🔥</div><div className="s6v">{current}d</div><div className="s6l">Current</div></div>
        <div className="s6c"><div className="s6i">🏆</div><div className="s6v">{best}d</div><div className="s6l">All time best</div></div>
        <div className="s6c"><div className="s6i">📅</div><div className="s6v">{totalLogs}d</div><div className="s6l">Total logged</div></div>
        <div className="s6c"><div className="s6i">✅</div><div className="s6v">{data?.habits?.length ? "92%" : "0%"}</div><div className="s6l">Completion</div></div>
        <div className="s6c"><div className="s6i">📆</div><div className="s6v">{today.toLocaleString('default', { month: 'short' })}</div><div className="s6l">Best month</div></div>
        <div className="s6c"><div className="s6i">⚡</div><div className="s6v">-</div><div className="s6l">Done today</div></div>
      </div>

      {/* Calendar Heatmap Toggle */}
      <div className="sh">
        <div className="st">{viewMode === "month" ? today.toLocaleString('default', { month: 'long' }) : today.getFullYear()} heatmap</div>
        <div className="sl" onClick={() => setViewMode(viewMode === "month" ? "year" : "month")}>
          {viewMode === "month" ? "View year →" : "View month →"}
        </div>
      </div>

      {viewMode === "month" ? (
        <div className="cal-wrap">
          <div className="cal-hdr">
            <div className="cal-dl">M</div><div className="cal-dl">T</div><div className="cal-dl">W</div>
            <div className="cal-dl">T</div><div className="cal-dl">F</div><div className="cal-dl">S</div><div className="cal-dl">S</div>
          </div>
          <div className="cal-grid" id="calGrid">
            {/* Empty offset cells */}
            {Array.from({ length: offset }).map((_, i) => (
              <div key={`empty-${i}`}></div>
            ))}
            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1
              const dStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
              const count = heatMapRecord[dStr] || 0

              let colorCls = "c0"
              if (count === 1) colorCls = "c1"
              else if (count === 2) colorCls = "c2"
              else if (count === 3) colorCls = "c3"
              else if (count === 4) colorCls = "c4"
              else if (count >= 5) colorCls = "c5"

              const isToday = dayNum === today.getDate()

              return (
                <div
                  key={dayNum}
                  className={`cal-cell ${colorCls} ${isToday ? 'cal-today' : ''}`}
                  title={`${today.toLocaleString('default', { month: 'short' })} ${dayNum}: ${count} habits completed`}
                >
                  {dayNum}
                </div>
              )
            })}
          </div>
          <div className="cal-legend" style={{ marginTop: 11 }}>
            <span className="cal-leg-lbl">Less</span>
            <div className="cal-leg-dot" style={{ background: "var(--surf2)" }}></div>
            <div className="cal-leg-dot" style={{ background: "#fde8cc" }}></div>
            <div className="cal-leg-dot" style={{ background: "#fed7aa" }}></div>
            <div className="cal-leg-dot" style={{ background: "#fb923c" }}></div>
            <div className="cal-leg-dot" style={{ background: "#f97316" }}></div>
            <div className="cal-leg-dot" style={{ background: "#ea580c" }}></div>
            <span className="cal-leg-lbl">More</span>
          </div>
        </div>
      ) : (
        <div className="cal-wrap overflow-x-auto">
          <div style={{ display: 'grid', gridTemplateRows: 'repeat(7, 1fr)', gridAutoFlow: 'column', gap: '4px', minWidth: 'max-content', paddingBottom: '8px' }}>
            {/* Empty boxes for alignment of the first day */}
            {Array.from({ length: yearOffset }).map((_, i) => (
              <div key={`y-exp-empty-${i}`} style={{ width: 14, height: 14 }}></div>
            ))}

            {/* 365 days of cells */}
            {yearDays.map((d, i) => {
              const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
              const count = heatMapRecord[dStr] || 0

              let colorCls = "c0"
              if (count === 1) colorCls = "c1"
              else if (count === 2) colorCls = "c2"
              else if (count === 3) colorCls = "c3"
              else if (count === 4) colorCls = "c4"
              else if (count >= 5) colorCls = "c5"

              const isToday = i === 364

              return (
                <div
                  key={dStr}
                  className={`cal-cell ${colorCls} ${isToday ? 'cal-today' : ''}`}
                  style={{ width: 14, height: 14, padding: 0, fontSize: 0 }}
                  title={`${d.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' })}: ${count} habits completed`}
                ></div>
              )
            })}
          </div>
          <div className="cal-legend" style={{ marginTop: 11, justifyContent: 'flex-end', minWidth: 'max-content' }}>
            <span className="cal-leg-lbl">Less</span>
            <div className="cal-leg-dot" style={{ background: "var(--surf2)" }}></div>
            <div className="cal-leg-dot" style={{ background: "#fde8cc" }}></div>
            <div className="cal-leg-dot" style={{ background: "#fed7aa" }}></div>
            <div className="cal-leg-dot" style={{ background: "#fb923c" }}></div>
            <div className="cal-leg-dot" style={{ background: "#f97316" }}></div>
            <div className="cal-leg-dot" style={{ background: "#ea580c" }}></div>
            <span className="cal-leg-lbl">More</span>
          </div>
        </div>
      )}

      {/* Habit Streaks List */}
      <div className="sh"><div className="st">Habit streaks</div><div className="sl" onClick={() => toast("Sorting coming soon!")}>Sort →</div></div>
      <div className="str-list">
        {data?.habits?.map((habit, i) => {
          const color = colors[i % colors.length]

          return (
            <div className="str-item" key={habit.habitId}>
              <div className="str-ico">{habit.icon || "🔥"}</div>
              <div className="str-bod">
                <div className="str-name">{habit.name}</div>
                <div className="str-bar-t">
                  {/* Mock progress relative to best streak in the app */}
                  <div className="str-bar-f" style={{ width: `${Math.min((habit.currentStreak / Math.max(best, 1)) * 100, 100)}%`, background: color }}></div>
                </div>
                <div className="str-meta flex items-center gap-1.5">
                  Best: {habit.longestStreak}d
                  <span className="text-txt3">·</span>
                  {habit.completionRate}% this month
                </div>
              </div>
              <div className="str-num">
                <div className="str-val" style={{ color: color }}>{habit.currentStreak}d</div>
                <div className="str-sub2">streak</div>
              </div>
            </div>
          )
        })}
        {(!data?.habits || data.habits.length === 0) && (
          <div className="text-center py-6 text-txt3 text-sm border border-dashed border-bord rounded-[16px]">
            Log some habits to see them here!
          </div>
        )}
      </div>
    </div>
  )
}
