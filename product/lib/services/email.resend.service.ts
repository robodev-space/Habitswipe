// lib/services/email.service.ts

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

class EmailService {
    async sendEmail(to: string, subject: string, html: string) {
        try {
            const res = await resend.emails.send({
                from: process.env.EMAIL_FROM!,
                to,
                subject,
                html,
            })

            if (process.env.NODE_ENV !== "production") {
                console.log("📧 Email sent:", res)
            }

            return { success: true }
        } catch (error) {
            console.error("❌ Email error:", error)
            return { success: false, error }
        }
    }

    async sendOtpEmail(to: string, code: string, name?: string) {
        const html = `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; color: #1e1e1e; line-height: 1.6;">
        <div style="padding: 24px; background: #6366f1; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">HabitClick</h1>
        </div>
        <div style="padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px;">
          <h2 style="margin-top: 0; font-size: 20px;">Verify your sign-up</h2>
          <p>Hi ${name || 'there'},</p>
          <p>Welcome to HabitClick! Use the code below to complete your registration. This code expires in <b>90 seconds</b>.</p>
          
          <div style="background: #f8fafc; padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #6366f1;">${code}</span>
          </div>
          
          <p style="font-size: 13px; color: #64748b;">If you didn't request this code, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            &copy; 2026 HabitClick · Build Better Habits
          </p>
        </div>
      </div>
    `

        return this.sendEmail(
            to,
            `${code} is your verification code`,
            html
        )
    }
}

export const emailService = new EmailService()