"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import type { HabitWithStats } from "@/types"
import { API_ROUTES } from "@/lib/constants/api-routes"
import "./add-habit.css"


const ICONS = [
  '⚡', '🔥', '🏃', '💪', '📚', '🧘', '🎯', '✅',
  '💧', '🌅', '🎵', '🍎', '🧠', '💤', '🚴', '✍️',
  '🏋️', '🌿', '☕', '🎨', '🧩', '🎧', '🌊', '🏊',
]

const COLORS = [
  { hex: '#5b50e8', bg: '#eeedfb' }, { hex: '#8b5cf6', bg: '#f5f3ff' }, { hex: '#a855f7', bg: '#fdf4ff' },
  { hex: '#ec4899', bg: '#fdf2f8' }, { hex: '#ef4444', bg: '#fef2f2' }, { hex: '#f97316', bg: '#fff7ed' },
  { hex: '#f59e0b', bg: '#fffbeb' }, { hex: '#eab308', bg: '#fefce8' }, { hex: '#84cc16', bg: '#f7fee7' },
  { hex: '#22c55e', bg: '#f0fdf4' }, { hex: '#10b981', bg: '#ecfdf5' }, { hex: '#14b8a6', bg: '#f0fdfa' },
  { hex: '#06b6d4', bg: '#ecfeff' }, { hex: '#3b82f6', bg: '#eff6ff' }, { hex: '#0ea5e9', bg: '#f0f9ff' },
  { hex: '#6366f1', bg: '#eef2ff' },
]

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/** Resolve a hex string to a COLORS entry; fallback to COLORS[0] */
function resolveColor(hex?: string) {
  if (!hex) return COLORS[0]
  return COLORS.find(c => c.hex.toLowerCase() === hex.toLowerCase()) ?? COLORS[0]
}

const TIME_SLOTS = [
  { id: "morning", emoji: "🌅", name: "Morning", range: "6 – 10 am", defaultTime: "07:00" },
  { id: "afternoon", emoji: "☀️", name: "Afternoon", range: "12 – 4 pm", defaultTime: "12:00" },
  { id: "evening", emoji: "🌙", name: "Evening", range: "6 – 10 pm", defaultTime: "19:00" },
  { id: "night", emoji: "🌌", name: "Night", range: "10 pm – 6 am", defaultTime: "23:00" },
] as const

interface AddHabitDialogProps {
  children?: React.ReactNode
  /** When provided the dialog opens in EDIT mode */
  editHabit?: HabitWithStats | null
  /** Controlled open state (for edit mode where there's no trigger child) */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Called after a successful save in edit mode */
  onSuccess?: () => void
}

