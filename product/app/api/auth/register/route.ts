// app/api/auth/register/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register — Initiate registration by sending OTP
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import crypto from "crypto"
import { prisma } from "@/lib/prisma"
// import { emailService } from "@/lib/services/email.service"
import { emailService } from "@/lib/services/email.resend.service"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = registerSchema.parse(body)

    // 1. Check if email already taken in User table
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    // 2. Hash password (we store it in Otp table until verified)
    const hashedPassword = await bcrypt.hash(password, 12)

    // 3. Generate 6-digit OTP
    const code = crypto.randomInt(100000, 999999).toString()

    // 4. Set expiry (90 seconds = 1.5 minutes)
    const expiresAt = new Date(Date.now() + 90 * 1000)

    // 5. Save to Otp table (upsert will overwrite previous OTP for this email)
    await prisma.otp.upsert({
      where: { email },
      update: { code, name, password: hashedPassword, expiresAt, createdAt: new Date() },
      create: { email, code, name, password: hashedPassword, expiresAt },
    })

    // 6. Send Email
    const emailRes = await emailService.sendOtpEmail(email, code, name)

    if (!emailRes.success) {
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "OTP sent to your email. It expires in 90 seconds.",
      email
    }, { status: 200 })

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    console.error("[REGISTER_ERROR]", err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

