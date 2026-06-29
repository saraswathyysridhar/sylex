import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'

// ── Weather code → group ──────────────────────────────────────────────────────
function codeToGroup(c) {
  if (c === 0) return 'sunny'
  if (c <= 3)  return 'cloudy'
  if (c <= 48) return 'foggy'
  if ((c >= 51 && c <= 67) || (c >= 80 && c <= 82)) return 'rainy'
  if ((c >= 71 && c <= 77) || c >= 85) return 'snowy'
  if (c >= 95) return 'stormy'
  return 'cloudy'
}

function timeGroup() {
  const h = new Date().getHours()
  if (h >= 5  && h < 10) return 'morning'
  if (h >= 10 && h < 14) return 'midday'
  if (h >= 14 && h < 18) return 'afternoon'
  if (h >= 18 && h < 22) return 'evening'
  return 'night'
}

function dayLabel() {
  const d = new Date().getDay()
  const h = new Date().getHours()
  if (d === 5 && h >= 17) return 'friday'
  if (d === 6)            return 'saturday'
  if (d === 0 && h < 13) return 'sundayam'
  if (d === 0 && h >= 13) return 'sundaypm'
  return null
}

// ── Context definitions ───────────────────────────────────────────────────────
const CTX = {
  friday: {
    icon: '🎊', accent: '#C49A6C',
    headline: () => "It's Friday evening. The weekend starts now.",
    sub: "You've earned this — make it count.",
    picks: [
      { emoji: '🎬', text: 'Knives Out or Game Night' },
      { emoji: '🍕', text: 'Homemade Pizza Night' },
      { emoji: '🥂', text: 'Aperol Spritz' },
      { emoji: '🎵', text: 'Party Hits → Dance EDM' },
    ],
    link: '/drinks',
  },
  saturday: {
    icon: '☀️', accent: '#C4703A',
    headline: () => "Saturday. The whole day is yours.",
    sub: "Don't waste a second of it.",
    picks: [
      { emoji: '🌿', text: 'Start with a hike or walk' },
      { emoji: '🍳', text: 'Full breakfast at home' },
      { emoji: '🎮', text: "Best game of the week" },
      { emoji: '🥂', text: 'Weekend cocktail tonight' },
    ],
    link: '/activities',
  },
  sundayam: {
    icon: '🌿', accent: '#4D7A52',
    headline: () => "Slow Sunday morning.",
    sub: "Nowhere to be. Take your time.",
    picks: [
      { emoji: '☕', text: 'Dalgona Coffee' },
      { emoji: '🍳', text: 'Eggs Benedict or French Toast' },
      { emoji: '🎵', text: 'Sunday Morning Acoustic' },
      { emoji: '📚', text: 'A chapter with breakfast' },
    ],
    link: '/recipes',
  },
  sundaypm: {
    icon: '🌆', accent: '#8B5E3C',
    headline: () => "Sunday evening — the week starts tomorrow.",
    sub: "End the weekend on a high note.",
    picks: [
      { emoji: '🎬', text: 'Something warm and comforting' },
      { emoji: '🍲', text: 'Meal prep for the week' },
      { emoji: '🫖', text: 'Chamomile or Masala Chai' },
      { emoji: '📚', text: 'The Midnight Library' },
    ],
    link: '/planner',
  },
  stormy_any: {
    icon: '⛈️', accent: '#5A9FBF',
    headline: (t) => `Thunderstorm outside${t ? ` · ${t}°C` : ''}.`,
    sub: "Nowhere better to be than right here.",
    picks: [
      { emoji: '🎬', text: 'Interstellar (2014)' },
      { emoji: '🍜', text: 'Ramen from Scratch' },
      { emoji: '🫖', text: 'Masala Chai' },
      { emoji: '📚', text: 'Dune – Frank Herbert' },
    ],
    link: '/movies',
  },
  snowy_any: {
    icon: '❄️', accent: '#5A9FBF',
    headline: (t) => `Snowing outside${t ? ` · ${t}°C` : ''}.`,
    sub: "The best kind of excuse to stay in.",
    picks: [
      { emoji: '🎬', text: 'The Princess Bride' },
      { emoji: '🍲', text: 'Tomato Soup + Grilled Cheese' },
      { emoji: '🫖', text: 'Hot Chocolate' },
      { emoji: '🎵', text: 'Acoustic Indie' },
    ],
    link: '/recipes',
  },
  foggy_any: {
    icon: '🌫️', accent: '#8B5E3C',
    headline: (t) => `Foggy outside${t ? ` · ${t}°C` : ''}.`,
    sub: "Mysterious weather calls for mysterious picks.",
    picks: [
      { emoji: '🎬', text: 'Blade Runner 2049' },
      { emoji: '☕', text: 'Espresso or Cortado' },
      { emoji: '🎵', text: 'Dark Ambient' },
      { emoji: '📚', text: 'Gone Girl – Gillian Flynn' },
    ],
    link: '/movies',
  },
  rainy_morning: {
    icon: '🌧️', accent: '#5A9FBF',
    headline: (t) => `Rainy morning${t ? ` · ${t}°C` : ''} — slow start is perfect.`,
    sub: "Let the rain set the pace.",
    picks: [
      { emoji: '☕', text: 'Pour Over Coffee' },
      { emoji: '🍳', text: 'Eggs Benedict' },
      { emoji: '🎵', text: 'Rainy Day Jazz' },
      { emoji: '📚', text: 'A good book with breakfast' },
    ],
    link: '/recipes',
  },
  rainy_midday: {
    icon: '🌦️', accent: '#5A9FBF',
    headline: (t) => `Grey skies midday${t ? ` · ${t}°C` : ''}.`,
    sub: "A creative afternoon indoors.",
    picks: [
      { emoji: '☕', text: 'Espresso Tonic' },
      { emoji: '🎨', text: 'Photography project indoors' },
      { emoji: '🎵', text: 'Ambient Focus' },
      { emoji: '📚', text: 'Big Magic – Elizabeth Gilbert' },
    ],
    link: '/activities',
  },
  rainy_afternoon: {
    icon: '🌦️', accent: '#5A9FBF',
    headline: (t) => `Rainy afternoon${t ? ` · ${t}°C` : ''}.`,
    sub: "Perfect for depth and quiet.",
    picks: [
      { emoji: '🎬', text: 'Arrival (2016)' },
      { emoji: '☕', text: 'Cold Brew or Pour Over' },
      { emoji: '🎵', text: 'Classical Study' },
      { emoji: '📚', text: 'Atomic Habits' },
    ],
    link: '/books',
  },
  rainy_evening: {
    icon: '🌧️', accent: '#5A9FBF',
    headline: (t) => `Rainy evening${t ? ` · ${t}°C outside` : ''} — Sylex says stay in.`,
    sub: "The perfect excuse for a cozy night.",
    picks: [
      { emoji: '🎬', text: 'Amélie (2001)' },
      { emoji: '🍜', text: 'Ramen from Scratch' },
      { emoji: '🍵', text: 'Chamomile Honey Tea' },
      { emoji: '🎵', text: 'Lo-fi Chill Beats' },
    ],
    link: '/planner',
  },
  rainy_night: {
    icon: '🌧️', accent: '#5A9FBF',
    headline: (t) => `Rainy night${t ? ` · ${t}°C` : ''}.`,
    sub: "Best night to disappear into something.",
    picks: [
      { emoji: '🎬', text: 'Her (2013)' },
      { emoji: '🫖', text: 'Golden Milk' },
      { emoji: '🎵', text: 'Late Night Jazz' },
      { emoji: '📚', text: 'The Midnight Library' },
    ],
    link: '/movies',
  },
  sunny_morning: {
    icon: '☀️', accent: '#C4703A',
    headline: (t) => `Clear skies${t ? ` · ${t}°C` : ''} — a fresh morning.`,
    sub: "Start it right.",
    picks: [
      { emoji: '🍳', text: 'Shakshuka or Avocado Toast' },
      { emoji: '☕', text: 'Pour Over Coffee' },
      { emoji: '🎵', text: 'Morning Acoustic Playlist' },
      { emoji: '🌿', text: 'Sunrise walk outside' },
    ],
    link: '/activities',
  },
  sunny_midday: {
    icon: '🌞', accent: '#C4703A',
    headline: (t) => `Sunny midday${t ? ` · ${t}°C` : ''}.`,
    sub: "Get outside — even for 20 minutes.",
    picks: [
      { emoji: '🥗', text: 'Quick Buddha Bowl or Wrap' },
      { emoji: '🥤', text: 'Mango Smoothie' },
      { emoji: '🎵', text: 'Uplifting Indie' },
      { emoji: '🌿', text: 'Walk in the sun' },
    ],
    link: '/activities',
  },
  sunny_afternoon: {
    icon: '🌤️', accent: '#C4703A',
    headline: (t) => `Beautiful afternoon${t ? ` · ${t}°C` : ''}.`,
    sub: "Get out there — the evening will sort itself.",
    picks: [
      { emoji: '🚴', text: 'Cycling trail ride' },
      { emoji: '🥤', text: 'Iced Matcha or Cold Brew' },
      { emoji: '🎵', text: 'Feel-Good Indie' },
      { emoji: '🧺', text: 'Picnic in the park' },
    ],
    link: '/activities',
  },
  sunny_evening: {
    icon: '🌅', accent: '#D4956A',
    headline: (t) => `Beautiful evening${t ? ` · ${t}°C` : ''}.`,
    sub: "Golden hour deserves something special.",
    picks: [
      { emoji: '🥂', text: 'Aperol Spritz' },
      { emoji: '🍝', text: 'Pasta Carbonara' },
      { emoji: '🎵', text: 'Jazz Café' },
      { emoji: '✨', text: 'Outdoor dinner' },
    ],
    link: '/drinks',
  },
  cloudy_morning: {
    icon: '🌤️', accent: '#4D7A52',
    headline: (t) => `Overcast morning${t ? ` · ${t}°C` : ''}.`,
    sub: "A focused, intentional start.",
    picks: [
      { emoji: '☕', text: 'Matcha Latte' },
      { emoji: '🍳', text: 'Avocado Toast + Eggs' },
      { emoji: '🎵', text: 'Lo-fi Focus' },
      { emoji: '📚', text: 'Atomic Habits' },
    ],
    link: '/books',
  },
  cloudy_evening: {
    icon: '☁️', accent: '#4D7A52',
    headline: (t) => `Grey evening${t ? ` · ${t}°C` : ''}.`,
    sub: "Low-key and intentional.",
    picks: [
      { emoji: '🎬', text: 'Whiplash (2014)' },
      { emoji: '🍽️', text: 'Shakshuka' },
      { emoji: '🥂', text: 'Espresso Martini' },
      { emoji: '🎵', text: 'Neo-Soul Vibes' },
    ],
    link: '/planner',
  },
  morning_default: {
    icon: '🌅', accent: '#C4703A',
    headline: () => "Good morning. Let's make it count.",
    sub: "A few picks to set the right tone.",
    picks: [
      { emoji: '☕', text: 'Pour Over Coffee or Matcha' },
      { emoji: '🍳', text: 'Shakshuka or Avocado Toast' },
      { emoji: '🎵', text: 'Morning Acoustic Playlist' },
      { emoji: '🌿', text: 'Short walk outside' },
    ],
    link: '/activities',
  },
  midday_default: {
    icon: '🌞', accent: '#C49A6C',
    headline: () => "Midday. Recharge well.",
    sub: "A good lunch sets up the whole afternoon.",
    picks: [
      { emoji: '🥗', text: 'Buddha Bowl or Bibimbap' },
      { emoji: '☕', text: 'Espresso or Cold Brew' },
      { emoji: '🎵', text: 'Uplifting Pop' },
      { emoji: '🌿', text: '15-minute walk' },
    ],
    link: '/recipes',
  },
  afternoon_default: {
    icon: '🌤️', accent: '#4D7A52',
    headline: () => "Afternoon. Pick something intentional.",
    sub: "Don't let the slump win.",
    picks: [
      { emoji: '☕', text: 'Cold Brew' },
      { emoji: '🎵', text: 'Ambient Focus' },
      { emoji: '📚', text: 'A chapter of anything' },
      { emoji: '🎨', text: 'Creative project' },
    ],
    link: '/activities',
  },
  evening_default: {
    icon: '🌆', accent: '#D4956A',
    headline: () => "Evening. Your night starts now.",
    sub: "Make the most of it.",
    picks: [
      { emoji: '🎬', text: 'Something great on screen' },
      { emoji: '🍽️', text: 'A proper dinner' },
      { emoji: '🥂', text: "A drink you'll actually enjoy" },
      { emoji: '🎵', text: 'The right playlist' },
    ],
    link: '/planner',
  },
  night_default: {
    icon: '🌙', accent: '#5A9FBF',
    headline: () => "Late night. The best hours.",
    sub: "The world is quieter now — use it.",
    picks: [
      { emoji: '🎬', text: 'Her or Interstellar' },
      { emoji: '🍸', text: 'Old Fashioned or Chamomile' },
      { emoji: '🎵', text: 'Late Night Jazz' },
      { emoji: '📚', text: 'Night-reading chapter' },
    ],
    link: '/drinks',
  },
}

