import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Clock, ListMusic, Heart, Music2 } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, FreeMode } from 'swiper/modules'
import { useAuth } from '../context/AuthContext'
import PageHero from '../components/ui/PageHero'
import PersonalizePanel from '../components/ui/PersonalizePanel'
import AmbientBg from '../components/ui/AmbientBg'
import ContentTicker from '../components/ui/ContentTicker'
import playlistsData from '../data/playlists.json'

const MUSIC_ACCENT = '#3A9B7A'

const MUSIC_FIELDS = [
  { id: 'energy', label: 'Energy level', options: [
    { label: 'Chill',       value: 'chill' },
    { label: 'Focused',     value: 'focused' },
    { label: 'Pumped',      value: 'pumped' },
    { label: 'Melancholic', value: 'melancholic' },
    { label: 'Upbeat',      value: 'upbeat' },
  ]},
  { id: 'genre', label: 'Genre', options: [
    { label: 'Lo-Fi',      value: 'lo-fi' },
    { label: 'Jazz',       value: 'jazz' },
    { label: 'Classical',  value: 'classical' },
    { label: 'Pop',        value: 'pop' },
    { label: 'Hip-Hop',    value: 'hip-hop' },
    { label: 'R&B',        value: 'r&b' },
    { label: 'Opera',      value: 'opera' },
    { label: 'Ambient',    value: 'ambient' },
    { label: 'Electronic', value: 'electronic' },
    { label: 'Indie',      value: 'indie' },
    { label: 'Synthwave',  value: 'synthwave' },
  ]},
  { id: 'language', label: 'Language / Region', options: [
    { label: 'English', value: 'en' },
    { label: 'Tamil',   value: 'ta' },
    { label: 'Telugu',  value: 'te' },
    { label: 'Hindi',   value: 'hi' },
  ]},
  { id: 'activity', label: 'What are you doing?', options: [
    { label: 'Studying',    value: 'study' },
    { label: 'Working out', value: 'workout' },
    { label: 'Relaxing',    value: 'relax' },
    { label: 'Commuting',   value: 'commute' },
    { label: 'Sleeping',    value: 'sleep' },
  ]},
]

const ENERGY_MOODS = {
  chill: ['cozy','relaxed'], focused: ['focused','calm'],
  pumped: ['energetic','excited'], melancholic: ['nostalgic','sad'], upbeat: ['happy','romantic','upbeat'],
}

function parseDurationMins(dur = '') {
  const h = dur.match(/(\d+)h/)
  const m = dur.match(/(\d+)m/)
  return (h ? parseInt(h[1]) * 60 : 0) + (m ? parseInt(m[1]) : 0)
}

function filterPlaylists(playlists, sel, timeBudget) {
  let result = [...playlists]

  const energies = sel.energy || []
  if (energies.length) {
    const moods = energies.flatMap(e => ENERGY_MOODS[e] || [])
    result = result.filter(p => moods.some(m => p.mood?.toLowerCase().includes(m)))
  }
  const genres = sel.genre || []
  if (genres.length) {
    result = result.filter(p =>
      genres.some(g => p.genre?.toLowerCase().includes(g) || p.genres?.some(pg => pg.toLowerCase().includes(g)))
    )
  }
  const langs = sel.language || []
  if (langs.length) {
    result = result.filter(p => langs.includes(p.language) || (!p.language && langs.includes('en')))
  }
  const activities = sel.activity || []
  if (activities.length) {
    result = result.filter(p => activities.some(a => p.tags?.some(t => t.toLowerCase().includes(a))))
  }

  if (timeBudget && timeBudget !== 'all') {
    const limits = { '15m': 25, '30m': 45, '1h': 80, '2h': 999 }
    const mins = limits[timeBudget] ?? 999
    const minMins = timeBudget === '2h' ? 90 : 0
    result = result.filter(p => {
      const d = parseDurationMins(p.duration)
      return d >= minMins && d <= mins
    })
  }

  // Never empty — fall back to full playlist list
  return result.length > 0 ? result : playlists
}

