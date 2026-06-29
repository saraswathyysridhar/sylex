import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { useAuth } from '../../context/AuthContext'

const SERIF = '"Bodoni Moda", "Cormorant Garamond", Georgia, serif'

export default function TrendingFromUsers({ type, accentColor = '#C49A6C', onItemClick }) {
  const { getTopClicked } = useAuth()
  const items = getTopClicked(type, 12)

  if (items.length < 3) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-screen-xl mx-auto px-6 lg:px-14"
      style={{ marginBottom: 8 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${accentColor}18`, border: `1.5px solid ${accentColor}30`,
        }}>
          <Flame size={15} style={{ color: accentColor }} />
        </div>
        <div>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: accentColor, fontFamily: '"Inter", sans-serif', lineHeight: 1 }}>
            Community Picks
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', color: '#1C1A18', fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            Trending from <em style={{ color: accentColor, fontStyle: 'italic' }}>Our Users</em>
          </div>
        </div>
      </div>

      {/* Swiper row */}
      <Swiper modules={[FreeMode]} freeMode slidesPerView="auto" spaceBetween={14} grabCursor style={{ overflow: 'visible' }}>
        {items.map((item, i) => (
          <SwiperSlide key={`${item.type}_${item.id}`} style={{ width: 148 }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              onClick={() => onItemClick?.(item)}
              style={{ cursor: 'pointer', borderRadius: 12, overflow: 'hidden', position: 'relative', aspectRatio: '2/3', background: '#E8E2D8' }}
              whileHover={{ scale: 1.04, y: -4 }}
            >
              {(item.poster || item.image) ? (
                <img
                  src={item.poster || item.image}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${accentColor}15` }}>
                  <span style={{ fontFamily: SERIF, fontSize: 28, color: accentColor, opacity: 0.6 }}>?</span>
                </div>
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,3,2,0.95) 0%, rgba(4,3,2,0.2) 55%, transparent 100%)' }} />

              {/* Rank badge */}
              <div style={{
                position: 'absolute', top: 8, left: 8,
                width: 22, height: 22, borderRadius: 6,
                background: i < 3 ? accentColor : 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 800, color: i < 3 ? '#1A0E08' : 'rgba(255,255,255,0.8)',
                fontFamily: '"Inter", sans-serif',
              }}>
                {i + 1}
              </div>

              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 10px 11px' }}>
                <p style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 13, fontWeight: 600,
                  color: '#fff', lineHeight: 1.25, marginBottom: 4,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {item.title}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Flame size={9} style={{ color: accentColor }} />
                  <span style={{ fontSize: 9.5, color: accentColor, fontFamily: '"Inter", sans-serif', fontWeight: 700 }}>
                    {item.count} {item.count === 1 ? 'view' : 'views'}
                  </span>
                </div>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  )
}
