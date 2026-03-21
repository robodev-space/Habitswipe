"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ChevronDown, X, Check } from "lucide-react"
import "./habit-history.css"

const WEEKS = [
  {
    range: 'Mar 17–23', rate: 89, rateClass: 'rate-hi',
    days: [{ l: 'M', n: 6, t: 6 }, { l: 'T', n: 6, t: 6 }, { l: 'W', n: 4, t: 6 }, { l: 'T', n: 6, t: 6 }, { l: 'F', n: 4, t: 6 }, { l: 'S', n: 0, t: 0 }, { l: 'S', n: 0, t: 0 }],
    habits: [
      { icon: '🏃', name: 'Morning run', pct: 100, color: '#10b981' },
      { icon: '📚', name: 'Read 20 min', pct: 100, color: '#a855f7' },
      { icon: '💧', name: 'Drink 2L water', pct: 85, color: '#6366f1' },
      { icon: '🧘', name: 'Meditate', pct: 71, color: '#f97316' },
      { icon: '💪', name: 'Strength training', pct: 57, color: '#3b82f6' },
      { icon: '✍️', name: 'Journal entry', pct: 43, color: '#eab308' },
    ]
  },
  {
    range: 'Mar 10–16', rate: 94, rateClass: 'rate-hi',
    days: [{ l: 'M', n: 6, t: 6 }, { l: 'T', n: 6, t: 6 }, { l: 'W', n: 5, t: 6 }, { l: 'T', n: 6, t: 6 }, { l: 'F', n: 6, t: 6 }, { l: 'S', n: 4, t: 6 }, { l: 'S', n: 3, t: 6 }],
    habits: [
      { icon: '🏃', name: 'Morning run', pct: 100, color: '#10b981' },
      { icon: '📚', name: 'Read 20 min', pct: 100, color: '#a855f7' },
      { icon: '💧', name: 'Drink 2L water', pct: 100, color: '#6366f1' },
      { icon: '🧘', name: 'Meditate', pct: 86, color: '#f97316' },
      { icon: '💪', name: 'Strength training', pct: 86, color: '#3b82f6' },
      { icon: '✍️', name: 'Journal entry', pct: 71, color: '#eab308' },
    ]
  },
  {
    range: 'Mar 3–9', rate: 71, rateClass: 'rate-md',
    days: [{ l: 'M', n: 4, t: 6 }, { l: 'T', n: 5, t: 6 }, { l: 'W', n: 3, t: 6 }, { l: 'T', n: 6, t: 6 }, { l: 'F', n: 4, t: 6 }, { l: 'S', n: 2, t: 6 }, { l: 'S', n: 1, t: 6 }],
    habits: [
      { icon: '🏃', name: 'Morning run', pct: 71, color: '#10b981' },
      { icon: '📚', name: 'Read 20 min', pct: 85, color: '#a855f7' },
      { icon: '💧', name: 'Drink 2L water', pct: 71, color: '#6366f1' },
      { icon: '🧘', name: 'Meditate', pct: 57, color: '#f97316' },
      { icon: '💪', name: 'Strength training', pct: 42, color: '#3b82f6' },
      { icon: '✍️', name: 'Journal entry', pct: 28, color: '#eab308' },
    ]
  },
  {
    range: 'Feb 24–Mar 2', rate: 58, rateClass: 'rate-lo',
    days: [{ l: 'M', n: 3, t: 6 }, { l: 'T', n: 2, t: 6 }, { l: 'W', n: 1, t: 6 }, { l: 'T', n: 4, t: 6 }, { l: 'F', n: 5, t: 6 }, { l: 'S', n: 0, t: 0 }, { l: 'S', n: 0, t: 0 }],
    habits: [
      { icon: '🏃', name: 'Morning run', pct: 57, color: '#10b981' },
      { icon: '📚', name: 'Read 20 min', pct: 71, color: '#a855f7' },
      { icon: '💧', name: 'Drink 2L water', pct: 57, color: '#6366f1' },
      { icon: '🧘', name: 'Meditate', pct: 43, color: '#f97316' },
      { icon: '💪', name: 'Strength training', pct: 28, color: '#3b82f6' },
      { icon: '✍️', name: 'Journal entry', pct: 14, color: '#eab308' },
    ]
  },
  {
    range: 'Feb 17–23', rate: 74, rateClass: 'rate-md',
    days: [{ l: 'M', n: 5, t: 6 }, { l: 'T', n: 4, t: 6 }, { l: 'W', n: 3, t: 6 }, { l: 'T', n: 5, t: 6 }, { l: 'F', n: 6, t: 6 }, { l: 'S', n: 2, t: 6 }, { l: 'S', n: 3, t: 6 }],
    habits: [
      { icon: '🏃', name: 'Morning run', pct: 71, color: '#10b981' },
      { icon: '📚', name: 'Read 20 min', pct: 85, color: '#a855f7' },
      { icon: '💧', name: 'Drink 2L water', pct: 85, color: '#6366f1' },
      { icon: '🧘', name: 'Meditate', pct: 71, color: '#f97316' },
      { icon: '💪', name: 'Strength training', pct: 57, color: '#3b82f6' },
      { icon: '✍️', name: 'Journal entry', pct: 57, color: '#eab308' },
    ]
  },
];