const BG_IMAGES = [
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=2000&q=90',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=2000&q=90',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=2000&q=90',
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=2000&q=90',
]
const FLOATING = [
  { image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80', title: 'Late Night Jazz', sub: 'Cozy' },
  { image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80', title: 'Focus Flow', sub: 'Focused' },
  { image: 'https://images.unsplash.com/photo-1501386761578-eaa54b6103a3?w=400&q=80', title: 'Summer Hits', sub: 'Energetic' },
]

const MOODS = ['All', 'Cozy', 'Focused', 'Energetic', 'Relaxed', 'Romantic', 'Nostalgic', 'Upbeat', 'Happy']

const REGIONAL_SECTIONS = [
  { key: 'tamil',   title: 'Tamil Latest',      subtitle: 'Kollywood Hits',    flag: '🎵', lang: 'ta' },
  { key: 'telugu',  title: 'Telugu Latest',     subtitle: 'Tollywood Vibes',   flag: '🎶', lang: 'te' },
  { key: 'hindi',   title: 'Hindi / Bollywood', subtitle: 'Desi Beats',        flag: '🪗', lang: 'hi' },
  { key: 'english', title: 'English Latest',    subtitle: 'Global Hits',       flag: '🎸', lang: 'en' },
]

const GENRE_SECTIONS = [
  { key: 'hip-hop',   title: 'Hip Hop & Rap',     subtitle: 'Streets & Beats', flag: '🎤' },
  { key: 'pop',       title: 'Pop Anthems',        subtitle: 'Chart Toppers',   flag: '⭐' },
  { key: 'opera',     title: 'Opera & Classical',  subtitle: 'Grand Voices',    flag: '🎭' },
  { key: 'r&b',       title: 'R&B & Soul',         subtitle: 'Smooth Grooves',  flag: '💿' },
  { key: 'synthwave', title: 'Synthwave & Retro',  subtitle: 'Neon Nights',     flag: '🌆' },
]

export default function Music() {
  const { user, toggleFavorite, isFavorite } = useAuth()
  const [mood, setMood]       = useState('All')
  const [playing, setPlaying] = useState(null)
  const [forYou, setForYou]   = useState(null)

  const regionalPlaylists = (region) =>
    playlistsData.filter(p => p.region === region)

  const genrePlaylists = (genre) =>
    playlistsData.filter(p =>
      p.genre?.toLowerCase().includes(genre) ||
      p.genres?.some(g => g.toLowerCase().includes(genre))
    )

  const moodList = mood === 'All' ? playlistsData : playlistsData.filter(p => p.mood === mood)
  const list = forYou ?? moodList

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(150deg, #FDFCF8 0%, #F8F4EC 28%, #F2EDE0 58%, #E9E3D4 88%, #E2DAC8 100%)', position: 'relative', overflow: 'hidden' }}>
      <AmbientBg color1="#1A5E40" color2="#0A3A26" color3="#3A9B7A" />
      <PageHero
        images={BG_IMAGES}
        eyebrow="Playlists & Vibes"
        title={<>Feel the<br /><em style={{ fontStyle: 'italic', color: '#7ECBA8' }}>Rhythm</em></>}
        subtitle="Curated playlists for every mood, hour, and moment — music that moves you."
        headlineFont='"Bodoni Moda", serif'
        accentColor="#3A9B7A"
        overlayLeft="rgba(4,14,10,0.96)"
        ambientColor="rgba(58,155,122,0.2)"
        floatingCards={FLOATING}
        stats={[{value:'50+',label:'Playlists'},{value:'9',label:'Moods'},{value:'HD',label:'Quality'},{value:'Daily',label:'Curated'}]}
        bottomFade="#F7F3EE"
      >
        <div className="flex flex-wrap gap-2.5">
          {MOODS.map(m => (
            <motion.button key={m} whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}
              onClick={() => { setMood(m); setForYou(null) }}
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
              style={{
                background: mood === m && !forYou ? '#3A9B7A' : '#fff',
                color:      mood === m && !forYou ? '#fff' : '#3A3630',
                border: '1.5px solid',
                borderColor: mood === m && !forYou ? '#3A9B7A' : '#D4CCBC',
                boxShadow:   mood === m && !forYou ? '0 6px 20px #3A9B7A40' : '0 1px 4px rgba(28,26,24,0.06)',
              }}>
              {m}
            </motion.button>
          ))}
        </div>
      </PageHero>

      <ContentTicker variant="diagonal"
        items={[
          ...FLOATING.map(f => ({ image: f.image, title: f.title, label: f.sub })),
          { image: BG_IMAGES[0], label: 'Playlist' }, { image: BG_IMAGES[1], label: 'Vibes' },
          { image: BG_IMAGES[2], label: 'Beats' },   { image: BG_IMAGES[3], label: 'Live' },
        ]}
        bg="#F7F3EE" accentColor={MUSIC_ACCENT}
      />

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-10 space-y-10">
        <PersonalizePanel
          question="What do you want to listen to right now?"
          fields={MUSIC_FIELDS}
          accentColor={MUSIC_ACCENT}
          showSearch
          showTimePicker
          onFilter={(filterData) => {
            const { _description = '', _timeBudget, _moodIntensity, ...chipSel } = filterData
            const empty = !_description && !_timeBudget
              && !Object.values(chipSel).some(a => Array.isArray(a) && a.length > 0)
            if (empty) { setForYou(null); return }

            let result = filterPlaylists(playlistsData, chipSel, _timeBudget)

            if (_description) {
              const q = _description.toLowerCase()
              const byDesc = result.filter(p =>
                p.title?.toLowerCase().includes(q) ||
                p.genre?.toLowerCase().includes(q) ||
                p.mood?.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q) ||
                p.tags?.some(t => t.toLowerCase().includes(q))
              )
              if (byDesc.length > 0) result = byDesc
            }

            setForYou(result)
          }}
          resultCount={forYou?.length ?? null}
        />

        {/* Now playing embed */}
        <AnimatePresence>
          {playing && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1.5px solid #D4CCBC', boxShadow: '0 8px 30px rgba(28,26,24,0.1)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-end gap-0.5">
                    {[1,2,3,4].map(b => (
                      <div key={b} className="w-1 rounded-full bg-sage-500 animate-pulse"
                        style={{ height: `${10 + b * 4}px`, animationDelay: `${b * 0.1}s`, background: MUSIC_ACCENT }} />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-ink">Now Playing — {playing.title}</span>
                  <button onClick={() => setPlaying(null)} className="ml-auto text-ink-muted hover:text-ink text-sm transition-colors">✕</button>
                </div>
                <div className="aspect-video w-full max-w-xl rounded-xl overflow-hidden">
                  <iframe src={`${playing.embedUrl}?autoplay=1`} title={playing.title}
                    allow="autoplay; encrypted-media" className="w-full h-full" frameBorder="0" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* For You grid (when personalize is active) */}
        {forYou && (
          <div>
            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="font-display font-semibold text-ink" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', letterSpacing: '-0.025em' }}>For You</h2>
              <span style={{ fontSize: '13px', color: MUSIC_ACCENT, fontWeight: 600 }}>{forYou.length} playlists</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {forYou.map((pl, i) => (
                <motion.div key={pl.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.4) }}>
                  <PlaylistCard playlist={pl} isPlaying={playing?.id === pl.id}
                    onPlay={() => setPlaying(playing?.id === pl.id ? null : pl)}
                    isFav={isFavorite(pl.id, 'playlist')}
                    onFav={() => user && toggleFavorite(pl, 'playlist')} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Mood-filtered grid (when no personalize) */}
        {!forYou && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {list.map((pl, i) => (
              <motion.div key={pl.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: i * 0.05 }}>
                <PlaylistCard playlist={pl} isPlaying={playing?.id === pl.id}
                  onPlay={() => setPlaying(playing?.id === pl.id ? null : pl)}
                  isFav={isFavorite(pl.id, 'playlist')}
                  onFav={() => user && toggleFavorite(pl, 'playlist')} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── Regional Sections ─────────────────────────────────── */}
      {!forYou && (
        <div className="py-6 space-y-10">
          {REGIONAL_SECTIONS.map(({ key, title, subtitle, flag }) => {
            const items = regionalPlaylists(key)
            if (!items.length) return null
            return (
              <div key={key} className="space-y-4">
                <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl">{flag}</span>
                    <h2 className="font-display font-semibold text-ink" style={{ fontSize: 'clamp(1.6rem,2.8vw,2.4rem)', letterSpacing: '-0.025em' }}>{title}</h2>
                    <span className="text-ink-muted text-sm font-medium">{subtitle}</span>
                  </div>
                </div>
                <div className="pl-6 lg:pl-12">
                  <Swiper modules={[Navigation, FreeMode]} freeMode slidesPerView="auto" spaceBetween={20} grabCursor className="!overflow-visible">
                    {items.map((pl, i) => (
                      <SwiperSlide key={pl.id} style={{ width: '260px' }}>
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.06, 0.3) }}>
                          <PlaylistCard playlist={pl} isPlaying={playing?.id === pl.id}
                            onPlay={() => setPlaying(playing?.id === pl.id ? null : pl)}
                            isFav={isFavorite(pl.id, 'playlist')}
                            onFav={() => user && toggleFavorite(pl, 'playlist')} />
                        </motion.div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            )
          })}

          {/* ── Genre Sections ─────────────────────────────────── */}
          {GENRE_SECTIONS.map(({ key, title, subtitle, flag }) => {
            const items = genrePlaylists(key)
            if (!items.length) return null
            return (
              <div key={key} className="space-y-4">
                <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl">{flag}</span>
                    <h2 className="font-display font-semibold text-ink" style={{ fontSize: 'clamp(1.6rem,2.8vw,2.4rem)', letterSpacing: '-0.025em' }}>{title}</h2>
                    <span className="text-ink-muted text-sm font-medium">{subtitle}</span>
                  </div>
                </div>
                <div className="pl-6 lg:pl-12">
                  <Swiper modules={[Navigation, FreeMode]} freeMode slidesPerView="auto" spaceBetween={20} grabCursor className="!overflow-visible">
                    {items.map((pl, i) => (
                      <SwiperSlide key={pl.id} style={{ width: '260px' }}>
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.06, 0.3) }}>
                          <PlaylistCard playlist={pl} isPlaying={playing?.id === pl.id}
                            onPlay={() => setPlaying(playing?.id === pl.id ? null : pl)}
                            isFav={isFavorite(pl.id, 'playlist')}
                            onFav={() => user && toggleFavorite(pl, 'playlist')} />
                        </motion.div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function PlaylistCard({ playlist, isPlaying, onPlay, isFav, onFav }) {
  const [hov, setHov] = useState(false)
  const cardRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width  - 0.5
    const y = (e.clientY - r.top)  / r.height - 0.5
    el.style.transform = `perspective(750px) rotateY(${x * 12}deg) rotateX(${-y * 8}deg) translateY(-10px) scale(1.03)`
  }, [])
  const handleLeave = useCallback(() => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(750px) rotateY(0) rotateX(0) translateY(0) scale(1)'
    setHov(false)
  }, [])

  return (
    <div ref={cardRef} onMouseEnter={() => setHov(true)} onMouseMove={handleMouseMove} onMouseLeave={handleLeave}
      className="cursor-pointer select-none"
      style={{
        borderRadius: '14px', overflow: 'hidden', background: '#fff',
        boxShadow: isPlaying
          ? '0 0 0 2px #3A9B7A, 0 20px 50px rgba(58,155,122,0.28)'
          : hov ? '0 32px 64px rgba(14,10,6,0.2), 0 8px 24px rgba(58,155,122,0.18)' : '0 4px 20px rgba(14,10,6,0.09)',
        transition: 'box-shadow 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.18s ease',
        transformStyle: 'preserve-3d', willChange: 'transform',
      }}>

      <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
        <img src={playlist.image} alt={playlist.title}
          className="w-full h-full object-cover"
          style={{ transform: hov ? 'scale(1.1)' : 'scale(1.01)', transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)' }} />

        <div className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{ height: '75%', background: 'linear-gradient(to top, rgba(4,3,2,0.96) 0%, rgba(4,3,2,0.7) 35%, rgba(4,3,2,0.15) 65%, transparent 100%)' }} />
        <div className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none transition-opacity duration-500"
          style={{ opacity: hov ? 1 : 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(58,155,122,0.45) 0%, transparent 70%)' }} />

        {isPlaying && (
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(0,0,0,0.25)' }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-end gap-1.5 h-10">
              {[3,5,4,6,3,5].map((h,b) => (
                <div key={b} className="w-1.5 rounded-full bg-white"
                  style={{ height: `${h * 5}px`, animation: `glowPulse ${0.8 + b * 0.15}s ease-in-out infinite`, animationDelay: `${b * 0.1}s` }} />
              ))}
            </div>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span className="px-3 py-1.5 rounded-full font-semibold"
            style={{ fontSize: '10px', letterSpacing: '0.06em', background: 'rgba(58,155,122,0.88)', color: '#fff', backdropFilter: 'blur(10px)', boxShadow: '0 2px 12px rgba(58,155,122,0.4)' }}>
            {playlist.mood?.toUpperCase()}
          </span>
        </div>

        <button onClick={e => { e.stopPropagation(); onFav() }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
          style={{ opacity: isFav ? 1 : hov ? 1 : 0, background: isFav ? '#ef4444' : 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.18)' }}>
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white text-white' : 'text-white'}`} />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-white leading-tight line-clamp-1 mb-1"
              style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '19px', fontWeight: 600, letterSpacing: '-0.01em' }}>
              {playlist.title}
            </h3>
            <div className="flex items-center gap-2.5" style={{ color: 'rgba(255,240,220,0.5)', fontSize: '10.5px' }}>
              <span className="flex items-center gap-1"><ListMusic className="w-3 h-3" />{playlist.tracks} tracks</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{playlist.duration}</span>
            </div>
          </div>
          <button onClick={onPlay}
            className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: isPlaying ? '#3A9B7A' : 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(16px)', border: '1.5px solid rgba(255,255,255,0.3)',
              boxShadow: isPlaying ? '0 4px 20px rgba(58,155,122,0.5)' : 'none',
              opacity: hov || isPlaying ? 1 : 0,
              transform: hov || isPlaying ? 'scale(1)' : 'scale(0.85)',
            }}>
            {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
          </button>
        </div>
      </div>

      <div className="px-4 py-2.5 flex items-center justify-between"
        style={{ background: '#FAFAF8', borderTop: '1.5px solid rgba(58,155,122,0.12)' }}>
        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(58,155,122,0.1)', color: '#3A9B7A', border: '1px solid rgba(58,155,122,0.2)' }}>
          {playlist.genre}
        </span>
        <Music2 className="w-3.5 h-3.5" style={{ color: 'rgba(58,155,122,0.4)' }} />
      </div>
    </div>
  )
}
