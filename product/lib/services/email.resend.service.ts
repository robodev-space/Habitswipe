// lib/services/email.resend.service.ts
// ─────────────────────────────────────────────────────────────────────────────
// EMAIL SERVICE — HabitClick (Powered by Resend)
// Handles OTP verification, habit reminders, and password reset emails.
//
// Setup:
//   RESEND_API_KEY=re_xxxxxxxxxxxx
//   EMAIL_FROM=HabitClick <noreply@yourdomain.com>
// ─────────────────────────────────────────────────────────────────────────────

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.EMAIL_FROM ?? "HabitClick <noreply@habitclick.100xfocus.com>"
const APP_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000"

interface SendResult {
  success: boolean
  error?: unknown
}

// ── Core send ────────────────────────────────────────────────────────────────

async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<SendResult> {
  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html })
    if (error) {
      console.error("❌ Resend error:", error)
      return { success: false, error }
    }
    if (process.env.NODE_ENV !== "production") {
      console.log(`📧 Email sent → ${to} | ${subject}`)
    }
    return { success: true }
  } catch (err) {
    console.error("❌ Email send failed:", err)
    return { success: false, error: err }
  }
}

// ── Shared template shell ─────────────────────────────────────────────────────

function shell(content: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>HabitClick</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#7c3aed);padding:28px 32px;text-align:center;">
              <span style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">HabitClick</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px 28px;text-align:center;border-top:1px solid #f1f5f9;">
              <p style="font-size:12px;color:#94a3b8;margin:0;">
                © 2026 HabitClick · Build Better Habits<br/>
                <a href="${APP_URL}" style="color:#6366f1;text-decoration:none;">habitclick.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

// ── Templates ─────────────────────────────────────────────────────────────────

class EmailService {
  // ── OTP Verification ──────────────────────────────────────────────────────
  async sendOtpEmail(to: string, code: string, name?: string): Promise<SendResult> {
    const html = shell(`
      <h2 style="margin:0 0 8px;font-size:20px;color:#0f172a;">Verify your email</h2>
      <p style="margin:0 0 24px;color:#64748b;font-size:15px;">
        Hi ${name ?? "there"}, welcome to HabitClick! Enter the code below to complete your registration.
        It expires in <strong>90 seconds</strong>.
      </p>

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:28px;text-align:center;margin-bottom:24px;">
        <span style="font-size:36px;font-weight:900;letter-spacing:10px;color:#6366f1;">${code}</span>
      </div>

      <p style="font-size:13px;color:#94a3b8;margin:0;">
        If you didn't create a HabitClick account, you can safely ignore this email.
      </p>
    `)
    return sendEmail(to, `${code} — Your HabitClick verification code`, html)
  }

  // ── Habit Reminder ────────────────────────────────────────────────────────
  async sendReminderEmail(
    to: string,
    habitName: string,
    streakCount?: number
  ): Promise<SendResult> {
    const streakLine = streakCount
      ? `<p style="font-size:13px;color:#6366f1;margin:4px 0 0;">🔥 You're on a <strong>${streakCount}-day streak</strong>. Don't break it!</p>`
      : ""

    const html = shell(`
      <h2 style="margin:0 0 8px;font-size:20px;color:#0f172a;">Time for your habit! 👋</h2>
      <p style="margin:0 0 4px;color:#64748b;font-size:15px;">
        Don't forget to log <strong>${habitName}</strong> today.
      </p>
      ${streakLine}

      <div style="margin:28px 0;">
        <a href="${APP_URL}/today"
           style="display:inline-block;background:linear-gradient(135deg,#6366f1,#7c3aed);color:#ffffff;
                  font-size:15px;font-weight:700;padding:14px 28px;border-radius:12px;
                  text-decoration:none;letter-spacing:-0.2px;">
          Log it now →
        </a>
      </div>

      <p style="font-size:13px;color:#94a3b8;margin:0;">
        One quick tap keeps your streak alive. You've got this.
      </p>
    `)
    return sendEmail(to, `⏰ Reminder: ${habitName}`, html)
  }

  // ── Password Reset ────────────────────────────────────────────────────────
  async sendResetPasswordEmail(to: string, resetLink: string): Promise<SendResult> {
    const html = shell(`
      <h2 style="margin:0 0 8px;font-size:20px;color:#0f172a;">Reset your password</h2>
      <p style="margin:0 0 24px;color:#64748b;font-size:15px;">
        We received a request to reset your HabitClick password. Click the button below — 
        this link expires in <strong>1 hour</strong>.
      </p>

      <div style="margin:28px 0;">
        <a href="${resetLink}"
           style="display:inline-block;background:linear-gradient(135deg,#6366f1,#7c3aed);color:#ffffff;
                  font-size:15px;font-weight:700;padding:14px 28px;border-radius:12px;
                  text-decoration:none;letter-spacing:-0.2px;">
          Reset Password →
        </a>
      </div>

      <p style="font-size:13px;color:#94a3b8;margin:0;">
        If you didn't request a password reset, you can safely ignore this email.
        Your password will not be changed.
      </p>
    `)
    return sendEmail(to, "Reset your HabitClick password", html)
  }

  // ── Welcome Email (after onboarding complete) ─────────────────────────────
  async sendWelcomeEmail(to: string, name: string): Promise<SendResult> {
    const html = shell(`
      <h2 style="margin:0 0 8px;font-size:20px;color:#0f172a;">You're all set, ${name}! 🎉</h2>
      <p style="margin:0 0 24px;color:#64748b;font-size:15px;">
        Welcome to HabitClick! Your first habit is waiting. Small actions today build
        the life you want tomorrow.
      </p>

      <div style="background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="margin:0;font-size:14px;color:#475569;line-height:1.7;">
          💡 <strong>Tip:</strong> Log your habit at the same time every day to build the best streak.
        </p>
      </div>

      <div style="margin:0 0 24px;">
        <a href="${APP_URL}/today"
           style="display:inline-block;background:linear-gradient(135deg,#6366f1,#7c3aed);color:#ffffff;
                  font-size:15px;font-weight:700;padding:14px 28px;border-radius:12px;
                  text-decoration:none;letter-spacing:-0.2px;">
          Start your first day →
        </a>
      </div>

      <p style="font-size:13px;color:#94a3b8;margin:0;">
        It takes 66 days to form a habit. We'll be with you every step of the way.
      </p>
    `)
    return sendEmail(to, `Welcome to HabitClick, ${name}! 🌿`, html)
  }
}

export const emailService = new EmailService()