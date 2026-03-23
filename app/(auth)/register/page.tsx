// app/(auth)/register/page.tsx  →  route: /register
// ─────────────────────────────────────────────────────────────────────────────
// REGISTER PAGE — Create account with name, email, password
// ─────────────────────────────────────────────────────────────────────────────

"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-hot-toast"
import { Zap, Clock, CheckCircle2, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { API_ROUTES } from "@/lib/constants/api-routes"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

const features = [
  {
    icon: Clock,
    title: "Daily streaks that motivate",
    desc: "Visual progress keeps you coming back",
  },
  {
    icon: CheckCircle2,
    title: "Swipe to log habits instantly",
    desc: "Zero friction — built for busy days",
  },
  {
    icon: TrendingUp,
    title: "Insights that show what works",
    desc: "Patterns surface after just one week",
  },
]

const avatars = [
  { initials: "AJ", color: "#6D64E8" },
  { initials: "MK", color: "#EC4899" },
  { initials: "RS", color: "#10B981" },
  { initials: "PL", color: "#F59E0B" },
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<0 | 1>(0) // 0: Details, 1: OTP
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [timer, setTimer] = useState(90)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  // ─── Step 1: Request OTP ───────────────────────────────────────────────────
  async function onSubmit(data: RegisterFormData) {
    setServerError(null)
    const res = await fetch(API_ROUTES.AUTH.REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    })
    const json = await res.json()

    if (!res.ok) {
      setServerError(json.error)
      return
    }

    // Success -> Move to OTP step
    setEmail(data.email)
    setPassword(data.password)
    setStep(1)
    setTimer(90)
    toast.success("Verification code sent!")
  }

  // ─── Step 2: Verify OTP ────────────────────────────────────────────────────
  async function handleVerifyOtp() {
    if (otpCode.length !== 6) {
      setServerError("Please enter a 6-digit code")
      return
    }

    setIsVerifying(true)
    setServerError(null)

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode }),
      })
      const json = await res.json()

      if (!res.ok) {
        setServerError(json.error)
        return
      }

      // Success -> Sign in
      toast.success("Email verified!")
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setServerError("Verification successful. Please sign in manually.")
        router.push("/login")
      } else {
        router.push("/onboarding")
      }
    } catch (err) {
      setServerError("Something went wrong during verification")
    } finally {
      setIsVerifying(false)
    }
  }

  // ─── Timer Logic ───────────────────────────────────────────────────────────
  useState(() => {
    let interval: any
    if (step === 1 && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => (t > 0 ? t - 1 : 0))
      }, 1000)
    }
    return () => clearInterval(interval)
  })

  async function handleResend() {
    setServerError(null)
    setOtpCode("")
    const res = await fetch(API_ROUTES.AUTH.REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: email.split("@")[0], email, password }),
    })
    if (res.ok) {
      setTimer(90)
      toast.success("New code sent!")
    } else {
      const json = await res.json()
      setServerError(json.error || "Failed to resend code")
    }
  }

  async function handleGoogle() {
    setIsGoogleLoading(true)
    await signIn("google", { callbackUrl: "/onboarding" })
  }

  return (
    <div className="min-h-screen flex font-sans bg-white">

      {/* ── Left Panel ────────────────────────────────────────────────────── */}
      <div className="flex flex-col justify-center w-full lg:max-w-[560px] px-10 py-8 relative z-10 overflow-y-auto">
        <motion.div
          className="w-full max-w-[400px] mx-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h1
                  className="text-[2rem] font-bold leading-tight tracking-tight text-gray-900 mb-2"
                  style={{ fontFamily: "var(--font-dm-serif)" }}
                >
                  Build habits that <span className="italic text-indigo-600">actually stick.</span>
                </h1>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                  Join thousands building routines that last — one day at a time.
                </p>

                <div className="space-y-5">
                  <Button
                    variant="secondary" size="lg"
                    className="w-full h-11 border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2.5 rounded-xl font-medium text-sm text-gray-700 shadow-none"
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

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">or register</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="Full name" type="text" placeholder="Alex Johnson" error={errors.name?.message} className="h-11 text-black bg-white" {...register("name")} />
                      <Input label="Email" type="email" placeholder="you@domain.com" error={errors.email?.message} className="h-11 text-black bg-white" {...register("email")} />
                    </div>
                    <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} hint="At least 8 characters" className="h-11 text-black bg-white" {...register("password")}  />
                    <Input label="Confirm password" type="password" placeholder="••••••••" error={errors.confirmPassword?.message} className="h-11 text-black bg-white" {...register("confirmPassword")} />
                    
                    {serverError && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl border border-red-100">{serverError}</p>}
                    
                    <Button type="submit" variant="default" size="lg" disabled={isSubmitting} className="w-full h-11 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm tracking-tight active:scale-[0.99]">
                      {isSubmitting ? "Sending code…" : "Register & Send OTP →"}
                    </Button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1
                  className="text-[2rem] font-bold leading-tight tracking-tight text-gray-900 mb-2"
                  style={{ fontFamily: "var(--font-dm-serif)" }}
                >
                  Verify your <span className="italic text-indigo-600">email.</span>
                </h1>
                <p className="text-sm text-gray-500 mb-8">
                  We sent a 6-digit code to <span className="font-semibold text-gray-900">{email}</span>.
                </p>

                <div className="space-y-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Enter OTP</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="000000"
                      className="h-14 w-full text-center text-3xl font-bold tracking-[0.5em] border-2 border-gray-100 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-100"
                    />
                  </div>

                  {serverError && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl border border-red-100">{serverError}</p>}

                  <Button
                    onClick={handleVerifyOtp}
                    variant="default" size="lg"
                    disabled={isVerifying || otpCode.length < 6}
                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm tracking-tight shadow-lg shadow-indigo-100"
                  >
                    {isVerifying ? "Verifying..." : "Verify & Sign In →"}
                  </Button>

                  <div className="flex flex-col items-center gap-3 pt-2">
                    <div className="text-xs text-gray-400 flex items-center gap-1.5">
                      <Clock size={12} />
                      {timer > 0 ? (
                        <span>Resend in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</span>
                      ) : (
                        <span>Code expired</span>
                      )}
                    </div>
                    <button
                      onClick={handleResend}
                      disabled={timer > 0}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Resend code
                    </button>
                    <button
                      onClick={() => setStep(0)}
                      className="text-xs text-gray-400 hover:text-gray-600 mt-2"
                    >
                      ← Use a different email
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-sm text-gray-500 pt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-semibold hover:underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* ── Right Panel ────────────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-1 relative bg-[#F4F2FF] items-center justify-start px-16 py-12 overflow-hidden border-l border-indigo-100">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-indigo-200/20 -top-24 -right-24 pointer-events-none" />
        <div className="absolute w-[200px] h-[200px] rounded-full bg-indigo-200/20 bottom-10 right-10 pointer-events-none" />

        <motion.div
          className="relative z-10 w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-5 h-px bg-indigo-500" />
            <span className="text-[11px] font-semibold text-indigo-500 uppercase tracking-widest">Why Momentum</span>
          </div>

          <h2
            className="text-[2.5rem] leading-[1.2] tracking-tight text-indigo-950 mb-10"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Every great routine<br /> starts with <span className="italic text-indigo-500">one decision.</span>
          </h2>

          <div className="flex flex-col gap-6 mb-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-9 h-9 flex-shrink-0 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Icon className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-indigo-950 mb-0.5">{title}</p>
                  <p className="text-[13px] text-indigo-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex">
              {avatars.map(({ initials, color }, i) => (
                <div
                  key={initials}
                  className="w-8 h-8 rounded-full border-2 border-[#F4F2FF] flex items-center justify-center text-[11px] font-semibold text-white"
                  style={{ background: color, marginLeft: i === 0 ? 0 : -8 }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <span className="text-[13px] font-medium text-indigo-500">12,000+ building habits today</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}