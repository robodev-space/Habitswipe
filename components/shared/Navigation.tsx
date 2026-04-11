"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import {
  LayoutDashboard, ListChecks, User,
  Sun, Moon, LogOut, Zap, Flame, Camera,
  AlertTriangle
} from "lucide-react"
import { ConfirmDialog } from "./ConfirmDialog"

const NAV_ITEMS = [
  { id: "today", href: "/today", label: "Today", badgeId: "sbadge" },
  { id: "habits", href: "/habits", label: "Habits" },
  { id: "streaks", href: "/streaks", label: "Streaks", className: "s-streak" },
  { id: "stats", href: "/stats", label: "Stats" },
  { id: "Plan", href: "/subscription", label: "Plan" },
  // { id: "snap", href: "/snap", label: "Snap" },
  { id: "profile", href: "/profile", label: "Profile" },
]

export function Navigation() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => setMounted(true), [])

  function handleLogout() {
    setShowLogoutConfirm(true)
  }

  const executeLogout = () => {
    signOut({ callbackUrl: "/login" })
  }

  const isDark = theme === "dark" || (theme === "system" && mounted && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <>
      {/* ── SIDEBAR ────────────────────────────────────────────────────────────── */}
      <nav className="sidebar">
        <Link href="/today" className="s-logo text-inherit hover:text-inherit">
          <div className="s-lmark">
            <svg viewBox="0 0 14 14" fill="none">
              <path d="M7 1.5L8.2 5.3H12L8.9 7.6L10 11.2L7 9.2L4 11.2L5.1 7.6L2 5.3H5.8L7 1.5Z" fill="white" />
            </svg>
          </div>
          <span className="s-lname">HabitSwipe</span>
        </Link>
        <div className="s-section">Main</div>

        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`s-item ${isActive ? "active" : ""} ${item.className || ""}`}
            >
              {item.id === "today" && <svg viewBox="0 0 16 16"><path d="M7 1.5L8.2 5.3H12L8.9 7.6L10 11.2L7 9.2L4 11.2L5.1 7.6L2 5.3H5.8L7 1.5Z" /></svg>}
              {item.id === "habits" && <svg viewBox="0 0 16 16"><path d="M2 4h12M2 8h12M2 12h8" /></svg>}
              {item.id === "streaks" && <svg viewBox="0 0 16 16" style={{ stroke: "none", fill: "var(--org)" }}><path d="M8 1.5C8 1.5 11.5 5.5 11.5 8.5C11.5 10.6 9.9 12.5 8 12.5C6.1 12.5 4.5 10.6 4.5 8.5C4.5 6 6 3.5 8 1.5Z" /></svg>}
              {item.id === "stats" && <svg viewBox="0 0 16 16"><rect x="1" y="1" width="6" height="6" rx="1.5" /><rect x="9" y="1" width="6" height="6" rx="1.5" /><rect x="1" y="9" width="6" height="6" rx="1.5" /><rect x="9" y="9" width="6" height="6" rx="1.5" /></svg>}
              {item.id === "snap" && <svg viewBox="0 0 16 16"><circle cx="8" cy="9" r="3" /><path d="M1 6h1.5l1.5-3h8l1.5 3H15v8H1z" /></svg>}
              {item.id === "profile" && <svg viewBox="0 0 16 16"><circle cx="8" cy="5" r="3" /><path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" /></svg>}

              {item.label}
              {item.badgeId && (
                <span className="s-badge" id={item.badgeId} style={{ display: "none" }}></span>
              )}
            </Link>
          )
        })}

        <div className="s-gap"></div>
        <div className="s-div"></div>

        {session?.user && (
          <Link href="/profile" className="s-user text-inherit hover:text-inherit">
            <div className="s-av">
              {session.user.name?.[0]?.toUpperCase() ?? "U"}
              <div className="s-av-dot"></div>
            </div>
            <div>
              <div className="s-un">{session.user.name}</div>
              <div className="s-ue">{session.user.email}</div>
            </div>
          </Link>
        )}

        <button className="s-btn" onClick={() => setTheme(isDark ? "light" : "dark")}>
          <svg viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="4" />
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M11.54 4.46l-1.41 1.41M4.95 11.54l-1.41 1.41" />
          </svg>
          <span>{mounted && isDark ? "Light mode" : "Dark mode"}</span>
        </button>
        <button className="s-btn logout" onClick={handleLogout}>
          <svg viewBox="0 0 16 16">
            <path d="M10 3h3a1 1 0 011 1v8a1 1 0 01-1 1h-3M7 11l3-3-3-3M10 8H3" />
          </svg>
          Sign out
        </button>
      </nav>

      {/* ── MOBILE NAV ─────────────────────────────────────────────────────────── */}
      <nav className="mob-nav">
        {[
          { id: "today", href: "/today", label: "Today" },
          { id: "habits", href: "/habits", label: "Habits" },
          { id: "streaks", href: "/streaks", label: "Streaks" },
          { id: "stats", href: "/stats", label: "Stats" },
          { id: "profile", href: "/profile", label: "Profile" },
        ].map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mob-item ${isActive ? "active" : ""}`}
              style={item.id === "streaks" ? { color: "var(--org)" } : undefined}
            >
              {item.id === "today" && <svg viewBox="0 0 16 16"><path d="M7 1.5L8.2 5.3H12L8.9 7.6L10 11.2L7 9.2L4 11.2L5.1 7.6L2 5.3H5.8L7 1.5Z" /></svg>}
              {item.id === "habits" && <svg viewBox="0 0 16 16"><path d="M2 4h12M2 8h12M2 12h8" /></svg>}
              {item.id === "streaks" && <svg viewBox="0 0 16 16" style={isActive ? undefined : { stroke: "var(--org)" }}><path d="M8 1.5C8 1.5 11.5 5.5 11.5 8.5C11.5 10.6 9.9 12.5 8 12.5C6.1 12.5 4.5 10.6 4.5 8.5C4.5 6 6 3.5 8 1.5Z" fill={isActive ? undefined : "var(--org)"} stroke={isActive ? undefined : "none"} /></svg>}
              {item.id === "stats" && <svg viewBox="0 0 16 16"><rect x="1" y="1" width="6" height="6" rx="1.5" /><rect x="9" y="1" width="6" height="6" rx="1.5" /><rect x="1" y="9" width="6" height="6" rx="1.5" /><rect x="9" y="9" width="6" height="6" rx="1.5" /></svg>}
              {item.id === "profile" && <svg viewBox="0 0 16 16"><circle cx="8" cy="5" r="3" /><path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" /></svg>}

              <span>{item.label}</span>

              {isActive && <div className="mob-dot"></div>}
              {item.id === "today" && (
                <div className="mob-badge" id="mbadge" style={{ display: "none" }}></div>
              )}
            </Link>
          )
        })}
      </nav>

      <ConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        variant="warning"
        icon={<LogOut size={22} strokeWidth={2} color="#f59e0b" />}
        title="Sign out?"
        description="You'll be returned to the login screen. Your progress is safely saved."
        confirmLabel="Sign out"
        onConfirm={executeLogout}
      />
    </>
  )
}