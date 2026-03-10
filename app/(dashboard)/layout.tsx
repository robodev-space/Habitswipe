// app/(dashboard)/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD LAYOUT — Wraps all protected pages
// Redirects to /login if user is not authenticated (server-side check)
// ─────────────────────────────────────────────────────────────────────────────

import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Navigation } from "@/components/shared/Navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // If not logged in, redirect to login
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-app">
      <Navigation />
      <main className="flex-1 md:pl-0">
        {/* Add bottom padding on mobile for the bottom nav bar */}
        <div className="pb-20 md:pb-0 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}
