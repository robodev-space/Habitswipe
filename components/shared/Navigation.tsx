"use client"

// components/shared/Navigation.tsx

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import {
  LayoutDashboard, ListChecks, User,
  Sun, Moon, LogOut, Zap, Flame, Camera
} from "lucide-react"
import { cn } from "@/lib/utils"

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

  return (
    <>
      {/* ── Desktop sidebar ───────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 overflow-y-auto flex-shrink-0 bg-surface border-r border-theme px-4 py-6 gap-2">        {/* Logo */}
        <div className="flex items-center gap-2.5 px-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          <span
            className="text-xl font-bold text-fore select-none"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            HabitSwipe
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                  "transition-all duration-150",
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                    : "text-fore-2 hover:bg-surface-2 hover:text-fore"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive ? "text-indigo-500" : "",
                    // Flame gets orange tint when not active
                    !isActive && label === "Streaks" ? "text-orange-400" : ""
                  )}
                />
                {label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="flex flex-col gap-2 pt-4 border-t border-theme">
          {session?.user && (
            <div className="flex items-center gap-2.5 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-semibold">
                {session.user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-fore truncate">{session.user.name}</p>
                <p className="text-xs text-fore-3 truncate">{session.user.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-fore-2 hover:bg-surface-2 hover:text-fore transition-all"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-fore-2 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile bottom bar ─────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-t border-theme">
        <div className="flex items-center justify-around px-1 py-2">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl",
                  "transition-all duration-150",
                  isActive ? "text-indigo-500" : "text-fore-3"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    !isActive && label === "Streaks" ? "text-orange-400" : ""
                  )}
                />
                <span className="text-[9px] font-medium">{label}</span>
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-indigo-500" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
