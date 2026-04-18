import Link from "next/link"
import Image from "next/image"

const footerLinks = [
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
  { name: "Twitter", href: "https://twitter.com" },
]

export function Footer() {
  return (
    <footer className="relative py-10 px-6 border-t border-white/[0.05] bg-[#04040C] overflow-hidden">
      {/* Top glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/favicon.ico"
            alt="HabitClick logo"
            width={28}
            height={28}
            className="rounded-lg group-hover:scale-105 transition-transform shadow-sm"
          />
          <span className="text-base font-bold text-white tracking-tight">
            HabitClick
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-zinc-600">
          {footerLinks.map(({ name, href }) => (
            <Link
              key={name}
              href={href}
              className="hover:text-indigo-400 transition-colors duration-200"
            >
              {name}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-zinc-700">
          © 2026 100xFocus. All rights reserved.
        </p>

      </div>
    </footer>
  )
}