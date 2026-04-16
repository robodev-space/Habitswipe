"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowRight, Sparkles, Zap } from "lucide-react"
import { useEffect } from "react"

const PRODUCT_URL = process.env.NEXT_PUBLIC_PRODUCT_URL || "https://habitswipe.100xfocus.com"

export function Hero() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
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
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />

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
        {/* Company Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-zinc-400 bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Innovation Studio
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mb-8"
        >
          <h1 className="text-balance leading-[0.95] tracking-[-0.04em]">
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] xl:text-[8rem] font-[900] text-white select-none">
              We Build
            </span>
            <span className="mt-1 block text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] xl:text-[8rem] font-[900] bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent select-none">
              Products.
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-zinc-400 text-[15px] sm:text-base md:text-lg lg:text-xl max-w-xl mx-auto mb-10 leading-relaxed font-light text-balance"
        >
          100xFocus crafts <span className="text-white font-medium">intelligent, beautiful products</span> that help you be more productive, build better habits, and <span className="text-white font-medium">grow 100x faster</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 group"
        >
          <a href="#products">
            <button className="relative group h-13 px-8 py-3.5 rounded-xl text-[15px] font-semibold text-white overflow-hidden transition-all active:scale-95 flex items-center gap-2 shadow-xl shadow-indigo-600/25">
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600" />
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative">Explore Products</span>
              <ArrowRight className="relative w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </a>
          <a href="#contact">
            <button className="h-13 px-8 py-3.5 rounded-xl text-[15px] font-medium text-zinc-300 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.09] hover:border-indigo-500/30 hover:text-white transition-all">
              Contact Us
            </button>
          </a>
        </motion.div>

        {/* Animated Preview */}
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
            <div className="absolute inset-0 bg-indigo-500/[0.03] pointer-events-none" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full relative">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <Zap className="w-24 h-24 sm:w-40 sm:h-40 text-blue-400 blur-[2px]" />
                </div>

                <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-12">
                  <motion.div
                    className="w-full max-w-sm glass rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl bg-zinc-900/40 backdrop-blur-2xl"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-fit h-12 px-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                        <span className="text-white font-black text-sm">100x</span>
                      </div>
                      <div>
                        <div className="h-2.5 w-28 bg-white/20 rounded-full mb-2" />
                        <div className="h-2 w-20 bg-white/10 rounded-full" />
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

          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[90%] h-48 bg-indigo-500/20 blur-[120px] -z-10 rounded-full" />
        </motion.div>
      </div>
    </section>
  )
}
