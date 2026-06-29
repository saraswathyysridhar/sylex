import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, FreeMode } from 'swiper/modules'
import RichCard from '../components/ui/RichCard'
import FilterBar from '../components/ui/FilterBar'
import DetailModal from '../components/ui/DetailModal'
import PageHero from '../components/ui/PageHero'
import PersonalizePanel from '../components/ui/PersonalizePanel'
import { CardSkeletonRow } from '../components/ui/LoadingSkeleton'
import AmbientBg from '../components/ui/AmbientBg'
import ContentTicker from '../components/ui/ContentTicker'
import { getTrending, getPopular, getTopRated, getNowPlaying, searchMovies, getMovieDetails, GENRE_MAP, getByLanguage, getClassics } from '../api/tmdb'
import TrendingFromUsers from '../components/ui/TrendingFromUsers'
import { useAuth } from '../context/AuthContext'

const ACCENT = '#5A9FBF'

const MOOD_INTENSITY_GENRES = {
  lighthearted: [35, 10751, 16, 10749],
  feelgood:     [10749, 18, 35],
  balanced:     [],
  gripping:     [53, 28, 12],
  dark:         [27, 9648, 80, 53],
}

function getMoodIntensityZone(v) {
  if (v <= 20) return 'lighthearted'
  if (v <= 40) return 'feelgood'
  if (v < 60)  return 'balanced'
  if (v <= 80) return 'gripping'
  return 'dark'
}

const MOOD_GENRES = {
  thrilled:  [53, 28],
  feel_good: [35, 10751],
  inspired:  [18, 99],
  romantic:  [10749, 18],
  dark:      [27, 80],
  epic:      [12, 878, 14],
}
const GENRE_IDS = {
  action: 28, comedy: 35, drama: 18, horror: 27,
  'sci-fi': 878, romance: 10749, thriller: 53, animation: 16,
}

const MOVIE_FIELDS = [
  { id: 'mood', label: 'How are you feeling?', options: [
    { label: 'Thrilled',   value: 'thrilled' },
    { label: 'Feel-Good',  value: 'feel_good' },
    { label: 'Inspired',   value: 'inspired' },
    { label: 'Romantic',   value: 'romantic' },
    { label: 'Dark',       value: 'dark' },
    { label: 'Epic',       value: 'epic' },
  ]},
  { id: 'genre', label: 'Genre', options: [
    { label: 'Action',    value: 'action' },
    { label: 'Comedy',    value: 'comedy' },
    { label: 'Drama',     value: 'drama' },
    { label: 'Sci-Fi',    value: 'sci-fi' },
    { label: 'Horror',    value: 'horror' },
    { label: 'Romance',   value: 'romance' },
    { label: 'Thriller',  value: 'thriller' },
    { label: 'Animation', value: 'animation' },
  ]},
  { id: 'language', label: 'Language', options: [
    { label: 'English',   value: 'en' },
    { label: 'Hindi',     value: 'hi' },
    { label: 'Tamil',     value: 'ta' },
    { label: 'Telugu',    value: 'te' },
    { label: 'Malayalam', value: 'ml' },
    { label: 'Korean',    value: 'ko' },
    { label: 'Spanish',   value: 'es' },
    { label: 'French',    value: 'fr' },
    { label: 'Japanese',  value: 'ja' },
  ]},
]

function filterMovies(sectionMap, sel, moodIntensity = 50) {
  const allMovies = Object.values(sectionMap).flat()
  const seen = new Set()
  let result = allMovies.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true })

  const moods = sel.mood || []
  if (moods.length) {
    const gids = moods.flatMap(m => MOOD_GENRES[m] || [])
    result = result.filter(m => m.genres?.some(g => gids.includes(g)))
  }
  const genres = sel.genre || []
  if (genres.length) {
    const gids = genres.map(g => GENRE_IDS[g]).filter(Boolean)
    if (gids.length) result = result.filter(m => m.genres?.some(g => gids.includes(g)))
  }
  const langs = sel.language || []
  if (langs.length) result = result.filter(m => langs.includes(m.language))

  if (moodIntensity !== 50) {
    const intensityGids = MOOD_INTENSITY_GENRES[getMoodIntensityZone(moodIntensity)]
    if (intensityGids.length > 0) {
      result = result.filter(m => m.genres?.some(g => intensityGids.includes(g)))
    }
  }

  return result
}