export function AddHabitDialog({
  children,
  editHabit,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onSuccess,
}: AddHabitDialogProps) {
  const router = useRouter()
  const isEditMode = !!editHabit

  // Support both controlled (edit) and uncontrolled (create) open state
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = (v: boolean) => {
    setInternalOpen(v)
    controlledOnOpenChange?.(v)
  }

  const [name, setName] = useState(editHabit?.name ?? '')
  const [icon, setIcon] = useState(editHabit?.icon ?? ICONS[0])
  const [color, setColor] = useState(resolveColor(editHabit?.color))
  const [freq, setFreq] = useState<"DAILY" | "WEEKLY">(editHabit?.frequency ?? "DAILY")
  const [days, setDays] = useState<Set<string>>(new Set(WEEK_DAYS))

  /** Derive initial time slot from a time string like "07:00" */
  function timeToSlot(t: string | null | undefined): string {
    if (!t) return 'morning'
    const [h] = t.split(':').map(Number)
    if (h >= 6 && h < 12) return 'morning'
    if (h >= 12 && h < 18) return 'afternoon'
    if (h >= 18 && h < 22) return 'evening'
    return 'night'
  }

  const [timeSlot, setTimeSlot] = useState(() => timeToSlot(editHabit?.reminderTime))
  const [reminderTime, setReminderTime] = useState(editHabit?.reminderTime ?? '07:00')
  const [emailReminders, setEmailReminders] = useState(editHabit?.emailReminders ?? true)
  const [isNightAdded, setIsNightAdded] = useState(() =>
    editHabit?.reminderTime ? timeToSlot(editHabit.reminderTime) === 'night' : false
  )
  const [showNightWarning, setShowNightWarning] = useState(false)

  const [nameErr, setNameErr] = useState('')
  const [daysErr, setDaysErr] = useState('')
  const [isShake, setIsShake] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const resetForm = () => {
    if (isEditMode && editHabit) {
      // In edit mode: reset back to habit's saved values
      setName(editHabit.name)
      setIcon(editHabit.icon ?? ICONS[0])
      setColor(resolveColor(editHabit.color))
      setFreq(editHabit.frequency)
      setDays(new Set(WEEK_DAYS))
      const slot = timeToSlot(editHabit.reminderTime)
      setTimeSlot(slot)
      setReminderTime(editHabit.reminderTime ?? '07:00')
      setEmailReminders(editHabit.emailReminders ?? true)
      setIsNightAdded(slot === 'night')
    } else {
      setName('')
      setIcon(ICONS[0])
      setColor(COLORS[0])
      setFreq('DAILY')
      setDays(new Set(WEEK_DAYS))
      setTimeSlot('morning')
      setReminderTime('07:00')
      setEmailReminders(true)
      setIsNightAdded(false)
    }
    setNameErr('')
    setDaysErr('')
    setIsShake(false)
    setIsSuccess(false)
    setIsSubmitting(false)
  }

  // Auto select time slot when manual exact time changes
  const handleReminderTimeChange = (val: string) => {
    setReminderTime(val)
    const [h] = val.split(":").map(Number)
    if (h >= 6 && h < 12) setTimeSlot("morning")
    else if (h >= 12 && h < 18) setTimeSlot("afternoon")
    else if (h >= 18 && h < 22) setTimeSlot("evening")
    else {
      if (isNightAdded) setTimeSlot("night")
      else setTimeSlot("custom")
    }
  }

  // When editHabit changes (different habit selected), re-seed the form
  useEffect(() => {
    if (open && isEditMode && editHabit) {
      setName(editHabit.name)
      setIcon(editHabit.icon ?? ICONS[0])
      setColor(resolveColor(editHabit.color))
      setFreq(editHabit.frequency)
      setDays(new Set(WEEK_DAYS))
      const slot = timeToSlot(editHabit.reminderTime)
      setTimeSlot(slot)
      setReminderTime(editHabit.reminderTime ?? '07:00')
      setEmailReminders(editHabit.emailReminders ?? true)
      setIsNightAdded(slot === 'night')
      setNameErr('')
      setDaysErr('')
      setIsSuccess(false)
      setIsSubmitting(false)
    }
  }, [open, editHabit?.id])

  useEffect(() => {
    if (!open) {
      setTimeout(resetForm, 300) // reset after modal closes smoothly
    }
  }, [open])

  const toggleDay = (d: string) => {
    const newDays = new Set(days)
    if (newDays.has(d)) {
      if (newDays.size > 1) newDays.delete(d)
    } else {
      newDays.add(d)
    }
    setDays(newDays)
    setDaysErr('')
  }

  const handleNameInput = (val: string) => {
    setName(val)
    setNameErr('')
  }

  const triggerShake = (err: string) => {
    setNameErr(err)
    setIsShake(false)
    setTimeout(() => setIsShake(true), 10)
    setTimeout(() => setIsShake(false), 400)
  }

  const spawnConfetti = () => {
    const cfColors = [color.hex, '#10b981', '#f59e0b', '#f97316', '#a855f7', '#ec4899']
    for (let i = 0; i < 28; i++) {
      const el = document.createElement('div')
      const size = 6 + Math.random() * 7
      el.className = 'ah-conf'
      el.style.cssText = `
        left: ${20 + Math.random() * 60}%;
        top: ${30 + Math.random() * 30}%;
        width: ${size}px;
        height: ${size}px;
        background: ${cfColors[i % cfColors.length]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-delay: ${(Math.random() * 0.25).toFixed(2)}s;
      `
      document.body.appendChild(el)
      setTimeout(() => el.remove(), 900)
    }
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      triggerShake('Habit name is required')
      return
    }
    if (name.trim().length > 60) {
      triggerShake('Max 60 characters')
      return
    }
    if (freq === 'WEEKLY' && days.size === 0) {
      setDaysErr('Select at least one day')
      return
    }

    setIsSubmitting(true)

    try {
      let res: Response

      if (isEditMode && editHabit) {
        // ── EDIT MODE: PATCH existing habit ───────────────────────────────
        res = await fetch(API_ROUTES.HABITS.BY_ID(editHabit.id), {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            icon,
            color: color.hex,
            frequency: freq,
            targetDays: freq === 'DAILY' ? 7 : days.size,
            reminderTime,
            emailReminders,
          }),
        })
      } else {
        // ── CREATE MODE: POST new habit ────────────────────────────────────
        res = await fetch(API_ROUTES.HABITS.BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            icon,
            color: color.hex,
            frequency: freq,
            targetDays: freq === 'DAILY' ? 7 : days.size,
            reminderTime,
            emailReminders,
          }),
        })
      }

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error ?? (isEditMode ? 'Failed to update habit' : 'Failed to create habit'))
      }

      setIsSuccess(true)
      spawnConfetti()
      router.refresh()
      onSuccess?.()
      setOpen(false)
    } catch (err) {
      console.error(err)
      setIsSubmitting(false)
      triggerShake('Something went wrong')
    }
  }

  const daysArr = Array.from(days)
  const freqText =
    freq === 'DAILY' ? 'Every day' :
      daysArr.length === 7 ? 'Every day' :
        daysArr.length === 1 ? daysArr[0] :
          daysArr.length <= 3 ? daysArr.join(', ') :
            `${daysArr.length} days/week`

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Only render a trigger in create (uncontrolled) mode */}
      {children && !isEditMode && (
        <DialogTrigger asChild>{children}</DialogTrigger>
      )}
      {/* We use showCloseButton={false} to rely on our custom Cancel button */}
      <DialogContent showCloseButton={false} className="p-0 border-none bg-transparent shadow-none max-w-none w-full sm:max-w-none flex items-center justify-center outline-none">

        {/* Night Warning Modal */}
        <AnimatePresence>
          {showNightWarning && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/40">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative"
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-5">
                  <span className="text-xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Late night habit?</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  We don't recommend doing work at late night. Rest is critical for building consistent habits long-term.
                </p>
                <div className="flex gap-3">
                  <button
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() => setShowNightWarning(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                    onClick={() => {
                      setIsNightAdded(true)
                      setShowNightWarning(false)
                      setTimeSlot("night")
                      setReminderTime("23:00")
                    }}
                  >
                    Yes, add it
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="ah-dialog">
          <div className="ah-dialog-accent" style={{ background: `linear-gradient(90deg, transparent, ${color.hex}, transparent)` }}></div>

          <div className="ah-dialog-scroll">
            {/* Header — changes based on mode */}
            <div className="ah-eyebrow" style={{ color: color.hex }}>
              {isEditMode ? 'Edit habit' : 'New habit'}
            </div>
            <div className="ah-title">
              {isEditMode
                ? <>Refine your <em style={{ color: color.hex }}>routine</em></>
                : <>Build something <em style={{ color: color.hex }}>lasting</em></>}
            </div>

            {/* Live preview */}
            <div className="ah-preview">
              <div className="ah-prev-icon" style={{ background: color.bg }}>{icon}</div>
              <div className="ah-prev-body">
                <div className={`ah-prev-name ${name.trim() ? "filled" : ""}`}>{name.trim() || 'Your habit name…'}</div>
                <div className="ah-prev-badge" style={{ background: color.bg, color: color.hex }}>{freqText}</div>
              </div>
              <div className="ah-prev-dot" style={{ background: color.hex }}></div>
            </div>

            {/* Name */}
            <div className="ah-name-wrap">
              <div className="ah-sec-lbl">Habit name</div>
              <input
                className={`ah-name-input ${nameErr ? "err" : ""} ${isShake ? "ah-shake" : ""}`}
                value={name}
                onChange={(e) => handleNameInput(e.target.value)}
                placeholder="e.g. Morning meditation"
                maxLength={60}
                autoComplete="off"
                onFocus={(e) => {
                  e.target.style.borderColor = color.hex
                  e.target.style.boxShadow = `0 0 0 3px ${color.hex}22`
                }}
                onBlur={(e) => {
                  if (!nameErr) {
                    e.target.style.borderColor = ''
                    e.target.style.boxShadow = ''
                  }
                }}
              />
              <div className="ah-name-foot">
                <div className="ah-name-err">{nameErr}</div>
                <div className="ah-char-count"><span>{name.length}</span>/60</div>
              </div>
            </div>

            {/* Icon picker */}
            <div className="ah-icon-section">
              <div className="ah-sec-lbl">Icon</div>
              <div className="ah-icon-tray">
                {ICONS.map((ic) => {
                  const isActive = ic === icon
                  return (
                    <button
                      key={ic}
                      type="button"
                      className={`ah-icon-btn ${isActive ? "sel" : ""}`}
                      style={{
                        background: isActive ? color.bg : '',
                        boxShadow: isActive ? `0 0 0 1.5px ${color.hex}` : ''
                      }}
                      onClick={() => setIcon(ic)}
                    >
                      {ic}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Color picker */}
            <div className="ah-color-section">
              <div className="ah-sec-lbl">Color</div>
              <div className="ah-color-tray">
                {COLORS.map((c) => {
                  const isActive = color.hex === c.hex
                  return (
                    <div
                      key={c.hex}
                      className={`ah-color-dot ${isActive ? "sel" : ""}`}
                      style={{ background: c.hex }}
                      onClick={() => setColor(c)}
                    >
                      <div className="ck" style={{ display: isActive ? 'flex' : 'none' }}>
                        <svg viewBox="0 0 13 10"><path d="M1.5 5L5 8.5L11.5 1.5" /></svg>
                      </div>
                      <div className="ring" style={{ borderColor: isActive ? c.hex : 'transparent' }}></div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Frequency */}
            <div className="ah-freq-section">
              <div className="ah-sec-lbl">Frequency</div>
              <div className="ah-freq-tray">
                <button
                  className={`ah-freq-btn ${freq === "DAILY" ? "sel" : ""}`}
                  onClick={() => { setFreq("DAILY"); setDaysErr("") }}
                >
                  <div className="fbg" style={{ background: color.hex, opacity: freq === "DAILY" ? 1 : 0 }}></div>
                  <span style={{ position: "relative" }}>Every day</span>
                </button>
                <button
                  className={`ah-freq-btn ${freq === "WEEKLY" ? "sel" : ""}`}
                  onClick={() => setFreq("WEEKLY")}
                >
                  <div className="fbg" style={{ background: color.hex, opacity: freq === "WEEKLY" ? 1 : 0 }}></div>
                  <span style={{ position: "relative" }}>Weekly</span>
                </button>
              </div>
            </div>

            {/* Day picker (weekly only) */}
            <div className={`ah-days-section ${freq === "WEEKLY" ? "show" : ""}`}>
              <div className="ah-sec-lbl">Which days?</div>
              <div className="ah-days-row">
                {WEEK_DAYS.map((d) => {
                  const isActive = days.has(d)
                  return (
                    <button
                      key={d}
                      type="button"
                      className={`ah-day-btn ${isActive ? "sel" : ""}`}
                      title={d}
                      style={{
                        background: isActive ? color.hex : '',
                        borderColor: isActive ? 'transparent' : '',
                        color: isActive ? '#fff' : ''
                      }}
                      onClick={() => toggleDay(d)}
                      onMouseEnter={(e) => {
                        if (!isActive) { e.currentTarget.style.borderColor = color.hex; e.currentTarget.style.color = color.hex }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) { e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = '' }
                      }}
                    >
                      {d[0]}
                    </button>
                  )
                })}
              </div>
              <div className="ah-days-err">{daysErr}</div>
            </div>

            {/* Reminders — shown in both create and edit mode */}
            <div className="ah-remind-section">
              <div className="ah-sec-lbl">Best time of day</div>
              <div className="ah-time-grid">
                {TIME_SLOTS.map((t) => {
                  if (t.id === "night" && !isNightAdded) {
                    return (
                      <div
                        key={t.id}
                        className="ah-time-card ah-time-card-add"
                        onClick={() => setShowNightWarning(true)}
                      >
                        <div className="ah-time-add-circle">
                          <Plus className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="ah-time-name ah-time-name-add">Add Night</div>
                      </div>
                    )
                  }

                  const isActive = timeSlot === t.id
                  return (
                    <div
                      key={t.id}
                      className={`ah-time-card ${isActive ? "sel" : ""}`}
                      onClick={() => {
                        setTimeSlot(t.id)
                        setReminderTime(t.defaultTime)
                      }}
                      style={{
                        borderColor: isActive ? color.hex : '',
                        background: isActive ? color.bg : ''
                      }}
                    >
                      <div className="ah-time-emoji">{t.emoji}</div>
                      <div className="ah-time-name">{t.name}</div>
                      <div className="ah-time-range">{t.range}</div>
                    </div>
                  )
                })}
              </div>

              <div className="ah-custom-time-wrap">
                <div className="ah-custom-time-label">Exact reminder time</div>
                <input
                  className="ah-time-picker-input"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => handleReminderTimeChange(e.target.value)}
                  style={{
                    borderColor: color.hex,
                    color: color.hex,
                    backgroundColor: color.bg
                  }}
                />
              </div>

              <div className="ah-remind-toggle-wrap">
                <div>
                  <div className="ah-remind-title">Email reminders</div>
                  <div className="ah-remind-sub">Daily digest + streak alerts</div>
                </div>
                <label className="ah-toggle-wrap">
                  <input
                    type="checkbox"
                    checked={emailReminders}
                    onChange={(e) => setEmailReminders(e.target.checked)}
                  />
                  <div className="ah-toggle-track" />
                  <div className="ah-toggle-thumb" />
                </label>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="ah-dialog-footer">
            <button className="ah-btn-cancel" onClick={() => setOpen(false)} disabled={isSubmitting}>Cancel</button>
            <button
              className={`ah-btn-submit ${isSuccess ? "ah-pop" : ""}`}
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{ background: isSuccess ? "#10b981" : color.hex }}
            >
              <div className="shine"></div>
              <span>
                {isSuccess
                  ? (isEditMode ? '✓ Saved!' : '✓ Habit created!')
                  : isSubmitting
                    ? (isEditMode ? 'Saving…' : 'Creating…')
                    : (isEditMode ? 'Save changes →' : 'Create habit →')}
              </span>
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
