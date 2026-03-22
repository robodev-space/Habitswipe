// hooks/useMissedHabits.ts
// ─────────────────────────────────────────────────────────────────────────────
// Fetches habits that were missed yesterday and exposes an addToToday action.
// Reuses the existing POST /api/logs endpoint to log status DONE for today.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react"
import { API_ROUTES } from "@/lib/constants/api-routes"
import { todayString } from "@/lib/utils"

export interface MissedHabit {
  id: string
  icon: string
  name: string
  color: string
  frequency: "DAILY" | "WEEKLY"
  targetDays: number
  streakLost: number
  category: "daily" | "weekly"
  freq: string
  hist: string[]
}

interface UseMissedHabitsResult {
  missedHabits: MissedHabit[]
  isLoading: boolean
  yesterday: string
  refetch: () => void
  addToToday: (habitId: string) => Promise<void>
}

export function useMissedHabits(): UseMissedHabitsResult {
  const [missedHabits, setMissedHabits] = useState<MissedHabit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [yesterday, setYesterday] = useState("")

  const fetchMissed = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(API_ROUTES.HABITS.MISSED)
      const json = await res.json()
      if (res.ok) {
        setMissedHabits(json.data ?? [])
        setYesterday(json.yesterday ?? "")
      }
    } catch {
      // Non-critical — silent fail
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMissed()
  }, [fetchMissed])

  const addToToday = useCallback(async (habitId: string) => {
    const res = await fetch(API_ROUTES.LOGS.BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        habitId,
        status: "DONE",
        date: todayString(),
      }),
    })
    if (!res.ok) {
      const json = await res.json()
      throw new Error(json.error || "Failed to add habit")
    }
  }, [])

  return {
    missedHabits,
    isLoading,
    yesterday,
    refetch: fetchMissed,
    addToToday,
  }
}
