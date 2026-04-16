import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import "./globals.css"

export const metadata: Metadata = {
  title: "100xFocus — Build Habits, Grow 100x Faster",
  description:
    "We build intelligent productivity apps for your lifestyle improvement. Use 100xFocus tools to stay consistent, build streaks, and grow 100x faster.",
  keywords: [
    "productivity apps",
    "lifestyle improvement",
    "100x growth",
    "self-improvement tools",
    "habit tracking",
    "focus app",
    "personal development",
  ],
  icons: { icon: "/favicon.ico" },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
