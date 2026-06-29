import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'

const GOLD = '#C49A6C'

const STEPS = [
  {
    key: 'energy', q: 'Energy level?',
    opts: [
      { id: 'low',    label: 'Low',    emoji: '😌' },
      { id: 'medium', label: 'Medium', emoji: '😊' },
      { id: 'high',   label: 'High',   emoji: '⚡' },
    ],
  },
  {
    key: 'company', q: "You're with…",
    opts: [
      { id: 'solo',    label: 'Just me',  emoji: '🌙' },
      { id: 'partner', label: 'Partner',  emoji: '🌹' },
      { id: 'friends', label: 'Friends',  emoji: '🎉' },
    ],
  },
  {
    key: 'vibe', q: 'Mood?',
    opts: [
      { id: 'chill',   label: 'Cozy',    emoji: '🛋️' },
      { id: 'active',  label: 'Active',  emoji: '🏃' },
      { id: 'explore', label: 'Explore', emoji: '✨' },
    ],
  },
]

const CATS = {
  '/movies':      { label: 'Films',       emoji: '🎬', color: '#5A9FBF' },
  '/recipes':     { label: 'Recipes',     emoji: '🍽️', color: '#C4703A' },
  '/drinks':      { label: 'Drinks',      emoji: '🥂', color: '#D4956A' },
  '/books':       { label: 'Books',       emoji: '📚', color: '#8B5E3C' },
  '/music':       { label: 'Music',       emoji: '🎵', color: '#3A9B7A' },
  '/activities':  { label: 'Activities',  emoji: '🌿', color: '#4D7A52' },
  '/games':       { label: 'Games',       emoji: '🎮', color: '#CC2222' },
  '/collections': { label: 'Collections', emoji: '🌟', color: GOLD },
  '/planner':     { label: 'Planner',     emoji: '🗓️', color: GOLD },
}

const R = {
  low_solo_chill:       { label: 'Cozy Solo Night',    emoji: '🌙', picks: ['/movies', '/recipes', '/drinks'] },
  low_solo_active:      { label: 'Gentle Discovery',   emoji: '📚', picks: ['/books', '/music', '/activities'] },
  low_solo_explore:     { label: 'Curious Evening',    emoji: '🔍', picks: ['/books', '/collections', '/music'] },
  low_partner_chill:    { label: 'Romantic Evening',   emoji: '🌹', picks: ['/movies', '/drinks', '/recipes'] },
  low_partner_active:   { label: 'Slow Date Night',    emoji: '☕', picks: ['/recipes', '/drinks', '/planner'] },
  low_partner_explore:  { label: 'Date Discovery',     emoji: '✨', picks: ['/collections', '/movies', '/drinks'] },
  low_friends_chill:    { label: 'Cozy Group Night',   emoji: '🛋️', picks: ['/movies', '/recipes', '/drinks'] },
  low_friends_active:   { label: 'Chill Hangout',      emoji: '🎲', picks: ['/games', '/recipes', '/drinks'] },
  low_friends_explore:  { label: 'Group Discovery',    emoji: '🎉', picks: ['/collections', '/games', '/drinks'] },
  medium_solo_chill:    { label: 'Balanced Evening',   emoji: '🎵', picks: ['/music', '/movies', '/recipes'] },
  medium_solo_active:   { label: 'Focused Flow',       emoji: '🎯', picks: ['/activities', '/music', '/books'] },
  medium_solo_explore:  { label: 'Creative Solo',      emoji: '🎨', picks: ['/activities', '/books', '/music'] },
  medium_partner_chill: { label: 'Cozy Date Night',    emoji: '🍝', picks: ['/recipes', '/drinks', '/movies'] },
  medium_partner_active:{ label: 'Active Date',        emoji: '🌿', picks: ['/activities', '/recipes', '/drinks'] },
  medium_partner_explore:{ label: 'Adventure Date',    emoji: '🗺️', picks: ['/collections', '/activities', '/drinks'] },
  medium_friends_chill: { label: 'Friends & Food',     emoji: '🍕', picks: ['/recipes', '/games', '/drinks'] },
  medium_friends_active:{ label: 'Group Hangout',      emoji: '🎮', picks: ['/games', '/activities', '/music'] },
  medium_friends_explore:{ label: 'Fun Night Out',     emoji: '🎊', picks: ['/activities', '/games', '/drinks'] },
  high_solo_chill:      { label: 'High Energy Solo',   emoji: '⚡', picks: ['/music', '/activities', '/games'] },
  high_solo_active:     { label: 'Solo Power Mode',    emoji: '🏃', picks: ['/activities', '/music', '/games'] },
  high_solo_explore:    { label: 'Solo Adventure',     emoji: '🌟', picks: ['/activities', '/collections', '/games'] },
  high_partner_chill:   { label: 'Energetic Date',     emoji: '💫', picks: ['/activities', '/drinks', '/recipes'] },
  high_partner_active:  { label: 'Active Date Night',  emoji: '💪', picks: ['/activities', '/music', '/drinks'] },
  high_partner_explore: { label: 'Adventure Together', emoji: '🚀', picks: ['/activities', '/collections', '/drinks'] },
  high_friends_chill:   { label: 'Party Night',        emoji: '🎉', picks: ['/drinks', '/music', '/games'] },
  high_friends_active:  { label: 'Squad Goals',        emoji: '🔥', picks: ['/activities', '/games', '/music'] },
  high_friends_explore: { label: 'Epic Night',         emoji: '💥', picks: ['/activities', '/collections', '/drinks'] },
}

