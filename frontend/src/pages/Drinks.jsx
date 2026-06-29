import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Clock, ChefHat } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import DetailModal from '../components/ui/DetailModal'
import PersonalizePanel from '../components/ui/PersonalizePanel'
import AmbientBg from '../components/ui/AmbientBg'
import PageStreaks from '../components/ui/PageStreaks'
import PageHero from '../components/ui/PageHero'
import drinksData from '../data/drinks.json'

const DRINK_ACCENT = '#D4956A'

const DRINK_FIELDS = [
  { id: 'vibe', label: 'What vibe?', options: [
    { label: 'Energizing', value: 'energetic' },
    { label: 'Relaxing',   value: 'relaxed' },
    { label: 'Cozy',       value: 'cozy' },
    { label: 'Wellness',   value: 'healthy' },
    { label: 'Cheerful',   value: 'cheerful' },
    { label: 'Romantic',   value: 'romantic' },
  ]},
  { id: 'type', label: 'Type', options: [
    { label: 'Coffee',    value: 'coffee' },
    { label: 'Cocktail',  value: 'cocktail' },
    { label: 'Mocktail',  value: 'mocktail' },
    { label: 'Tea',       value: 'tea' },
    { label: 'Smoothie',  value: 'smoothie' },
    { label: 'Hot Drink', value: 'hot' },
    { label: 'Wellness',  value: 'wellness' },
    { label: 'Cold',      value: 'cold' },
  ]},
  { id: 'origin', label: 'Origin', options: [
    { label: 'French',        value: 'french' },
    { label: 'Indian',        value: 'indian' },
    { label: 'Filipino',      value: 'filipino' },
    { label: 'South African', value: 'south african' },
    { label: 'Italian',       value: 'italian' },
  ]},
  { id: 'diet', label: 'Dietary', options: [
    { label: 'Vegan',        value: 'vegan' },
    { label: 'Vegetarian',   value: 'vegetarian' },
  ]},
  { id: 'difficulty', label: 'Skill level', options: [
    { label: 'Easy',    value: 'easy' },
    { label: 'Medium',  value: 'medium' },
    { label: 'Hard',    value: 'hard' },
  ]},
]

const TYPE_CATS = {
  coffee: ['Coffee'], cocktail: ['Cocktail'], mocktail: ['Mocktail'],
  tea: ['Tea'], smoothie: ['Smoothie'], hot: ['Hot Drink'],
  wellness: ['Wellness'], cold: ['Cold'],
}

function filterDrinks(drinks, sel) {
  let result = drinks
  const vibes = sel.vibe || []
  if (vibes.length) result = result.filter(d => vibes.some(v => d.mood?.toLowerCase().includes(v)))
  const types = sel.type || []
  if (types.length) {
    const cats = types.flatMap(t => TYPE_CATS[t] || [t])
    result = result.filter(d => cats.some(c =>
      d.category?.toLowerCase() === c.toLowerCase() ||
      d.tags?.some(tag => tag.toLowerCase().includes(c.toLowerCase()))
    ))
  }
  const origins = sel.origin || []
  if (origins.length) {
    result = result.filter(d =>
      origins.some(o => d.tags?.some(tag => tag.toLowerCase().includes(o.toLowerCase())) ||
        d.genres?.some(g => g.toLowerCase().includes(o.toLowerCase())))
    )
  }
  const diets = sel.diet || []
  if (diets.length) {
    result = result.filter(d => diets.some(diet =>
      d.tags?.some(tag => tag.toLowerCase() === diet.toLowerCase())
    ))
  }
  const diffs = sel.difficulty || []
  if (diffs.length) result = result.filter(d => diffs.some(dif => d.difficulty?.toLowerCase() === dif))
  return result.length ? result : drinks
}

const CATS = ['All', 'Hot Drink', 'Cold', 'Cocktail', 'Mocktail', 'Tea', 'Coffee', 'Smoothie', 'Wellness']

const CAT_META = {
  'All':       { emoji: '🍹', color: '#B5763A' },
  'Hot Drink': { emoji: '☕', color: '#8B4513' },
  'Cold':      { emoji: '🧊', color: '#2E86AB' },
  'Cocktail':  { emoji: '🍸', color: '#9B2335' },
  'Mocktail':  { emoji: '🧃', color: '#4D7A52' },
  'Tea':       { emoji: '🍵', color: '#6B8E23' },
  'Coffee':    { emoji: '☕', color: '#6F4E37' },
  'Smoothie':  { emoji: '🫐', color: '#7B3F8C' },
  'Wellness':  { emoji: '🌿', color: '#3D6042' },
}

