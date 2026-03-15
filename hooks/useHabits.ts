// hooks/useHabits.ts
// ─────────────────────────────────────────────────────────────────────────────
// HABITS HOOK — Wraps API calls with loading/error state
// Components call these functions instead of fetch() directly.
// ─────────────────────────────────────────────────────────────────────────────

import { useHabitStore } from "@/lib/store"
import { todayString } from "@/lib/utils"
import { API_ROUTES } from "@/lib/constants/api-routes"
import type { CreateHabitInput, UpdateHabitInput } from "@/types"

export function useHabits() {
  const store = useHabitStore()

  // ── Create habit ───────────────────────────────────────────────────────────
  const createHabit = async (input: CreateHabitInput) => {
    const res = await fetch(API_ROUTES.HABITS.BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error)

    const newHabit = {
      ...json.data,
      todayLog: null,
      currentStreak: 0,
      longestStreak: 0,
      completionRate: 0,
    }
    store.addHabit(newHabit)
    return newHabit
  }

  // ── Update habit ───────────────────────────────────────────────────────────
  const updateHabit = async (id: string, input: UpdateHabitInput) => {
    const res = await fetch(API_ROUTES.HABITS.BY_ID(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error)

    store.updateHabit(id, json.data)
    return json.data
  }

  // ── Delete habit ───────────────────────────────────────────────────────────
  const deleteHabit = async (id: string) => {
    const res = await fetch(API_ROUTES.HABITS.BY_ID(id), { method: "DELETE" })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error)

    store.removeHabit(id)
  }

  // ── Swipe (log completion) ─────────────────────────────────────────────────
  const swipeHabit = async (habitId: string, status: "DONE" | "SKIPPED") => {
    // Optimistic update — remove card immediately for snappy UX
    store.markSwiped(habitId, status)

    try {
      const res = await fetch(API_ROUTES.LOGS.BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId, status, date: todayString() }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
    } catch (err) {
      // If API fails, re-fetch to restore correct state
      store.fetchHabits()
      throw err
    }
  }

  return {
    habits: store.habits,
    todayHabits: store.todayHabits,
    stats: store.stats,
    isLoading: store.isLoading,
    error: store.error,
    fetchHabits: store.fetchHabits,
    fetchStats: store.fetchStats,
    createHabit,
    updateHabit,
    deleteHabit,
    swipeHabit,
  }
}
