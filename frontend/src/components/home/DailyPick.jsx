import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Clock } from 'lucide-react'

const SERIF = '"Bodoni Moda", "Cormorant Garamond", Georgia, serif'
const GOLD  = '#C49A6C'

const FILMS = [
  { title: 'Parasite',               year: 2019, genre: 'Thriller',  rating: '8.5' },
  { title: 'La La Land',             year: 2016, genre: 'Romance',   rating: '8.0' },
  { title: 'Interstellar',           year: 2014, genre: 'Sci-Fi',    rating: '8.6' },
  { title: 'Amélie',                 year: 2001, genre: 'Drama',     rating: '8.3' },
  { title: 'Get Out',                year: 2017, genre: 'Thriller',  rating: '7.7' },
  { title: 'Arrival',                year: 2016, genre: 'Sci-Fi',    rating: '7.9' },
  { title: 'Whiplash',               year: 2014, genre: 'Drama',     rating: '8.5' },
  { title: 'Her',                    year: 2013, genre: 'Romance',   rating: '8.0' },
  { title: 'Knives Out',             year: 2019, genre: 'Mystery',   rating: '7.9' },
  { title: 'Spirited Away',          year: 2001, genre: 'Animation', rating: '8.6' },
  { title: 'Dune',                   year: 2021, genre: 'Sci-Fi',    rating: '8.0' },
  { title: 'Mad Max: Fury Road',     year: 2015, genre: 'Action',    rating: '8.1' },
  { title: 'Before Sunrise',         year: 1995, genre: 'Romance',   rating: '8.1' },
  { title: 'The Grand Budapest Hotel', year: 2014, genre: 'Comedy',  rating: '8.1' },
  { title: 'Everything Everywhere', year: 2022,  genre: 'Sci-Fi',   rating: '7.8' },
  { title: 'The Martian',            year: 2015, genre: 'Sci-Fi',    rating: '8.0' },
  { title: 'Coco',                   year: 2017, genre: 'Animation', rating: '8.4' },
  { title: 'Gone Girl',              year: 2014, genre: 'Thriller',  rating: '8.1' },
]

const RECIPES = [
  { title: 'Shakshuka',             sub: 'Middle Eastern · 25 min' },
  { title: 'Mushroom Risotto',      sub: 'Italian · 45 min' },
  { title: 'Pad Thai',              sub: 'Thai · 30 min' },
  { title: 'Avocado Toast',         sub: 'Healthy · 10 min' },
  { title: 'Pasta Carbonara',       sub: 'Italian · 20 min' },
  { title: 'Bibimbap',              sub: 'Korean · 45 min' },
  { title: 'Falafel Bowl',          sub: 'Mediterranean · 35 min' },
  { title: 'Cacio e Pepe',          sub: 'Italian · 20 min' },
  { title: 'Dal Makhani',           sub: 'Indian · 50 min' },
  { title: 'Mango Sticky Rice',     sub: 'Thai · 40 min' },
  { title: 'Eggs Benedict',         sub: 'Brunch · 30 min' },
  { title: 'Butter Chicken',        sub: 'Indian · 50 min' },
  { title: 'Ramen from Scratch',    sub: 'Japanese · 2 hr' },
  { title: 'Palak Paneer',          sub: 'Indian · 40 min' },
  { title: 'Lemon Herb Salmon',     sub: 'Healthy · 20 min' },
  { title: 'Beef Tacos',            sub: 'Mexican · 25 min' },
  { title: 'Pesto Gnocchi',         sub: 'Italian · 25 min' },
  { title: 'Tom Yum Soup',          sub: 'Thai · 30 min' },
]

const ACTIVITIES = [
  { title: 'Photography Walk',     sub: 'Solo · Low energy' },
  { title: 'Sunrise Hike',         sub: 'Active · High energy' },
  { title: 'Home Cocktail Bar',    sub: 'Social · Any energy' },
  { title: 'Museum Visit',         sub: 'Group · Low energy' },
  { title: 'Long Bath + Book',     sub: 'Solo · Rest mode' },
  { title: 'Escape Room',          sub: 'Group · High energy' },
  { title: 'Candlelit Journaling', sub: 'Solo · Mindful' },
  { title: 'Board Game Night',     sub: 'Group · Casual' },
  { title: 'Outdoor Yoga',         sub: 'Solo · Active' },
  { title: 'Cooking Challenge',    sub: 'Creative · 2 hr' },
  { title: 'City Cycling Trail',   sub: 'Active · Outdoors' },
  { title: 'Sketch Portraits',     sub: 'Creative · Solo' },
  { title: 'Stargazing',           sub: 'Solo · Night' },
  { title: 'Explore a New Café',   sub: 'Social · Chill' },
  { title: 'Picnic in the Park',   sub: 'Group · Outdoors' },
  { title: 'Learn Something New',  sub: 'Solo · Focused' },
  { title: 'Pottery Session',      sub: 'Creative · 2 hr' },
  { title: 'Night Market Visit',   sub: 'Social · Evening' },
]

