// components/shared/Providers.tsx
// ─────────────────────────────────────────────────────────────────────────────
// CLIENT PROVIDERS — Must be "use client" because they use React context
// Wraps the whole app so every page gets auth + theme.
// ─────────────────────────────────────────────────────────────────────────────

"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"          // toggles "dark" class on <html>
        defaultTheme="system"      // respect OS preference
        enableSystem
        disableTransitionOnChange  // prevent flash on theme switch
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
