// app/(auth)/register/page.tsx  →  route: /register
// ─────────────────────────────────────────────────────────────────────────────
// REGISTER PAGE — Create account with name, email, password + OTP verification
// ─────────────────────────────────────────────────────────────────────────────

"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-hot-toast"
import { Clock, CheckCircle2, TrendingUp, Mail } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { API_ROUTES } from "@/lib/constants/api-routes"
import { cn } from "@/lib/utils"

// ── Schema ────────────────────────────────────────────────────────────────────
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})
type RegisterFormData = z.infer<typeof registerSchema>

// ── Static data ───────────────────────────────────────────────────────────────
const features = [
  { icon: Clock, title: "Daily streaks that motivate", desc: "Visual progress keeps you coming back" },
  { icon: CheckCircle2, title: "Swipe to log habits instantly", desc: "Zero friction — built for busy days" },
  { icon: TrendingUp, title: "Insights that show what works", desc: "Patterns surface after just one week" },
]
const avatars = [
  { initials: "AJ", color: "#6D64E8" },
  { initials: "MK", color: "#EC4899" },
  { initials: "RS", color: "#10B981" },
  { initials: "PL", color: "#F59E0B" },
]

const OTP_LENGTH = 6
const TIMER_START = 90  // seconds

// ── OTP Input Component ────────────────────────────────────────────────────
function OtpInput({
  value,
  onChange,
  hasError,
}: {
  value: string
  onChange: (v: string) => void
  hasError: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)

  const digits = value.split("").concat(Array(OTP_LENGTH - value.length).fill("")).slice(0, OTP_LENGTH)
  const focusIdx = Math.min(value.length, OTP_LENGTH - 1)
  const allFilled = value.length === OTP_LENGTH

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Invisible real input */}
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={OTP_LENGTH}
        value={value}
        onChange={e => onChange(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="absolute opacity-0 pointer-events-none w-px h-px"
        aria-label="Enter verification code"
      />

      {/* Visual digit boxes */}
      <div
        className="flex items-center gap-2.5 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {digits.map((d, i) => {
          const isFocus = focused && i === focusIdx && !allFilled
          const isFilled = !!d
          const isActive = isFocus || (allFilled && i === OTP_LENGTH - 1 && focused)

          return (
            <motion.div
              key={i}
              animate={isFilled ? { scale: [1, 1.12, 1] } : {}}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={cn(
                "relative w-[52px] h-[60px] flex items-center justify-center",
                "rounded-[14px] border-2 transition-all duration-150 select-none",
                hasError
                  ? "border-red-400 bg-red-50"
                  : isActive
                    ? "border-indigo-500 bg-white shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
                    : isFilled
                      ? "border-indigo-400 bg-indigo-50"
                      : "border-gray-200 bg-gray-50"
              )}
            >
              {/* Blinking cursor */}
              {isFocus && !isFilled && (
                <div className="w-[2px] h-7 bg-indigo-600 rounded-full animate-[blink_1s_ease-in-out_infinite]" />
              )}

              {/* Digit */}
              {isFilled && (
                <span className={cn(
                  "text-2xl font-bold tracking-tight",
                  hasError ? "text-red-500" : "text-indigo-600"
                )}>
                  {d}
                </span>
              )}

              {/* Separator dot between 3rd and 4th */}
              {i === 2 && (
                <div className="absolute -right-4 w-1.5 h-1.5 rounded-full bg-gray-300" />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mt-1">
        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: digits[i] ? 1.3 : 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors duration-200",
              digits[i] ? "bg-indigo-500" : "bg-gray-200"
            )}
          />
        ))}
      </div>
    </div>
  )
}