export default function VibeQuiz() {
  const navigate = useNavigate()
  const [step, setStep]       = useState(0)
  const [answers, setAnswers] = useState({})

  const pick = (optId) => {
    const newA = { ...answers, [STEPS[step].key]: optId }
    setAnswers(newA)
    setStep(s => s + 1)
  }

  const reset = () => { setAnswers({}); setStep(0) }

  const resultKey = `${answers.energy}_${answers.company}_${answers.vibe}`
  const result = R[resultKey]

  return (
    <div style={{ marginBottom: '20px' }}>
      <AnimatePresence mode="wait">

        {/* ── Steps 0-2 ── */}
        {step < 3 && (
          <motion.div key={`step-${step}`}
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}
          >
            {/* Progress dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 9 }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{
                  height: 4, borderRadius: 100, transition: 'all 0.3s',
                  width: i === step ? 18 : 5,
                  background: i < step ? GOLD : i === step ? GOLD : 'rgba(255,255,255,0.15)',
                }} />
              ))}
              <span style={{ fontSize: 10, color: 'rgba(255,240,220,0.28)', fontFamily: '"Inter", sans-serif', marginLeft: 3 }}>
                {step + 1}/3
              </span>
            </div>

            <p style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,240,220,0.5)', fontFamily: '"Inter", sans-serif', marginBottom: 9 }}>
              {STEPS[step].q}
            </p>

            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {STEPS[step].opts.map(opt => (
                <button key={opt.id} onClick={() => pick(opt.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 15px', borderRadius: 100,
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.13)',
                    color: 'rgba(255,240,220,0.68)',
                    fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                    fontFamily: '"Inter", sans-serif', transition: 'all 0.16s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = '#1A0E08' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'; e.currentTarget.style.color = 'rgba(255,240,220,0.68)' }}
                >
                  <span style={{ fontSize: 14 }}>{opt.emoji}</span> {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Result ── */}
        {step === 3 && result && (
          <motion.div key="result"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 16 }}>{result.emoji}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#FDFAF6', fontFamily: '"Inter", sans-serif', letterSpacing: '-0.01em' }}>
                {result.label}
              </span>
              <button onClick={reset} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                marginLeft: 2, padding: '3px 9px', borderRadius: 100,
                background: 'transparent', border: '1px solid rgba(255,255,255,0.14)',
                color: 'rgba(255,240,220,0.35)', fontSize: 10.5, cursor: 'pointer',
                fontFamily: '"Inter", sans-serif', transition: 'color 0.16s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,240,220,0.7)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,240,220,0.35)'}
              >
                <RotateCcw size={9} style={{ marginRight: 2 }} /> Reset
              </button>
            </div>

            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {result.picks.map((path, i) => {
                const cat = CATS[path]
                return (
                  <motion.button key={path}
                    initial={{ opacity: 0, scale: 0.84 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.07, duration: 0.28 }}
                    onClick={() => navigate(path)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '7px 15px', borderRadius: 100,
                      background: `${cat.color}1E`,
                      border: `1.5px solid ${cat.color}55`,
                      color: cat.color,
                      fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                      fontFamily: '"Inter", sans-serif', transition: 'all 0.16s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = cat.color; e.currentTarget.style.color = '#1A0E08' }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${cat.color}1E`; e.currentTarget.style.color = cat.color }}
                  >
                    {cat.emoji} {cat.label}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
