"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, AtSign, Phone, FileText, X } from "lucide-react"
import { toast } from "react-hot-toast"
import { API_ROUTES } from "@/lib/constants/api-routes"
import "./edit-profile.css"
import "./confirm-dialog.css" // Reusing overlay styles

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: {
    name: string | null
    username: string | null
    phone: string | null
    bio: string | null
  }
  onSuccess: () => void
}

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
    bio: initialData.bio || ""
  })
  const [isSaving, setIsSaving] = useState(false)

  // Sync state if initialData changes (e.g. after refresh)
  useEffect(() => {
    setFormData({
      name: initialData.name || "",
      username: initialData.username || "",
      phone: initialData.phone || "",
      bio: initialData.bio || ""
    })
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

      toast.success("Profile updated successfully! ✨")
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="cd-overlay">
          <motion.div
            className="cd-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isSaving && onOpenChange(false)}
          />

          <motion.div
            className="cd-card ep-card"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1,    opacity: 1, y: 0 }}
            exit={{   scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            style={{ maxWidth: "440px", width: "94%" }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-extrabold text-[var(--txt)] tracking-tight">Edit Profile</h2>
              <button 
                className="p-2 hover:bg-[var(--surf2)] rounded-xl transition-all active:scale-95"
                onClick={() => onOpenChange(false)}
              >
                <X size={18} className="text-[var(--txt3)]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="ep-form">
              {/* Full Name */}
              <div className="ep-group">
                <label className="ep-label">Full Name</label>
                <div className="ep-input-wrap">
                  <span className="ep-icon-inner"><User size={18} /></span>
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

              {/* Phone */}
              <div className="ep-group">
                <label className="ep-label">Phone Number</label>
                <div className="ep-input-wrap">
                  <span className="ep-icon-inner"><Phone size={18} /></span>
                  <input
                    type="tel"
                    className="ep-input has-icon"
                    placeholder="+91 00000 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="ep-group">
                <label className="ep-label">Bio</label>
                <div className="ep-input-wrap">
                  <textarea
                    className="ep-input ep-textarea"
                    placeholder="Tell us about your journey..."
                    maxLength={160}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>
                <div className="ep-char-count">{formData.bio.length}/160</div>
              </div>

              {/* Actions */}
              <div className="ep-actions">
                <button
                  type="button"
                  className="ep-btn ep-btn-cancel"
                  disabled={isSaving}
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ep-btn ep-btn-save flex items-center justify-center gap-2"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span className="ep-spinner" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
