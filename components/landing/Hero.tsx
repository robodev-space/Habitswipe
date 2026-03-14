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
    <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-6 sm:px-8 overflow-hidden bg-black min-h-[90vh] flex items-center">
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
          <h1 className="text-balance leading-[0.95] tracking-[-0.04em]">
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] xl:text-[8rem] font-[900] text-white select-none">
              Build the
            </span>
            <span className="mt-1 block text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] xl:text-[8rem] font-[900] bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent select-none">
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
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 1.2,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="mt-12 sm:mt-20 relative w-full flex justify-center"
        >
          <div className="w-full max-w-5xl aspect-video rounded-[2rem] sm:rounded-[3rem] border border-white/5 shadow-[0_32px_128px_-16px_rgba(0,0,0,1)] overflow-hidden relative group/preview bg-zinc-950/50 backdrop-blur-sm">
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 bg-indigo-500/[0.03] pointer-events-none" />

            {/* Content Layers */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full relative">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

                {/* Centered Premium Mark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <Zap className="w-24 h-24 sm:w-40 sm:h-40 text-blue-400 blur-[2px]" />
                </div>

                {/* Floating Dashboard Card */}
                <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-12">
                  <motion.div
                    className="w-full max-w-sm glass rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl bg-zinc-900/40 backdrop-blur-2xl"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <div className="h-2 w-24 bg-white/20 rounded-full mb-2" />
                        <div className="h-2 w-16 bg-white/10 rounded-full" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-500"
                          animate={{ width: ["0%", "70%", "70%"] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        />
                      </div>
                      <div className="h-1.5 w-[80%] bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-cyan-400"
                          animate={{ width: ["0%", "0%", "90%", "90%"] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Glow Accent */}
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[90%] h-48 bg-indigo-500/20 blur-[120px] -z-10 rounded-full" />
        </motion.div>
      </div>
    </section>
  )
}
