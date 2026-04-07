// ─── Habit SVG Icon Set ─────────────────────────────────────────────────────
// Beautiful, minimal SVG icons for habit categories.
// Usage: <HabitIcon emoji="⚡" color="#5b50e8" />

import React from "react"

interface IconProps {
  className?: string
  size?: number
  color?: string
}

const defaultProps: IconProps = { size: 20, color: "currentColor" }

// ─── Individual Icons ────────────────────────────────────────────────────────

export function IconBolt({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}

export function IconFlame({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
    </svg>
  )
}

export function IconRun({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="17" cy="4" r="2" />
      <path d="M15.59 13.51l-2.17 2.17L9 13l-4 4" />
      <path d="M9.5 5.5L14 10l-2.17 2.17" />
      <path d="M5 21l3-3" />
    </svg>
  )
}

export function IconDumbbell({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.4 14.4L9.6 9.6" />
      <path d="M18.657 21.485a2 2 0 01-2.829 0l-1.414-1.414a2 2 0 010-2.828l.707-.707a2 2 0 012.829 0l1.414 1.414a2 2 0 010 2.829l-.707.706z" />
      <path d="M5.343 2.515a2 2 0 012.829 0l1.414 1.414a2 2 0 010 2.828l-.707.707a2 2 0 01-2.829 0L4.636 6.05a2 2 0 010-2.828l.707-.707z" />
    </svg>
  )
}

export function IconBook({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      <path d="M8 7h8M8 11h6" />
    </svg>
  )
}

export function IconMeditate({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2" />
      <path d="M7 20h10" />
      <path d="M12 7v4" />
      <path d="M8 14l4-3 4 3" />
      <path d="M9 17l3-3 3 3" />
    </svg>
  )
}

export function IconTarget({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

export function IconCheck({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

export function IconDroplet({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
    </svg>
  )
}

export function IconSunrise({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 18a5 5 0 00-10 0" />
      <line x1="12" y1="2" x2="12" y2="9" />
      <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
      <line x1="1" y1="18" x2="3" y2="18" />
      <line x1="21" y1="18" x2="23" y2="18" />
      <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
      <line x1="23" y1="22" x2="1" y2="22" />
      <polyline points="8 6 12 2 16 6" />
    </svg>
  )
}

export function IconMusic({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}

export function IconApple({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c1 1.5 0 3-1 4" />
      <path d="M17.5 8c2.5 2 3.5 6 2 10s-4 4-5.5 4-2-.5-4-.5-2.5.5-4 .5S2 21 1.5 18s-.5-8 2-10 4-1 5.5-1 2.5-1 4-1 3.5-.5 4.5 2z" />
    </svg>
  )
}

export function IconBrain({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A3.5 3.5 0 006 5.5v1A3.5 3.5 0 002.5 10v1A3.5 3.5 0 005 14.5" />
      <path d="M14.5 2A3.5 3.5 0 0118 5.5v1A3.5 3.5 0 0121.5 10v1A3.5 3.5 0 0119 14.5" />
      <path d="M12 2v20" />
      <path d="M5 14.5A3.5 3.5 0 008.5 18h0a3.5 3.5 0 013.5 3.5" />
      <path d="M19 14.5a3.5 3.5 0 01-3.5 3.5h0A3.5 3.5 0 0012 21.5" />
    </svg>
  )
}

export function IconMoon({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  )
}

export function IconBike({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M15 6a1 1 0 100-2 1 1 0 000 2z" fill={color} />
      <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
    </svg>
  )
}

export function IconPen({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      <path d="M15 5l4 4" />
    </svg>
  )
}

export function IconWeight({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h11L19 20H5L6.5 6.5z" />
      <path d="M9 6.5V5a3 3 0 016 0v1.5" />
      <line x1="12" y1="11" x2="12" y2="16" />
      <line x1="9.5" y1="13.5" x2="14.5" y2="13.5" />
    </svg>
  )
}

export function IconLeaf({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 019.8 6.9C15.5 4.9 20 2 20 2s-1.7 5.3-4 9.5C14 15 11 20 11 20z" />
      <path d="M5 19c2-3 6-7 11.5-10.5" />
    </svg>
  )
}

export function IconCoffee({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 110 8h-1" />
      <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  )
}

export function IconPalette({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="1.5" fill={color} />
      <circle cx="17.5" cy="10.5" r="1.5" fill={color} />
      <circle cx="8.5" cy="7.5" r="1.5" fill={color} />
      <circle cx="6.5" cy="12.5" r="1.5" fill={color} />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.638 1.5-1.5a1.5 1.5 0 00-.15-.65c-.073-.136-.15-.301-.15-.5 0-.828.672-1.35 1.5-1.35H16a6 6 0 006-6c0-5.5-4.5-10-10-10z" />
    </svg>
  )
}

export function IconPuzzle({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.236 1.234-.706 1.704L19.07 15.93c-.47.47-1.087.706-1.704.706-.617 0-1.234-.236-1.704-.706l-1.568-1.568a1.029 1.029 0 00-.878-.29c-.37.058-.657.345-.715.715a1.029 1.029 0 00.29.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.236 1.234-.706 1.704L12.93 22.07c-.47.47-1.087.706-1.704.706-.617 0-1.234-.236-1.704-.706l-1.568-1.568a1.029 1.029 0 00-.878-.29" />
      <path d="M8 2H4a2 2 0 00-2 2v4M16 2h4a2 2 0 012 2v4" />
    </svg>
  )
}

export function IconHeadphones({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0118 0v6" />
      <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z" />
    </svg>
  )
}

export function IconWaves({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </svg>
  )
}

export function IconSwim({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="4" r="2" />
      <path d="M18 9l-4-2-5 4-3-2" />
      <path d="M2 16c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2c1.3 0 1.9.5 2.5 1" />
      <path d="M2 20c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2c1.3 0 1.9.5 2.5 1" />
    </svg>
  )
}

export function IconSparkle({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
    </svg>
  )
}

export function IconHeart({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  )
}

// ─── Emoji → SVG mapping ─────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.FC<IconProps>> = {
  '⚡': IconBolt,
  '🔥': IconFlame,
  '🏃': IconRun,
  '💪': IconDumbbell,
  '📚': IconBook,
  '🧘': IconMeditate,
  '🎯': IconTarget,
  '✅': IconCheck,
  '💧': IconDroplet,
  '🌅': IconSunrise,
  '🎵': IconMusic,
  '🍎': IconApple,
  '🧠': IconBrain,
  '💤': IconMoon,
  '🚴': IconBike,
  '✍️': IconPen,
  '🏋️': IconWeight,
  '🌿': IconLeaf,
  '☕': IconCoffee,
  '🎨': IconPalette,
  '🧩': IconPuzzle,
  '🎧': IconHeadphones,
  '🌊': IconWaves,
  '🏊': IconSwim,
  '✨': IconSparkle,
  '❤️': IconHeart,
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface HabitIconProps {
  /** The emoji string stored on the habit (e.g. "⚡") */
  emoji?: string | null
  /** Accent color – defaults to currentColor */
  color?: string
  /** Size in px */
  size?: number
  className?: string
}

/**
 * Renders a beautiful SVG icon for a given habit emoji.
 * Falls back to the sparkle icon if no match is found.
 */
export function HabitIcon({ emoji, color = "currentColor", size = 18, className }: HabitIconProps) {
  const Icon = (emoji && ICON_MAP[emoji]) || IconSparkle
  return <Icon size={size} color={color} className={className} />
}
