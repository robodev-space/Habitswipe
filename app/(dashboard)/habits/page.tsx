"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Pencil, Trash2, TrendingUp, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { HabitForm } from "@/components/habits/HabitForm"
import { StreakBadge } from "@/components/shared/StreakBadge"
import { useHabits } from "@/hooks/useHabits"
import { hexWithOpacity } from "@/lib/utils"
import type { HabitWithStats, CreateHabitInput } from "@/types"

type Modal =
  | { type: "create" }
  | { type: "edit"; habit: HabitWithStats }
  | null

// ── Portal Modal ──────────────────────────────────────────────────────────────
// Uses createPortal to render directly on document.body
// This completely escapes the sidebar layout, max-w constraints, everything.
// The modal will ALWAYS be centered on the true viewport.
function HabitModal({
  modal,
  onClose,
  onSubmit,
}: {
  modal: Modal
  onClose: () => void
  onSubmit: (data: CreateHabitInput) => Promise<void>
}) {
  if (!modal) return null

  return createPortal(
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          boxSizing: "border-box",
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          }}
        />

        {/* Modal card */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "480px",
            maxHeight: "90vh",
            overflowY: "auto",
            borderRadius: "24px",
            zIndex: 1,
            backgroundColor: "rgb(var(--surface))",
            border: "1px solid rgb(var(--border))",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ padding: "24px" }}>
            {/* Header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}>
              <h2 style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "rgb(var(--foreground))",
                fontFamily: "var(--font-dm-serif)",
              }}>
                {modal.type === "create" ? "New Habit" : "Edit Habit"}
              </h2>
              <button
                onClick={onClose}
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "rgb(var(--foreground-3))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <HabitForm
              initialValues={modal.type === "edit" ? modal.habit : undefined}
              onSubmit={onSubmit}
              onCancel={onClose}
              submitLabel={modal.type === "create" ? "Create Habit" : "Save Changes"}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HabitsPage() {
  const { habits, isLoading, fetchHabits, createHabit, updateHabit, deleteHabit } = useHabits()
  const [modal, setModal] = useState<Modal>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetchHabits() // Store handles its own internal abort
    setMounted(true)
    return () => {
      controller.abort()
      setMounted(false)
    }
  }, [])

  async function handleCreate(data: CreateHabitInput) {
    await createHabit(data)
    setModal(null)
  }

  async function handleEdit(data: CreateHabitInput) {
    if (modal?.type !== "edit") return
    await updateHabit(modal.habit.id, data)
    setModal(null)
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deleteHabit(id)
    } finally {
      setDeletingId(null)
    }
  }

  const handleSubmit = modal?.type === "create" ? handleCreate : handleEdit

  return (
    <>
      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl text-fore" style={{ fontFamily: "var(--font-dm-serif)" }}>
              My Habits
            </h1>
            <p className="text-fore-2 text-sm mt-1">
              {habits.length} habit{habits.length !== 1 ? "s" : ""} tracked
            </p>
          </div>
          <Button variant="gradient" onClick={() => setModal({ type: "create" })}>
            <Plus className="w-4 h-4" />
            New Habit
          </Button>
        </div>

        {/* Habit list */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
          </div>
        ) : habits.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌱</div>
            <h2 className="text-xl font-semibold text-fore mb-2">No habits yet</h2>
            <p className="text-fore-2 text-sm mb-6">Start by creating your first habit</p>
            <Button variant="gradient" onClick={() => setModal({ type: "create" })}>
              <Plus className="w-4 h-4" /> Create Habit
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {habits.map((habit, i) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="bg-surface border border-theme rounded-2xl p-4 flex items-center gap-4 card-shadow"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: hexWithOpacity(habit.color, 0.12) }}
                  >
                    {habit.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-fore truncate">{habit.name}</h3>
                      <StreakBadge streak={habit.currentStreak} size="sm" />
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-fore-3 capitalize">{habit.frequency.toLowerCase()}</span>
                      <span className="text-xs text-fore-3">·</span>
                      <span className="text-xs text-fore-3 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {habit.completionRate}% last 30d
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setModal({ type: "edit", habit })}
                      className="p-2 rounded-lg text-fore-3 hover:text-fore hover:bg-surface-2 transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(habit.id)}
                      disabled={deletingId === habit.id}
                      className="p-2 rounded-lg text-fore-3 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                    >
                      {deletingId === habit.id ? (
                        <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Portal modal — mounts on document.body, bypasses all layout */}
      {mounted && modal && (
        <HabitModal
          modal={modal}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  )
}