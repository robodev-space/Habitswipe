// app/api/stats/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// GET /api/stats — Returns dashboard statistics for the current user
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { format, subDays, eachDayOfInterval } from "date-fns"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { todayString, calculateCurrentStreak } from "@/lib/utils"
import type { DashboardStats } from "@/types"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const today = todayString()

  // Fetch all active habits with their logs for the last 7 days
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
  const completionPercent =
    totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0

  // Best current streak across all habits
  const currentBestStreak = Math.max(
    0,
    ...habits.map((h) => calculateCurrentStreak(h.logs))
  )

  // Weekly data — last 7 days
  const last7 = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  })

  const weeklyData = last7.map((day) => {
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
