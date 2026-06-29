import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, SlidersHorizontal, X, Search } from 'lucide-react'

const SERIF = '"Bodoni Moda", "Cormorant Garamond", Georgia, serif'

const TIME_OPTIONS = [
  { label: '15 min', value: '15m', icon: '⚡', hint: 'Quick pick' },
  { label: '30 min', value: '30m', icon: '☕', hint: 'Half hour' },
  { label: '1 hour', value: '1h',  icon: '🎬', hint: 'An hour' },
  { label: '2+ hrs', value: '2h',  icon: '🌙', hint: 'Long session' },
  { label: 'All in', value: 'all', icon: '✨', hint: 'All evening' },
]

const MOOD_ZONES = [
  { label: 'Lighthearted', emoji: '☀️', max: 20 },
  { label: 'Feel-Good',    emoji: '😊', max: 40 },
  { label: 'Balanced',     emoji: '⚖️', max: 60 },
  { label: 'Gripping',     emoji: '🎯', max: 79 },
  { label: 'Dark & Intense', emoji: '🌑', max: 100 },
]

function getMoodLabel(v) {
  return MOOD_ZONES.find(z => v <= z.max) || MOOD_ZONES[2]
}

export default function PersonalizePanel({
  question = 'What are you in the mood for?',
  fields = [],
  accentColor = '#4169E1',
  onFilter,
  theme = 'light',
  resultCount = null,
  showSearch = false,
  searchLabel = 'Describe it',
  searchPlaceholder = "e.g. 'dark psychological thriller' or 'feel-good romance'",
  showMoodSlider = false,
  showTimePicker = false,
}) {
  const [sel, setSel] = useState({})
  const [applied, setApplied] = useState(false)
  const [open, setOpen] = useState(true)
  const [description, setDescription] = useState('')
  const [moodIntensity, setMoodIntensity] = useState(50)
  const [timeBudget, setTimeBudget] = useState(null)

  const toggle = (fieldId, value) => {
    setSel(prev => {
      const cur = prev[fieldId] || []
      const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]
      return { ...prev, [fieldId]: next }
    })
    setApplied(false)
  }

  const hasAny = description.trim().length > 0
    || moodIntensity !== 50
    || timeBudget !== null
    || Object.values(sel).some(a => a.length > 0)

  const apply = () => {
    setApplied(true)
    onFilter?.({ ...sel, _description: description.trim(), _moodIntensity: moodIntensity, _timeBudget: timeBudget })
  }

  const clear = () => {
    setSel({})
    setDescription('')
    setMoodIntensity(50)
    setTimeBudget(null)
    setApplied(false)
    onFilter?.({ _description: '', _moodIntensity: 50, _timeBudget: null })
  }

  const isDark = theme === 'dark'
  const glass      = isDark ? 'rgba(8,14,38,0.72)'      : 'rgba(255,255,255,0.78)'
  const borderC    = isDark ? 'rgba(65,105,225,0.14)'   : 'rgba(65,105,225,0.18)'
  const headClr    = isDark ? '#EDE8F5'                  : '#07102A'
  const lblClr     = isDark ? 'rgba(237,232,245,0.40)'  : 'rgba(7,16,42,0.38)'
  const chipBg     = isDark ? 'rgba(65,105,225,0.07)'   : 'rgba(7,16,42,0.04)'
  const chipClr    = isDark ? 'rgba(237,232,245,0.72)'  : '#1A1A2E'
  const chipBrd    = isDark ? 'rgba(65,105,225,0.15)'   : 'rgba(7,16,42,0.10)'
  const inputBg    = isDark ? 'rgba(255,255,255,0.05)'  : 'rgba(255,255,255,0.65)'

  const currentMood = getMoodLabel(moodIntensity)
  const sliderGradient = 'linear-gradient(to right, #FFC234 0%, #7DCFA0 30%, #5B9FBF 50%, #4060A0 72%, #1A0830 100%)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'relative',
        background: glass,
        backdropFilter: 'blur(48px)',
        WebkitBackdropFilter: 'blur(48px)',
        border: `1px solid ${borderC}`,
        borderRadius: 28,
        overflow: 'hidden',
        boxShadow: isDark
          ? `0 32px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(65,105,225,0.08)`
          : `0 20px 60px rgba(65,105,225,0.08), inset 0 1px 0 rgba(255,255,255,0.9)`,
      }}
    >
      {/* shimmer top edge */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
        background: `linear-gradient(90deg, transparent, ${accentColor}55, transparent)`,
        pointerEvents: 'none',
      }} />

      {/* corner glow */}
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 220, height: 220,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${accentColor}12 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* subtle grid texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(${isDark ? 'rgba(65,105,225,0.025)' : 'rgba(65,105,225,0.03)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(65,105,225,0.025)' : 'rgba(65,105,225,0.03)'} 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
        opacity: 0.6,
      }} />

      {/* Header row */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '28px 32px 0' }}>
        <div>
          <span style={{ display: 'block', fontFamily: '"Inter",sans-serif', fontSize: '9.5px', letterSpacing: '0.32em', color: accentColor, textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>
            Personalize
          </span>
          <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(1.5rem, 2.6vw, 2rem)', color: headClr, lineHeight: 1.08, fontWeight: 400, margin: 0 }}>
            {question}
          </h3>
        </div>
        <button onClick={() => setOpen(o => !o)}
          style={{
            flexShrink: 0, width: 36, height: 36, borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: open ? `${accentColor}14` : 'transparent',
            border: `1px solid ${open ? `${accentColor}28` : borderC}`,
            cursor: 'pointer', marginTop: 4, transition: 'all 0.2s ease',
          }}>
          {open
            ? <X size={14} color={accentColor} />
            : <SlidersHorizontal size={14} color={accentColor} />}
        </button>
      </div>

      {/* Body */}
      <AnimatePresence>
        {open && (
          <motion.div key="body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden', position: 'relative' }}
          >
            <div style={{ padding: '22px 32px 28px', display: 'flex', flexDirection: 'column', gap: 22 }}>

              {/* Description search input */}
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04, duration: 0.38 }}
                >
                  <p style={{ margin: '0 0 10px', fontFamily: '"Inter",sans-serif', fontSize: '9.5px', letterSpacing: '0.22em', textTransform: 'uppercase', color: lblClr, fontWeight: 700 }}>
                    {searchLabel}
                  </p>
                  <div style={{ position: 'relative' }}>
                    <Search size={15} style={{
                      position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                      color: description ? accentColor : (isDark ? 'rgba(237,232,245,0.28)' : 'rgba(7,16,42,0.28)'),
                      pointerEvents: 'none', transition: 'color 0.2s',
                    }} />
                    <input
                      type="text"
                      value={description}
                      onChange={e => { setDescription(e.target.value); setApplied(false) }}
                      onKeyDown={e => e.key === 'Enter' && apply()}
                      placeholder={searchPlaceholder}
                      style={{
                        width: '100%',
                        padding: '13px 42px 13px 44px',
                        borderRadius: 14,
                        border: `1.5px solid ${description ? `${accentColor}70` : (isDark ? 'rgba(65,105,225,0.18)' : 'rgba(7,16,42,0.12)')}`,
                        background: inputBg,
                        fontSize: '14px',
                        fontFamily: '"Inter", sans-serif',
                        color: headClr,
                        outline: 'none',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        boxSizing: 'border-box',
                        boxShadow: description ? `0 0 0 3px ${accentColor}14` : 'none',
                      }}
                    />
                    {description && (
                      <button
                        onClick={() => { setDescription(''); setApplied(false) }}
                        style={{
                          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: isDark ? 'rgba(237,232,245,0.4)' : 'rgba(7,16,42,0.3)',
                        }}>
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Mood slider */}
              {showMoodSlider && (
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08, duration: 0.38 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <p style={{ margin: 0, fontFamily: '"Inter",sans-serif', fontSize: '9.5px', letterSpacing: '0.22em', textTransform: 'uppercase', color: lblClr, fontWeight: 700 }}>
                      Mood Intensity
                    </p>
                    <motion.span
                      key={currentMood.label}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        fontSize: '12px', fontFamily: '"Inter",sans-serif', fontWeight: 600,
                        color: accentColor, display: 'flex', alignItems: 'center', gap: 5,
                        background: `${accentColor}12`, border: `1px solid ${accentColor}28`,
                        padding: '3px 10px', borderRadius: 100,
                      }}>
                      <span style={{ fontSize: 13 }}>{currentMood.emoji}</span>
                      {currentMood.label}
                    </motion.span>
                  </div>

                  <div style={{ position: 'relative', paddingBottom: 6 }}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={moodIntensity}
                      onChange={e => { setMoodIntensity(Number(e.target.value)); setApplied(false) }}
                      className="mood-slider"
                      style={{
                        background: sliderGradient,
                        '--slider-accent': accentColor,
                        '--slider-accent-glow': `${accentColor}28`,
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                      <span style={{ fontSize: '11px', fontFamily: '"Inter",sans-serif', color: lblClr, fontWeight: 500 }}>☀️ Lighthearted</span>
                      <span style={{ fontSize: '11px', fontFamily: '"Inter",sans-serif', color: lblClr, fontWeight: 500 }}>Dark & Intense 🌑</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Time duration picker */}
              {showTimePicker && (
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12, duration: 0.38 }}
                >
                  <p style={{ margin: '0 0 10px', fontFamily: '"Inter",sans-serif', fontSize: '9.5px', letterSpacing: '0.22em', textTransform: 'uppercase', color: lblClr, fontWeight: 700 }}>
                    How much time do you have?
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {TIME_OPTIONS.map((opt, oi) => {
                      const on = timeBudget === opt.value
                      return (
                        <motion.button key={opt.value}
                          initial={{ opacity: 0, scale: 0.88 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: oi * 0.05 + 0.1 }}
                          onClick={() => { setTimeBudget(on ? null : opt.value); setApplied(false) }}
                          whileHover={{ y: -2, scale: 1.04 }} whileTap={{ scale: 0.93 }}
                          title={opt.hint}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '8px 16px', borderRadius: 100,
                            fontSize: '13px', fontFamily: '"Inter",sans-serif',
                            fontWeight: on ? 600 : 400, cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            background: on ? accentColor : chipBg,
                            color: on ? '#fff' : chipClr,
                            border: `1px solid ${on ? accentColor : chipBrd}`,
                            boxShadow: on ? `0 5px 18px ${accentColor}40` : 'none',
                          }}>
                          <span style={{ fontSize: 15 }}>{opt.icon}</span>
                          <span>{opt.label}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Divider between new features and chip fields */}
              {(showSearch || showMoodSlider || showTimePicker) && fields.length > 0 && (
                <div style={{ height: 1, background: `linear-gradient(to right, ${accentColor}18, transparent)` }} />
              )}

              {/* Field rows (chip filters) */}
              {fields.map((field, fi) => (
                <motion.div key={field.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: fi * 0.07 + 0.05, duration: 0.38 }}>
                  <p style={{ margin: '0 0 10px', fontFamily: '"Inter",sans-serif', fontSize: '9.5px', letterSpacing: '0.22em', textTransform: 'uppercase', color: lblClr, fontWeight: 700 }}>
                    {field.label}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {field.options.map((opt, oi) => {
                      const on = (sel[field.id] || []).includes(opt.value)
                      return (
                        <motion.button key={opt.value}
                          initial={{ opacity: 0, scale: 0.88 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: fi * 0.04 + oi * 0.03 + 0.1 }}
                          onClick={() => toggle(field.id, opt.value)}
                          whileHover={{ y: -2 }} whileTap={{ scale: 0.94 }}
                          style={{
                            padding: '7px 17px', borderRadius: 100,
                            fontSize: '13px', fontFamily: '"Inter",sans-serif',
                            fontWeight: on ? 600 : 400, cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            background: on ? accentColor : chipBg,
                            color: on ? '#fff' : chipClr,
                            border: `1px solid ${on ? accentColor : chipBrd}`,
                            boxShadow: on ? `0 5px 18px ${accentColor}36` : 'none',
                          }}>
                          {opt.label}
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
              ))}

              {/* Divider */}
              <div style={{ height: 1, background: `linear-gradient(to right, ${accentColor}18, transparent)` }} />

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <motion.button onClick={apply}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  animate={hasAny && !applied
                    ? { boxShadow: [`0 4px 20px ${accentColor}28`, `0 8px 32px ${accentColor}50`, `0 4px 20px ${accentColor}28`] }
                    : { boxShadow: `0 4px 20px ${accentColor}20` }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 26px', borderRadius: 100,
                    background: hasAny
                      ? `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`
                      : `${accentColor}0E`,
                    color: hasAny ? '#fff' : accentColor,
                    fontSize: '13px', fontWeight: 600, fontFamily: '"Inter",sans-serif',
                    border: `1px solid ${hasAny ? accentColor : `${accentColor}28`}`,
                    cursor: 'pointer', transition: 'background 0.25s, color 0.25s, border 0.25s',
                  }}>
                  <span>
                    {applied && resultCount !== null
                      ? `${resultCount} match${resultCount !== 1 ? 'es' : ''}`
                      : 'Discover'}
                  </span>
                  <motion.span animate={applied ? { x: [0, 4, 0] } : {}} transition={{ repeat: 1, duration: 0.4 }}>
                    <ArrowRight size={13} />
                  </motion.span>
                </motion.button>

                <AnimatePresence>
                  {hasAny && (
                    <motion.button key="clear"
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                      onClick={clear}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: lblClr, fontFamily: '"Inter",sans-serif', letterSpacing: '0.02em', padding: '0 2px' }}>
                      Clear all
                    </motion.button>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {applied && resultCount !== null && (
                    <motion.span key="count"
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      style={{
                        marginLeft: 'auto', fontSize: '11px', fontFamily: '"Inter",sans-serif',
                        color: accentColor, fontWeight: 600, letterSpacing: '0.04em',
                        padding: '4px 12px', borderRadius: 100,
                        background: `${accentColor}10`, border: `1px solid ${accentColor}22`,
                      }}>
                      {resultCount} found
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
