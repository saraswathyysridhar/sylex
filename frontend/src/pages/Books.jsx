import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, FreeMode } from 'swiper/modules'
import RichCard from '../components/ui/RichCard'
import DetailModal from '../components/ui/DetailModal'
import PageHero from '../components/ui/PageHero'
import PersonalizePanel from '../components/ui/PersonalizePanel'
import { CardSkeletonRow } from '../components/ui/LoadingSkeleton'
import AmbientBg from '../components/ui/AmbientBg'
import ContentTicker from '../components/ui/ContentTicker'
import { searchBooks, getBookDetails } from '../api/googleBooks'

const BOOK_ACCENT = '#8B5E3C'

const BOOK_FIELDS = [
  { id: 'mood', label: 'How are you feeling?', options: [
    { label: 'Inspired',    value: 'inspired' },
    { label: 'Cozy',        value: 'cozy' },
    { label: 'Curious',     value: 'curious' },
    { label: 'Reflective',  value: 'reflective' },
    { label: 'Adventurous', value: 'adventurous' },
    { label: 'Spiritual',   value: 'spiritual' },
  ]},
  { id: 'genre', label: 'Genre', options: [
    { label: 'Fiction',          value: 'fiction' },
    { label: 'Mystery',          value: 'mystery' },
    { label: 'Self-Help',        value: 'self-help' },
    { label: 'Science',          value: 'science' },
    { label: 'Romance',          value: 'romance' },
    { label: 'Biography',        value: 'biography' },
    { label: 'History',          value: 'history' },
    { label: 'Mythology',        value: 'mythology' },
    { label: 'Spirituality',     value: 'spirituality' },
    { label: 'Educational',      value: 'educational' },
  ]},
  { id: 'length', label: 'Reading time', options: [
    { label: 'Quick  <200p', value: 'short' },
    { label: 'Medium  ~350p', value: 'medium' },
    { label: 'Long   400p+',  value: 'long' },
  ]},
]

const MOOD_BOOK_CATS = {
  inspired:    ['business','biography','self-help','motivation'],
  cozy:        ['fiction','romance','fantasy','contemporary'],
  curious:     ['science','nature','history','technology'],
  reflective:  ['philosophy','poetry','psychology','memoir'],
  adventurous: ['adventure','fantasy','thriller','action'],
  spiritual:   ['spirituality','mythology','religion','vedic','sanskrit','yoga','meditation'],
}

// Broad text search across all book fields — Google Books rarely populates categories
function bookText(b) {
  return [
    ...(b.genres || []),
    b.title || '',
    b.description || '',
    b.author || '',
  ].join(' ').toLowerCase()
}

function filterBooks(sections, sel) {
  let pool = Object.values(sections).flat()
  const seen = new Set()
  pool = pool.filter(b => { if (seen.has(b.id)) return false; seen.add(b.id); return true })

  const moods = sel.mood || []
  if (moods.length) {
    const kw = moods.flatMap(m => MOOD_BOOK_CATS[m] || [])
    pool = pool.filter(b => kw.some(k => bookText(b).includes(k)))
  }
  const genres = sel.genre || []
  if (genres.length) {
    pool = pool.filter(b => genres.some(g => bookText(b).includes(g)))
  }
  const lengths = sel.length || []
  if (lengths.length) {
    pool = pool.filter(b => {
      const p = b.pages || b.pageCount || 300
      return (lengths.includes('short') && p < 200) || (lengths.includes('medium') && p >= 200 && p < 400) || (lengths.includes('long') && p >= 400)
    })
  }
  // Never empty — fall back to full loaded pool
  return pool.length > 0 ? pool : Object.values(sections).flat()
}

