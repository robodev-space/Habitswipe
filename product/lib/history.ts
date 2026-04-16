import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, eachWeekOfInterval, isSameMonth, startOfMonth, endOfMonth, getDay } from "date-fns"
import { prisma } from "@/lib/prisma"
import { HistoryData, HistoryWeek, MonthHeatmap, InsightItem } from "@/types"

export async function getHistoryData(userId: string): Promise<HistoryData> {
  const habits = await prisma.habit.findMany({
    where: { userId, isArchived: false },
    include: {
      logs: {
        where: {
          date: { gte: subDays(new Date(), 90) }
        },
        orderBy: { date: "desc" }
      }
    }
  })

  const now = new Date()
  const todayStr = format(now, "yyyy-MM-dd")

  // ── Weeks Aggregation ──────────────────────────────────────────────────────
  const weeksInterval = eachWeekOfInterval({
    start: subDays(now, 35), // Last 5-6 weeks
    end: now
  }, { weekStartsOn: 1 }).reverse().slice(0, 5)

  const historyWeeks: HistoryWeek[] = weeksInterval.map(weekStart => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd })
    
    const weekDays = days.map(day => {
      const dateStr = format(day, "yyyy-MM-dd")
      const completed = habits.filter(h => 
        h.logs.some(l => l.status === "DONE" && format(l.date, "yyyy-MM-dd") === dateStr)
      ).length
      return { l: format(day, "EEEEE"), n: completed, t: habits.length }
    })

    const totalPossible = habits.length * 7
    const totalDone = weekDays.reduce((acc, d) => acc + d.n, 0)
    const rate = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0
    let rateClass = "rate-lo"
    if (rate >= 85) rateClass = "rate-hi"
    else if (rate >= 60) rateClass = "rate-md"

    const habitSummary = habits.map(h => {
      const doneInWeek = h.logs.filter(l => 
        l.status === "DONE" && l.date >= weekStart && l.date <= weekEnd 
      ).length
      return {
        icon: h.icon,
        name: h.name,
        pct: Math.round((doneInWeek / 7) * 100),
        color: h.color
      }
    }).sort((a,b) => b.pct - a.pct)

    return {
      range: `${format(weekStart, "MMM d")}–${format(weekEnd, "d")}`,
      rate,
      rateClass,
      days: weekDays,
      habits: habitSummary
    }
  })

  // ── Months Heatmap ─────────────────────────────────────────────────────────
  const months: MonthHeatmap[] = [0, 1, 2].map(back => {
    const monthBase = subDays(now, back * 30) 
    const s = startOfMonth(monthBase)
    const e = endOfMonth(monthBase)
    const days = eachDayOfInterval({ start: s, end: e })
    const offset = (getDay(s) + 6) % 7 // Monday starts as offset 0
    
    const data = days.map(day => {
      const dateStr = format(day, "yyyy-MM-dd")
      return habits.filter(h => 
        h.logs.some(l => l.status === "DONE" && format(l.date, "yyyy-MM-dd") === dateStr)
      ).length
    })

    return {
      name: format(s, "MMMM yyyy"),
      offset,
      data,
      today: isSameMonth(s, now) ? now.getDate() - 1 : -1
    }
  })

  // ── Global Stats & Insights ────────────────────────────────────────────────
  const logsArr = habits.flatMap(h => h.logs.filter(l => l.status === "DONE"))
  const perfectDaysCount = Array.from(new Set(logsArr.map(l => format(l.date, "yyyy-MM-dd"))))
    .filter(dateStr => habits.filter(h => h.logs.some(l => l.status === "DONE" && format(l.date, "yyyy-MM-dd") === dateStr)).length === habits.length)
    .length

  const insights: InsightItem[] = []
  
  // Strongest habit calculation
  if (habits.length > 0) {
    const strongest = habits.map(h => ({
      name: h.name,
      rate: Math.round((h.logs.filter(l => l.status === "DONE").length / 30) * 100) // approx last 30
    })).sort((a,b) => b.rate - a.rate)[0]
    
    insights.push({
      title: `${strongest.name} is your strongest habit`,
      text: `You've completed it ${strongest.rate}% of the time recently. Keep it up!`,
      icon: "⭐"
    })
  }

  // Weakest day calculation
  const dayStats = [0,1,2,3,4,5,6].map(d => {
    const count = logsArr.filter(l => getDay(l.date) === d).length
    return { d, count }
  }).sort((a,b) => a.count - b.count)
  const weakDayIdx = dayStats[0].d
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  
  insights.push({
    title: `${dayNames[weakDayIdx]}s are a hurdle`,
    text: `Your completion rate tends to dip on ${dayNames[weakDayIdx]}s. Try scheduling smaller steps that day.`,
    icon: "📉"
  })

  return {
    weeks: historyWeeks,
    months,
    summary: {
      bestStreak: Math.max(0, ...habits.map(h => (h as any).longestStreak || 0)),
      thisMonthRate: historyWeeks[0]?.rate || 0, // last week as approximation
      perfectDays: perfectDaysCount
    },
    insights
  }
}
