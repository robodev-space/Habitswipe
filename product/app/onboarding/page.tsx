// app/onboarding/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// ONBOARDING PAGE — 4-step wizard for new users
// Uses a warm, earthy light theme matching the HabitFlow mockup
// ─────────────────────────────────────────────────────────────────────────────

"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Plus, AlertCircle } from "lucide-react"
import { API_ROUTES } from "@/lib/constants/api-routes"
import "./onboarding.css"

// ── Data ────────────────────────────────────────────────────────────────────

const GOALS = [
  { id: "health", icon: "💪", title: "Health & fitness", desc: "Exercise, sleep, nutrition" },
  { id: "mind", icon: "🧘", title: "Mental wellness", desc: "Mindfulness, stress, mood" },
  { id: "learn", icon: "📚", title: "Learning & growth", desc: "Reading, skills, languages" },
  { id: "work", icon: "🎯", title: "Productivity", desc: "Focus, goals, deep work" },
  { id: "finance", icon: "💰", title: "Finance", desc: "Saving, budgeting, investing" },
  { id: "custom", icon: "✨", title: "Something else", desc: "I'll build my own habits" },
] as const

const EMOJIS = ["🧘", "🏃", "💧", "📚", "✍️", "😴", "🥗", "🎵", "🧹", "💊", "☕", "🌿"] as const

const FREQUENCIES = [
  { id: "daily", label: "Every\nday" },
  { id: "weekdays", label: "Week-\ndays" },
  { id: "3x", label: "3× a\nweek" },
  { id: "custom", label: "Custom" },
] as const

const TIME_SLOTS = [
  { id: "morning", emoji: "🌅", name: "Morning", range: "6 – 10 am", defaultTime: "07:00" },
  { id: "afternoon", emoji: "☀️", name: "Afternoon", range: "12 – 4 pm", defaultTime: "12:00" },
  { id: "evening", emoji: "🌙", name: "Evening", range: "6 – 10 pm", defaultTime: "19:00" },
  { id: "night", emoji: "🌌", name: "Night", range: "10 pm – 6 am", defaultTime: "23:00" },
] as const

const DAYS = [
  { id: "mon", label: "M" },
  { id: "tue", label: "T" },
  { id: "wed", label: "W" },
  { id: "thu", label: "T" },
  { id: "fri", label: "F" },
  { id: "sat", label: "S" },
  { id: "sun", label: "S" },
];

const GOAL_LABELS: Record<string, string> = {
  health: "Health & fitness",
  mind: "Mental wellness",
  learn: "Learning & growth",
  work: "Productivity",
  finance: "Finance",
  custom: "My own goals",
}

const FREQ_LABELS: Record<string, string> = {
  daily: "Every day",
  weekdays: "Weekdays",
  "3x": "3× a week",
  custom: "Custom",
}

const BTN_LABELS: Record<number, string> = {
  1: "Set my first habit",
  2: "Choose reminder time",
  3: "See my summary",
  4: "Start tracking  🌿",
}

// ── Animation variants ──────────────────────────────────────────────────────

const slideForward = {
  initial: { opacity: 0, x: 32 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -32 },
}

