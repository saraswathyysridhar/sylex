import { useEffect, useRef, useState } from 'react'

// What people are planning tonight — simulated live data
// Shuffled each render for variety, seeded slightly by time-of-day
const ALL_VIBES = [
  { emoji: '🌙', text: 'Cozy Solo Night', count: 247 },
  { emoji: '💛', text: 'Romantic Evening for Two', count: 183 },
  { emoji: '🎉', text: 'Friends Night In', count: 319 },
  { emoji: '🔭', text: 'Deep Focus Session', count: 128 },
  { emoji: '🌿', text: 'Solo Expedition', count: 94 },
  { emoji: '🎨', text: 'Creative Flow', count: 211 },
  { emoji: '🎮', text: 'Gaming + Snacks', count: 406 },
  { emoji: '📚', text: 'Book + Tea Evening', count: 156 },
  { emoji: '🍜', text: 'Cook-at-Home Night', count: 278 },
  { emoji: '🥂', text: 'Romantic Dinner Party', count: 142 },
  { emoji: '🎬', text: 'Film Marathon', count: 364 },
  { emoji: '☕', text: 'Slow Morning Start', count: 189 },
  { emoji: '🌅', text: 'Sunrise Hike + Breakfast', count: 73 },
  { emoji: '🎊', text: 'Friday Night Out', count: 512 },
  { emoji: '🧘', text: 'Mindful Solo Sunday', count: 201 },
  { emoji: '🍕', text: 'Pizza + Comedy Night', count: 387 },
  { emoji: '🌹', text: 'Date Night In', count: 223 },
  { emoji: '🎵', text: 'Music & Chill', count: 295 },
]

// Deterministically vary by hour so it feels "live"
function getVibes() {
  const hour = new Date().getHours()
  const seed = hour % 5
  const shifted = [...ALL_VIBES.slice(seed), ...ALL_VIBES.slice(0, seed)]
  // double for infinite scroll
  return [...shifted, ...shifted]
}

const SERIF = '"Bodoni Moda", "Cormorant Garamond", Georgia, serif'
const GOLD  = '#C49A6C'

export default function VibeStrip() {
  const trackRef = useRef(null)
  const [vibes]  = useState(getVibes)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let pos   = 0
    let raf   = null
    const speed = 0.55  // px per frame

    const step = () => {
      if (!paused) {
        pos += speed
        // Reset when half-way through (looped content)
        const half = track.scrollWidth / 2
        if (pos >= half) pos = 0
        track.style.transform = `translateX(-${pos}px)`
      }
      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [paused])

  return (
    <div
      style={{
        background: '#0A0806',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        padding: '20px 0',
        overflow: 'hidden',
        position: 'relative',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Left fade */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 120,
        background: 'linear-gradient(to right, #0A0806, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      {/* Right fade */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 120,
        background: 'linear-gradient(to left, #0A0806, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* Left label */}
      <div style={{
        position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)',
        zIndex: 3, display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%', background: '#4ADE80',
          animation: 'vibePulse 2s ease-in-out infinite',
        }} />
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'rgba(255,240,220,0.4)',
          fontFamily: '"Inter", sans-serif', whiteSpace: 'nowrap',
        }}>
          Trending tonight
        </span>
      </div>

      {/* Scrolling track */}
      <div style={{ paddingLeft: 180 }}>
        <div ref={trackRef} style={{ display: 'flex', gap: 12, width: 'max-content', willChange: 'transform' }}>
          {vibes.map((v, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 22px', borderRadius: 100, flexShrink: 0,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                cursor: 'default',
              }}
            >
              <span style={{ fontSize: 18 }}>{v.emoji}</span>
              <span style={{
                fontSize: 14.5, color: 'rgba(255,240,220,0.65)',
                fontFamily: '"Inter", sans-serif', whiteSpace: 'nowrap',
                fontWeight: 500, letterSpacing: '-0.01em',
              }}>
                {v.text}
              </span>
              <span style={{
                fontSize: 11.5, color: `${GOLD}80`,
                fontFamily: '"Inter", sans-serif', fontWeight: 700,
                background: `${GOLD}12`, padding: '2px 8px', borderRadius: 100,
              }}>
                {v.count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes vibePulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </div>
  )
}
