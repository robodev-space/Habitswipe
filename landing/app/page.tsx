import { Metadata } from "next"
import { LandingNavbar } from "@/components/LandingNavbar"
import { Hero } from "@/components/Hero"
import { Features } from "@/components/Features"
import { Footer } from "@/components/Footer"

export const metadata: Metadata = {
  title: "100xFocus — Build Habits, Grow 100x Faster",
  description:
    "Experience massive growth with 100xFocus. We build intelligent lifestyle improvement apps that help you stay focused, consistent, and productive.",
  keywords: [
    "100x faster growth",
    "productivity software",
    "lifestyle improvement apps",
    "habit building tools",
  ],
}

export default function LandingPage() {
  return (
    <main className="font-sans min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <LandingNavbar />
      <Hero />
      <div id="features">
        <Features />
      </div>

      {/* About Section */}
      <section id="about" className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto glass rounded-[3rem] border border-white/10 p-12 md:p-20 text-center relative overflow-hidden">
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-indigo-500/5 blur-[100px] -z-10" />

          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8">
            Crafted with care by <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              100xFocus
            </span>
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto mb-12">
            We&apos;re a small team dedicated to building apps that make you
            productive and help you grow 100x faster. Every product we ship is
            designed for lifestyle improvement.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#products" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-colors">
                Explore Products
              </button>
            </a>
            <a href="#contact" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/20 hover:bg-white/5 transition-colors text-lg">
                Get in Touch
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-zinc-500 text-sm font-medium tracking-wider uppercase mb-4">
            Contact
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Have a question or idea?
          </h3>
          <p className="text-zinc-400 text-lg mb-6">
            Reach out to us at{" "}
            <a
              href="mailto:hello@100xfocus.com"
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors"
            >
              hello@100xfocus.com
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
