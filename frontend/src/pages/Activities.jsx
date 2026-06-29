import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Heart, Clock, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import DetailModal from '../components/ui/DetailModal'
import PageHero from '../components/ui/PageHero'
import PersonalizePanel from '../components/ui/PersonalizePanel'
import AmbientBg from '../components/ui/AmbientBg'
import ContentTicker from '../components/ui/ContentTicker'
import activitiesData from '../data/activities.json'

const ACT_ACCENT = '#4D7A52'

const ACTIVITY_FIELDS = [
  { id: 'energy', label: 'Energy level', options: [
    { label: 'Low — I need rest', value: 'low' },
    { label: 'Medium',            value: 'medium' },
    { label: 'High — let\'s go',  value: 'high' },
  ]},
  { id: 'setting', label: 'Where?', options: [
    { label: 'Indoor',   value: 'indoor' },
    { label: 'Outdoor',  value: 'outdoor' },
  ]},
  { id: 'social', label: 'With who?', options: [
    { label: 'Solo',  value: 'solo' },
    { label: 'Group', value: 'group' },
  ]},
  { id: 'mood', label: 'Current mood', options: [
    { label: 'Relaxed',   value: 'relaxed' },
    { label: 'Creative',  value: 'creative' },
    { label: 'Active',    value: 'active' },
    { label: 'Mindful',   value: 'mindful' },
    { label: 'Social',    value: 'social' },
  ]},
]

function filterActivities(activities, sel) {
  let result = activities
  const allTags = (a) => [...(a.tags || []), ...(a.genres || []), a.mood || ''].map(t => t.toLowerCase())
  const energies = sel.energy || []
  if (energies.length) result = result.filter(a => energies.some(e => allTags(a).some(t => t.includes(e) || (e === 'high' && (t.includes('active') || t.includes('intense') || t.includes('workout'))))))
  const settings = sel.setting || []
  if (settings.length) result = result.filter(a => settings.some(s => allTags(a).some(t => t.includes(s))))
  const socials = sel.social || []
  if (socials.length) result = result.filter(a => socials.some(s => allTags(a).some(t => t.includes(s))))
  const moods = sel.mood || []
  if (moods.length) result = result.filter(a => moods.some(m => allTags(a).some(t => t.includes(m))))
  return result
}

const BG_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2000&q=90',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=2000&q=90',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=2000&q=90',
  'https://images.unsplash.com/photo-1452626212852-811d58933cae?w=2000&q=90',
]
const FLOATING = [
  { image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&q=80', title: 'Morning Surf', sub: 'Outdoor' },
  { image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400&q=80', title: 'Yoga Flow', sub: 'Wellness' },
  { image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80', title: 'Art Studio', sub: 'Creative' },
]
const FILTERS = ['All', 'Indoor', 'Outdoor', 'Solo', 'Social', 'Creative', 'Wellness', 'Active']

export default function Activities() {
  const { user, toggleFavorite, isFavorite } = useAuth()
  const [active, setActive]   = useState('All')
  const [selected, setSelected] = useState(null)
  const [forYou, setForYou]   = useState(null)

  const list = forYou ?? (active === 'All'
    ? activitiesData
    : activitiesData.filter(a =>
        a.genres?.some(g => g.toLowerCase().includes(active.toLowerCase())) ||
        a.tags?.some(t => t.toLowerCase().includes(active.toLowerCase()))
      ))

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(150deg, #FDFCF9 0%, #F7F4EC 28%, #F1ECE0 58%, #E9E4D5 88%, #E1DAC7 100%)', position: 'relative', overflow: 'hidden' }}>
      <AmbientBg color1="#2A5E20" color2="#1A4010" color3="#4D7A52" />
      <PageHero
        images={BG_IMAGES}
        eyebrow="Do Something"
        title={<>Do<br /><em style={{ fontStyle: 'italic', color: '#90C878' }}>Something</em><br />New</>}
        subtitle="Solo adventures, group fun, indoors and out — inspiration for every hour and energy level."
        headlineFont='"Raleway", "Josefin Sans", sans-serif'
        accentColor="#4D7A52"
        overlayLeft="rgba(8,16,6,0.96)"
        ambientColor="rgba(77,122,82,0.22)"
        floatingCards={FLOATING}
        stats={[{value:'100+',label:'Activities'},{value:'8',label:'Categories'},{value:'All',label:'Levels'},{value:'Free',label:'Access'}]}
        bottomFade="#F7F3EE"
      >
        <div className="flex flex-wrap gap-2.5">
          {FILTERS.map(f => (
            <motion.button key={f} whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}
              onClick={() => setActive(f)}
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
              style={{
                background: active === f ? '#4D7A52' : '#fff',
                color:      active === f ? '#fff' : '#3A3630',
                border: '1.5px solid',
                borderColor: active === f ? '#4D7A52' : '#D4CCBC',
                boxShadow:   active === f ? '0 6px 20px #4D7A5240' : '0 1px 4px rgba(28,26,24,0.06)',
              }}>
              {f}
            </motion.button>
          ))}
        </div>
      </PageHero>

      <ContentTicker variant="diagonal"
        items={[
          ...FLOATING.map(f => ({ image: f.image, title: f.title, label: f.sub })),
          { image: BG_IMAGES[0], label: 'Outdoor' }, { image: BG_IMAGES[1], label: 'Active' },
          { image: BG_IMAGES[2], label: 'Wellness' }, { image: BG_IMAGES[3], label: 'Explore' },
        ]}
        bg="#F7F3EE" accentColor={ACT_ACCENT}
      />

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-12 space-y-8">
        <PersonalizePanel
          question="What do you feel like doing right now?"
          fields={ACTIVITY_FIELDS}
          accentColor={ACT_ACCENT}
          onFilter={(sel) => {
            const empty = !Object.values(sel).some(a => a.length > 0)
            if (empty) { setForYou(null); return }
            setForYou(filterActivities(activitiesData, sel))
          }}
          resultCount={forYou?.length ?? null}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {list.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.05 }}>
              <ActivityCard activity={a} fav={isFavorite(a.id, 'activity')}
                onFav={() => user && toggleFavorite(a, 'activity')}
                onClick={() => setSelected(a)} />
            </motion.div>
          ))}
        </div>
      </div>
      <DetailModal item={selected} type="activity" isOpen={!!selected} onClose={() => setSelected(null)} />
    </div>
  )
}

