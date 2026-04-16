// lib/date-utils.ts
// ─────────────────────────────────────────────────────────────────────────────
// TIMEZONE ENGINE — Centralizing all date-aware logic
// Handles local user "today" calculations and day-start offsets.
// ─────────────────────────────────────────────────────────────────────────────

import { formatInTimeZone, toDate } from "date-fns-tz"
import { startOfDay, subDays, addHours } from "date-fns"

/**
 * Returns the effective "today" date string (YYYY-MM-DD) for a user.
 * Takes into account their timezone and logical day start hour.
 * 
 * Example: If startHour is 4 (4 AM), then at 2 AM local time, 
 * this will still return "yesterday's" date string.
 */
export function getUserToday(timezone: string = "UTC", startHour: number = 0): string {
  const now = new Date()
  
  // 1. Get current time in user's timezone
  // 2. Subtract startHour to get the "logical" time
  // Example: 2 AM - 4 hours = 10 PM (previous day)
  const logicalDate = addHours(now, -startHour)
  
  return formatInTimeZone(logicalDate, timezone, "yyyy-MM-dd")
}

/**
 * Formats a Date object to the user's local date string.
 */
export function formatToUserDate(date: Date, timezone: string = "UTC"): string {
  return formatInTimeZone(date, timezone, "yyyy-MM-dd")
}

/**
 * Converts a "YYYY-MM-DD" string (from the user's context) to a 
 * UTC Date at the very start of that day.
 * Useful for Prisma queries where we store @db.Date.
 */
export function parseUserDate(dateStr: string, timezone: string = "UTC"): Date {
  return toDate(`${dateStr}T00:00:00`, { timeZone: timezone })
}

/**
 * Returns the current local time for a user.
 */
export function getUserNow(timezone: string = "UTC"): Date {
  return toDate(new Date(), { timeZone: timezone })
}
