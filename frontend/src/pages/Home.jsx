import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight, Sparkles } from 'lucide-react'
import CategoryRow from '../components/home/CategoryRow'
import RightNow from '../components/home/RightNow'
import VibeStrip from '../components/home/VibeStrip'
import DailyPick from '../components/home/DailyPick'
import MoodCheckIn from '../components/home/MoodCheckIn'
import VibeQuiz from '../components/home/VibeQuiz'
import SurpriseMe from '../components/ui/SurpriseMe'
import SpinWheel from '../components/ui/SpinWheel'
import CommunityWall from '../components/home/CommunityWall'
import { getTrending } from '../api/tmdb'
import { getRandomMeals } from '../api/mealdb'
import { getPopularGames } from '../api/rawg'

import activitiesData from '../data/activities.json'
import playlistsData from '../data/playlists.json'
import drinksData from '../data/drinks.json'

const SERIF  = '"Bodoni Moda", "Cormorant Garamond", Georgia, serif'
const CINZEL = '"Cinzel", serif'
const BEBAS  = '"Bebas Neue", sans-serif'
const BASK   = '"Libre Baskerville", serif'
const FRAUN  = '"Fraunces", serif'

const U = (id) => `https://images.unsplash.com/${id}?w=240&q=70`

// Hero ticker rows — mixed categories, 4 rows alternating direction
const HERO_R1 = [ // drinks + recipes — slides left fast
  { src: U('photo-1544145945-f90425340c7e'), label: 'Cocktail' },
  { src: U('photo-1551024709-8f23befc6f87'), label: 'Coffee' },
  { src: U('photo-1514362545857-3bc16c4c7d1b'), label: 'Mocktail' },
  { src: U('photo-1497534446932-c925b458314e'), label: 'Drinks' },
  { src: U('photo-1504674900247-0877df9cc836'), label: 'Recipes' },
  { src: U('photo-1565299624946-b28f40a0ae38'), label: 'Italian' },
  { src: U('photo-1540189549336-e6e99c3679fe'), label: 'Fresh' },
  { src: U('photo-1567620905732-2d1ec7ab7445'), label: 'Comfort' },
]
const HERO_R2 = [ // movies + books — slides right
  { src: U('photo-1536440136628-849c177e76a1'), label: 'Films' },
  { src: U('photo-1485846234645-a62644f84728'), label: 'Cinema' },
  { src: U('photo-1478720568477-152d9b164e26'), label: 'Drama' },
  { src: U('photo-1481627834876-b7833e8f5570'), label: 'Books' },
  { src: U('photo-1524995997946-a1c2e315a42f'), label: 'Fiction' },
  { src: U('photo-1456513080510-7bf3a84b82f8'), label: 'Library' },
  { src: U('photo-1440404653325-ab127d49abc1'), label: 'Classic' },
  { src: U('photo-1491841573634-28140fc7ced7'), label: 'Read' },
]
const HERO_R3 = [ // games + music — slides left
  { src: U('photo-1542751371-adc38448a05e'), label: 'Gaming' },
  { src: U('photo-1550745165-9bc0b252726f'), label: 'Console' },
  { src: U('photo-1511512578047-dfb367046420'), label: 'PC' },
  { src: U('photo-1511379938547-c1f69419868d'), label: 'Music' },
  { src: U('photo-1493225457124-a3eb161ffa5f'), label: 'Vibes' },
  { src: U('photo-1470225620780-dba8ba36b745'), label: 'Beats' },
  { src: U('photo-1514320291840-2e0a9bf2a9ae'), label: 'Live' },
  { src: U('photo-1493711662062-fa541adb3fc8'), label: 'Arena' },
]
const HERO_R4 = [ // activities — slides right
  { src: U('photo-1506905925346-21bda4d32df4'), label: 'Outdoor' },
  { src: U('photo-1571019614242-c5c5dee9f50b'), label: 'Active' },
  { src: U('photo-1502680390469-be75c86b636f'), label: 'Surf' },
  { src: U('photo-1508672019048-805c876b67e2'), label: 'Yoga' },
  { src: U('photo-1513364776144-60967b0f800f'), label: 'Create' },
  { src: U('photo-1482049016688-2d3e1b311543'), label: 'Cook' },
  { src: U('photo-1484980972926-edee96e0960d'), label: 'Explore' },
  { src: U('photo-1459749411175-04bf5292ceea'), label: 'Chill' },
]

