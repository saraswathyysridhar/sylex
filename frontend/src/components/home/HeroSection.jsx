import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import { ArrowRight, Leaf, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1800&q=90',
    eyebrow: 'Trending Tonight',
    title: 'Discover films\nfor every mood',
    sub: 'From cozy dramas to edge-of-seat thrillers',
    cta: 'Explore Movies', path: '/movies',
    accent: '#4D7A52',
  },
  {
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=90',
    eyebrow: 'Tonight\'s Table',
    title: 'Cook something\nextraordinary',
    sub: 'Recipes from every cuisine — quick or indulgent',
    cta: 'Browse Recipes', path: '/recipes',
    accent: '#B5763A',
  },
  {
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1800&q=90',
    eyebrow: 'Game On',
    title: 'Your next\ngaming obsession',
    sub: 'Top-rated games across every genre and platform',
    cta: 'Find Games', path: '/games',
    accent: '#6B52A8',
  },
  {
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1800&q=90',
    eyebrow: 'Your Reading List',
    title: 'A book for\nevery state of mind',
    sub: 'Fiction, science, philosophy — all in one place',
    cta: 'Browse Books', path: '/books',
    accent: '#A85E3A',
  },
]

const MOODS = ['Rainy evening', 'Date night', 'Feeling bored', 'Family dinner', 'Weekend chill', 'Need focus']

export default function HeroSection() {
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const navigate = useNavigate()

  const active = SLIDES[activeIdx]

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/movies?q=${encodeURIComponent(query)}`)
  }

  return (
    <section className="relative h-screen min-h-[680px] max-h-[900px] overflow-hidden">

      {/* Background Swiper */}
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        speed={1400}
        pagination={{ clickable: true, el: '.hero-pagination' }}
        onSlideChange={s => setActiveIdx(s.realIndex % SLIDES.length)}
        className="absolute inset-0 w-full h-full hero-swiper"
      >
        {SLIDES.map((slide, i) => (
          <SwiperSlide key={i}>
            <img src={slide.image} alt="" className="w-full h-full object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 w-full pt-20">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="w-4 h-4 text-white/70" />
              <span className="text-sm font-semibold tracking-widest text-white/70 uppercase">
                {active.eyebrow}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-semibold text-white mb-5"
              style={{ fontSize: 'clamp(3.8rem, 8vw, 7.5rem)', lineHeight: '0.96', letterSpacing: '-0.025em', textShadow: '0 2px 40px rgba(0,0,0,0.35)' }}>
              {active.title.split('\n').map((line, i) => (
                <span key={i}>{line}{i < active.title.split('\n').length - 1 && <br />}</span>
              ))}
            </h1>

            <p className="text-[1.1rem] text-white/65 mb-8 leading-relaxed">{active.sub}</p>

            {/* Search bar */}
            <form onSubmit={handleSearch}
              className="flex items-center gap-2 p-1.5 pl-5 rounded-full mb-8 max-w-lg"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
              <Search className="w-4 h-4 text-white/60 shrink-0" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Rainy evening, date night, feeling bored..."
                className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm"
              />
              <button type="submit"
                className="shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                style={{ background: '#fff', color: '#1C1A18' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#4D7A52'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1C1A18' }}
              >
                Explore
              </button>
            </form>

            {/* Mood chips */}
            <div className="flex flex-wrap gap-2">
              {MOODS.map(m => (
                <button key={m}
                  className="px-4 py-2 rounded-full text-sm text-white/70 hover:text-white transition-all"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }}
                  onClick={() => navigate('/collections')}
                >
                  {m}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="hero-pagination absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-1.5" />

      {/* Slide counter */}
      <div className="absolute bottom-8 right-10 z-30 hidden sm:flex items-center gap-2">
        <span className="text-white/90 text-sm font-semibold">{String(activeIdx + 1).padStart(2, '0')}</span>
        <div className="w-12 h-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }}>
          <div className="h-full rounded-full bg-white transition-all duration-[5000ms] ease-linear"
            style={{ width: '100%' }} />
        </div>
        <span className="text-white/40 text-sm">{String(SLIDES.length).padStart(2, '0')}</span>
      </div>
    </section>
  )
}
