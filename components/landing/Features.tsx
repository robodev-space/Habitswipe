"use client"

import React from "react"
import { motion, useMotionValue, useMotionTemplate } from "framer-motion"
import { Zap, ArrowRight, Clock, Sparkles } from "lucide-react"
import Link from "next/link"

const products = [
  {
    name: "HabitSwipe",
    tagline: "Swipe-based habit tracking",
    description: "The most satisfying way to build habits. Swipe right for done, left for skip. AI-powered insights, streaks, analytics, and a beautiful dark UI built for focus.",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    status: "live",
    link: "/login",
    cta: "Open HabitSwipe",
  },
  {
    name: "Coming Soon",
    tagline: "Something exciting is brewing",
    description: "We're working on our next product to help people build better routines. Stay tuned for updates from Karotive Labs.",
    icon: Clock,
    color: "from-indigo-500 to-purple-500",
    status: "coming-soon",
    link: "#",
    cta: "Stay Updated",
  },
  {
    name: "Coming Soon",
    tagline: "More innovation ahead",
    description: "Our team is exploring new ideas in productivity, wellness, and personal growth. Follow us to be the first to know.",
    icon: Sparkles,
    color: "from-pink-500 to-rose-500",
    status: "coming-soon",
    link: "#",
    cta: "Stay Updated",
  },
]

function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  const isLive = product.status === "live"

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -8 }}
      className={`group relative bg-white/[0.02] rounded-[2.5rem] border p-10 transition-all duration-500 overflow-hidden ${
        isLive
          ? "border-indigo-500/30 hover:border-indigo-500/50 cursor-pointer"
          : "border-white/5 hover:border-white/10 cursor-default"
      }`}
    >
      {/* Mouse Glow */}
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

      {/* Static Glow */}
      <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-5 blur-[80px] transition-opacity duration-700`} />

      {/* Status Badge */}
      {isLive ? (
        <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
        </div>
      ) : (
        <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-zinc-500/10 border border-zinc-500/20 flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-zinc-500" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Coming Soon</span>
        </div>
      )}

      <div className="flex flex-col h-full gap-6 relative z-10">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center p-4 shadow-2xl ${
          !isLive ? "opacity-40" : ""
        }`}>
          <product.icon className="w-full h-full text-white" />
        </div>

        <div>
          <h3 className={`text-3xl font-black tracking-tight mb-2 leading-tight ${
            isLive ? "text-white" : "text-zinc-500"
          }`}>
            {product.name}
          </h3>
          <p className={`text-sm font-medium mb-4 ${isLive ? "text-indigo-400" : "text-zinc-600"}`}>
            {product.tagline}
          </p>
          <p className={`text-lg leading-relaxed mb-8 ${isLive ? "text-zinc-400" : "text-zinc-600"}`}>
            {product.description}
          </p>
        </div>

        <div className="mt-auto">
          {isLive ? (
            <Link href={product.link}>
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
                {product.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          ) : (
            <span className="flex items-center gap-2 text-sm font-bold text-zinc-600">
              {product.cta}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function Features() {
  return (
    <section className="py-24 px-6 relative bg-black overflow-hidden" id="products">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-8 tracking-wider uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Our Products
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 text-white"
          >
            What we&apos;re <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">building.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-light"
          >
            Products crafted with care at Karotive Labs. Built to help you live better.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {products.map((product, index) => (
            <ProductCard key={`${product.name}-${index}`} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