const BG_IMAGES = [
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=2000&q=90',
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=2000&q=90',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=2000&q=90',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=2000&q=90',
]
const FLOATING = [
  { image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80', title: 'Literary Fiction', sub: 'Bestseller' },
  { image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80', title: 'Science & Nature', sub: 'Popular' },
  { image: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=400&q=80', title: 'Philosophy', sub: 'Classic' },
]

const SUBJECTS = [
  'Fiction', 'Biography', 'Science', 'Self-Help', 'History', 'Philosophy', 'Mystery', 'Romance',
  'Greek Mythology', 'Indian Mythology', 'Vedic Texts', 'Sanskrit', 'World Religions', 'Educational',
]

// Module-level cache — survives React StrictMode double-mount and page re-visits
const CACHE = {}

async function fetchSubject(s) {
  if (CACHE[s]) return CACHE[s]
  const items = await searchBooks(s)
  CACHE[s] = items.slice(0, 15)
  return CACHE[s]
}

export default function Books() {
  const [sections,  setSections]  = useState({})
  const [loading,   setLoading]   = useState(true)
  const [selected,  setSelected]  = useState(null)
  const [detail,    setDetail]    = useState(null)
  const [loadingSubject, setLoadingSubject] = useState(null)
  const [forYou,    setForYou]    = useState(null)

  // Guard prevents StrictMode's second useEffect call from firing a second network request
  const didLoad = useRef(false)

  useEffect(() => {
    // Populate from cache immediately (handles StrictMode second call and re-visits)
    if (Object.keys(CACHE).length) {
      setSections({ ...CACHE })
      setLoading(false)
      return
    }
    if (didLoad.current) return
    didLoad.current = true

    const load = async () => {
      // Load Fiction first after a short settle delay
      await new Promise(r => setTimeout(r, 800))
      try {
        const items = await fetchSubject('Fiction')
        if (items.length) setSections({ Fiction: items })
      } catch { /* rate limited — user can click chips manually */ }
      setLoading(false)

      // Biography after a longer gap
      await new Promise(r => setTimeout(r, 3000))
      try {
        const items = await fetchSubject('Biography')
        if (items.length) setSections(prev => ({ ...prev, Biography: items }))
      } catch {}
    }
    load()
  }, [])

  const handleChipClick = async (s) => {
    // If already loaded (cache hit), just scroll / show — no network call
    if (CACHE[s]) {
      setSections(prev => ({ ...prev, [s]: CACHE[s] }))
      return
    }
    setLoadingSubject(s)
    try {
      const items = await fetchSubject(s)
      if (items.length) setSections(prev => ({ ...prev, [s]: items }))
    } catch { /* 429 — show nothing new */ }
    setLoadingSubject(null)
  }

  const handleClick = async (item) => {
    setSelected(item)
    try { setDetail(await getBookDetails(item.id)) } catch { setDetail(item) }
  }

  const loaded = Object.keys(sections)

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(150deg, #FEFCF8 0%, #FAF5ED 28%, #F5EFDF 58%, #EDEADB 88%, #E6E1CE 100%)', position: 'relative', overflow: 'hidden' }}>
      <AmbientBg color1="#6B4020" color2="#4A2810" color3="#8B5E3C" />
      <PageHero images={BG_IMAGES} eyebrow="Library"
        title={<>Find Your<br /><em style={{ fontStyle: 'italic', color: '#C49A6C' }}>Story</em></>}
        subtitle="From literary fiction to science and philosophy — every book for every state of mind."
        headlineFont='"Bodoni Moda", "Libre Baskerville", serif'
        accentColor="#8B5E3C" overlayLeft="rgba(16,10,4,0.96)" ambientColor="rgba(139,94,60,0.2)"
        floatingCards={FLOATING}
        stats={[{value:'40M+',label:'Books'},{value:'1M+',label:'Authors'},{value:'50+',label:'Genres'},{value:'Free',label:'Preview'}]}
        bottomFade="#F7F3EE">

        <div className="flex flex-wrap gap-2.5">
          {SUBJECTS.map(s => {
            const isLoaded  = !!CACHE[s]
            const isLoading = loadingSubject === s
            return (
              <motion.button key={s} whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}
                onClick={() => handleChipClick(s)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                style={{
                  background:  isLoaded ? '#8B5E3C' : '#fff',
                  color:       isLoaded ? '#fff' : '#3A3630',
                  border:      `1.5px solid ${isLoaded ? '#8B5E3C' : '#D4CCBC'}`,
                  boxShadow:   isLoaded ? '0 6px 20px #8B5E3C40' : '0 1px 4px rgba(28,26,24,0.06)',
                  opacity:     isLoading ? 0.6 : 1,
                }}>
                {isLoading ? (
                  <span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid #8B5E3C', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                ) : isLoaded ? '✓ ' : ''}
                {s}
              </motion.button>
            )
          })}
        </div>
      </PageHero>

      <ContentTicker variant="waterfall"
        items={[
          ...FLOATING.map(f => ({ image: f.image, title: f.title, label: f.sub })),
          { image: BG_IMAGES[0], label: 'Library' }, { image: BG_IMAGES[1], label: 'Fiction' },
          { image: BG_IMAGES[2], label: 'Classic' }, { image: BG_IMAGES[3], label: 'Read' },
        ]}
        bg="#F7F3EE" accentColor={BOOK_ACCENT}
      />

      <div className="py-10 space-y-10" style={{ position: 'relative', zIndex: 1 }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-14">
          <PersonalizePanel
            question="What kind of book are you looking for?"
            fields={BOOK_FIELDS}
            accentColor={BOOK_ACCENT}
            onFilter={(filterData) => {
              const { _description = '', _timeBudget, _moodIntensity, ...chipSel } = filterData
              const empty = !_description && !Object.values(chipSel).some(a => Array.isArray(a) && a.length > 0)
              if (empty) { setForYou(null); return }
              let result = filterBooks(sections, chipSel)
              if (_description) {
                const q = _description.toLowerCase()
                const byDesc = result.filter(b =>
                  b.title?.toLowerCase().includes(q) || b.description?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q)
                )
                if (byDesc.length > 0) result = byDesc
              }
              setForYou(result)
            }}
            resultCount={forYou?.length ?? null}
          />
        </div>
        {forYou && (
          <div className="max-w-screen-xl mx-auto px-6 lg:px-14">
            <div className="flex items-baseline gap-4 mb-6">
              <h2 className="font-display font-semibold text-ink" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', letterSpacing: '-0.025em' }}>For You</h2>
              <span style={{ fontSize: '13px', color: BOOK_ACCENT, fontWeight: 600 }}>{forYou.length} books</span>
            </div>
            {forYou.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {forYou.map((item, i) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}>
                      <RichCard item={item} type="book" accentColor={BOOK_ACCENT} onClick={() => handleClick(item)} />
                    </motion.div>
                  ))}
                </div>
              )}
          </div>
        )}
        {loading && !loaded.length ? (
          <div className="px-6 lg:px-14 max-w-screen-xl mx-auto"><CardSkeletonRow count={6} /></div>
        ) : loaded.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">📖</div>
            <h3 className="text-xl font-semibold text-ink mb-2">Pick a genre to start browsing</h3>
            <p className="text-ink-muted text-sm mb-6">Tap any category above — books load on demand.</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUBJECTS.slice(0, 4).map(s => (
                <button key={s} onClick={() => handleChipClick(s)}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                  style={{ background: '#8B5E3C', color: '#fff', border: 'none', cursor: 'pointer' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          Object.entries(sections).map(([cat, items]) => (
            <div key={cat}>
              <div className="max-w-screen-xl mx-auto px-6 lg:px-14 mb-5">
                <h2 className="font-display font-semibold text-ink"
                  style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', letterSpacing: '-0.025em' }}>
                  📚 {cat}
                </h2>
              </div>
              <div className="pl-6 lg:pl-14">
                <Swiper modules={[Navigation, FreeMode]} freeMode slidesPerView="auto" spaceBetween={18} grabCursor className="!overflow-visible">
                  {items.map((item, i) => (
                    <SwiperSlide key={`${item.id}-${i}`} style={{ width: '190px' }}>
                      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}>
                        <RichCard item={item} type="book" accentColor="#8B5E3C" onClick={() => handleClick(item)} />
                      </motion.div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          ))
        )}
      </div>

      <DetailModal item={detail || selected} type="book" isOpen={!!selected} onClose={() => { setSelected(null); setDetail(null) }} />
    </div>
  )
}
