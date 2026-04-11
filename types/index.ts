// types/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL TYPES — Single source of truth
// Import from here everywhere, never redefine
// ─────────────────────────────────────────────────────────────────────────────

export type HabitFrequency = "DAILY" | "WEEKLY"
export type LogStatus = "DONE" | "SKIPPED"

// ─── DB Models (mirror Prisma types for frontend use) ────────────────────────
export interface User {
  id: string
  email: string
  name: string | null
  username: string | null
  image: string | null
  createdAt: Date
}

export interface Habit {
  id: string
  userId: string
  name: string
  icon: string
  color: string
  frequency: HabitFrequency
  targetDays: number
  isArchived: boolean
  sortOrder: number
  reminderTime: string | null   // e.g. "07:00"
  emailReminders: boolean
  createdAt: Date
  updatedAt: Date
}

export interface HabitLog {
  id: string
  habitId: string
  userId: string
  date: Date
  status: LogStatus
  createdAt: Date
}

export interface SnapShareLog {
  id: string
  userId: string
  date: Date
  createdAt: Date
}

// ─── Enriched types (DB + computed) ──────────────────────────────────────────
export interface HabitWithStats extends Habit {
  currentStreak: number       // consecutive days completed
  longestStreak: number       // all-time best streak
  completionRate: number      // 0–100 percent last 30 days
  todayLog: HabitLog | null   // today's log if exists
}

export interface TodayHabit extends Habit {
  todayLog: HabitLog | null   // null = not yet swiped
}

// ─── API Response shapes ─────────────────────────────────────────────────────
export interface ApiResponse<T = void> {
  data?: T
  error?: string
}

// ─── Form input types ────────────────────────────────────────────────────────
export interface CreateHabitInput {
  name: string
  icon: string
  color: string
  frequency: HabitFrequency
  targetDays: number
}

export interface UpdateHabitInput extends Partial<CreateHabitInput> {
  isArchived?: boolean
  sortOrder?: number
  reminderTime?: string | null
  emailReminders?: boolean
}

export interface SwipeInput {
  habitId: string
  status: LogStatus
  date: string // ISO date string "YYYY-MM-DD"
}

// ─── Dashboard stats ─────────────────────────────────────────────────────────
export interface DashboardStats {
  totalHabits: number
  completedToday: number
  skippedToday: number
  pendingToday: number
  completionPercent: number   // 0–100
  currentBestStreak: number   // highest streak across all habits
  weeklyData: WeeklyDataPoint[]
}

export interface WeeklyDataPoint {
  date: string      // "Mon", "Tue" etc
  fullDate: string  // "2026-03-24"
  completed: number
  total: number
}

// ─── Analytics stats ────────────────────────────────────────────────────────
export interface AnalyticsStats {
  periodLabel: string         // "March 2026" or "Year 2026"
  completionRate: number      // Current month or year
  completionRateTrend: number // +4% vs last period
  totalCheckIns: number
  totalCheckInsTrend: number
  perfectDays: number
  perfectDaysTrend: number
  longestStreak: number       // All-time best streak across habits
  bestHabitName: string       // Habit name for the longest streak
  chartLabels: string[]       // ["Mon", "Tue"...] or ["Jan", "Feb"...]
  chartData: number[]         // Array of completions per label
  overallRate: number
  morningRate: number
  eveningRate: number
  habitDistribution: { name: string; value: number; color: string }[]
  habitPerformance: HabitPerformanceItem[]
}

export interface HabitPerformanceItem {
  id: string
  name: string
  icon: string
  color: string
  completionRate: number      // Current month
}

// Add this BEFORE HabitStreakDetail
export interface StreakMilestone {
  id: string
  userId: string
  habitId: string
  milestone: number
  achieved: boolean
  achievedAt: Date | null
  createdAt: Date
}

// Then this after
export interface HabitStreakDetail {
  habitId: string
  name: string
  icon: string
  color: string
  currentStreak: number
  longestStreak: number
  completionRate: number
  lastStreakDate: Date | null
  milestones: StreakMilestone[]
  heatmap: HeatmapDay[]
}

export interface HeatmapDay {
  date: string
  status: LogStatus | null
}

export interface GlobalHeatmapDay {
  date: string
  count: number // number of habits done
}

export interface DailyTrendPoint {
  date: string
  completions: number
}

export interface HabitDistributionPoint {
  name: string
  value: number
  color: string
}

export interface MonthlyPerformancePoint {
  month: string
  completions: number
  fill: string
}

export interface StreakPageData {
  overallCurrentStreak: number
  overallLongestStreak: number
  totalDaysTracked: number
  perfectDays: number
  habits: HabitStreakDetail[]
  globalHeatmap: GlobalHeatmapDay[]
  dailyTrend: DailyTrendPoint[]
  habitDistribution: HabitDistributionPoint[]
  monthlyPerformance: MonthlyPerformancePoint[]
}

// ─── History Drawer types ──────────────────────────────────────────────────
export interface HistoryDay {
  l: string               // "M", "T" etc
  n: number               // completed count
  t: number               // total count
}

export interface HistoryWeek {
  range: string           // "Mar 17–23"
  rate: number            // 89
  rateClass: string       // "rate-hi", "rate-md", "rate-lo"
  days: HistoryDay[]
  habits: {
    icon: string
    name: string
    pct: number
    color: string
  }[]
}

export interface MonthHeatmap {
  name: string            // "March 2026"
  offset: number          // 4
  data: number[]          // count per day
  today: number           // index of today or -1
}

export interface InsightItem {
  title: string
  text: string
  icon?: string           // SVG markup string or emoji
}

export interface HistoryData {
  weeks: HistoryWeek[]
  months: MonthHeatmap[]
  summary: {
    bestStreak: number
    thisMonthRate: number
    perfectDays: number
  }
  insights: InsightItem[]
}



// ─── Swipe card state ────────────────────────────────────────────────────────
export type SwipeDirection = "left" | "right" | null
export type CardState = "idle" | "swiping-left" | "swiping-right" | "done"
export const MILESTONE_DAYS = [7, 14, 30, 60, 100] as const
export type MilestoneDay = typeof MILESTONE_DAYS[number]

export type ChartTooltipContentProps = {
  active?: boolean
  payload?: any[]
  label?: string
  className?: string
  hideLabel?: boolean
  hideIndicator?: boolean
  indicator?: "line" | "dot" | "dashed"
  nameKey?: string
  labelKey?: string
}