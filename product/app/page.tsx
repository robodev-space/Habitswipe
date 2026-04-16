import { Metadata } from "next"
import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { Footer } from "@/components/landing/Footer"
import { Pricing } from "@/components/landing/Pricing"
import {
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
  Trophy,
  BarChart3,
  Bell,
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "HabitSwipe — The Most Satisfying Habit Tracker",
  description:
    "Transform your life with a swipe. HabitSwipe makes habit building effortless with a unique swipe-based UI, deep analytics, and streak tracking.",
  keywords: [
    "habit tracker",
    "productivity app",
    "swipe habit",
    "streak tracking",
    "personal growth",
  ],
  openGraph: {
    title: "HabitSwipe — Build Better Habits Today",
    description:
      "The #1 habit tracker for focused individuals. Swipe right to win your day.",
    type: "website",
    url: "https://habitswipe.100xfocus.com",
  },
}

const features = [
  {
    title: "Satisfying Swipes",
    description:
      "Done or skipped? One gesture is all it takes. The most rewarding interaction in productivity.",
    icon: Zap,
    gradient: "from-blue-500/20 to-cyan-500/10",
    iconColor: "text-blue-400",
  },
  {
    title: "Visual Streaks",
    description:
      "Watch your progress grow with beautiful heatmaps and streak counters that keep you motivated.",
    icon: Trophy,
    gradient: "from-amber-500/20 to-orange-500/10",
    iconColor: "text-amber-400",
  },
  {
    title: "Deep Insights",
    description:
      "Understand your patterns with weekly reports and productivity charts.",
    icon: BarChart3,
    gradient: "from-emerald-500/20 to-green-500/10",
    iconColor: "text-emerald-400",
  },
  {
    title: "Smart Reminders",
    description:
      "Get nudged at the right time. Customize your notifications to fit your flow.",
    icon: Bell,
    gradient: "from-indigo-500/20 to-violet-500/10",
    iconColor: "text-indigo-400",
  },
  {
    title: "Cross-Platform",
    description:
      "Track on your phone, tablet or desktop. Your habits are always with you.",
    icon: CheckCircle2,
    gradient: "from-cyan-500/20 to-blue-500/10",
    iconColor: "text-cyan-400",
  },
  {
    title: "Privacy First",
    description:
      "Your data is yours. Secure, encrypted, and never sold. Focus on yourself.",
    icon: Sparkles,
    gradient: "from-purple-500/20 to-pink-500/10",
    iconColor: "text-purple-400",
  },
]

export default function ProductLandingPage() {
  return (
    <main className="font-sans min-h-screen bg-[#0a0a14] text-white selection:bg-indigo-500/30">
      <LandingNavbar />

      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Subtle ambient glow — softer than before */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-indigo-600/[0.07] blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[15%] w-[500px] h-[500px] bg-cyan-500/[0.05] blur-[140px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-indigo-300/80 bg-indigo-500/[0.08] border border-indigo-500/[0.12] mb-8 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5" />
            Voted #1 Habit Interface
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-[900] tracking-[-0.035em] mb-6 leading-[0.95]">
            <span className="text-white/95">Build Habits with</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              a Simple Swipe.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Stop checking boxes. Start swiping towards your goals. HabitSwipe
            combines game-like mechanics with powerful analytics to keep you
            consistent.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link href="/register">
              <button className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-zinc-900 font-bold text-base hover:bg-zinc-100 transition-all active:scale-[0.97] shadow-xl shadow-white/[0.08] flex items-center gap-2 justify-center">
                Start Building Today
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <Link href="#features">
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all text-base font-medium text-zinc-300">
                See How it Works
              </button>
            </Link>
          </div>

          {/* Product Preview — clean container for a demo video/screenshot */}
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-[16/9] rounded-2xl sm:rounded-3xl border border-white/[0.06] overflow-hidden shadow-2xl shadow-black/40 bg-zinc-900/50 backdrop-blur-sm">
              <div className="w-full h-full flex items-center justify-center">
                {/* Replace this placeholder with a video or screenshot */}
                <div className="text-zinc-500 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl border border-white/[0.06] flex items-center justify-center bg-white/[0.02]">
                    <Sparkles className="w-7 h-7 text-indigo-400/60" />
                  </div>
                  <span className="text-xs font-medium tracking-widest uppercase text-zinc-600">
                    App Preview
                  </span>
                </div>
              </div>
            </div>
            {/* Soft glow under preview */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-indigo-500/[0.08] blur-[80px] rounded-full -z-10" />
          </div>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-28 px-6 relative">
        {/* Subtle divider gradient at top */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-400/70 text-xs font-semibold tracking-widest uppercase mb-4">
              Features
            </p>
            <h2 className="text-3xl md:text-5xl font-[900] tracking-tight mb-4 text-white/95">
              Built for Consistency.
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto text-base">
              Everything you need to transform your daily routine into a
              lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className="group p-7 rounded-2xl border border-white/[0.05] bg-white/[0.015] hover:bg-white/[0.03] hover:border-white/[0.1] transition-all duration-300"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5`}
                >
                  <f.icon className={`w-5 h-5 ${f.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white/90">
                  {f.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ──────────────────────────────────────────────────────── */}
      <div id="pricing">
        <Pricing />
      </div>

      {/* ─── Final CTA ────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="max-w-2xl mx-auto text-center rounded-3xl border border-white/[0.06] bg-white/[0.02] p-12 md:p-16 relative overflow-hidden backdrop-blur-sm">
          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-indigo-500/[0.06] blur-[80px] -z-10 rounded-full" />

          <h2 className="text-3xl md:text-5xl font-[900] mb-5 leading-tight tracking-tight text-white/95">
            Ready to win
            <br />
            your day?
          </h2>
          <p className="text-zinc-400 text-base mb-10">
            Join thousands of users building better lives with HabitSwipe.
          </p>
          <Link href="/register">
            <button className="group px-8 py-4 rounded-2xl bg-white text-zinc-900 font-bold text-base hover:bg-zinc-100 transition-all active:scale-[0.97] shadow-xl shadow-white/[0.06] inline-flex items-center gap-2">
              Join HabitSwipe Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
