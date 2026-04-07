// app/api/habits/missed/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// GET /api/habits/missed
// Returns the current user's habits that have NO log for yesterday.
// Each habit includes a 7-day history strip and streakLost count.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

function dateString(d: Date) {
  return d.toISOString().slice(0, 10)
}

function subtractDays(d: Date, n: number) {
  const copy = new Date(d)
  copy.setUTCDate(copy.getUTCDate() - n)
  return copy
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Yesterday in UTC
  const now = new Date()
  const yesterday = subtractDays(now, 1)
  yesterday.setUTCHours(0, 0, 0, 0)
  const yesterdayStr = dateString(yesterday)

  // 7-day window start (7 days ago including yesterday)
  const sevenDaysAgo = subtractDays(yesterday, 6)
  sevenDaysAgo.setUTCHours(0, 0, 0, 0)

  // Fetch all active habits for user
  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id, isArchived: false },
    orderBy: { sortOrder: "asc" },
    include: {
      logs: {
        where: {
          date: {
            gte: sevenDaysAgo,
            lte: yesterday,
          },
        },
        orderBy: { date: "asc" },
      },
    },
  })

  // Build result — keep only habits with no DONE/SKIPPED log for yesterday
  const missed = habits
    .filter((habit) => {
      const yesterdayLog = habit.logs.find(
        (l) => dateString(new Date(l.date)) === yesterdayStr
      )
      return !yesterdayLog // no log at all for yesterday = missed
    })
    .map((habit) => {
      // Build 7-day history strip
      const hist: string[] = []
      for (let i = 6; i >= 0; i--) {
        const day = subtractDays(yesterday, i)
        day.setUTCHours(0, 0, 0, 0)
        const dayStr = dateString(day)

        // today (0 days ago from yesterday = yesterday itself)
        const isYesterday = dayStr === yesterdayStr
        if (isYesterday) {
          hist.push("miss") // the day that was missed triggers appearing here
          continue
        }

        const log = habit.logs.find(
          (l) => dateString(new Date(l.date)) === dayStr
        )
        if (!log) {
          hist.push("none")
        } else if (log.status === "DONE") {
          hist.push("done")
        } else {
          hist.push("miss")
        }
      }
      // Last slot = "today" (so user can see the "Add today" result)
      // We already built 7 slots above (6 days back + yesterday), replace last with today marker
      // Actually let's build: [6 days ago ... 1 day ago (=yesterday=miss)] + today slot
      const histWithToday = hist.slice(0, 6).concat(["today"])

      // Calculate streak lost — consecutive DONE logs ending before yesterday
      const sortedLogs = [...habit.logs].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      let streakLost = 0
      // Walk backwards from 2 days ago (day before yesterday)
      for (let i = 1; i <= 30; i++) {
        const checkDay = subtractDays(yesterday, i)
        checkDay.setUTCHours(0, 0, 0, 0)
        const checkStr = dateString(checkDay)
        const log = sortedLogs.find(
          (l) => dateString(new Date(l.date)) === checkStr
        )
        if (log && log.status === "DONE") {
          streakLost++
        } else {
          break
        }
      }

      return {
        id: habit.id,
        icon: habit.icon,
        name: habit.name,
        color: habit.color,
        frequency: habit.frequency,
        targetDays: habit.targetDays,
        streakLost,
        category: habit.frequency === "DAILY" ? "daily" : "weekly",
        freq:
          habit.frequency === "DAILY"
            ? "Daily"
            : `${habit.targetDays}× weekly`,
        hist: histWithToday,
      }
    })

  return NextResponse.json({
    data: missed,
    yesterday: yesterdayStr,
  })
}
