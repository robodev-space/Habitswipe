// app/(auth)/login/page.tsx  →  route: /login
// ─────────────────────────────────────────────────────────────────────────────
// LOGIN PAGE — Email/password + Google OAuth
// ─────────────────────────────────────────────────────────────────────────────

"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { motion } from "framer-motion"
import { Zap, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { API_ROUTES } from "@/lib/constants/api-routes"
import Image from "next/image"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})
type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginFormData) {
    setServerError(null)
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      setServerError(result.error)
    } else {
      router.push("/today")
      router.refresh()
    }
  }

  async function handleGoogle() {
    setIsGoogleLoading(true)
    await signIn("google", { callbackUrl: "/today" })
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row overflow-hidden">
      {/* ── Left Panel (Auth Form) ────────────────────────────────────────── */}
      <div className="flex-1 lg:mb-20 flex items-center justify-center p-8 relative z-10 lg:w-1/2">
        <motion.div
          className="w-full max-w-[400px]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo (Todoist style: small & clean) */}
          <div className="mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
          </div>

          <h1
            className="text-3xl font-bold text-fore mb-2"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Welcome back
          </h1>
          <p className="text-fore-2 text-sm mb-8">
            Continue your journey. Build your discipline.
          </p>

          <div className="space-y-6">
            {/* Google */}
            <Button
              variant="secondary"
              size="lg"
              className="w-full h-11 border border-theme hover:bg-surface-2 transition-all flex items-center justify-center gap-3"
              onClick={handleGoogle}
              isLoading={isGoogleLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border/60" />
              <span className="text-[10px] uppercase tracking-widest text-fore-3 font-bold">Email</span>
              <div className="flex-1 h-px bg-border/60" />
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <Input
                label="Email"
                type="email"
                placeholder="Name@domain.com"
                error={errors.email?.message}
                className="h-11 shadow-sm"
                {...register("email")}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                className="h-11 shadow-sm"
                {...register("password")}
              />

              {serverError && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-xl border border-red-100 dark:border-red-900/50">
                  {serverError}
                </p>
              )}

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full h-11 mt-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform"
                isLoading={isSubmitting}
              >
                Sign In
              </Button>
            </form>

            <p className="text-sm text-fore-2 pt-4">
              New here?{" "}
              <Link href="/register" className="text-indigo-500 font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Right Panel (Branding) ──────────────────────────────────────────担*/}
      <div className="hidden lg:flex flex-1 relative bg-[#fcfaf8] items-center justify-center p-20 overflow-hidden border-l border-theme/50">
        {/* Abstract Background Layer */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,#de483a,transparent_70%)]" />

        <div className="relative z-10 w-full max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Image
              src="/login-purpose.png"
              alt="Build Habits"
              width={800}
              height={800}
              className="w-full h-auto rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 border border-white/20"
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