function dateHash() {
  const d = new Date()
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}

function pickToday(arr, offset = 0) {
  return arr[(dateHash() + offset) % arr.length]
}

function useCountdown() {
  const getRemaining = () => {
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0)
    return Math.max(0, Math.floor((midnight - now) / 1000))
  }
  const [secs, setSecs] = useState(getRemaining)

  useEffect(() => {
    const id = setInterval(() => setSecs(getRemaining()), 1000)
    return () => clearInterval(id)
  }, [])

  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${String(s).padStart(2, '0')}s`
  return `${s}s`
}

const SLOTS = [
  { emoji: '🎬', label: "Today's Film",     color: '#5A9FBF', path: '/movies' },
  { emoji: '🍽️', label: "Today's Recipe",  color: '#C4703A', path: '/recipes' },
  { emoji: '✨',  label: "Today's Activity", color: '#4D7A52', path: '/activities' },
]

export default function DailyPick() {
  const navigate  = useNavigate()
  const countdown = useCountdown()

  const picks = [
    pickToday(FILMS, 0),
    pickToday(RECIPES, 5),
    pickToday(ACTIVITIES, 11),
  ]

  return (
    <section style={{
      background: '#F7F3EE',
      padding: '80px 0',
      borderBottom: '1px solid rgba(28,26,24,0.07)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}
        >
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.24em',
              textTransform: 'uppercase', color: GOLD, marginBottom: 10,
              fontFamily: '"Inter", sans-serif',
            }}>
              Daily Picks
            </div>
            <h2 style={{
              fontFamily: SERIF,
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              color: '#1C1A18', fontWeight: 600,
              lineHeight: 0.95, letterSpacing: '-0.03em',
            }}>
              Curated for <em style={{ color: GOLD, fontStyle: 'italic' }}>today.</em>
            </h2>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '8px 16px', borderRadius: 100,
            background: 'rgba(28,26,24,0.05)',
            border: '1px solid rgba(28,26,24,0.09)',
          }}>
            <Clock size={12} color="#7A7268" />
            <span style={{
              fontSize: 12, color: '#7A7268',
              fontFamily: '"Inter", sans-serif', fontWeight: 500,
            }}>
              Changes in {countdown}
            </span>
          </div>
        </motion.div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 18,
        }} className="daily-picks-grid">
          {SLOTS.map((slot, i) => {
            const pick = picks[i]
            return (
              <motion.button
                key={slot.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.22 } }}
                onClick={() => navigate(slot.path)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '32px 28px', borderRadius: 22,
                  background: '#fff',
                  border: '1.5px solid rgba(28,26,24,0.07)',
                  cursor: 'pointer',
                  boxShadow: '0 2px 16px rgba(28,26,24,0.06)',
                  transition: 'box-shadow 0.25s',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 16px 44px rgba(28,26,24,0.13), inset 0 0 0 1.5px ${slot.color}45`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 16px rgba(28,26,24,0.06)'}
              >
                {/* Top accent bar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: slot.color,
                }} />

                {/* Corner glow */}
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  width: 140, height: 140,
                  background: `radial-gradient(circle at top right, ${slot.color}14 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                {/* Slot label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 20 }}>
                  <span style={{ fontSize: 22 }}>{slot.emoji}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.2em',
                    textTransform: 'uppercase', color: slot.color,
                    fontFamily: '"Inter", sans-serif',
                  }}>{slot.label}</span>
                </div>

                {/* Title */}
                <div style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(1.4rem, 2.2vw, 2rem)',
                  color: '#1C1A18', fontWeight: 600,
                  lineHeight: 1.05, letterSpacing: '-0.02em',
                  marginBottom: 10,
                }}>
                  {pick.title}
                </div>

                {/* Meta */}
                <div style={{
                  fontSize: 13, color: '#9A9288',
                  fontFamily: '"Inter", sans-serif', lineHeight: 1.4,
                  marginBottom: 24,
                }}>
                  {pick.year ? `${pick.year} · ${pick.genre} · ★ ${pick.rating}` : pick.sub}
                </div>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: 12.5, fontWeight: 700, color: slot.color,
                  fontFamily: '"Inter", sans-serif',
                }}>
                  Explore →
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 840px)  { .daily-picks-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 540px)  { .daily-picks-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
