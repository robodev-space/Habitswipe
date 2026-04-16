// components/shared/StreakBadge.tsx
// ─────────────────────────────────────────────────────────────────────────────
// STREAK BADGE — Reusable streak display with flame icon
// ─────────────────────────────────────────────────────────────────────────────
'use client'
import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface StreakBadgeProps {
  streak: number
  size?: "sm" | "md" | "lg"
  className?: string
}

export function StreakBadge({ streak, size = "md", className }: StreakBadgeProps) {
  if (streak === 0) return null

  const sizeStyles = {
    sm: "text-xs px-2 py-0.5 gap-0.5",
    md: "text-sm px-3 py-1 gap-1",
    lg: "text-base px-4 py-1.5 gap-1.5",
  }
  const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) return null

  const iconSize = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-5 h-5" }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-semibold",
        "bg-orange-50 dark:bg-orange-950/40",
        "text-orange-600 dark:text-orange-400",
        "border border-orange-200 dark:border-orange-800",
        sizeStyles[size],
        className
      )}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [-5, 5, -5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: 0.5, originY: 1 }}
      >
        <Flame className={cn(iconSize[size], "text-orange-500")} />
      </motion.div>
      <span>{streak}d</span>
    </div>
  )
}

// ── Progress Ring ─────────────────────────────────────────────────────────────
// SVG circular progress for completion percentage
interface ProgressRingProps {
  percent: number  // 0–100
  size?: number
  strokeWidth?: number
  color?: string
  className?: string
  label?: string
}

export function ProgressRing({
  percent,
  size = 80,
  strokeWidth = 6,
  color = "#6366f1",
  className,
  label,
}: ProgressRingProps) {
const safePercent = Math.min(100, Math.max(0, percent || 0))

const radius = (size - strokeWidth) / 2
const circumference = 2 * Math.PI * radius
const offset = circumference - (safePercent / 100) * circumference

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-slate-700"
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      {/* Center label */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <span className="text-lg font-bold text-fore leading-none">{percent}%</span>
        {label && <span className="text-[10px] text-fore-3 mt-0.5">{label}</span>}
      </motion.div>
    </div>
  )
}
