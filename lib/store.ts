// lib/store.ts
// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STATE — Zustand
// Manages habits list and swipe queue in memory.
// This avoids prop-drilling and unnecessary re-fetches.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand"
import type { HabitWithStats, TodayHabit, DashboardStats } from "@/types"
import { todayString } from "@/lib/utils"
import { API_ROUTES } from "@/lib/constants/api-routes"

interface HabitStore {
  // ── State ─────────────────────────────────────────────────────────────────
  habits: HabitWithStats[]
  todayHabits: TodayHabit[]    // habits pending swipe today
  stats: DashboardStats | null
  isLoading: boolean
  error: string | null

  // ── Actions ───────────────────────────────────────────────────────────────
  fetchHabits: () => Promise<void>
  fetchStats: () => Promise<void>
  addHabit: (habit: HabitWithStats) => void
  updateHabit: (id: string, updates: Partial<HabitWithStats>) => void
  removeHabit: (id: string) => void
  markSwiped: (habitId: string, status: "DONE" | "SKIPPED") => void
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  todayHabits: [],
  stats: null,
  isLoading: false,
  error: null,

  fetchHabits: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(API_ROUTES.HABITS.BASE)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      const habits: HabitWithStats[] = json.data

      // Today's habits = those without a log for today
      const today = todayString()
      const todayHabits = habits.filter((h) => !h.todayLog)

      set({ habits, todayHabits, isLoading: false })
    } catch (err: any) {
      set({ error: err.message, isLoading: false })
    }
  },

  fetchStats: async () => {
    try {
      const res = await fetch(API_ROUTES.STATS.BASE)
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
}))
