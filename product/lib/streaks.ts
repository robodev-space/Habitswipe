// lib/streaks.ts
// ─────────────────────────────────────────────────────────────────────────────
// STREAK ENGINE — All streak logic in one place
// Called from API routes when a habit log is created/updated
// ─────────────────────────────────────────────────────────────────────────────

import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns"
import { formatInTimeZone } from "date-fns-tz"
import { prisma } from "@/lib/prisma"
import { MILESTONE_DAYS } from "@/types"
import { getUserToday } from "./date-utils"

// ─────────────────────────────────────────────────────────────────────────────
// CORE CALCULATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Recalculates currentStreak and longestStreak for a habit from its logs,
 * saves the result to the DB, and checks for new milestones.
 * Call this every time a HabitLog is created or updated.
 */
export async function recalculateStreak(habitId: string, userId: string) {
  // Fetch user profile for timezone/dayStart
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { timezone: true, dayStartHour: true }
  })

  // Fetch all DONE logs for this habit, sorted oldest → newest
  const logs = await prisma.habitLog.findMany({
    where: { habitId, status: "DONE" },
    orderBy: { date: "asc" },
    select: { date: true },
  })

  const currentTz = user?.timezone ?? "UTC"
  const currentStartHour = user?.dayStartHour ?? 0

  const currentStreak = computeCurrentStreak(logs.map((l) => l.date), currentTz, currentStartHour)
  const longestStreak = computeLongestStreak(logs.map((l) => l.date))
  const lastStreakDate = logs.length > 0 ? logs[logs.length - 1].date : null

  // Save cached values back to the habit row
  await (prisma.habit as any).update({
    where: { id: habitId },
    data: { currentStreak, longestStreak, lastStreakDate },
  })

  // Check and award any newly reached milestones
  await checkMilestones(habitId, userId, currentStreak)

  return { currentStreak, longestStreak }
}

/**
 * Current streak = consecutive DONE days ending today (or yesterday).
 * If the user hasn't logged today yet, we still count yesterday's streak.
 */
export function computeCurrentStreak(dates: Date[], timezone: string = "UTC", startHour: number = 0): number {
  if (dates.length === 0) return 0

  const doneDates = new Set(dates.map((d) => {
    // We assume incoming dates are UTC midnights from the DB
    return d.toISOString().slice(0, 10)
  }))

  let streak = 0
  const todayStr = getUserToday(timezone, startHour)
  let check = new Date(todayStr)

  // Allow streak to include today OR start from yesterday
  // (user might not have logged today yet)
  while (true) {
    const dateStr = check.toISOString().slice(0, 10)
    if (doneDates.has(dateStr)) {
      streak++
      check = subDays(check, 1)
    } else if (streak === 0) {
      // Try yesterday before giving up (today might not be logged yet)
      const yesterday = subDays(check, 1)
      const yesterdayStr = yesterday.toISOString().slice(0, 10)
      if (doneDates.has(yesterdayStr)) {
        streak++
        check = subDays(yesterday, 1)
      } else {
        break
      }
    } else {
      break
    }
  }

  return streak
}

/**
 * Longest streak = longest run of consecutive DONE days ever.
 */
export function computeLongestStreak(dates: Date[]): number {
  if (dates.length === 0) return 0

  const sorted = [...new Set(dates.map((d) => format(new Date(d), "yyyy-MM-dd")))].sort()

  let longest = 1
  let current = 1

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1])
    const curr = new Date(sorted[i])
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)

    if (diff === 1) {
      current++
      longest = Math.max(longest, current)
    } else {
      current = 1
    }
  }

  return longest
}

/**
 * Completion rate over the last 30 days (0–100).
 */
export function computeCompletionRate(
  logs: { date: Date; status: string }[], 
  days = 30, 
  timezone: string = "UTC",
  startHour: number = 0
): number {
  const todayStr = getUserToday(timezone, startHour)
  const today = new Date(todayStr)
  
  const allDays = eachDayOfInterval({
    start: subDays(today, days - 1),
    end: today,
  })

  const doneSet = new Set(
    logs
      .filter((l) => l.status === "DONE")
      .map((l) => format(new Date(l.date), "yyyy-MM-dd"))
  )

  const completed = allDays.filter((d) => doneSet.has(format(d, "yyyy-MM-dd"))).length
  return Math.round((completed / allDays.length) * 100)
}

// ─────────────────────────────────────────────────────────────────────────────
// MILESTONE CHECKING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Awards milestone badges when a streak crosses 7, 14, 30, 60, 100 days.
 * Uses upsert so it's safe to call multiple times.
 */
export async function checkMilestones(habitId: string, userId: string, currentStreak: number) {
  const toAward = MILESTONE_DAYS.filter((m) => currentStreak >= m)

  for (const milestone of toAward) {
    await prisma.streakMilestone.upsert({
      where: { habitId_milestone: { habitId, milestone } },
      create: {
        userId,
        habitId,
        milestone,
        achieved: true,
        achievedAt: new Date(),
      },
      update: {
        achieved: true,
        achievedAt: new Date(), // update date if re-achieved after reset
      },
    })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HEATMAP DATA
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns 84 days (12 weeks) of log data for the heatmap calendar.
 */
export async function getHeatmapData(habitId: string) {
  const start = subDays(new Date(), 83)

  const logs = await prisma.habitLog.findMany({
    where: {
      habitId,
      date: { gte: start },
    },
    select: { date: true, status: true },
  })

  const logMap = new Map(
    logs.map((l) => [format(new Date(l.date), "yyyy-MM-dd"), l.status])
  )

  const days = eachDayOfInterval({ start, end: new Date() })

  return days.map((day) => {
    const dateStr = format(day, "yyyy-MM-dd")
    return {
      date: dateStr,
      status: (logMap.get(dateStr) ?? null) as "DONE" | "SKIPPED" | null,
    }
  })
}
