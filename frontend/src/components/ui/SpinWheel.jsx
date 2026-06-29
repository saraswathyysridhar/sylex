import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SERIF = '"Bodoni Moda", "Cormorant Garamond", Georgia, serif'
const GOLD  = '#C49A6C'

const SEGMENTS = [
  { label: 'Movies',      emoji: '🎬', color: '#5A9FBF', dark: '#3A7FA0', path: '/movies' },
  { label: 'Recipes',     emoji: '🍽️', color: '#C4703A', dark: '#A4502A', path: '/recipes' },
  { label: 'Games',       emoji: '🎮', color: '#CC2222', dark: '#AA0202', path: '/games' },
  { label: 'Books',       emoji: '📚', color: '#8B5E3C', dark: '#6B3E1C', path: '/books' },
  { label: 'Music',       emoji: '🎵', color: '#3A9B7A', dark: '#1A7B5A', path: '/music' },
  { label: 'Activities',  emoji: '✨', color: '#4D7A52', dark: '#2D5A32', path: '/activities' },
  { label: 'Drinks',      emoji: '🥂', color: '#D4956A', dark: '#B47550', path: '/drinks' },
  { label: 'Collections', emoji: '🌟', color: '#B5763A', dark: '#955618', path: '/collections' },
]

const N     = SEGMENTS.length
const ADEG  = 360 / N   // 45° per segment
const CX    = 160
const CY    = 160
const R     = 148

function segPath(i) {
  const a1 = (i * ADEG - 90) * (Math.PI / 180)
  const a2 = ((i + 1) * ADEG - 90) * (Math.PI / 180)
  const x1 = CX + R * Math.cos(a1)
  const y1 = CY + R * Math.sin(a1)
  const x2 = CX + R * Math.cos(a2)
  const y2 = CY + R * Math.sin(a2)
  return `M ${CX} ${CY} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`
}

