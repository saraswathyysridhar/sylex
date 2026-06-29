import { useState } from 'react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css/effect-fade'

export default function PageHero({
  images        = [],
  eyebrow,
  title,
  subtitle,
  accentColor   = '#4D7A52',
  overlayLeft   = 'rgba(10,10,10,0.82)',
  ambientColor  = 'rgba(77,122,82,0.22)',
  floatingCards = [],
  stats         = [],
  bottomFade    = '#F7F3EE',
  headlineFont,
  children,
}) {
  const [activeSlide, setActiveSlide] = useState(0)

  /* Strip any existing opacity from the overlayLeft so we can layer at our own values */
  const base = overlayLeft.replace(/[\d.]+\)$/, '')

  return (
    <div className="relative" style={{ minHeight: '100vh' }}>

      {/* ── BACKGROUND CAROUSEL ───────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 2600, disableOnInteraction: false }}
          loop
          speed={900}
          onSlideChange={s => setActiveSlide(s.realIndex % Math.max(images.length, 1))}
          className="w-full h-full"
          style={{ position: 'absolute', inset: 0 }}
        >
          {images.map((src, i) => (
            <SwiperSlide key={i} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              {/* kb-slide = Ken Burns zoom via CSS animation */}
              <img src={src} alt="" className={`w-full h-full object-cover kb-slide ${i % 2 === 1 ? 'kb-slide-alt' : ''}`}
                style={{ filter: 'brightness(0.95)' }} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ── OVERLAYS ── intentionally lighter so images show through */}
        {/* Left-to-right directional gradient (darkest on the left, text side) */}
        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: `linear-gradient(108deg, ${base}0.78) 0%, ${base}0.62) 38%, ${base}0.28) 65%, ${base}0.04) 100%)` }} />

        {/* Bottom-to-top gradient (keeps bottom readable for text) */}
        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(2,2,2,1) 0%, rgba(2,2,2,0.55) 26%, rgba(2,2,2,0.1) 52%, transparent 70%)' }} />

        {/* Accent ambient glow */}
        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 8% 72%, ${ambientColor} 0%, transparent 52%)` }} />

        {/* Film grain texture */}
        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{ opacity: 0.04, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px' }} />

        {/* Slide progress pills — right side */}
        <div className="absolute right-8 bottom-1/2 translate-y-1/2 z-20 flex flex-col gap-2 hidden lg:flex">
          {images.map((_, i) => (
            <div key={i} className="rounded-full transition-all duration-600"
              style={{ width: '4px', height: activeSlide === i ? '36px' : '10px', background: activeSlide === i ? '#fff' : 'rgba(255,255,255,0.22)' }} />
          ))}
        </div>
      </div>

      {/* ── CONTENT ───────────────────────────────────────────── */}
      <div className="relative z-20 max-w-screen-xl mx-auto px-6 lg:px-14 pt-52 pb-40">
        <div className="max-w-[660px]">

          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
            className="flex items-center gap-3 mb-7">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full"
              style={{ background: `${accentColor}22`, border: `1.5px solid ${accentColor}50`, backdropFilter: 'blur(14px)' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accentColor }} />
              <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: accentColor }}>{eyebrow}</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 44 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
            className="text-white"
            style={{ fontFamily: headlineFont || '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(5.5rem, 13vw, 14rem)', lineHeight: '0.90', letterSpacing: '-0.035em', fontWeight: 600, textShadow: '0 2px 80px rgba(0,0,0,0.5)' }}>
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="leading-relaxed mt-6 mb-10 max-w-[480px]"
            style={{ fontSize: '18px', color: 'rgba(255,240,220,0.48)', letterSpacing: '0.01em' }}>
            {subtitle}
          </motion.p>

          {/* ── STATS — big-number panels ────────────────────── */}
          {stats.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="flex flex-wrap gap-3">
              {stats.map(({ value, label, icon }) => (
                <div key={label}
                  style={{
                    padding: '14px 22px',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.13)',
                    backdropFilter: 'blur(18px)',
                    WebkitBackdropFilter: 'blur(18px)',
                    minWidth: '88px',
                  }}>
                  <div className="font-display text-white font-semibold leading-none"
                    style={{ fontSize: '28px', letterSpacing: '-0.02em' }}>
                    {value ?? icon}
                  </div>
                  <div className="mt-1.5 font-semibold uppercase tracking-widest"
                    style={{ fontSize: '9.5px', color: 'rgba(255,240,220,0.38)', letterSpacing: '0.12em' }}>
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* ── FLOATING CARDS ──────────────────────────────────── */}
        {floatingCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 70 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
            className="absolute right-6 lg:right-14 top-1/2 -translate-y-[50%] hidden lg:flex items-end gap-3.5">
            {floatingCards.slice(0, 3).map((card, i) => (
              <motion.div key={i}
                whileHover={{ y: -14, scale: 1.07, rotateZ: 0 }}
                initial={{ rotateZ: i === 0 ? -2.5 : i === 2 ? 2.5 : 0 }}
                animate={{ rotateZ: i === 0 ? -2.5 : i === 2 ? 2.5 : 0 }}
                transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                className="relative rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  width: i === 1 ? '164px' : '122px',
                  height: i === 1 ? '240px' : '178px',
                  marginBottom: i === 1 ? 0 : '32px',
                  boxShadow: `0 32px 80px rgba(0,0,0,0.75), 0 0 0 1.5px rgba(255,255,255,0.14)`,
                }}>
                <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.94) 0%, transparent 52%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-3.5">
                  <p className="text-white font-semibold leading-tight line-clamp-2"
                    style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '12.5px' }}>
                    {card.title}
                  </p>
                  {card.sub && <p className="text-white/38 mt-0.5" style={{ fontSize: '10px' }}>{card.sub}</p>}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* ── BOTTOM FADE ─────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-20"
        style={{ height: '160px', background: `linear-gradient(to top, ${bottomFade} 0%, ${bottomFade}CC 40%, transparent 100%)` }} />

      {/* ── FILTER ROW ──────────────────────────────────────── */}
      {children && (
        <div className="relative z-30 max-w-screen-xl mx-auto px-6 lg:px-14 pb-12 -mt-6">
          {children}
        </div>
      )}
    </div>
  )
}
