import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, FreeMode } from 'swiper/modules'
import RichCard from '../components/ui/RichCard'
import DetailModal from '../components/ui/DetailModal'
import PageHero from '../components/ui/PageHero'
import PersonalizePanel from '../components/ui/PersonalizePanel'
import { CardSkeletonRow } from '../components/ui/LoadingSkeleton'
import AmbientBg from '../components/ui/AmbientBg'
import { getPopularGames, getTrendingGames, getTopRatedGames, getGameDetails, GAME_GENRES } from '../api/rawg'
import ContentTicker from '../components/ui/ContentTicker'

const GAME_FIELDS = [
  { id: 'mood', label: 'Play style', options: [
    { label: 'Competitive',  value: 'competitive' },
    { label: 'Relaxed',      value: 'relaxed' },
    { label: 'Social',       value: 'social' },
    { label: 'Solo',         value: 'solo' },
    { label: 'Intense',      value: 'intense' },
  ]},
  { id: 'genre', label: 'Genre', options: [
    { label: 'RPG',        value: 'rpg' },
    { label: 'Action',     value: 'action' },
    { label: 'Strategy',   value: 'strategy' },
    { label: 'Puzzle',     value: 'puzzle' },
    { label: 'Shooter',    value: 'shooter' },
    { label: 'Adventure',  value: 'adventure' },
    { label: 'Indie',      value: 'indie' },
  ]},
  { id: 'playtime', label: 'Session length', options: [
    { label: 'Quick  <2h',   value: 'quick' },
    { label: 'Medium 2-8h',  value: 'medium' },
    { label: 'Long   8h+',   value: 'long' },
  ]},
]

const MOOD_GAME_TAGS = {
  competitive: ['sports','racing','fighting','multiplayer'],
  relaxed:     ['puzzle','casual','indie','simulation'],
  social:      ['multiplayer','co-op','party'],
  solo:        ['rpg','adventure','platformer','roguelike'],
  intense:     ['action','shooter','horror','survival'],
}

function filterGames(allGames, sel) {
  let result = allGames

  const moods = sel.mood || []
  if (moods.length) {
    const tags = moods.flatMap(m => MOOD_GAME_TAGS[m] || [])
    result = result.filter(g =>
      g.genres?.some(gn => tags.some(t => gn.toLowerCase().includes(t))) ||
      g.tags?.some(tag => tags.some(t => tag.toLowerCase().includes(t)))
    )
  }

  const genres = sel.genre || []
  if (genres.length) {
    result = result.filter(g =>
      g.genres?.some(gn => genres.some(gen => gn.toLowerCase().includes(gen)))
    )
  }

  return result
}

const BG_IMAGES = [
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=2000&q=90',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=2000&q=90',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=2000&q=90',
  'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=2000&q=90',
]
const FLOATING = [
  { image: 'https://images.unsplash.com/photo-1586182987320-4f376d39d787?w=400&q=80', title: 'Action RPG', sub: 'Open World' },
  { image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&q=80', title: 'Indie Gem', sub: 'Puzzle' },
  { image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', title: 'Multiplayer', sub: 'Strategy' },
]

const RED   = '#FF2222'
const RED2  = '#CC0000'
const BEBAS = '"Bebas Neue", sans-serif'

// 36 streaks covering all heights, varying speed, size, delay
const STREAKS = Array.from({ length: 36 }, (_, i) => ({
  id:    i,
  top:   `${(i * 2.83) % 100}%`,
  w:     18 + (i % 7) * 19,        // 18–132 px
  h:     i % 5 === 0 ? 2 : 1,      // occasional thicker streak
  dur:   0.55 + (i % 9) * 0.17,    // 0.55–2.0 s
  delay: -(i * 0.38),              // pre-started, staggered
  op:    0.28 + (i % 6) * 0.1,     // 0.28–0.78
}))

// 14 spark squares that flash at fixed positions
const SPARKS = Array.from({ length: 14 }, (_, i) => ({
  id:    i,
  left:  `${(i * 71.3) % 100}%`,
  top:   `${(i * 53.7) % 100}%`,
  size:  3 + (i % 3),
  dur:   0.25 + (i % 4) * 0.12,
  delay: -(i * 0.55),
  op:    0.5 + (i % 3) * 0.2,
}))

function GameParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 4 }}>
      {/* Horizontal rush streaks */}
      {STREAKS.map(s => (
        <div key={s.id} style={{
          position: 'absolute',
          top:      s.top,
          left:     '-140px',
          width:    `${s.w}px`,
          height:   `${s.h}px`,
          borderRadius: '2px',
          background: `linear-gradient(to right, transparent, ${RED} 55%, #FF8888)`,
          boxShadow: `0 0 ${s.h * 7}px ${s.h * 3}px rgba(255,20,20,0.55)`,
          opacity:  s.op,
          animation: `rushLeft ${s.dur}s linear ${s.delay}s infinite`,
          willChange: 'transform',
        }} />
      ))}
      {/* Flashing pixel sparks */}
      {SPARKS.map(s => (
        <div key={`sp-${s.id}`} style={{
          position:     'absolute',
          left:         s.left,
          top:          s.top,
          width:        `${s.size}px`,
          height:       `${s.size}px`,
          background:   RED,
          boxShadow:    `0 0 8px 3px rgba(255,20,20,0.8)`,
          opacity:      s.op,
          animation:    `sparkFlash ${s.dur}s ease-in-out ${s.delay}s infinite`,
          willChange:   'transform, opacity',
        }} />
      ))}
    </div>
  )
}

