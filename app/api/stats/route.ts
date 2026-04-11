import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import {
  format,
  subDays,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  subYears,
  eachMonthOfInterval,
} from "date-fns"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { todayString } from "@/lib/utils"
import { computeCurrentStreak, computeLongestStreak } from "@/lib/streaks"
import type { DashboardStats, AnalyticsStats, LogStatus } from "@/types"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id
  const today = new Date()
  const todayStr = todayString()

  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") || "month"

  // ── Ranges ─────────────────────────────────────────────────────────────────
  let currStart: Date, currEnd: Date, prevStart: Date, prevEnd: Date
  let periodLabel: string

  if (period === "year") {
    currStart = startOfYear(today)
    currEnd = today
    prevStart = startOfYear(subYears(today, 1))
    prevEnd = subYears(today, 1) // Comparisons are usually "same time last year"
    periodLabel = `Year ${format(today, "yyyy")}`
  } else {
    currStart = startOfMonth(today)
    currEnd = endOfMonth(today)
    prevStart = startOfMonth(subMonths(today, 1))
    prevEnd = endOfMonth(subMonths(today, 1))
    periodLabel = format(today, "MMMM yyyy")
  }

  // ── Fetch Habits & Logs ─────────────────────────────────────────────────────
  // We fetch last 60 days to be safe for trending
  const habits = await prisma.habit.findMany({
    where: { userId, isArchived: false },
    include: {
      logs: {
        where: {
          date: { gte: prevStart },
        },
        orderBy: { date: "asc" },
      },
    },
  })

  if (habits.length === 0) {
    return NextResponse.json({
      data: {
        totalHabits: 0,
        completedToday: 0,
        skippedToday: 0,
        pendingToday: 0,
        completionPercent: 0,
        currentBestStreak: 0,
        weeklyData: [],
      },
    })
  }

  // ── Dashboard stats (Legacy Support) ───────────────────────────────────────
  const totalHabits = habits.length
  const todayLogs = habits.map((h) =>
    h.logs.find((l) => format(new Date(l.date), "yyyy-MM-dd") === todayStr)
  )
  const completedToday = todayLogs.filter((l) => l?.status === "DONE").length
  const skippedToday = todayLogs.filter((l) => l?.status === "SKIPPED").length
  const pendingToday = totalHabits - completedToday - skippedToday

  // Weekly data (Mon-Sun)
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const weeklyData = weekDays.map((day) => {
    const dStr = format(day, "yyyy-MM-dd")
    const completed = habits.filter((h) =>
      h.logs.some((l) => format(new Date(l.date), "yyyy-MM-dd") === dStr && l.status === "DONE")
    ).length
    return {
      date: format(day, "EEE"),
      fullDate: dStr,
      completed,
      total: totalHabits,
    }
  })

  // ── Analytics stats (New) ──────────────────────────────────────────────────
  const calculateRangeStats = (start: Date, end: Date) => {
    let checkIns = 0
    let perfectDayCount = 0
    let possibleCheckIns = 0

    // Only count up to today for the current period
    const effectiveEnd = end > today ? today : end
    if (start > effectiveEnd) return { checkIns, perfectDayCount, rate: 0 }

    const days = eachDayOfInterval({ start, end: effectiveEnd })

    days.forEach((day) => {
      const dStr = format(day, "yyyy-MM-dd")
      const doneThisDay = habits.filter((h) =>
        h.logs.some((l) => format(new Date(l.date), "yyyy-MM-dd") === dStr && l.status === "DONE")
      ).length

      checkIns += doneThisDay
      possibleCheckIns += totalHabits
      if (doneThisDay === totalHabits && totalHabits > 0) perfectDayCount++
    })

    const rate = possibleCheckIns > 0 ? Math.round((checkIns / possibleCheckIns) * 100) : 0
    return { checkIns, perfectDayCount, rate }
  }

  const currStats = calculateRangeStats(currStart, currEnd)
  const prevStats = calculateRangeStats(prevStart, prevEnd)

  // Compute streaks for each habit
  const habitStreaks = habits.map(h => {
    const doneDates = h.logs.filter(l => l.status === "DONE").map(l => l.date)
    return {
      id: h.id,
      currentStreak: computeCurrentStreak(doneDates),
      longestStreak: computeLongestStreak(doneDates)
    }
  })

  // Longest overall streak
  const bestHabitIndex = habitStreaks.reduce(
    (bestIdx, cur, idx) => (cur.longestStreak > habitStreaks[bestIdx].longestStreak ? idx : bestIdx),
    0
  )
  const bestHabit = habits[bestHabitIndex]
  const bestStreak = habitStreaks[bestHabitIndex].longestStreak

  // Distribution by time of day
  const getRateByTime = (isMorning: boolean) => {
    const filteredHabits = habits.filter((h) => {
      if (!h.reminderTime) return !isMorning
      const hour = parseInt(h.reminderTime.split(":")[0])
      return isMorning ? hour < 12 : hour >= 12
    })
    if (filteredHabits.length === 0) return 0
    
    let done = 0
    let total = 0
    const rangeDays = eachDayOfInterval({ start: currStart, end: today })
    
    rangeDays.forEach(day => {
      const dStr = format(day, "yyyy-MM-dd")
      total += filteredHabits.length
      done += filteredHabits.filter(h => 
        h.logs.some(l => format(new Date(l.date), "yyyy-MM-dd") === dStr && l.status === "DONE")
      ).length
    })

    return total > 0 ? Math.round((done / total) * 100) : 0
  }

  const morningRate = getRateByTime(true)
  const eveningRate = getRateByTime(false)

  // Habit performance list
  const habitPerformance = habits.map(h => {
    const rangeLogs = h.logs.filter(l => l.date >= currStart && l.date <= today)
    const rangeDays = eachDayOfInterval({ start: currStart, end: today }).length
    const rate = rangeDays > 0 ? Math.round((rangeLogs.filter(l => l.status === "DONE").length / rangeDays) * 100) : 0
    return {
      id: h.id,
      name: h.name,
      icon: h.icon,
      color: h.color,
      completionRate: rate
    }
  }).sort((a, b) => b.completionRate - a.completionRate)

  // Build Chart Data
  let chartLabels: string[] = []
  let chartData: number[] = []

  if (period === "year") {
    // Monthly bars for the year
    const months = eachMonthOfInterval({ start: currStart, end: currEnd })
    chartLabels = months.map(m => format(m, "MMM"))
    chartData = months.map(m => {
      const mStart = startOfMonth(m)
      const mEnd = endOfMonth(m)
      const effectiveEnd = mEnd > today ? today : mEnd
      
      let count = 0
      habits.forEach(h => {
        count += h.logs.filter(l => 
          l.date >= mStart && l.date <= effectiveEnd && l.status === "DONE"
        ).length
      })
      return count
    })
  } else {
    // Daily bars for the week (existing logic)
    chartLabels = weeklyData.map(d => d.date)
    chartData = weeklyData.map(d => d.completed)
  }

  const analytics: AnalyticsStats = {
    periodLabel,
    completionRate: currStats.rate,
    completionRateTrend: currStats.rate - prevStats.rate,
    totalCheckIns: currStats.checkIns,
    totalCheckInsTrend: currStats.checkIns - prevStats.checkIns,
    perfectDays: currStats.perfectDayCount,
    perfectDaysTrend: currStats.perfectDayCount - prevStats.perfectDayCount,
    longestStreak: bestStreak,
    bestHabitName: bestHabit?.name ?? "None",
    chartLabels,
    chartData,
    overallRate: currStats.rate,
    morningRate,
    eveningRate,
    habitDistribution: habitPerformance.slice(0, 4).map(h => ({ name: h.name, value: h.completionRate, color: h.color })),
    habitPerformance
  }

  const statsResponse: DashboardStats & { analytics: AnalyticsStats } = {
    totalHabits,
    completedToday,
    skippedToday,
    pendingToday,
    completionPercent: currStats.rate,
    currentBestStreak: Math.max(0, ...habitStreaks.map(s => s.currentStreak)),
    weeklyData,
    analytics
  }

  return NextResponse.json({ data: statsResponse })
}
