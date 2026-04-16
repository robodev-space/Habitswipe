"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { useState, useEffect } from "react"

const PRODUCT_URL = process.env.NEXT_PUBLIC_PRODUCT_URL || "https://habitswipe.100xfocus.com"

export function LandingNavbar() {
  const { scrollY } = useScroll()

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
          <div className="w-fit h-9 px-3 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-black text-white text-xs group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/25">
            100x
          </div>
          <span className="text-xl font-black tracking-tight text-white select-none">
            100xFocus
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
          {[
            { name: "Products", href: "#products" },
            { name: "About", href: "#about" },
            { name: "Contact", href: "#contact" },
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
          <a
            href={`${PRODUCT_URL}/login`}
            className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Log in
          </a>
          <a href={`${PRODUCT_URL}/register`}>
            <button className="relative px-5 py-2 rounded-xl text-sm font-semibold text-white overflow-hidden group transition-all active:scale-95">
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transition-opacity group-hover:opacity-90" />
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative">Get Started</span>
            </button>
          </a>
        </div>
      </div>
    </motion.nav>
  )
}
