// lib/services/email.service.ts
// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE EMAIL SERVICE — HabitSwipe
// Handles sending OTPs, reminders, and system notifications.
// ─────────────────────────────────────────────────────────────────────────────

import nodemailer from "nodemailer"

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    // Config via env vars. Falls back to a mock transporter if not provided.
    const h = process.env.SMTP_HOST
    const p = Number(process.env.SMTP_PORT) || 587
    const u = process.env.SMTP_USER
    const s = process.env.SMTP_PASS

    if (h && u && s) {
      this.transporter = nodemailer.createTransport({
        host: h,
        port: p,
        secure: p === 465,
        auth: { user: u, pass: s },
      })
    } else {
      // Mock transporter for development/demonstration
      this.transporter = nodemailer.createTransport({
        jsonTransport: true, // This will log the email JSON to console if needed
      } as any)
      console.warn("⚠️ SMTP credentials missing. EmailService is running in MOCK mode.")
    }
  }

  /**
   * Core send method
   */
  async sendEmail({ to, subject, html }: SendEmailOptions) {
    try {
      const info = await this.transporter.sendMail({
        from: `"HabitSwipe" <${process.env.SMTP_USER || "no-reply@habitswipe.com"}>`,
        to,
        subject,
        html,
      })

      if (process.env.NODE_ENV !== 'production') {
        console.log(`📧 Email sent to ${to}: ${subject}`)
        // If mock, we can see the content in the response
        if (info.message) console.log("Email content:", info.message)
      }

      return { success: true, messageId: info.messageId }
    } catch (error) {
      console.error("❌ Email send error:", error)
      return { success: false, error }
    }
  }

  /**
   * Template: OTP Verification
   */
  async sendOtpEmail(to: string, code: string, name?: string) {
    const html = `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; color: #1e1e1e; line-height: 1.6;">
        <div style="padding: 24px; background: #6366f1; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">HabitSwipe</h1>
        </div>
        <div style="padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px;">
          <h2 style="margin-top: 0; font-size: 20px;">Verify your sign-up</h2>
          <p>Hi ${name || 'there'},</p>
          <p>Welcome to HabitSwipe! Use the code below to complete your registration. This code expires in <b>90 seconds</b>.</p>
          
          <div style="background: #f8fafc; padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #6366f1;">${code}</span>
          </div>
          
          <p style="font-size: 13px; color: #64748b;">If you didn't request this code, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            &copy; 2026 HabitSwipe · Build Better Habits
          </p>
        </div>
      </div>
    `
    return this.sendEmail({ to, subject: `${code} is your HabitSwipe verification code`, html })
  }

  /**
   * Template: Reminder
   */
  async sendReminderEmail(to: string, habitName: string) {
    const html = `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; line-height: 1.6;">
        <h2>Don't forget: ${habitName}</h2>
        <p>Keep your streak alive! One quick swipe makes all the difference.</p>
        <a href="${process.env.NEXTAUTH_URL}/today" style="background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">Log it now</a>
      </div>
    `
    return this.sendEmail({ to, subject: `Reminder: ${habitName}`, html })
  }

  /**
   * Template: Password Reset
   */
  async sendResetPasswordEmail(to: string, resetLink: string) {
    const html = `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; line-height: 1.6;">
        <h2>Reset your password</h2>
        <p>Click the button below to set a new password for your HabitSwipe account.</p>
        <a href="${resetLink}" style="background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">Reset Password</a>
        <p style="font-size: 12px; color: #64748b; margin-top: 20px;">If you didn't request this, ignore this email.</p>
      </div>
    `
    return this.sendEmail({ to, subject: `Reset your HabitSwipe password`, html })
  }
}

export const emailService = new EmailService()
