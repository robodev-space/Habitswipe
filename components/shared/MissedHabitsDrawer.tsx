"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "react-hot-toast"
import { X } from "lucide-react"
import "./missed-habits.css"

const HABITS = [
  { id:0, icon:'🏊', name:'Swimming', streakLost:3, freq:'3× weekly', category:'weekly', hist:['done','done','done','miss','done','miss','today'] },
  { id:1, icon:'☕', name:'No coffee after 2pm', streakLost:1, freq:'Daily', category:'daily', hist:['done','done','done','done','done','miss','today'] },
  { id:2, icon:'🚶', name:'Evening walk', streakLost:5, freq:'Daily', category:'daily', hist:['done','done','miss','done','done','miss','today'] },
  { id:3, icon:'📓', name:'Gratitude journal', streakLost:2, freq:'Daily', category:'daily', hist:['done','done','done','miss','done','miss','today'] },
  { id:4, icon:'🧘', name:'Stretching', streakLost:0, freq:'2× weekly', category:'weekly', hist:['done','none','done','none','done','miss','today'] },
]

const DAY_LABELS = ['M','T','W','T','F','S','S']
const DOT_ICONS: any = { done:'✓', miss:'✕', none:'', today:'·', 'added-today':'✓' }

export function MissedHabitsDrawer({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState("all")
  const [dismissed, setDismissed] = useState<Set<number>>(new Set())
  const [added, setAdded] = useState<Set<number>>(new Set())
  const [leaving, setLeaving] = useState<number | null>(null)

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const drawerDate = 'Yesterday · ' + yesterday.toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })

  const visible = HABITS.filter(h => {
    if (dismissed.has(h.id)) return false
    if (filter === 'streak')  return h.streakLost > 0
    if (filter === 'daily')   return h.category === 'daily'
    if (filter === 'weekly')  return h.category === 'weekly'
    return true
  })

  const counts = {
    all: HABITS.filter(h => !dismissed.has(h.id)).length,
    streak: HABITS.filter(h => !dismissed.has(h.id) && h.streakLost > 0).length,
    daily: HABITS.filter(h => !dismissed.has(h.id) && h.category === 'daily').length,
    weekly: HABITS.filter(h => !dismissed.has(h.id) && h.category === 'weekly').length,
  }

  const handleAdd = (id: number, name: string) => {
    setAdded(new Set(added).add(id))
    toast.success(`${name} added to today!`)
    setTimeout(() => {
      setLeaving(id)
      setTimeout(() => {
        setDismissed(new Set(dismissed).add(id))
        setLeaving(null)
      }, 300)
    }, 1100)
  }

  const handleSkip = (id: number) => {
    setLeaving(id)
    setTimeout(() => {
      setDismissed(new Set(dismissed).add(id))
      setLeaving(null)
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="p-0 border-none bg-transparent shadow-none max-w-none w-full sm:max-w-none flex items-center justify-center outline-none">
        
        <div className="md-drawer">
          
          <div className="md-head">
            <div className="md-eyebrow">{drawerDate}</div>
            <div className="md-titlerow">
              <div className="md-title">Missed <em>habits</em></div>
              <button className="md-close" onClick={() => setOpen(false)}>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          <div className="md-body">
            
            {visible.length > 0 && (
              <>
                <div className="impact">
                  <div className="imp-ico">
                    <svg viewBox="0 0 16 16"><path d="M8 2v4M8 10v.5M2 8a6 6 0 1012 0A6 6 0 002 8z"/></svg>
                  </div>
                  <div>
                    <span className="imp-strong">5 habits missed yesterday</span>
                    <span className="imp-txt">Adding them back today helps rebuild your streaks. You lost 8 streak days total — but today is a fresh start.</span>
                  </div>
                </div>

                <div className="frow">
                  <button className={`fp ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>All missed · {counts.all}</button>
                  <button className={`fp ${filter === 'streak' ? 'on' : ''}`} onClick={() => setFilter('streak')}>Streak lost · {counts.streak}</button>
                  <button className={`fp ${filter === 'daily' ? 'on' : ''}`} onClick={() => setFilter('daily')}>Daily · {counts.daily}</button>
                  <button className={`fp ${filter === 'weekly' ? 'on' : ''}`} onClick={() => setFilter('weekly')}>Weekly · {counts.weekly}</button>
                </div>
              </>
            )}

            <div className="md-sec">Add back to today</div>
            
            <div id="missedList">
              {visible.length === 0 ? (
                <div className="empty">
                  <span className="empty-emoji">🎉</span>
                  <div className="empty-h">All <em>caught up!</em></div>
                  <div className="empty-p">You've handled all your missed habits.<br/>Tomorrow is yours to own.</div>
                </div>
              ) : (
                visible.map(h => {
                  const isAdded = added.has(h.id)
                  const isLeaving = leaving === h.id

                  return (
                    <div 
                      key={h.id} 
                      className={`mc ${isLeaving ? 'leaving' : ''}`} 
                    >
                      <div className="mc-top">
                        <div className="mc-icon">{h.icon}</div>
                        <div className="mc-body">
                          <div className="mc-name">{h.name}</div>
                          <div className="mc-meta">
                            {h.streakLost > 0 && <span className="mc-streak-badge">🔥 {h.streakLost}d streak lost</span>}
                            <span className="mc-freq">{h.freq}</span>
                          </div>
                        </div>
                        <div className="mc-acts">
                          <button
                            className={`btn-add ${isAdded ? 'added' : ''}`}
                            onClick={() => !isAdded && handleAdd(h.id, h.name)}
                            disabled={isAdded}
                          >
                            {isAdded ? '✓ Added!' : '+ Add today'}
                          </button>
                          <button className="btn-skip" onClick={() => handleSkip(h.id)} title="Dismiss">✕</button>
                        </div>
                      </div>
                      
                      <div className="mc-hist">
                        {h.hist.map((s, i) => {
                          const state = (s === 'today' && isAdded) ? 'added-today' : s
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
                })
              )}
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
