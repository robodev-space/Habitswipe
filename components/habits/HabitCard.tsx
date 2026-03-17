// components/habits/HabitCard.tsx
// ─────────────────────────────────────────────────────────────────────────────
// HABIT SWIPE CARD — The core UI of the app
//
// Design: Large card with emoji + name + streak.
// Drag right → green DONE overlay appears → release triggers completion
// Drag left  → red SKIP overlay appears  → release triggers skip
// Animated with Framer Motion for smooth feel
// ─────────────────────────────────────────────────────────────────────────────

"use client"

import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion"
import { Flame, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TodayHabit } from "@/types"

interface HabitCardProps {
  habit: TodayHabit
  onSwipeRight: () => void   // DONE
  onSwipeLeft: () => void    // SKIP
  isTop: boolean             // only top card is interactive
  stackIndex: number         // 0=top, 1=behind, 2=further back
}

const SWIPE_THRESHOLD = 120  // px to trigger a swipe

export function HabitCard({
  habit,
  onSwipeRight,
  onSwipeLeft,
  isTop,
  stackIndex,
}: HabitCardProps) {
  const x = useMotionValue(0)

  // Rotate card slightly as it drags with 3D effect
  const rotate = useTransform(x, [-300, 0, 300], [-5, 0, 5])
  const rotateY = useTransform(x, [-300, 0, 300], [-10, 0, 10])
  const rotateX = useTransform(x, [-300, 0, 300], [2, 0, 2])

  // Opacity of DONE/SKIP overlays
  const doneOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1])
  const skipOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0])

  // Draw paths for icons
  const drawDone = useTransform(x, [SWIPE_THRESHOLD * 0.2, SWIPE_THRESHOLD], [0, 1])
  const drawSkip = useTransform(x, [-SWIPE_THRESHOLD * 0.2, -SWIPE_THRESHOLD], [0, 1])

  function handleDragEnd(_: any, info: { offset: { x: number } }) {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipeRight()
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipeLeft()
    }
    // Framer snaps back automatically via dragElastic
  }

  // Stack depth visual offset
  const stackY = stackIndex * 8
  const stackScale = 1 - stackIndex * 0.04

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        y: stackY,
        scale: stackScale,
        zIndex: 10 - stackIndex,
        perspective: 1200,
      }}
      animate={{ y: stackY, scale: stackScale }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <motion.div
        className={cn(
          "relative w-full h-full rounded-3xl overflow-hidden",
          "bg-surface card-shadow select-none",
          "border border-theme",
          isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
        )}
        style={{ x, rotate, rotateY, rotateX }}
        drag={isTop ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        whileTap={isTop ? { scale: 1.02 } : {}}
      >
        {/* ── Habit color accent bar ────────────────────────────────────────── */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ background: habit.color }}
        />

        {/* ── DONE overlay (right swipe) ────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-start pl-10 rounded-3xl border-2 border-emerald-400"
          style={{
            opacity: doneOpacity,
            background: "radial-gradient(circle at left, rgba(16,185,129,0.3) 0%, rgba(16,185,129,0.05) 70%)",
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-emerald-500"
            >
              <motion.circle cx="12" cy="12" r="10" style={{ pathLength: drawDone }} />
              <motion.path d="m9 12 2 2 4-4" style={{ pathLength: drawDone }} />
            </motion.svg>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg drop-shadow-md">Done!</span>
          </div>
        </motion.div>

        {/* ── SKIP overlay (left swipe) ─────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-end pr-10 rounded-3xl border-2 border-red-400"
          style={{
            opacity: skipOpacity,
            background: "radial-gradient(circle at right, rgba(239,68,68,0.3) 0%, rgba(239,68,68,0.05) 70%)",
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-500"
            >
              <motion.circle cx="12" cy="12" r="10" style={{ pathLength: drawSkip }} />
              <motion.path d="m15 9-6 6" style={{ pathLength: drawSkip }} />
              <motion.path d="m9 9 6 6" style={{ pathLength: drawSkip }} />
            </motion.svg>
            <span className="text-red-500 font-semibold text-lg drop-shadow-md">Skip</span>
          </div>
        </motion.div>

        {/* ── Card content ──────────────────────────────────────────────────── */}
        <div className="relative h-full flex flex-col items-center justify-center gap-6 p-8">
          {/* Icon circle */}
          <div
            className="w-28 h-28 rounded-3xl flex items-center justify-center text-6xl shadow-inner"
          // style={{ background: hexWithOpacity(habit.color, 0.12) }}
          >
            {habit.icon}
          </div>

          {/* Habit name */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-fore mb-1" style={{ fontFamily: "var(--font-dm-serif)" }}>
              {habit.name}
            </h2>
            <p className="text-sm text-fore-2 capitalize">{habit.frequency.toLowerCase()}</p>
          </div>

          {/* Streak badge */}
          {(habit as any).currentStreak > 0 && (
            <div
              className="flex items-center gap-1.5 px-4 py-2 rounded-full"
            // style={{ background: hexWithOpacity(habit.color, 0.1) }}
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: habit.color, originX: 0.5, originY: 1 }}
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [-3, 3, -3]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
              </motion.svg>
              <span className="text-sm font-semibold text-[#39d353]">
                {(habit as any).currentStreak} day streak
              </span>
            </div>
          )}

          {/* Swipe hint — only on top card */}
          {isTop && (
            <div className="absolute bottom-6 flex items-center gap-8 text-xs text-fore-3">
              <span className="flex items-center gap-1">
                <span>←</span> Skip
              </span>
              <div
                className="w-1 h-1 rounded-full"
                style={{ background: habit.color }}
              />
              <span className="flex items-center gap-1">
                Done <span>→</span>
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
