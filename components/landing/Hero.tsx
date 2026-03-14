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
            <Button size="xl" variant="secondary" className="rounded-xl px-10 bg-zinc-900 border border-white/5 hover:border-indigo-500/30 h-14 text-lg w-full sm:w-auto transition-colors">
              Log In
            </Button>
          </Link>
        </motion.div>

        {/* Interactive Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 relative px-4"
        >
          <div className="max-w-4xl mx-auto glass rounded-[2.5rem] border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] overflow-hidden aspect-[16/10] bg-zinc-950 relative group/preview">
             {/* Subtle Inner Glow */}
             <div className="absolute inset-0 bg-indigo-500/[0.02] pointer-events-none" />
             
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div 
                  className="w-72 h-96 glass rounded-3xl border border-white/10 flex flex-col items-center justify-center gap-6 text-center p-8 shadow-2xl relative bg-zinc-900/40"
                  animate={{ 
                    rotateY: [-5, 5, -5],
                    rotateX: [-3, 3, -3]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
                        <Zap className="w-10 h-10 text-indigo-400 fill-indigo-400/20" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Morning Run</h3>
                        <p className="text-sm text-zinc-500">Swipe right to mark done</p>
                    </div>
                    
                    {/* Simulated Swipe Handle */}
                    <motion.div 
                      className="absolute -right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center text-black shadow-2xl border-4 border-black/10"
                      animate={{ x: [0, 15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ArrowRight className="w-6 h-6" />
                    </motion.div>
                </motion.div>
             </div>
             
             {/* UI Accents (Top left dots) */}
             <div className="absolute top-8 left-8 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
             </div>
          </div>
          
          {/* Subtle bottom accent glow */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-40 bg-indigo-500/20 blur-[100px] -z-10 rounded-full" />
        </motion.div>
      </div>
    </section>
  )
}
