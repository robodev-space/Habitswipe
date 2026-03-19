// app/api/auth/register/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register — Create new user with hashed password
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = registerSchema.parse(body)

    // Check if email already taken
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password (12 rounds = good balance of security vs speed)
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user (habits will be created during onboarding)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: { id: true, email: true, name: true },
    })

    return NextResponse.json({ data: user }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    console.error("[REGISTER_ERROR]", err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
