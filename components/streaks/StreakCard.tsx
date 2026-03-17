"use client"

// components/streaks/StreakCard.tsx
// ─────────────────────────────────────────────────────────────────────────────
// STREAK CARD — Expandable card for each habit showing:
//   • Current + longest streak
//   • 12-week heatmap
//   • Milestone badges
//   • Completion rate bar
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flame, TrendingUp, Trophy, ChevronDown } from "lucide-react"
import { HeatmapCalendar } from "./HeatmapCalendar"
import { MilestoneBadges } from "./MilestoneBadge"
import type { HabitStreakDetail } from "@/types"

interface StreakCardProps {
  habit: HabitStreakDetail
  rank: number    // 1-based rank by streak length
}

export function StreakCard({ habit, rank }: StreakCardProps) {
  const [expanded, setExpanded] = useState(false)

  const isOnFire = habit.currentStreak >= 7
  const rankColors = ["#f59e0b", "#94a3b8", "#cd7c2e"] // gold, silver, bronze

  return (
    <motion.div
      layout
      className="bg-surface border border-theme rounded-2xl overflow-hidden card-shadow"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (rank - 1) * 0.06 }}
    >
      {/* ── Header row ──────────────────────────────────────────────────────── */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-surface-2 transition-all"
      >
        {/* Rank badge */}
        {rank <= 3 && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
            style={{ background: rankColors[rank - 1] }}
          >
            {rank}
          </div>
        )}

        {/* Habit icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        // style={{ background: hexWithOpacity(habit.color, 0.12) }}
        >
          {habit.icon}
        </div>

        {/* Name + completion bar */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-semibold text-fore truncate">{habit.name}</span>
            {isOnFire && <Flame className="w-4 h-4 text-orange-500 flex-shrink-0" />}
          </div>
          {/* Completion rate bar */}
          <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${habit.completionRate}%`, background: habit.color }}
            />
          </div>
          <span className="text-[10px] text-fore-3 mt-0.5 block">
            {habit.completionRate}% last 30 days
          </span>
        </div>

        {/* Streak numbers */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Current streak */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span
                className="text-xl font-bold leading-none"
                style={{ color: habit.currentStreak > 0 ? habit.color : undefined }}
              >
                {habit.currentStreak}
              </span>
            </div>
            <span className="text-[10px] text-fore-3">current</span>
          </div>

          {/* Longest streak */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-lg font-bold leading-none text-fore">
                {habit.longestStreak}
              </span>
            </div>
            <span className="text-[10px] text-fore-3">best</span>
          </div>

          {/* Expand chevron */}
          <ChevronDown
            className={`w-4 h-4 text-fore-3 transition-transform duration-200 ${expanded ? "rotate-180" : ""
              }`}
          />
        </div>
      </button>

      {/* ── Expanded detail ──────────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-theme pt-4 flex flex-col gap-5">

              {/* Milestones */}
              <div>
                <p className="text-xs font-semibold text-fore-2 mb-2 uppercase tracking-wider">
                  Milestones
                </p>
                <MilestoneBadges
                  milestones={habit.milestones}
                  color={habit.color}
                  currentStreak={habit.currentStreak}
                />
              </div>

              {/* Heatmap */}
              <div className="bg-surface-2 -mx-4 px-4 py-6 border-y border-theme/50">
                <p className="text-[10px] font-bold text-fore-3 mb-4 uppercase tracking-[0.2em] px-2">
                  Last 12 Weeks
                </p>
                <HeatmapCalendar data={habit.heatmap} color={habit.color} />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
