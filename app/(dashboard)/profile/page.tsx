"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { toast } from "react-hot-toast"
import { format } from "date-fns"
import { LogOut, Trash2 } from "lucide-react"
import { API_ROUTES } from "@/lib/constants/api-routes"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { EditProfileDialog } from "@/components/shared/EditProfileDialog"
import { Skeleton } from "@/components/ui/Skeleton"

interface ProfileData {
  id: string
  name: string | null
  email: string | null
  username: string | null
  phone: string | null
  bio: string | null
  timezone: string
  dayStartHour: number
  emailReminders: boolean
  theme: "light" | "dark" | "system"
  createdAt: string
  _count: { habits: number; logs: number }
  stats: {
    currentStreak: number
    bestStreak: number
    totalCheckIns: number
    perfectDays: number
    completionRate: number
  }
}

function ProfileSkeleton() {
  return (
    <div className="tab active" id="tab-profile">
      {/* Header Skeleton */}
      <div className="ph">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>

      {/* Hero Skeleton */}
      <div className="prof-hero pb-8">
        <div className="prof-av-wrap mb-4">
          <Skeleton className="w-[84px] h-[84px] rounded-full" />
        </div>
        <Skeleton className="h-7 w-48 mx-auto mb-2" />
        <Skeleton className="h-4 w-32 mx-auto mb-2" />
        <Skeleton className="h-4 w-56 mx-auto mb-4" />
        <Skeleton className="h-4 w-64 mx-auto mb-6 opacity-60" />
        <div className="flex justify-center gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="ps6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="ps6-c">
            <Skeleton className="h-7 w-12 mb-1 mx-auto" />
            <Skeleton className="h-3 w-16 mx-auto opacity-70" />
          </div>
        ))}
      </div>

      {/* Sections Skeleton */}
      {[
        { title: "Subscription", rows: 1 },
        { title: "Preferences", rows: 4 },
        { title: "Account", rows: 4 }
      ].map((section, idx) => (
        <div key={idx} className="sg">
          <div className="sg-head opacity-70">
            <Skeleton className="h-3 w-20" />
          </div>
          {[...Array(section.rows)].map((_, i) => (
            <div key={i} className="sg-row border-none">
              <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
              <div className="sg-txt flex-1 ml-3">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-48 opacity-60" />
              </div>
              <Skeleton className="w-10 h-6 rounded-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchProfile = (signal?: AbortSignal) => {
    fetch(API_ROUTES.PROFILE.BASE, { signal })
      .then((r) => r.json())
      .then((json) => {
        if (json.data) {
          setProfile(json.data)
          if (json.data.emailReminders !== undefined) setNotifOn(json.data.emailReminders)
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return
        console.error("Profile fetch error:", err)
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    setMounted(true)
    const controller = new AbortController()
    fetchProfile(controller.signal)
    return () => controller.abort()
  }, [])

  const currentTheme = theme === "system" ? systemTheme : theme
  const isDark = currentTheme === "dark"

  // Sync next-themes when profile theme loads
  useEffect(() => {
    if (profile?.theme && profile.theme !== theme) {
      setTheme(profile.theme)
    }
  }, [profile?.theme, setTheme])

  const toggleTheme = async () => {
    const newTheme = isDark ? "light" : "dark"
    setTheme(newTheme) // local update for snappiness
    
    try {
      await fetch(API_ROUTES.PROFILE.BASE, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: newTheme })
      })
      toast.success(newTheme === "light" ? "☀️ Light mode saved" : "🌙 Dark mode saved")
    } catch (err) {
      console.error("Theme sync error:", err)
    }
  }

  const toggleNotif = async () => {
    const newNotif = !notifOn
    setNotifOn(newNotif)
    
    try {
      await fetch(API_ROUTES.PROFILE.BASE, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailReminders: newNotif })
      })
      toast.success(newNotif ? "🔔 Notifications enabled" : "🔕 Notifications disabled")
    } catch (err) {
      console.error("Notif sync error:", err)
      setNotifOn(!newNotif) // rollback
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    // Mock deletion
    setTimeout(() => {
      toast.error("Account deletion is disabled for this demo.")
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }, 1500)
  }

  if (isLoading || !mounted) {
    return <ProfileSkeleton />
  }

  return (
    <>
      <div className="tab active" id="tab-profile">
        <div className="ph">
          <div>
            <div className="pd">Your profile</div>
            <div className="pt">Hey, <em>{session?.user?.name?.split(' ')[0] || 'User'}</em> 👋</div>
          </div>
          <button className="btn-ghost" onClick={() => setIsEditOpen(true)}>Edit profile</button>
        </div>

        <div className="prof-hero">
          <div className="prof-av-wrap" onClick={() => setIsEditOpen(true)} style={{ cursor: "pointer" }}>
            <div className="prof-av">{session?.user?.name?.[0]?.toUpperCase() || 'U'}</div>
            <div className="prof-online"></div>
          </div>
          <div className="prof-name">{profile?.name || session?.user?.name}</div>
          <div className="prof-username" style={{ fontSize: "13px", color: "var(--ind)", fontWeight: 600, marginBottom: "2px" }}>
            @{profile?.username || 'user'}
          </div>
          <div className="prof-email">{profile?.email || session?.user?.email}</div>
          <div className="prof-since">
            Member since {profile?.createdAt ? format(new Date(profile.createdAt), "MMMM yyyy") : "January 2026"} · {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </div>
          <div className="prof-badges">
            <div className="pb pb-gold">🏅 {profile?.stats?.currentStreak || 0}-day streak</div>
            <div className="pb pb-ind">⚡ Power user</div>
            <div className="pb pb-grn">✅ {profile?.stats?.completionRate || 0}% rate</div>
          </div>
        </div>

        <div className="ps6">
          <div className="ps6-c"><div className="ps6-v" style={{ color: "var(--org)" }}>{profile?.stats?.currentStreak || 0}d</div><div className="ps6-l">Streak</div></div>
          <div className="ps6-c"><div className="ps6-v">{profile?.stats?.totalCheckIns || 0}</div><div className="ps6-l">Check-ins</div></div>
          <div className="ps6-c"><div className="ps6-v" style={{ color: "var(--ind)" }}>{profile?._count?.habits || 0}</div><div className="ps6-l">Habits</div></div>
          <div className="ps6-c"><div className="ps6-v" style={{ color: "var(--grn)" }}>{profile?.stats?.completionRate || 0}%</div><div className="ps6-l">Completion</div></div>
          <div className="ps6-c"><div className="ps6-v">{profile?.stats?.bestStreak || 0}d</div><div className="ps6-l">Best streak</div></div>
          <div className="ps6-c"><div className="ps6-v">{profile?.stats?.perfectDays || 0}</div><div className="ps6-l">Perfect days</div></div>
        </div>

        <div className="sg">
          <div className="sg-head">Subscription</div>
          <div className="sg-row" onClick={() => window.location.href = '/subscription'}>
            <div className="sg-ico" style={{ background: "var(--ind-s)" }}>⭐</div>
            <div className="sg-txt"><div className="sg-lbl">Current Plan</div><div className="sg-sub">Basic · Free</div></div>
            <div className="sg-right">Upgrade <svg viewBox="0 0 16 16"><path d="M6 4l4 4-4 4" /></svg></div>
          </div>
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
          <div className="sg-row" onClick={() => setIsEditOpen(true)}>
            <div className="sg-ico" style={{ background: "var(--grn-s)" }}>🌍</div>
            <div className="sg-txt"><div className="sg-lbl">Timezone</div><div className="sg-sub">{profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}</div></div>
            <div className="sg-right">Change <svg viewBox="0 0 16 16"><path d="M6 4l4 4-4 4" /></svg></div>
          </div>
          <div className="sg-row" onClick={() => setIsEditOpen(true)}>
            <div className="sg-ico" style={{ background: "var(--org-s)" }}>⏰</div>
            <div className="sg-txt">
              <div className="sg-lbl">Day starts at</div>
              <div className="sg-sub">
                {profile?.dayStartHour === 0 ? "Midnight" : profile?.dayStartHour && profile.dayStartHour < 12 ? `${profile.dayStartHour} AM` : profile?.dayStartHour === 12 ? "12 PM" : `${(profile?.dayStartHour || 0) - 12} PM`}
              </div>
            </div>
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
          <div className="sg-row danger" onClick={() => setShowDeleteConfirm(true)}>
            <div className="sg-ico" style={{ background: "var(--red-s)" }}>⚠️</div>
            <div className="sg-txt"><div className="sg-lbl">Delete account</div><div className="sg-sub">Permanently erase all data</div></div>
            <div className="sg-right" style={{ color: "var(--red)" }}><svg viewBox="0 0 16 16" style={{ stroke: "var(--red)" }}><path d="M6 4l4 4-4 4" /></svg></div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showLogout}
        onOpenChange={setShowLogout}
        variant="warning"
        icon={<LogOut size={22} strokeWidth={2} color="#f59e0b" />}
        title="Sign out?"
        description="You'll be returned to the login screen. Your progress is safely saved."
        confirmLabel="Sign out"
        onConfirm={() => signOut({ callbackUrl: "/login" })}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        variant="danger"
        icon={<Trash2 size={22} strokeWidth={2} color="#ef4444" />}
        title="Delete your account?"
        description="This will permanently delete all your habits, streaks, and history. This action cannot be undone."
        confirmLabel="Delete account"
        cancelLabel="Keep account"
        isLoading={isDeleting}
        onConfirm={handleDeleteAccount}
      />

      <EditProfileDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        initialData={{
          name: profile?.name || null,
          username: profile?.username || null,
          phone: profile?.phone || null,
          bio: profile?.bio || null,
          timezone: profile?.timezone,
          dayStartHour: profile?.dayStartHour
        }}
        onSuccess={() => fetchProfile()}
      />
    </>
  )
}