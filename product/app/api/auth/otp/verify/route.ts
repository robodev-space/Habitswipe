// app/api/auth/otp/verify/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/otp/verify — Verify OTP and create user account
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "OTP must be 6 digits"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, code } = verifySchema.parse(body)

    // 1. Find the OTP record
    const otpRecord = await prisma.otp.findUnique({
      where: { email },
    })

    if (!otpRecord) {
      return NextResponse.json(
        { error: "No verification code found for this email. Please register again." },
        { status: 404 }
      )
    }

    // 2. Check if code matches
    if (otpRecord.code !== code) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      )
    }

    // 3. Check if expired
    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json(
        { error: "Verification code has expired (90s limit). Please resend." },
        { status: 410 }
      )
    }

    // 4. Verification successful -> Create the actual User
    // We use a transaction to ensure user is created and OTP is deleted
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: otpRecord.email,
          name: otpRecord.name,
          password: otpRecord.password,
          emailVerified: new Date(), // Mark as verified
        },
      })

      // Delete the OTP record
      await tx.otp.delete({
        where: { id: otpRecord.id },
      })

      return newUser
    })

    return NextResponse.json({
      message: "Email verified successfully!",
      user: { id: user.id, email: user.email, name: user.name }
    }, { status: 201 })

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    console.error("[VERIFY_OTP_ERROR]", err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
