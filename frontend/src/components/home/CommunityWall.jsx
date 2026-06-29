import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, MessageSquareHeart, X } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { useAuth } from '../../context/AuthContext'

const SERIF = '"Bodoni Moda", "Cormorant Garamond", Georgia, serif'
const GOLD  = '#C49A6C'

const CAT_OPTS = [
  { key: 'movie',    emoji: '🎬', label: 'Movie',    color: '#5A9FBF' },
  { key: 'recipe',   emoji: '🍽️', label: 'Recipe',   color: '#C4703A' },
  { key: 'game',     emoji: '🎮', label: 'Game',     color: '#CC2222' },
  { key: 'book',     emoji: '📚', label: 'Book',     color: '#8B5E3C' },
  { key: 'playlist', emoji: '🎵', label: 'Playlist', color: '#3A9B7A' },
  { key: 'activity', emoji: '✨', label: 'Activity', color: '#4D7A52' },
  { key: 'drink',    emoji: '🥂', label: 'Drink',    color: '#D4956A' },
]

function timeAgo(iso) {
  const d = Date.now() - new Date(iso).getTime()
  const m = Math.floor(d / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return m + 'm ago'
  const h = Math.floor(m / 60)
  if (h < 24) return h + 'h ago'
  return Math.floor(h / 24) + 'd ago'
}

function loadWall() {
  try { return JSON.parse(localStorage.getItem('sylex_wall') || '[]') } catch { return [] }
}
function saveWall(arr) {
  localStorage.setItem('sylex_wall', JSON.stringify(arr))
}

function PickCard({ pick, userId, onRemove, delay }) {
  const canRemove = pick.userId === userId || !pick.userId
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.32 }}
      style={{
        borderRadius: 14, overflow: 'hidden',
        background: '#FFFFFF',
        border: '1px solid rgba(28,26,24,0.07)',
        boxShadow: '0 2px 8px rgba(28,26,24,0.05)',
        cursor: 'default',
      }}
    >
      <div style={{ height: 3, background: pick.color }} />
      <div style={{ padding: '12px 13px 13px' }}>

        {/* Category row + remove btn */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 18 }}>{pick.emoji}</span>
            <span style={{
              fontSize: 8.5, fontWeight: 800, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: pick.color,
              fontFamily: '"Inter", sans-serif',
            }}>
              {pick.categoryLabel}
            </span>
          </div>
          {canRemove && (
            <button
              onClick={() => onRemove(pick.id)}
              title="Remove"
              style={{
                width: 18, height: 18, borderRadius: '50%',
                background: 'rgba(28,26,24,0.06)', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.14)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(28,26,24,0.06)' }}
            >
              <X size={9} color="#9A9288" />
            </button>
          )}
        </div>

        {/* Title */}
        <p style={{
          fontFamily: SERIF, fontSize: 14, color: '#1C1A18', fontWeight: 600,
          lineHeight: 1.3, marginBottom: 11,
          display: '-webkit-box', WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {pick.title}
        </p>

        {/* Author + time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{
            width: 18, height: 18, borderRadius: '50%',
            background: pick.color + '22', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 8.5, fontWeight: 800, color: pick.color,
          }}>
            {(pick.userName || 'G')[0].toUpperCase()}
          </div>
          <span style={{ fontSize: 10, color: '#A09888', fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>
            {pick.userName} · {timeAgo(pick.timestamp)}
          </span>
        </div>

      </div>
    </motion.div>
  )
}

export default function CommunityWall() {
  const { user } = useAuth()
  const [picks, setPicks]       = useState(loadWall)
  const [category, setCategory] = useState('movie')
  const [title, setTitle]       = useState('')
  const [flash, setFlash]       = useState(false)
  const flashTimer = useRef(null)
  const inputRef   = useRef(null)

  useEffect(() => { setPicks(loadWall()) }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const t = title.trim()
    if (!t) return
    const cat = CAT_OPTS.find(c => c.key === category)
    const pick = {
      id:            Date.now() + '-' + Math.random().toString(36).slice(2),
      userId:        user ? user.id : null,
      userName:      user ? user.name : 'Guest',
      category:      cat.key,
      categoryLabel: cat.label,
      emoji:         cat.emoji,
      color:         cat.color,
      title:         t,
      timestamp:     new Date().toISOString(),
    }
    const updated = [pick, ...picks].slice(0, 60)
    setPicks(updated)
    saveWall(updated)
    setTitle('')
    setFlash(true)
    clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setFlash(false), 2200)
  }

  const removePick = (id) => {
    const updated = picks.filter(p => p.id !== id)
    setPicks(updated)
    saveWall(updated)
  }

  const activePlaceholder = 'What ' + (CAT_OPTS.find(c => c.key === category) || CAT_OPTS[0]).label.toLowerCase() + ' are you into right now?'

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55 }}
      className="max-w-screen-xl mx-auto px-6 lg:px-14"
      style={{ marginBottom: 8 }}
    >

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: GOLD + '1A', border: '1.5px solid ' + GOLD + '35',
        }}>
          <MessageSquareHeart size={15} style={{ color: GOLD }} />
        </div>
        <div>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, fontFamily: '"Inter", sans-serif', lineHeight: 1 }}>
            Community Wall
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', color: '#1C1A18', fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            What are <em style={{ color: GOLD, fontStyle: 'italic' }}>you</em> loving?
          </div>
        </div>
      </div>

      {/* Submit form */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#FFFFFF', borderRadius: 18,
          padding: '18px 20px',
          marginBottom: picks.length > 0 ? 20 : 0,
          border: '1px solid rgba(28,26,24,0.08)',
          boxShadow: '0 2px 14px rgba(28,26,24,0.06)',
        }}
      >
        {/* Category chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {CAT_OPTS.map(c => {
            const active = category === c.key
            return (
              <button
                type="button"
                key={c.key}
                onClick={() => setCategory(c.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '5px 11px', borderRadius: 100,
                  background: active ? c.color : 'rgba(28,26,24,0.05)',
                  border: '1.5px solid ' + (active ? c.color : 'rgba(28,26,24,0.09)'),
                  color: active ? '#fff' : '#7A7268',
                  fontSize: 11.5, fontWeight: active ? 700 : 500,
                  cursor: 'pointer', fontFamily: '"Inter", sans-serif',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 13 }}>{c.emoji}</span> {c.label}
              </button>
            )
          })}
        </div>

        {/* Input row */}
        <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
          <input
            ref={inputRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={activePlaceholder}
            maxLength={80}
            style={{
              flex: 1, padding: '10px 16px', borderRadius: 100,
              border: '1.5px solid rgba(28,26,24,0.12)',
              background: '#FDFAF6', color: '#1C1A18', fontSize: 13.5,
              outline: 'none', fontFamily: '"Inter", sans-serif',
              transition: 'border-color 0.2s',
            }}
            onFocus={e  => { e.target.style.borderColor = GOLD }}
            onBlur={e   => { e.target.style.borderColor = 'rgba(28,26,24,0.12)' }}
          />
          <button
            type="submit"
            disabled={!title.trim()}
            style={{
              flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', borderRadius: 100, border: 'none',
              background: flash ? '#4D7A52' : GOLD,
              color: flash ? '#fff' : '#1A0E08',
              fontSize: 12.5, fontWeight: 700,
              cursor: title.trim() ? 'pointer' : 'default',
              opacity: title.trim() ? 1 : 0.45,
              fontFamily: '"Inter", sans-serif',
              transition: 'background 0.25s, color 0.25s, opacity 0.2s',
            }}
          >
            {flash
              ? <span>&#10003; Shared!</span>
              : <><Send size={12} /> Share</>
            }
          </button>
        </div>
      </form>

      {/* Picks carousel */}
      {picks.length > 0 && (
        <Swiper
          modules={[FreeMode]}
          freeMode
          slidesPerView="auto"
          spaceBetween={11}
          grabCursor
          style={{ overflow: 'visible' }}
        >
          {picks.map((pick, i) => (
            <SwiperSlide key={pick.id} style={{ width: 168 }}>
              <PickCard
                pick={pick}
                userId={user ? user.id : null}
                onRemove={removePick}
                delay={Math.min(i, 8) * 0.04}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

    </motion.div>
  )
}
