"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { toast } from "react-hot-toast"
import { format } from "date-fns"
import { API_ROUTES } from "@/lib/constants/api-routes"
import { LogoutDialog } from "@/components/shared/LogoutDialog"

interface ProfileData {
  id: string
  name: string | null
  email: string | null
  createdAt: string
  _count: { habits: number; logs: number }
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const { theme, setTheme, systemTheme } = useTheme()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Toggles
  const [notifOn, setNotifOn] = useState(true)
  const [showLogout, setShowLogout] = useState(false)

  useEffect(() => {
    setMounted(true)
    const controller = new AbortController()

    fetch(API_ROUTES.PROFILE.BASE, { signal: controller.signal })
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setProfile(json.data)
      })
      .catch((err) => {
        if (err.name === "AbortError") return
        console.error("Profile fetch error:", err)
      })
      .finally(() => setIsLoading(false))

    return () => controller.abort()
  }, [])

  const currentTheme = theme === "system" ? systemTheme : theme
  const isDark = currentTheme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
    toast.success(isDark ? "☀️ Light mode on" : "🌙 Dark mode on")
  }

  const toggleNotif = () => {
    setNotifOn(!notifOn)
    toast.success(!notifOn ? "🔔 Notifications enabled" : "🔕 Notifications disabled")
  }

  if (isLoading || !mounted) {
    return (
      <div className="tab active" id="tab-profile">
        <div className="ph">
          <div><div className="pd">Your profile</div><div className="pt">Loading...</div></div>
        </div>
        <div className="animate-pulse bg-surf2 rounded-[20px] h-[300px] mb-5"></div>
      </div>
    )
  }

  return (
    <>
      <div className="tab active" id="tab-profile">
        <div className="ph">
          <div>
            <div className="pd">Your profile</div>
            <div className="pt">Hey, <em>{session?.user?.name?.split(' ')[0] || 'User'}</em> 👋</div>
          </div>
          <button className="btn-ghost" onClick={() => toast("Edit profile coming soon...")}>Edit profile</button>
        </div>

        <div className="prof-hero">
          <div className="prof-av-wrap">
            <div className="prof-av">{session?.user?.name?.[0]?.toUpperCase() || 'U'}</div>
            <div className="prof-online"></div>
          </div>
          <div className="prof-name">{session?.user?.name}</div>
          <div className="prof-email">{session?.user?.email}</div>
          <div className="prof-since">
            Member since {profile?.createdAt ? format(new Date(profile.createdAt), "MMMM yyyy") : "January 2026"} · Asia/Kolkata
          </div>
          <div className="prof-badges">
            <div className="pb pb-gold">🏅 14-day streak</div>
            <div className="pb pb-ind">⚡ Power user</div>
            <div className="pb pb-grn">✅ 89% rate</div>
          </div>
        </div>

        <div className="ps6">
          <div className="ps6-c"><div className="ps6-v" style={{ color: "var(--org)" }}>14d</div><div className="ps6-l">Streak</div></div>
          <div className="ps6-c"><div className="ps6-v">{profile?._count?.logs || 0}</div><div className="ps6-l">Check-ins</div></div>
          <div className="ps6-c"><div className="ps6-v" style={{ color: "var(--ind)" }}>{profile?._count?.habits || 0}</div><div className="ps6-l">Habits</div></div>
          <div className="ps6-c"><div className="ps6-v" style={{ color: "var(--grn)" }}>89%</div><div className="ps6-l">Completion</div></div>
          <div className="ps6-c"><div className="ps6-v">22d</div><div className="ps6-l">Best streak</div></div>
          <div className="ps6-c"><div className="ps6-v">12</div><div className="ps6-l">Perfect days</div></div>
        </div>

        <div className="sg">
          <div className="sg-head">Preferences</div>
          <div className="sg-row" onClick={toggleTheme}>
            <div className="sg-ico" style={{ background: "var(--amb-s)" }}>🌙</div>
            <div className="sg-txt"><div className="sg-lbl">Dark mode</div><div className="sg-sub">Switch appearance</div></div>
            <div className={`toggle ${isDark ? "on" : ""}`} onClick={(e) => { e.stopPropagation(); toggleTheme() }}></div>
          </div>
          <div className="sg-row" onClick={toggleNotif}>
            <div className="sg-ico" style={{ background: "var(--ind-s)" }}>🔔</div>
            <div className="sg-txt"><div className="sg-lbl">Notifications</div><div className="sg-sub">Daily reminders at 8am</div></div>
            <div className={`toggle ${notifOn ? "on" : ""}`} onClick={(e) => { e.stopPropagation(); toggleNotif() }}></div>
          </div>
          <div className="sg-row" onClick={() => toast("Timezone: Asia/Kolkata (IST)")}>
            <div className="sg-ico" style={{ background: "var(--grn-s)" }}>🌍</div>
            <div className="sg-txt"><div className="sg-lbl">Timezone</div><div className="sg-sub">Asia/Kolkata (IST)</div></div>
            <div className="sg-right">Change <svg viewBox="0 0 16 16"><path d="M6 4l4 4-4 4" /></svg></div>
          </div>
          <div className="sg-row" onClick={() => toast("Day starts at midnight")}>
            <div className="sg-ico" style={{ background: "var(--org-s)" }}>⏰</div>
            <div className="sg-txt"><div className="sg-lbl">Day starts at</div><div className="sg-sub">Midnight (12:00 AM)</div></div>
            <div className="sg-right">Edit <svg viewBox="0 0 16 16"><path d="M6 4l4 4-4 4" /></svg></div>
          </div>
        </div>

        <div className="sg">
          <div className="sg-head">Account</div>
          <div className="sg-row" onClick={() => toast("Password change coming soon...")}>
            <div className="sg-ico" style={{ background: "var(--grn-s)" }}>🔒</div>
            <div className="sg-txt"><div className="sg-lbl">Change password</div></div>
            <div className="sg-right"><svg viewBox="0 0 16 16"><path d="M6 4l4 4-4 4" /></svg></div>
          </div>
          <div className="sg-row" onClick={() => toast("Exporting your data as CSV...")}>
            <div className="sg-ico" style={{ background: "var(--ind-s)" }}>📤</div>
            <div className="sg-txt"><div className="sg-lbl">Export data</div><div className="sg-sub">Download as CSV</div></div>
            <div className="sg-right"><svg viewBox="0 0 16 16"><path d="M6 4l4 4-4 4" /></svg></div>
          </div>
          <div className="sg-row danger" onClick={() => setShowLogout(true)}>
            <div className="sg-ico" style={{ background: "var(--red-s)" }}>🚪</div>
            <div className="sg-txt"><div className="sg-lbl">Sign out</div></div>
            <div className="sg-right" style={{ color: "var(--red)" }}><svg viewBox="0 0 16 16" style={{ stroke: "var(--red)" }}><path d="M6 4l4 4-4 4" /></svg></div>
          </div>
        </div>
      </div>

      <LogoutDialog isOpen={showLogout} onClose={() => setShowLogout(false)} />
    </>
  )
}