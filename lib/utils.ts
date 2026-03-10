// lib/utils.ts
// ─────────────────────────────────────────────────────────────────────────────
// SHARED UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, startOfDay, subDays, eachDayOfInterval } from "date-fns"
import type { HabitLog } from "@/types"

// ── Tailwind class merger ─────────────────────────────────────────────────────
// Usage: cn("base-class", condition && "conditional-class", "override-class")
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Date helpers ──────────────────────────────────────────────────────────────

/** Returns today as "YYYY-MM-DD" */
export function todayString(): string {
  return format(new Date(), "yyyy-MM-dd")
}

/** Parses "YYYY-MM-DD" to a Date at midnight UTC */
export function parseDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00.000Z")
}

/** Format a date for display: "Mon, Jan 1" */
export function formatDisplayDate(date: Date): string {
  return format(date, "EEE, MMM d")
}

// ── Streak calculator ─────────────────────────────────────────────────────────
/**
 * Given an array of DONE logs sorted by date desc,
 * calculate the current streak (consecutive days from today backward).
 */
export function calculateCurrentStreak(
  logs: Pick<HabitLog, "date" | "status">[]
): number {
  const doneLogs = logs
    .filter((l) => l.status === "DONE")
    .map((l) => format(new Date(l.date), "yyyy-MM-dd"))
    .sort()
    .reverse()

  if (doneLogs.length === 0) return 0

  let streak = 0
  let checkDate = startOfDay(new Date())

  for (const logDate of doneLogs) {
    const expected = format(checkDate, "yyyy-MM-dd")
    if (logDate === expected) {
      streak++
      checkDate = subDays(checkDate, 1)
    } else if (logDate < expected) {
      // missed a day — streak broken
      break
    }
  }

  return streak
}

/**
 * Calculate the all-time longest streak from logs.
 */
export function calculateLongestStreak(
  logs: Pick<HabitLog, "date" | "status">[]
): number {
  const doneDates = logs
    .filter((l) => l.status === "DONE")
    .map((l) => format(new Date(l.date), "yyyy-MM-dd"))
    .sort()

  if (doneDates.length === 0) return 0

  let longest = 1
  let current = 1

  for (let i = 1; i < doneDates.length; i++) {
    const prev = new Date(doneDates[i - 1])
    const curr = new Date(doneDates[i])
    const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    if (diffDays === 1) {
      current++
      longest = Math.max(longest, current)
    } else {
      current = 1
    }
  }

  return longest
}

/**
 * Completion rate over the last N days (0–100).
 */
export function calculateCompletionRate(
  logs: Pick<HabitLog, "date" | "status">[],
  days = 30
): number {
  const start = subDays(new Date(), days - 1)
  const allDays = eachDayOfInterval({ start, end: new Date() })

  const doneSet = new Set(
    logs
      .filter((l) => l.status === "DONE")
      .map((l) => format(new Date(l.date), "yyyy-MM-dd"))
  )

  const completed = allDays.filter((d) =>
    doneSet.has(format(d, "yyyy-MM-dd"))
  ).length

  return Math.round((completed / allDays.length) * 100)
}

// ── Color helpers ─────────────────────────────────────────────────────────────
/** Add opacity to a hex color for backgrounds */
export function hexWithOpacity(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

// ── Preset habit colors ───────────────────────────────────────────────────────
export const HABIT_COLORS = [
  "#6366f1", // indigo
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ef4444", // red
  "#14b8a6", // teal
  "#f97316", // orange
  "#84cc16", // lime
]

// ── Preset habit icons (emojis) ───────────────────────────────────────────────
export const HABIT_ICONS = [
  "⚡", "🏃", "💧", "📚", "🧘", "💪", "🥗", "😴",
  "✍️", "🎯", "🎸", "🧠", "🌿", "🏊", "🚴", "🍎",
  "☕", "🧹", "💊", "🙏", "🎨", "📱", "🌅", "🏋️",
]