function resolveCtx(weather, time, day) {
  if (day)                                      return CTX[day]
  if (weather === 'stormy')                     return CTX['stormy_any']
  if (weather === 'snowy')                      return CTX['snowy_any']
  if (weather === 'foggy')                      return CTX['foggy_any']
  if (weather && CTX[`${weather}_${time}`])    return CTX[`${weather}_${time}`]
  return CTX[`${time}_default`]
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function RightNow() {
  const navigate = useNavigate()
  const [ctx, setCtx]           = useState(null)
  const [temp, setTemp]         = useState(null)
  const [locName, setLocName]   = useState(null)
  const [geoState, setGeoState] = useState('idle') // idle | loading | done | denied

  useEffect(() => {
    // Always show time-based context first (instant)
    const day  = dayLabel()
    const time = timeGroup()
    setCtx(resolveCtx(null, time, day))

    // Then try to enhance with weather (non-blocking)
    if (!navigator.geolocation) return
    setGeoState('loading')

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weather_code,temperature_2m&timezone=auto`
          )
          const data = await res.json()
          const code    = data.current.weather_code
          const tempVal = Math.round(data.current.temperature_2m)
          const weather = codeToGroup(code)

          // Try reverse-geocode (free, no key) for city name
          try {
            const geo = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            )
            const geoData = await geo.json()
            const city = geoData.address?.city || geoData.address?.town || geoData.address?.village
            if (city) setLocName(city)
          } catch { /* silent */ }

          setTemp(tempVal)
          setCtx(resolveCtx(weather, timeGroup(), dayLabel()))
          setGeoState('done')
        } catch {
          setGeoState('done')
        }
      },
      () => setGeoState('denied'),
      { timeout: 6000 }
    )
  }, [])

  if (!ctx) return null

  const headline = ctx.headline(temp)

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={ctx.icon + headline}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: '#0C0A08',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '52px 0 56px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Large radial glow */}
        <div style={{
          position: 'absolute', left: '-10%', top: '-80%', width: 700, height: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${ctx.accent}16 0%, transparent 65%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: '-5%', bottom: '-60%', width: 500, height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${ctx.accent}09 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: '1280px', margin: '0 auto', padding: '0 40px',
          position: 'relative', zIndex: 1,
        }}>

          {/* Top label row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%', background: ctx.accent,
                boxShadow: `0 0 10px ${ctx.accent}90`,
                animation: 'rightNowPulse 2s ease-in-out infinite',
              }} />
              <span style={{
                fontSize: 9.5, fontWeight: 700, letterSpacing: '0.24em',
                textTransform: 'uppercase', color: ctx.accent,
                fontFamily: '"Inter", sans-serif',
              }}>Right Now</span>
            </div>

            {temp !== null && (
              <span style={{
                padding: '3px 11px', borderRadius: 100,
                background: `${ctx.accent}18`, border: `1px solid ${ctx.accent}35`,
                fontSize: 11.5, fontWeight: 700, color: ctx.accent,
                fontFamily: '"Inter", sans-serif',
              }}>{temp}°C</span>
            )}

            {locName && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 11.5, color: 'rgba(255,240,220,0.3)',
                fontFamily: '"Inter", sans-serif',
              }}>
                <MapPin size={10} /> {locName}
              </span>
            )}

            {geoState === 'loading' && (
              <span style={{
                fontSize: 11, color: 'rgba(255,240,220,0.2)',
                fontFamily: '"Inter", sans-serif',
                animation: 'rightNowPulse 1.5s ease-in-out infinite',
              }}>· detecting location…</span>
            )}
          </div>

          {/* Main layout */}
          <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* Left: icon + headline */}
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 10 }}>
                <motion.span
                  key={ctx.icon}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  style={{ fontSize: 60, lineHeight: 1, flexShrink: 0 }}
                >
                  {ctx.icon}
                </motion.span>
                <div>
                  <h2 style={{
                    fontFamily: '"Bodoni Moda", "Cormorant Garamond", Georgia, serif',
                    fontSize: 'clamp(1.7rem, 3vw, 2.8rem)',
                    color: '#FDFAF6', lineHeight: 1.05,
                    letterSpacing: '-0.025em', fontWeight: 600, marginBottom: 8,
                  }}>
                    {headline}
                  </h2>
                  <p style={{
                    fontSize: 14, color: 'rgba(255,240,220,0.4)',
                    fontFamily: '"Inter", sans-serif', lineHeight: 1.5,
                  }}>
                    {ctx.sub}
                  </p>
                </div>
              </div>

              {/* Pick cards */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 10, marginTop: 28,
              }} className="rightnow-picks">
                {ctx.picks.map((p, i) => (
                  <motion.div
                    key={p.text}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 + i * 0.09, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      padding: '16px',
                      borderRadius: 14,
                      background: `${ctx.accent}0C`,
                      border: `1px solid ${ctx.accent}25`,
                    }}
                  >
                    <span style={{ fontSize: 22, display: 'block', marginBottom: 9 }}>{p.emoji}</span>
                    <span style={{
                      fontSize: 13, color: 'rgba(255,240,220,0.62)',
                      fontFamily: '"Inter", sans-serif', lineHeight: 1.35,
                    }}>{p.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: CTA */}
            <div style={{ paddingTop: 8, flexShrink: 0 }}>
              <button
                onClick={() => navigate(ctx.link)}
                style={{
                  padding: '14px 30px', borderRadius: 100, border: 'none',
                  background: ctx.accent, color: '#1A0E08',
                  fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
                  fontFamily: '"Inter", sans-serif', letterSpacing: '0.01em',
                  whiteSpace: 'nowrap',
                  boxShadow: `0 4px 22px ${ctx.accent}45`,
                  transition: 'transform 0.18s, box-shadow 0.18s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = `0 8px 30px ${ctx.accent}55`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = `0 4px 22px ${ctx.accent}45`
                }}
              >
                See picks →
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes rightNowPulse {
            0%,100% { opacity: 1; transform: scale(1); }
            50%      { opacity: 0.45; transform: scale(0.8); }
          }
          @media (max-width: 700px) {
            .rightnow-picks { grid-template-columns: repeat(2, 1fr) !important; }
          }
        `}</style>
      </motion.section>
    </AnimatePresence>
  )
}
