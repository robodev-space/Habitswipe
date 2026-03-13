// app/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// ROOT LAYOUT — Wraps every page
// Sets up: fonts, ThemeProvider (dark/light), SessionProvider (NextAuth)
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next"
import { Outfit, DM_Serif_Display } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/shared/Providers"

// ── Fonts ────────────────────────────────────────────────────────────────────
// Outfit: clean, modern sans for body text and UI
// DM Serif Display: expressive, confident serif for headings
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: "HabitSwipe — Build Better Habits",
  description:
    "Track your daily habits with a satisfying swipe. Stay consistent, build streaks, and transform your life one habit at a time.",
  icons: { icon: "/favicon.ico" },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${dmSerif.variable} font-sans antialiased overflow-x-hidden min-h-screen relative`}>
        <div className="mesh-bg" />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
