"use client"

import { useEffect, useState, useMemo } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { HabitForm } from "@/components/habits/HabitForm"
import { useHabits } from "@/hooks/useHabits"
import { Skeleton } from "@/components/ui/Skeleton"
import type { HabitWithStats, CreateHabitInput } from "@/types"

type Modal =
  | { type: "create" }
  | { type: "edit"; habit: HabitWithStats }
  | null

// ── Portal Modal ──────────────────────────────────────────────────────────────
function HabitModal({
  modal,
  onClose,
  onSubmit,
}: {
  modal: Modal
  onClose: () => void
  onSubmit: (data: CreateHabitInput) => Promise<void>
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  
  if (!modal || !mounted) return null

  return createPortal(
    <AnimatePresence>
      <div
        style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
          boxSizing: "border-box",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        />
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "relative", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto",
            borderRadius: "24px", zIndex: 1, backgroundColor: "rgb(var(--surface, 255,255,255))",
            border: "1px solid rgb(var(--border, 230,230,230))", boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          }}
          className="bg-surf border-bord"
        >
          <div style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 className="text-[20px] font-bold text-txt" style={{ fontFamily: "var(--font-dm-serif)" }}>
                {modal.type === "create" ? "New Habit" : "Edit Habit"}
              </h2>
              <button onClick={onClose} className="p-2 rounded-lg bg-transparent border-none cursor-pointer text-txt3 flex items-center justify-center">
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
  const { habits, isLoading, isInitialized, fetchHabits, createHabit, updateHabit, deleteHabit } = useHabits()
  const [modal, setModal] = useState<Modal>(null)
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState<"All" | "Daily" | "Weekly">("All")

  useEffect(() => {
    fetchHabits()
    setMounted(true)
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

  const handleSubmit = modal?.type === "create" ? handleCreate : handleEdit

  const activeHabits = habits.filter(h => h.status === "ACTIVE")
  const archivedHabits = habits.filter(h => h.status === "ARCHIVED")

  const filteredHabits = useMemo(() => {
    if (filter === "All") return activeHabits
    return activeHabits.filter(h => h.frequency === filter.toUpperCase())
  }, [activeHabits, filter])

  // Mock colors matching HTML
  const colors = ["#10b981", "#6366f1", "#a855f7", "#f97316", "#3b82f6", "#eab308"]
  const bgs = ["#d1fae5", "#eef2ff", "#fdf4ff", "#fff7ed", "#eff6ff", "#fef9c3"]

  return (
    <>
      <div className="tab active" id="tab-habits">
        {/* Header */}
        <div className="ph">
          <div>
            <div className="pd">Your habits</div>
            <div className="pt">Build your <em>routine</em></div>
            <div className="ps">
              {isLoading ? "Loading..." : `${activeHabits.length} active habit${activeHabits.length !== 1 ? 's' : ''} · managing well`}
            </div>
          </div>
          <button className="btn-primary" onClick={() => setModal({ type: "create" })}>
            <svg viewBox="0 0 14 14"><path d="M7 2v10M2 7h10" /></svg>New habit
          </button>
        </div>

        {/* Filter */}
        <div className="sh">
          <div className="st">Active · {activeHabits.length}</div>
          <div className="filter-pills">
            {(["All", "Daily", "Weekly"] as const).map(f => (
              <div 
                key={f}
                className={`pill ${filter === f ? 'on' : 'off'}`} 
                onClick={() => setFilter(f)}
              >
                {f}
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}></div>

        {/* Grid */}
        <div className="h-grid">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[148px] rounded-[16px]" />)
          ) : (
            <>
              {filteredHabits.map((habit, i) => {
                const color = colors[i % colors.length]
                const bg = bgs[i % bgs.length]
                return (
                  <div className="hc" key={habit.id} onClick={() => setModal({ type: "edit", habit })}>
                    <div className="hc-glow" style={{ background: color }}></div>
                    <div className="hc-top">
                      <div className="hc-icon" style={{ background: bg }}>{habit.icon || "✨"}</div>
                      <div className="hc-menu">···</div>
                    </div>
                    <div className="hc-name">{habit.name}</div>
                    <div className="hc-freq capitalize">{habit.frequency.toLowerCase()}</div>
                    <div className="hc-bar-t">
                      <div className="hc-bar-f" style={{ width: `${habit.completionRate}%`, background: color }}></div>
                    </div>
                    <div className="hc-foot">
                      <span className="hc-str">🔥 {habit.currentStreak || 0}d</span>
                      <span className="hc-pct">{habit.completionRate}% this month</span>
                    </div>
                  </div>
                )
              })}
              <div className="hc-add" onClick={() => setModal({ type: "create" })}>
                <div className="hc-add-ico">+</div>
                <div className="hc-add-lbl">Add new habit</div>
              </div>
            </>
          )}
        </div>

        {/* Archived */}
        {archivedHabits.length > 0 && (
          <>
            <div className="sh"><div className="st">Archived · {archivedHabits.length}</div><div className="sl">View all →</div></div>
            {archivedHabits.slice(0, 3).map(habit => (
              <div className="arch-row mb-2" key={habit.id}>
                <div className="arch-ico">{habit.icon || "📦"}</div>
                <div className="arch-name">{habit.name}</div>
                <div className="arch-date">Archived recently</div>
                <button className="missed-add" onClick={() => updateHabit(habit.id, { status: "ACTIVE" })}>Restore</button>
              </div>
            ))}
          </>
        )}
      </div>

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