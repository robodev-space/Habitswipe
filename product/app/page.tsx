import { Metadata } from "next"
import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { Footer } from "@/components/landing/Footer"
import { Sparkles, Zap, ArrowRight, CheckCircle2, Trophy, BarChart3, Bell } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "HabitSwipe — The Most Satisfying Habit Tracker",
  description:
    "Transform your life with a swipe. HabitSwipe makes habit building effortless with a unique swipe-based UI, deep analytics, and streak tracking. Rank higher in life.",
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

export default function ProductLandingPage() {
  return (
    <main className="font-sans min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <LandingNavbar />

      {/* Hero Section - HabitSwipe Specific */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 mb-8">
            <Zap className="w-3.5 h-3.5 fill-current" />
            Voted #1 Habit Interface
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.9]">
            Build Habits with <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              a Simple Swipe.
            </span>
          </h1>

          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light">
            Stop checking boxes. Start swiping towards your goals. HabitSwipe
            combines game-like mechanics with powerful analytics to keep you
            consistent.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-all active:scale-95 shadow-2xl shadow-white/10">
                Start Building Today
              </button>
            </Link>
            <Link href="#features">
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-lg font-medium">
                See How it Works
              </button>
            </Link>
          </div>

          {/* Product Preview Block */}
          <div className="mt-20 relative max-w-5xl mx-auto">
            <div className="aspect-[16/9] rounded-[2.5rem] border border-white/10 glass overflow-hidden shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)]">
              <div className="w-full h-full bg-zinc-950 flex items-center justify-center">
                <div className="text-zinc-500 flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-3xl border border-white/5 flex items-center justify-center bg-white/[0.02]">
                    <Sparkles className="w-8 h-8 text-indigo-400" />
                  </div>
                  <span className="text-sm font-medium tracking-widest uppercase">
                    Experience Focus
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 px-6 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Built for Consistency.
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto">
              Everything you need to transform your daily routine into a
              lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Satisfying Swipes",
                description:
                  "Done or skipped? One gesture is all it takes. The most rewarding interaction in productivity.",
                icon: Zap,
                color: "text-blue-400",
              },
              {
                title: "Visual Streaks",
                description:
                  "Watch your progress grow with beautiful heatmaps and streak counters that keep you motivated.",
                icon: Trophy,
                color: "text-amber-400",
              },
              {
                title: "Deep Insights",
                description:
                  "Understand your patterns with weekly reports and productivity charts.",
                icon: BarChart3,
                color: "text-emerald-400",
              },
              {
                title: "Smart Reminders",
                description:
                  "Get nudged at the right time. Customize your notifications to fit your flow.",
                icon: Bell,
                color: "text-indigo-400",
              },
              {
                title: "Cross-Platform",
                description:
                  "Track on your phone, tablet or desktop. Your habits are always with you.",
                icon: CheckCircle2,
                color: "text-cyan-400",
              },
              {
                title: "Privacy First",
                description:
                  "Your data is yours. Secure, encrypted, and never sold. Focus on yourself.",
                icon: Sparkles,
                color: "text-purple-400",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors"
              >
                <f.icon className={`w-8 h-8 ${f.color} mb-6`} />
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-zinc-500 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center glass rounded-[3rem] border border-white/10 p-12 md:p-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/5 -z-10 blur-3xl" />
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
            Ready to win <br /> your day?
          </h2>
          <p className="text-zinc-400 text-lg mb-12">
            Join thousands of users building better lives with HabitSwipe.
          </p>
          <Link href="/register">
            <button className="px-10 py-5 rounded-2xl bg-white text-black font-extrabold text-xl hover:bg-zinc-200 transition-all active:scale-95">
              Join HabitSwipe Now
              <ArrowRight className="inline-block ml-2 w-6 h-6" />
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
