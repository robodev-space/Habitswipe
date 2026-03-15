// app/api/logs/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// POST /api/logs — Record a swipe (DONE or SKIPPED) for a habit on a date
// This is the core action of the app — called every time user swipes a card
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const swipeSchema = z.object({
  habitId: z.string(),
  status: z.enum(["DONE", "SKIPPED"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { habitId, status, date } = swipeSchema.parse(body)

    // Verify the habit belongs to the user
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId: session.user.id },
    })
    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 })
    }

    // upsert — if the user swipes twice on the same day, update the log
    // This allows changing DONE → SKIPPED if user taps undo
    const log = await prisma.habitLog.upsert({
      where: {
        habitId_date: {
          habitId,
          date: new Date(date + "T00:00:00.000Z"),
        },
      },
      create: {
        habitId,
        userId: session.user.id,
        date: new Date(date + "T00:00:00.000Z"),
        status,
      },
      update: {
        status, // allow changing status (undo swipe)
      },
    })

    // Check if all habits for this date are now completed
    const totalHabits = await prisma.habit.count({
      where: { userId: session.user.id }
    })
    
    const completedLogs = await prisma.habitLog.count({
      where: { 
        userId: session.user.id, 
        date: new Date(date + "T00:00:00.000Z") 
      }
    })

    const allCompleted = totalHabits > 0 && completedLogs === totalHabits

    return NextResponse.json({ data: log, allCompleted }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    console.error("[LOGS_POST_ERROR]", err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

// ── GET — Fetch logs for a date range (used in dashboard/history) ─────────────
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const from = searchParams.get("from") // "YYYY-MM-DD"
  const to = searchParams.get("to")     // "YYYY-MM-DD"

  const logs = await prisma.habitLog.findMany({
    where: {
      userId: session.user.id,
      ...(from && { date: { gte: new Date(from + "T00:00:00.000Z") } }),
      ...(to && { date: { lte: new Date(to + "T00:00:00.000Z") } }),
    },
    include: { habit: true },
    orderBy: { date: "desc" },
  })

  return NextResponse.json({ data: logs })
}
