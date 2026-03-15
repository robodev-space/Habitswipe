"use client"

// app/(dashboard)/profile/page.tsx  →  route: /profile

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import {
  Save, Loader2, CheckCircle2, Mail,
  Phone, User, AtSign, FileText, Calendar
} from "lucide-react"
import { AvatarUpload } from "@/components/profile/AvatarUpload"
import { ReferralCard } from "@/components/profile/ReferralCard"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/Skeleton"
import { API_ROUTES } from "@/lib/constants/api-routes"

interface ProfileData {
  id: string
  name: string | null
  email: string | null
  username: string | null
  image: string | null
  phone: string | null
  bio: string | null
  referralCode: string | null
  referredBy: string | null
  createdAt: string
  referralCount: number
  _count: { habits: number; logs: number }
}

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [phone, setPhone] = useState("")
  const [bio, setBio] = useState("")

  useEffect(() => {
    const controller = new AbortController()

    fetch(API_ROUTES.PROFILE.BASE, { signal: controller.signal })
      .then((r) => r.json())
      .then((json) => {
        if (json.data) {
          const p = json.data
          setProfile(p)
          setName(p.name ?? "")
          setUsername(p.username ?? "")
          setPhone(p.phone ?? "")
          setBio(p.bio ?? "")
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return
        console.error("Profile fetch error:", err)
      })
      .finally(() => setIsLoading(false))

    return () => controller.abort()
  }, [])

  async function handleSave() {
    setIsSaving(true)
    setError(null)
    try {
      const res = await fetch(API_ROUTES.PROFILE.BASE, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          username: username.trim() || undefined,
          phone: phone.trim() || null,
          bio: bio.trim() || null,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? "Failed to save")
        return
      }
      setProfile((prev) => prev ? { ...prev, ...json.data } : prev)
      // Update NextAuth session so navbar name updates immediately
      await updateSession({ name: json.data.name })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError("Something went wrong")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleAvatarUpload(imageDataUrl: string) {
    const res = await fetch(API_ROUTES.PROFILE.AVATAR, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageDataUrl }),
    })
    if (!res.ok) throw new Error("Upload failed")
    const json = await res.json()
    setProfile((prev) => prev ? { ...prev, image: json.data.image } : prev)
    await updateSession({ image: json.data.image })
  }

  const isDirty =
    name !== (profile?.name ?? "") ||
    username !== (profile?.username ?? "") ||
    phone !== (profile?.phone ?? "") ||
    bio !== (profile?.bio ?? "")

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-[180px] w-full rounded-2xl" />
        <div className="space-y-4 p-6 bg-surface border border-theme rounded-2xl">
          <Skeleton className="h-6 w-32 mb-4" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">

      {/* Header */}
      <div>
        <h1
          className="text-3xl text-fore"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          Profile
        </h1>
        <p className="text-fore-2 text-sm mt-1">
          Manage your account details
        </p>
      </div>

      {/* Avatar + stats card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-theme rounded-2xl p-6"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar upload */}
          <AvatarUpload
            currentImage={profile?.image ?? null}
            name={profile?.name ?? null}
            onUpload={handleAvatarUpload}
          />

          {/* Stats */}
          <div className="flex-1 flex flex-col gap-3">
            <div>
              <p className="text-lg font-semibold text-fore">
                {profile?.name ?? "No name set"}
              </p>
              <p className="text-sm text-fore-2">{profile?.email}</p>
              {profile?.username && (
                <p className="text-sm text-indigo-500">@{profile.username}</p>
              )}
            </div>

            {/* Member stats */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-fore">
                  {profile?._count.habits ?? 0}
                </span>
                <span className="text-xs text-fore-3">Habits</span>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-fore">
                  {profile?._count.logs ?? 0}
                </span>
                <span className="text-xs text-fore-3">Total logs</span>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-fore">
                  {profile?.createdAt
                    ? format(new Date(profile.createdAt), "MMM yyyy")
                    : "—"}
                </span>
                <span className="text-xs text-fore-3">Member since</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit form */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.07 }}
        className="bg-surface border border-theme rounded-2xl p-6 space-y-4"
      >
        <h2 className="font-semibold text-fore text-lg">Personal Info</h2>

        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-fore-2 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            maxLength={50}
            className="w-full h-11 bg-surface-2 border border-theme rounded-xl px-4 text-sm text-fore placeholder:text-fore-3 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all"
          />
        </div>

        {/* Username */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-fore-2 flex items-center gap-1.5">
            <AtSign className="w-3.5 h-3.5" /> Username
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-fore-3 text-sm">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              placeholder="yourname"
              maxLength={20}
              className="w-full h-11 bg-surface-2 border border-theme rounded-xl pl-8 pr-4 text-sm text-fore placeholder:text-fore-3 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all"
            />
          </div>
          <p className="text-[11px] text-fore-3">Letters, numbers, underscore only</p>
        </div>

        {/* Email (read-only) */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-fore-2 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" /> Email
          </label>
          <input
            type="email"
            value={profile?.email ?? ""}
            readOnly
            className="w-full h-11 bg-surface-2 border border-theme rounded-xl px-4 text-sm text-fore-3 cursor-not-allowed opacity-60"
          />
          <p className="text-[11px] text-fore-3">Email cannot be changed</p>
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-fore-2 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" /> Mobile Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            maxLength={15}
            className="w-full h-11 bg-surface-2 border border-theme rounded-xl px-4 text-sm text-fore placeholder:text-fore-3 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all"
          />
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-fore-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell something about yourself..."
            maxLength={160}
            rows={3}
            className="w-full bg-surface-2 border border-theme rounded-xl px-4 py-3 text-sm text-fore placeholder:text-fore-3 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all resize-none"
          />
          <p className="text-[11px] text-fore-3 text-right">{bio.length}/160</p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-xl">
            ⚠ {error}
          </p>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="w-full h-12 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: saved
              ? "linear-gradient(135deg, #10b981, #059669)"
              : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "white",
          }}
        >
          {isSaving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
          ) : saved ? (
            <><CheckCircle2 className="w-4 h-4" /> Saved!</>
          ) : (
            <><Save className="w-4 h-4" /> Save Changes</>
          )}
        </button>
      </motion.div>

      {/* Referral card */}
      {profile?.referralCode && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
        >
          <ReferralCard
            referralCode={profile.referralCode}
            referralCount={profile.referralCount}
          />
        </motion.div>
      )}

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.21 }}
        className="bg-surface border border-red-200 dark:border-red-900/40 rounded-2xl p-5"
      >
        <h2 className="font-semibold text-red-600 dark:text-red-400 mb-1">
          Danger Zone
        </h2>
        <p className="text-sm text-fore-2 mb-4">
          Once you delete your account, all your habits, streaks and logs will be permanently removed.
        </p>
        <button
          className="px-4 py-2 rounded-xl text-sm font-medium text-red-600 border border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
          onClick={() => alert("Contact support to delete your account.")}
        >
          Delete Account
        </button>
      </motion.div>

    </div>
  )
}