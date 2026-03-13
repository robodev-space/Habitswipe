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
  const heatmapStart = subDays(new Date(), 83) // 84-day window covers heatmap + streaks

  // ── Fetch everything in parallel (was 3 sequential awaits before) ────────────
  const [habits, milestones, totalDaysTracked] = await Promise.all([
    // Habits with logs filtered to last 84 days at the DB level (not full table scan)
    prisma.habit.findMany({
      where: { userId, isArchived: false },
      select: {
        id: true,
        name: true,
        icon: true,
        color: true,
        logs: {
          where: { date: { gte: heatmapStart } }, // ← key: filter at DB, not in memory
          select: { date: true, status: true },
          orderBy: { date: "desc" },
        },
      },
    }),

    // All milestones for all habits in one query
    prisma.streakMilestone.findMany({
      where: { userId },
    }),

    // Total DONE count — single COUNT query
    prisma.habitLog.count({
      where: { userId, status: "DONE" },
    }),
  ])

  // ── Group milestones by habitId in memory ────────────────────────────────────
  const milestonesByHabit = milestones.reduce<Record<string, typeof milestones>>(
    (acc, m) => {
      if (!acc[m.habitId]) acc[m.habitId] = []
      acc[m.habitId].push(m)
      return acc
    },
    {}
  )

  // ── Build heatmap in memory — zero extra DB queries (was 1 query per habit) ──
  function buildHeatmap(logs: { date: Date; status: LogStatus }[]) {
    const logMap = new Map(
      logs.map((l) => [format(new Date(l.date), "yyyy-MM-dd"), l.status])
    )
    const days: { date: string; status: "DONE" | "SKIPPED" | null }[] = []
    for (let i = 83; i >= 0; i--) {
      const dateStr = format(subDays(new Date(), i), "yyyy-MM-dd")
      days.push({
        date: dateStr,
        status: (logMap.get(dateStr) ?? null) as "DONE" | "SKIPPED" | null,
      })
    }
    return days
  }

  // ── Per-habit details — pure in-memory, no extra queries ─────────────────────
  const habitDetails = habits.map((habit) => {
    const logs = habit.logs as { date: Date; status: LogStatus }[]

    const currentStreak = calculateCurrentStreak(logs)
    const longestStreak = calculateLongestStreak(logs)
    const completionRate = calculateCompletionRate(logs)
    const heatmap = buildHeatmap(logs)

    // Last DONE log (logs already sorted desc)
    const lastDone = logs.find((l) => l.status === "DONE")
    const lastStreakDate = lastDone ? lastDone.date : null

    return {
      habitId: habit.id,
      name: habit.name,
      icon: habit.icon,
      color: habit.color,
      currentStreak,
      longestStreak,
      completionRate,
      lastStreakDate,
      milestones: milestonesByHabit[habit.id] ?? [],
      heatmap,
    }
  })

  // ── Overall stats — computed in memory, no extra queries ─────────────────────
  const overallCurrentStreak = Math.max(0, ...habitDetails.map((h) => h.currentStreak))
  const overallLongestStreak = Math.max(0, ...habitDetails.map((h) => h.longestStreak))

  // Perfect days: days in last 30 where ALL habits were DONE
  // Was 30 individual COUNT queries — now a single in-memory pass over fetched logs
  const totalHabits = habits.length
  let perfectDays = 0

  if (totalHabits > 0) {
    // Count DONE habits per day from already-fetched data
    const doneCounts: Record<string, number> = {}
    for (const habit of habits) {
      for (const log of habit.logs) {
        if (log.status !== "DONE") continue
        const dateStr = format(new Date(log.date), "yyyy-MM-dd")
        doneCounts[dateStr] = (doneCounts[dateStr] ?? 0) + 1
      }
    }
    for (let i = 0; i < 30; i++) {
      const dateStr = format(subDays(new Date(), i), "yyyy-MM-dd")
      if ((doneCounts[dateStr] ?? 0) === totalHabits) perfectDays++
    }
  }

  const data: StreakPageData = {
    overallCurrentStreak,
    overallLongestStreak,
    totalDaysTracked,
    perfectDays,
    habits: habitDetails,
  }

  return NextResponse.json({ data })
}
