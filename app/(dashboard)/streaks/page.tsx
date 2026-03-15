"use client"

// app/(dashboard)/streaks/page.tsx  →  route: /streaks
// ─────────────────────────────────────────────────────────────────────────────
// STREAKS PAGE — Overview of all habit streaks, milestones, heatmaps
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Flame, Trophy, CalendarDays, Star } from "lucide-react"
import { StreakCard } from "@/components/streaks/StreakCard"
import type { StreakPageData } from "@/types"
import { API_ROUTES } from "@/lib/constants/api-routes"

export default function StreaksPage() {
  const [data, setData] = useState<StreakPageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(API_ROUTES.STREAKS.BASE)
      .then((r) => {
        if(!r.ok) throw new Error("Failed request")
        console.log(r)
       return r.json()})
      .then((json) => {
        if (json.data) setData(json.data)
      })
      .catch(console.error)
    .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
          <p className="text-fore-3 text-sm">Loading streaks...</p>
        </div>
      </div>
    )
  }

  if (!data || data.habits.length === 0) {
    return (
      <div className="max-w-2xl h-full flex flex-col items-center justify-center mx-auto px-6 py-8 text-center">
        <div className="text-6xl mb-4">🔥</div>
        <h2 className="text-2xl text-fore mb-2" style={{ fontFamily: "var(--font-dm-serif)" }}>
          No streaks yet
        </h2>
        <p className="text-fore-2 text-sm">
          Start swiping your habits to build streaks!
        </p>
      </div>
    )
  }

  const overviewCards = [
    {
      label: "Current Best Streak",
      value: `${data.overallCurrentStreak ||0} days`,
      icon: Flame,
      color: "#f97316",
      bg: "bg-orange-50 dark:bg-orange-950/30",
      iconColor: "text-orange-500",
    },
    {
      label: "Longest Ever",
      value: `${data.overallLongestStreak||0} days`,
      icon: Trophy,
      color: "#f59e0b",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      iconColor: "text-amber-500",
    },
    {
      label: "Total Days Done",
      value: data.totalDaysTracked.toString(),
      icon: CalendarDays,
      color: "#6366f1",
      bg: "bg-indigo-50 dark:bg-indigo-950/30",
      iconColor: "text-indigo-500",
    },
    {
      label: "Perfect Days",
      value: data.perfectDays.toString(),
      icon: Star,
      color: "#10b981",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      iconColor: "text-emerald-500",
    },
  ]

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl text-fore" style={{ fontFamily: "var(--font-dm-serif)" }}>
          Streaks
        </h1>
        <p className="text-fore-2 text-sm mt-1">
          Your consistency over time
        </p>
      </div>

      {/* Overview stat cards */}
      <div className="grid grid-cols-2 w-full gap-3">
        {overviewCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`rounded-2xl p-4 border border-theme ${card.bg}`}
          >
            <card.icon className={`w-5 h-5 mb-2 ${card.iconColor}`} />
            <p className="text-2xl font-bold text-fore">{card.value}</p>
            <p className="text-xs text-fore-2 mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Per-habit streak cards */}
      <div>
        <h2 className="text-lg font-semibold text-fore mb-3">
          Habits — ranked by streak
        </h2>
        <div className="flex flex-col gap-3">
          {data.habits.map((habit, i) => (
            <StreakCard key={habit.habitId} habit={habit} rank={i + 1} />
          ))}
        </div>
      </div>

    </div>
  )
}
