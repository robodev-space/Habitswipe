"use client"

import { useEffect, useState, useMemo } from "react"
import { useSession } from "next-auth/react"
import { useHabits } from "@/hooks/useHabits"
import { toast } from "react-hot-toast"
import { Confetti } from "@/components/shared/Confetti"
import { AddHabitDialog } from "@/components/shared/AddHabitDialog"
import { HabitHistoryDrawer } from "@/components/shared/HabitHistoryDrawer"
import { MissedHabitsDrawer, useMissedHabitsPreview } from "@/components/shared/MissedHabitsDrawer"
import { API_ROUTES } from "@/lib/constants/api-routes"

// ─── Skeleton Components ─────────────────────────────────────────────────────

function SkeletonHeader() {
  return (
    <div className="skeleton-header">
      <div className="skel-hdr-left">
        <div className="skel-date" />
        <div className="skel-title" />
        <div className="skel-sub" />
      </div>
      <div className="skel-btn" />
    </div>
  )
}

function SkeletonHero() {
  return (
    <div className="skeleton-hero">
      <div className="skel-ring" />
      <div className="skel-lines">
        <div className="skel-line w80" />
        <div className="skel-line w60" />
        <div className="skel-line w40" />
      </div>
    </div>
  )
}

function SkeletonMood() {
  return (
    <div className="skeleton-mood">
      <div className="skel-mood-label" />
      <div className="skel-mood-btns">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="skel-mood-btn" />
        ))}
      </div>
      <div className="skel-mood-txt" />
    </div>
  )
}

function SkeletonStats() {
  return (
    <div className="skeleton-stats">
      {[1, 2, 3].map(i => (
        <div key={i} className="skel-stat">
          <div className="skel-ico" />
          <div className="skel-val" />
          <div className="skel-lbl" />
        </div>
      ))}
    </div>
  )
}

function SkeletonWeek() {
  return (
    <div className="skeleton-week">
      {[1, 2, 3, 4, 5, 6, 7].map(i => (
        <div key={i} className="skel-day">
          <div className="skel-dot" />
          <div className="skel-day-lbl" />
        </div>
      ))}
    </div>
  )
}

function SkeletonHabits() {
  return (
    <div className="skeleton-habits">
      {[1, 2, 3].map(i => (
        <div key={i} className="skel-habit-row">
          <div className="skel-emoji" />
          <div className="skel-body">
            <div className="skel-name" style={{ width: `${60 + i * 10}%` }} />
            <div className="skel-meta-row">
              <div className="skel-streak" />
              <div className="skel-tag" />
            </div>
          </div>
          <div className="skel-bar-area">
            <div className="skel-track" />
            <div className="skel-pc" />
          </div>
          <div className="skel-check" />
        </div>
      ))}
    </div>
  )
}

function SkeletonQuote() {
  return (
    <div className="skeleton-quote">
      <div className="skel-q1" />
      <div className="skel-q2" />
      <div className="skel-q3" />
    </div>
  )
}

