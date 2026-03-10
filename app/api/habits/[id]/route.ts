// app/api/habits/[id]/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// PATCH  /api/habits/:id — Update habit (name, icon, color, archive, reorder)
// DELETE /api/habits/:id — Permanently delete habit + all its logs
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type Params = { params: { id: string } }

// Shared helper — verify habit belongs to current user
async function getOwnedHabit(habitId: string, userId: string) {
  const habit = await prisma.habit.findUnique({ where: { id: habitId } })
  if (!habit || habit.userId !== userId) return null
  return habit
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
