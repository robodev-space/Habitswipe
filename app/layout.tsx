// app/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// ROOT LAYOUT — Wraps every page
// Sets up: fonts, ThemeProvider (dark/light), SessionProvider (NextAuth)
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import "./globals.css"
import { Providers } from "@/components/shared/Providers"
import { cn } from "@/lib/utils";



// ── Fonts ────────────────────────────────────────────────────────────────────
// Inter: The same high-impact font used by BridgeMind
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" suppressHydrationWarning className={cn("font-sans", GeistSans.className)}>
      <body className={`${inter.variable} font-sans antialiased overflow-x-hidden min-h-screen relative`}>
        <div className="mesh-bg" />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