const CALS = {
  mar: { offset: 4, data: [0, 2, 3, 3, 4, 5, 5, 5, 4, 2, 1, 4, 5, 5, 5, 5, 4, 3, 4, 5, 5], today: 20 },
  feb: { offset: 6, data: [0, 1, 2, 3, 4, 5, 5, 4, 4, 3, 3, 4, 5, 5, 3, 2, 4, 5, 5, 5, 4, 2, 1, 3, 4, 5, 4, 3], today: -1 },
  jan: { offset: 3, data: [0, 2, 3, 2, 1, 0, 2, 3, 4, 4, 3, 2, 1, 3, 4, 5, 4, 3, 2, 4, 5, 5, 4, 3, 3, 4, 5, 5, 4, 3, 2], today: -1 },
}

const TIPS = ['No habits', '1–2 habits', '3 habits', '4 habits', '5 habits', 'All 6 done!']
const DOT_COLORS = ['var(--surf2)', '#ddd9fd', '#c4c0f5', '#9b96ee', '#6d67e4', '#5b50e8']

function getDotBg(n: number, t: number) {
  if (!t) return DOT_COLORS[0]
  const p = n / t
  if (p === 0) return DOT_COLORS[0]
  if (p < 0.34) return DOT_COLORS[1]
  if (p < 0.5) return DOT_COLORS[2]
  if (p < 0.67) return DOT_COLORS[3]
  if (p < 1) return DOT_COLORS[4]
  return DOT_COLORS[5]
}

