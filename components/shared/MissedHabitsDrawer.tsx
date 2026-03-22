"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "react-hot-toast"
import { X } from "lucide-react"
import { useMissedHabits, type MissedHabit } from "@/hooks/useMissedHabits"
import "./missed-habits.css"

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'T']
const DOT_ICONS: Record<string, string> = {
  done: '✓', miss: '✕', none: '', today: '·', 'added-today': '✓'
}

function MissedCard({
  habit,
  isAdded,
  isLoading,
  isLeaving,
  onAdd,
  onSkip,
}: {
  habit: MissedHabit
  isAdded: boolean
  isLoading: boolean
  isLeaving: boolean
  onAdd: () => void
  onSkip: () => void
}) {
  return (
    <div className={`mc ${isLeaving ? 'leaving' : ''}`}>
      <div className="mc-top">
        <div className="mc-icon">{habit.icon}</div>
        <div className="mc-body">
          <div className="mc-name">{habit.name}</div>
          <div className="mc-meta">
            {habit.streakLost > 0 && (
              <span className="mc-streak-badge">🔥 {habit.streakLost}d streak lost</span>
            )}
            <span className="mc-freq">{habit.freq}</span>
          </div>
        </div>
        <div className="mc-acts">
          <button
            className={`btn-add ${isAdded ? 'added' : ''}`}
            onClick={onAdd}
            disabled={isAdded || isLoading}
            style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 90, justifyContent: 'center' }}
          >
            {isLoading ? (
              <span className="btn-spinner" />
            ) : isAdded ? '✓ Added!' : '+ Add today'}
          </button>
          <button className="btn-skip" onClick={onSkip} title="Dismiss" disabled={isLoading}>✕</button>
        </div>
      </div>

      <div className="mc-hist">
        {habit.hist.map((s, i) => {
          const state = s === 'today' && isAdded ? 'added-today' : s
          return (
            <div key={i} className="hcol">
              <div className={`hdot ${state}`}>{DOT_ICONS[state] ?? ''}</div>
              <div className="hlbl">{DAY_LABELS[i]}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DrawerContent({ onClose }: { onClose: () => void }) {
  const { missedHabits, isLoading, yesterday, addToToday } = useMissedHabits()
  const [filter, setFilter] = useState("all")
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [added, setAdded] = useState<Set<string>>(new Set())
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set())
  const [leaving, setLeaving] = useState<string | null>(null)

  const yesterdayLabel = yesterday
    ? (() => {
        const d = new Date(yesterday + "T00:00:00.000Z")
        return 'Yesterday · ' + d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      })()
    : 'Yesterday'

  const visible = missedHabits.filter(h => {
    if (dismissed.has(h.id)) return false
    if (filter === 'streak') return h.streakLost > 0
    if (filter === 'daily') return h.category === 'daily'
    if (filter === 'weekly') return h.category === 'weekly'
    return true
  })

  const all = missedHabits.filter(h => !dismissed.has(h.id))
  const counts = {
    all: all.length,
    streak: all.filter(h => h.streakLost > 0).length,
    daily: all.filter(h => h.category === 'daily').length,
    weekly: all.filter(h => h.category === 'weekly').length,
  }

  const handleAdd = async (id: string, name: string) => {
    if (loadingIds.has(id)) return
    setLoadingIds(prev => new Set(prev).add(id))
    try {
      await addToToday(id)
      setAdded(prev => new Set(prev).add(id))
      toast.success(`${name} added to today!`)
      setTimeout(() => {
        setLeaving(id)
        setTimeout(() => {
          setDismissed(prev => new Set(prev).add(id))
          setLeaving(null)
        }, 300)
      }, 1100)
    } catch {
      toast.error("Failed to add habit")
    } finally {
      setLoadingIds(prev => { const s = new Set(prev); s.delete(id); return s })
    }
  }

  const handleSkip = (id: string) => {
    setLeaving(id)
    setTimeout(() => {
      setDismissed(prev => new Set(prev).add(id))
      setLeaving(null)
    }, 300)
  }

  return (
    <div className="md-drawer">
      <div className="md-head">
        <div className="md-eyebrow">{yesterdayLabel}</div>
        <div className="md-titlerow">
          <div className="md-title">Missed <em>habits</em></div>
          <button className="md-close" onClick={onClose}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="md-body">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="mc" style={{ height: 82, opacity: 0.5, background: 'var(--surf2)', border: 'none', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="empty">
            <span className="empty-emoji">🎉</span>
            <div className="empty-h">All <em>caught up!</em></div>
            <div className="empty-p">You've handled all your missed habits.<br />Tomorrow is yours to own.</div>
          </div>
        ) : (
          <>
            <div className="impact">
              <div className="imp-ico">
                <svg viewBox="0 0 16 16"><path d="M8 2v4M8 10v.5M2 8a6 6 0 1012 0A6 6 0 002 8z" /></svg>
              </div>
              <div>
                <span className="imp-strong">{counts.all} habit{counts.all !== 1 ? 's' : ''} missed yesterday</span>
                <span className="imp-txt">Adding them back today helps rebuild your streaks. Today is a fresh start.</span>
              </div>
            </div>

            <div className="frow">
              {(['all', 'streak', 'daily', 'weekly'] as const).map(f => (
                <button
                  key={f}
                  className={`fp ${filter === f ? 'on' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' && `All missed · ${counts.all}`}
                  {f === 'streak' && `Streak lost · ${counts.streak}`}
                  {f === 'daily' && `Daily · ${counts.daily}`}
                  {f === 'weekly' && `Weekly · ${counts.weekly}`}
                </button>
              ))}
            </div>
          </>
        )}

        {!isLoading && visible.length > 0 && (
          <>
            <div className="md-sec">Add back to today</div>
            {visible.map(h => (
              <MissedCard
                key={h.id}
                habit={h}
                isAdded={added.has(h.id)}
                isLoading={loadingIds.has(h.id)}
                isLeaving={leaving === h.id}
                onAdd={() => handleAdd(h.id, h.name)}
                onSkip={() => handleSkip(h.id)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export function MissedHabitsDrawer({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="p-0 border-none bg-transparent shadow-none max-w-none w-full sm:max-w-none flex items-center justify-center outline-none">
        <DrawerContent onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

// Named export for the preview on the Today page
export function useMissedHabitsPreview() {
  return useMissedHabits()
}
