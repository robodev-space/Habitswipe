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
  completed: number
  total: number
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



// ─── Swipe card state ────────────────────────────────────────────────────────
export type SwipeDirection = "left" | "right" | null
export type CardState = "idle" | "swiping-left" | "swiping-right" | "done"
export const MILESTONE_DAYS = [7, 14, 30, 60, 100] as const
export type MilestoneDay = typeof MILESTONE_DAYS[number]