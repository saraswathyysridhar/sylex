import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const SERIF = '"Bodoni Moda", "Cormorant Garamond", Georgia, serif'
const GOLD  = '#C49A6C'

const MOODS = [
  {
    id: 'energized', emoji: '⚡', label: 'Energized',
    color: '#C4703A',
    desc: "Let's channel that energy.",
    picks: [
      { emoji: '🏃', label: 'Activities', path: '/activities' },
      { emoji: '🎮', label: 'Games',       path: '/games' },
      { emoji: '🎵', label: 'Music',       path: '/music' },
    ],
  },
  {
    id: 'cozy', emoji: '🌙', label: 'Cozy',
    color: '#5A9FBF',
    desc: "Perfect night to stay in.",
    picks: [
      { emoji: '🎬', label: 'Films',   path: '/movies' },
      { emoji: '🍝', label: 'Recipes', path: '/recipes' },
      { emoji: '🥂', label: 'Drinks',  path: '/drinks' },
    ],
  },
  {
    id: 'bored', emoji: '😶', label: 'Bored',
    color: '#CC2222',
    desc: "Let's fix that immediately.",
    picks: [
      { emoji: '🎮', label: 'Games',       path: '/games' },
      { emoji: '🌿', label: 'Activities',  path: '/activities' },
      { emoji: '✨', label: 'Collections', path: '/collections' },
    ],
  },
  {
    id: 'stressed', emoji: '😮‍💨', label: 'Stressed',
    color: '#4D7A52',
    desc: "You need this. We've got you.",
    picks: [
      { emoji: '🎵', label: 'Music',       path: '/music' },
      { emoji: '🥂', label: 'Drinks',      path: '/drinks' },
      { emoji: '🌿', label: 'Activities',  path: '/activities' },
    ],
  },
  {
    id: 'romantic', emoji: '🌹', label: 'Romantic',
    color: '#D4956A',
    desc: "Make tonight memorable.",
    picks: [
      { emoji: '🎬', label: 'Films',   path: '/movies' },
      { emoji: '🥂', label: 'Drinks',  path: '/drinks' },
      { emoji: '🍝', label: 'Recipes', path: '/recipes' },
    ],
  },
  {
    id: 'focused', emoji: '🎯', label: 'Focused',
    color: '#8B5E3C',
    desc: "Deep work, deep rewards.",
    picks: [
      { emoji: '📚', label: 'Books',       path: '/books' },
      { emoji: '🎵', label: 'Music',       path: '/music' },
      { emoji: '🌿', label: 'Activities',  path: '/activities' },
    ],
  },
]

const SK = 'sylex_mood_checkin'

export default function MoodCheckIn() {
  const navigate  = useNavigate()
  const [selected, setSelected] = useState(() => sessionStorage.getItem(SK) || null)

  const activeMood = MOODS.find(m => m.id === selected)

  const choose = (id) => {
    setSelected(id)
    sessionStorage.setItem(SK, id)
  }

  const clear = () => {
    setSelected(null)
    sessionStorage.removeItem(SK)
  }

  return (
    <section style={{
      background: '#F7F3EE',
      padding: '72px 0',
      borderBottom: '1px solid rgba(28,26,24,0.07)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 32 }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: GOLD, marginBottom: 8, fontFamily: '"Inter", sans-serif' }}>
            Mood Check-In
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#1C1A18', fontWeight: 600, lineHeight: 0.95, letterSpacing: '-0.03em' }}>
            How are you <em style={{ color: GOLD, fontStyle: 'italic' }}>feeling?</em>
          </h2>
        </motion.div>

        {/* Mood tiles */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 10, marginBottom: 28,
        }} className="mood-grid">
          {MOODS.map((mood, i) => {
            const active = selected === mood.id
            return (
              <motion.button
                key={mood.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                onClick={() => active ? clear() : choose(mood.id)}
                style={{
                  padding: '20px 14px', borderRadius: 18, textAlign: 'center',
                  background: active ? `${mood.color}18` : '#fff',
                  border: `1.5px solid ${active ? mood.color : 'rgba(28,26,24,0.08)'}`,
                  cursor: 'pointer',
                  boxShadow: active ? `0 6px 24px ${mood.color}22` : '0 2px 8px rgba(28,26,24,0.05)',
                  transition: 'all 0.22s',
                  transform: active ? 'translateY(-3px)' : '',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.borderColor = mood.color
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.boxShadow = `0 6px 20px ${mood.color}18`
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.borderColor = 'rgba(28,26,24,0.08)'
                    e.currentTarget.style.transform = ''
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(28,26,24,0.05)'
                  }
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{mood.emoji}</div>
                <div style={{
                  fontSize: 12.5, fontWeight: 700,
                  color: active ? mood.color : '#1C1A18',
                  fontFamily: '"Inter", sans-serif',
                  transition: 'color 0.2s',
                }}>
                  {mood.label}
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Recommendation strip */}
        <AnimatePresence mode="wait">
          {activeMood && (
            <motion.div
              key={activeMood.id}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              style={{
                padding: '28px 32px',
                borderRadius: 20,
                background: `linear-gradient(135deg, ${activeMood.color}10, ${activeMood.color}05)`,
                border: `1.5px solid ${activeMood.color}28`,
                display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{activeMood.emoji}</div>
                <div style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                  color: '#1C1A18', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4,
                }}>
                  {activeMood.label} mode activated.
                </div>
                <p style={{ fontSize: 13, color: '#7A7268', fontFamily: '"Inter", sans-serif' }}>
                  {activeMood.desc}
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {activeMood.picks.map((pick, i) => (
                  <motion.button
                    key={pick.path}
                    initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                    onClick={() => navigate(pick.path)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '12px 22px', borderRadius: 100,
                      background: activeMood.color,
                      border: 'none',
                      color: '#fff',
                      fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      fontFamily: '"Inter", sans-serif',
                      boxShadow: `0 4px 16px ${activeMood.color}40`,
                      transition: 'all 0.18s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${activeMood.color}55` }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 4px 16px ${activeMood.color}40` }}
                  >
                    {pick.emoji} {pick.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 900px)  { .mood-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 520px)  { .mood-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  )
}
