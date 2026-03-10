// app/(dashboard)/page.tsx  →  route: /
// ─────────────────────────────────────────────────────────────────────────────
// TODAY PAGE — The main swipe interface
// This is what users see first after login.
// ─────────────────────────────────────────────────────────────────────────────

"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { SwipeDeck } from "@/components/habits/SwipeDeck"
import { ProgressRing } from "@/components/shared/StreakBadge"
import { useHabits } from "@/hooks/useHabits"
import { formatDisplayDate } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function TodayPage() {
  const { habits, todayHabits, isLoading, fetchHabits } = useHabits()

  useEffect(() => {
    fetchHabits()
  }, [])

  const totalHabits = habits.length
  const completedToday = habits.filter((h) => h.todayLog?.status === "DONE").length
  const percent = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 pt-8 pb-4">
        <div>
          <p className="text-xs font-medium text-fore-3 uppercase tracking-wider mb-0.5">
            {formatDisplayDate(new Date())}
          </p>
          <h1
            className="text-2xl text-fore leading-tight"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Today&apos;s Habits
          </h1>
        </div>

        {/* Progress ring */}
        <ProgressRing
          percent={percent}
          size={64}
          strokeWidth={5}
          color="#6366f1"
          label="done"
        />
      </header>

      {/* ── Swipe area ──────────────────────────────────────────────────────── */}
      <div className="flex-1 px-6 pb-4 relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
              <p className="text-fore-3 text-sm">Loading your habits...</p>
            </div>
          </div>
        ) : totalHabits === 0 ? (
          // Empty state — no habits yet
          <motion.div
            className="flex flex-col items-center justify-center h-full gap-5 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-6xl">✨</div>
            <div>
              <h2
                className="text-2xl text-fore mb-2"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                No habits yet
              </h2>
              <p className="text-fore-2 text-sm max-w-xs">
                Create your first habit and start building a better routine today.
              </p>
            </div>
            <Link href="/habits">
              <Button variant="gradient" size="lg">
                <Plus className="w-5 h-5" />
                Create First Habit
              </Button>
            </Link>
          </motion.div>
        ) : (
          <SwipeDeck habits={todayHabits} />
        )}
      </div>

      {/* ── Quick stats bar ──────────────────────────────────────────────────── */}
      {totalHabits > 0 && (
        <div className="px-6 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-theme"
                style={{
                  background: habit.todayLog
                    ? habit.color + "18"
                    : undefined,
                  borderColor: habit.todayLog ? habit.color + "40" : undefined,
                  color: habit.todayLog ? habit.color : undefined,
                }}
              >
                <span>{habit.icon}</span>
                <span className="max-w-[80px] truncate">{habit.name}</span>
                {habit.todayLog?.status === "DONE" && <span>✓</span>}
                {habit.todayLog?.status === "SKIPPED" && <span>—</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