function SkeletonMissed() {
  return (
    <div className="skeleton-missed">
      <div className="skel-sec-row">
        <div className="skel-sec-lbl" />
        <div className="skel-sec-btn" />
      </div>
      <div className="skel-m-row">
        <div className="skel-m-ico" />
        <div className="skel-m-name" />
        <div className="skel-m-btn" />
      </div>
      <div className="skel-m-row">
        <div className="skel-m-ico" />
        <div className="skel-m-name" style={{ width: '50%' }} />
        <div className="skel-m-btn" />
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function TodayPage() {
  const { data: session } = useSession()
  const { habits, todayHabits, swipeHabit, isLoading, isInitialized, fetchHabits } = useHabits()
  const { missedHabits, isLoading: missedIsLoading, addToToday, refetch: refetchMissed } = useMissedHabitsPreview()
  const [addingMissedIds, setAddingMissedIds] = useState<Set<string>>(new Set())
  const [addedMissedIds, setAddedMissedIds] = useState<Set<string>>(new Set())
  const [mood, setMood] = useState<string | null>(null)
  const [moodLoading, setMoodLoading] = useState(true)
  const [filterOn, setFilterOn] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())

  // ─── Greet & Date ───────────────────────────────────────────────────────────
  const h = new Date().getHours()
  const greetTime = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
  const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  // Stats
  const activeHabits = habits.filter(h => !h.isArchived)
  const total = activeHabits.length

  // Real done logic depends on todayHabits from the store
  const completedCount = activeHabits.filter(h =>
    habits.some(th => th.id === h.id && th.todayLog?.status === "DONE")
  ).length

  const pendingCount = total - completedCount
  const pct = total === 0 ? 0 : Math.round((completedCount / total) * 100)

  const circ = 163.4
  const offset = total === 0 ? circ : circ - (circ * pct) / 100

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleToggle = async (habitId: string) => {
    if (togglingIds.has(habitId)) return
    setTogglingIds(prev => new Set(prev).add(habitId))
    try {
      const isDone = habits.some(h => h.id === habitId && h.todayLog?.status === "DONE")
      await swipeHabit(habitId, isDone ? "SKIPPED" : "DONE")
      if (!isDone) {
        toast.success("Habit marked done!")
      }
    } catch (e) {
      toast.error("Failed to update habit")
    } finally {
      setTogglingIds(prev => { const s = new Set(prev); s.delete(habitId); return s })
    }
  }

  // Effect to trigger confetti
  useEffect(() => {
    if (pct === 100 && total > 0 && !showConfetti) {
      setShowConfetti(true)
    }
  }, [pct, total])

  const handleMoodSelect = async (id: number, label: string, emoji: string) => {
    if (mood) return; // Prevent multiple clicks
    setMood(label)
    toast.success(label)
    try {
      const res = await fetch(API_ROUTES.ToDAY.MOOD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, mood: label, emoji }),
      })
      const data = await res.json()
      console.log(data)
    } catch {
      toast.error("Failed to sync mood")
    }
  }
  const loadMood = async () => {
    setMoodLoading(true)
    try {
      const res = await fetch(API_ROUTES.ToDAY.MOOD)
      const data = await res.json()
      if (data?.data?.mood) {
        setMood(data.data.mood)
      }
    } catch {
      toast.error("Failed to load mood")
    } finally {
      setMoodLoading(false)
    }
  }

  const handleAddMissed = async (habitId: string, name: string) => {
    if (addingMissedIds.has(habitId) || addedMissedIds.has(habitId)) return
    setAddingMissedIds(prev => new Set(prev).add(habitId))
    try {
      await addToToday(habitId)
      setAddedMissedIds(prev => new Set(prev).add(habitId))
      toast.success(`${name} added to today!`)
      // Refresh both lists
      fetchHabits()
      refetchMissed()
    } catch {
      toast.error('Failed to add habit')
    } finally {
      setAddingMissedIds(prev => { const s = new Set(prev); s.delete(habitId); return s })
    }
  }

  // Load habits on mount
  useEffect(() => {
    fetchHabits()
  }, [])

  // Load mood
  useEffect(() => {
    loadMood()
  }, [])


  // Welcome toast (first time daily)
  useEffect(() => {
    if (typeof window !== "undefined" && session !== undefined) {
      const todayStr = new Date().toDateString()
      const lastWelcome = localStorage.getItem("lastWelcomeToast")
      if (lastWelcome !== todayStr) {
        localStorage.setItem("lastWelcomeToast", todayStr)
        const userName = session?.user?.name || "Welcome back"

        toast.custom((t) => (
          <div
            className={`${t.visible ? 'animate-custom-enter' : 'animate-custom-leave'
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  {session?.user?.image ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={session.user.image}
                      alt=""
                    />
                  ) : (
                    <div className="s-av" style={{ width: "40px", height: "40px", fontSize: "16px" }}>
                      {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
                      <div className="s-av-dot"></div>
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {userName}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Welcome! Let's crush your goals today.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        ))
      }
    }
  }, [session])
  console.log(session)
  return (
    <div className="tab active" id="tab-today">
      {/* ═══ Page Header ═══ */}
      {isLoading ? (
        <SkeletonHeader />
      ) : (
        <div className="ph skeleton-loaded">
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
          <AddHabitDialog>
            <button className="btn-primary">
              <svg viewBox="0 0 14 14"><path d="M7 2v10M2 7h10" /></svg>New habit
            </button>
          </AddHabitDialog>
        </div>
      )}

      {/* ═══ Hero Ring ═══ */}
      {isLoading ? (
        <SkeletonHero />
      ) : (
        <div className="hero-card skeleton-loaded">
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
      )}

      {/* ═══ Mood ═══ */}
      {moodLoading ? (
        <SkeletonMood />
      ) : (
        <div className="mood-card skeleton-loaded">
          <div className="mood-lbl">How are you feeling today?</div>
          <div className="mood-row">
            {[
              { id: 1, e: "😴", l: "Exhausted — rest matters too" },
              { id: 2, e: "😐", l: "Tired — push through gently" },
              { id: 3, e: "🙂", l: "Good — solid energy!" },
              { id: 4, e: "😄", l: "Energised — great momentum!" },
              { id: 5, e: "🔥", l: "On fire — unstoppable!" },
            ].map((m) => (
              <button
                key={m.e}
                className={`mood-btn ${mood === m.l ? 'selected' : ''}`}
                onClick={() => handleMoodSelect(m.id, m.l, m.e)}
                disabled={!!mood}
              >
                {m.e}
              </button>
            ))}
          </div>
          <div className="mood-txt" id="moodTxt">{mood ? `${mood}` : 'Tap to log your energy for today'}</div>
        </div>
      )}

      {/* ═══ Stats Strip ═══ */}
      {isLoading ? (
        <SkeletonStats />
      ) : (
        <div className="stats3 skeleton-loaded">
          <div className="sc org"><div className="sc-ico">🔥</div><div className="sc-val">14d</div><div className="sc-lbl">Current streak</div></div>
          <div className="sc ind"><div className="sc-ico">✅</div><div className="sc-val" id="doneVal">{completedCount}/{total}</div><div className="sc-lbl">Done today</div></div>
          <div className="sc grn"><div className="sc-ico">📈</div><div className="sc-val">89%</div><div className="sc-lbl">This week</div></div>
        </div>
      )}

      {/* ═══ Week ═══ */}
      {isLoading ? (
        <>
          <div className="sh mb-1">
            <div className="st" style={{ width: 60, height: 11, background: 'var(--surf2)', borderRadius: 5 }} />
          </div>
          <SkeletonWeek />
        </>
      ) : (
        <div className="skeleton-loaded">
          <div className="sh mb-1">
            <div className="st">This week</div>
            <HabitHistoryDrawer>
              <button className="flex items-center gap-1.5 text-[12.5px] font-semibold text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-lg transition-colors cursor-pointer border-none bg-transparent">
                Full history
                <svg viewBox="0 0 16 16" className="w-[13px] h-[13px] stroke-current fill-none stroke-2 shrink-0">
                  <path d="M4 8h8M9 5l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </HabitHistoryDrawer>
          </div>
          <div className="week-row" style={{ marginBottom: 20 }}>
            <div className="wd"><div className="wdot wf"><svg viewBox="0 0 13 13"><path d="M2 6.5l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg></div><div className="wdl">Mon</div></div>
            <div className="wd"><div className="wdot wf"><svg viewBox="0 0 13 13"><path d="M2 6.5l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg></div><div className="wdl">Tue</div></div>
            <div className="wd"><div className="wdot wp"></div><div className="wdl">Wed</div></div>
            <div className="wd"><div className="wdot wf"><svg viewBox="0 0 13 13"><path d="M2 6.5l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg></div><div className="wdl">Thu</div></div>
            <div className="wd"><div className="wdot wt"><div className="wt-inner"></div></div><div className="wdl wt-lbl">Today</div></div>
            <div className="wd"><div className="wdot wm"></div><div className="wdl">Sat</div></div>
            <div className="wd"><div className="wdot wm"></div><div className="wdl">Sun</div></div>
          </div>
        </div>
      )}

      {/* ═══ Habits ═══ */}
      {isLoading ? (
        <>
          <div className="sh">
            <div className="st" style={{ width: 90, height: 11, background: 'var(--surf2)', borderRadius: 5 }} />
            <div style={{ width: 70, height: 11, background: 'var(--surf2)', borderRadius: 5 }} />
          </div>
          <SkeletonHabits />
        </>
      ) : (
        <div className="skeleton-loaded">
          <div className="sh">
            <div className="st">Today&apos;s habits</div>
            <div className="sl" id="filterBtn" onClick={() => setFilterOn(!filterOn)}>
              {filterOn ? 'Show all' : 'Show pending'}
            </div>
          </div>
          <div className="h-list" id="hList">
            {activeHabits.map((habit, i) => {
              const isDone = habits.find(h => h.id === habit.id)?.todayLog?.status === "DONE"
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
                    disabled={togglingIds.has(habit.id)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {togglingIds.has(habit.id) ? (
                      <span
                        style={{
                          width: 12, height: 12,
                          border: '2px solid rgba(255,255,255,0.4)',
                          borderTopColor: '#fff',
                          borderRadius: '50%',
                          display: 'inline-block',
                          animation: 'btn-spin 0.65s linear infinite',
                        }}
                      />
                    ) : (
                      <svg viewBox="0 0 16 16"><path d="M3 8l3.5 3.5L13 4" /></svg>
                    )}
                  </button>
                </div>
              )
            })}
            {activeHabits.length === 0 && (
              <div className="text-center py-6 text-gray-400 text-sm">No habits yet. Click New Habit to start!</div>
            )}
          </div>
        </div>
      )}

      {/* ═══ Quote ═══ */}
      {isLoading ? (
        <SkeletonQuote />
      ) : (
        <div className="quote skeleton-loaded">
          <blockquote>&quot;We are what we repeatedly do. Excellence, then, is not an act, but a habit.&quot;</blockquote>
          <cite>— Aristotle</cite>
        </div>
      )}

      {/* ═══ Missed Yesterday ═══ */}
      {missedIsLoading ? (
        <SkeletonMissed />
      ) : (
        <div className="today-card skeleton-loaded">
          <div className="sec-row">
            <div className="sec-lbl">Missed yesterday</div>
            {missedHabits.length > 0 && (
              <MissedHabitsDrawer>
                <button className="see-all-btn">
                  See all →
                  <svg viewBox="0 0 16 16"><path d="M4 8h8M9 5l3 3-3 3" /></svg>
                </button>
              </MissedHabitsDrawer>
            )}
          </div>

          {missedHabits.length === 0 ? (
            /* Empty state */
            <div style={{ textAlign: 'center', padding: '18px 0 6px' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--txt)', marginBottom: 4 }}>
                No missed habits!
              </div>
              <div style={{ fontSize: 12, color: 'var(--txt3)', lineHeight: 1.6 }}>
                You were on fire yesterday — keep it up today.
              </div>
            </div>
          ) : (
            /* Habits preview */
            <>
              {missedHabits.slice(0, 2).map(h => (
                <div key={h.id} className="m-row">
                  <div className="m-ico">{h.icon}</div>
                  <div className="m-name">{h.name}
                    {h.streakLost > 0 && (
                      <span className="m-badge">🔥 {h.streakLost}d lost</span>
                    )}
                  </div>
                  <button
                    className="m-add-btn"
                    disabled={addingMissedIds.has(h.id) || addedMissedIds.has(h.id)}
                    onClick={() => handleAddMissed(h.id, h.name)}
                  >
                    {addingMissedIds.has(h.id) ? (
                      <span style={{ width: 10, height: 10, border: '2px solid rgba(99,102,241,0.3)', borderTopColor: 'var(--ind)', borderRadius: '50%', display: 'inline-block', animation: 'btn-spin 0.65s linear infinite' }} />
                    ) : addedMissedIds.has(h.id) ? '✓ Added' : '+ Add'}
                  </button>
                </div>
              ))}

              {missedHabits.length > 2 && (
                <MissedHabitsDrawer>
                  <div style={{ fontSize: "11.5px", color: "var(--txt3)", textAlign: "center", marginTop: "10px", cursor: "pointer", fontWeight: 500 }}>
                    + {missedHabits.length - 2} more missed habit{missedHabits.length - 2 !== 1 ? 's' : ''}
                  </div>
                </MissedHabitsDrawer>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
