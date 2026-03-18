"use client"

// components/shared/Navigation.tsx

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  LayoutDashboard, ListChecks, User,
  Sun, Moon, LogOut, Zap, Flame, Camera
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Confirmation } from "../common/Confirmation"

const NAV_ITEMS = [
  { href: "/today", icon: Zap, label: "Today" },
  { href: "/habits", icon: ListChecks, label: "Habits" },
  { href: "/streaks", icon: Flame, label: "Streaks" },
  { href: "/dashboard", icon: LayoutDashboard, label: "Stats" },
  { href: "/share", icon: Camera, label: "Snap" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function Navigation() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch for theme-dependent rendering
  useEffect(() => setMounted(true), [])

  function handleLogout() {
    signOut({ callbackUrl: "/login" })
  }

  const isDark = theme === "dark"

  return (
    <>
      {/* ── Desktop Sidebar ──────────────────────────────────────────────── */}
      <aside
        className={cn(
          "hidden md:flex flex-col w-[220px] h-screen sticky top-0 overflow-y-auto flex-shrink-0",
          "px-3 py-5 gap-1 transition-colors duration-200",
          // Light: clean white with hairline right border + subtle shadow
          "bg-white border-r border-gray-100 shadow-[1px_0_0_0_rgba(0,0,0,0.04)]",
          // Dark: near-black with faint border
          "dark:bg-[#07060f] dark:border-white/[0.06] dark:shadow-none"
        )}
      >

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-3 mb-7">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-500/30 flex-shrink-0">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span
            className="text-[17px] font-bold tracking-tight select-none
                       text-gray-900 dark:text-white"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            HabitSwipe
          </span>
        </div>

        {/* Section label */}
        <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-1
                      text-gray-400 dark:text-white/25">
          Menu
        </p>

        {/* Nav links */}
        <nav className="flex flex-col gap-0.5 flex-1">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href
            const isStreaks = label === "Streaks"

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium",
                  "transition-all duration-150 group",
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-500 hover:text-gray-900 dark:text-white/40 dark:hover:text-white/80"
                )}
              >
                {/* Animated active background */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 rounded-xl
                               bg-indigo-50 dark:bg-indigo-600/15"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}

                {/* Hover state background */}
                {!isActive && (
                  <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity
                                   bg-gray-50 dark:bg-white/[0.04]" />
                )}

                <Icon
                  className={cn(
                    "relative w-4 h-4 flex-shrink-0 transition-colors",
                    isActive
                      ? "text-indigo-500 dark:text-indigo-400"
                      : isStreaks
                        ? "text-orange-400 dark:text-orange-400/70"
                        : "text-gray-400 dark:text-white/30 group-hover:text-gray-600 dark:group-hover:text-white/60"
                  )}
                />

                <span className="relative">{label}</span>

                {/* Active indicator dot */}
                {isActive && (
                  <div className="relative ml-auto w-1.5 h-1.5 rounded-full
                                  bg-indigo-500 dark:bg-indigo-400" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* ── Bottom section ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-0.5 pt-3
                        border-t border-gray-100 dark:border-white/[0.06]">

          {/* User pill → links to profile */}
          {session?.user && (
            <Link
              href="/profile"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-1 group transition-all
                         hover:bg-gray-50 dark:hover:bg-white/[0.04]"
            >
              {/* Avatar with online dot */}
              <div className="relative flex-shrink-0">
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center
                                text-white text-[11px] font-bold">
                  {session.user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full
                                bg-emerald-500 border-2 border-white dark:border-[#07060f]" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold truncate leading-tight
                              text-gray-800 dark:text-white/80">
                  {session.user.name}
                </p>
                <p className="text-[10px] truncate leading-tight
                              text-gray-400 dark:text-white/30">
                  {session.user.email}
                </p>
              </div>
            </Link>
          )}

          {/* Theme toggle — only render after mount to avoid hydration flash */}
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
                         transition-all group
                         text-gray-500 hover:text-gray-900 hover:bg-gray-50
                         dark:text-white/40 dark:hover:text-white/80 dark:hover:bg-white/[0.05]"
            >
              {isDark
                ? <Sun className="w-4 h-4 text-gray-400 dark:text-white/30 group-hover:text-amber-500 transition-colors" />
                : <Moon className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
              }
              {isDark ? "Light mode" : "Dark mode"}
            </button>
          )}

          {/* Sign out */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
                       transition-all group
                       text-gray-500 hover:text-red-600 hover:bg-red-50
                       dark:text-white/40 dark:hover:text-red-400 dark:hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 text-gray-400 dark:text-white/30
                               group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Bar ────────────────────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50
                   bg-white/90 border-t border-gray-100 backdrop-blur-xl
                   dark:bg-[#07060f]/90 dark:border-white/[0.06]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href
            const isStreaks = label === "Streaks"

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl min-w-[48px]",
                  "transition-all duration-150",
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-400 dark:text-white/30"
                )}
              >
                {/* Animated active bg pill */}
                {isActive && (
                  <motion.div
                    layoutId="mobile-active-bg"
                    className="absolute inset-0 rounded-xl
                               bg-indigo-50 dark:bg-indigo-600/15"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}

                <Icon
                  className={cn(
                    "relative w-5 h-5 transition-colors",
                    isActive
                      ? "text-indigo-500 dark:text-indigo-400"
                      : isStreaks
                        ? "text-orange-400/80 dark:text-orange-400/60"
                        : ""
                  )}
                />
                <span className="relative text-[9px] font-semibold tracking-wide">
                  {label}
                </span>

                {/* Bottom dot */}
                {isActive && (
                  <motion.div
                    layoutId="mobile-active-dot"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2
                               w-1 h-1 rounded-full bg-indigo-500 dark:bg-indigo-400"
                  />
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* ── Logout Confirmation Dialog ───────────────────────────────────── */}
      <Confirmation
        title="Sign out"
        description="You'll be returned to the login screen. Your streaks and habits are safely saved."
        buttonLabel="Sign out"
        open={showLogoutConfirm}
        setOpen={setShowLogoutConfirm}
        onConfirm={handleLogout}
        variant="danger"
      />
    </>
  )
}