// app/(dashboard)/page.tsx  →  route: /
// ─────────────────────────────────────────────────────────────────────────────
// TODAY PAGE — The main swipe interface
// This is what users see first after login.
// ─────────────────────────────────────────────────────────────────────────────

"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { SwipeDeck } from "@/components/habits/SwipeDeck"
import { ProgressRing } from "@/components/shared/StreakBadge"
import { useHabits } from "@/hooks/useHabits"
import { formatDisplayDate } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/Skeleton"

export default function TodayPage() {
  const { habits, todayHabits, isLoading, isInitialized, fetchHabits } = useHabits()

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
            Today
          </p>
          <h1
            className="text-2xl text-fore leading-tight"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Daily Habits
          </h1>
        </div>

        {/* Progress ring skeleton or actual */}
        {(!isInitialized || isLoading) ? (
          <div className="h-[52px] w-[52px] rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse border-4 border-slate-200 dark:border-slate-700" />
        ) : (
          <ProgressRing
            percent={percent}
            size={52}
            strokeWidth={4}
            color="#6366f1"
            label="done"
          />
        )}
      </header>

      {/* ── Spacer removed as header is not absolute ─────────────────────────── */}
      <div className="h-4 shrink-0" />

      {/* ── Swipe area ──────────────────────────────────────────────────────── */}
      <div className="flex-1 px-6 pb-4 relative">
        {(!isInitialized || isLoading) ? (
          <div className="w-full h-full relative flex items-center justify-center">
            {/* Skeleton Card Stack */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full max-w-sm aspect-[3/4] bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse scale-[0.92] translate-y-8 opacity-40 border border-theme" />
              <div className="absolute w-full max-w-sm aspect-[3/4] bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse scale-[0.96] translate-y-4 opacity-70 border border-theme" />
              <div className="absolute w-full max-w-sm aspect-[3/4] bg-slate-50 dark:bg-slate-900 rounded-3xl animate-pulse shadow-xl border border-theme">
                <div className="h-full w-full flex flex-col items-center justify-center gap-6 p-8">
                  <div className="w-28 h-28 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="w-32 h-6 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                  <div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ) : totalHabits === 0 ? (
          // Premium Empty state
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              className="relative w-32 h-32 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Abstract Floating Shapes */}
              <motion.div
                className="absolute inset-0 bg-indigo-500 rounded-3xl mix-blend-multiply dark:mix-blend-screen opacity-20 filter blur-xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-2 glass rounded-2xl flex items-center justify-center text-4xl z-10"
                animate={{ y: [-5, 5, -5], rotateZ: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                ✨
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -right-4 w-12 h-12 glass rounded-full flex items-center justify-center text-xl z-20"
                animate={{ y: [5, -5, 5], rotateZ: [10, -10, 10] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                🎯
              </motion.div>
              <motion.div
                className="absolute -top-4 -left-4 w-10 h-10 glass rounded-full flex items-center justify-center text-lg z-0"
                animate={{ y: [-3, 3, -3], rotateZ: [-10, 10, -10] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                ⚡
              </motion.div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2
                className="text-2xl text-fore mb-2"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                Your canvas awaits
              </h2>
              <p className="text-fore-2 text-sm max-w-[260px] mx-auto mb-8">
                Design your day. Create your first habit and build a better routine today.
              </p>
              <Link href="/habits">
                <motion.div whileHover="hover">
                  <Button variant="gradient" size="lg" className="rounded-2xl px-8 shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform">
                    <motion.div
                      variants={{
                        hover: { rotate: 180, scale: 1.2 }
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="mr-1 inline-flex"
                    >
                      <Plus className="w-5 h-5" />
                    </motion.div>
                    Create First Habit
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        ) : (
          <SwipeDeck habits={todayHabits} />
        )}
      </div>

      {/* ── Quick stats bar ──────────────────────────────────────────────────── */}
      {(!isInitialized || isLoading) ? (
        <div className="px-6 pb-4 flex items-center gap-2 overflow-hidden">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-8 w-24 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse border border-theme shrink-0" />
          ))}
        </div>
      ) : totalHabits > 0 && (
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
