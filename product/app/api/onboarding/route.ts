// app/api/onboarding/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// POST /api/onboarding — Save onboarding data and create first habit
// Called when user clicks "Start tracking" on step 4
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const onboardingSchema = z.object({
  goal: z.string().min(1),
  habitName: z.string().min(1).max(60),
  habitIcon: z.string().default("⚡"),
  habitColor: z.string().regex(/^#[0-9a-f]{6}$/i).default("#3d7a55"),
  frequency: z.enum(["DAILY", "WEEKLY"]).default("DAILY"),
  targetDays: z.number().min(1).max(7).default(7),
  reminderTime: z.string().optional(),
  emailReminders: z.boolean().default(true),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = onboardingSchema.parse(body)

    // Map frequency string from the UI to Prisma enum + targetDays
    let frequency: "DAILY" | "WEEKLY" = data.frequency
    let targetDays = data.targetDays

    // Create the user's first habit
    await prisma.habit.create({
      data: {
        userId: session.user.id,
        name: data.habitName,
        icon: data.habitIcon,
        color: data.habitColor,
        frequency,
        targetDays,
        sortOrder: 0,
      },
    })

    // Update user profile with onboarding preferences
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        onboardingComplete: true,
        goal: data.goal,
        reminderTime: data.reminderTime || null,
        emailReminders: data.emailReminders,
      },
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    console.error("[ONBOARDING_POST_ERROR]", err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
