import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns YYYY-MM-DD for today.
 * On browser, it uses local time. On server, it defaults to UTC.
 */
export function todayString(timezone: string = "UTC", startHour: number = 0) {
  const now = new Date();
  
  // Logical offset handling
  const logicalDate = new Date(now.getTime() - (startHour * 60 * 60 * 1000));
  
  // If we have a timezone, we should ideally use it.
  // Using Intl is a lightweight way to get local date string without extra libs.
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(logicalDate);
  } catch (e) {
    // Fallback to ISO string slice
    return logicalDate.toISOString().slice(0, 10);
  }
}
export const HABIT_ICONS = [
  "⚡", "🔥", "🏃", "💪", "📚", "🧘", "🎯", "✅",
  "💧", "🌅", "🎵", "🍎", "🧠", "💤", "🚴", "✍️",
  "🏋️", "🌿", "☕", "🎨", "🧩", "🎧", "🪴", "🏊",
] as const

export const HABIT_COLORS = [
  "#6366f1", // indigo   (brand primary)
  "#8b5cf6", // violet
  "#a855f7", // purple
  "#ec4899", // pink
  "#f43f5e", // rose
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#eab308", // yellow
  "#84cc16", // lime
  "#22c55e", // green
  "#10b981", // emerald
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#0ea5e9", // sky
] as const

export type HabitColor = (typeof HABIT_COLORS)[number]
export type HabitIcon = (typeof HABIT_ICONS)[number]