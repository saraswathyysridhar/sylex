import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight, Film, ChefHat, Gamepad2, BookOpen, Music, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const quick = [
  { label: 'Rainy evening movies', icon: Film,     path: '/movies?q=cozy+drama' },
  { label: 'Date night recipes',   icon: ChefHat,  path: '/recipes?q=dinner' },
  { label: 'Chill indie games',    icon: Gamepad2, path: '/games?q=indie' },
  { label: 'Self-help books',      icon: BookOpen, path: '/books?q=self+help' },
  { label: 'Focus playlist',       icon: Music,    path: '/music' },
  { label: 'Weekend activities',   icon: Zap,      path: '/activities' },
]

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 80) }
  }, [isOpen])

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onClose])

  const go = (path) => { navigate(path); onClose() }
  const submit = (e) => { e.preventDefault(); if (query.trim()) go(`/movies?q=${encodeURIComponent(query)}`) }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} onClick={onClose}
            className="fixed inset-0 z-[100]"
            style={{ background: 'rgba(28,26,24,0.65)', backdropFilter: 'blur(12px)' }}
          />

          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[101] w-full max-w-2xl px-4"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: '#fff', border: '1.5px solid #D4CCBC', boxShadow: '0 20px 60px rgba(28,26,24,0.2)' }}>

              <form onSubmit={submit}
                className="flex items-center gap-3 px-5 py-4"
                style={{ borderBottom: '1.5px solid #E8E2D8' }}>
                <Search className="w-5 h-5 text-sage-500 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search movies, recipes, games, books..."
                  className="flex-1 bg-transparent text-ink placeholder-ink-faint outline-none text-sm"
                />
                {query ? (
                  <>
                    <button type="button" onClick={() => setQuery('')}
                      className="text-ink-muted hover:text-ink transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                    <button type="submit"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                      style={{ background: '#4D7A52' }}>
                      Go <ArrowRight className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-ink-muted"
                    style={{ background: '#F2EDE5', border: '1px solid #E8E2D8' }}>
                    ESC
                  </kbd>
                )}
              </form>

              <div className="p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
                  Quick Explore
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quick.map(({ label, icon: Icon, path }) => (
                    <button key={label} onClick={() => go(path)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all group"
                      style={{ background: '#F2EDE5', border: '1px solid #E8E2D8' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(77,122,82,0.08)'; e.currentTarget.style.borderColor = 'rgba(77,122,82,0.25)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#F2EDE5'; e.currentTarget.style.borderColor = '#E8E2D8' }}
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(77,122,82,0.1)' }}>
                        <Icon className="w-3.5 h-3.5 text-sage-500" />
                      </div>
                      <span className="text-xs text-ink-muted group-hover:text-ink transition-colors">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
