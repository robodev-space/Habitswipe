"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { useState, useEffect } from "react"
import Image from "next/image"

export function LandingNavbar() {
  const { scrollY } = useScroll()

  // Dynamic background based on scroll
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)"]
  )
  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ["blur(0px)", "blur(12px)"]
  )
  const borderOpacity = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.1)"]
  )

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <motion.nav
      style={{ backgroundColor, backdropFilter: backdropBlur, borderBottomColor: borderOpacity }}
      className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-8 py-4 transition-all duration-300 border-b border-transparent"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl  flex items-center justify-center font-black text-white italic group-hover:scale-110 transition-transform">
            <Image src="/favicon.ico" alt="HabitSwipe" width={30} height={30} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white select-none">
            HabitSwipe
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
          {[
            { name: "Features", href: "#features" },
            { name: "Pricing", href: "#pricing" },
            { name: "Resources", href: "#" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-5 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block text-sm font-bold text-zinc-400 hover:text-white transition-colors">
            Log In
          </Link>
          <Link href="/register">
            <Button variant="gradient" size="md" className="rounded-xl px-6 font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
