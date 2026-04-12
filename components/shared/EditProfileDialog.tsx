"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Phone, Globe, Clock, X } from "lucide-react"
import { toast } from "react-hot-toast"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { API_ROUTES } from "@/lib/constants/api-routes"
import "./edit-profile.css"

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: {
    name: string | null
    username: string | null
    phone: string | null
    bio: string | null
    timezone?: string
    dayStartHour?: number
  }
  onSuccess: () => void
}

const TIMEZONES = [
  "UTC",
  "Asia/Kolkata",
  "America/New_York",
  "Europe/London",
  "Asia/Tokyo",
  "Australia/Sydney",
  "America/Los_Angeles",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Singapore",
  "America/Chicago",
  "America/Sao_Paulo",
  "Europe/Berlin",
  "Asia/Hong_Kong",
  "Pacific/Auckland",
]

export function EditProfileDialog({
  open,
  onOpenChange,
  initialData,
  onSuccess
}: EditProfileDialogProps) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    username: initialData.username || "",
    phone: initialData.phone || "",
    bio: initialData.bio || "",
    timezone: initialData.timezone || "UTC",
    dayStartHour: initialData.dayStartHour ?? 0
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setFormData({
        name: initialData.name || "",
        username: initialData.username || "",
        phone: initialData.phone || "",
        bio: initialData.bio || "",
        timezone: initialData.timezone || "UTC",
        dayStartHour: initialData.dayStartHour ?? 0
      })
    }
  }, [initialData, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch(API_ROUTES.PROFILE.BASE, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.error || "Failed to update profile")
      }

      toast.success("Profile saved! ✨")
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="p-0 border-none bg-transparent shadow-none max-w-none w-full flex items-center justify-center outline-none">
        <div className="ep-dialog">
          <div className="ep-accent"></div>
          
          <div className="ep-header">
            <div className="flex justify-between items-start w-full">
              <div>
                <div className="ep-eyebrow">Settings</div>
                <h2 className="ep-title">Refine your <em>profile</em></h2>
              </div>
              <button 
                className="p-2 hover:bg-[var(--surf2)] rounded-xl transition-all active:scale-95"
                onClick={() => onOpenChange(false)}
              >
                <X size={18} className="text-[var(--txt3)]" />
              </button>
            </div>
          </div>
          
          <div className="ep-scroll">
            <form onSubmit={handleSubmit}>
              <div className="mb-4 pb-2 border-b border-[var(--bord)]">
                <span className="text-[10px] font-bold text-[var(--ind)] uppercase tracking-widest">Account Details</span>
              </div>
              
              <div className="ep-row-grid">
                {/* Full Name */}
                <div className="ep-group">
                  <label className="ep-label">Full Name</label>
                  <div className="ep-input-wrap">
                    <span className="ep-icon-inner"><User size={16} /></span>
                    <input
                      type="text"
                      className="ep-input has-icon"
                      placeholder="E.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="ep-group">
                  <label className="ep-label">Username</label>
                  <div className="ep-input-wrap">
                    <span className="ep-username-prefix">@</span>
                    <input
                      type="text"
                      className="ep-input ep-input-username"
                      placeholder="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value.replace(/\s/g, '').toLowerCase() })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="ep-group">
                <label className="ep-label">Bio (Short story)</label>
                <div className="ep-input-wrap">
                  <textarea
                    className="ep-input ep-textarea"
                    placeholder="E.g. Designing my best life, one habit at a time."
                    maxLength={160}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>
                <div className="ep-char-count">{formData.bio.length}/160</div>
              </div>

              <div className="mb-4 mt-8 pb-2 border-b border-[var(--bord)]">
                <span className="text-[10px] font-bold text-[var(--ind)] uppercase tracking-widest">System Preferences</span>
              </div>

              <div className="ep-row-grid">
                {/* Timezone */}
                <div className="ep-group">
                  <label className="ep-label">Region & Timezone</label>
                  <div className="ep-input-wrap">
                    <span className="ep-icon-inner"><Globe size={16} /></span>
                    <select
                      className="ep-input has-icon ep-select"
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    >
                      {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                    </select>
                  </div>
                  <span className="text-[10px] text-[var(--txt3)] ml-1">Affects reminder delivery & history.</span>
                </div>

                {/* Day Start */}
                <div className="ep-group">
                  <label className="ep-label">Day resets at</label>
                  <div className="ep-input-wrap">
                    <span className="ep-icon-inner"><Clock size={16} /></span>
                    <select
                      className="ep-input has-icon ep-select"
                      value={formData.dayStartHour}
                      onChange={(e) => setFormData({ ...formData, dayStartHour: parseInt(e.target.value) })}
                    >
                      {[...Array(24)].map((_, i) => (
                        <option key={i} value={i}>
                          {i === 0 ? "Midnight (12 AM)" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i-12} PM`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="text-[10px] text-[var(--txt3)] ml-1">When your daily habits flip.</span>
                </div>
              </div>

              {/* Phone */}
              <div className="ep-group">
                <label className="ep-label">Phone Number</label>
                <div className="ep-input-wrap">
                  <span className="ep-icon-inner"><Phone size={16} /></span>
                  <input
                    type="tel"
                    className="ep-input has-icon"
                    placeholder="+91 00000 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="ep-footer">
            <button
              className="ep-btn-cancel"
              disabled={isSaving}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              className="ep-btn-save"
              disabled={isSaving}
              onClick={handleSubmit}
            >
              <div className="shine"></div>
              <span className="flex items-center justify-center gap-2">
                {isSaving ? <span className="ep-spinner" /> : "Save Changes →"}
              </span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
