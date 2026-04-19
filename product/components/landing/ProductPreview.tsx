"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Check, X, Flame, Trophy, Zap } from "lucide-react"
import Image from "next/image"

const DEMO_HABITS = [
  { name: "Morning Workout", emoji: "🏋️", streak: 12, color: "#6366f1" },
  { name: "Read 30 mins", emoji: "📖", streak: 8, color: "#3b82f6" },
  { name: "Drink 2L Water", emoji: "💧", streak: 21, color: "#06b6d4" },
  { name: "Meditate", emoji: "🧘", streak: 5, color: "#8b5cf6" },
  { name: "Journal", emoji: "📝", streak: 14, color: "#10b981" },
]

export function ProductPreview() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [action, setAction] = useState<"done" | "skip" | null>(null)
  const [completedCount, setCompletedCount] = useState(0)
  const [phase, setPhase] = useState<"idle" | "clicking" | "exiting" | "paused">("idle")
  const [activeBtn, setActiveBtn] = useState<"done" | "skip" | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (phase === "idle") {
        // Simulate button press
        const act = currentIndex % 3 === 2 ? "skip" : "done"
        setActiveBtn(act)
        setPhase("clicking")
      } else if (phase === "clicking") {
        // Show result overlay on card
        setAction(activeBtn)
        setPhase("exiting")
      } else if (phase === "exiting") {
        // Card exits
        if (action === "done") setCompletedCount((c) => c + 1)
        setPhase("paused")
      } else if (phase === "paused") {
        // Reset for next card
        setAction(null)
        setActiveBtn(null)
        if (currentIndex >= DEMO_HABITS.length - 1) {
          setCurrentIndex(0)
          setCompletedCount(0)
        } else {
          setCurrentIndex((i) => i + 1)
        }
        setPhase("idle")
      }
    }, phase === "idle" ? 1400 : phase === "clicking" ? 400 : phase === "exiting" ? 500 : 350)

    return () => clearTimeout(timer)
  }, [phase, currentIndex, activeBtn, action])

  const habit = DEMO_HABITS[currentIndex]

  return (
    <div className="w-full h-full bg-[#0c0c1a] rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col">
      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 sm:px-8 pt-5 sm:pt-6 pb-3">
        <div className="flex items-center gap-2">
          {/* <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <span className="text-[8px] font-black text-white">100x</span>
          </div> */}
          <Image src="/favicon.ico" alt="HabitClick" width={24} height={24} />
          <span className="text-xs sm:text-sm font-bold text-white/80">Today</span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
          <Flame className="w-3 h-3 text-amber-400" />
          <span className="text-[10px] font-bold text-amber-400">{habit.streak} day streak</span>
        </div>
      </div>

      {/* ── Greeting ────────────────────────────────────────────────────── */}
      <div className="px-5 sm:px-8 pb-3">
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Good morning</p>
        <p className="text-base sm:text-lg font-bold text-white/90" style={{ fontFamily: "var(--font-dm-serif)" }}>
          Let&apos;s build today. 💪
        </p>
      </div>

      {/* ── Progress ────────────────────────────────────────────────────── */}
      <div className="px-5 sm:px-8 pb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-zinc-500 font-medium">
            {completedCount}/{DEMO_HABITS.length} completed
          </span>
          <span className="text-[10px] text-indigo-400 font-bold">
            {Math.round((completedCount / DEMO_HABITS.length) * 100)}%
          </span>
        </div>
        <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
            animate={{ width: `${(completedCount / DEMO_HABITS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* ── Habit Card ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-2 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: action ? 0 : 1,
              y: action ? -30 : 0,
              scale: action ? 0.9 : 1,
            }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full max-w-[280px] relative"
          >
            {/* Result flash overlay */}
            <AnimatePresence>
              {action && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex items-center justify-center"
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${action === "done"
                      ? "bg-emerald-500/20 border-2 border-emerald-500/50"
                      : "bg-red-500/20 border-2 border-red-500/50"
                      }`}
                  >
                    {action === "done" ? (
                      <Check className="w-8 h-8 text-emerald-400" />
                    ) : (
                      <X className="w-8 h-8 text-red-400" />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Card */}
            <div
              className="rounded-2xl border border-white/[0.08] p-5 sm:p-6 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${habit.color}08, transparent 60%)`,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl sm:text-4xl">{habit.emoji}</div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.05]">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span className="text-[10px] font-bold text-zinc-400">{habit.streak}</span>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white/90 mb-1">{habit.name}</h3>
              <p className="text-xs text-zinc-500 mb-5">
                {currentIndex + 1} of {DEMO_HABITS.length} habits today
              </p>

              {/* Action Buttons — click based */}
              <div className="flex items-center gap-3">
                <motion.button
                  animate={{
                    scale: activeBtn === "skip" ? 0.92 : 1,
                    backgroundColor:
                      activeBtn === "skip"
                        ? "rgba(239, 68, 68, 0.15)"
                        : "rgba(255, 255, 255, 0.03)",
                    borderColor:
                      activeBtn === "skip"
                        ? "rgba(239, 68, 68, 0.4)"
                        : "rgba(255, 255, 255, 0.08)",
                  }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold"
                >
                  <X className={`w-4 h-4 ${activeBtn === "skip" ? "text-red-400" : "text-zinc-500"}`} />
                  <span className={activeBtn === "skip" ? "text-red-400" : "text-zinc-500"}>
                    Skip
                  </span>
                </motion.button>

                <motion.button
                  animate={{
                    scale: activeBtn === "done" ? 0.92 : 1,
                    backgroundColor:
                      activeBtn === "done"
                        ? "rgba(16, 185, 129, 0.15)"
                        : "rgba(99, 102, 241, 0.08)",
                    borderColor:
                      activeBtn === "done"
                        ? "rgba(16, 185, 129, 0.4)"
                        : "rgba(99, 102, 241, 0.2)",
                  }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold"
                >
                  <Check
                    className={`w-4 h-4 ${activeBtn === "done" ? "text-emerald-400" : "text-indigo-400"
                      }`}
                  />
                  <span className={activeBtn === "done" ? "text-emerald-400" : "text-indigo-400"}>
                    Done
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom Stats ────────────────────────────────────────────────── */}
      <div className="px-5 sm:px-8 pb-5 sm:pb-6 pt-2">
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Trophy, label: "Best", value: "21 days", color: "text-amber-400" },
            { icon: Zap, label: "Today", value: `${completedCount} done`, color: "text-indigo-400" },
            { icon: Flame, label: "Rate", value: "94%", color: "text-emerald-400" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <stat.icon className={`w-3.5 h-3.5 ${stat.color} mx-auto mb-1`} />
              <p className="text-[10px] font-bold text-white/70">{stat.value}</p>
              <p className="text-[8px] text-zinc-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
