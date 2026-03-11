// app/api/streaks/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// GET /api/streaks — Returns full streak data for the streaks page
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { format, subDays } from "date-fns"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { computeCompletionRate, getHeatmapData } from "@/lib/streaks"
import type { StreakPageData } from "@/types"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id

  // Fetch all active habits with logs + milestones
  const habits = await prisma.habit.findMany({
    where: { userId, isArchived: false },
    // orderBy: { currentStreak: "desc" }, // highest streak first
    include: {
      logs: {
        orderBy: { date: "desc" },
      },
      // Fetch milestones via raw relation
    },
  })

  // Fetch milestones separately
  const milestones = await prisma.streakMilestone.findMany({
    where: { userId },
  })

  const milestonesByHabit = milestones.reduce<Record<string, typeof milestones>>(
    (acc, m) => {
      if (!acc[m.habitId]) acc[m.habitId] = []
      acc[m.habitId].push(m)
      return acc
    },
    {}
  )

  // Build per-habit streak details with heatmap
  const habitDetails = await Promise.all(
    habits.map(async (habit) => {
      const heatmap = await getHeatmapData(habit.id)
      const completionRate = computeCompletionRate(habit.logs)

      return {
        habitId: habit.id,
        name: habit.name,
        icon: habit.icon,
        color: habit.color,
        currentStreak: habit.currentStreak,
        longestStreak: habit.longestStreak,
        completionRate,
        lastStreakDate: habit.lastStreakDate,
        milestones: milestonesByHabit[habit.id] ?? [],
        heatmap,
      }
    })
  )

  // Overall stats across all habits
  const overallCurrentStreak = Math.max(0, ...habits.map((h) => h.currentStreak))
  const overallLongestStreak = Math.max(0, ...habits.map((h) => h.longestStreak))

  // Total DONE logs all time
  const totalDaysTracked = await prisma.habitLog.count({
    where: { userId, status: "DONE" },
  })

  // Perfect days = days where ALL habits were completed
  // We look at the last 30 days
  const last30 = Array.from({ length: 30 }, (_, i) =>
    format(subDays(new Date(), i), "yyyy-MM-dd")
  )

  const totalHabits = habits.length
  let perfectDays = 0

  if (totalHabits > 0) {
    for (const dateStr of last30) {
      const doneCount = await prisma.habitLog.count({
        where: {
          userId,
          status: "DONE",
          date: new Date(dateStr + "T00:00:00.000Z"),
        },
      })
      if (doneCount === totalHabits) perfectDays++
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
