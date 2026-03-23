"use client"

import { useEffect, useState, useMemo } from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useHabits } from "@/hooks/useHabits"
import { Skeleton } from "@/components/ui/Skeleton"
import { AddHabitDialog } from "@/components/shared/AddHabitDialog"
import type { HabitWithStats } from "@/types"
import './habit.css'

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HabitsPage() {
  const { habits, isLoading, fetchHabits, updateHabit, deleteHabit } = useHabits()
  const [filter, setFilter] = useState<"All" | "Daily" | "Weekly">("All")

  // Edit dialog state
  const [editingHabit, setEditingHabit] = useState<HabitWithStats | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  useEffect(() => { fetchHabits() }, [])

  const activeHabits   = habits.filter(h => !h.isArchived)
  const archivedHabits = habits.filter(h =>  h.isArchived)

  const filteredHabits = useMemo(() => {
    if (filter === "All") return activeHabits
    return activeHabits.filter(h => h.frequency === filter.toUpperCase())
  }, [activeHabits, filter])

  // Open the edit dialog for a specific habit
  function openEdit(habit: HabitWithStats) {
    setEditingHabit(habit)
    setEditOpen(true)
  }

  // Visual accent colors (card glow / icon bg)
  const colors = ["#10b981", "#6366f1", "#a855f7", "#f97316", "#3b82f6", "#eab308"]
  const bgs    = ["#d1fae5", "#eef2ff", "#fdf4ff", "#fff7ed", "#eff6ff", "#fef9c3"]

  return (
    <>
      <div className="tab active" id="tab-habits">
        {/* Header */}
        <div className="ph">
          <div>
            <div className="pd">Your habits</div>
            <div className="pt">Build your <em>routine</em></div>
            <div className="ps">
              {isLoading
                ? "Loading..."
                : `${activeHabits.length} active habit${activeHabits.length !== 1 ? 's' : ''} · managing well`}
            </div>
          </div>
          <AddHabitDialog>
            <button className="btn-primary">
              <svg viewBox="0 0 14 14"><path d="M7 2v10M2 7h10" /></svg>New habit
            </button>
          </AddHabitDialog>
        </div>

        {/* Filter pills */}
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
        <div style={{ marginBottom: 16 }} />

        {/* Habit Grid */}
        <div className="h-grid">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[148px] rounded-[16px]" />
            ))
          ) : (
            <>
              {filteredHabits.map((habit, i) => {
                const color = colors[i % colors.length]
                const bg    = bgs[i % bgs.length]
                return (
                  <div className="hc" key={habit.id}>
                    <div className="hc-glow" style={{ background: color }} />
                    <div className="hc-top">
                      <div className="hc-icon" style={{ background: bg }}>{habit.icon || "✨"}</div>

                      {/* Three-dot dropdown */}
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button
                            className="hc-menu-btn"
                            onClick={(e) => e.stopPropagation()}
                            aria-label="Habit options"
                          >
                            ···
                          </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            className="hc-dropdown-content"
                            align="end"
                            sideOffset={6}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* ✏️ Edit — opens AddHabitDialog in edit mode */}
                            <DropdownMenu.Item
                              className="hc-dd-item"
                              onSelect={() => openEdit(habit)}
                            >
                              <span className="hc-dd-icon">✏️</span>
                              Edit habit
                            </DropdownMenu.Item>

                            {/* 🗑️ Delete */}
                            <DropdownMenu.Item
                              className="hc-dd-item hc-dd-item--danger"
                              onSelect={() => deleteHabit(habit.id)}
                            >
                              <span className="hc-dd-icon">🗑️</span>
                              Delete
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </div>

                    <div className="hc-name">{habit.name}</div>
                    <div className="hc-freq capitalize">{habit.frequency.toLowerCase()}</div>
                    <div className="hc-bar-t">
                      <div className="hc-bar-f" style={{ width: `${habit.completionRate}%`, background: color }} />
                    </div>
                    <div className="hc-foot">
                      <span className="hc-str">🔥 {habit.currentStreak || 0}d</span>
                      <span className="hc-pct">{habit.completionRate}% this month</span>
                    </div>
                  </div>
                )
              })}

              {/* Add new card */}
              <AddHabitDialog>
                <div className="hc-add">
                  <div className="hc-add-ico">+</div>
                  <div className="hc-add-lbl">Add new habit</div>
                </div>
              </AddHabitDialog>
            </>
          )}
        </div>

        {/* Archived section */}
        {archivedHabits.length > 0 && (
          <>
            <div className="sh">
              <div className="st">Archived · {archivedHabits.length}</div>
              <div className="sl">View all →</div>
            </div>
            {archivedHabits.slice(0, 3).map(habit => (
              <div className="arch-row mb-2" key={habit.id}>
                <div className="arch-ico">{habit.icon || "📦"}</div>
                <div className="arch-name">{habit.name}</div>
                <div className="arch-date">Archived recently</div>
                <button
                  className="missed-add"
                  onClick={() => updateHabit(habit.id, { isArchived: false })}
                >
                  Restore
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Edit habit dialog — rendered once outside the grid, controlled via state */}
      {editingHabit && (
        <AddHabitDialog
          editHabit={editingHabit}
          open={editOpen}
          onOpenChange={(v) => {
            setEditOpen(v)
            if (!v) setTimeout(() => setEditingHabit(null), 300)
          }}
          onSuccess={fetchHabits}
        />
      )}
    </>
  )
}