"use client"

// app/(dashboard)/streaks/page.tsx  →  route: /streaks
// ─────────────────────────────────────────────────────────────────────────────
// STREAKS PAGE — Overview of all habit streaks, milestones, heatmaps
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Flame, Trophy, CalendarDays, Star } from "lucide-react"
import { StreakCard } from "@/components/streaks/StreakCard"
import { StreakStatsHeader } from "@/components/streaks/StreakStatsHeader"
import { ConsistencyLineChart } from "@/components/streaks/ConsistencyLineChart"
import { HabitDistributionPieChart } from "@/components/streaks/HabitDistributionPieChart"
import { ContributionGraph } from "@/components/streaks/ContributionGraph"
import type { StreakPageData } from "@/types"
import { Skeleton } from "@/components/ui/Skeleton"
import { API_ROUTES } from "@/lib/constants/api-routes"

export default function StreaksPage() {
  const [data, setData] = useState<StreakPageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[100px] w-full rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[240px] w-full rounded-2xl" />
          <Skeleton className="h-[240px] w-full rounded-2xl" />
        </div>
        <Skeleton className="h-[200px] w-full rounded-3xl" />
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

  return (
    <div className="w-full mx-auto px-4 md:px-8 py-8 space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-4xl text-fore" style={{ fontFamily: "var(--font-dm-serif)" }}>
          Streaks & Insights
        </h1>
        <p className="text-fore-2 text-base mt-2">
          Visualizing your journey to consistency with premium analytics.
        </p>
      </div>

      {/* 1. Overview Stats */}
      <section>
        <StreakStatsHeader
          currentBest={data.overallCurrentStreak}
          longestEver={data.overallLongestStreak}
          totalDays={data.totalDaysTracked}
          perfectDays={data.perfectDays}
        />
      </section>

      {/* 2. Analytics Charts */}
      <section className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-[62%]">
          <ConsistencyLineChart data={data.dailyTrend} />
        </div>
        <div className="lg:w-[38%]">
          <HabitDistributionPieChart data={data.habitDistribution} />
        </div>
      </section>

      {/* 3. Global Heatmap */}
      <section>
        <ContributionGraph data={data.globalHeatmap} />
      </section>

      {/* 4. Per-habit Detail List */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-fore">
          Habit Breakdown
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {data.habits.map((habit, i) => (
            <StreakCard key={habit.habitId} habit={habit} rank={i + 1} />
          ))}
        </div>
      </section>
    </div>
  )
}
