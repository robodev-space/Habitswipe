"use client"

import { useRef } from "react"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const monitorRef = useRef<HTMLDivElement>(null)
  
  // Re-implementing your motion values for the glows (Reverting to your original UI)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  useGSAP(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      
      const xPercent = (clientX / innerWidth - 0.5)
      const yPercent = (clientY / innerHeight - 0.5)

      // Set motion values for original UI glows
      mouseX.set(xPercent * 200)
      mouseY.set(yPercent * 200)

      // Keep Tilt ONLY for the monitor/video area
      gsap.to(monitorRef.current, {
        rotateY: xPercent * 20,
        rotateX: -yPercent * 20,
        duration: 1,
        ease: "power2.out"
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-6 sm:px-8 overflow-hidden bg-black min-h-[90vh] flex items-center">
      {/* ── REVERTED Background Layer ───────────────────────────────────────────── */}
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
      </div>

      {/* ── Content (REVERTED TO YOUR ORIGINAL VERSION) ─────────────────────────── */}
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
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a href="#products">
            <button className="relative group h-13 px-8 py-3.5 rounded-xl text-[15px] font-semibold text-white overflow-hidden transition-all active:scale-95 flex items-center gap-2 shadow-xl shadow-indigo-600/25">
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600" />
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

        {/* ── THE ONLY PART UPDATED: MacOS Video Showcase (With Individual Hover Fix) ── */}
        <div className="relative w-full max-w-4xl flex justify-center perspective-3000">
          <div 
            ref={monitorRef}
            className="w-full flex flex-col rounded-2xl border border-white/10 shadow-[0_48px_96px_-24px_rgba(0,0,0,1)] overflow-hidden relative bg-zinc-950/90 backdrop-blur-3xl"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* MacOS Title Bar */}
            <div className="h-9 sm:h-11 w-full bg-white/[0.03] border-b border-white/[0.08] flex items-center px-4 relative z-30">
              <div className="flex gap-2">
                {/* Close (Individual Hover) */}
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-inner shadow-black/10 flex items-center justify-center relative transition-colors hover:bg-[#ff4b40] group/close">
                  <svg className="w-1.5 h-1.5 text-black/60 opacity-0 group-hover/close:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </div>
                {/* Minimize (Individual Hover) */}
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-inner shadow-black/10 flex items-center justify-center relative transition-colors hover:bg-[#ffad00] group/min">
                  <svg className="w-1.5 h-1.5 text-black/60 opacity-0 group-hover/min:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="6">
                    <path d="M5 12h14" />
                  </svg>
                </div>
                {/* Fullscreen (Individual Hover) */}
                <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-inner shadow-black/10 flex items-center justify-center relative transition-colors hover:bg-[#1eb033] group/full">
                  <svg className="w-1.5 h-1.5 text-black/60 opacity-0 group-hover/full:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] opacity-50">Habitswipe_Preview</span>
              </div>
            </div>

            {/* Viewport content */}
            <div className="relative w-full aspect-video">
              <video
                className="w-full h-full object-cover"
                src="/hero-preview.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-white/[0.01] pointer-events-none z-10" />
            </div>
          </div>

          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[85%] h-48 bg-indigo-600/15 blur-[120px] -z-10 rounded-full" />
        </div>
      </div>
    </section>
  )
}
