"use client"

import { useState } from "react"
import { toast } from "react-hot-toast"

export default function StatsPage() {
  const [filter, setFilter] = useState<"Month" | "Year">("Month")

  // For visual fidelity with the HTML snippet, we'll map the exact layout
  // with static data matching the snippet since a dedicated /api/stats 
  // aggregation endpoint mapping these exact donuts/charts doesn't exist yet out of the box.
  
  return (
    <div className="tab active" id="tab-stats">
      {/* Header */}
      <div className="ph">
        <div>
          <div className="pd">Analytics</div>
          <div className="pt">Your <em>progress</em> story</div>
          <div className="ps">March 2026 · all habits</div>
        </div>
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          <div 
            className={`pill ${filter === "Month" ? "on" : "off"}`} 
            onClick={() => setFilter("Month")}
            style={{ padding: "7px 14px" }}
          >
            Month
          </div>
          <div 
            className={`pill ${filter === "Year" ? "on" : "off"}`} 
            onClick={() => { setFilter("Year"); toast("Year view coming soon!"); setFilter("Month") }}
            style={{ padding: "7px 14px" }}
          >
            Year
          </div>
        </div>
      </div>

      {/* Big 4 */}
      <div className="big4">
        <div className="bc">
          <div className="bc-lbl">Completion rate</div>
          <div className="bc-val">89%</div>
          <div className="bc-sub">of all habits this month</div>
          <div className="trend up">↑ +4% vs last month</div>
        </div>
        <div className="bc">
          <div className="bc-lbl">Total check-ins</div>
          <div className="bc-val">142</div>
          <div className="bc-sub">across 6 habits</div>
          <div className="trend up">↑ +18 vs last month</div>
        </div>
        <div className="bc">
          <div className="bc-lbl">Perfect days</div>
          <div className="bc-val">12</div>
          <div className="bc-sub">all habits completed</div>
          <div className="trend up">↑ +3 vs last month</div>
        </div>
        <div className="bc">
          <div className="bc-lbl">Longest streak</div>
          <div className="bc-val">22d</div>
          <div className="bc-sub">morning run habit</div>
          <div className="trend dn">↓ -2d vs best</div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="chart-card" style={{ marginBottom: 10 }}>
        <div className="chart-head">
          <div className="chart-title">Daily completions — this week</div>
          <div className="chart-sub">Habits per day</div>
        </div>
        <div className="bars">
          <div className="bar-col"><div className="bar-fill" style={{ height: "85%", background: "var(--ind)", borderRadius: "4px 4px 0 0" }}></div><div className="bar-lbl">Mon</div></div>
          <div className="bar-col"><div className="bar-fill" style={{ height: "100%", background: "var(--ind)", borderRadius: "4px 4px 0 0" }}></div><div className="bar-lbl">Tue</div></div>
          <div className="bar-col"><div className="bar-fill" style={{ height: "65%", background: "var(--ind-s)", border: "1px solid var(--ind-m)", borderRadius: "4px 4px 0 0" }}></div><div className="bar-lbl">Wed</div></div>
          <div className="bar-col"><div className="bar-fill" style={{ height: "90%", background: "var(--ind)", borderRadius: "4px 4px 0 0" }}></div><div className="bar-lbl">Thu</div></div>
          <div className="bar-col"><div className="bar-fill" style={{ height: "70%", background: "var(--ind-m)", borderRadius: "4px 4px 0 0" }}></div><div className="bar-lbl">Fri</div></div>
          <div className="bar-col"><div className="bar-fill" style={{ height: "20%", background: "var(--surf2)", border: "1px dashed var(--bord)", borderRadius: "4px 4px 0 0" }}></div><div className="bar-lbl">Sat</div></div>
          <div className="bar-col"><div className="bar-fill" style={{ height: "8%", background: "var(--surf2)", border: "1px dashed var(--bord)", borderRadius: "4px 4px 0 0" }}></div><div className="bar-lbl">Sun</div></div>
        </div>
      </div>

      {/* Donuts */}
      <div className="donuts">
        <div className="donut-c">
          <svg width="52" height="52" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="20" fill="none" stroke="var(--ind-s)" strokeWidth="8" />
            <circle cx="26" cy="26" r="20" fill="none" stroke="var(--ind)" strokeWidth="8" strokeDasharray="125.6" strokeDashoffset="13.8" strokeLinecap="round" transform="rotate(-90 26 26)" />
          </svg>
          <div><div className="dv" style={{ color: "var(--ind)" }}>89%</div><div className="dl">Overall rate</div></div>
        </div>
        <div className="donut-c">
          <svg width="52" height="52" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="20" fill="none" stroke="var(--org-s)" strokeWidth="8" />
            <circle cx="26" cy="26" r="20" fill="none" stroke="var(--org)" strokeWidth="8" strokeDasharray="125.6" strokeDashoffset="40.2" strokeLinecap="round" transform="rotate(-90 26 26)" />
          </svg>
          <div><div className="dv" style={{ color: "var(--org)" }}>68%</div><div className="dl">Morning habits</div></div>
        </div>
        <div className="donut-c">
          <svg width="52" height="52" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="20" fill="none" stroke="var(--grn-s)" strokeWidth="8" />
            <circle cx="26" cy="26" r="20" fill="none" stroke="var(--grn)" strokeWidth="8" strokeDasharray="125.6" strokeDashoffset="7.5" strokeLinecap="round" transform="rotate(-90 26 26)" />
          </svg>
          <div><div className="dv" style={{ color: "var(--grn)" }}>94%</div><div className="dl">Evening habits</div></div>
        </div>
        <div className="donut-c">
          <svg width="52" height="52" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="20" fill="none" stroke="#fdf4ff" strokeWidth="8" />
            <circle cx="26" cy="26" r="20" fill="none" stroke="#a855f7" strokeWidth="8" strokeDasharray="125.6" strokeDashoffset="6.3" strokeLinecap="round" transform="rotate(-90 26 26)" />
          </svg>
          <div><div className="dv" style={{ color: "#a855f7" }}>95%</div><div className="dl">Reading habit</div></div>
        </div>
      </div>

      {/* Perf list */}
      <div className="sh" style={{ marginTop: 10 }}>
        <div className="st">Habit performance</div>
      </div>
      <div className="card">
        <div className="perf-list">
          <div className="perf-row"><div className="perf-name">📚 Reading</div><div className="perf-track"><div className="perf-fill" style={{ width: "95%", background: "#a855f7" }}></div></div><div className="perf-pct" style={{ color: "#a855f7" }}>95%</div></div>
          <div className="perf-row"><div className="perf-name">🏃 Morning run</div><div className="perf-track"><div className="perf-fill" style={{ width: "85%", background: "#10b981" }}></div></div><div className="perf-pct" style={{ color: "#10b981" }}>85%</div></div>
          <div className="perf-row"><div className="perf-name">💧 Water</div><div className="perf-track"><div className="perf-fill" style={{ width: "70%", background: "#6366f1" }}></div></div><div className="perf-pct" style={{ color: "#6366f1" }}>70%</div></div>
          <div className="perf-row"><div className="perf-name">🧘 Meditation</div><div className="perf-track"><div className="perf-fill" style={{ width: "60%", background: "#f97316" }}></div></div><div className="perf-pct" style={{ color: "#f97316" }}>60%</div></div>
          <div className="perf-row"><div className="perf-name">💪 Strength</div><div className="perf-track"><div className="perf-fill" style={{ width: "50%", background: "#3b82f6" }}></div></div><div className="perf-pct" style={{ color: "#3b82f6" }}>50%</div></div>
        </div>
      </div>
    </div>
  )
}
