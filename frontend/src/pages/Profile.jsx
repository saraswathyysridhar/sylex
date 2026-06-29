import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Film, ChefHat, Gamepad2, BookOpen, Music, Zap, Coffee, LogOut, Lock, Award, Heart, TrendingUp, Sparkles, Camera, MessageSquareHeart, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

const SERIF = '"Bodoni Moda", "Cormorant Garamond", Georgia, serif'
const GOLD  = '#C49A6C'

const CATEGORIES = [
  { key: 'movie',    label: 'Movies',     icon: Film,     color: '#5A9FBF', bg: '#EDF5FF', path: '/movies'     },
  { key: 'recipe',   label: 'Recipes',    icon: ChefHat,  color: '#C4703A', bg: '#FFF2EA', path: '/recipes'    },
  { key: 'game',     label: 'Games',      icon: Gamepad2, color: '#CC2222', bg: '#FFEAEA', path: '/games'      },
  { key: 'book',     label: 'Books',      icon: BookOpen, color: '#8B5E3C', bg: '#FFF5EC', path: '/books'      },
  { key: 'playlist', label: 'Music',      icon: Music,    color: '#3A9B7A', bg: '#EAFBF3', path: '/music'      },
  { key: 'activity', label: 'Activities', icon: Zap,      color: '#4D7A52', bg: '#EDFBEE', path: '/activities' },
  { key: 'drink',    label: 'Drinks',     icon: Coffee,   color: '#D4956A', bg: '#FFF6E8', path: '/drinks'     },
]

const BADGES = [
  { id: 'cinephile',  emoji: '🎬', label: 'Cinephile',    desc: '5+ films',     req: c => (c.movie    || 0) >= 5 },
  { id: 'foodie',     emoji: '🍝', label: 'Foodie',       desc: '5+ recipes',   req: c => (c.recipe   || 0) >= 5 },
  { id: 'bookworm',   emoji: '📚', label: 'Bookworm',     desc: '5+ books',     req: c => (c.book     || 0) >= 5 },
  { id: 'gamer',      emoji: '🎮', label: 'Gamer',        desc: '5+ games',     req: c => (c.game     || 0) >= 5 },
  { id: 'musichead',  emoji: '🎵', label: 'Music Head',   desc: '5+ playlists', req: c => (c.playlist || 0) >= 5 },
  { id: 'explorer',   emoji: '🌿', label: 'Explorer',     desc: '5+ activities',req: c => (c.activity || 0) >= 5 },
  { id: 'mixologist', emoji: '🥂', label: 'Mixologist',   desc: '5+ drinks',    req: c => (c.drink    || 0) >= 5 },
  { id: 'collector',  emoji: '✨', label: 'Collector',    desc: '15+ saved',    req: c => Object.values(c).reduce((a,b)=>a+b,0) >= 15 },
  { id: 'curator',    emoji: '🌟', label: 'Taste Curator',desc: '5+ categories',req: c => Object.values(c).filter(v=>v>0).length >= 5 },
]

const WEEK_VIBES = {
  movie:    { label: 'cinematic',    emoji: '🎬', quote: 'You were deep in your film era this week.' },
  recipe:   { label: 'culinary',     emoji: '🍝', quote: 'Your kitchen was the main character this week.' },
  game:     { label: 'gamer',        emoji: '🎮', quote: 'Full gamer mode — no regrets.' },
  book:     { label: 'bookish',      emoji: '📚', quote: 'Quiet, focused, literary. That\'s you.' },
  playlist: { label: 'musical',      emoji: '🎵', quote: 'The soundtrack of your week was impeccable.' },
  activity: { label: 'adventurous',  emoji: '🌿', quote: 'Always moving, always exploring.' },
  drink:    { label: 'social',       emoji: '🥂', quote: 'Cheers to a well-curated week.' },
}