// Periodic red sweep flash (like a radar sweep)
function RedSweep() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position:   'absolute',
          inset:      0,
          background: `linear-gradient(105deg, transparent 30%, rgba(180,0,0,0.07) 50%, transparent 70%)`,
          animation:  `redSweep ${3.5 + i * 1.4}s linear ${-i * 1.8}s infinite`,
          willChange: 'transform',
        }} />
      ))}
    </div>
  )
}

// Neon corner bracket for section headers
function NeonCorner({ color = RED }) {
  const s = { position: 'absolute', background: color, boxShadow: `0 0 8px ${color}` }
  return (
    <div style={{ position: 'relative', width: '20px', height: '20px', flexShrink: 0 }}>
      <div style={{ ...s, top: 0, left: 0, width: '10px', height: '2px' }} />
      <div style={{ ...s, top: 0, left: 0, width: '2px', height: '10px' }} />
      <div style={{ ...s, bottom: 0, right: 0, width: '10px', height: '2px' }} />
      <div style={{ ...s, bottom: 0, right: 0, width: '2px', height: '10px' }} />
    </div>
  )
}

export default function Games() {
  const [popular,     setPopular]     = useState([])
  const [trending,    setTrending]    = useState([])
  const [topRated,    setTopRated]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [selected,    setSelected]    = useState(null)
  const [detail,      setDetail]      = useState(null)
  const [activeGenre, setActiveGenre] = useState(null)
  const [forYou,      setForYou]      = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([getPopularGames(), getTrendingGames(), getTopRatedGames()])
      .then(([p, t, r]) => { setPopular(p); setTrending(t); setTopRated(r) })
      .catch(console.error).finally(() => setLoading(false))
  }, [])

  const handleClick = async (item) => {
    setSelected(item)
    try { setDetail(await getGameDetails(item.id)) } catch { setDetail(item) }
  }

  const filter = (items) => {
    if (!activeGenre) return items
    return items.filter(item =>
      item.genres?.some(g => g.toLowerCase().includes(activeGenre.toLowerCase())) ||
      item.tags?.some(t =>   t.toLowerCase().includes(activeGenre.toLowerCase()))
    )
  }

  const sections = [
    { title: 'Most Popular',  items: filter(popular),  id: 'gp' },
    { title: 'Trending Now',  items: filter(trending), id: 'gt' },
    { title: 'Highest Rated', items: filter(topRated), id: 'gr' },
  ]

  return (
    <div className="min-h-screen" style={{
      background: 'radial-gradient(ellipse 120% 60% at 50% 0%, #1A0000 0%, #0C0808 55%, #050303 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <AmbientBg color1="#5A0000" color2="#2A0000" color3="#990000" />

      {/* Always-on particle layer */}
      <GameParticles />
      <RedSweep />

      {/* Scan-lines */}
      <div className="scan-lines absolute inset-0 pointer-events-none" style={{ zIndex: 1, opacity: 0.7 }} />

      {/* Global neon grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 1,
        backgroundImage: [
          'linear-gradient(rgba(200,0,0,0.055) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(200,0,0,0.055) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '48px 48px',
      }} />

      <PageHero images={BG_IMAGES} eyebrow="Gaming"
        title={<>Level<br /><em style={{ fontStyle: 'normal', color: RED, fontFamily: BEBAS, letterSpacing: '0.08em' }}>Up</em></>}
        subtitle="Epic RPGs to indie gems — find your next gaming obsession across every platform."
        headlineFont={BEBAS}
        accentColor={RED} overlayLeft="rgba(12,0,0,0.82)" ambientColor="rgba(200,30,30,0.25)"
        floatingCards={FLOATING}
        stats={[{value:'500K+',label:'Games'},{value:'9.2',label:'Metacritic'},{value:'30+',label:'Genres'},{value:'All',label:'Platforms'}]}
        bottomFade="#0C0808">

        <div className="flex flex-wrap gap-2">
          <motion.button whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${RED}` }} whileTap={{ scale: 0.95 }}
            onClick={() => setActiveGenre(null)}
            className="px-5 py-2.5 rounded-sm font-bold transition-all"
            style={{
              background: !activeGenre ? RED : 'rgba(220,0,0,0.1)',
              color: !activeGenre ? '#fff' : '#FF9999',
              border: `1.5px solid ${!activeGenre ? RED : 'rgba(220,0,0,0.3)'}`,
              boxShadow: !activeGenre ? `0 0 18px ${RED}80, inset 0 0 12px rgba(255,60,60,0.2)` : 'none',
              fontFamily: BEBAS, letterSpacing: '0.1em', fontSize: '15px',
              clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
            }}>
            ALL GAMES
          </motion.button>
          {GAME_GENRES.slice(0, 10).map(g => (
            <motion.button key={g.id} whileHover={{ scale: 1.05, boxShadow: `0 0 16px ${RED}80` }} whileTap={{ scale: 0.95 }}
              onClick={() => setActiveGenre(activeGenre === g.label ? null : g.label)}
              className="px-5 py-2.5 rounded-sm font-bold transition-all"
              style={{
                background: activeGenre === g.label ? RED : 'rgba(220,0,0,0.1)',
                color: activeGenre === g.label ? '#fff' : '#FF9999',
                border: `1.5px solid ${activeGenre === g.label ? RED : 'rgba(220,0,0,0.3)'}`,
                boxShadow: activeGenre === g.label ? `0 0 18px ${RED}80, inset 0 0 12px rgba(255,60,60,0.2)` : 'none',
                fontFamily: BEBAS, letterSpacing: '0.1em', fontSize: '15px',
                clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
              }}>
              {g.label.toUpperCase()}
            </motion.button>
          ))}
        </div>
      </PageHero>

      <ContentTicker variant="neon"
        items={[
          ...FLOATING.map(f => ({ image: f.image, title: f.title, label: f.sub })),
          { image: BG_IMAGES[0], label: 'Gaming' }, { image: BG_IMAGES[1], label: 'Arena' },
          { image: BG_IMAGES[2], label: 'Console' }, { image: BG_IMAGES[3], label: 'Pro' },
        ]}
        bg="#0C0808" accentColor={RED}
      />

      <div className="py-10 space-y-16 relative" style={{ zIndex: 5 }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-14">
          <PersonalizePanel
            question="What kind of game are you looking for?"
            fields={GAME_FIELDS}
            accentColor={RED}
            theme="dark"
            onFilter={(sel) => {
              const empty = !Object.values(sel).some(a => a.length > 0)
              if (empty) { setForYou(null); return }
              const all = [...popular, ...trending, ...topRated].filter((g,i,arr) => arr.findIndex(x => x.id === g.id) === i)
              setForYou(filterGames(all, sel))
            }}
            resultCount={forYou?.length ?? null}
          />
        </div>

        {forYou && (
          <div className="max-w-screen-xl mx-auto px-6 lg:px-14">
            <div className="flex items-center gap-4 mb-7">
              <NeonCorner />
              <h2 style={{ fontFamily: BEBAS, fontSize: 'clamp(2.4rem,4vw,3.8rem)', color: '#FFE8E8', letterSpacing: '0.1em' }}>FOR YOU</h2>
              <span style={{ fontFamily: BEBAS, fontSize: '14px', letterSpacing: '0.12em', color: 'rgba(255,60,60,0.6)' }}>{forYou.length} MATCHES</span>
            </div>
            {forYou.length === 0
              ? <p style={{ color: 'rgba(255,150,150,0.6)', fontFamily: BEBAS, letterSpacing: '0.08em' }}>NO MATCHES — TRY DIFFERENT PREFERENCES</p>
              : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {forYou.map((item, i) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}>
                      <RichCard item={item} type="game" accentColor={RED} onClick={() => handleClick(item)} />
                    </motion.div>
                  ))}
                </div>
              )}
          </div>
        )}

        {!forYou && loading && (
          <div className="px-6 lg:px-14 max-w-screen-xl mx-auto">
            <CardSkeletonRow count={6} />
          </div>
        )}
        {!forYou && !loading && sections.filter(s => s.items.length > 0).map(({ title, items, id }) => (
          <div key={id}>
            <div className="max-w-screen-xl mx-auto px-6 lg:px-14 mb-7">
              <div className="flex items-center gap-4 mb-2">
                <NeonCorner />
                <motion.h2 className="game-glitch game-glow"
                  animate={{ x: [0,0,0,-4,4,-2,2,0,0,0] }}
                  transition={{ duration: 3.8, repeat: Infinity, times: [0,.84,.86,.88,.90,.92,.94,.96,.98,1] }}
                  style={{ fontFamily: BEBAS, fontSize: 'clamp(2.4rem,4vw,3.8rem)', color: '#FFE8E8', letterSpacing: '0.1em' }}>
                  {title.toUpperCase()}
                </motion.h2>
                <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, ${RED}80, transparent)` }} />
                <span style={{ fontFamily: BEBAS, fontSize: '14px', letterSpacing: '0.12em', color: 'rgba(255,60,60,0.55)' }}>
                  {items.length} GAMES
                </span>
                <div className="neon-dot w-2 h-2 rounded-full" style={{ background: RED, flexShrink: 0 }} />
              </div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[36,22,14,8,5].map((w, i) => (
                  <div key={i} style={{ width: `${w}px`, height: '2px', background: RED, opacity: 1 - i * 0.18, boxShadow: `0 0 4px ${RED}` }} />
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(180,0,0,0.06) 1px, transparent 1px)', backgroundSize: '100% 48px', zIndex: 0 }} />
              <div className="pl-6 lg:pl-14 relative" style={{ zIndex: 1 }}>
                <AnimatePresence mode="wait">
                  <motion.div key={activeGenre || 'all'} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                    <Swiper modules={[Navigation, FreeMode]} freeMode slidesPerView="auto" spaceBetween={14} grabCursor className="!overflow-visible">
                      {items.map((item, i) => (
                        <SwiperSlide key={`${item.id}-${i}`} style={{ width: '230px' }}>
                          <motion.div initial={{ opacity: 0, y: 24, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3, delay: Math.min(i * 0.045, 0.4) }}>
                            <RichCard item={item} type="game" accentColor={RED} onClick={() => handleClick(item)} />
                          </motion.div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        ))}

        {!forYou && !loading && activeGenre && sections.every(s => s.items.length === 0) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div style={{ fontSize: '52px', marginBottom: '18px' }}>🎮</div>
            <h3 style={{ fontFamily: BEBAS, fontSize: '32px', color: '#FFE8E8', letterSpacing: '0.12em', marginBottom: '20px' }}>
              NO {activeGenre.toUpperCase()} GAMES LOADED
            </h3>
            <motion.button whileHover={{ scale: 1.05, boxShadow: `0 0 24px ${RED}` }}
              onClick={() => setActiveGenre(null)}
              style={{ padding: '12px 32px', background: RED, color: '#fff', fontFamily: BEBAS, letterSpacing: '0.12em', border: 'none', cursor: 'pointer', fontSize: '17px', clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}>
              SHOW ALL GAMES
            </motion.button>
          </motion.div>
        )}
      </div>

      <DetailModal item={detail || selected} type="game" isOpen={!!selected} onClose={() => { setSelected(null); setDetail(null) }} />
    </div>
  )
}
