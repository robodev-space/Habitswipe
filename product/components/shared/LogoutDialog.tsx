"use client"

import { signOut } from "next-auth/react"
import { toast } from "react-hot-toast"

interface LogoutDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function LogoutDialog({ isOpen, onClose }: LogoutDialogProps) {
  if (!isOpen) return null

  const handleConfirm = async () => {
    toast.success("Signed out successfully!")
    await signOut({ callbackUrl: "/login" })
    onClose()
  }

  return (
    <div
      className="overlay show"
      id="logoutDialog"
      style={{ display: "flex", zIndex: 9999 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="dialog">
        <div className="dialog-top"></div>
        <div className="dialog-body">
          <div className="dialog-ico">
            <svg viewBox="0 0 16 16"><path d="M10 3h3a1 1 0 011 1v8a1 1 0 01-1 1h-3M7 11l3-3-3-3M10 8H3" /></svg>
          </div>
          <div className="dialog-title">Sign out</div>
          <div className="dialog-desc">You&apos;ll be returned to the login screen. Your streaks and habits are safely saved.</div>
        </div>
        <div className="dialog-btns">
          <button className="d-cancel" onClick={onClose}>Cancel</button>
          <button className="d-confirm" onClick={handleConfirm}>Sign out</button>
        </div>
      </div>
    </div>
  )
}