function WeeklyWrap({ allFavorites }) {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const weekItems = allFavorites.filter(i => new Date(i.savedAt).getTime() > sevenDaysAgo)

  if (weekItems.length === 0) return (
    <div style={{
      padding: '28px 32px', borderRadius: 20,
      background: `linear-gradient(135deg, ${GOLD}08, transparent)`,
      border: `1.5px solid ${GOLD}20`, marginBottom: 24,
      display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
    }}>
      <div style={{ fontSize: 32 }}>📅</div>
      <div>
        <div style={{ fontFamily: SERIF, fontSize: '1.25rem', color: '#1C1A18', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Your Weekly Wrap awaits
        </div>
        <p style={{ fontSize: 13, color: '#7A7268', fontFamily: '"Inter", sans-serif' }}>
          Save items this week and we'll show your taste summary here every Sunday.
        </p>
      </div>
    </div>
  )

  const byType = weekItems.reduce((a, i) => { const t = i.type||'other'; a[t]=(a[t]||0)+1; return a }, {})
  const topType = Object.entries(byType).sort((a,b) => b[1]-a[1])[0]?.[0]
  const vibe = WEEK_VIBES[topType] || { label: 'eclectic', emoji: '✨', quote: 'Wide taste, open mind.' }
  const topCat = CATEGORIES.find(c => c.key === topType)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      style={{
        borderRadius: 22, overflow: 'hidden', marginBottom: 24,
        background: '#fff',
        boxShadow: '0 2px 20px rgba(28,26,24,0.07)',
        border: '1px solid rgba(28,26,24,0.07)',
      }}
    >
      {/* Dark header */}
      <div style={{
        padding: '28px 32px',
        background: 'linear-gradient(135deg, #0D0B09, #1A1208)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${topCat?.color || GOLD}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
          <Sparkles size={12} color={GOLD} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, fontFamily: '"Inter", sans-serif' }}>
            This Week's Wrap
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 48, lineHeight: 1 }}>{vibe.emoji}</span>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#FDFAF6', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1 }}>
              Your <em style={{ color: GOLD, fontStyle: 'italic' }}>{vibe.label}</em> week.
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,240,220,0.4)', fontFamily: '"Inter", sans-serif', marginTop: 6 }}>
              {vibe.quote}
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ padding: '20px 32px', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Saved this week', value: weekItems.length },
          { label: 'Top category',    value: topCat ? `${topCat.label} (${byType[topType]})` : '—' },
          { label: 'Categories',      value: Object.keys(byType).length },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#B0A898', fontFamily: '"Inter", sans-serif', marginBottom: 4 }}>{label}</div>
            <div style={{ fontFamily: SERIF, fontSize: '1.6rem', color: '#1C1A18', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function FavoriteCard({ item }) {
  const [err, setErr] = useState(false)
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title || item.name || '?')}&background=EDE8E0&color=4D7A52&size=200&bold=true`
  return (
    <div style={{
      borderRadius: 14, overflow: 'hidden',
      background: '#fff',
      boxShadow: '0 2px 12px rgba(28,26,24,0.07)',
      border: '1px solid rgba(28,26,24,0.06)',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(28,26,24,0.12)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(28,26,24,0.07)' }}
    >
      <div style={{ aspectRatio: '2/3', overflow: 'hidden', background: '#F0EBE4' }}>
        <img
          src={err ? fallback : (item.poster || item.image || fallback)}
          alt={item.title || item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={() => setErr(true)}
        />
      </div>
      <div style={{ padding: '9px 11px' }}>
        <p style={{
          fontSize: 11.5, fontWeight: 600, color: '#1C1A18', lineHeight: 1.3,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {item.title || item.name}
        </p>
      </div>
    </div>
  )
}

export default function Profile() {
  const { user, logout, favorites, avatar, setAvatar, removeAvatar } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [myPicks, setMyPicks]     = useState([])

  useEffect(() => {
    try {
      const all = JSON.parse(localStorage.getItem('sylex_wall') || '[]')
      setMyPicks(all.filter(p => p.userId === user?.id))
    } catch {}
  }, [user])

  const removeMyPick = (id) => {
    try {
      const all = JSON.parse(localStorage.getItem('sylex_wall') || '[]')
      const updated = all.filter(p => p.id !== id)
      localStorage.setItem('sylex_wall', JSON.stringify(updated))
      setMyPicks(updated.filter(p => p.userId === user?.id))
    } catch {}
  }

  // ── Not signed in ─────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{
            width: 92, height: 92, borderRadius: '26px', margin: '0 auto 28px',
            background: 'linear-gradient(135deg, rgba(196,154,108,0.12), rgba(196,154,108,0.04))',
            border: '1.5px solid rgba(196,154,108,0.28)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Lock style={{ width: 38, height: 38, color: GOLD }} />
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: '2.4rem', color: '#1C1A18', letterSpacing: '-0.025em', fontWeight: 600, marginBottom: 12 }}>
            Your profile awaits
          </h2>
          <p style={{ color: '#7A7268', fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
            Sign in to save favourites, track your taste across 7 categories, and earn taste badges.
          </p>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 30px', borderRadius: 100,
            background: GOLD, color: '#1A0E08',
            fontSize: 13, fontWeight: 700, textDecoration: 'none',
            letterSpacing: '0.02em', boxShadow: `0 4px 20px ${GOLD}40`,
          }}>
            Back to Homepage
          </Link>
        </motion.div>
      </div>
    )
  }

  // ── Computed data ─────────────────────────────────────────────────────────
  const allFavorites    = Object.values(favorites)
  const favoritesByType = allFavorites.reduce((acc, item) => {
    const t = item.type || 'other'
    acc[t] = (acc[t] || 0) + 1
    return acc
  }, {})

  const totalSaved     = allFavorites.length
  const categoriesUsed = Object.keys(favoritesByType).filter(k => CATEGORIES.find(c => c.key === k)).length
  const maxCount       = Math.max(...Object.values(favoritesByType), 1)

  const earnedBadges = BADGES.filter(b =>  b.req(favoritesByType))
  const lockedBadges = BADGES.filter(b => !b.req(favoritesByType))

  const dominantCat = CATEGORIES.find(
    c => c.key === Object.entries(favoritesByType).sort((a,b) => b[1]-a[1])[0]?.[0]
  )
  const avatarColor = dominantCat?.color || GOLD

  const tabList = useMemo(() => {
    const active = CATEGORIES.filter(c => (favoritesByType[c.key] || 0) > 0)
    return [{ key: 'all', label: 'All', count: totalSaved, color: GOLD }, ...active.map(c => ({ key: c.key, label: c.label, count: favoritesByType[c.key], color: c.color }))]
  }, [favoritesByType, totalSaved])

  const filteredFavorites = useMemo(() => {
    const sorted = [...allFavorites].sort((a,b) => new Date(b.savedAt) - new Date(a.savedAt))
    return activeTab === 'all' ? sorted : sorted.filter(i => i.type === activeTab)
  }, [allFavorites, activeTab])

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>

      {/* ── Dark hero banner ── */}
      <div style={{
        background: 'linear-gradient(155deg, #0D0B09 0%, #141210 55%, #1C130A 100%)',
        padding: '120px 0 64px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Ambient glows */}
        <div style={{ position: 'absolute', left: '8%', top: '-40%', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${avatarColor}18 0%, transparent 65%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: '5%', bottom: '-35%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${GOLD}10 0%, transparent 70%)`, pointerEvents: 'none' }} />

        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>

              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
              >
                <div style={{ position: 'relative', width: 100, height: 100 }}>
                  {/* Avatar circle */}
                  <div style={{
                    width: 100, height: 100, borderRadius: '26px',
                    background: avatar ? 'transparent' : `linear-gradient(135deg, ${avatarColor}35, ${avatarColor}12)`,
                    border: `2px solid ${avatarColor}65`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 50px ${avatarColor}35`,
                    overflow: 'hidden',
                  }}>
                    {avatar ? (
                      <img src={avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontFamily: SERIF, fontSize: 46, fontWeight: 700, color: avatarColor, lineHeight: 1 }}>
                        {user.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  {/* Upload overlay */}
                  <label htmlFor="avatar-upload" style={{
                    position: 'absolute', inset: 0, borderRadius: '24px',
                    background: 'rgba(0,0,0,0.52)', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 4,
                    cursor: 'pointer', opacity: 0, transition: 'opacity 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                  >
                    <Camera size={18} color="white" />
                    <span style={{ fontSize: 10, color: 'white', fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>
                      {avatar ? 'Change' : 'Upload'}
                    </span>
                  </label>
                  <input id="avatar-upload" type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = ev => setAvatar(ev.target.result)
                      reader.readAsDataURL(file)
                      e.target.value = ''
                    }}
                  />
                </div>
                {avatar && (
                  <button onClick={removeAvatar} style={{
                    fontSize: 10.5, color: 'rgba(255,240,220,0.32)', background: 'none',
                    border: 'none', cursor: 'pointer', fontFamily: '"Inter", sans-serif',
                    transition: 'color 0.18s', padding: 0,
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,100,100,0.7)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,240,220,0.32)'}
                  >
                    Remove photo
                  </button>
                )}
              </motion.div>

              <div style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: `${GOLD}80`, marginBottom: 9, fontFamily: '"Inter", sans-serif' }}>
                  {dominantCat ? `${dominantCat.label} Enthusiast` : 'Sylex Member'}
                </div>
                <h1 style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                  color: '#FDFAF6', fontWeight: 600,
                  lineHeight: 0.92, letterSpacing: '-0.03em', marginBottom: 10,
                }}>
                  {user.name}
                </h1>
                <p style={{ fontSize: 13.5, color: 'rgba(255,240,220,0.38)', fontFamily: '"Inter", sans-serif' }}>
                  {user.email}
                </p>
              </div>

              {/* Sign out */}
              <button onClick={() => { logout(); navigate('/') }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '10px 18px', borderRadius: 100,
                  background: 'rgba(239,68,68,0.07)',
                  border: '1.5px solid rgba(239,68,68,0.22)',
                  color: '#F87171', fontSize: 12.5, fontWeight: 600,
                  cursor: 'pointer', fontFamily: '"Inter", sans-serif', transition: 'all 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.38)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.07)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.22)' }}
              >
                <LogOut size={13} /> Sign out
              </button>
            </div>

            {/* Stats pills */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.5 }}
              style={{ display: 'flex', gap: 10, marginTop: 36, flexWrap: 'wrap' }}
            >
              {[
                { value: totalSaved,     label: 'Saved items', icon: Heart },
                { value: categoriesUsed, label: 'Categories',  icon: TrendingUp },
                { value: earnedBadges.length, label: 'Badges', icon: Award },
              ].map(({ value, label, icon: Icon }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 20px', borderRadius: 100,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <Icon size={13} color={GOLD} />
                  <span style={{ fontFamily: SERIF, fontSize: 22, color: '#FDFAF6', fontWeight: 600, lineHeight: 1 }}>{value}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,240,220,0.38)', fontFamily: '"Inter", sans-serif' }}>{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Content body ── */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '52px 32px 0' }}>

        {/* ── Weekly Wrap ── */}
        <WeeklyWrap allFavorites={allFavorites} />

        {/* ── Taste DNA ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.55 }}
          style={{
            padding: '36px', borderRadius: 24,
            background: '#fff',
            boxShadow: '0 2px 20px rgba(28,26,24,0.07)',
            border: '1px solid rgba(28,26,24,0.07)',
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
            <TrendingUp size={14} color={GOLD} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, fontFamily: '"Inter", sans-serif' }}>
              Taste DNA
            </span>
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(1.5rem, 2.8vw, 2rem)', color: '#1C1A18', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 28 }}>
            What you love
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {CATEGORIES.map((cat, i) => {
              const count = favoritesByType[cat.key] || 0
              const pct   = count === 0 ? 0 : Math.max(4, (count / maxCount) * 100)
              const Icon  = cat.icon
              return (
                <motion.div key={cat.key}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18 + i * 0.05 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 14 }}
                >
                  <Link to={cat.path} style={{ textDecoration: 'none' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: cat.bg, border: `1px solid ${cat.color}22`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'transform 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={e => e.currentTarget.style.transform = ''}
                    >
                      <Icon size={15} style={{ color: cat.color }} />
                    </div>
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#1C1A18', fontFamily: '"Inter", sans-serif' }}>{cat.label}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: count > 0 ? cat.color : '#C4BDB4', fontFamily: '"Inter", sans-serif' }}>
                        {count > 0 ? `${count} saved` : '—'}
                      </span>
                    </div>
                    <div style={{ height: 6, borderRadius: 100, background: `${cat.color}14`, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1.1, delay: 0.3 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          height: '100%', borderRadius: 100,
                          background: count > 0
                            ? `linear-gradient(90deg, ${cat.color}, ${cat.color}BB)`
                            : 'transparent',
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* ── Taste Badges ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.55 }}
          style={{
            padding: '36px', borderRadius: 24,
            background: '#fff',
            boxShadow: '0 2px 20px rgba(28,26,24,0.07)',
            border: '1px solid rgba(28,26,24,0.07)',
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
            <Award size={14} color={GOLD} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, fontFamily: '"Inter", sans-serif' }}>
              Taste Badges
            </span>
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(1.5rem, 2.8vw, 2rem)', color: '#1C1A18', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 24 }}>
            {earnedBadges.length > 0 ? `${earnedBadges.length} of ${BADGES.length} earned` : 'Explore to earn badges'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
            {/* Earned */}
            {earnedBadges.map((badge, i) => (
              <motion.div key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + i * 0.04 }}
                style={{
                  padding: '18px 14px', borderRadius: 16, textAlign: 'center',
                  background: `linear-gradient(135deg, ${GOLD}16, ${GOLD}06)`,
                  border: `1.5px solid ${GOLD}38`,
                }}
              >
                <div style={{ fontSize: 30, marginBottom: 9 }}>{badge.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1C1A18', fontFamily: '"Inter", sans-serif', marginBottom: 3 }}>{badge.label}</div>
                <div style={{ fontSize: 10.5, color: '#7A7268', fontFamily: '"Inter", sans-serif' }}>{badge.desc}</div>
              </motion.div>
            ))}

            {/* Locked */}
            {lockedBadges.map((badge, i) => (
              <motion.div key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.03 }}
                style={{
                  padding: '18px 14px', borderRadius: 16, textAlign: 'center',
                  background: '#F8F5F1', border: '1.5px solid rgba(28,26,24,0.07)',
                  opacity: 0.45, filter: 'grayscale(1)',
                }}
              >
                <div style={{ fontSize: 30, marginBottom: 9 }}>{badge.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#7A7268', fontFamily: '"Inter", sans-serif', marginBottom: 3 }}>{badge.label}</div>
                <div style={{ fontSize: 10.5, color: '#A09888', fontFamily: '"Inter", sans-serif' }}>{badge.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Saved Collection ── */}
        {allFavorites.length > 0 ? (
          <motion.section
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.55 }}
            style={{
              padding: '36px', borderRadius: 24,
              background: '#fff',
              boxShadow: '0 2px 20px rgba(28,26,24,0.07)',
              border: '1px solid rgba(28,26,24,0.07)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
              <Heart size={14} color={GOLD} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, fontFamily: '"Inter", sans-serif' }}>
                Collection
              </span>
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(1.5rem, 2.8vw, 2rem)', color: '#1C1A18', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 20 }}>
              Your saved items
            </h2>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 7, marginBottom: 24, flexWrap: 'wrap' }}>
              {tabList.map(tab => {
                const active = activeTab === tab.key
                return (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    style={{
                      padding: '6px 15px', borderRadius: 100,
                      background: active ? tab.color : 'rgba(28,26,24,0.05)',
                      border: `1.5px solid ${active ? tab.color : 'rgba(28,26,24,0.1)'}`,
                      color: active ? (tab.key === 'all' ? '#1A0E08' : '#fff') : '#7A7268',
                      fontSize: 12.5, fontWeight: active ? 700 : 500,
                      cursor: 'pointer', fontFamily: '"Inter", sans-serif',
                      transition: 'all 0.18s',
                    }}
                  >
                    {tab.label}
                    <span style={{ marginLeft: 5, opacity: 0.65, fontSize: 11 }}>{tab.count}</span>
                  </button>
                )
              })}
            </div>

            {/* Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(128px, 1fr))',
              gap: 12,
            }}>
              <AnimatePresence mode="popLayout">
                {filteredFavorites.slice(0, 24).map((item, i) => (
                  <motion.div key={`${item.type}_${item.id}`}
                    layout
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.88 }}
                    transition={{ delay: i * 0.02, duration: 0.3 }}
                  >
                    <FavoriteCard item={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredFavorites.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#9A9288', fontSize: 14, fontFamily: '"Inter", sans-serif' }}>
                Nothing in this category yet.
              </div>
            )}
          </motion.section>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '60px 0' }}
          >
            <div style={{ fontSize: 56, marginBottom: 20 }}>🌟</div>
            <h3 style={{ fontFamily: SERIF, fontSize: '1.9rem', color: '#1C1A18', fontWeight: 600, letterSpacing: '-0.025em', marginBottom: 12 }}>
              Nothing saved yet
            </h3>
            <p style={{ color: '#7A7268', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
              Tap the heart on any film, recipe, game, or book to save it here.
            </p>
            <Link to="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 30px', borderRadius: 100,
              background: GOLD, color: '#1A0E08',
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
              boxShadow: `0 4px 20px ${GOLD}40`,
            }}>
              Start Exploring
            </Link>
          </motion.div>
        )}

        {/* ── My Picks (Community Wall contributions) ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, duration: 0.55 }}
          style={{
            padding: '36px', borderRadius: 24,
            background: '#fff',
            boxShadow: '0 2px 20px rgba(28,26,24,0.07)',
            border: '1px solid rgba(28,26,24,0.07)',
            marginTop: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
            <MessageSquareHeart size={14} color={GOLD} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, fontFamily: '"Inter", sans-serif' }}>
              My Picks
            </span>
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(1.5rem, 2.8vw, 2rem)', color: '#1C1A18', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 24 }}>
            What you've shared
          </h2>

          {myPicks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '28px 0' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>💬</div>
              <p style={{ color: '#9A9288', fontSize: 13.5, fontFamily: '"Inter", sans-serif', lineHeight: 1.6 }}>
                Nothing shared yet — head to the home page<br />and tell everyone what you're loving right now.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12 }}>
              {myPicks.map((pick, i) => (
                <motion.div key={pick.id}
                  initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    borderRadius: 14, overflow: 'hidden',
                    border: '1px solid rgba(28,26,24,0.08)',
                    background: '#FDFAF6',
                    position: 'relative',
                  }}
                >
                  <div style={{ height: 3, background: pick.color }} />
                  <div style={{ padding: '13px 14px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ fontSize: 18 }}>{pick.emoji}</span>
                        <span style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: pick.color, fontFamily: '"Inter", sans-serif' }}>
                          {pick.categoryLabel}
                        </span>
                      </div>
                      <button onClick={() => removeMyPick(pick.id)} style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'rgba(28,26,24,0.07)', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.14)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(28,26,24,0.07)'}
                        title="Remove"
                      >
                        <X size={10} color="#9A9288" />
                      </button>
                    </div>
                    <p style={{ fontFamily: SERIF, fontSize: 14.5, color: '#1C1A18', fontWeight: 600, lineHeight: 1.3, marginBottom: 8 }}>
                      {pick.title}
                    </p>
                    <span style={{ fontSize: 10.5, color: '#B0A898', fontFamily: '"Inter", sans-serif' }}>
                      {new Date(pick.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

      </div>
    </div>
  )
}
