// app/api/habits/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/habits — List current user's habits with today's log + stats
// POST /api/habits — Create a new habit
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { computeCurrentStreak, computeLongestStreak, computeCompletionRate } from "@/lib/streaks"
import { getUserToday } from "@/lib/date-utils"

export const dynamic = "force-dynamic"

// ── GET — List habits ─────────────────────────────────────────────────────────
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Fetch user profile for timezone & dayStartHour
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { timezone: true, dayStartHour: true }
  })
  
  const today = getUserToday(user?.timezone ?? "UTC", user?.dayStartHour ?? 0)
  const todayStart = new Date(today) // UTC start of user's local today

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id, isArchived: false },
    orderBy: { sortOrder: "asc" },
    include: {
      logs: {
        orderBy: { date: "desc" },
        take: 90, // last 90 days for streak calculations
      },
    },
  })

  // Enrich each habit with computed stats
  const enriched = habits.map((habit) => {
    const todayLog = habit.logs.find(
      (l) => l.date.toISOString().slice(0, 10) === today
    ) ?? null
    const doneDates = habit.logs.filter(l => l.status === "DONE").map(l => l.date)

    return {
      ...habit,
      todayLog,
      currentStreak: computeCurrentStreak(doneDates),
      longestStreak: computeLongestStreak(doneDates),
      completionRate: computeCompletionRate(habit.logs),
    }
  })

  return NextResponse.json({ data: enriched })
}

// ── POST — Create habit ───────────────────────────────────────────────────────
const createSchema = z.object({
  name: z.string().min(1).max(60),
  icon: z.string().default("⚡"),
  color: z.string().regex(/^#[0-9a-f]{6}$/i).default("#6366f1"),
  frequency: z.enum(["DAILY", "WEEKLY"]).default("DAILY"),
  targetDays: z.number().min(1).max(7).default(7),
  reminderTime: z.string().optional().nullable(),
  emailReminders: z.boolean().default(true),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = createSchema.parse(body)

    // Put new habit at the end of the sort order
    const count = await prisma.habit.count({
      where: { userId: session.user.id },
    })

    const habit = await prisma.habit.create({
      data: {
        ...data,
        userId: session.user.id,
        sortOrder: count,
        reminderTime: data.reminderTime || null,
        emailReminders: data.emailReminders,
      } as any,
    })

    return NextResponse.json({ data: habit }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    console.error("[HABITS_POST_ERROR]", err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