const HERO_ROWS = [
  { items: HERO_R1, speed: 16, dir: 'left'  },
  { items: HERO_R2, speed: 22, dir: 'right' },
  { items: HERO_R3, speed: 18, dir: 'left'  },
  { items: HERO_R4, speed: 26, dir: 'right' },
]

/* ── Category tiles ────────────────────────────────────────── */
const CATS = [
  { id:'movies',      label:'Films',       font:CINZEL,   accent:'#4A8BC4', bg:'#0B1A2C', img:'photo-1536440136628-849c177e76a1', desc:'10K+ titles for every mood', link:'/movies' },
  { id:'games',       label:'Games',       font:BEBAS,    accent:'#CC2222', bg:'#120000', img:'photo-1542751371-adc38448a05e', desc:'500K+ games across all platforms', link:'/games' },
  { id:'recipes',     label:'Recipes',     font:'"DM Serif Display", serif', accent:'#C4703A', bg:'#1A0C06', img:'photo-1504674900247-0877df9cc836', desc:'50K+ dishes from every cuisine', link:'/recipes' },
  { id:'books',       label:'Books',       font:BASK,     accent:'#8B5E3C', bg:'#180F08', img:'photo-1481627834876-b7833e8f5570', desc:'40M+ titles — free preview', link:'/books' },
  { id:'music',       label:'Music',       font:'"Abril Fatface", serif', accent:'#3A9B7A', bg:'#061814', img:'photo-1511379938547-c1f69419868d', desc:'Curated playlists for every mood', link:'/music' },
  { id:'activities',  label:'Activities',  font:'"Josefin Sans", sans-serif', accent:'#4D7A52', bg:'#0A180A', img:'photo-1506905925346-21bda4d32df4', desc:'100+ things to do — any energy', link:'/activities' },
  { id:'drinks',      label:'Drinks',      font:'"DM Serif Display", serif', accent:'#D4956A', bg:'#1A0E08', img:'photo-1544145945-f90425340c7e', desc:'200+ drinks from morning to midnight', link:'/drinks' },
  { id:'collections', label:'Collections', font:FRAUN,    accent:'#B5763A', bg:'#150A04', img:'photo-1519861531473-9200262188bf', desc:'Perfect bundles for every mood', link:'/collections' },
]

function nightScore() {
  const now = new Date()
  const day  = now.getDay()
  const hour = now.getHours()
  const dayB  = [14, 2, 5, 8, 15, 32, 28][day]
  const timeB = hour >= 17 && hour < 22 ? 30 : hour >= 22 ? 20 : hour >= 13 ? 14 : hour >= 9 ? 8 : 4
  const seed  = ((now.getDate() * 7 + now.getMonth() * 3) % 17) - 8
  return Math.min(100, Math.max(1, dayB + timeB + seed + 26))
}
function nightLabel(s) {
  if (s >= 88) return { text: 'Legendary 🔥', color: '#4ADE80' }
  if (s >= 72) return { text: 'Prime Time ⚡', color: '#C49A6C' }
  if (s >= 56) return { text: 'Good Vibes ✨', color: '#5A9FBF' }
  if (s >= 40) return { text: 'Decent 🌙',   color: '#D4956A' }
  return             { text: 'Low Key 😌',    color: '#7A7268' }
}

