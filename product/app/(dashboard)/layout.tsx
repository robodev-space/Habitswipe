// app/(dashboard)/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD LAYOUT — Wraps all protected pages
// ─────────────────────────────────────────────────────────────────────────────

import { Navigation } from "@/components/shared/Navigation"
import { TimezoneDetector } from "@/components/shared/TimezoneDetector"
import "./dashboard.css"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <TimezoneDetector />
      <div className="shell">
        <Navigation />
        <main className="main">
          {children}
        </main>
      </div>
    </>
  )
}
