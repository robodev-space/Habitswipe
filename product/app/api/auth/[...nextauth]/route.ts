// app/api/auth/[...nextauth]/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// NextAuth catch-all route
// Handles: /api/auth/signin, /api/auth/callback/google, /api/auth/signout etc.
// ─────────────────────────────────────────────────────────────────────────────

import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
export const dynamic = "force-dynamic"  

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
