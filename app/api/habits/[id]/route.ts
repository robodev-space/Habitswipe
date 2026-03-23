// app/api/habits/[id]/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// GET    /api/habits/:id — Fetch a single habit with today's log + stats
// PATCH  /api/habits/:id — Update habit (name, icon, color, archive, reorder)
// DELETE /api/habits/:id — Permanently delete habit + all its logs
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { todayString } from "@/lib/utils"

type Params = { params: { id: string } }

// Shared helper — verify habit belongs to current user
async function getOwnedHabit(habitId: string, userId: string) {
  const habit = await prisma.habit.findUnique({ where: { id: habitId } })
  if (!habit || habit.userId !== userId) return null
  return habit
}

// ── GET — Fetch single habit ─────────────────────────────────────────────────
export async function GET(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const habit = await getOwnedHabit(params.id, session.user.id)
  if (!habit) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 })
  }

  // Fetch with logs for stats calculation
  const habitWithLogs = await prisma.habit.findUnique({
    where: { id: params.id },
    include: {
      logs: {
        orderBy: { date: "desc" },
        take: 90,
      },
    },
  })

  const today = todayString()
  const todayLog = habitWithLogs?.logs.find(
    (l) => new Date(l.date).toISOString().slice(0, 10) === today
  ) ?? null

  return NextResponse.json({
    data: {
      ...habitWithLogs,
      todayLog,
      currentStreak: 0,
      longestStreak: 0,
      completionRate: 0,
    },
  })
}

// ── PATCH — Update habit ──────────────────────────────────────────────────────
const updateSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
  frequency: z.enum(["DAILY", "WEEKLY"]).optional(),
  targetDays: z.number().min(1).max(7).optional(),
  isArchived: z.boolean().optional(),
  sortOrder: z.number().optional(),
  reminderTime: z.string().nullable().optional(),   // e.g. "07:00" or null to clear
  emailReminders: z.boolean().optional(),
})

export async function PATCH(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const habit = await getOwnedHabit(params.id, session.user.id)
  if (!habit) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 })
  }

  try {
    const body = await req.json()
    const data = updateSchema.parse(body)

    const updated = await prisma.habit.update({
      where: { id: params.id },
      data,
    })

    return NextResponse.json({ data: updated })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

// ── DELETE — Remove habit ─────────────────────────────────────────────────────
export async function DELETE(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const habit = await getOwnedHabit(params.id, session.user.id)
  if (!habit) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 })
  }

  // Cascade delete removes all logs too (via Prisma schema onDelete: Cascade)
  await prisma.habit.delete({ where: { id: params.id } })

  return NextResponse.json({ data: { success: true } })
}