export function HabitHistoryDrawer({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<"weeks" | "month" | "insights">("weeks")
  const [openWeek, setOpenWeek] = useState<number>(0)

  // Sub component for Month Calendar
  const CalendarHeatmap = ({ name, offset, data, todayIdx }: { name: string, offset: number, data: number[], todayIdx: number }) => {
    return (
      <div className="hh-cal-section">
        <div className="hh-cal-month">{name}</div>
        <div className="hh-cal-wrap">
          <div className="hh-cal-hdrs">
            <div className="hh-cal-dh">M</div>
            <div className="hh-cal-dh">T</div>
            <div className="hh-cal-dh">W</div>
            <div className="hh-cal-dh">T</div>
            <div className="hh-cal-dh">F</div>
            <div className="hh-cal-dh">S</div>
            <div className="hh-cal-dh">S</div>
          </div>
          <div className="hh-cal-grid">
            {Array.from({ length: offset }).map((_, i) => <div key={`off-${i}`} />)}
            {data.map((v, i) => (
              <div key={i} className={`hh-cal-cell cc${v} ${i === todayIdx ? 'hh-cal-today' : ''}`}>
                {i + 1}
                <div className="hh-tip">{TIPS[v]}</div>
              </div>
            ))}
          </div>
          <div className="hh-cal-legend">
            <span className="hh-cl">None</span>
            {['var(--surf2)', '#ddd9fd', '#c4c0f5', '#9b96ee', '#6d67e4', 'var(--ind)'].map((c, i) => (
              <div key={i} className="hh-cl-dot" style={{ background: c, border: c === 'var(--surf2)' ? '1px solid var(--bord)' : 'none' }}></div>
            ))}
            <span className="hh-cl">All done</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      {/* We align to the bottom via overriding Shadcn's fixed coords. The rest is fully isolated in .hh-drawer to match prototype */}
      <DialogContent showCloseButton={false} className="!bottom-0 !top-auto !translate-y-0 !translate-x-0 !left-0 !right-0 p-0 border-none bg-transparent shadow-none max-w-none w-full sm:max-w-none flex items-end justify-center outline-none">
        
        <div className="hh-drawer">
          <div className="hh-drawer-handle" onClick={() => setOpen(false)} />

          <div className="hh-drawer-head">
            <div className="hh-drawer-eyebrow">Your journey</div>
            <div className="hh-drawer-row">
              <div className="hh-drawer-title">Habit <em>history</em></div>
              <button className="hh-hist-btn !bg-transparent !p-2 !border !border-[var(--bord)] hover:!bg-[var(--surf2)] !text-[var(--txt3)] hover:!text-[var(--txt)] !rounded-xl" onClick={() => setOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="hh-drawer-body">
            
            {/* Tabs */}
            <div className="hh-tab-row">
              <button className={`hh-tab-btn ${tab === 'weeks' ? 'on' : ''}`} onClick={() => setTab("weeks")}>Weeks</button>
              <button className={`hh-tab-btn ${tab === 'month' ? 'on' : ''}`} onClick={() => setTab("month")}>Month</button>
              <button className={`hh-tab-btn ${tab === 'insights' ? 'on' : ''}`} onClick={() => setTab("insights")}>Insights</button>
            </div>

            {/* WEEKS */}
            {tab === "weeks" && (
              <div>
                <div className="hh-sum3">
                  <div className="hh-sc og"><div className="hh-sv">14d</div><div className="hh-sl">Best streak</div></div>
                  <div className="hh-sc iv"><div className="hh-sv">89%</div><div className="hh-sl">This month</div></div>
                  <div className="hh-sc gn"><div className="hh-sv">12</div><div className="hh-sl">Perfect days</div></div>
                </div>
                
                <div id="weekList">
                  {WEEKS.map((w, wi) => (
                    <div 
                      key={wi} 
                      className={`hh-wk-card ${openWeek === wi ? 'open' : ''}`}
                      onClick={() => setOpenWeek(openWeek === wi ? -1 : wi)}
                    >
                      <div className="hh-wk-head">
                        <div className="hh-wk-range">{w.range}</div>
                        <div className="hh-wk-right">
                          <span className={`hh-wk-rate ${w.rateClass}`}>{w.rate}%</span>
                          <div className="hh-wk-chevron"><ChevronDown className="w-full h-full text-[var(--txt3)]" /></div>
                        </div>
                      </div>
                      <div className="hh-wk-dots">
                        {w.days.map((d, di) => (
                          <div key={di} className="hh-wk-dot" style={{ background: getDotBg(d.n, d.t) }} />
                        ))}
                      </div>
                      
                      <div className="hh-wk-detail">
                        <div className="hh-day-chips">
                          {w.days.map((d, di) => {
                            const isFull = d.t > 0 && d.n === d.t
                            return (
                              <div key={di} className="hh-day-chip">
                                <div className="hh-day-chip-dot" style={{ background: getDotBg(d.n, d.t) }}>
                                  {isFull && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                </div>
                                <div className="hh-day-chip-lbl">{d.l}</div>
                                <div className="hh-day-chip-n">{d.t > 0 ? `${d.n}/${d.t}` : '—'}</div>
                              </div>
                            )
                          })}
                        </div>
                        <div className="hh-habit-rows">
                          {w.habits.map((h, hi) => (
                            <div key={hi} className="hh-hr-row">
                              <div className="hh-hr-ico">{h.icon}</div>
                              <div className="hh-hr-name">{h.name}</div>
                              <div className="hh-hr-track">
                                <div className="hh-hr-fill" style={{ width: `${h.pct}%`, background: h.color }}></div>
                              </div>
                              <div className="hh-hr-pct" style={{ color: h.color }}>{h.pct}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MONTH TAB */}
            {tab === "month" && (
              <div>
                <CalendarHeatmap name="March 2026" offset={CALS.mar.offset} data={CALS.mar.data} todayIdx={CALS.mar.today} />
                <CalendarHeatmap name="February 2026" offset={CALS.feb.offset} data={CALS.feb.data} todayIdx={CALS.feb.today} />
                <CalendarHeatmap name="January 2026" offset={CALS.jan.offset} data={CALS.jan.data} todayIdx={CALS.jan.today} />
              </div>
            )}

            {/* INSIGHTS TAB */}
            {tab === "insights" && (
              <div>
                <div className="hh-sum3">
                  <div className="hh-sc og"><div className="hh-sv">22d</div><div className="hh-sl">All-time best</div></div>
                  <div className="hh-sc iv"><div className="hh-sv">142</div><div className="hh-sl">Total logs</div></div>
                  <div className="hh-sc gn"><div className="hh-sv">73%</div><div className="hh-sl">Avg rate</div></div>
                </div>
                
                <div className="hh-insight">
                  <div className="hh-ins-ico"><svg viewBox="0 0 16 16"><path d="M8 2l1.5 4.5H14L10.5 9l1.3 4.5L8 11.2 4.2 13.5 5.5 9 2 6.5h4.5z"/></svg></div>
                  <div><span className="hh-ins-strong">Reading is your strongest habit</span><span className="hh-ins-txt">You've completed it 95% of days this month — your top performer.</span></div>
                </div>
                <div className="hh-insight">
                  <div className="hh-ins-ico"><svg viewBox="0 0 16 16"><path d="M2 10l3-6 3 4 2-3 4 5"/></svg></div>
                  <div><span className="hh-ins-strong">Wednesdays are your weak spot</span><span className="hh-ins-txt">You complete 40% fewer habits on Wednesdays. Try scheduling them before noon.</span></div>
                </div>
                <div className="hh-insight">
                  <div className="hh-ins-ico"><svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6"/><path d="M8 5v4M8 9h.01"/></svg></div>
                  <div><span className="hh-ins-strong">Morning habits stick better for you</span><span className="hh-ins-txt">Habits before 9am have 91% completion vs 62% for evening ones.</span></div>
                </div>
                <div className="hh-insight">
                  <div className="hh-ins-ico"><svg viewBox="0 0 16 16"><path d="M8 2v4M8 10v4M2 8h4M10 8h4"/></svg></div>
                  <div><span className="hh-ins-strong">Top 12% of all HabitSwipe users</span><span className="hh-ins-txt">Your 89% monthly rate is exceptional. Keep the chain alive!</span></div>
                </div>
                <div className="hh-insight">
                  <div className="hh-ins-ico"><svg viewBox="0 0 16 16"><path d="M4 14V8M8 14V4M12 14V10"/></svg></div>
                  <div><span className="hh-ins-strong">Consistency is growing month over month</span><span className="hh-ins-txt">Jan: 61% → Feb: 74% → Mar: 89%. You're accelerating.</span></div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
