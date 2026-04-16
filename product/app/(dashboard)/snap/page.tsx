"use client"

import { useState } from "react"
import { toast } from "react-hot-toast"

export default function SnapPage() {
  const [cardColor, setCardColor] = useState("#5b50e8")

  const copyLink = () => {
    navigator.clipboard?.writeText("https://HabitClick.app/share/user").catch(() => {})
    toast.success("🔗 Link copied to clipboard!")
  }

  return (
    <div className="tab active" id="tab-snap">
      {/* Header */}
      <div className="ph">
        <div>
          <div className="pd">Share your journey</div>
          <div className="pt">Inspire <em>others</em></div>
          <div className="ps">Share your streak and motivate your circle</div>
        </div>
      </div>

      <div className="snap-hero">
        <div className="snap-icon">📸</div>
        <div className="snap-h2">Create your streak card</div>
        <div className="snap-p">Generate a beautiful shareable image showing your progress, streaks, and top habits.</div>
        <button className="snap-btn" onClick={() => toast("Generating your card...")}>
          <svg viewBox="0 0 16 16"><circle cx="8" cy="9" r="3" /><path d="M1 6h1.5l1.5-3h8l1.5 3H15v8H1z" /></svg>
          Generate card
        </button>
      </div>

      <div className="sh"><div className="st">Share as</div></div>
      <div className="share-grid">
        <div className="share-opt" onClick={() => toast("Downloading PNG...")}>
          <div className="share-ico">🖼️</div><div className="share-lbl">Image</div><div className="share-sub">PNG · Instagram</div>
        </div>
        <div className="share-opt" onClick={() => toast("Creating story...")}>
          <div className="share-ico">📱</div><div className="share-lbl">Story</div><div className="share-sub">9:16 · Stories</div>
        </div>
        <div className="share-opt" onClick={copyLink}>
          <div className="share-ico">🔗</div><div className="share-lbl">Link</div><div className="share-sub">Copy URL</div>
        </div>
        <div className="share-opt" onClick={() => window.open('https://twitter.com/intent/tweet?text=I%20just%20hit%20a%2014-day%20streak%20on%20HabitClick!%20%F0%9F%94%A5', '_blank')}>
          <div className="share-ico">𝕏</div><div className="share-lbl">Twitter</div><div className="share-sub">Post thread</div>
        </div>
        <div className="share-opt" onClick={() => toast("Opening LinkedIn...")}>
          <div className="share-ico">💼</div><div className="share-lbl">LinkedIn</div><div className="share-sub">Post update</div>
        </div>
        <div className="share-opt" onClick={() => window.open('https://wa.me/?text=I%20just%20hit%20a%2014-day%20streak%20on%20HabitClick!%20%F0%9F%94%A5', '_blank')}>
          <div className="share-ico">💬</div><div className="share-lbl">WhatsApp</div><div className="share-sub">Send to group</div>
        </div>
      </div>

      <div className="sh"><div className="st">Preview</div></div>
      <div className="prev-wrap">
        <div className="prev-inner" id="prevCard" style={{ background: cardColor }}>
          <div className="prev-name">Habit Maker</div>
          <div className="prev-streak">🔥 14</div>
          <div className="prev-sub">day streak on HabitClick</div>
          <div className="prev-habits">
            <div className="prev-h"><div className="prev-hem">🏃</div><div className="prev-hs">14d</div></div>
            <div className="prev-h"><div className="prev-hem">📚</div><div className="prev-hs">21d</div></div>
            <div className="prev-h"><div className="prev-hem">💧</div><div className="prev-hs">9d</div></div>
            <div className="prev-h"><div className="prev-hem">🧘</div><div className="prev-hs">7d</div></div>
          </div>
        </div>
        <div className="prev-foot">
          <div className="prev-foot-lbl">Card color</div>
          <div className="color-dots">
            {[
              { color: "#5b50e8" },
              { color: "#1a1714" },
              { color: "#f97316" },
              { color: "#10b981" },
            ].map(({ color }) => (
              <div
                key={color}
                className={`cdot ${cardColor === color ? "sel" : ""}`}
                style={{ background: color, color: color }}
                onClick={() => setCardColor(color)}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
