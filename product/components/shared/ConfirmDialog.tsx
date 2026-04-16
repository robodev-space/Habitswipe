"use client"

// components/shared/ConfirmDialog.tsx
// ─────────────────────────────────────────────────────────────────────────────
// CONFIRM DIALOG — Reusable confirmation overlay
// Matches the app's "night warning" modal aesthetic.
// Use for: delete habit, sign-out, delete account, archive, etc.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react"
import { Trash2, AlertTriangle, CheckCircle2 } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import "./confirm-dialog.css"

type Variant = "danger" | "warning" | "default"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Any Lucide icon component, e.g. <Trash2 size={24} /> */
  icon?: React.ReactNode
  /** Background color of the icon circle — defaults to variant colour */
  iconBg?: string
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  /** Controls the colour of the confirm button */
  variant?: Variant
  /** Shows a spinner on the confirm button while an async action runs */
  isLoading?: boolean
  onConfirm: () => void | Promise<void>
}

const VARIANT_COLORS: Record<Variant, { btn: string; iconBg: string }> = {
  danger:  { btn: "#ef4444", iconBg: "#fef2f2" },
  warning: { btn: "#f59e0b", iconBg: "#fffbeb" },
  default: { btn: "#5b50e8", iconBg: "#eeedfb" },
}

const VARIANT_ICONS: Record<Variant, React.ReactNode> = {
  danger:  <Trash2       size={22} strokeWidth={2} color="#ef4444" />,
  warning: <AlertTriangle size={22} strokeWidth={2} color="#f59e0b" />,
  default: <CheckCircle2  size={22} strokeWidth={2} color="#5b50e8" />,
}

export function ConfirmDialog({
  open,
  onOpenChange,
  icon,
  iconBg,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const { btn, iconBg: defaultIconBg } = VARIANT_COLORS[variant]

  const displayIcon = icon ?? VARIANT_ICONS[variant]
  const displayBg   = iconBg ?? defaultIconBg

  async function handleConfirm() {
    await onConfirm()
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="cd-overlay">
          {/* Backdrop */}
          <motion.div
            className="cd-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isLoading && onOpenChange(false)}
          />

          {/* Card */}
          <motion.div
            className="cd-card"
            initial={{ scale: 0.95, opacity: 0, y: 8 }}
            animate={{ scale: 1,    opacity: 1, y: 0 }}
            exit={{   scale: 0.95, opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
          >
            {/* Icon */}
            <div
              className="cd-icon-wrap"
              style={{ background: displayBg }}
            >
              <span className="cd-icon">{displayIcon}</span>
            </div>

            {/* Text */}
            <h3 className="cd-title">{title}</h3>
            <p className="cd-desc">{description}</p>

            {/* Actions */}
            <div className="cd-actions">
              <button
                className="cd-btn cd-btn-cancel"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {cancelLabel}
              </button>
              <button
                className="cd-btn cd-btn-confirm"
                style={{ background: btn }}
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="cd-spinner" />
                ) : (
                  confirmLabel
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
