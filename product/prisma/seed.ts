// prisma/seed.ts
// ─────────────────────────────────────────────────────────────────────────────
// Seed script — inserts dummy missed-habit test data for the current user.
// Run with:  npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
// Or:        npx tsx prisma/seed.ts
//
// What it does:
//   1. Finds the first user in the DB (or uses USER_EMAIL env var to target one)
//   2. Creates 5 test habits (if they don't already exist by name)
//   3. Logs each habit as DONE for the 6 days BEFORE yesterday — leaving
//      yesterday (2026-03-21) unlogged so they appear as "missed"
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// ─── Config ───────────────────────────────────────────────────────────────────
// Set USER_EMAIL env var to target a specific account, otherwise uses first user
const TARGET_EMAIL = process.env.USER_EMAIL

// Today in UTC: 2026-03-22
// Yesterday (the "missed" day): 2026-03-21
function utcDate(daysAgo: number): Date {
  const d = new Date("2026-03-22T00:00:00.000Z")
  d.setUTCDate(d.getUTCDate() - daysAgo)
  return d
}

const YESTERDAY = utcDate(1)  // 2026-03-21 — this day is intentionally skipped
const DAYS_BEFORE_YESTERDAY = [
  utcDate(2), // 2026-03-20
  utcDate(3), // 2026-03-19
  utcDate(4), // 2026-03-18
  utcDate(5), // 2026-03-17
  utcDate(6), // 2026-03-16
  utcDate(7), // 2026-03-15
]

const TEST_HABITS = [
  { name: "Morning run",         icon: "🏃", color: "#10b981", frequency: "DAILY",  targetDays: 7 },
  { name: "No coffee after 2pm", icon: "☕", color: "#f59e0b", frequency: "DAILY",  targetDays: 7 },
  { name: "Read 20 min",         icon: "📚", color: "#8b5cf6", frequency: "DAILY",  targetDays: 7 },
  { name: "Swimming",            icon: "🏊", color: "#3b82f6", frequency: "WEEKLY", targetDays: 3 },
  { name: "Gratitude journal",   icon: "📓", color: "#ec4899", frequency: "DAILY",  targetDays: 7 },
] as const

async function main() {
  // Find target user
  const user = TARGET_EMAIL
    ? await prisma.user.findUnique({ where: { email: TARGET_EMAIL } })
    : await prisma.user.findFirst({ orderBy: { createdAt: "asc" } })

  if (!user) {
    console.error("❌ No user found. Sign up first, then run the seed.")
    process.exit(1)
  }

  console.log(`\n🌱 Seeding for user: ${user.email} (${user.id})\n`)

  for (const [index, def] of TEST_HABITS.entries()) {
    // Create or find habit
    let habit = await prisma.habit.findFirst({
      where: { userId: user.id, name: def.name },
    })

    if (!habit) {
      habit = await prisma.habit.create({
        data: {
          userId: user.id,
          name: def.name,
          icon: def.icon,
          color: def.color,
          frequency: def.frequency as "DAILY" | "WEEKLY",
          targetDays: def.targetDays,
          sortOrder: 100 + index, // place after existing habits
        },
      })
      console.log(`  ✅ Created habit: ${def.icon} ${def.name}`)
    } else {
      console.log(`  ♻️  Habit already exists: ${def.icon} ${def.name}`)
    }

    // Log DONE for the 6 days before yesterday (skip yesterday intentionally)
    for (const day of DAYS_BEFORE_YESTERDAY) {
      await prisma.habitLog.upsert({
        where: { habitId_date: { habitId: habit.id, date: day } },
        create: {
          habitId: habit.id,
          userId: user.id,
          date: day,
          status: "DONE",
        },
        update: { status: "DONE" },
      })
    }
    console.log(`     📅 Logged DONE for 6 days before yesterday (skipped ${YESTERDAY.toISOString().slice(0,10)})`)
  }

  console.log(`\n🎉 Done! Visit the app — the "Missed yesterday" section should show 5 habits.\n`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
