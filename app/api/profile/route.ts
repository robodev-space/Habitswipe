// app/api/profile/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/profile — Fetch current user profile
// PATCH /api/profile — Update name, phone, bio, username
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { nanoid } from "nanoid"

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

  // Count how many people used this referral code
  const referralCount = await prisma.user.count({
    where: { referredBy: user.referralCode ?? "" },
  })

  return NextResponse.json({ data: { ...user, referralCount } })
}

// ── PATCH ─────────────────────────────────────────────────────────────────────
const updateSchema = z.object({
  name: z.string().min(1, "Name is required").max(50).optional(),
  username: z
    .string()
    .min(3, "Min 3 characters")
    .max(20, "Max 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, underscore")
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,15}$/, "Invalid phone number")
    .optional()
    .nullable(),
  bio: z.string().max(160, "Max 160 characters").optional().nullable(),
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
        image: true,
        phone: true,
        bio: true,
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
