// app/api/cron/reminders/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// CRON: Habit Reminders Engine
// Triggered by a scheduler (e.g. Vercel Cron) to send habit-specific nudges.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { emailService } from "@/lib/services/email.resend.service"
import { formatInTimeZone, toDate } from "date-fns-tz"
import { startOfDay, format } from "date-fns"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    // 1. Security Check (CRON_SECRET)
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()
    console.log(`🕒 Cron started at: ${now.toISOString()}`)

    // 2. Fetch all habits with email reminders enabled
    const habits = await prisma.habit.findMany({
      where: {
        emailReminders: true,
        reminderTime: { not: null },
        isArchived: false,
      },
      include: {
        user: true,
      },
    })

    const results = {
      total: habits.length,
      sent: 0,
      skipped: 0,
      errors: 0,
    }

    for (const habit of habits) {
      const user = habit.user
      const timezone = user.timezone || "UTC"
      const userTime = formatInTimeZone(now, timezone, "HH:mm")
      const userDateStr = formatInTimeZone(now, timezone, "yyyy-MM-dd")
      const userToday = toDate(userDateStr, { timeZone: timezone })

      // Logic: Only send if habit.reminderTime matches current userTime (HH:mm)
      // Note: Cron usually runs every 15-60 mins, so we check for exact match or proximity.
      if (habit.reminderTime !== userTime) {
        results.skipped++
        continue
      }

      // Check if habit already reminded today
      if (habit.lastRemindedAt) {
        const lastRemindedDate = formatInTimeZone(habit.lastRemindedAt, timezone, "yyyy-MM-dd")
        if (lastRemindedDate === userDateStr) {
          results.skipped++
          continue
        }
      }

      // Check if habit already logged as DONE today
      const existingLog = await prisma.habitLog.findFirst({
        where: {
          habitId: habit.id,
          date: userToday,
          status: "DONE",
        },
      })

      if (existingLog) {
        results.skipped++
        continue
      }

      // Send the email
      console.log(`📧 Sending reminder to ${user.email} for habit: ${habit.name}`)

      // Calculate streak for the email template
      // (Minimal calculation for now, just to show logic)
      const streak = 0

      const emailRes = await emailService.sendReminderEmail(
        user.email,
        habit.name,
        streak > 0 ? streak : undefined
      )

      if (emailRes.success) {
        // Update lastRemindedAt
        await prisma.habit.update({
          where: { id: habit.id },
          data: { lastRemindedAt: now },
        })
        results.sent++
      } else {
        results.errors++
      }
    }

    return NextResponse.json({
      message: "Cron completed",
      results,
    })

  } catch (err) {
    console.error("[CRON_REMINDERS_ERROR]", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
