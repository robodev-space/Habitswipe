// app/(dashboard)/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD LAYOUT — Wraps all protected pages
// ─────────────────────────────────────────────────────────────────────────────

import { Navigation } from "@/components/shared/Navigation"
import "./dashboard.css"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="shell">
        <Navigation />
        <main className="main">
          {children}
        </main>
      </div>
    </>
  )
}
