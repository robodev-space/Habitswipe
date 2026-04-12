// app/api/profile/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/profile — Fetch current user profile
// PATCH /api/profile — Update name, phone, bio, username
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { format, subDays, startOfDay, eachDayOfInterval, differenceInDays } from "date-fns"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { nanoid } from "nanoid"
import { computeCurrentStreak, computeLongestStreak } from "@/lib/streaks"

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      image: true,
      phone: true,
      bio: true,
      timezone: true,
      dayStartHour: true,
      emailReminders: true,
      theme: true,
      referralCode: true,
      referredBy: true,
      createdAt: true,
      _count: {
        select: { habits: true, logs: true },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Auto-generate referral code if user doesn't have one
  if (!user.referralCode) {
    const code = nanoid(8).toUpperCase()
    await prisma.user.update({
      where: { id: session.user.id },
      data: { referralCode: code },
    })
    user.referralCode = code
  }

  // ── Calculate Stats ────────────────────────────────────────────────────────
  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    include: {
      logs: {
        where: { status: "DONE" },
        select: { date: true },
      },
    },
  })

  const u = user as any

  // 1. Total Check-ins
  const totalCheckIns = u._count?.logs || 0

  // 2. Best Streak (Max of all habits' longest streaks)
  const bestStreak = habits.length > 0 
    ? Math.max(...habits.map(h => (h as any).longestStreak || 0)) 
    : 0

  // 3. User Activity Streak (Consecutive days with at least 1 DONE log)
  const allDoneDates = Array.from(new Set(
    habits.flatMap(h => h.logs.map(l => format(l.date, "yyyy-MM-dd")))
  )).map(d => new Date(d))
  const currentStreak = computeCurrentStreak(allDoneDates)

  // 4. Perfect Days
  // Group all logs by date
  const logsByDate = new Map<string, number>()
  habits.forEach(h => {
    h.logs.forEach(l => {
      const dStr = format(l.date, "yyyy-MM-dd")
      logsByDate.set(dStr, (logsByDate.get(dStr) || 0) + 1)
    })
  })

  let perfectDays = 0
  const totalHabits = u._count?.habits || 0
  if (totalHabits > 0) {
    logsByDate.forEach((count) => {
      if (count >= totalHabits) perfectDays++
    })
  }

  // 5. Overall Completion Rate (Lifetime)
  const daysSinceJoined = Math.max(differenceInDays(new Date(), user.createdAt), 1)
  const totalPossible = daysSinceJoined * totalHabits
  const completionRate = totalPossible > 0 
    ? Math.round((totalCheckIns / totalPossible) * 100) 
    : 0

  // Count how many people used this referral code
  const referralCount = await prisma.user.count({
    where: { referredBy: user.referralCode ?? "" },
  })

  const stats = {
    currentStreak,
    bestStreak,
    totalCheckIns,
    perfectDays,
    completionRate,
  }

  return NextResponse.json({ data: { ...user, referralCount, stats } })
}

// ── PATCH ─────────────────────────────────────────────────────────────────────
const updateSchema = z.object({
  name: z.string().max(50).optional().or(z.literal("")),
  username: z
    .string()
    .max(20, "Max 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, underscore")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,15}$/, "Invalid phone number")
    .optional()
    .nullable()
    .or(z.literal("")),
  bio: z.string().max(160, "Max 160 characters").optional().nullable().or(z.literal("")),
  emailReminders: z.boolean().optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  timezone: z.string().optional(),
  dayStartHour: z.coerce.number().int().min(0).max(23).optional(),
})

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = updateSchema.parse(body)

    // Check username uniqueness if being changed
    if (data.username) {
      const existing = await prisma.user.findFirst({
        where: {
          username: data.username,
          NOT: { id: session.user.id },
        },
      })
      if (existing) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 409 }
        )
      }
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        timezone: true,
        dayStartHour: true,
        emailReminders: true,
        theme: true,
        referralCode: true,
      },
    })

    return NextResponse.json({ data: updated })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    console.error("[PROFILE_PATCH_ERROR]", err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
