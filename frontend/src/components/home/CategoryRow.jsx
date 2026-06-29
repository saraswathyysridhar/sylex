import { useState } from 'react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, FreeMode } from 'swiper/modules'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import RichCard from '../ui/RichCard'
import DetailModal from '../ui/DetailModal'

export default function CategoryRow({ title, emoji, subtitle, items, viewAllLink, type, id }) {
  const [selected, setSelected] = useState(null)
  const safeId = (id || title).replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
  const navPrev = `prev-${safeId}`
  const navNext = `next-${safeId}`

  if (!items?.length) return null

  return (
    <section className="py-12">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="flex items-end justify-between mb-7"
        >
          <div>
            <p className="section-label mb-1">
              {emoji && <span className="text-base">{emoji}</span>}
              {subtitle || type}
            </p>
            <h2 className="font-display font-semibold text-ink leading-tight"
              style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', letterSpacing: '-0.02em' }}>
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button className={`swiper-nav-btn ${navPrev} w-10 h-10 rounded-full flex items-center justify-center transition-all`}
              style={{ background: '#fff', border: '1px solid #D4CCBC', color: '#1C1A18', boxShadow: '0 2px 8px rgba(28,26,24,0.1)' }}>
              ←
            </button>
            <button className={`swiper-nav-btn ${navNext} w-10 h-10 rounded-full flex items-center justify-center transition-all`}
              style={{ background: '#fff', border: '1px solid #D4CCBC', color: '#1C1A18', boxShadow: '0 2px 8px rgba(28,26,24,0.1)' }}>
              →
            </button>
            {viewAllLink && (
              <Link to={viewAllLink}
                className="ml-1 flex items-center gap-1.5 text-[13.5px] font-semibold text-sage-500 hover:text-sage-600 transition-colors group">
                See all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>
        </motion.div>
      </div>

      {/* Full-width swiper */}
      <div className="pl-6 lg:pl-10 max-w-screen-xl mx-auto">
        <Swiper
          modules={[Navigation, FreeMode]}
          navigation={{ prevEl: `.${navPrev}`, nextEl: `.${navNext}` }}
          freeMode={{ enabled: true, sticky: false }}
          slidesPerView="auto"
          spaceBetween={16}
          grabCursor
          className="!overflow-visible"
        >
          {items.map((item, i) => (
            <SwiperSlide key={`${item.id ?? item.title}-${i}`} style={{ width: '230px' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.3) }}
              >
                <RichCard item={item} type={type} onClick={() => setSelected(item)} />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <DetailModal item={selected} type={type} isOpen={!!selected} onClose={() => setSelected(null)} />
    </section>
  )
}
