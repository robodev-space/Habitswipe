import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 italic">
            H
          </div>
          <span className="text-xl font-bold" style={{ fontFamily: "var(--font-dm-serif)" }}>
            HabitSwipe
          </span>
        </div>
        
        <div className="flex items-center gap-8 text-sm text-fore-3">
          <Link href="/privacy" className="hover:text-indigo-400 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-indigo-400 transition-colors">Terms</Link>
          <Link href="https://twitter.com" className="hover:text-indigo-400 transition-colors">Twitter</Link>
        </div>

        <p className="text-xs text-fore-4">
          © 2026 HabitSwipe AI. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
