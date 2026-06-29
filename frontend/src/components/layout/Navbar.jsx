import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, X, ChevronDown, User, BookMarked, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AuthModal from '../auth/AuthModal'
import SearchOverlay from '../ui/SearchOverlay'

const NAV = [
  { to: '/movies',      label: 'Movies',      emoji: '🎬', accent: '#5A9FBF' },
  { to: '/recipes',     label: 'Recipes',     emoji: '🍝', accent: '#C4703A' },
  { to: '/games',       label: 'Games',       emoji: '🎮', accent: '#CC2222' },
  { to: '/books',       label: 'Books',       emoji: '📚', accent: '#8B5E3C' },
  { to: '/music',       label: 'Music',       emoji: '🎵', accent: '#3A9B7A' },
  { to: '/activities',  label: 'Activities',  emoji: '🎨', accent: '#4D7A52' },
  { to: '/drinks',      label: 'Drinks',      emoji: '☕', accent: '#D4956A' },
  { to: '/collections', label: 'Collections', emoji: '✨', accent: '#B5763A' },
  { to: '/planner',     label: 'Plan Night',  emoji: '🌙', accent: '#C49A6C', pill: true },
]

const CINZEL = '"Cinzel", serif'

export default function Navbar() {
  const location            = useLocation()
  const { user, logout, avatar } = useAuth()
  const [scrolled, set]     = useState(false)
  const [mobile, setMobile] = useState(false)
  const [authOpen, setAuth] = useState(false)
  const [search, setSearch] = useState(false)
  const [userMenu, setUm]   = useState(false)

  useEffect(() => {
    const fn = () => set(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => setMobile(false), [location.pathname])

  const activeAccent = NAV.find(n => location.pathname === n.to)?.accent || '#4D7A52'

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(242,237,229,0.94)' : 'rgba(242,237,229,0.62)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderBottom: scrolled ? '1px solid rgba(212,204,188,0.9)' : '1px solid rgba(212,204,188,0.2)',
          boxShadow: scrolled ? '0 1px 32px rgba(28,26,24,0.08)' : 'none',
        }}
      >
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-[108px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div style={{
                width: '56px', height: '56px', borderRadius: '15px',
                background: `linear-gradient(135deg, ${activeAccent}20, ${activeAccent}08)`,
                border: `1.5px solid ${activeAccent}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.35s ease',
                boxShadow: `0 2px 14px ${activeAccent}25`,
              }}>
                <span style={{
                  fontFamily: CINZEL,
                  fontSize: '26px',
                  fontWeight: 700,
                  color: activeAccent,
                  lineHeight: 1,
                  transition: 'color 0.35s ease',
                }}>S</span>
              </div>
              <div>
                <div style={{
                  fontFamily: CINZEL,
                  fontSize: '36px',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  color: '#1C1A18',
                  lineHeight: 1.05,
                  transition: 'color 0.2s',
                }}>
                  SYLEX
                </div>
                <div style={{
                  fontSize: '9.5px',
                  letterSpacing: '0.30em',
                  color: '#B0A898',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  marginTop: '2px',
                  fontFamily: '"Inter", sans-serif',
                }}>
                  Mood Discovery
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden xl:flex items-center gap-0">
              {NAV.map(({ to, label, accent, pill }) => {
                const active = location.pathname === to
                if (pill) return (
                  <Link key={to} to={to}
                    className="ml-3"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '8px 18px', borderRadius: 100,
                      background: active
                        ? `linear-gradient(135deg, ${accent}, ${accent}CC)`
                        : `${accent}18`,
                      border: `1.5px solid ${active ? accent : `${accent}50`}`,
                      color: active ? '#1A0E08' : accent,
                      fontSize: '13px', fontWeight: 700,
                      letterSpacing: '0.02em', fontFamily: '"Inter", sans-serif',
                      transition: 'all 0.22s', whiteSpace: 'nowrap',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.background = `linear-gradient(135deg, ${accent}, ${accent}CC)`
                        e.currentTarget.style.color = '#1A0E08'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.background = `${accent}18`
                        e.currentTarget.style.color = accent
                      }
                    }}
                  >
                    ✨ {label}
                  </Link>
                )
                return (
                  <Link key={to} to={to}
                    className="relative px-4 py-2 text-[20px] transition-all duration-200"
                    style={{
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: active ? 600 : 400,
                      letterSpacing: active ? '0.01em' : '0',
                      color: active ? accent : '#7A7268',
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#1C1A18' } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#7A7268' } }}
                  >
                    {label}
                    {active && (
                      <motion.div layoutId="nav-underline"
                        className="absolute bottom-0.5 inset-x-3.5 rounded-full"
                        style={{ height: '1.5px', background: accent }}
                        transition={{ type: 'spring', bounce: 0.25, duration: 0.45 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setSearch(true)}
                className="p-2.5 rounded-xl text-ink-muted hover:text-ink hover:bg-ink/5 transition-all"
                aria-label="Search">
                <Search className="w-[17px] h-[17px]" />
              </button>

              {user ? (
                <div className="relative">
                  <button onClick={() => setUm(v => !v)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
                    style={{ background: 'rgba(28,26,24,0.06)', border: '1px solid rgba(28,26,24,0.1)' }}>
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold overflow-hidden"
                      style={{ background: avatar ? 'transparent' : `linear-gradient(135deg, ${activeAccent}, ${activeAccent}BB)`, color: '#fff' }}>
                      {avatar
                        ? <img src={avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : user.name?.[0]?.toUpperCase()
                      }
                    </div>
                    <span className="text-[13px] font-medium text-ink hidden sm:block max-w-[90px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-ink-muted transition-transform ${userMenu ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {userMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 rounded-2xl overflow-hidden"
                        style={{ background: '#fff', border: '1px solid rgba(28,26,24,0.1)', boxShadow: '0 16px 48px rgba(28,26,24,0.14)' }}
                      >
                        <div className="p-1.5">
                          {[
                            { to: '/profile', icon: User, label: 'Profile' },
                            { to: '/collections', icon: BookMarked, label: 'Collections' },
                          ].map(({ to, icon: Icon, label }) => (
                            <Link key={to} to={to} onClick={() => setUm(false)}
                              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-ink-soft hover:text-ink hover:bg-cream-100 transition-all">
                              <Icon className="w-4 h-4" style={{ color: activeAccent }} /> {label}
                            </Link>
                          ))}
                        </div>
                        <div className="divider mx-3" />
                        <div className="p-1.5">
                          <button onClick={() => { logout(); setUm(false) }}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 transition-all">
                            <LogOut className="w-4 h-4" /> Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button onClick={() => setAuth(true)}
                  className="px-5 py-2 rounded-full text-[12.5px] font-semibold text-white transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${activeAccent}, ${activeAccent}CC)`,
                    boxShadow: `0 4px 16px ${activeAccent}40`,
                    letterSpacing: '0.02em',
                    transition: 'all 0.35s ease',
                  }}>
                  Sign in
                </button>
              )}

              <button onClick={() => setMobile(v => !v)}
                className="xl:hidden p-2.5 rounded-xl text-ink-muted hover:text-ink hover:bg-ink/5 transition-all">
                {mobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobile && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="xl:hidden overflow-hidden"
              style={{ background: 'rgba(242,237,229,0.98)', borderTop: '1px solid rgba(212,204,188,0.6)' }}
            >
              <div className="px-6 py-5 grid grid-cols-2 gap-2">
                {NAV.map(({ to, label, emoji, accent }) => (
                  <Link key={to} to={to}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[13.5px] font-medium transition-all"
                    style={{
                      background: location.pathname === to ? `${accent}12` : 'rgba(28,26,24,0.05)',
                      color: location.pathname === to ? accent : '#3A3630',
                      border: `1px solid ${location.pathname === to ? `${accent}30` : 'transparent'}`,
                      fontWeight: location.pathname === to ? 600 : 400,
                    }}>
                    <span className="text-xl">{emoji}</span> {label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AuthModal isOpen={authOpen} onClose={() => setAuth(false)} />
      <SearchOverlay isOpen={search} onClose={() => setSearch(false)} />
    </>
  )
}
