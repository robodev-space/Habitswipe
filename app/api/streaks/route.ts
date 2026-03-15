// app/api/streaks/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// GET /api/streaks — Returns full streak data for the streaks page
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { format, subDays } from "date-fns"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  calculateCurrentStreak,
  calculateLongestStreak,
  calculateCompletionRate,
} from "@/lib/utils"
import type { StreakPageData, LogStatus } from "@/types"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id
  const heatmapStart = subDays(new Date(), 364) // 365-day window for global heatmap

  // ── Fetch everything in parallel ────────────
  const [habits, milestones, totalDaysTracked] = await Promise.all([
    prisma.habit.findMany({
      where: { userId, isArchived: false },
      select: {
        id: true,
        name: true,
        icon: true,
        color: true,
        logs: {
          where: { date: { gte: heatmapStart } },
          select: { date: true, status: true },
          orderBy: { date: "desc" },
        },
      },
    }),
    prisma.streakMilestone.findMany({
      where: { userId },
    }),
    prisma.habitLog.count({
      where: { userId, status: "DONE" },
    }),
  ])

  // ── Group milestones by habitId ────────────────────────────────────
  const milestonesByHabit = milestones.reduce<Record<string, typeof milestones>>(
    (acc, m) => {
      if (!acc[m.habitId]) acc[m.habitId] = []
      acc[m.habitId].push(m)
      return acc
    },
    {}
  )

  // ── Daily aggregation for global stats ─────────────────────────────────────
  const doneCounts: Record<string, number> = {} // date -> count
  const habitDoneCounts: Record<string, number> = {} // habitName -> total completions

  for (const habit of habits) {
    let totalCompletions = 0
    for (const log of habit.logs) {
      if (log.status !== "DONE") continue
      const dateStr = format(new Date(log.date), "yyyy-MM-dd")
      doneCounts[dateStr] = (doneCounts[dateStr] ?? 0) + 1
      totalCompletions++
    }
    habitDoneCounts[habit.name] = totalCompletions
  }

  // ── Build Heatmaps and Trends ──────────────────────────────────────────────
  
  // 1. Global Heatmap (365 days)
  const globalHeatmap: { date: string; count: number }[] = []
  for (let i = 364; i >= 0; i--) {
    const dateStr = format(subDays(new Date(), i), "yyyy-MM-dd")
    globalHeatmap.push({
      date: dateStr,
      count: doneCounts[dateStr] ?? 0,
    })
  }

  // 2. Daily Trend (30 days)
  const dailyTrend: { date: string; completions: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = subDays(new Date(), i)
    dailyTrend.push({
      date: format(d, "MMM dd"),
      completions: doneCounts[format(d, "yyyy-MM-dd")] ?? 0,
    })
  }

  // 3. Habit Distribution (Pie Chart)
  const habitDistribution = habits.map(h => ({
    name: h.name,
    value: habitDoneCounts[h.name] ?? 0,
    color: h.color
  })).filter(h => h.value > 0)

  // ── Per-habit details ──────────────────────────────────────────────────────
  const habitDetails = habits.map((habit) => {
    const logs = habit.logs as { date: Date; status: LogStatus }[]
    
    // For individual habit heatmap, we still only show last 84 days to keep it compact
    const currentWeekLogs = logs.filter(l => new Date(l.date) >= subDays(new Date(), 83))

    const currentStreak = calculateCurrentStreak(logs)
    const longestStreak = calculateLongestStreak(logs)
    const completionRate = calculateCompletionRate(logs)
    
    const habitHeatmap: { date: string; status: LogStatus | null }[] = []
    const logMap = new Map(logs.map(l => [format(new Date(l.date), "yyyy-MM-dd"), l.status]))
    
    for (let i = 83; i >= 0; i--) {
      const dateStr = format(subDays(new Date(), i), "yyyy-MM-dd")
      habitHeatmap.push({
        date: dateStr,
        status: (logMap.get(dateStr) ?? null) as LogStatus | null,
      })
    }

    const lastDone = logs.find((l) => l.status === "DONE")

    return {
      habitId: habit.id,
      name: habit.name,
      icon: habit.icon,
      color: habit.color,
      currentStreak,
      longestStreak,
      completionRate,
      lastStreakDate: lastDone ? lastDone.date : null,
      milestones: milestonesByHabit[habit.id] ?? [],
      heatmap: habitHeatmap,
    }
  })

  // ── Overall stats ──────────────────────────────────────────────────────────
  const overallCurrentStreak = Math.max(0, ...habitDetails.map((h) => h.currentStreak))
  const overallLongestStreak = Math.max(0, ...habitDetails.map((h) => h.longestStreak))

  const totalHabitsCount = habits.length
  let perfectDays = 0
  if (totalHabitsCount > 0) {
    for (let i = 0; i < 30; i++) {
      const dateStr = format(subDays(new Date(), i), "yyyy-MM-dd")
      if ((doneCounts[dateStr] ?? 0) === totalHabitsCount) perfectDays++
    }
  }

  const data: StreakPageData = {
    overallCurrentStreak,
    overallLongestStreak,
    totalDaysTracked,
    perfectDays,
    habits: habitDetails,
    globalHeatmap,
    dailyTrend,
    habitDistribution
  }

  return NextResponse.json({ data })
}
