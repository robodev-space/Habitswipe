"use client"

// components/streaks/MilestoneBadge.tsx
// ─────────────────────────────────────────────────────────────────────────────
// MILESTONE BADGE — Shows 7/14/30/60/100 day achievement badges
// Achieved = colored + animated. Locked = greyed out.
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { MILESTONE_DAYS } from "@/types"
import type { StreakMilestone } from "@/types"

interface MilestoneBadgesProps {
  milestones: StreakMilestone[]
  color: string
  currentStreak: number
}

const MILESTONE_LABELS: Record<number, { emoji: string; label: string }> = {
  7:   { emoji: "🌱", label: "1 Week" },
  14:  { emoji: "🔥", label: "2 Weeks" },
  30:  { emoji: "⚡", label: "1 Month" },
  60:  { emoji: "💎", label: "2 Months" },
  100: { emoji: "👑", label: "100 Days" },
}

export function MilestoneBadges({ milestones, color, currentStreak }: MilestoneBadgesProps) {
  const achievedSet = new Set(
    milestones.filter((m) => m.achieved).map((m) => m.milestone)
  )

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {MILESTONE_DAYS.map((days, i) => {
        const achieved = achievedSet.has(days)
        const isNext = !achieved && currentStreak < days &&
          (i === 0 || achievedSet.has(MILESTONE_DAYS[i - 1]))
        const info = MILESTONE_LABELS[days]

        return (
          <motion.div
            key={days}
            initial={achieved ? { scale: 0.8, opacity: 0 } : false}
            animate={achieved ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 400, damping: 25 }}
            title={achieved ? `${info.label} achieved!` : `${days - currentStreak} days to go`}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl",
              "border transition-all duration-200 cursor-default",
              achieved
                ? "border-transparent"
                : isNext
                ? "border-dashed border-slate-300 dark:border-slate-600"
                : "border-transparent opacity-40"
            )}
            style={
              achieved
                ? { background: color + "18", borderColor: color + "40" }
                : undefined
            }
          >
            <span className="text-xl">{info.emoji}</span>
            <span
              className="text-[10px] font-semibold"
              style={achieved ? { color } : undefined}
            >
              {days}d
            </span>
            {isNext && (
              <span className="text-[9px] text-fore-3">
                -{days - currentStreak}
              </span>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
