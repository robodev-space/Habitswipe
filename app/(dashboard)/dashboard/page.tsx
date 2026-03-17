// app/(dashboard)/dashboard/page.tsx  →  route: /dashboard
// ─────────────────────────────────────────────────────────────────────────────
// STATS PAGE — Completion overview, streaks, weekly chart
// ─────────────────────────────────────────────────────────────────────────────

"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Flame, CheckCircle2, XCircle, Clock, TrendingUp } from "lucide-react"
import { ProgressRing } from "@/components/shared/StreakBadge"
import { useHabits } from "@/hooks/useHabits"
import { Skeleton } from "@/components/ui/Skeleton"

export default function DashboardPage() {
  const { habits, stats, fetchHabits, fetchStats, isLoading, isInitialized } = useHabits()

  useEffect(() => {
    const controller = new AbortController()
    fetchHabits()
    fetchStats()
    return () => {
      // Abort previous calls on unmount
      controller.abort()
    }
  }, [])

  if (isLoading || !isInitialized) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-[146px] w-full rounded-3xl" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[100px] w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-[200px] w-full rounded-3xl" />
      </div>
    )
  }

  const cards = [
    {
      label: "Completed Today",
      value: stats?.completedToday ?? 0,
      icon: CheckCircle2,
      color: "#10b981",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Skipped Today",
      value: stats?.skippedToday ?? 0,
      icon: XCircle,
      color: "#ef4444",
      bg: "bg-red-50 dark:bg-red-950/30",
    },
    {
      label: "Pending",
      value: stats?.pendingToday ?? 0,
      icon: Clock,
      color: "#f59e0b",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      label: "Best Streak",
      value: stats?.currentBestStreak ?? 0,
      icon: Flame,
      color: "#f97316",
      bg: "bg-orange-50 dark:bg-orange-950/30",
      suffix: "d",
    },
  ]

  const maxWeeklyCompleted = Math.max(
    ...(stats?.weeklyData.map((d) => d.completed) ?? [1]),
    1
  )

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-fore" style={{ fontFamily: "var(--font-dm-serif)" }}>
          Your Stats
        </h1>
        <p className="text-fore-2 text-sm mt-1">Track your progress over time</p>
      </div>

      {/* Today's completion ring */}
      <div className="bg-surface border border-theme rounded-3xl p-6 flex items-center gap-6 card-shadow">
        <ProgressRing
          percent={stats?.completionPercent ?? 0}
          size={96}
          strokeWidth={8}
          color="#6366f1"
          label="today"
        />
        <div>
          <h2 className="text-xl font-bold text-fore">Today&apos;s Progress</h2>
          <p className="text-fore-2 text-sm mt-1">
            {stats?.completedToday ?? 0} of {stats?.totalHabits ?? 0} habits completed
          </p>
          {(stats?.completionPercent ?? 0) === 100 && (
            <p className="text-emerald-500 text-sm font-medium mt-2">🎉 Perfect day!</p>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`rounded-2xl p-4 border border-theme ${card.bg}`}
          >
            <card.icon className="w-5 h-5 mb-2" style={{ color: card.color }} />
            <p className="text-2xl font-bold text-fore">
              {card.value}{card.suffix ?? ""}
            </p>
            <p className="text-xs text-fore-2 mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Weekly bar chart */}
      {stats?.weeklyData && (
        <div className="bg-surface border border-theme rounded-3xl p-6 card-shadow">
          <h3 className="font-semibold text-fore mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            Last 7 Days
          </h3>
          <div className="flex items-end justify-between gap-2 h-28">
            {stats.weeklyData.map((day) => {
              const heightPct =
                day.total > 0
                  ? (day.completed / day.total) * 100
                  : 0
              const isToday = day.date === new Date().toLocaleDateString("en", { weekday: "short" }).slice(0, 3)

              return (
                <div key={day.date} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full flex flex-col justify-end h-20 relative">
                    <div
                      className="w-full rounded-t-lg transition-all duration-700"
                      style={{
                        height: `${Math.max(heightPct, 4)}%`,
                        background: isToday
                          ? "linear-gradient(to top, #6366f1, #8b5cf6)"
                          : "#e2e8f0",
                      }}
                    />
                    {day.completed > 0 && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-fore-2">
                        {day.completed}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-medium ${isToday ? "text-indigo-500" : "text-fore-3"
                      }`}
                  >
                    {day.date}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Per-habit breakdown */}
      <div className="bg-surface border border-theme rounded-3xl p-6 card-shadow">
        <h3 className="font-semibold text-fore mb-4">Habit Breakdown</h3>
        <div className="flex flex-col gap-4">
          {habits.map((habit) => (
            <div key={habit.id} className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              // style={{ background: hexWithOpacity(habit.color, 0.12) }}
              >
                {habit.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-fore truncate">{habit.name}</span>
                  <span className="text-xs text-fore-3 ml-2 flex-shrink-0">
                    {habit.completionRate}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${habit.completionRate}%`,
                      background: habit.color,
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs font-semibold text-fore-2">{habit.currentStreak}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