const slideBackward = {
  initial: { opacity: 0, x: -32 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 32 },
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatTime12(time24: string) {
  const [h, m] = time24.split(":").map(Number)
  const ampm = h >= 12 ? "PM" : "AM"
  const h12 = h % 12 || 12
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`
}

// ── Component ───────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter()
  const { update: updateSession } = useSession()

  // Wizard state
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState<"forward" | "back">("forward")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [goal, setGoal] = useState("health")
  const [habitName, setHabitName] = useState("")
  const [habitIcon, setHabitIcon] = useState("🧘")
  const [frequency, setFrequency] = useState("daily")
  const [timeSlot, setTimeSlot] = useState("morning")
  const [reminderTime, setReminderTime] = useState("07:00")
  const [emailReminders, setEmailReminders] = useState(true)
  const [nameError, setNameError] = useState(false)
  const [selectedDays, setSelectedDays] = useState<string[]>(["mon", "tue", "wed", "thu", "fri", "sat", "sun"])
  const [isNightAdded, setIsNightAdded] = useState(false)
  const [showNightWarning, setShowNightWarning] = useState(false)

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

  // BG color per step
  const bgColors: Record<number, string> = { 1: "#ffffff", 2: "#FAFAFE", 3: "#F8F7FF", 4: "#F4F2FF" }

  const goTo = useCallback((n: number, dir: "forward" | "back" = "forward") => {
    setDirection(dir)
    setStep(n)
  }, [])

  const nextStep = useCallback(() => {
    if (step === 2 && !habitName.trim()) {
      setNameError(true)
      return
    }
    if (step < 4) goTo(step + 1, "forward")
  }, [step, habitName, goTo])

  const prevStep = useCallback(() => {
    if (step > 1) goTo(step - 1, "back")
  }, [step, goTo])

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)
    try {
      // Map UI frequency to DB enum
      let dbFrequency: "DAILY" | "WEEKLY" = "DAILY"
      let targetDays = 7
      if (frequency !== "daily") {
        dbFrequency = "WEEKLY"
        targetDays = Math.max(1, selectedDays.length)
      }

      const res = await fetch(API_ROUTES.ONBOARDING.BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          habitName: habitName.trim() || "Morning meditation",
          habitIcon,
          habitColor: "#4f46e5",
          frequency: dbFrequency,
          targetDays,
          reminderTime,
          emailReminders,
        }),
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || "Failed to save")
      }

      // Update the NextAuth session so the middleware knows onboarding is complete
      await updateSession()

      // Redirect to dashboard
      router.push("/today")
    } catch (err) {
      console.error("[ONBOARDING_ERROR]", err)
      setIsSubmitting(false)
    }
  }, [goal, habitName, habitIcon, frequency, reminderTime, emailReminders, router, updateSession])

  const handleSkip = useCallback(async () => {
    setIsSubmitting(true)
    try {
      await fetch(API_ROUTES.ONBOARDING.BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // goal: "custom",
          // habitName: "Morning meditation",
          // habitIcon: "🧘",
          // habitColor: "#4f46e5",
          // frequency: "DAILY",
          // targetDays: 7,
          // reminderTime: "07:00",
          // emailReminders: true,
        }),
      })
      await updateSession()
      router.push("/today")
    } catch {
      setIsSubmitting(false)
    }
  }, [router, updateSession])

  const variants = direction === "forward" ? slideForward : slideBackward

  return (
    <div className="onboarding-shell" style={{ background: bgColors[step] }}>

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
                <AlertCircle className="w-6 h-6 text-amber-600" />
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

      {/* Background art */}
      <div className="ob-bg-art">
        <div className="ob-bg-circle ob-bc1" />
        <div className="ob-bg-circle ob-bc2" />
        <div className="ob-bg-circle ob-bc3" />
        <div className="ob-bg-circle ob-bc4" />
      </div>

      {/* Top bar */}
      <div className="ob-topbar">
        <div className="ob-logo">
          <div className="ob-logo-mark">
            <Zap className="w-3.5 h-3.5" fill="white" />
          </div>
          HabitSwipe
        </div>
        <button className="ob-skip-btn" onClick={handleSkip} disabled={isSubmitting}>
          Skip setup →
        </button>
      </div>

      {/* Mobile: progress + dots */}
      <div className="ob-progress-track">
        <div className="ob-progress-fill" style={{ width: `${(step / 4) * 100}%` }} />
      </div>
      <div className="ob-step-dots">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`ob-step-dot ${i === step ? "active" : i < step ? "done" : "idle"}`}
            onClick={() => { if (i < step) goTo(i, "back") }}
          />
        ))}
      </div>

      {/* Main layout: sidebar + content */}
      <div className="ob-main-layout">
        {/* Desktop sidebar */}
        <div className="ob-sidebar">
          <div className="ob-step-list">
            {[
              { num: 1, label: "Your goal" },
              { num: 2, label: "First habit" },
              { num: 3, label: "Reminders" },
              { num: 4, label: "All set!" },
            ].map((s) => (
              <div
                key={s.num}
                className={`ob-step-item ${s.num === step ? "active" : s.num < step ? "done" : ""}`}
                onClick={() => { if (s.num < step) goTo(s.num, "back") }}
              >
                <div className="ob-step-num">{s.num}</div>
                <div className="ob-step-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="ob-content-area">
          {/* Stage */}
          <div className="ob-stage">
            <AnimatePresence mode="wait">
              {/* ── STEP 1: Goal ── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  className="ob-step-panel"
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className="ob-eyebrow">Step 1 of 4</div>
                  <h1 className="ob-headline">
                    What&apos;s your main<br /><em>goal right now?</em>
                  </h1>
                  <p className="ob-sub">
                    We&apos;ll suggest the right habits to get you started. Pick the one that matters most.
                  </p>

                  <div className="ob-card">
                    <div className="ob-goal-grid">
                      {GOALS.map((g) => (
                        <div
                          key={g.id}
                          className={`ob-goal-card ${goal === g.id ? "sel" : ""}`}
                          onClick={() => setGoal(g.id)}
                        >
                          <div className="ob-check-mark" />
                          <div className="ob-goal-icon-wrap">{g.icon}</div>
                          <div className="ob-goal-title">{g.title}</div>
                          <div className="ob-goal-desc">{g.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="ob-social-strip ob-social-strip-inline">
                    <div className="ob-avatar-stack">
                      <div className="ob-av g1">A</div>
                      <div className="ob-av g2">M</div>
                      <div className="ob-av g3">P</div>
                      <div className="ob-av g4">R</div>
                    </div>
                    <span>Join 12,400+ people building better habits</span>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: First habit ── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  className="ob-step-panel"
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className="ob-eyebrow">Step 2 of 4</div>
                  <h1 className="ob-headline">
                    Name your<br /><em>first habit</em>
                  </h1>
                  <p className="ob-sub">
                    Start with just one. Consistency with one habit builds the confidence for more.
                  </p>

                  <div className="ob-card ob-card-scroll">
                    <div className="ob-field-label">Habit name</div>
                    <input
                      className="ob-text-input"
                      type="text"
                      placeholder="e.g. Morning meditation…"
                      maxLength={48}
                      value={habitName}
                      onChange={(e) => { setHabitName(e.target.value); setNameError(false) }}
                      autoFocus
                    />
                    {nameError && (
                      <div className="ob-field-error">Please give your habit a name</div>
                    )}

                    <div className="ob-field-label">Pick an icon</div>
                    <div className="ob-emoji-scroll">
                      {EMOJIS.map((emoji) => (
                        <div
                          key={emoji}
                          className={`ob-e-btn ${habitIcon === emoji ? "sel" : ""}`}
                          onClick={() => setHabitIcon(emoji)}
                        >
                          {emoji}
                        </div>
                      ))}
                    </div>

                    <div className="ob-field-label">How often?</div>
                    <div className="ob-freq-grid mb-5">
                      {FREQUENCIES.map((f) => (
                        <div
                          key={f.id}
                          className={`ob-freq-btn ${frequency === f.id ? "sel" : ""}`}
                          onClick={() => {
                            setFrequency(f.id);
                            if (f.id === "daily") setSelectedDays(["mon", "tue", "wed", "thu", "fri", "sat", "sun"])
                            else if (f.id === "weekdays") setSelectedDays(["mon", "tue", "wed", "thu", "fri"])
                            else if (f.id === "3x") setSelectedDays(["mon", "wed", "fri"])
                          }}
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {f.label}
                        </div>
                      ))}
                    </div>

                    {frequency !== "daily" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="overflow-hidden mb-1"
                      >
                        <div className="ob-field-label">Which days?</div>
                        <div className="flex justify-between items-center gap-1">
                          {DAYS.map(day => (
                            <button
                              key={day.id}
                              className={`w-[36px] h-[36px] flex items-center justify-center rounded-full text-[13px] font-bold transition-all ${selectedDays.includes(day.id) ? 'bg-indigo-600 text-white shadow-[0_4px_12px_rgba(79,70,229,0.2)]' : 'bg-[#F4F2FF] text-[#6B7280] hover:bg-[#E0DEF7]'}`}
                              onClick={() => {
                                if (selectedDays.includes(day.id)) {
                                  setSelectedDays(selectedDays.filter(d => d !== day.id))
                                } else {
                                  setSelectedDays([...selectedDays, day.id])
                                }
                                setFrequency("custom")
                              }}
                            >
                              {day.label}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Reminder ── */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  className="ob-step-panel"
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className="ob-eyebrow">Step 3 of 4</div>
                  <h1 className="ob-headline">
                    When should we<br /><em>remind you?</em>
                  </h1>
                  <p className="ob-sub">
                    A well-timed nudge makes habits stick. People with reminders are 3× more likely to complete their habits.
                  </p>

                  <div className="ob-card">
                    <div className="ob-field-label" style={{ marginBottom: 12 }}>Best time of day</div>
                    <div className="ob-time-grid">
                      {TIME_SLOTS.map((t) => {
                        if (t.id === "night" && !isNightAdded) {
                          return (
                            <div
                              key={t.id}
                              className="ob-time-card flex flex-col items-center justify-center border border-dashed border-indigo-200 bg-transparent hover:bg-indigo-50/50 opacity-80"
                              onClick={() => setShowNightWarning(true)}
                            >
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                                <Plus className="w-4 h-4 text-indigo-600" />
                              </div>
                              <div className="ob-time-name text-indigo-400">Add Night</div>
                            </div>
                          )
                        }

                        return (
                          <div
                            key={t.id}
                            className={`ob-time-card ${timeSlot === t.id ? "sel" : ""}`}
                            onClick={() => {
                              setTimeSlot(t.id)
                              setReminderTime(t.defaultTime)
                            }}
                          >
                            <div className="ob-time-emoji">{t.emoji}</div>
                            <div className="ob-time-name">{t.name}</div>
                            <div className="ob-time-range">{t.range}</div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="ob-custom-time-wrap">
                      <div className="ob-custom-time-label">Exact reminder time</div>
                      <input
                        className="ob-time-picker-input"
                        type="time"
                        value={reminderTime}
                        onChange={(e) => handleReminderTimeChange(e.target.value)}
                      />
                    </div>

                    <div className="ob-remind-toggle-wrap">
                      <div>
                        <div className="ob-remind-title">Email reminders</div>
                        <div className="ob-remind-sub">Daily digest + streak alerts</div>
                      </div>
                      <label className="ob-toggle-wrap">
                        <input
                          type="checkbox"
                          checked={emailReminders}
                          onChange={(e) => setEmailReminders(e.target.checked)}
                        />
                        <div className="ob-toggle-track" />
                        <div className="ob-toggle-thumb" />
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 4: Ready ── */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  className="ob-step-panel"
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                >
                  <span className="ob-confetti-emoji">🎉</span>
                  <h1 className="ob-ready-title">
                    You&apos;re all set,<br /><em>let&apos;s go!</em>
                  </h1>
                  <p className="ob-ready-sub">
                    Here&apos;s what we&apos;ve set up for you. You can add more habits anytime.
                  </p>

                  <div className="ob-summary-card">
                    <div className="ob-summary-row">
                      <div className="ob-sum-icon">{habitIcon}</div>
                      <div className="ob-sum-info">
                        <div className="ob-sum-name">{habitName.trim() || "Morning meditation"}</div>
                        <div className="ob-sum-meta">
                          <span>{FREQ_LABELS[frequency] || "Every day"}</span>
                          <span>·</span>
                          <span>{formatTime12(reminderTime)} reminder</span>
                        </div>
                      </div>
                      <span className="ob-sum-tag">Day 1</span>
                    </div>
                    <div className="ob-summary-row">
                      <div className="ob-sum-icon" style={{ background: "#EDE9FE" }}>🎯</div>
                      <div className="ob-sum-info">
                        <div className="ob-sum-name">Your goal</div>
                        <div className="ob-sum-meta">
                          <span>{GOAL_LABELS[goal] || "My goals"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ob-tip">
                    <div className="ob-tip-title">Did you know?</div>
                    <div className="ob-tip-text">
                      It takes an average of 66 days to form a habit. We&apos;ll be with you every step of the way.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom bar */}
          <div className="ob-bottom-bar">
            {step > 1 && (
              <button className="ob-btn-back" onClick={prevStep}>
                ←
              </button>
            )}
            <button
              className="ob-btn-next"
              onClick={step === 4 ? handleSubmit : nextStep}
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? "Saving…" : BTN_LABELS[step]}</span>
              {!isSubmitting && <span className="ob-arrow">→</span>}
            </button>
          </div>
        </div>{/* /ob-content-area */}

        {/* Right sidebar (desktop only) */}
        <div className="ob-right-sidebar">
          <div className="ob-right-content">
            <div className="ob-avatar-stack">
              <div className="ob-av g1">A</div>
              <div className="ob-av g2">M</div>
              <div className="ob-av g3">P</div>
              <div className="ob-av g4">R</div>
            </div>
            <div className="ob-right-divider" />
            <div className="ob-right-text">
              Join <strong>12,400+</strong> people building better habits
            </div>
          </div>
        </div>

      </div>{/* /ob-main-layout */}
    </div>
  )
}
