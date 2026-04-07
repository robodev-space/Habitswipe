import { Inter } from "next/font/google"
import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { Hero } from "@/components/landing/Hero"
import { Features } from "@/components/landing/Features"
import { Footer } from "@/components/landing/Footer"

const inter = Inter({ subsets: ["latin"] })

export default function LandingPage() {
  return (
    <main className={`${inter.className} min-h-screen bg-black text-white selection:bg-indigo-500/30`}>
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
             Crafted with care at <br /><span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">Karotive Labs</span>
           </h2>
           <p className="text-fore-2 text-lg md:text-xl max-w-xl mx-auto mb-12">
             We&apos;re a small team passionate about building products that make a real difference. Every product we ship is designed to help you live better.
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
          <p className="text-zinc-500 text-sm font-medium tracking-wider uppercase mb-4">Contact</p>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Have a question or idea?</h3>
          <p className="text-zinc-400 text-lg mb-6">
            Reach out to us at{" "}
            <a href="mailto:hello@karotivelabs.com" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors">
              hello@karotivelabs.com
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
