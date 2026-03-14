"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { ArrowRight, Sparkles, Zap } from "lucide-react"
import { useEffect } from "react"

export function Hero() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth the mouse movement
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position between -100 and 100
      const x = (e.clientX / window.innerWidth) * 200 - 100
      const y = (e.clientY / window.innerHeight) * 200 - 100
      mouseX.set(x)
      mouseY.set(y)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-black min-h-[90vh] flex items-center">
      {/* ── Background Layer ────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle Dotted Grid */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />

        {/* Interactive Aurora Mesh Blobs */}
        <motion.div
          className="absolute rounded-full bg-indigo-500/20 blur-[130px]"
          style={{
            width: "800px",
            height: "800px",
            top: "-10%",
            left: "-10%",
            x: springX,
            y: springY,
          }}
        />

        <motion.div
          className="absolute rounded-full bg-cyan-500/15 blur-[110px]"
          style={{
            width: "600px",
            height: "600px",
            bottom: "-10%",
            right: "-10%",
            x: useTransform(springX, (v) => -v * 0.4),
            y: useTransform(springY, (v) => -v * 0.4),
          }}
        />

        {/* Animated ambient blobs */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/5 blur-[150px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto text-center relative z-10 w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-balance leading-[0.9] tracking-[-0.04em]">
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] xl:text-[8rem] font-[900] text-white">
              Build the
            </span>
            <span className="mt-1 block text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] xl:text-[8.5rem] font-[900] bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Future.
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-zinc-400 text-[15px] sm:text-base md:text-lg lg:text-xl max-w-xl mx-auto mb-10 leading-relaxed font-light text-balance"
        >
          Home of the vibe habit movement. The <span className="text-white font-medium">agentic habit platform</span> for builders.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 group"
        >
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="xl" variant="gradient" className="rounded-xl px-10 group h-14 text-lg w-full sm:w-auto shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/30">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="xl" variant="secondary" className="rounded-xl px-10 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/30 h-14 text-lg w-full sm:w-auto transition-all text-white">
              Log In
            </Button>
          </Link>
        </motion.div>

        {/* Interactive Dashboard Preview / Video Screen */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 relative px-4 w-full"
        >
          <div className="max-w-5xl mx-auto glass rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] overflow-hidden aspect-video bg-zinc-950 relative group/preview">
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 bg-indigo-500/[0.03] pointer-events-none" />

            {/* Video Placeholder / Animation Overlays */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Visual placeholder for the video the user will play further */}
              <div className="w-full h-full relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-cyan-500/10" />

                {/* Centered Logo/Brand Mark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <Zap className="w-32 h-32 text-white blur-sm" />
                </div>

                {/* Dashboard Accents (Animated Cards) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-72 h-44 glass rounded-3xl border border-white/20 flex flex-col items-center justify-center gap-4 text-center p-6 shadow-2xl relative bg-zinc-900/60 backdrop-blur-2xl"
                    animate={{
                      y: [0, -10, 0],
                      rotateX: [0, 5, 0]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Morning Run</h3>
                      <div className="h-1 w-24 bg-white/10 rounded-full mx-auto mt-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-indigo-500"
                          animate={{ width: ["0%", "80%"] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Player Controls Accents (Mock) */}
            <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between opacity-50">
              <div className="flex gap-4">
                <div className="w-8 h-1 rounded-full bg-white/20" />
                <div className="w-12 h-1 rounded-full bg-white/20" />
              </div>
              <div className="w-24 h-1 rounded-full bg-white/10" />
            </div>

            {/* Top Control Dots (Mac Style) */}
            <div className="absolute top-8 left-8 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-sm shadow-[#FF5F56]/20" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm shadow-[#FFBD2E]/20" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-sm shadow-[#27C93F]/20" />
            </div>
          </div>

          {/* Main accent glow below the screen */}
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[90%] h-48 bg-indigo-500/20 blur-[120px] -z-10 rounded-full" />
        </motion.div>
      </div>
    </section>
  )
}
