"use client"

import { motion } from "framer-motion"
import { Flame, Trophy, CalendarDays, Star } from "lucide-react"

interface StreakStatsHeaderProps {
  currentBest: number
  longestEver: number
  totalDays: number
  perfectDays: number
}

export function StreakStatsHeader({
  currentBest,
  longestEver,
  totalDays,
  perfectDays,
}: StreakStatsHeaderProps) {
  const cards = [
    {
      label: "Current Best Streak",
      value: `${currentBest} days`,
      icon: Flame,
      bg: "bg-orange-50 dark:bg-orange-950/30",
      iconColor: "text-orange-500",
    },
    {
      label: "Longest Ever",
      value: `${longestEver} days`,
      icon: Trophy,
      bg: "bg-amber-50 dark:bg-amber-950/30",
      iconColor: "text-amber-500",
    },
    {
      label: "Total Days Done",
      value: totalDays.toString(),
      icon: CalendarDays,
      bg: "bg-indigo-50 dark:bg-indigo-950/30",
      iconColor: "text-indigo-500",
    },
    {
      label: "Perfect Days",
      value: perfectDays.toString(),
      icon: Star,
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      iconColor: "text-emerald-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className={`rounded-2xl p-4 border border-theme ${card.bg}`}
        >
          <card.icon className={`w-5 h-5 mb-2 ${card.iconColor}`} />
          <p className="text-2xl font-bold text-fore">{card.value}</p>
          <p className="text-xs text-fore-2 mt-0.5">{card.label}</p>
        </motion.div>
      ))}
    </div>
  )
}
