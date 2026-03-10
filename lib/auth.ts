// lib/auth.ts
// ─────────────────────────────────────────────────────────────────────────────
// NEXTAUTH CONFIG
// Supports: Email/Password (Credentials) + Google OAuth
// ─────────────────────────────────────────────────────────────────────────────

import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  // PrismaAdapter stores sessions & accounts in DB
  adapter: PrismaAdapter(prisma) as any,

  providers: [
    // ── Google OAuth ─────────────────────────────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ── Email + Password ──────────────────────────────────────────────────────
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw new Error("No account found with this email")
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) {
          throw new Error("Incorrect password")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],

  session: {
    strategy: "jwt", // JWT is required when using CredentialsProvider
  },

  callbacks: {
    // Add user ID to the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },

    // Add user ID to the session object (accessible in components)
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },

  pages: {
    signIn: "/login",        // custom login page
    error: "/login",         // redirect errors to login
    newUser: "/habits",      // after first sign-in, go to habits
  },
}

// ── Type augmentation — add `id` to Session ───────────────────────────────────
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
