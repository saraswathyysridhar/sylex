import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Shuffle, RefreshCw } from 'lucide-react'

const SERIF = '"Bodoni Moda", "Cormorant Garamond", Georgia, serif'
const GOLD  = '#C49A6C'

// ── Recipe pools per dietary preference ──────────────────────────────────────
const RECIPE_POOLS = {
  all: [
    'Pasta Carbonara', 'Ramen from Scratch', 'Shakshuka', 'Pad Thai',
    'Korean BBQ', 'Beef Wellington', 'Avocado Toast', 'Mango Sticky Rice',
    'Lobster Pasta', 'Bibimbap', 'Cacio e Pepe', 'Eggs Benedict',
    'Fish Tacos', 'Butter Chicken', 'Mushroom Risotto',
  ],
  veg: [
    'Shakshuka', 'Avocado Toast', 'Mango Sticky Rice', 'Mushroom Risotto',
    'Cacio e Pepe', 'Palak Paneer', 'Dal Makhani', 'Caprese Salad',
    'Falafel Bowl', 'Veggie Biryani', 'Tomato Soup + Grilled Cheese',
    'Aloo Paratha', 'Paneer Tikka Masala', 'Aglio e Olio', 'Veggie Tacos',
  ],
  vegan: [
    'Avocado Toast', 'Mango Sticky Rice', 'Falafel Bowl', 'Tomato Soup',
    'Veggie Tacos', 'Dal (vegan)', 'Veggie Stir Fry', 'Roasted Veggie Bowl',
    'Hummus + Pita Board', 'Lentil Curry', 'Pasta Pomodoro',
    'Coconut Rice + Stir Fry', 'Black Bean Tacos', 'Aloo Gobi',
  ],
}

// ── Base pools (non-food categories stay the same for all diets) ──────────────
const BASE_POOL = {
  movie: [
    'Parasite', 'La La Land', 'Whiplash', 'Amélie', 'Arrival',
    'Dune (2021)', 'Mad Max: Fury Road', 'Get Out', 'Knives Out',
    'The Martian', 'Everything Everywhere…', 'Her', 'Interstellar',
    'Spirited Away', 'The Princess Bride', 'Before Sunrise',
  ],
  drink: [
    'Espresso Martini', 'Matcha Latte', 'Aperol Spritz', 'Chamomile Tea',
    'Cold Brew', 'Champagne', 'Mojito', 'Golden Milk',
    'Elderflower Spritz', 'Dalgona Coffee', 'Negroni', 'Mango Lassi',
    'Cortado', 'Iced Caramel Latte', 'Old Fashioned',
  ],
  music: [
    'Lo-fi Chill Beats', 'Soft Jazz', 'Ambient Focus', 'Dance EDM',
    'Acoustic Love Songs', 'Classical Study', 'Neo-Soul Vibes',
    'Late Night Jazz', 'Road Trip Playlist', 'Bedroom Pop', 'Afrobeats',
    'Bollywood Classics', 'Tamil Kuthu', 'Indie Explorer',
  ],
  activity: [
    'Photography walk', 'Cook something new', 'Candlelit journaling',
    'Escape room', 'Stargazing', 'Long bath + good book',
    'Board game night', 'Solo hike', 'Home cocktail challenge',
    'Learn something online', 'Outdoor yoga', 'Explore a new café',
    'Sketch portraits', 'City cycling trail', 'Museum visit',
  ],
  book: [
    'Atomic Habits', 'Normal People', 'The Alchemist', 'Big Magic',
    'Dune', 'The Midnight Library', 'Into the Wild', 'Educated',
    'Shoe Dog', 'Project Hail Mary', 'The Name of the Wind',
    'Essentialism', 'ACOTAR', 'The Kite Runner', 'Pachinko',
  ],
}

const DIET_OPTS = [
  { id: 'all',   label: 'No restrictions', emoji: '🍽️' },
  { id: 'veg',   label: 'Vegetarian',      emoji: '🌱' },
  { id: 'vegan', label: 'Vegan',            emoji: '🌿' },
]

const CATS = [
  { key: 'movie',    emoji: '🎬', label: 'Film',     color: '#5A9FBF' },
  { key: 'recipe',   emoji: '🍽️', label: 'Recipe',   color: '#C4703A' },
  { key: 'drink',    emoji: '🥂', label: 'Drink',    color: '#D4956A' },
  { key: 'music',    emoji: '🎵', label: 'Music',    color: '#3A9B7A' },
  { key: 'activity', emoji: '✨', label: 'Activity', color: '#4D7A52' },
  { key: 'book',     emoji: '📚', label: 'Book',     color: '#8B5E3C' },
]

const SETTLE_AT = [1200, 1650, 2100, 2550, 3000, 3450]
const DONE_AT   = 4000

// Returns the full pool object merged with the active recipe pool
function getPools(diet) {
  return { ...BASE_POOL, recipe: RECIPE_POOLS[diet] }
}

