import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { startOfDay } from "date-fns"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { SnapShareLog } from "@/types"

// GET /api/snaps
// Returns an array of dates (YYYY-MM-DD) when the user shared a snap
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const logs = await prisma.snapShareLog.findMany({
      where: { userId: session.user.id },
      select: { date: true },
      orderBy: { date: "asc" },
    })

    // Return just the date strings (e.g., "2024-03-24")
    const dates = logs.map((log) => log.date.toISOString().split("T")[0])

    return NextResponse.json({ dates })
  } catch (error) {
    console.error("[SNAPS_GET]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/snaps
// Logs that the user shared a snap today
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Use UTC startOfDay for consistency
    const today = startOfDay(new Date())

    // Upsert so if they share multiple times today, we only keep one log
    const log = await prisma.snapShareLog.upsert({
      where: {
        userId_date: {
          userId: session.user.id,
          date: today,
        },
      },
      update: {}, // Do nothing if it already exists
      create: {
        userId: session.user.id,
        date: today,
      },
    })

    return NextResponse.json({ success: true, log })
  } catch (error) {
    console.error("[SNAPS_POST]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