// Progressively relaxes filters until we always get results — user never sees empty
function filterMoviesWithFallback(sectionMap, chipSel, moodIntensity) {
  const base = Object.values(sectionMap).flat()
  const dedup = (arr) => { const seen = new Set(); return arr.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true }) }
  const fullPool = dedup(base)
  if (fullPool.length === 0) return []

  const tries = [
    () => filterMovies(sectionMap, chipSel, moodIntensity),
    () => filterMovies(sectionMap, chipSel, 50),
    () => { const { mood: _m, ...s } = chipSel; return filterMovies(sectionMap, s, 50) },
    () => filterMovies(sectionMap, { language: chipSel.language || [] }, 50),
    () => fullPool,
  ]
  for (const attempt of tries) {
    const r = attempt()
    if (r.length > 0) return r
  }
  return fullPool
}

const BG_IMAGES = [
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=2000&q=90',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=2000&q=90',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=2000&q=90',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=2000&q=90',
]
const FLOATING = [
  { image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80', title: 'Trending Tonight', sub: 'Cinema' },
  { image: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=400&q=80', title: 'Award Season', sub: 'Drama' },
  { image: 'https://images.unsplash.com/photo-1512070679279-8988d32161be?w=400&q=80', title: 'Now Playing', sub: 'Thriller' },
]
const TABS = [
  { id: 'trending', label: '🔥 Trending' },
  { id: 'popular', label: '⭐ Popular' },
  { id: 'top_rated', label: '🏆 Top Rated' },
  { id: 'now_playing', label: '🎞 Now Playing' },
]
const SECTION_TITLES = { trending: '🔥 Trending This Week', popular: '⭐ Popular Right Now', top_rated: '🏆 All-Time Greats', now_playing: '🎞 In Cinemas' }

export default function Movies() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [tab, setTab] = useState('trending')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [detail, setDetail] = useState(null)
  const [trending, setTrending] = useState([])
  const [popular, setPopular] = useState([])
  const [topRated, setTopRated] = useState([])
  const [nowPlaying, setNowPlaying] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [forYou, setForYou] = useState(null)
  const [forYouLoading, setForYouLoading] = useState(false)
  // Regional + classic sections (load after main content)
  const [bollywood, setBollywood] = useState([])
  const [tamil, setTamil]         = useState([])
  const [telugu, setTelugu]       = useState([])
  const [classics, setClassics]   = useState([])
  const [worldLoaded, setWorldLoaded] = useState(false)

  useEffect(() => {
    if (q) { setLoading(true); searchMovies(q).then(d => { setItems(d); setLoading(false) }).catch(() => setLoading(false)); return }
    if (loaded) return
    setLoading(true)
    Promise.all([getTrending(), getPopular(), getTopRated(), getNowPlaying()])
      .then(([t, p, r, n]) => { setTrending(t); setPopular(p); setTopRated(r); setNowPlaying(n); setLoaded(true) })
      .catch(console.error).finally(() => setLoading(false))

    // Load world cinema + classics after a short delay (avoids API rate limit)
    if (!worldLoaded) {
      setTimeout(async () => {
        try {
          const [hi, ta, te, cl] = await Promise.all([
            getByLanguage('hi'), getByLanguage('ta'), getByLanguage('te'), getClassics(),
          ])
          setBollywood(hi); setTamil(ta); setTelugu(te); setClassics(cl)
          setWorldLoaded(true)
        } catch { /* silent — world cinema is supplementary */ }
      }, 1800)
    }
  }, [q])

  const handleClick = async (item) => {
    setSelected(item)
    try { const d = await getMovieDetails(item.id); setDetail({ ...d, genres: (d.genres||[]).map(g=>GENRE_MAP[g]||g) }) }
    catch { setDetail({ ...item, genres: (item.genres||[]).map(g=>GENRE_MAP[g]||g) }) }
  }

  const sectionMap = { trending, popular, top_rated: topRated, now_playing: nowPlaying }

  // Full pool = all loaded sections including regional + classics
  const allMoviePool = { ...sectionMap, bollywood, tamil, telugu, classics }

  const handlePersonalize = (filterData) => {
    const { _description = '', _moodIntensity = 50, _timeBudget, ...chipSel } = filterData

    const empty = !_description
      && _moodIntensity === 50
      && !_timeBudget
      && !Object.values(chipSel).some(a => Array.isArray(a) && a.length > 0)
    if (empty) { setForYou(null); setForYouLoading(false); return }

    // Description search: use TMDB search API, then apply chip + mood filters on results
    if (_description) {
      setForYouLoading(true)
      setForYou([])
      searchMovies(_description)
        .then(results => {
          const filtered = results.length
            ? filterMoviesWithFallback({ searchResults: results }, chipSel, _moodIntensity)
            : filterMoviesWithFallback(allMoviePool, chipSel, _moodIntensity)
          setForYou(filtered)
        })
        .catch(() => setForYou(filterMoviesWithFallback(allMoviePool, chipSel, 50)))
        .finally(() => setForYouLoading(false))
      return
    }

    // Local filter: chips + mood slider on already-loaded movies
    const regionalLangs = ['hi', 'ta', 'te', 'ml']
    const wantsRegional = (chipSel.language || []).some(l => regionalLangs.includes(l))
    if (wantsRegional && !worldLoaded) {
      const waitAndFilter = () => {
        setForYou(filterMoviesWithFallback({ ...sectionMap, bollywood, tamil, telugu, classics }, chipSel, _moodIntensity))
      }
      const id = setInterval(() => {
        if (bollywood.length || tamil.length || telugu.length) { clearInterval(id); waitAndFilter() }
      }, 300)
      setTimeout(() => clearInterval(id), 8000)
    }
    setForYou(filterMoviesWithFallback(allMoviePool, chipSel, _moodIntensity))
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(150deg, #FDFBF8 0%, #F8F3EC 28%, #F3EDE1 58%, #EBE4D6 88%, #E4DBC8 100%)', position: 'relative', overflow: 'hidden' }}>
      <AmbientBg color1="#3A6B8C" color2="#1C3A5E" color3="#5A9FBF" />
      <PageHero images={BG_IMAGES} eyebrow="Cinema"
        title={<>Find Your<br /><em style={{ fontStyle:'italic', color:'#7EB8D4' }}>Film</em></>}
        subtitle="From cozy classics to edge-of-seat thrillers — discover tonight's perfect watch."
        headlineFont='"Bodoni Moda", serif'
        accentColor="#5A9FBF" overlayLeft="rgba(8,12,22,0.95)" ambientColor="rgba(74,120,180,0.2)"
        floatingCards={FLOATING}
        stats={[{value:'1M+',label:'Films'},{value:'8.4★',label:'Avg Rating'},{value:'24',label:'Genres'},{value:'Daily',label:'Updated'}]}
        bottomFade="#F7F3EE">
        <div className="flex gap-2.5 flex-wrap">
          {TABS.map(t => (
            <motion.button key={t.id} whileHover={{ y:-2 }} whileTap={{ scale:0.96 }} onClick={() => setTab(t.id)}
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
              style={{ background: tab===t.id?'#5A9FBF':'#fff', color: tab===t.id?'#fff':'#3A3630', border:'1.5px solid', borderColor: tab===t.id?'#5A9FBF':'#D4CCBC', boxShadow: tab===t.id?'0 6px 20px #5A9FBF40':'0 1px 4px rgba(28,26,24,0.06)' }}>
              {t.label}
            </motion.button>
          ))}
        </div>
      </PageHero>

      <ContentTicker variant="cinema"
        items={[
          ...FLOATING.map(f => ({ image: f.image, title: f.title, label: f.sub })),
          { image: BG_IMAGES[0], label: 'Cinema' }, { image: BG_IMAGES[1], label: 'Drama' },
          { image: BG_IMAGES[2], label: 'Classic' }, { image: BG_IMAGES[3], label: 'Film' },
        ]}
        bg="#F7F3EE" accentColor={ACCENT}
      />

      <div className="py-10 space-y-8" style={{ position: 'relative', zIndex: 1 }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-14">
          <PersonalizePanel
            question="What kind of film are you in the mood for?"
            fields={MOVIE_FIELDS}
            accentColor={ACCENT}
            onFilter={handlePersonalize}
            resultCount={forYouLoading ? null : (forYou?.length ?? null)}
            showSearch
            showMoodSlider
            showTimePicker
          />
        </div>

        {(forYou !== null || forYouLoading) && (
          <div className="max-w-screen-xl mx-auto px-6 lg:px-14">
            <div className="flex items-baseline gap-4 mb-6">
              <h2 className="font-display font-semibold text-ink" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', letterSpacing: '-0.025em' }}>
                For You
              </h2>
              {!forYouLoading && forYou !== null && (
                <span style={{ fontSize: '13px', color: ACCENT, fontWeight: 600 }}>{forYou.length} films</span>
              )}
            </div>
            {forYouLoading ? (
              <CardSkeletonRow count={8} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {(forYou || []).map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.35) }}>
                    <RichCard item={item} type="movie" accentColor={ACCENT} onClick={() => handleClick(item)} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {!forYou && (
        <div className="max-w-screen-xl mx-auto px-6 lg:px-14">
          {q && <p className="text-ink-muted mb-4">Results for <span className="font-semibold text-ink">"{q}"</span></p>}
          <FilterBar />
        </div>
        )}
        {!forYou && loading && (
          <div className="px-6 lg:px-14 max-w-screen-xl mx-auto"><CardSkeletonRow count={8} /></div>
        )}

        {!forYou && !loading && q && (
          <div className="max-w-screen-xl mx-auto px-6 lg:px-14">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {items.map((item,i) => (
                <motion.div key={item.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}>
                  <RichCard item={item} type="movie" accentColor="#5A9FBF" onClick={() => handleClick(item)} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {!forYou && !loading && !q && (
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.3}}>
              {(sectionMap[tab]||[]).length > 0 && (
                <>
                  <div className="max-w-screen-xl mx-auto px-6 lg:px-14 mb-6">
                    <h2 className="font-display font-semibold text-ink" style={{ fontSize:'clamp(1.8rem,3vw,2.6rem)', letterSpacing:'-0.025em' }}>{SECTION_TITLES[tab]}</h2>
                  </div>
                  <div className="pl-6 lg:pl-14">
                    <Swiper modules={[Navigation,FreeMode]} freeMode slidesPerView="auto" spaceBetween={18} grabCursor className="!overflow-visible">
                      {(sectionMap[tab]||[]).map((item,i) => (
                        <SwiperSlide key={`${item.id}-${i}`} style={{width:'230px'}}>
                          <RichCard item={item} type="movie" accentColor="#5A9FBF" onClick={() => handleClick(item)} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── WORLD CINEMA ─────────────────────────────────── */}
        {!forYou && !q && [
          { title: 'Bollywood',          subtitle: 'Hindi Cinema', items: bollywood, flag: '🇮🇳' },
          { title: 'Tamil Cinema',        subtitle: 'Kollywood',    items: tamil,     flag: '🎬' },
          { title: 'Telugu Films',        subtitle: 'Tollywood',    items: telugu,    flag: '🎥' },
          { title: 'Classic Hollywood',   subtitle: '1975 – 2002',  items: classics,  flag: '🎞' },
        ].filter(s => s.items.length > 0).map(({ title, subtitle, items, flag }) => (
          <div key={title} className="space-y-4">
            <div className="max-w-screen-xl mx-auto px-6 lg:px-14">
              <div className="flex items-baseline gap-3">
                <span className="text-xl">{flag}</span>
                <h2 className="font-display font-semibold text-ink" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', letterSpacing: '-0.025em' }}>{title}</h2>
                <span className="text-ink-muted text-sm font-medium">{subtitle}</span>
              </div>
            </div>
            <div className="pl-6 lg:pl-14">
              <Swiper modules={[Navigation, FreeMode]} freeMode slidesPerView="auto" spaceBetween={18} grabCursor className="!overflow-visible">
                {items.map((item, i) => (
                  <SwiperSlide key={`${item.id}-${i}`} style={{ width: '230px' }}>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}>
                      <RichCard item={item} type="movie" accentColor={ACCENT} onClick={() => handleClick(item)} />
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        ))}
      </div>
      <DetailModal item={detail||selected} type="movie" isOpen={!!selected} onClose={() => { setSelected(null); setDetail(null) }} />
    </div>
  )
}
