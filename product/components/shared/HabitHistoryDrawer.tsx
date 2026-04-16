"use client"

import React from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ChevronDown, X, Check } from "lucide-react"
import "./habit-history.css"
import { API_ROUTES } from "@/lib/constants/api-routes"
import { HistoryData } from "@/types"
import { Skeleton } from "@/components/ui/Skeleton"
import { toast } from "react-hot-toast"

const TIPS = ['No habits', '1–2 habits', '3 habits', '4 habits', '5 habits', 'All habits!']
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
  const [open, setOpen] = React.useState(false)
  const [tab, setTab] = React.useState<"weeks" | "month" | "insights">("weeks")
  const [openWeek, setOpenWeek] = React.useState<number>(0)
  const [data, setData] = React.useState<HistoryData | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const fetchHistory = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(API_ROUTES.TODAY.HISTORY)
      const json = await res.json()
      if (res.ok && json.data) {
        setData(json.data)
      }
    } catch (err) {
      toast.error("Failed to load history")
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (open && !data) {
      fetchHistory()
    }
  }, [open, data, fetchHistory])

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
      <DialogContent showCloseButton={false} className="p-0 border-none bg-transparent shadow-none max-w-none w-full sm:max-w-none flex items-center justify-center outline-none">
        
        <div className="hh-drawer">

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
                {!data || isLoading ? (
                  <div className="hh-sum3">
                    <Skeleton className="h-16 w-full rounded-2xl" />
                    <Skeleton className="h-16 w-full rounded-2xl" />
                    <Skeleton className="h-16 w-full rounded-2xl" />
                  </div>
                ) : (
                  <div className="hh-sum3">
                    <div className="hh-sc og"><div className="hh-sv">{data.summary.bestStreak}d</div><div className="hh-sl">Best streak</div></div>
                    <div className="hh-sc iv"><div className="hh-sv">{data.summary.thisMonthRate}%</div><div className="hh-sl">This month</div></div>
                    <div className="hh-sc gn"><div className="hh-sv">{data.summary.perfectDays}</div><div className="hh-sl">Perfect days</div></div>
                  </div>
                )}
                
                <div id="weekList">
                  {!data || isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full rounded-2xl mb-3" />
                    ))
                  ) : (
                    data.weeks.map((w, wi) => (
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
                    ))
                  )}
                </div>
              </div>
            )}

            {/* MONTH TAB */}
            {tab === "month" && (
              <div>
                {!data || isLoading ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-64 w-full rounded-2xl mb-6" />
                  ))
                ) : (
                  data.months.map((m, mi) => (
                    <CalendarHeatmap key={mi} name={m.name} offset={m.offset} data={m.data} todayIdx={m.today} />
                  ))
                )}
              </div>
            )}

            {/* INSIGHTS TAB */}
            {tab === "insights" && (
              <div>
                {!data || isLoading ? (
                  <>
                    <div className="hh-sum3">
                      <Skeleton className="h-16 w-full rounded-2xl" />
                      <Skeleton className="h-16 w-full rounded-2xl" />
                      <Skeleton className="h-16 w-full rounded-2xl" />
                    </div>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full rounded-2xl mb-4" />
                    ))}
                  </>
                ) : (
                  <>
                    <div className="hh-sum3">
                      <div className="hh-sc og"><div className="hh-sv">{data.summary.bestStreak}d</div><div className="hh-sl">All-time best</div></div>
                      <div className="hh-sc iv"><div className="hh-sv">{data.summary.thisMonthRate}%</div><div className="hh-sl">Month rate</div></div>
                      <div className="hh-sc gn"><div className="hh-sv">{data.summary.perfectDays}</div><div className="hh-sl">Perfect days</div></div>
                    </div>
                    
                    {data.insights.map((insight, ii) => (
                      <div key={ii} className="hh-insight">
                        <div className="hh-ins-ico">{insight.icon || '✨'}</div>
                        <div>
                          <span className="hh-ins-strong">{insight.title}</span>
                          <span className="hh-ins-txt">{insight.text}</span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
