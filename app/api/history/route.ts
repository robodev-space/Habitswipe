// app/api/history/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// GET /api/history — Aggregates 90 days of logs for the history drawer
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getHistoryData } from "@/lib/history"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await getHistoryData(session.user.id)
    return NextResponse.json({ data })
  } catch (err) {
    console.error("[HISTORY_GET_ERROR]", err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
