"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import "./add-habit.css"

const ICONS = [
  '⚡','🔥','🏃','💪','📚','🧘','🎯','✅',
  '💧','🌅','🎵','🍎','🧠','💤','🚴','✍️',
  '🏋️','🌿','☕','🎨','🧩','🎧','🌊','🏊',
]

const COLORS = [
  {hex:'#5b50e8',bg:'#eeedfb'},{hex:'#8b5cf6',bg:'#f5f3ff'},{hex:'#a855f7',bg:'#fdf4ff'},
  {hex:'#ec4899',bg:'#fdf2f8'},{hex:'#ef4444',bg:'#fef2f2'},{hex:'#f97316',bg:'#fff7ed'},
  {hex:'#f59e0b',bg:'#fffbeb'},{hex:'#eab308',bg:'#fefce8'},{hex:'#84cc16',bg:'#f7fee7'},
  {hex:'#22c55e',bg:'#f0fdf4'},{hex:'#10b981',bg:'#ecfdf5'},{hex:'#14b8a6',bg:'#f0fdfa'},
  {hex:'#06b6d4',bg:'#ecfeff'},{hex:'#3b82f6',bg:'#eff6ff'},{hex:'#0ea5e9',bg:'#f0f9ff'},
  {hex:'#6366f1',bg:'#eef2ff'},
]

const WEEK_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

const TIME_SLOTS = [
  { id: "morning",   emoji: "🌅", name: "Morning",   range: "6 – 10 am",  defaultTime: "07:00" },
  { id: "afternoon", emoji: "☀️",  name: "Afternoon", range: "12 – 4 pm",  defaultTime: "12:00" },
  { id: "evening",   emoji: "🌙", name: "Evening",   range: "6 – 10 pm",  defaultTime: "19:00" },
  { id: "night",     emoji: "🌌", name: "Night",     range: "10 pm – 6 am", defaultTime: "23:00" },
] as const

export function AddHabitDialog({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  
  const [name, setName] = useState('')
  const [icon, setIcon] = useState(ICONS[0])
  const [color, setColor] = useState(COLORS[0])
  const [freq, setFreq] = useState<"DAILY" | "WEEKLY">("DAILY")
  const [days, setDays] = useState<Set<string>>(new Set(WEEK_DAYS))

  const [timeSlot, setTimeSlot] = useState("morning")
  const [reminderTime, setReminderTime] = useState("07:00")
  const [emailReminders, setEmailReminders] = useState(true)
  const [isNightAdded, setIsNightAdded] = useState(false)
  const [showNightWarning, setShowNightWarning] = useState(false)
  
  const [nameErr, setNameErr] = useState('')
  const [daysErr, setDaysErr] = useState('')
  const [isShake, setIsShake] = useState(false)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const resetForm = () => {
    setName('')
    setIcon(ICONS[0])
    setColor(COLORS[0])
    setFreq("DAILY")
    setDays(new Set(WEEK_DAYS))
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
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          icon,
          color: color.hex,
          frequency: freq,
          targetDays: freq === "DAILY" ? 7 : days.size,
          reminderTime,
          emailReminders,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to create habit")
      }

      setIsSuccess(true)
      spawnConfetti()
      
      // refresh parent routes automatically before closing!
      router.refresh()

      setTimeout(() => {
        setOpen(false)
      }, 1600)
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
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      {/* We use showCloseButton={false} to rely on our custom Cancel button, and strip out Shadcn padding to use raw design */}
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
            {/* Header */}
            <div className="ah-eyebrow" style={{ color: color.hex }}>New habit</div>
            <div className="ah-title">Build something <em style={{ color: color.hex }}>lasting</em></div>

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
                        <svg viewBox="0 0 13 10"><path d="M1.5 5L5 8.5L11.5 1.5"/></svg>
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

            {/* Reminders section imported from Onboarding prototype */}
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
              <span>{isSuccess ? "✓ Habit created!" : "Create habit →"}</span>
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
