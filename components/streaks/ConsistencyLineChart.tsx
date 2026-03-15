"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"

interface ConsistencyLineChartProps {
  data: { date: string; completions: number }[]
}

export function ConsistencyLineChart({ data }: ConsistencyLineChartProps) {
  return (
    <div className="h-[320px] w-full bg-surface border border-theme rounded-3xl p-6 card-shadow">
      <h3 className="text-base font-semibold text-fore mb-4">Consistency Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
              <stop offset="50%" stopColor="#6366f1" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            interval={5}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "16px",
              border: "none",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              fontSize: "13px",
              fontWeight: "600",
              color: "#312e81"
            }}
            cursor={{ stroke: '#818cf8', strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="completions"
            stroke="#6366f1"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorCompletions)"
            animationDuration={2000}
            activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
