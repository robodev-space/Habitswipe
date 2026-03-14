import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { Hero } from "@/components/landing/Hero"
import { Features } from "@/components/landing/Features"
import { Pricing } from "@/components/landing/Pricing"
import { Footer } from "@/components/landing/Footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <LandingNavbar />
      <Hero />
      <div id="features">
        <Features />
      </div>
      <Pricing />
      {/* Business Section */}
      <section id="pricing" className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto glass rounded-[3rem] border border-white/10 p-12 md:p-20 text-center relative overflow-hidden">
           {/* Glow */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-indigo-500/5 blur-[100px] -z-10" />
           
           <h2 className="text-4xl md:text-6xl font-bold mb-8" style={{ fontFamily: "var(--font-dm-serif)" }}>
             Ready to build the <br /> better you?
           </h2>
           <p className="text-fore-2 text-lg md:text-xl max-w-xl mx-auto mb-12">
             Join 70,000+ builders tracking their habits at the speed of thought. Start swipe-vibe habit building today.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/register" className="w-full sm:w-auto">
                 <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-colors">
                    Join HabitSwipe
                 </button>
              </a>
              <a href="/login" className="w-full sm:w-auto">
                 <button className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/20 hover:bg-white/5 transition-colors text-lg">
                    Sign In
                 </button>
              </a>
           </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