export default function SpinWheel() {
  const [open, setOpen]       = useState(false)
  const [rotState, setRotState] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner]   = useState(null)
  const rotRef  = useRef(0)
  const timerRef = useRef(null)
  const navigate = useNavigate()

  const spin = () => {
    if (spinning) return
    const n = Math.floor(Math.random() * N)
    const jitter = (Math.random() - 0.5) * 22
    const targetMod = ((360 - n * ADEG - ADEG / 2 + jitter) % 360 + 360) % 360
    const currentMod = ((rotRef.current % 360) + 360) % 360
    const delta = (targetMod - currentMod + 360) % 360
    const total = rotRef.current + 4 * 360 + delta
    rotRef.current = total
    setRotState(total)
    setWinner(null)
    setSpinning(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setSpinning(false)
      setWinner(SEGMENTS[n])
    }, 3600)
  }

  const handleOpen = () => {
    setOpen(true)
    setWinner(null)
  }

  const handleClose = () => {
    setOpen(false)
    setWinner(null)
    setSpinning(false)
    clearTimeout(timerRef.current)
  }

  return (
    <>
      <button
        onClick={handleOpen}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '10px 22px', borderRadius: 100,
          background: 'rgba(255,255,255,0.07)',
          border: '1.5px solid rgba(255,255,255,0.13)',
          color: 'rgba(255,240,220,0.7)', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', backdropFilter: 'blur(10px)', transition: 'all 0.2s',
          letterSpacing: '0.01em',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; e.currentTarget.style.color = '#FDFAF6'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,240,220,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)' }}
      >
        🎡 Spin
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 10000,
              background: '#070504',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              overflowY: 'auto',
            }}
          >
            {/* Ambient glows */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', top: '15%', left: '15%', width: 700, height: 700, borderRadius: '50%', background: 'rgba(196,154,108,0.05)', filter: 'blur(110px)' }} />
              <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(90,159,191,0.04)', filter: 'blur(90px)' }} />
            </div>

            {/* Close */}
            <button onClick={handleClose} style={{
              position: 'fixed', top: 20, right: 20, zIndex: 2,
              width: 42, height: 42, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            >
              <X size={16} color="rgba(255,240,220,0.5)" />
            </button>

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '40px 24px 60px', width: '100%', maxWidth: 500 }}>

              {/* Header */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: GOLD, fontFamily: '"Inter", sans-serif', marginBottom: 14 }}>
                  Spin the Wheel
                </div>
                <h1 style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(1.9rem, 5vw, 3.2rem)',
                  color: '#FDFAF6', lineHeight: 0.94,
                  letterSpacing: '-0.03em', fontWeight: 600,
                  marginBottom: 40, minHeight: '1.1em',
                }}>
                  <AnimatePresence mode="wait">
                    <motion.span key={winner ? 'w' : spinning ? 's' : 'i'}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                      style={{ display: 'block' }}
                    >
                      {winner
                        ? <>You got <em style={{ color: winner.color, fontStyle: 'italic' }}>{winner.label}!</em></>
                        : spinning
                          ? <>Deciding your <em style={{ color: GOLD, fontStyle: 'italic' }}>fate…</em></>
                          : <>Let the universe <em style={{ color: GOLD, fontStyle: 'italic' }}>decide.</em></>
                      }
                    </motion.span>
                  </AnimatePresence>
                </h1>
              </motion.div>

              {/* Wheel */}
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>

                  {/* Pointer */}
                  <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
                    <svg width="28" height="20" viewBox="0 0 28 20">
                      <polygon points="14,20 0,0 28,0" fill={GOLD} />
                    </svg>
                  </div>

                  {/* Spinning div */}
                  <div style={{
                    width: 'min(320px, calc(100vw - 72px))',
                    aspectRatio: '1 / 1',
                    transform: `rotate(${rotState}deg)`,
                    transition: spinning ? 'transform 3.5s cubic-bezier(0.16, 0.84, 0.44, 1)' : 'none',
                    transformOrigin: 'center center',
                    willChange: spinning ? 'transform' : 'auto',
                    borderRadius: '50%',
                    overflow: 'hidden',
                  }}>
                    <svg width="100%" height="100%" viewBox="0 0 320 320">
                      {SEGMENTS.map((seg, i) => {
                        const mid  = ((i + 0.5) * ADEG - 90) * (Math.PI / 180)
                        const tx   = CX + 0.62 * R * Math.cos(mid)
                        const ty   = CY + 0.62 * R * Math.sin(mid)
                        const rot  = (i + 0.5) * ADEG - 90
                        return (
                          <g key={seg.label}>
                            <path d={segPath(i)} fill={i % 2 === 0 ? seg.color : seg.dark} stroke="#070504" strokeWidth="1.5" />
                            <g transform={`translate(${tx.toFixed(1)},${ty.toFixed(1)}) rotate(${rot})`}>
                              <text textAnchor="middle" dominantBaseline="middle" fontSize="16" dy="-11" style={{ userSelect: 'none' }}>
                                {seg.emoji}
                              </text>
                              <text textAnchor="middle" dominantBaseline="middle" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="800" fill="rgba(255,255,255,0.88)" dy="8" letterSpacing="0.1em" style={{ userSelect: 'none' }}>
                                {seg.label.toUpperCase()}
                              </text>
                            </g>
                          </g>
                        )
                      })}
                      {/* Outer ring */}
                      <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                      {/* Center cap */}
                      <circle cx={CX} cy={CY} r="30" fill="#070504" />
                      <circle cx={CX} cy={CY} r="23" fill={GOLD} />
                      <text x={CX} y={CY} textAnchor="middle" dominantBaseline="middle" fontSize="15" fontWeight="900" fill="#1A0E08" fontFamily="Inter, sans-serif" style={{ userSelect: 'none' }}>✦</text>
                    </svg>
                  </div>

                  {/* Glow ring around wheel */}
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    boxShadow: `0 0 60px ${GOLD}20, inset 0 0 30px rgba(0,0,0,0.3)`,
                    pointerEvents: 'none',
                  }} />
                </div>
              </motion.div>

              {/* Actions */}
              <div style={{ marginTop: 40 }}>
                <AnimatePresence mode="wait">
                  {winner ? (
                    <motion.div key="winner-btns"
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                      <button onClick={spin} style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        padding: '12px 24px', borderRadius: 100,
                        border: '1.5px solid rgba(255,255,255,0.15)', background: 'transparent',
                        color: 'rgba(255,240,220,0.55)', fontSize: 13, fontWeight: 600,
                        cursor: 'pointer', fontFamily: '"Inter", sans-serif', transition: 'all 0.2s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.32)'; e.currentTarget.style.color = '#FDFAF6' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,240,220,0.55)' }}
                      >
                        <RefreshCw size={13} /> Spin Again
                      </button>
                      <button onClick={() => { handleClose(); navigate(winner.path) }} style={{
                        padding: '12px 28px', borderRadius: 100, border: 'none',
                        background: winner.color, color: '#fff',
                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        fontFamily: '"Inter", sans-serif',
                        letterSpacing: '0.02em', transition: 'opacity 0.2s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                      >
                        Go to {winner.label} →
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button key="spin-btn"
                      onClick={spin} disabled={spinning}
                      initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      style={{
                        padding: '14px 56px', borderRadius: 100, border: 'none',
                        background: spinning ? 'rgba(196,154,108,0.35)' : GOLD,
                        color: '#1A0E08', fontSize: 16, fontWeight: 800,
                        cursor: spinning ? 'default' : 'pointer',
                        letterSpacing: '0.1em', fontFamily: '"Inter", sans-serif',
                        transition: 'background 0.2s',
                        boxShadow: spinning ? 'none' : `0 4px 28px ${GOLD}45`,
                      }}
                    >
                      {spinning ? 'Spinning…' : 'SPIN !'}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