// ── Single slot card ──────────────────────────────────────────────────────────
function SlotCard({ cat, finalValue, settleAt, runId, pool }) {
  const [text, setText]       = useState(pool[0])
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    setText(pool[0])
    setSettled(false)

    let idx = 0
    const iv = setInterval(() => {
      idx = (idx + 1) % pool.length
      setText(pool[idx])
    }, 58)

    const t = setTimeout(() => {
      clearInterval(iv)
      setText(finalValue)
      setSettled(true)
    }, settleAt)

    return () => { clearInterval(iv); clearTimeout(t) }
  }, [runId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      animate={settled ? { scale: [1, 1.035, 0.99, 1.01, 1] } : {}}
      transition={settled ? { duration: 0.5, ease: 'easeOut' } : {}}
      style={{
        padding: '22px 18px', borderRadius: 18, minHeight: 148,
        background: settled ? `${cat.color}12` : 'rgba(255,255,255,0.03)',
        border: `1.5px solid ${settled ? `${cat.color}50` : 'rgba(255,255,255,0.07)'}`,
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        transition: 'background 0.5s, border-color 0.5s',
      }}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: settled ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2.5,
          background: cat.color, transformOrigin: 'left',
        }}
      />
      {settled && (
        <div style={{
          position: 'absolute', top: 0, right: 0, width: 100, height: 100,
          background: `radial-gradient(circle at top right, ${cat.color}18 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
        <span style={{ fontSize: 18 }}>{cat.emoji}</span>
        <span style={{
          fontSize: 9.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: settled ? cat.color : 'rgba(255,240,220,0.28)', transition: 'color 0.4s',
        }}>
          {cat.label}
        </span>
        <AnimatePresence>
          {settled && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              style={{
                marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%',
                background: cat.color, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 10, color: '#0C0A08', fontWeight: 800,
              }}
            >✓</motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{
        fontFamily: SERIF,
        fontSize: settled ? 18 : 13.5,
        color: settled ? '#FDFAF6' : 'rgba(255,240,220,0.32)',
        lineHeight: 1.3, fontWeight: settled ? 600 : 400,
        filter: settled ? 'none' : 'blur(0.5px)',
        transition: 'font-size 0.3s, color 0.3s, filter 0.3s',
        flex: 1, display: 'flex', alignItems: 'center',
      }}>
        {text}
      </div>
    </motion.div>
  )
}

// ── Main SurpriseMe ───────────────────────────────────────────────────────────
export default function SurpriseMe() {
  const [open, setOpen]     = useState(false)
  const [result, setResult] = useState(null)
  const [runId, setRunId]   = useState(0)
  const [done, setDone]     = useState(false)
  // Persist diet preference in localStorage
  const [diet, setDietState] = useState(
    () => localStorage.getItem('sylex_surprise_diet') || 'all'
  )
  const dietRef  = useRef(diet)
  const timerRef = useRef(null)

  const setDiet = (d) => {
    dietRef.current = d
    setDietState(d)
    localStorage.setItem('sylex_surprise_diet', d)
  }

  const pickAll = useCallback((activeDiet) => {
    const pools = getPools(activeDiet)
    const r = {}
    CATS.forEach(c => {
      r[c.key] = pools[c.key][Math.floor(Math.random() * pools[c.key].length)]
    })
    return r
  }, [])

  const spin = useCallback((activeDiet) => {
    const d = activeDiet ?? dietRef.current
    clearTimeout(timerRef.current)
    setDone(false)
    setResult(pickAll(d))
    setRunId(id => id + 1)
    timerRef.current = setTimeout(() => setDone(true), DONE_AT)
  }, [pickAll])

  // When diet changes: update ref + immediately re-spin
  const handleDietChange = (d) => {
    setDiet(d)
    spin(d)
  }

  const handleOpen = () => {
    setOpen(true)
    setTimeout(() => spin(dietRef.current), 280)
  }

  const handleClose = () => {
    setOpen(false)
    clearTimeout(timerRef.current)
    setDone(false)
    setResult(null)
  }

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const activePools = getPools(diet)

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        onClick={handleOpen}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 22px', borderRadius: 100,
          background: 'rgba(255,255,255,0.07)',
          border: '1.5px solid rgba(255,255,255,0.13)',
          color: 'rgba(255,240,220,0.7)', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', fontFamily: '"Inter", sans-serif',
          backdropFilter: 'blur(10px)', transition: 'all 0.2s',
          letterSpacing: '0.01em',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.13)'
          e.currentTarget.style.color = '#FDFAF6'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
          e.currentTarget.style.color = 'rgba(255,240,220,0.7)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'
        }}
      >
        <Shuffle size={13} /> Surprise Me
      </button>

      {/* ── Full-screen overlay ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 10000,
              background: '#060503', overflowY: 'auto',
            }}
          >
            {/* Ambient glow */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
              <div style={{
                position: 'absolute', top: '25%', left: '15%', width: 600, height: 600,
                borderRadius: '50%', background: 'rgba(196,154,108,0.04)', filter: 'blur(100px)',
              }} />
              <div style={{
                position: 'absolute', bottom: '15%', right: '10%', width: 450, height: 450,
                borderRadius: '50%', background: 'rgba(90,159,191,0.04)', filter: 'blur(90px)',
              }} />
            </div>

            {/* Close */}
            <button
              onClick={handleClose}
              style={{
                position: 'fixed', top: 20, right: 20, zIndex: 1,
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
            <div style={{ maxWidth: 920, margin: '0 auto', padding: '64px 24px 72px', position: 'relative', zIndex: 1 }}>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ textAlign: 'center', marginBottom: 32 }}
              >
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '5px 16px', borderRadius: 100,
                  background: 'rgba(196,154,108,0.1)', border: '1px solid rgba(196,154,108,0.22)',
                  marginBottom: 20,
                }}>
                  <Shuffle size={11} color={GOLD} />
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.22em',
                    textTransform: 'uppercase', color: GOLD, fontFamily: '"Inter", sans-serif',
                  }}>Surprise Me</span>
                </div>

                <h1 style={{
                  fontFamily: SERIF, fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
                  color: '#FDFAF6', lineHeight: 0.92, letterSpacing: '-0.03em',
                  fontWeight: 600, minHeight: '1.2em',
                }}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={done ? 'done' : 'spin'}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28 }}
                      style={{ display: 'block' }}
                    >
                      {done
                        ? <><em style={{ color: GOLD, fontStyle: 'italic' }}>That's</em> your evening.</>
                        : <>Finding something <em style={{ color: GOLD, fontStyle: 'italic' }}>perfect…</em></>
                      }
                    </motion.span>
                  </AnimatePresence>
                </h1>
              </motion.div>

              {/* ── Dietary preference ── */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 40 }}
              >
                <span style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'rgba(255,240,220,0.28)',
                  fontFamily: '"Inter", sans-serif',
                }}>
                  Recipe
                </span>
                {DIET_OPTS.map(opt => {
                  const active = diet === opt.id
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleDietChange(opt.id)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '6px 14px', borderRadius: 100,
                        background: active ? GOLD : 'rgba(255,255,255,0.06)',
                        border: `1.5px solid ${active ? GOLD : 'rgba(255,255,255,0.1)'}`,
                        color: active ? '#1A0E08' : 'rgba(255,240,220,0.5)',
                        fontSize: 12.5, fontWeight: active ? 700 : 500,
                        cursor: 'pointer', fontFamily: '"Inter", sans-serif',
                        transition: 'all 0.18s',
                      }}
                      onMouseEnter={e => {
                        if (!active) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                          e.currentTarget.style.color = 'rgba(255,240,220,0.8)'
                        }
                      }}
                      onMouseLeave={e => {
                        if (!active) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                          e.currentTarget.style.color = 'rgba(255,240,220,0.5)'
                        }
                      }}
                    >
                      <span style={{ fontSize: 14 }}>{opt.emoji}</span>
                      {opt.label}
                    </button>
                  )
                })}
              </motion.div>

              {/* Slot grid */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.38, delay: 0.08 }}
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
                  className="surprise-grid"
                >
                  {CATS.map((cat, i) => (
                    <SlotCard
                      key={`${cat.key}-${runId}`}
                      cat={cat}
                      finalValue={result[cat.key]}
                      settleAt={SETTLE_AT[i]}
                      runId={runId}
                      pool={activePools[cat.key]}
                    />
                  ))}
                </motion.div>
              )}

              {/* Actions */}
              <AnimatePresence>
                {done && (
                  <motion.div
                    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 44, flexWrap: 'wrap' }}
                  >
                    <button
                      onClick={() => spin()}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '12px 28px', borderRadius: 100,
                        border: '1.5px solid rgba(255,255,255,0.15)',
                        background: 'transparent', color: 'rgba(255,240,220,0.55)',
                        fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        fontFamily: '"Inter", sans-serif', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.32)'; e.currentTarget.style.color = '#FDFAF6' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,240,220,0.55)' }}
                    >
                      <RefreshCw size={13} /> Spin Again
                    </button>
                    <button
                      onClick={handleClose}
                      style={{
                        padding: '12px 32px', borderRadius: 100, border: 'none',
                        background: GOLD, color: '#1A0E08', fontSize: 13, fontWeight: 700,
                        cursor: 'pointer', fontFamily: '"Inter", sans-serif',
                        letterSpacing: '0.02em', transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#D4A87A'}
                      onMouseLeave={e => e.currentTarget.style.background = GOLD}
                    >
                      Let's go →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <style>{`
              @media (max-width: 660px) { .surprise-grid { grid-template-columns: repeat(2,1fr) !important; } }
              @media (max-width: 420px) { .surprise-grid { grid-template-columns: 1fr !important; } }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
