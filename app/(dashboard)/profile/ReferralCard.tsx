"use client"

// components/profile/ReferralCard.tsx

import { useState } from "react"
import { Copy, Check, Share2, Users } from "lucide-react"

interface ReferralCardProps {
  referralCode: string
  referralCount: number
}

export function ReferralCard({ referralCode, referralCount }: ReferralCardProps) {
  const [copied, setCopied] = useState(false)

  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/register?ref=${referralCode}`

  async function copyCode() {
    await navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function copyLink() {
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function shareLink() {
    if (navigator.share) {
      await navigator.share({
        title: "Join me on HabitSwipe!",
        text: "I've been building better habits with HabitSwipe. Join me!",
        url: referralLink,
      })
    } else {
      copyLink()
    }
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-fore">Refer a Friend</h3>
          <p className="text-xs text-fore-2">
            {referralCount > 0
              ? `${referralCount} friend${referralCount > 1 ? "s" : ""} joined with your code`
              : "Share your code to invite friends"}
          </p>
        </div>
      </div>

      {/* Referral code box */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="font-mono text-lg font-bold tracking-widest text-indigo-600 dark:text-indigo-400">
            {referralCode}
          </span>
          <button
            onClick={copyCode}
            className="ml-2 p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-indigo-500" />
            )}
          </button>
        </div>
      </div>

      {/* Share buttons */}
      <div className="flex gap-2">
        <button
          onClick={copyLink}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all"
        >
          <Copy className="w-4 h-4" />
          Copy Link
        </button>
        <button
          onClick={shareLink}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-sm font-medium text-white hover:opacity-90 transition-all shadow-sm"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>

      {/* Referral link preview */}
      <p className="text-[10px] text-fore-3 mt-3 truncate text-center">
        {referralLink}
      </p>
    </div>
  )
}
