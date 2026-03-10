// lib/prisma.ts
// ─────────────────────────────────────────────────────────────────────────────
// PRISMA CLIENT — Singleton pattern
// Next.js hot-reload creates new module instances in dev, which would create
// multiple DB connections. We store one instance on `globalThis` to reuse it.
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