// ── Circular timer ─────────────────────────────────────────────────────────
function CircularTimer({ seconds, total }: { seconds: number; total: number }) {
  const r = 18
  const circ = 2 * Math.PI * r
  const offset = circ - (circ * seconds) / total
  const expired = seconds <= 0
  const color = expired ? "#ef4444" : seconds < 20 ? "#f97316" : "#5b50e8"

  const m = Math.floor(seconds / 60)
  const s = String(Math.max(0, seconds % 60)).padStart(2, "0")

  return (
    <div className="relative w-11 h-11">
      <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="22" cy="22" r={r} fill="none" stroke="#f0eef8" strokeWidth="3" />
        <circle
          cx="22" cy="22" r={r} fill="none"
          stroke={color} strokeWidth="3"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s linear, stroke .3s" }}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
        style={{ color }}
      >
        {m}:{s}
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter()

  // step state
  const [step, setStep] = useState<0 | 1>(0)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otpValue, setOtpValue] = useState("")
  const [timer, setTimer] = useState(TIMER_START)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  // start/restart timer
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setTimer(TIMER_START)
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current!); return 0 }
        return t - 1
      })
    }, 1000)
  }, [])

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  // hint text
  const otpFilled = otpValue.length
  const otpHint = verified
    ? "Email verified successfully!"
    : otpFilled === 0 ? "Type or paste your code"
      : otpFilled < 6 ? `${6 - otpFilled} digit${6 - otpFilled !== 1 ? "s" : ""} remaining`
        : "Tap verify to continue"

  // Step 1 — send OTP
  async function onSubmit(data: RegisterFormData) {
    setServerError(null)
    const res = await fetch(API_ROUTES.AUTH.REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
    })
    const json = await res.json()
    if (!res.ok) { setServerError(json.error); return }
    setEmail(data.email)
    setPassword(data.password)
    setStep(1)
    startTimer()
    toast.success("Verification code sent!")
  }

  // Step 2 — verify OTP
  async function handleVerifyOtp() {
    if (otpValue.length !== OTP_LENGTH) { setServerError("Please enter all 6 digits"); return }
    setIsVerifying(true)
    setServerError(null)
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpValue }),
      })
      const json = await res.json()
      if (!res.ok) { setServerError(json.error); return }

      setVerified(true)
      toast.success("Email verified!")

      const result = await signIn("credentials", { email, password, redirect: false })
      if (result?.error) { router.push("/login") }
      else { router.push("/onboarding") }
    } catch {
      setServerError("Something went wrong. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  // Resend
  async function handleResend() {
    setServerError(null)
    setOtpValue("")
    const res = await fetch(API_ROUTES.AUTH.REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: email.split("@")[0], email, password }),
    })
    if (res.ok) { startTimer(); toast.success("New code sent!") }
    else {
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

      {/* ── Left panel ──────────────────────────────────────────────────── */}
      <div className="flex flex-col justify-center w-full lg:max-w-[560px] px-10 py-8 relative z-10 overflow-y-auto">
        <motion.div
          className="w-full max-w-[400px] mx-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <Image
              src="/favicon.ico"
              alt="HabitClick logo"
              width={32}
              height={32}
              className="rounded-lg shadow-sm"
              priority
            />
          </div>

          <AnimatePresence mode="wait">

            {/* ── STEP 0: Registration form ── */}
            {step === 0 && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h1
                  className="text-[2rem] font-bold leading-tight tracking-tight text-gray-900 mb-2"
                  style={{ fontFamily: "var(--font-dm-serif)" }}
                >
                  Build habits that{" "}
                  <span className="italic text-indigo-600">actually stick.</span>
                </h1>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                  Join thousands building routines that last — one day at a time.
                </p>

                <div className="space-y-5">
                  <Button
                    variant="ghost" size="lg"
                    className="w-full h-11 !bg-white border !border-gray-300 hover:!border-gray-400 hover:!bg-gray-50 flex items-center justify-center gap-2.5 rounded-xl font-medium text-sm !text-gray-800 shadow-sm hover:shadow transition-all"
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
                      <Input label="Full name" type="text" placeholder="Alex Johnson"
                        error={errors.name?.message} className="h-11 text-gray-600 bg-gray-50"
                        {...register("name")} />
                      <Input label="Email" type="email" placeholder="you@domain.com"
                        error={errors.email?.message} className="h-11 text-gray-600 bg-gray-50"
                        {...register("email")} />
                    </div>
                    <Input label="Password" type="password" placeholder="••••••••"
                      error={errors.password?.message} hint="At least 8 characters"
                      className="h-11 text-gray-600 bg-gray-50" {...register("password")} />
                    <Input label="Confirm password" type="password" placeholder="••••••••"
                      error={errors.confirmPassword?.message}
                      className="h-11 text-gray-600 bg-gray-50" {...register("confirmPassword")} />

                    {serverError && (
                      <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl border border-red-100">
                        {serverError}
                      </p>
                    )}

                    <Button type="submit" variant="default" size="lg" disabled={isSubmitting}
                      className="w-full h-11 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm tracking-tight active:scale-[0.99]">
                      {isSubmitting ? "Sending code…" : "Create account →"}
                    </Button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* ── STEP 1: OTP Verification ── */}
            {step === 1 && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Email icon */}
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-5">
                  <Mail className="w-6 h-6 text-indigo-600" />
                </div>

                {/* Step indicator */}
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-1.5">
                  Step 2 of 2
                </p>

                <h1
                  className="text-[2rem] font-bold leading-tight tracking-tight text-gray-900 mb-2"
                  style={{ fontFamily: "var(--font-dm-serif)" }}
                >
                  Verify your{" "}
                  <span className="italic text-indigo-600">email.</span>
                </h1>
                <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                  We sent a 6-digit code to{" "}
                  <span className="font-semibold text-gray-700">{email}</span>.
                  <br />Check your inbox.
                </p>

                <div className="space-y-5">

                  {/* OTP Input */}
                  <OtpInput
                    value={otpValue}
                    onChange={setOtpValue}
                    hasError={!!serverError}
                  />

                  {/* Hint text */}
                  <p className={cn(
                    "text-center text-[11.5px] font-medium transition-colors",
                    serverError ? "text-red-400"
                      : verified ? "text-emerald-500"
                        : otpFilled === OTP_LENGTH ? "text-indigo-500"
                          : "text-gray-400"
                  )}>
                    {serverError || otpHint}
                  </p>

                  {/* Verify button */}
                  <motion.button
                    onClick={handleVerifyOtp}
                    disabled={isVerifying || otpValue.length < OTP_LENGTH || verified}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "relative w-full h-12 rounded-xl text-white text-[13.5px] font-semibold",
                      "overflow-hidden transition-all duration-300",
                      "disabled:cursor-not-allowed",
                      verified
                        ? "bg-emerald-500"
                        : otpValue.length < OTP_LENGTH
                          ? "bg-indigo-200"
                          : "bg-indigo-600 hover:bg-indigo-700"
                    )}
                  >
                    {/* Shine */}
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full hover:translate-x-full transition-transform duration-700" />
                    <span className="relative">
                      {verified ? "✓ Verified! Signing in…"
                        : isVerifying ? "Verifying…"
                          : otpValue.length < OTP_LENGTH
                            ? `${otpValue.length}/${OTP_LENGTH} digits entered`
                            : "Verify & sign in →"}
                    </span>
                  </motion.button>

                  {/* Timer + resend */}
                  <div className="flex flex-col items-center gap-3 pt-1">
                    <CircularTimer seconds={timer} total={TIMER_START} />

                    <p className={cn(
                      "text-[11.5px] font-medium transition-colors",
                      timer <= 0 ? "text-red-400"
                        : timer < 20 ? "text-orange-400"
                          : "text-gray-400"
                    )}>
                      {timer > 0
                        ? `Code expires in ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}`
                        : "Code expired — request a new one"}
                    </p>

                    <button
                      onClick={handleResend}
                      // disabled={timer > 0}
                      className="text-[12.5px] font-semibold text-indigo-600 hover:text-indigo-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50 disabled:hover:bg-transparent"
                    >
                      Resend code
                    </button>

                    <button
                      onClick={() => { setStep(0); setOtpValue(""); setServerError(null) }}
                      className="text-[11.5px] text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-gray-50"
                    >
                      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 4L6 8l4 4" /></svg>
                      Use a different email
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

      {/* ── Right panel (unchanged) ──────────────────────────────────── */}
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
            Every great routine<br />
            starts with{" "}
            <span className="italic text-indigo-500">one decision.</span>
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