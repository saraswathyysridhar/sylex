import { useState, useRef, useCallback } from 'react'
import { Heart, Star } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const GENRE_LABELS = {
  28:'Action', 12:'Adventure', 16:'Animation', 35:'Comedy', 80:'Crime',
  99:'Documentary', 18:'Drama', 10751:'Family', 14:'Fantasy', 36:'History',
  27:'Horror', 10402:'Music', 9648:'Mystery', 10749:'Romance', 878:'Sci-Fi',
  53:'Thriller', 37:'Western', 10752:'War', 10770:'TV Movie',
}

const resolveGenre = (g) => typeof g === 'number' ? (GENRE_LABELS[g] ?? null) : (g || null)

export default function RichCard({ item, type, onClick, accentColor = '#4D7A52' }) {
  const { user, toggleFavorite, isFavorite, trackClick } = useAuth()
  const [imgErr, setImgErr] = useState(false)
  const [hov, setHov]       = useState(false)
  const cardRef             = useRef(null)
  const favorited           = isFavorite(item.id, type)

  const handleCardClick = () => {
    trackClick(type, item.id, {
      title:  item.title  || item.name  || '',
      poster: item.poster || item.image || '',
      image:  item.image  || item.poster || '',
      genres: item.genres || item.tags  || [],
      rating: item.rating || null,
    })
    onClick?.()
  }

  const handleFav = (e) => {
    e.stopPropagation()
    if (user) toggleFavorite(item, type)
  }

  const handleMouseMove = useCallback((e) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width  - 0.5
    const y = (e.clientY - r.top)  / r.height - 0.5
    el.style.transform = `perspective(750px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg) translateY(-12px) scale(1.04)`
  }, [])

  const handleLeave = useCallback(() => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(750px) rotateY(0) rotateX(0) translateY(0) scale(1)'
    setHov(false)
  }, [])

  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title || item.name || '')}&background=2A2420&color=C8A882&size=600&bold=true&length=2`
  const src = imgErr ? fallback : (item.poster || item.image || item.thumbnail || item.cover || fallback)
  const meta = [item.year, item.runtime, item.author, item.cuisine].filter(Boolean)

  return (
    <div ref={cardRef} onClick={handleCardClick}
      onMouseEnter={() => setHov(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      className="cursor-pointer select-none"
      style={{
        borderRadius: '14px',
        overflow: 'hidden',
        background: '#fff',
        boxShadow: hov
          ? `0 32px 64px rgba(14,10,6,0.22), 0 0 0 1.5px ${accentColor}35, 0 8px 24px ${accentColor}22`
          : '0 4px 20px rgba(14,10,6,0.1)',
        transition: 'box-shadow 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.18s ease',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}>

      {/* ── FULL-BLEED POSTER IMAGE ────────────────────────── */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '2/3' }}>
        <img src={src} alt={item.title || item.name}
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover"
          style={{ transform: hov ? 'scale(1.1)' : 'scale(1.01)', transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)' }} />

        {/* Subtle top vignette */}
        <div className="absolute inset-x-0 top-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)' }} />

        {/* Rich bottom gradient — always visible, carries the title */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{ height: '72%', background: `linear-gradient(to top, rgba(4,3,2,0.97) 0%, rgba(4,3,2,0.82) 30%, rgba(4,3,2,0.35) 60%, transparent 100%)` }} />

        {/* Accent color bloom at bottom on hover */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none transition-opacity duration-500"
          style={{ opacity: hov ? 1 : 0, background: `radial-gradient(ellipse at 50% 100%, ${accentColor}40 0%, transparent 70%)` }} />

        {/* Rating badge */}
        {item.rating && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1.5 rounded-full"
            style={{ background: 'rgba(0,0,0,0.62)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.16)' }}>
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span className="text-white font-bold" style={{ fontSize: '10.5px', letterSpacing: '0.02em' }}>
              {typeof item.rating === 'number' ? item.rating.toFixed(1) : item.rating}
            </span>
          </div>
        )}

        {/* Trending badge */}
        {item.trending && (
          <div className="absolute top-3 right-3 px-2.5 py-1.5 rounded-full text-white font-bold"
            style={{ fontSize: '9.5px', letterSpacing: '0.05em', background: 'linear-gradient(135deg, #dc2626, #ea580c)', boxShadow: '0 3px 12px rgba(220,38,38,0.5)' }}>
            🔥 HOT
          </div>
        )}

        {/* Fav button — shown on hover or when active */}
        <button onClick={handleFav}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            opacity: favorited ? 1 : hov ? 1 : 0,
            background: favorited ? '#ef4444' : 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.18)',
            transform: hov ? 'scale(1)' : 'scale(0.85)',
          }}>
          <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-white text-white' : 'text-white'}`} />
        </button>

        {/* Title & meta overlaid on the gradient — always visible */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white leading-tight mb-2 line-clamp-2"
            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '22px', fontWeight: 600, letterSpacing: '-0.015em', textShadow: '0 1px 16px rgba(0,0,0,0.7)' }}>
            {item.title || item.name}
          </h3>

          {meta.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap" style={{ color: 'rgba(255,240,220,0.62)', fontSize: '12px', fontWeight: 500 }}>
              {meta.map((m, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>}
                  <span className="truncate max-w-[120px]">{m}</span>
                </span>
              ))}
            </div>
          )}

          {/* View button — slides up on hover */}
          <div className="overflow-hidden transition-all duration-300"
            style={{ maxHeight: hov ? '48px' : '0', opacity: hov ? 1 : 0 }}>
            <button className="mt-3 w-full py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-all duration-200"
              style={{ background: `${accentColor}CC`, backdropFilter: 'blur(12px)', border: `1px solid ${accentColor}60` }}
              onMouseEnter={e => e.currentTarget.style.background = accentColor}
              onMouseLeave={e => e.currentTarget.style.background = `${accentColor}CC`}>
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* ── GENRE STRIP ──────────────────────────────────────── */}
      {(item.genres?.length > 0 || item.tags?.length > 0) && (
        <div className="px-3.5 py-2.5 flex gap-1.5 flex-wrap items-center"
          style={{ background: '#FAFAF8', borderTop: `1.5px solid ${accentColor}16` }}>
          {(item.genres || item.tags || [])
            .map(resolveGenre)
            .filter(Boolean)
            .slice(0, 3)
            .map((label, i) => (
              <span key={`${label}-${i}`} className="text-[11.5px] font-semibold px-3 py-1 rounded-full"
                style={{ background: `${accentColor}12`, color: accentColor, border: `1px solid ${accentColor}22`, letterSpacing: '0.02em' }}>
                {label}
              </span>
            ))}
        </div>
      )}
    </div>
  )
}
