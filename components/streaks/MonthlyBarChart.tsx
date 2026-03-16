"use client"

import * as React from "react"
import { TrendingUp, ChevronDown } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { MonthlyPerformancePoint } from "@/types"
import { ChartTooltipContentProps } from "@/types/index"
import { cn } from "@/lib/utils"

interface MonthlyBarChartProps {
  data: MonthlyPerformancePoint[]
}

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  const [timeRange, setTimeRange] = React.useState("6") // default to 6 months

  const filteredData = React.useMemo(() => {
    const range = parseInt(timeRange)
    return data.slice(-range)
  }, [data, timeRange])

  const totalCompletions = React.useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.completions, 0)
  }, [filteredData])

  const chartConfig = {
    completions: {
      label: "Completions",
    },
  }

  return (
    <Card className="h-[320px] lg:h-full flex flex-col justify-between overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div>
          <CardTitle className="text-base font-semibold">Monthly Performance</CardTitle>
          <CardDescription className="text-xs">Habit completions by month</CardDescription>
        </div>
        <div className="relative inline-block text-left">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none bg-surface-2 border border-theme rounded-lg px-3 py-1 text-xs font-medium text-fore-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 pr-8 cursor-pointer"
          >
            <option value="3">Last 3 Months</option>
            <option value="6">Last 6 Months</option>
            <option value="12">Last 12 Months</option>
          </select>
          <ChevronDown className="absolute right-2 top-1.5 h-3.5 w-3.5 text-fore-3 pointer-events-none" />
        </div>
      </CardHeader>

      <CardContent className="pb-0 flex-1 min-h-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              layout="vertical"
              margin={{
                left: -20,
                right: 20,
              }}
            >
              <YAxis
                dataKey="month"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
              />
              <XAxis dataKey="completions" type="number" hide />
              <ChartTooltip
                cursor={false}
              // content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="completions"
                radius={6}
                fill="#6366f1"
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-1 text-sm pt-2">
        <div className="flex gap-2 leading-none font-medium text-fore">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <span>{totalCompletions} total completions in this period</span>
        </div>
        <p className="text-[10px] text-fore-3 leading-none italic">
          Consistency is the key to building lasting habits.
        </p>
      </CardFooter>
    </Card>
  )
}
