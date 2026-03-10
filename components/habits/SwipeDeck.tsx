// components/habits/SwipeDeck.tsx
// ─────────────────────────────────────────────────────────────────────────────
// SWIPE DECK — Renders a stack of HabitCards and handles swipe → API calls
// Shows completion screen when all cards are done
// ─────────────────────────────────────────────────────────────────────────────

"use client"

import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, PartyPopper } from "lucide-react"
import { HabitCard } from "./HabitCard"
import { Button } from "@/components/ui/Button"
import { useHabits } from "@/hooks/useHabits"
import type { TodayHabit } from "@/types"

const MAX_VISIBLE_CARDS = 3  // how many cards visible in stack at once

interface SwipeDeckProps {
  habits: TodayHabit[]
}

export function SwipeDeck({ habits }: SwipeDeckProps) {
  const { swipeHabit } = useHabits()

  // Show only top N cards in the visual stack
  const visibleHabits = habits.slice(0, MAX_VISIBLE_CARDS)

  async function handleSwipe(habitId: string, status: "DONE" | "SKIPPED") {
    try {
      await swipeHabit(habitId, status)
    } catch (err) {
      console.error("Swipe failed:", err)
    }
  }

  // ── All done! ─────────────────────────────────────────────────────────────
  if (habits.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-full gap-6 text-center px-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-7xl"
        >
          🎉
        </motion.div>
        <div>
          <h2
            className="text-3xl text-fore mb-2"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            All done today!
          </h2>
          <p className="text-fore-2 text-sm leading-relaxed max-w-xs">
            You&apos;ve completed all your habits. Come back tomorrow to keep your streaks alive.
          </p>
        </div>
        <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">
            Streak maintained 🔥
          </span>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="popLayout">
        {visibleHabits.map((habit, index) => (
          <motion.div
            key={habit.id}
            className="absolute inset-0"
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{
              x: 0,
              opacity: 0,
              scale: 0.8,
              transition: { duration: 0.2 },
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <HabitCard
              habit={habit}
              isTop={index === 0}
              stackIndex={index}
              onSwipeRight={() => handleSwipe(habit.id, "DONE")}
              onSwipeLeft={() => handleSwipe(habit.id, "SKIPPED")}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Remaining count badge */}
      {habits.length > 1 && (
        <div className="absolute -top-10 right-0 text-xs text-fore-3 font-medium">
          {habits.length} remaining
        </div>
      )}
    </div>
  )
}