function ActivityCard({ activity, fav, onFav, onClick }) {
  const [hov, setHov] = useState(false)
  const cardRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width  - 0.5
    const y = (e.clientY - r.top)  / r.height - 0.5
    el.style.transform = `perspective(750px) rotateY(${x * 12}deg) rotateX(${-y * 7}deg) translateY(-10px) scale(1.03)`
  }, [])
  const handleLeave = useCallback(() => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(750px) rotateY(0) rotateX(0) translateY(0) scale(1)'
    setHov(false)
  }, [])

  return (
    <div ref={cardRef} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseMove={handleMouseMove} onMouseLeave={handleLeave}
      className="cursor-pointer select-none"
      style={{
        borderRadius: '14px', overflow: 'hidden', background: '#fff',
        boxShadow: hov ? '0 32px 64px rgba(14,10,6,0.2), 0 8px 24px rgba(77,122,82,0.18)' : '0 4px 20px rgba(14,10,6,0.09)',
        transition: 'box-shadow 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.18s ease',
        transformStyle: 'preserve-3d', willChange: 'transform',
      }}>

      {/* Landscape image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
        <img src={activity.image} alt={activity.title}
          className="w-full h-full object-cover"
          style={{ transform: hov ? 'scale(1.1)' : 'scale(1.01)', transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)' }} />

        {/* Top vignette */}
        <div className="absolute inset-x-0 top-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)' }} />

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{ height: '70%', background: 'linear-gradient(to top, rgba(4,3,2,0.95) 0%, rgba(4,3,2,0.7) 35%, rgba(4,3,2,0.1) 70%, transparent 100%)' }} />

        {/* Green bloom on hover */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none transition-opacity duration-500"
          style={{ opacity: hov ? 1 : 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(77,122,82,0.5) 0%, transparent 70%)' }} />

        {/* Mood badge */}
        {activity.mood && (
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full font-semibold"
            style={{ fontSize: '9.5px', letterSpacing: '0.07em', background: 'rgba(77,122,82,0.88)', color: '#fff', backdropFilter: 'blur(10px)', boxShadow: '0 2px 12px rgba(77,122,82,0.4)' }}>
            {activity.mood?.toUpperCase()}
          </div>
        )}

        {/* Duration pill */}
        {activity.duration && (
          <div className="absolute top-3 right-12 flex items-center gap-1 px-2.5 py-1.5 rounded-full"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.14)' }}>
            <Clock className="w-2.5 h-2.5 text-white/70" />
            <span className="text-white font-semibold" style={{ fontSize: '10px' }}>{activity.duration}</span>
          </div>
        )}

        {/* Fav */}
        <button onClick={e => { e.stopPropagation(); onFav() }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
          style={{ opacity: fav ? 1 : hov ? 1 : 0, background: fav ? '#ef4444' : 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.18)' }}>
          <Heart className={`w-3.5 h-3.5 ${fav ? 'fill-white text-white' : 'text-white'}`} />
        </button>

        {/* Title overlaid */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white leading-tight line-clamp-1 mb-1"
            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '20px', fontWeight: 600, letterSpacing: '-0.01em' }}>
            {activity.title}
          </h3>
          <p className="line-clamp-1" style={{ color: 'rgba(255,240,220,0.5)', fontSize: '11px' }}>
            {activity.description}
          </p>
        </div>
      </div>

      {/* Tag strip */}
      {activity.tags?.length > 0 && (
        <div className="px-4 py-2.5 flex gap-1.5 flex-wrap items-center"
          style={{ background: '#FAFAF8', borderTop: '1.5px solid rgba(77,122,82,0.1)' }}>
          <Zap className="w-3 h-3 mr-0.5 shrink-0" style={{ color: 'rgba(77,122,82,0.45)' }} />
          {activity.tags.slice(0, 3).map(t => (
            <span key={t} className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(77,122,82,0.1)', color: '#4D7A52', border: '1px solid rgba(77,122,82,0.18)' }}>
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