function CategoryTile({ cat }) {
  const navigate = useNavigate()
  return (
    <motion.div whileHover={{ scale: 1.025 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      onClick={() => navigate(cat.link)} className="cursor-pointer relative overflow-hidden"
      style={{ borderRadius: '18px', background: cat.bg, aspectRatio: '4/3', minHeight: '200px' }}>
      <img src={`https://images.unsplash.com/${cat.img}?w=600&q=75`} alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: 0.28 }} />
      {/* gradient */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${cat.bg} 0%, rgba(0,0,0,0.2) 100%)` }} />
      {/* accent corner glow */}
      <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
        style={{ background: `radial-gradient(circle at top right, ${cat.accent}28 0%, transparent 70%)` }} />
      {/* content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="text-[10px] font-bold tracking-[0.18em] uppercase mb-2" style={{ color: `${cat.accent}99` }}>
          {cat.id.toUpperCase()}
        </div>
        <div style={{ fontFamily: cat.font, fontSize: 'clamp(2rem, 3.2vw, 2.8rem)', color: cat.accent, lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: '8px' }}>
          {cat.label}
        </div>
        <p style={{ color: 'rgba(255,240,220,0.38)', fontSize: '11.5px', lineHeight: 1.45 }}>{cat.desc}</p>
        <div className="flex items-center gap-1 mt-4" style={{ color: cat.accent, fontSize: '11px', fontWeight: 700 }}>
          Explore <ArrowRight style={{ width: '11px', height: '11px' }} />
        </div>
      </div>
    </motion.div>
  )
}

/* ── Main component ─────────────────────────────────────────── */
export default function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [recipes, setRecipes] = useState([])
  const [games, setGames] = useState([])

  useEffect(() => {
    getTrending().then(setMovies).catch(() => {})
    getRandomMeals(8).then(setRecipes).catch(() => {})
    getPopularGames().then(d => setGames(d.slice(0, 12))).catch(() => {})
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/movies?q=${encodeURIComponent(query)}`)
  }

  return (
    <div>

      {/* ══ HERO: animated collage + copy ══════════════════════ */}
      <section style={{ height: '100vh', minHeight: '700px', background: '#0C0A08', position: 'relative', overflow: 'hidden' }}>

        {/* Ticker rows — right side */}
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '62%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          gap: '10px', overflow: 'hidden', padding: '0',
        }}>
          {HERO_ROWS.map((row, ri) => {
            const triple = [...row.items, ...row.items, ...row.items]
            const anim = row.dir === 'left'
              ? `heroTickL${ri} ${row.speed}s linear infinite`
              : `heroTickR${ri} ${row.speed}s linear infinite`
            return (
              <div key={ri} style={{ overflow: 'hidden', height: 'calc(25% - 8px)', flexShrink: 0 }}>
                <div className="flex h-full" style={{ gap: '10px', width: 'max-content', animation: anim }}>
                  {triple.map((item, j) => (
                    <div key={j} style={{
                      width: '148px', height: '100%', flexShrink: 0,
                      borderRadius: '11px', overflow: 'hidden', position: 'relative',
                    }}>
                      <img src={item.src} alt="" loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,3,2,0.82) 0%, transparent 55%)' }} />
                      <span style={{
                        position: 'absolute', bottom: 7, left: 9,
                        fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em',
                        textTransform: 'uppercase', color: 'rgba(255,230,190,0.55)',
                      }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          {/* keyframes — one per row since direction+speed differ */}
          <style>{`
            @keyframes heroTickL0 { from{transform:translateX(0)} to{transform:translateX(-33.3334%)} }
            @keyframes heroTickR1 { from{transform:translateX(-33.3334%)} to{transform:translateX(0)} }
            @keyframes heroTickL2 { from{transform:translateX(0)} to{transform:translateX(-33.3334%)} }
            @keyframes heroTickR3 { from{transform:translateX(-33.3334%)} to{transform:translateX(0)} }
          `}</style>
        </div>

        {/* Fade overlays — blend tickers into dark hero */}
        <div className="absolute inset-y-0 pointer-events-none" style={{ left: '34%', width: '220px', background: 'linear-gradient(to right, #0C0A08 30%, transparent 100%)', zIndex: 2 }} />
        <div className="absolute left-[36%] right-0 top-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #0C0A08, transparent)', zIndex: 2 }} />
        <div className="absolute left-[36%] right-0 bottom-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(to top, #0C0A08, transparent)', zIndex: 2 }} />

        {/* Hero copy — left side */}
        <div className="absolute inset-0 z-10 flex items-center" style={{ maxWidth: '660px', padding: '0 24px 0 48px' }}>
          <div>
            {/* Badge + NightScore */}
            {(() => { const ns = nightScore(); const nl = nightLabel(ns); return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-7" style={{ flexWrap: 'wrap' }}>
              <div className="inline-flex items-center gap-2"
                style={{ padding: '6px 14px', borderRadius: '100px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)' }}>
                <Sparkles style={{ width: '12px', height: '12px', color: '#C49A6C' }} />
                <span style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C49A6C' }}>
                  Discover Your Perfect Moment
                </span>
              </div>
              <div className="inline-flex items-center gap-2"
                style={{ padding: '5px 12px', borderRadius: '100px', background: `${nl.color}18`, border: `1px solid ${nl.color}40` }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: nl.color, boxShadow: `0 0 6px ${nl.color}` }} />
                <span style={{ fontSize: '10.5px', fontWeight: 700, color: nl.color, fontFamily: '"Inter", sans-serif' }}>
                  Tonight {ns}/100 · {nl.text}
                </span>
              </div>
            </motion.div>
            )})()}

            {/* Headline */}
            <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.07 }}
              style={{ fontFamily: SERIF, fontSize: 'clamp(4.5rem, 8.5vw, 9rem)', lineHeight: 0.88, letterSpacing: '-0.04em', color: '#FDFAF6', fontWeight: 600, marginBottom: '20px', textShadow: '0 2px 60px rgba(0,0,0,0.5)' }}>
              One app<br />for your<br /><em style={{ color: '#C49A6C', fontStyle: 'italic' }}>entire life.</em>
            </motion.h1>

            {/* Tagline */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.22 }}
              style={{ fontSize: '13px', color: 'rgba(255,240,220,0.35)', letterSpacing: '0.1em', marginBottom: '32px', textTransform: 'uppercase' }}>
              Films · Recipes · Games · Books · Music · Activities · Drinks
            </motion.p>

            {/* Search */}
            <motion.form initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              onSubmit={handleSearch} className="flex items-center gap-2 mb-5"
              style={{ padding: '7px 7px 7px 18px', borderRadius: '100px', background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.13)', backdropFilter: 'blur(18px)', maxWidth: '440px' }}>
              <Search style={{ width: '14px', height: '14px', color: 'rgba(255,240,220,0.3)', flexShrink: 0 }} />
              <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder="What's your mood tonight?"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#FDFAF6', fontSize: '14px' }} />
              <button type="submit"
                style={{ flexShrink: 0, padding: '9px 18px', borderRadius: '100px', background: '#C49A6C', color: '#1A0E08', fontSize: '12.5px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                Explore
              </button>
            </motion.form>

            {/* VibeQuiz — replaces static mood chips */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.38 }}>
              <VibeQuiz />
            </motion.div>

            {/* Secondary CTAs */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.46 }}
              className="flex items-center gap-3" style={{ flexWrap: 'wrap' }}>
              <SurpriseMe />
              <SpinWheel />
              <button onClick={() => navigate('/planner')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: '100px', background: 'rgba(196,154,108,0.15)', border: '1.5px solid rgba(196,154,108,0.3)', color: '#C49A6C', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,154,108,0.25)'; e.currentTarget.style.borderColor = 'rgba(196,154,108,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(196,154,108,0.15)'; e.currentTarget.style.borderColor = 'rgba(196,154,108,0.3)' }}>
                ✨ Plan Tonight
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ LIVE CONTEXT STRIPS — visible just below the hero ═══ */}
      <RightNow />
      <VibeStrip />
      <DailyPick />
      <MoodCheckIn />

      {/* ══ ABOUT ══════════════════════════════════════════════ */}
      <section style={{ background: '#0E0C0A', padding: '100px 48px' }}>
        <div className="max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-xs font-bold tracking-[0.2em] uppercase mb-6" style={{ color: '#C49A6C' }}>Why Sylex</div>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2.8rem, 5vw, 5rem)', color: '#FDFAF6', lineHeight: 0.95, letterSpacing: '-0.03em', fontWeight: 600, marginBottom: '24px' }}>
                Everything you need<br /><em style={{ color: '#C49A6C', fontStyle: 'italic' }}>for a perfect day.</em>
              </h2>
              <p style={{ color: 'rgba(255,240,220,0.45)', fontSize: '16px', lineHeight: 1.75, maxWidth: '480px' }}>
                Sylex is a mood-first discovery platform. Tell us how you feel and we&rsquo;ll curate the perfect film, recipe, game, book, playlist, activity, and drink — all in one place, always free.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: '🎬', title: 'Films & Shows', stat: '1M+', sub: 'titles curated for every mood' },
                { emoji: '🍝', title: 'Recipes & Drinks', stat: '50K+', sub: 'dishes from every cuisine' },
                { emoji: '🎮', title: 'Games & Books', stat: '500K+', sub: 'games + 40M books' },
                { emoji: '🎵', title: 'Music & More', stat: '100+', sub: 'playlists + activities' },
              ].map(f => (
                <div key={f.title} style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize: '24px', marginBottom: '10px' }}>{f.emoji}</div>
                  <div style={{ fontFamily: SERIF, fontSize: '26px', color: '#C49A6C', fontWeight: 600, lineHeight: 1 }}>{f.stat}</div>
                  <div style={{ color: '#FDFAF6', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>{f.title}</div>
                  <div style={{ color: 'rgba(255,240,220,0.35)', fontSize: '11px', marginTop: '3px' }}>{f.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CATEGORY TILES ═════════════════════════════════════ */}
      <section style={{ background: '#0C0A08', padding: '80px 24px' }}>
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'rgba(255,240,220,0.3)' }}>Explore</div>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', color: '#FDFAF6', letterSpacing: '-0.03em', fontWeight: 600 }}>
              Your <em style={{ color: '#C49A6C', fontStyle: 'italic' }}>world</em>, curated.
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATS.map(cat => <CategoryTile key={cat.id} cat={cat} />)}
          </div>
        </div>
      </section>

      {/* ══ PLANNER PROMO ══════════════════════════════════════ */}
      <section style={{ background: '#100D0A', padding: '88px 24px' }}>
        <div className="max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: copy */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 100, background: 'rgba(196,154,108,0.1)', border: '1px solid rgba(196,154,108,0.25)', marginBottom: 24 }}>
                <span style={{ fontSize: 12 }}>✨</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C49A6C' }}>New Feature</span>
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2.6rem, 5vw, 4.5rem)', color: '#FDFAF6', lineHeight: 0.9, letterSpacing: '-0.03em', fontWeight: 600, marginBottom: 22 }}>
                Plan your<br /><em style={{ color: '#C49A6C', fontStyle: 'italic' }}>perfect evening</em><br />in 30 seconds.
              </h2>
              <p style={{ color: 'rgba(255,240,220,0.42)', fontSize: 15, lineHeight: 1.75, maxWidth: '460px', marginBottom: 36 }}>
                Tell us your energy, your company, and the vibe — Sylex builds you a full plan: film, recipe, drink, music, activity, and a book. Three clicks. Six perfect picks that belong together.
              </p>
              <button
                onClick={() => navigate('/planner')}
                style={{ padding: '14px 34px', borderRadius: 100, border: 'none', background: '#C49A6C', color: '#1A0E08', fontSize: 14, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#D4A87A'}
                onMouseLeave={e => e.currentTarget.style.background = '#C49A6C'}
              >
                Plan Tonight →
              </button>
            </div>

            {/* Right: preview cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { emoji: '🎬', label: 'Film',     color: '#5A9FBF', sample: 'La La Land' },
                { emoji: '🍽️', label: 'Recipe',   color: '#C4703A', sample: 'Beef Wellington' },
                { emoji: '🥂', label: 'Drink',    color: '#D4956A', sample: 'Champagne' },
                { emoji: '🎵', label: 'Music',    color: '#3A9B7A', sample: 'Soft Jazz' },
                { emoji: '✨', label: 'Activity', color: '#4D7A52', sample: 'Stargazing' },
                { emoji: '📚', label: 'Book',     color: '#8B5E3C', sample: 'Before I Fall' },
              ].map((c, i) => (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  style={{ padding: '18px 16px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden' }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: c.color, opacity: 0.7 }} />
                  <div style={{ fontSize: 22, marginBottom: 10 }}>{c.emoji}</div>
                  <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: c.color, marginBottom: 7 }}>{c.label}</div>
                  <div style={{ fontFamily: SERIF, fontSize: 13.5, color: '#FDFAF6', lineHeight: 1.3, fontWeight: 600 }}>{c.sample}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CONTENT ROWS ═══════════════════════════════════════ */}
      <div style={{ background: 'linear-gradient(175deg, #FDFCF8 0%, #F8F3EC 35%, #F2EDE0 70%, #EAE5D4 100%)', paddingBottom: '80px' }}>
        <CategoryRow title="Trending Movies" emoji="🎬" subtitle="What everyone is watching right now" items={movies} viewAllLink="/movies" type="movie" />
        <CategoryRow title="Tonight's Recipes" emoji="🍝" subtitle="Delicious meals from every cuisine" items={recipes} viewAllLink="/recipes" type="recipe" />
        <CategoryRow title="Top Games" emoji="🎮" subtitle="Highest rated games across all platforms" items={games} viewAllLink="/games" type="game" />

        <CategoryRow title="Mood Playlists" emoji="🎵" subtitle="Music for every moment" items={playlistsData} viewAllLink="/music" type="playlist" />
        <CategoryRow title="Activities" emoji="🎨" subtitle="Things to do — solo, with friends, or family" items={activitiesData.slice(0, 8)} viewAllLink="/activities" type="activity" />
        <CategoryRow title="Drinks" emoji="☕" subtitle="Recipes for every taste and occasion" items={drinksData.slice(0, 8)} viewAllLink="/drinks" type="drink" />

        <div style={{ paddingTop: 16, paddingBottom: 48 }}>
          <CommunityWall />
        </div>
      </div>

    </div>
  )
}
