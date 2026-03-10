// app/(dashboard)/habits/page.tsx  →  route: /habits
// ─────────────────────────────────────────────────────────────────────────────
// HABITS PAGE — View, create, edit, archive habits
// ─────────────────────────────────────────────────────────────────────────────

"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Pencil, Trash2, Archive, Flame, TrendingUp, X
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { HabitForm } from "@/components/habits/HabitForm"
import { StreakBadge } from "@/components/shared/StreakBadge"
import { useHabits } from "@/hooks/useHabits"
import { hexWithOpacity, cn } from "@/lib/utils"
import type { HabitWithStats, CreateHabitInput } from "@/types"

type Modal =
  | { type: "create" }
  | { type: "edit"; habit: HabitWithStats }
  | null

export default function HabitsPage() {
  const { habits, isLoading, fetchHabits, createHabit, updateHabit, deleteHabit } =
    useHabits()
  const [modal, setModal] = useState<Modal>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchHabits()
  }, [])

  // ── Handlers ──────────────────────────────────────────────────────────────
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

  async function handleArchive(habit: HabitWithStats) {
    await updateHabit(habit.id, { isArchived: !habit.isArchived })
  }

  return (
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
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: hexWithOpacity(habit.color, 0.12) }}
                >
                  {habit.icon}
                </div>

                {/* Info */}
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

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setModal({ type: "edit", habit })}
                    className="p-2 rounded-lg text-fore-3 hover:text-fore hover:bg-surface-2 transition-all"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(habit.id)}
                    disabled={deletingId === habit.id}
                    className="p-2 rounded-lg text-fore-3 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                    title="Delete"
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

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {modal && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModal(null)}
            />
            {/* Sheet */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md md:w-full z-50"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
            >
              <div className="bg-surface rounded-t-3xl md:rounded-3xl border border-theme p-6 max-h-[90vh] overflow-y-auto">
                {/* Handle */}
                <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto mb-5 md:hidden" />

                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-fore">
                    {modal.type === "create" ? "New Habit" : "Edit Habit"}
                  </h2>
                  <button
                    onClick={() => setModal(null)}
                    className="p-2 rounded-lg text-fore-3 hover:bg-surface-2 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <HabitForm
                  initialValues={modal.type === "edit" ? modal.habit : undefined}
                  onSubmit={modal.type === "create" ? handleCreate : handleEdit}
                  onCancel={() => setModal(null)}
                  submitLabel={modal.type === "create" ? "Create Habit" : "Save Changes"}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