const BG_IMAGES = [
  'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=2000&q=90',
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=2000&q=90',
  'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=2000&q=90',
  'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=2000&q=90',
]
const FLOATING = [
  { image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80', title: 'Morning Ritual', sub: 'Coffee' },
  { image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80', title: 'Tropical Punch', sub: 'Mocktail' },
  { image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80', title: 'Classic Negroni', sub: 'Cocktail' },
]

export default function Drinks() {
  const { user, toggleFavorite, isFavorite } = useAuth()
  const [cat, setCat]           = useState('All')
  const [selected, setSelected] = useState(null)
  const [forYou, setForYou]     = useState(null)
  const list = cat === 'All'
    ? drinksData
    : drinksData.filter(d =>
        d.category === cat || d.tags?.some(t => t.toLowerCase().includes(cat.toLowerCase()))
      )

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(150deg, #FEFCF7 0%, #FAF5EB 28%, #F4EDE0 58%, #EDE8D8 88%, #E7E0CC 100%)', position: 'relative', overflow: 'hidden' }}>
      <PageStreaks color="#D4956A" />
      <AmbientBg color1="#8B4A20" color2="#5A2A10" color3="#D4956A" />

      <PageHero
        images={BG_IMAGES}
        eyebrow="Beverages & Recipes"
        title={<>Drink<br /><em style={{ fontStyle: 'italic', color: '#D4956A' }}>Culture</em></>}
        subtitle="From cozy morning rituals to midnight cocktails — every recipe curated for its moment."
        accentColor="#D4956A"
        headlineFont='"Italiana", "DM Serif Display", serif'
        overlayLeft="rgba(18,10,4,0.82)"
        ambientColor="rgba(181,118,58,0.24)"
        floatingCards={FLOATING}
        stats={[{value:'200+',label:'Drinks'},{value:'9',label:'Categories'},{value:'Pro',label:'Recipes'},{value:'5min',label:'Avg Prep'}]}
        bottomFade="#F7F3EE"
      >
        <div className="flex gap-2.5 flex-wrap">
          {CATS.map(c => {
            const meta = CAT_META[c] || { emoji: '🍹', color: '#4D7A52' }
            const isActive = cat === c
            return (
              <motion.button key={c} whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} onClick={() => setCat(c)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: isActive ? meta.color : '#fff',
                  color: isActive ? '#fff' : '#3A3630',
                  border: `1.5px solid ${isActive ? meta.color : '#D4CCBC'}`,
                  boxShadow: isActive ? `0 6px 20px ${meta.color}40` : '0 1px 4px rgba(28,26,24,0.06)',
                }}>
                <span className="text-base leading-none">{meta.emoji}</span>
                {c}
              </motion.button>
            )
          })}
        </div>
      </PageHero>

      {/* ── TICKER ──────────────────────────────────────────── */}
      <DrinkTicker />

      {/* ── GRID ────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-12">
        <div className="mb-10">
          <PersonalizePanel
            question="What are you in the mood to drink?"
            fields={DRINK_FIELDS}
            accentColor={DRINK_ACCENT}
            onFilter={(sel) => {
              const empty = !Object.values(sel).some(a => a.length > 0)
              if (empty) { setForYou(null); return }
              setForYou(filterDrinks(drinksData, sel))
            }}
            resultCount={forYou?.length ?? null}
          />
        </div>
        {forYou && (
          <div className="mb-10">
            <div className="flex items-baseline gap-4 mb-6">
              <h2 className="font-display font-semibold text-ink" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', letterSpacing: '-0.025em' }}>For You</h2>
              <span style={{ fontSize: '13px', color: DRINK_ACCENT, fontWeight: 600 }}>{forYou.length} drinks</span>
            </div>
            {forYou.length === 0
              ? <p style={{ color: '#888', fontSize: '14px' }}>No matches — try different preferences.</p>
              : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {forYou.map((d, i) => (
                    <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}>
                      <DrinkCard drink={d} fav={isFavorite(d.id,'drink')} onFav={() => user && toggleFavorite(d,'drink')} onClick={() => setSelected(d)} accentColor={CAT_META[d.category]?.color || DRINK_ACCENT} />
                    </motion.div>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* Section heading */}
        <div className="flex items-baseline gap-4 mb-8">
          <h2 className="font-display font-semibold text-ink"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', letterSpacing: '-0.02em' }}>
            {cat === 'All' ? 'All Drinks' : `${CAT_META[cat]?.emoji || ''} ${cat}`}
          </h2>
          <span className="text-ink-muted text-sm font-medium">
            {list.length} recipe{list.length !== 1 ? 's' : ''}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {list.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
              >
                <DrinkCard
                  drink={d}
                  fav={isFavorite(d.id, 'drink')}
                  onFav={() => user && toggleFavorite(d, 'drink')}
                  onClick={() => setSelected(d)}
                  accentColor={CAT_META[d.category]?.color || '#B5763A'}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <DetailModal item={selected} type="drink" isOpen={!!selected} onClose={() => setSelected(null)} />
    </div>
  )
}

// ── Infinite sliding ticker ──────────────────────────────────
function MiniDrinkCard({ drink }) {
  const accent = CAT_META[drink.category]?.color || DRINK_ACCENT
  return (
    <div style={{
      width: '148px', flexShrink: 0, borderRadius: '14px', overflow: 'hidden',
      position: 'relative', aspectRatio: '2/3',
      boxShadow: '0 6px 24px rgba(14,10,6,0.14)',
    }}>
      <img src={drink.image} alt={drink.title}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      {/* gradient */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,3,2,0.92) 0%, rgba(4,3,2,0.35) 45%, transparent 75%)' }} />
      {/* category badge */}
      <div style={{
        position: 'absolute', top: 9, left: 9,
        background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.16)',
        borderRadius: '999px', padding: '3px 8px',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        <span style={{ fontSize: '11px', lineHeight: 1 }}>{CAT_META[drink.category]?.emoji || '🍹'}</span>
      </div>
      {/* name */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 10px 11px' }}>
        <p style={{
          fontFamily: '"Italiana", "Cormorant Garamond", Georgia, serif',
          fontSize: '13.5px', fontWeight: 400, color: '#fff',
          lineHeight: 1.25, letterSpacing: '0.01em',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{drink.title}</p>
        <span style={{
          display: 'inline-block', marginTop: 4,
          fontSize: '9px', letterSpacing: '0.08em', fontWeight: 600,
          color: accent, textTransform: 'uppercase',
        }}>{drink.category}</span>
      </div>
    </div>
  )
}

function DrinkTicker() {
  // Triple the array so the seamless loop translates exactly -33.33% (= one full copy)
  const row1 = [...drinksData, ...drinksData, ...drinksData]
  const row2 = [...[...drinksData].reverse(), ...[...drinksData].reverse(), ...[...drinksData].reverse()]

  return (
    <div style={{ overflow: 'hidden', position: 'relative', padding: '28px 0 32px', userSelect: 'none' }}>
      {/* edge fade masks */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '130px', background: 'linear-gradient(to right, #F7F3EE 20%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '130px', background: 'linear-gradient(to left, #F7F3EE 20%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />

      {/* Row 1 — slides left, fast */}
      <div className="flex" style={{ gap: '14px', marginBottom: '14px', width: 'max-content', animation: 'drinkTickerLeft 22s linear infinite' }}>
        {row1.map((d, i) => <MiniDrinkCard key={`r1-${i}`} drink={d} />)}
      </div>

      {/* Row 2 — slides right, slightly slower */}
      <div className="flex" style={{ gap: '14px', width: 'max-content', animation: 'drinkTickerRight 28s linear infinite' }}>
        {row2.map((d, i) => <MiniDrinkCard key={`r2-${i}`} drink={d} />)}
      </div>

      <style>{`
        @keyframes drinkTickerLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.3334%); }
        }
        @keyframes drinkTickerRight {
          from { transform: translateX(-33.3334%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

function DrinkCard({ drink, fav, onFav, onClick, accentColor }) {
  const [hov, setHov] = useState(false)
  const cardRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width  - 0.5
    const y = (e.clientY - r.top)  / r.height - 0.5
    el.style.transform = `perspective(700px) rotateY(${x*12}deg) rotateX(${-y*8}deg) translateY(-10px) scale(1.03)`
  }, [])
  const handleLeave = useCallback(() => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) translateY(0) scale(1)'
    setHov(false)
  }, [])

  return (
    <div ref={cardRef} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseMove={handleMouseMove} onMouseLeave={handleLeave}
      className="cursor-pointer select-none"
      style={{
        borderRadius: '16px', overflow: 'hidden', background: '#fff',
        boxShadow: hov
          ? `0 32px 64px rgba(14,10,6,0.2), 0 0 0 1.5px ${accentColor}30, 0 8px 28px ${accentColor}28`
          : '0 4px 20px rgba(14,10,6,0.09)',
        transition: 'box-shadow 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.18s ease',
        transformStyle: 'preserve-3d', willChange: 'transform',
      }}>

      {/* Full-bleed image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
        <img src={drink.image} alt={drink.title}
          className="w-full h-full object-cover"
          style={{ transform: hov ? 'scale(1.1)' : 'scale(1.01)', transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)' }} />

        {/* Top fade */}
        <div className="absolute inset-x-0 top-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)' }} />

        {/* Bottom rich gradient */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{ height: '75%', background: `linear-gradient(to top, rgba(4,3,2,0.97) 0%, rgba(4,3,2,0.8) 30%, rgba(4,3,2,0.25) 60%, transparent 100%)` }} />

        {/* Accent color bloom */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none transition-opacity duration-500"
          style={{ opacity: hov ? 1 : 0, background: `radial-gradient(ellipse at 50% 100%, ${accentColor}55 0%, transparent 65%)` }} />

        {/* Category badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.14)' }}>
          <span style={{ fontSize: '13px', lineHeight: 1 }}>{CAT_META[drink.category]?.emoji || '🍹'}</span>
          <span className="font-bold" style={{ fontSize: '10px', letterSpacing: '0.06em', color: accentColor === '#9B2335' ? '#F87171' : accentColor }}>{drink.category.toUpperCase()}</span>
        </div>

        {/* Fav */}
        <button onClick={e => { e.stopPropagation(); onFav() }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
          style={{ opacity: fav ? 1 : hov ? 1 : 0, background: fav ? '#ef4444' : 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.18)' }}>
          <Heart className={`w-3.5 h-3.5 ${fav ? 'fill-white text-white' : 'text-white'}`} />
        </button>

        {/* ALL info overlaid at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white leading-tight line-clamp-1 mb-1"
            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '20px', fontWeight: 600, letterSpacing: '-0.01em' }}>
            {drink.title}
          </h3>
          <p className="line-clamp-1 mb-3" style={{ color: 'rgba(255,240,220,0.5)', fontSize: '11px' }}>
            {drink.description}
          </p>

          {/* Meta pills row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {drink.time && (
              <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,240,220,0.7)', fontSize: '10px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <Clock className="w-2.5 h-2.5" /> {drink.time}
              </span>
            )}
            {drink.mood && (
              <span className="px-2.5 py-1.5 rounded-full font-semibold"
                style={{ background: `${accentColor}55`, color: '#fff', fontSize: '10px', backdropFilter: 'blur(10px)', border: `1px solid ${accentColor}40` }}>
                {drink.mood}
              </span>
            )}
            {drink.difficulty && (
              <span className="px-2.5 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,240,220,0.65)', fontSize: '10px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                {drink.difficulty}
              </span>
            )}
          </div>

          {/* View button on hover */}
          <div className="overflow-hidden transition-all duration-300"
            style={{ maxHeight: hov ? '44px' : '0', opacity: hov ? 1 : 0, marginTop: hov ? '10px' : '0' }}>
            <button className="w-full py-2.5 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              style={{ background: `${accentColor}BB`, backdropFilter: 'blur(14px)', border: `1px solid ${accentColor}50` }}>
              View Recipe
            </button>
          </div>
        </div>
      </div>

      {/* Ingredient strip */}
      {drink.ingredients?.length > 0 && (
        <div className="px-4 py-2.5 flex gap-1.5 flex-wrap items-center"
          style={{ background: '#FAFAF8', borderTop: `1.5px solid ${accentColor}18` }}>
          {drink.ingredients.slice(0, 3).map((ing, i) => (
            <span key={i} className="text-[10px] font-medium px-2.5 py-1 rounded-full"
              style={{ background: `${accentColor}10`, color: accentColor, border: `1px solid ${accentColor}20` }}>
              {typeof ing === 'string' ? ing.split(' ').slice(-1)[0] : ing.ingredient}
            </span>
          ))}
          {drink.ingredients.length > 3 && (
            <span className="text-[10px] font-medium px-2 py-1 rounded-full"
              style={{ background: 'rgba(28,26,24,0.05)', color: '#9A9088' }}>
              +{drink.ingredients.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
