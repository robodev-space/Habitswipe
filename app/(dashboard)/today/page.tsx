"use client"

import { useEffect, useState, useMemo } from "react"
import { useSession } from "next-auth/react"
import { useHabits } from "@/hooks/useHabits"
import { toast } from "react-hot-toast"
import { Confetti } from "@/components/shared/Confetti"

export default function TodayPage() {
  const { data: session } = useSession()
  const { habits, todayHabits, swipeHabit, isLoading } = useHabits()
  const [mood, setMood] = useState<string | null>(null)
  const [filterOn, setFilterOn] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // ─── Greet & Date ───────────────────────────────────────────────────────────
  const h = new Date().getHours()
  const greetTime = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
  const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  // Stats
  const activeHabits = habits.filter(h => !h.isArchived)
  const total = activeHabits.length

  // Real done logic depends on todayHabits from the store
  // We'll map through activeHabits and check if their ID is in todayHabits with status "COMPLETED"
  const completedCount = activeHabits.filter(h =>
    todayHabits.some(th => th.id === h.id && th.todayLog?.status === "DONE")
  ).length

  const pendingCount = total - completedCount
  const pct = total === 0 ? 0 : Math.round((completedCount / total) * 100)

  const circ = 163.4
  const offset = total === 0 ? circ : circ - (circ * pct) / 100

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleToggle = async (habitId: string) => {
    try {
      const isDone = todayHabits.some(th => th.id === habitId && th.todayLog?.status === "DONE")
      await swipeHabit(habitId, isDone ? "SKIPPED" : "DONE")
      if (!isDone) {
        toast.success("Habit marked done!")
      }
    } catch (e) {
      toast.error("Failed to update habit")
    }
  }

  // Effect to trigger confetti
  useEffect(() => {
    if (pct === 100 && total > 0 && !showConfetti) {
      setShowConfetti(true)
    }
  }, [pct, total])

  const handleMoodSelect = async (emoji: string, label: string) => {
    setMood(label)
    toast.success(label)
    try {
      await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: label, emoji }),
      })
    } catch {
      toast.error("Failed to sync mood")
    }
  }

  // Load mood
  useEffect(() => {
    fetch('/api/mood').then(res => res.json()).then(data => {
      if (data?.moodLog?.label) {
        setMood(data.moodLog.label)
      }
    }).catch(console.error)
  }, [])

  return (
    <div className="tab active" id="tab-today">
      {/* Page Header */}
      <div className="ph">
        <div>
          <div className="pd" id="dateLabel">{dateLabel}</div>
          <div className="pt">
            Good <em id="greetTime">{greetTime}</em>, {session?.user?.name?.split(' ')[0] || 'User'} ✦
          </div>
          <div className="ps" id="todaySub">
            {pendingCount === 0 && total > 0
              ? 'All habits done — incredible day! \uD83C\uDF89'
              : `${pendingCount} habit${pendingCount !== 1 ? 's' : ''} left — ${pendingCount === 0 ? "add some habits!" : "keep going."}`}
          </div>
        </div>
        <button className="btn-primary" onClick={() => toast("New habit form opening...")}>
          <svg viewBox="0 0 14 14"><path d="M7 2v10M2 7h10" /></svg>New habit
        </button>
      </div>

      {/* Hero ring */}
      <div className="hero-card">
        <div className="hero-ring">
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="26" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="6" />
            <circle
              id="heroRing" cx="36" cy="36" r="26" fill="none" stroke="#fff" strokeWidth="6"
              strokeDasharray="163.4" strokeDashoffset={offset.toFixed(1)} strokeLinecap="round" style={{ transition: 'stroke-dashoffset .7s' }}
            />
          </svg>
          <div className="hero-pct" id="heroPct">{pct}%</div>
        </div>
        <div className="hero-text">
          <h2 id="heroTitle">{completedCount} of {total} done today</h2>
          <p>14-day streak active.<br />{pendingCount > 0 ? "Two more for a perfect day." : "Perfect day!"}</p>
          <span className="hero-cta" id="heroCta">{pct === 100 && total > 0 ? 'Perfect day! ✦' : 'Keep going ✦'}</span>
        </div>
        {showConfetti && <Confetti />}
      </div>

      {/* Mood */}
      <div className="mood-card">
        <div className="mood-lbl">How are you feeling today?</div>
        <div className="mood-row">
          {[
            { e: "😴", l: "Exhausted — rest matters too" },
            { e: "😐", l: "Tired — push through gently" },
            { e: "🙂", l: "Good — solid energy!" },
            { e: "😄", l: "Energised — great momentum!" },
            { e: "🔥", l: "On fire — unstoppable!" },
          ].map((m) => (
            <button
              key={m.e}
              className={`mood-btn ${mood === m.l ? 'active' : ''}`}
              onClick={() => handleMoodSelect(m.e, m.l)}
            >
              {m.e}
            </button>
          ))}
        </div>
        <div className="mood-txt" id="moodTxt">{mood ? `${mood}` : 'Tap to log your energy for today'}</div>
      </div>

      {/* Stats strip */}
      <div className="stats3">
        <div className="sc org"><div className="sc-ico">🔥</div><div className="sc-val">14d</div><div className="sc-lbl">Current streak</div></div>
        <div className="sc ind"><div className="sc-ico">✅</div><div className="sc-val" id="doneVal">{completedCount}/{total}</div><div className="sc-lbl">Done today</div></div>
        <div className="sc grn"><div className="sc-ico">📈</div><div className="sc-val">89%</div><div className="sc-lbl">This week</div></div>
      </div>

      {/* Week */}
      <div className="sh"><div className="st">This week</div><div className="sl" onClick={() => toast("Full history coming soon...")}>History →</div></div>
      <div className="week-row" style={{ marginBottom: 20 }}>
        <div className="wd"><div className="wdot wf"><svg viewBox="0 0 13 13"><path d="M2 6.5l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg></div><div className="wdl">Mon</div></div>
        <div className="wd"><div className="wdot wf"><svg viewBox="0 0 13 13"><path d="M2 6.5l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg></div><div className="wdl">Tue</div></div>
        <div className="wd"><div className="wdot wp"></div><div className="wdl">Wed</div></div>
        <div className="wd"><div className="wdot wf"><svg viewBox="0 0 13 13"><path d="M2 6.5l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg></div><div className="wdl">Thu</div></div>
        <div className="wd"><div className="wdot wt"><div className="wt-inner"></div></div><div className="wdl wt-lbl">Today</div></div>
        <div className="wd"><div className="wdot wm"></div><div className="wdl">Sat</div></div>
        <div className="wd"><div className="wdot wm"></div><div className="wdl">Sun</div></div>
      </div>

      {/* Habits */}
      <div className="sh">
        <div className="st">Today&apos;s habits</div>
        <div className="sl" id="filterBtn" onClick={() => setFilterOn(!filterOn)}>
          {filterOn ? 'Show all' : 'Show pending'}
        </div>
      </div>
      <div className="h-list" id="hList">
        {isLoading && <div className="text-center text-xs text-gray-500 py-4">Loading habits...</div>}
        {!isLoading && activeHabits.map((habit, i) => {
          const isDone = todayHabits.some(th => th.id === habit.id && th.todayLog?.status === "DONE")
          if (filterOn && isDone) return null

          // Cycles through some colors for mockup aesthetics similar to HTML snippet
          const colors = ["#10b981", "#6366f1", "#a855f7", "#f97316", "#3b82f6", "#eab308"]
          const color = colors[i % colors.length]

          return (
            <div
              key={habit.id}
              className={`h-row ${isDone ? "done" : ""}`}
              style={{ "--color": color } as any}
              onClick={() => handleToggle(habit.id)}
            >
              <div className="h-em">{habit.icon || "✨"}</div>
              <div className="h-body">
                <div className="h-name">{habit.name}</div>
                <div className="h-meta">
                  <span className="h-str">🔥 14d</span>
                  <span className="h-tag">Daily</span>
                </div>
              </div>
              <div className="h-bar">
                <div className="h-track">
                  <div className="h-fill" style={{ width: isDone ? '100%' : '0%', background: color }}></div>
                </div>
                <div className="h-pc">{isDone ? "Done" : "Pending"}</div>
              </div>
              <button
                className={`h-ck ${isDone ? "done-btn" : ""}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggle(habit.id)
                }}
              >
                <svg viewBox="0 0 16 16"><path d="M3 8l3.5 3.5L13 4" /></svg>
              </button>
            </div>
          )
        })}
        {!isLoading && activeHabits.length === 0 && (
          <div className="text-center py-6 text-gray-400 text-sm">No habits yet. Click New Habit to start!</div>
        )}
      </div>

      {/* Quote */}
      <div className="quote">
        <blockquote>&quot;We are what we repeatedly do. Excellence, then, is not an act, but a habit.&quot;</blockquote>
        <cite>— Aristotle</cite>
      </div>

      {/* Missed */}
      <div className="sh"><div className="st">Missed yesterday</div><div className="sl">See all →</div></div>
      <div id="missedList">
        <div className="missed-row" id="miss-0">
          <div className="missed-ico">🏊</div>
          <div className="missed-name">Swimming</div>
          <div className="missed-tag">3d streak lost</div>
          <button className="missed-add" onClick={() => toast('Swimming added to today!')}>+ Add</button>
        </div>
        <div className="missed-row" id="miss-1">
          <div className="missed-ico">☕</div>
          <div className="missed-name">No coffee after 2pm</div>
          <div className="missed-tag">1d streak lost</div>
          <button className="missed-add" onClick={() => toast('Habit added!')}>+ Add</button>
        </div>
      </div>
    </div>
  )
}
