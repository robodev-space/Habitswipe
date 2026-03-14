"use client"

import React from "react"
import { motion, useMotionValue, useMotionTemplate } from "framer-motion"
import { Touchpad, Target, BarChart3, Zap, ArrowRight } from "lucide-react"

const features = [
  {
    title: "Swipe Mechanics",
    description: "The most satisfying way to track habits. Swipe right for done, left for skip. Built for speed and focus.",
    icon: Touchpad,
    color: "from-blue-500 to-cyan-500",
    link: "View Mechanics",
  },
  {
    title: "Precision Targeting",
    description: "Focus on what matters most. Set goals, track streaks, and hit your targets every day with agentic precision.",
    icon: Target,
    color: "from-indigo-500 to-purple-500",
    link: "Explore Targeting",
  },
  {
    title: "Deep Analytics",
    description: "Visualize your growth with advanced metrics and progress visualization tools. Data-driven habit building.",
    icon: BarChart3,
    color: "from-pink-500 to-rose-500",
    link: "See Insights",
  },
  {
    title: "Vibe streaks",
    description: "Maintain your momentum. Our adaptive streak system keeps you motivated and in the flow.",
    icon: Zap,
    color: "from-amber-500 to-orange-500",
    link: "Stay Motivated",
  },
]

export function FeatureCard({ feature, index }: { feature: any, index: number }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -8 }}
      className="group relative bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-10 hover:border-indigo-500/30 transition-all duration-500 cursor-default overflow-hidden"
    >
      {/* Background Mouse Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(99, 102, 241, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Feature Static Glow */}
      <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 blur-[80px] transition-opacity duration-700`} />
      
      <div className="flex flex-col h-full gap-8 relative z-10">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center p-4 shadow-2xl`}>
          <feature.icon className="w-full h-full text-white" />
        </div>
        
        <div>
          <h3 className="text-3xl font-black tracking-tight text-white mb-4 italic leading-tight">{feature.title}</h3>
          <p className="text-zinc-400 text-lg leading-relaxed mb-8">
            {feature.description}
          </p>
        </div>

        <div className="mt-auto">
            <button className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                {feature.link}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </div>
    </motion.div>
  )
}

export function Features() {
  return (
    <section className="py-24 px-6 relative bg-black overflow-hidden" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 text-white"
          >
            Four features. <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent italic">One workflow.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-light"
          >
            Everything you need to go from idea to consistency with agentic habit building.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
