"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"

interface HabitDistributionPieChartProps {
  data: { name: string; value: number; color: string }[]
}

export function HabitDistributionPieChart({ data }: HabitDistributionPieChartProps) {
  if (data.length === 0) return null

  return (
    <div className="h-[320px] w-full bg-surface border border-theme rounded-3xl p-6 card-shadow">
      <h3 className="text-base font-semibold text-fore mb-2">Habit Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={70}
            outerRadius={95}
            paddingAngle={6}
            dataKey="value"
            animationDuration={2000}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "16px",
              border: "none",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              fontSize: "13px",
              fontWeight: "600"
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{ fontSize: "11px", paddingTop: "20px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
