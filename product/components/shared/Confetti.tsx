"use client"

import { useEffect, useState } from "react"

export function Confetti() {
  const [pieces, setPieces] = useState<any[]>([])

  useEffect(() => {
    const colors = ['#5b50e8','#10b981','#f59e0b','#f97316','#a855f7','#ec4899']
    const newPieces = Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: 15 + Math.random() * 70,
      top: 20 + Math.random() * 40,
      size: 6 + Math.random() * 6,
      color: colors[i % colors.length],
      delay: Math.random() * 0.3,
      isRound: Math.random() > 0.5
    }))
    setPieces(newPieces)
    const t = setTimeout(() => setPieces([]), 1000)
    return () => clearTimeout(t)
  }, [])

  if (pieces.length === 0) return null

  return (
    <>
      {pieces.map(p => (
        <div
          key={p.id}
          className="conf"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            borderRadius: p.isRound ? '50%' : '2px',
          }}
        />
      ))}
    </>
  )
}
