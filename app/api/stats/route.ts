// app/api/stats/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// GET /api/stats — Returns dashboard statistics for the current user
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek } from "date-fns"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { todayString } from "@/lib/utils"
import { computeCurrentStreak } from "@/lib/streaks"
import type { DashboardStats } from "@/types"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const today = todayString()

  // Fetch all active habits with their logs for the last 30 days
  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id, isArchived: false },
    include: {
      logs: {
        where: {
          date: { gte: new Date(format(subDays(new Date(), 30), "yyyy-MM-dd") + "T00:00:00.000Z") },
        },
        orderBy: { date: "desc" },
      },
    },
  })

  const totalHabits = habits.length

  // Today's completion counts
  const todayLogs = habits.map((h) =>
    h.logs.find((l) => new Date(l.date).toISOString().slice(0, 10) === today)
  )
  const completedToday = todayLogs.filter((l) => l?.status === "DONE").length
  const skippedToday = todayLogs.filter((l) => l?.status === "SKIPPED").length
  const pendingToday = totalHabits - completedToday - skippedToday

  // Weekly data — current week (Mon-Sun)
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }) // 1 = Monday
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
  const thisWeek = eachDayOfInterval({
    start: weekStart,
    end: weekEnd,
  })

  // Calculate This Week's completion percentage (Mon to Today)
  const daysSoFar = thisWeek.filter(d => format(d, "yyyy-MM-dd") <= today)
  let totalLogsPossible = 0
  let totalCompletions = 0

  daysSoFar.forEach(day => {
    const dateStr = format(day, "yyyy-MM-dd")
    totalLogsPossible += totalHabits
    totalCompletions += habits.filter(h => 
      h.logs.some(l => new Date(l.date).toISOString().slice(0, 10) === dateStr && l.status === "DONE")
    ).length
  })

  const completionPercent =
    totalLogsPossible > 0 ? Math.round((totalCompletions / totalLogsPossible) * 100) : 0

  // Best current streak across all habits
  const currentBestStreak = habits.length > 0 ? Math.max(
    0,
    ...habits.map((h) => computeCurrentStreak(h.logs.filter(l => l.status === "DONE").map(l => l.date)))
  ) : 0

  // Already calculated weekly intervals above!
  const weeklyData = thisWeek.map((day) => {
    const dateStr = format(day, "yyyy-MM-dd")
    const completed = habits.filter((h) =>
      h.logs.some(
        (l) =>
          new Date(l.date).toISOString().slice(0, 10) === dateStr &&
          l.status === "DONE"
      )
    ).length

    return {
      date: format(day, "EEE"), // "Mon", "Tue" etc
      fullDate: dateStr,        // Add fullDate for easier matching in the UI
      completed,
      total: totalHabits,
    }
  })

  const stats: DashboardStats = {
    totalHabits,
    completedToday,
    skippedToday,
    pendingToday,
    completionPercent,
    currentBestStreak,
    weeklyData,
  }

  return NextResponse.json({ data: stats })
}
