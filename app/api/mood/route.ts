// app/api/mood/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { todayString } from "@/lib/utils"

const moodSchema = z.object({
  id: z.number(),
  mood: z.string().min(1),
  emoji: z.string().min(1),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const today = new Date(todayString())

  try {
    const log = await prisma.moodLog.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: today,
        },
      },
    })
    return NextResponse.json({ data: log })
  } catch (err) {
    console.error("[MOOD_GET_ERROR]", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id, mood, emoji } = moodSchema.parse(body)
    const today = new Date(todayString())

    // Check if mood already logged today
    const existing = await prisma.moodLog.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: today,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ error: "Mood already logged today" }, { status: 409 })
    }

    const log = await prisma.moodLog.create({
      data: {
        userId: session.user.id,
        date: today,
        mood,
        emoji,
      },
    })

    return NextResponse.json({ data: log }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    console.error("[MOOD_POST_ERROR]", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
