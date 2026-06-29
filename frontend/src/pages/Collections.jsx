import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ArrowUpRight, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AmbientBg from '../components/ui/AmbientBg'
import PageStreaks from '../components/ui/PageStreaks'
import collectionsData from '../data/collections.json'

const SERIF  = '"Italiana", "Cormorant Garamond", Georgia, serif'
const BLUE   = '#4169E1'   // royal blue
const BLUE2  = '#1E3FA8'   // deep royal blue
const CREAM  = '#EDE8F5'   // cool cream
const BG     = '#07102A'   // deep navy

// Replace any face photo with abstract atmospheric ones
const HERO_CARDS = [
  { ...collectionsData[0], image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=85' },
  { ...collectionsData[1], image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=85' },
  { ...collectionsData[5], image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=85' },
]

// Bento spans: 6 collections in a 3-col grid with variation
const SPANS = [
  { col: 'span 2', row: 'span 1', aspect: '16/7' },
  { col: 'span 1', row: 'span 2', aspect: '9/16' },
  { col: 'span 1', row: 'span 1', aspect: '4/3' },
  { col: 'span 1', row: 'span 1', aspect: '4/3' },
  { col: 'span 2', row: 'span 1', aspect: '16/7' },
  { col: 'span 1', row: 'span 1', aspect: '4/3' },
]

// Mini cards that drift upward in the hero background — no faces, all objects/scenes
const BG_COLLAGE = [
  { src: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=220&q=70', x: '2%',   y: 820, w: 88,  h: 128, rot: -5,  dur: 36 },
  { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=220&q=70', x: '11%',  y: 500, w: 110, h: 80,  rot: 3,   dur: 28 },
  { src: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=220&q=70', x: '20%',  y: 720, w: 80,  h: 120, rot: -3,  dur: 42 },
  { src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=220&q=70', x: '30%',  y: 350, w: 90,  h: 130, rot: 5,   dur: 33 },
  { src: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=220&q=70', x: '40%',  y: 900, w: 95,  h: 75,  rot: -4,  dur: 38 },
  { src: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=220&q=70', x: '52%',  y: 600, w: 82,  h: 118, rot: 6,   dur: 31 },
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=220&q=70', x: '63%',  y: 780, w: 100, h: 85,  rot: -6,  dur: 45 },
  { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=220&q=70', x: '73%',  y: 420, w: 86,  h: 125, rot: 4,   dur: 29 },
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=220&q=70', x: '83%',  y: 680, w: 105, h: 78,  rot: -2,  dur: 40 },
  { src: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=220&q=70', x: '92%',  y: 900, w: 78,  h: 112, rot: 7,   dur: 34 },
  { src: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=220&q=70', x: '7%',   y: 240, w: 92,  h: 135, rot: -7,  dur: 37 },
  { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=220&q=70', x: '46%',  y: 180, w: 75,  h: 110, rot: 2,   dur: 26 },
]

function CollageBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {BG_COLLAGE.map((c, i) => (
        <motion.div key={i}
          style={{
            position: 'absolute', left: c.x, top: 0,
            width: c.w, height: c.h,
            borderRadius: 12, overflow: 'hidden',
            rotate: c.rot, opacity: 0,
          }}
          initial={{ y: c.y, opacity: 0 }}
          animate={{ y: c.y - 1900, opacity: [0, 0.18, 0.18, 0] }}
          transition={{
            y:       { duration: c.dur, repeat: Infinity, ease: 'linear', repeatDelay: 0 },
            opacity: { duration: c.dur, repeat: Infinity, ease: 'linear', times: [0, 0.06, 0.9, 1] },
          }}
        >
          <img src={c.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {/* Subtle amber tint overlay */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${BLUE}15, transparent 60%)` }} />
          {/* Bottom label bar */}
          <div style={{ position: 'absolute', bottom: 0, inset: 'auto 0 0 0', height: '40%', background: 'linear-gradient(to top, rgba(4,3,2,0.85), transparent)' }} />
        </motion.div>
      ))}

      {/* Soft dark vignette so cards don't fight the text */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 80% at 30% 50%, transparent 40%, rgba(7,16,42,0.82) 100%)' }} />
    </div>
  )
}

const TYPE_EMOJI = {
  movie: '🎬', recipe: '🍝', game: '🎮', book: '📖',
  playlist: '🎵', activity: '🎨', drink: '☕',
}

export default function Collections() {
  const { user, favorites } = useAuth()
  const [tab, setTab]       = useState('featured')

  const userFavorites   = Object.values(favorites)
  const favoritesByType = userFavorites.reduce((acc, item) => {
    const t = item.type || 'other'
    if (!acc[t]) acc[t] = []
    acc[t].push(item)
    return acc
  }, {})

  return (
    <div style={{ background: BG, minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <AmbientBg color1="#0A2080" color2="#041040" color3="#1A40B0" />
      <PageStreaks color={BLUE} />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center' }}>

        {/* Floating mini cards collage */}
        <CollageBackground />

        {/* Background radial glow */}
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${BLUE}22 0%, transparent 65%)`, pointerEvents: 'none', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${BLUE2}18 0%, transparent 65%)`, pointerEvents: 'none', filter: 'blur(30px)' }} />
        <div style={{ position: 'absolute', top: '55%', left: '40%', width: 500, height: 300, borderRadius: '50%', background: `radial-gradient(circle, rgba(100,140,255,0.1) 0%, transparent 70%)`, pointerEvents: 'none', filter: 'blur(50px)' }} />

        {/* Subtle grid texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(65,105,225,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(65,105,225,0.025) 1px, transparent 1px)', backgroundSize: '80px 80px', pointerEvents: 'none' }} />

        <div className="max-w-screen-xl mx-auto px-8 lg:px-14 w-full" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', paddingTop: 120, paddingBottom: 80 }}>

          {/* Left: editorial text */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <div style={{ width: 32, height: 1, background: BLUE, opacity: 0.6 }} />
              <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '10px', letterSpacing: '0.32em', color: BLUE, textTransform: 'uppercase', fontWeight: 600 }}>
                Curated Experiences
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
              style={{ fontFamily: SERIF, fontSize: 'clamp(4.5rem, 9vw, 9.5rem)', lineHeight: 0.88, color: CREAM, letterSpacing: '-0.02em', marginBottom: 28, fontWeight: 400 }}>
              Your<br />
              <em style={{ fontStyle: 'italic', color: BLUE, textShadow: `0 0 80px ${BLUE}60` }}>Curated</em><br />
              Life.
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.22 }}
              style={{ color: '#8090C4', fontSize: '15px', lineHeight: 1.7, maxWidth: '400px', marginBottom: 40 }}>
              Perfect bundles for every mood — the right film, meal, game, and song chosen together so you never have to choose alone.
            </motion.p>

            {/* Tab switcher */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
              style={{ display: 'flex', gap: 10 }}>
              {[{ id: 'featured', label: 'Featured' }, { id: 'saved', label: 'My Favorites' }].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{
                    padding: '11px 26px', borderRadius: '100px',
                    fontFamily: '"Inter", sans-serif', fontSize: '13px', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.25s ease',
                    background: tab === t.id ? BLUE : 'rgba(65,105,225,0.07)',
                    color:      tab === t.id ? BG : BLUE,
                    border:     `1.5px solid ${tab === t.id ? BLUE : 'rgba(65,105,225,0.2)'}`,
                    boxShadow:  tab === t.id ? `0 8px 28px ${BLUE}35` : 'none',
                  }}>
                  {t.label}
                </button>
              ))}
            </motion.div>

            {/* Floating stats row */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ display: 'flex', gap: 32, marginTop: 48 }}>
              {[['20+', 'Collections'], ['7', 'Themes'], ['4–6', 'Items Each']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: SERIF, fontSize: '28px', fontWeight: 600, color: CREAM, lineHeight: 1 }}>{v}</div>
                  <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(65,105,225,0.45)', textTransform: 'uppercase', marginTop: 4, fontFamily: '"Inter", sans-serif' }}>{l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: 3 floating collection cards */}
          <div style={{ position: 'relative', height: '560px' }}>
            {HERO_CARDS.map((col, i) => {
              const positions = [
                { top: '0%',   left: '5%',  rotate: -4, width: 220 },
                { top: '15%',  left: '42%', rotate:  3, width: 200 },
                { top: '48%',  left: '12%', rotate: -2, width: 210 },
              ]
              const p = positions[i]
              return (
                <motion.div key={col.id}
                  initial={{ opacity: 0, y: 40, rotate: p.rotate }}
                  animate={{ opacity: 1, y: [0, -12, 0], rotate: [p.rotate, p.rotate + 1, p.rotate] }}
                  transition={{
                    opacity: { duration: 0.7, delay: 0.3 + i * 0.18 },
                    y:       { duration: 4 + i * 1.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 },
                    rotate:  { duration: 5 + i * 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 },
                  }}
                  style={{
                    position: 'absolute', top: p.top, left: p.left,
                    width: p.width, borderRadius: 16, overflow: 'hidden',
                    boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(65,105,225,0.12)`,
                    cursor: 'pointer',
                  }}>
                  <div style={{ aspectRatio: '3/4', position: 'relative' }}>
                    <img src={col.image} alt={col.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,3,2,0.95) 0%, rgba(4,3,2,0.4) 45%, transparent 100%)' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 14px' }}>
                      <div style={{ fontFamily: SERIF, fontSize: '17px', color: CREAM, lineHeight: 1.2, marginBottom: 4 }}>{col.title}</div>
                      <div style={{ fontSize: '10px', color: 'rgba(65,105,225,0.65)', letterSpacing: '0.06em' }}>{col.tags.slice(0, 2).join(' · ')}</div>
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {/* Rotating orbit ring */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} overflow="visible">
              <motion.ellipse cx="52%" cy="48%" rx="180" ry="120"
                fill="none" stroke={BLUE} strokeWidth="0.6" strokeDasharray="3 14"
                opacity="0.12"
                animate={{ rotate: 360 }}
                transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '52% 48%' }} />
              <motion.ellipse cx="52%" cy="48%" rx="110" ry="72"
                fill="none" stroke={BLUE} strokeWidth="0.5" strokeDasharray="2 10"
                opacity="0.08"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '52% 48%' }} />
            </svg>

            {/* Twinkling constellation dots */}
            {[
              { x: '8%',  y: '12%', r: 2.5 }, { x: '88%', y: '8%',  r: 1.5 },
              { x: '78%', y: '22%', r: 3   }, { x: '15%', y: '38%', r: 1.5 },
              { x: '92%', y: '55%', r: 2   }, { x: '5%',  y: '72%', r: 1.5 },
              { x: '82%', y: '80%', r: 2.5 }, { x: '55%', y: '90%', r: 1.5 },
              { x: '30%', y: '88%', r: 2   }, { x: '65%', y: '14%', r: 1.5 },
            ].map((d, i) => (
              <motion.div key={i} style={{
                position: 'absolute', left: d.x, top: d.y,
                width: d.r * 2, height: d.r * 2, borderRadius: '50%',
                background: BLUE,
                boxShadow: `0 0 ${d.r * 5}px ${d.r * 2}px ${BLUE}70`,
                pointerEvents: 'none',
              }}
                animate={{ opacity: [0.15, 0.7, 0.15], scale: [1, 1.4, 1] }}
                transition={{ duration: 2.4 + i * 0.55, repeat: Infinity, ease: 'easeInOut', delay: i * 0.38 }}
              />
            ))}

            {/* Floating mood tag pills */}
            {[
              { label: '🛋️  Cozy',      x: '60%', y: '8%',  delay: 0    },
              { label: '🌙  Midnight',   x: '6%',  y: '52%', delay: 0.9  },
              { label: '✨  Curated',    x: '70%', y: '78%', delay: 1.7  },
              { label: '🎮  Game Night', x: '2%',  y: '18%', delay: 2.5  },
            ].map((tag, i) => (
              <motion.div key={tag.label}
                style={{
                  position: 'absolute', left: tag.x, top: tag.y,
                  padding: '7px 14px', borderRadius: 100,
                  background: 'rgba(4,8,28,0.75)', backdropFilter: 'blur(16px)',
                  border: `1px solid rgba(65,105,225,0.2)`,
                  color: 'rgba(65,105,225,0.75)',
                  fontSize: '11px', fontFamily: '"Inter",sans-serif', fontWeight: 500,
                  letterSpacing: '0.04em', pointerEvents: 'none', whiteSpace: 'nowrap',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: [0, -8, 0] }}
                transition={{
                  opacity: { duration: 0.6, delay: tag.delay },
                  y: { duration: 4 + i * 0.9, repeat: Infinity, ease: 'easeInOut', delay: tag.delay },
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom fade to content */}
        <div style={{ position: 'absolute', bottom: 0, inset: 'auto 0 0 0', height: 120, background: 'linear-gradient(to bottom, transparent, #07102A)', pointerEvents: 'none' }} />
      </div>

      {/* ── CONTENT SECTION ─────────────────────────────────── */}
      <div style={{ background: '#F5EDD8', paddingBottom: 80, position: 'relative', zIndex: 2 }}>
        <AnimatePresence mode="wait">

          {/* FEATURED */}
          {tab === 'featured' && (
            <motion.div key="featured" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
              className="max-w-screen-xl mx-auto px-8 lg:px-14" style={{ paddingTop: 60 }}>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 40 }}>
                <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2rem,4vw,3.4rem)', color: BG, letterSpacing: '-0.02em', fontWeight: 400 }}>Featured Collections</h2>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(65,105,225,0.25), transparent)', marginLeft: 16 }} />
                <span style={{ fontSize: '12px', color: BLUE, opacity: 0.6, letterSpacing: '0.12em', fontFamily: '"Inter",sans-serif' }}>
                  {collectionsData.length} COLLECTIONS
                </span>
              </div>

              {/* Bento grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, gridAutoRows: '280px' }}>
                {collectionsData.map((col, i) => {
                  const span = SPANS[i] || SPANS[4]
                  return (
                    <motion.div key={col.id}
                      initial={{ opacity: 0, y: 32 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.55, delay: (i % 3) * 0.1 }}
                      style={{ gridColumn: span.col, gridRow: span.row }}>
                      <BentoCard collection={col} aspect={span.aspect} />
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* SAVED */}
          {tab === 'saved' && (
            <motion.div key="saved" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
              className="max-w-screen-xl mx-auto px-8 lg:px-14">

              {!user ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '120px 0', textAlign: 'center' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${BLUE}12`, border: `1.5px solid ${BLUE}25`, marginBottom: 20 }}>
                    <Lock style={{ width: 24, height: 24, color: BLUE }} />
                  </div>
                  <h3 style={{ fontFamily: SERIF, fontSize: '28px', color: BG, marginBottom: 10, fontWeight: 400 }}>Sign in to save favorites</h3>
                  <p style={{ color: '#4A5E9C', fontSize: '14px' }}>Create an account to keep all your favorites in one place.</p>
                </div>
              ) : userFavorites.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '120px 0', textAlign: 'center' }}>
                  <span style={{ fontSize: '52px', marginBottom: 20 }}>💫</span>
                  <h3 style={{ fontFamily: SERIF, fontSize: '28px', color: BG, marginBottom: 10, fontWeight: 400 }}>No favorites yet</h3>
                  <p style={{ color: '#4A5E9C', fontSize: '14px' }}>Start exploring and tap ❤️ to save things you love.</p>
                </div>
              ) : (
                <div style={{ paddingTop: 20 }}>
                  {Object.entries(favoritesByType).map(([type, items]) => (
                    <div key={type} style={{ marginBottom: 48 }}>
                      <h3 style={{ fontFamily: SERIF, fontSize: '24px', color: BG, marginBottom: 20, fontWeight: 400, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span>{TYPE_EMOJI[type] || '⭐'}</span>
                        {type.charAt(0).toUpperCase() + type.slice(1)}s
                        <span style={{ fontSize: '13px', color: '#4A5E9C', fontFamily: '"Inter",sans-serif', fontWeight: 400 }}>({items.length})</span>
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                        {items.map(item => <FavoriteCard key={`${type}_${item.id}`} item={item} />)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function BentoCard({ collection, aspect }) {
  const [hov, setHov] = useState(false)
  const cardRef = useRef(null)
  const handleMouseMove = useCallback((e) => {
    const el = cardRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width  - 0.5
    const y = (e.clientY - r.top)  / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${x*7}deg) rotateX(${-y*5}deg) scale(1.02)`
  }, [])
  const handleLeave = useCallback(() => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(900px) rotateY(0) rotateX(0) scale(1)'
    setHov(false)
  }, [])

  return (
    <div ref={cardRef} onMouseEnter={() => setHov(true)} onMouseMove={handleMouseMove} onMouseLeave={handleLeave}
      style={{
        borderRadius: 20, overflow: 'hidden', height: '100%', cursor: 'pointer',
        border: `1px solid rgba(65,105,225,${hov ? 0.22 : 0.08})`,
        boxShadow: hov ? `0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(65,105,225,0.15), 0 0 60px rgba(65,105,225,0.08)` : '0 8px 32px rgba(0,0,0,0.4)',
        transition: 'box-shadow 0.4s ease, border-color 0.4s ease, transform 0.18s ease',
        transformStyle: 'preserve-3d', willChange: 'transform',
        position: 'relative',
      }}>
      <img src={collection.image} alt={collection.title}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: hov ? 'scale(1.08)' : 'scale(1.01)', transition: 'transform 0.9s cubic-bezier(0.16,1,0.3,1)' }} />

      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(4,3,2,0.97) 0%, rgba(4,3,2,0.65) 40%, rgba(4,3,2,0.2) 70%, transparent 100%)` }} />

      {/* Gradient tint */}
      <div className={`absolute inset-0 bg-gradient-to-br ${collection.color} opacity-30`} />

      {/* Amber bloom on hover */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 100%, ${BLUE}28 0%, transparent 60%)`, opacity: hov ? 1 : 0, transition: 'opacity 0.5s ease', pointerEvents: 'none' }} />

      {/* Top row: emoji + tags */}
      <div style={{ position: 'absolute', top: 18, left: 18, right: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '30px', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}>{collection.emoji}</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {collection.tags.slice(0, 2).map(t => (
            <span key={t} style={{ fontSize: '9px', padding: '5px 10px', borderRadius: 100, background: 'rgba(0,0,0,0.55)', color: 'rgba(65,105,225,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(65,105,225,0.18)', letterSpacing: '0.07em', fontFamily: '"Inter",sans-serif', fontWeight: 600 }}>
              {t.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 22px' }}>
        <h3 style={{ fontFamily: SERIF, fontSize: aspect === '9/16' ? '26px' : '22px', color: CREAM, letterSpacing: '-0.015em', lineHeight: 1.15, marginBottom: 6, textShadow: '0 1px 20px rgba(0,0,0,0.6)' }}>
          {collection.title}
        </h3>
        <p style={{ color: 'rgba(245,238,216,0.45)', fontSize: '12px', lineHeight: 1.6, marginBottom: 14, display: hov ? 'block' : '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {collection.description}
        </p>

        {/* Item pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: hov ? 14 : 0 }}>
          {collection.items.slice(0, 3).map(item => (
            <span key={item.title} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 100, fontSize: '10px', background: 'rgba(65,105,225,0.1)', color: 'rgba(245,238,216,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(65,105,225,0.18)', fontFamily: '"Inter",sans-serif' }}>
              {item.emoji} {item.title}
            </span>
          ))}
        </div>

        {/* Hover CTA */}
        <div style={{ overflow: 'hidden', maxHeight: hov ? '44px' : '0', opacity: hov ? 1 : 0, transition: 'all 0.3s ease', marginTop: hov ? 0 : 0 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 100, background: `${BLUE}CC`, border: `1px solid ${BLUE}60`, color: BG, fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: '"Inter",sans-serif', letterSpacing: '0.04em' }}>
            Explore <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

function FavoriteCard({ item }) {
  const [imgErr, setImgErr] = useState(false)
  const [hov, setHov]       = useState(false)
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title || item.name || 'Item')}&background=1A1208&color=D4A96A&size=400&bold=true&length=2`
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transform: hov ? 'translateY(-6px)' : 'none', boxShadow: hov ? '0 24px 48px rgba(0,0,0,0.6)' : '0 4px 16px rgba(0,0,0,0.4)', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)', border: `1px solid rgba(65,105,225,${hov ? 0.2 : 0.07})` }}>
      <div style={{ position: 'relative', aspectRatio: '2/3' }}>
        <img src={imgErr ? fallback : (item.poster || item.image || fallback)}
          alt={item.title || item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hov ? 'scale(1.07)' : 'scale(1)', transition: 'transform 0.6s ease' }}
          onError={() => setImgErr(true)} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,3,2,0.95) 0%, transparent 55%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 10px' }}>
          <p style={{ fontFamily: SERIF, fontSize: '13px', color: CREAM, lineHeight: 1.3 }}>
            {item.title || item.name}
          </p>
        </div>
      </div>
    </div>
  )
}
