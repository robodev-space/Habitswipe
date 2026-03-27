// lib/store.ts
// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STATE — Zustand
// Manages habits list and swipe queue in memory.
// This avoids prop-drilling and unnecessary re-fetches.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand"
import type { HabitWithStats, TodayHabit, DashboardStats } from "@/types"
import { API_ROUTES } from "@/lib/constants/api-routes"

interface HabitStore {
  // ── State ─────────────────────────────────────────────────────────────────
  habits: HabitWithStats[]
  todayHabits: TodayHabit[]    // habits pending swipe today
  stats: DashboardStats | null
  isLoading: boolean
  isInitialized: boolean
  error: string | null

  // ── Actions ───────────────────────────────────────────────────────────────
  fetchHabits: () => Promise<void>
  fetchStats: () => Promise<void>
  addHabit: (habit: HabitWithStats) => void
  updateHabit: (id: string, updates: Partial<HabitWithStats>) => void
  removeHabit: (id: string) => void
  markSwiped: (habitId: string, status: "DONE" | "SKIPPED") => void
  // Helper to get a fresh signal and abort previous
  getAbortSignal: (key: string) => AbortSignal
}

// Track controllers outside store to avoid serialization issues if any
const controllers: Record<string, AbortController> = {}

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  todayHabits: [],
  stats: null,
  isLoading: true,
  isInitialized: false,
  error: null,

  fetchHabits: async () => {
    const signal = get().getAbortSignal("fetchHabits")
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(API_ROUTES.HABITS.BASE, { signal })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      const habits: HabitWithStats[] = json.data

      // todayHabits = habits that haven't been logged today yet (todayLog set by API)
      const todayHabits = habits.filter((h) => !h.todayLog)

      set({ habits, todayHabits, isLoading: false, isInitialized: true })
    } catch (err: any) {
      set({ error: err.message, isLoading: false, isInitialized: true })
    }
  },

  fetchStats: async () => {
    const signal = get().getAbortSignal("fetchStats")
    try {
      const res = await fetch(API_ROUTES.STATS.BASE, { signal })
      const json = await res.json()
      if (res.ok) set({ stats: json.data })
    } catch {
      // Stats are non-critical, silent fail
    }
  },

  addHabit: (habit) =>
    set((state) => ({
      habits: [...state.habits, habit],
      todayHabits: [...state.todayHabits, habit],
    })),

  updateHabit: (id, updates) =>
    set((state) => ({
      habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
    })),

  removeHabit: (id) =>
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
      todayHabits: state.todayHabits.filter((h) => h.id !== id),
    })),

  // Called after successful swipe — remove card from queue
  markSwiped: (habitId, status) =>
    set((state) => ({
      todayHabits: state.todayHabits.filter((h) => h.id !== habitId),
      habits: state.habits.map((h) =>
        h.id === habitId
          ? {
            ...h,
            todayLog: {
              id: "optimistic",
              habitId,
              userId: "",
              date: new Date(),
              status,
              createdAt: new Date(),
            },
            currentStreak:
              status === "DONE" ? h.currentStreak + 1 : h.currentStreak,
          }
          : h
      ),
    })),

  getAbortSignal: (key: string) => {
    if (controllers[key]) {
      controllers[key].abort()
    }
    controllers[key] = new AbortController()
    return controllers[key].signal
  },
}))
