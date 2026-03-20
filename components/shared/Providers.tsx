// components/shared/Providers.tsx
// ─────────────────────────────────────────────────────────────────────────────
// CLIENT PROVIDERS — Must be "use client" because they use React context
// Wraps the whole app so every page gets auth + theme.
// ─────────────────────────────────────────────────────────────────────────────

'use client'
import { useState, useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a full-screen placeholder that matches the layout dimensions
    // so there's no layout shift when the real content appears
    return (
      <div
        style={{ minHeight: '100vh', background: 'var(--bg, #f8fafc)' }}
        aria-hidden='true'
      />
    )
  }

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute='class' // toggles "dark" class on <html>
        defaultTheme='system' // respect OS preference
        enableSystem
        disableTransitionOnChange // prevent flash on theme switch
      >
        <ClientOnly>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              className: 'dark:bg-[#1e1c3a] dark:text-white',
              duration: 3000,
            }}
          />
        </ClientOnly>
      </ThemeProvider>
    </SessionProvider>
  )
}
