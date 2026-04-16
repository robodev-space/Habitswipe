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
import { Zap, Sparkles, ShieldCheck, Flame } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { API_ROUTES } from "@/lib/constants/api-routes"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})
type LoginFormData = z.infer<typeof loginSchema>

const stats = [
  { icon: Flame, value: "12K+", label: "Active users" },
  { icon: Sparkles, value: "94%", label: "Habit retention" },
  { icon: ShieldCheck, value: "4.9★", label: "App store rating" },
]

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
    <div className="min-h-screen flex font-sans bg-white">

      {/* ── Left Panel (Auth Form) ────────────────────────────────────────── */}
      <div className="flex flex-col justify-center w-full lg:max-w-[560px] px-10 py-14 relative z-10 overflow-y-auto">
        <motion.div
          className="w-full max-w-[400px] mx-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
          </div>

          <h1
            className="text-[2rem] font-bold leading-tight tracking-tight text-gray-900 mb-2"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Welcome back —{" "}
            <span className="italic text-indigo-600">keep going.</span>
          </h1>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            Continue your journey. Build your discipline.
          </p>

          <div className="space-y-5">
            {/* Google */}
            <Button
              variant="outline"
              size="lg"
              className="w-full h-11 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2.5 rounded-xl font-medium text-sm text-gray-800 shadow-sm hover:shadow"
              onClick={handleGoogle}
              disabled={isGoogleLoading}
            >
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">or sign in</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              <Input
                label="Email"
                type="email"
                placeholder="name@domain.com"
                error={errors.email?.message}
                className="h-11 bg-gray-50 border-gray-200 text-gray-600 placeholder:text-gray-400 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all rounded-xl"
                {...register("email")}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                className="h-11 bg-gray-50 border-gray-200 text-gray-600 placeholder:text-gray-400 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all rounded-xl"
                {...register("password")}
              />

              {serverError && (
                <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-xl border border-red-100">
                  {serverError}
                </p>
              )}

              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={isSubmitting}
                className="w-full h-11 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm tracking-tight transition-colors active:scale-[0.99]"
              >
                {isSubmitting ? "Signing in…" : "Sign in →"}
              </Button>
            </form>

            <p className="text-sm text-gray-400 pt-1">
              New here?{" "}
              <Link href="/register" className="text-indigo-600 font-semibold hover:underline underline-offset-2">
                Create an account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Right Panel (Branding) ────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-1 relative bg-[#F4F2FF] items-center justify-start px-16 py-20 overflow-hidden border-l border-indigo-100">

        {/* Decorative circles */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-indigo-200/20 -top-24 -right-24 pointer-events-none" />
        <div className="absolute w-[200px] h-[200px] rounded-full bg-indigo-200/20 bottom-10 right-10 pointer-events-none" />

        <motion.div
          className="relative z-10 w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-5 h-px bg-indigo-500" />
            <span className="text-[11px] font-semibold text-indigo-500 uppercase tracking-widest">
              Your progress awaits
            </span>
          </div>

          <h2
            className="text-[2.5rem] leading-[1.2] tracking-tight text-indigo-950 mb-6"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Small steps,<br />
            <span className="italic text-indigo-500">compounding results.</span>
          </h2>

          <p className="text-[15px] text-indigo-400 leading-relaxed mb-12 max-w-sm">
            Every check-in counts. Your streaks, insights, and habits are right where you left them.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="bg-white/70 rounded-2xl px-4 py-5 flex flex-col items-start gap-2 border border-indigo-100"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-indigo-500" />
                </div>
                <p className="text-xl font-bold text-indigo-900 leading-none">{value}</p>
                <p className="text-[11px] text-indigo-400 font-medium leading-tight">{label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-white/60 border border-indigo-100 rounded-2xl px-5 py-4">
            <p className="text-[13px] text-indigo-700 leading-relaxed mb-3">
              "I've tried every habit app out there. Momentum is the only one that made me actually show up every day."
            </p>
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0"
                style={{ background: "#6D64E8" }}
              >
                SR
              </div>
              <div>
                <p className="text-[12px] font-semibold text-indigo-900 leading-none">Sara R.</p>
                <p className="text-[11px] text-indigo-400">143-day streak</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}