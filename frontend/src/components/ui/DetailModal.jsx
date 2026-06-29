import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Clock, Heart, ExternalLink, Play, Calendar, Shuffle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// ── PairWith data ──────────────────────────────────────────────────────────────
const KNOWN_PAIRS = {
  // Movies
  'Parasite':               { recipe: 'Japchae',         drink: 'Soju Cocktail',   music: 'Korean Indie',       activity: null },
  'La La Land':             { recipe: 'French Crêpes',   drink: 'Champagne',       music: 'Jazz Standards',     activity: null },
  'Interstellar':           { recipe: 'Ramen from Scratch', drink: 'Black Coffee', music: 'Hans Zimmer Mix',    activity: null },
  'Amélie':                 { recipe: 'Crème Brûlée',    drink: 'Café au Lait',    music: 'French Café Jazz',   activity: null },
  'Whiplash':               { recipe: 'Eggs Benedict',   drink: 'Espresso',        music: 'Hard Bop Jazz',      activity: null },
  'Her':                    { recipe: 'Aglio e Olio',    drink: 'Chamomile Tea',   music: 'Ambient Electronic', activity: null },
  'Dune':                   { recipe: 'Spiced Lentil Soup', drink: 'Masala Chai', music: 'Epic Orchestral',     activity: null },
}

const TYPE_DEFAULTS = {
  movie:    [
    { label: 'Make it',    emoji: '🍽️', path: '/recipes',    hint: 'A matching recipe' },
    { label: 'Pair it',    emoji: '🥂', path: '/drinks',     hint: 'Perfect drink' },
    { label: 'Score it',   emoji: '🎵', path: '/music',      hint: 'Set the mood' },
  ],
  recipe:   [
    { label: 'Watch it',   emoji: '🎬', path: '/movies',     hint: 'Film to cook to' },
    { label: 'Sip it',     emoji: '🥂', path: '/drinks',     hint: 'Pair a drink' },
    { label: 'Move it',    emoji: '🌿', path: '/activities', hint: 'Work it off after' },
  ],
  game:     [
    { label: 'Fuel it',    emoji: '🍕', path: '/recipes',    hint: 'Gaming snack' },
    { label: 'Sip it',     emoji: '🥤', path: '/drinks',     hint: 'Stay hydrated' },
    { label: 'Vibe it',    emoji: '🎵', path: '/music',      hint: 'Gaming playlist' },
  ],
  book:     [
    { label: 'Sip it',     emoji: '☕', path: '/drinks',     hint: 'Reading drink' },
    { label: 'Play it',    emoji: '🎵', path: '/music',      hint: 'Focus playlist' },
    { label: 'Stretch it', emoji: '🌿', path: '/activities', hint: 'Take a break' },
  ],
  playlist: [
    { label: 'Watch it',   emoji: '🎬', path: '/movies',     hint: 'Film to match' },
    { label: 'Cook it',    emoji: '🍽️', path: '/recipes',    hint: 'Cook along' },
    { label: 'Move it',    emoji: '🌿', path: '/activities', hint: 'Get active' },
  ],
  activity: [
    { label: 'Refuel',     emoji: '🍝', path: '/recipes',    hint: 'Post-activity meal' },
    { label: 'Recharge',   emoji: '🥤', path: '/drinks',     hint: 'Recovery drink' },
    { label: 'Wind down',  emoji: '🎵', path: '/music',      hint: 'Cooldown playlist' },
  ],
  drink:    [
    { label: 'Watch it',   emoji: '🎬', path: '/movies',     hint: 'Film to sip to' },
    { label: 'Snack it',   emoji: '🍽️', path: '/recipes',    hint: 'Pair a bite' },
    { label: 'Play it',    emoji: '🎵', path: '/music',      hint: 'Playlist vibes' },
  ],
}

function PairWith({ item, type }) {
  const navigate = useNavigate()
  const known = KNOWN_PAIRS[item?.title || item?.name]
  const defaults = TYPE_DEFAULTS[type] || TYPE_DEFAULTS.movie

  // Build 3 pair cards: use known pairs where available, else show category links
  const pairs = defaults.map(d => {
    const catKey = d.path.replace('/', '')
    const knownValue = known?.[catKey === 'activities' ? 'activity' : catKey === 'movies' ? null : catKey === 'music' ? 'music' : catKey]
    return { ...d, specific: knownValue || null }
  })

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
        <Shuffle size={12} color="#7A7268" />
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7A7268' }}>
          Pair with
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {pairs.map(p => (
          <button key={p.path} onClick={() => navigate(p.path)}
            style={{
              padding: '12px', borderRadius: 12, textAlign: 'left',
              background: '#F8F5F1', border: '1.5px solid rgba(28,26,24,0.07)',
              cursor: 'pointer', transition: 'all 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F0EBE4'; e.currentTarget.style.borderColor = '#C49A6C60'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F8F5F1'; e.currentTarget.style.borderColor = 'rgba(28,26,24,0.07)'; e.currentTarget.style.transform = '' }}
          >
            <div style={{ fontSize: 18, marginBottom: 5 }}>{p.emoji}</div>
            {p.specific ? (
              <>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#1C1A18', fontFamily: '"Inter", sans-serif', marginBottom: 2, lineHeight: 1.2 }}>
                  {p.specific}
                </div>
                <div style={{ fontSize: 10, color: '#9A9288', fontFamily: '"Inter", sans-serif' }}>{p.hint}</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#1C1A18', fontFamily: '"Inter", sans-serif', marginBottom: 2 }}>
                  {p.label}
                </div>
                <div style={{ fontSize: 10, color: '#9A9288', fontFamily: '"Inter", sans-serif' }}>{p.hint}</div>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function DetailModal({ item, type, isOpen, onClose }) {
  const { user, toggleFavorite, isFavorite, getNote, setNote } = useAuth()
  const [imgError, setImgError] = useState(false)
  const [note, setNoteLocal]    = useState('')
  const debounceRef             = useRef(null)
  const navigate                = useNavigate()

  useEffect(() => {
    if (item && type) setNoteLocal(getNote(type, item.id))
  }, [item?.id, type])

  const handleNoteChange = (text) => {
    setNoteLocal(text)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setNote(type, item.id, text), 600)
  }

  if (!item) return null

  const favorited = isFavorite(item.id, type)
  const fallback  = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title || item.name || 'Item')}&background=EDE8E0&color=4D7A52&size=800&bold=true&length=2`

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }} onClick={onClose}
            className="fixed inset-0 z-[200]"
            style={{ background: 'rgba(28,26,24,0.7)', backdropFilter: 'blur(14px)' }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
          >
            <div onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl shadow-2xl"
              style={{ background: '#fff', border: '1.5px solid #E8E2D8' }}>

              {/* Banner */}
              <div className="relative h-60 sm:h-72 overflow-hidden rounded-t-3xl">
                <img
                  src={imgError ? fallback : (item.banner || item.backdrop || item.poster || item.image || item.thumbnail || item.cover || fallback)}
                  alt={item.title || item.name}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.2) 50%, transparent 100%)' }} />

                <button onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full transition-all"
                  style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(28,26,24,0.1)', color: '#1C1A18', boxShadow: '0 2px 8px rgba(28,26,24,0.15)' }}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 pb-8 -mt-10 relative z-10">
                <div className="flex items-end justify-between gap-4 mb-5">
                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-bold text-ink leading-tight">
                      {item.title || item.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      {item.rating && (
                        <span className="flex items-center gap-1 text-sm font-semibold text-sage-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {typeof item.rating === 'number' ? item.rating.toFixed(1) : item.rating}
                        </span>
                      )}
                      {item.year && (
                        <span className="flex items-center gap-1 text-sm text-ink-muted">
                          <Calendar className="w-3 h-3" /> {item.year}
                        </span>
                      )}
                      {item.runtime && (
                        <span className="flex items-center gap-1 text-sm text-ink-muted">
                          <Clock className="w-3 h-3" /> {item.runtime}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => user && toggleFavorite(item, type)}
                    className="p-3 rounded-2xl transition-all"
                    style={{
                      background: favorited ? 'rgba(239,68,68,0.08)' : '#F2EDE5',
                      border: '1.5px solid',
                      borderColor: favorited ? 'rgba(239,68,68,0.3)' : '#E8E2D8',
                      color: favorited ? '#ef4444' : '#7A7268',
                    }}>
                    <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Tags */}
                {(item.genres || item.tags || item.categories) && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {(item.genres || item.tags || item.categories || []).map((g, i) => (
                      <span key={`${g}-${i}`} className="tag">{g}</span>
                    ))}
                  </div>
                )}

                {/* Description */}
                {item.description && (
                  <p className="text-ink-muted text-sm leading-relaxed mb-6">{item.description}</p>
                )}

                {/* Extra fields */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  {item.author    && <InfoField label="Author"    value={item.author} />}
                  {item.director  && <InfoField label="Director"  value={item.director} />}
                  {item.platform  && <InfoField label="Platform"  value={item.platform} />}
                  {item.cuisine   && <InfoField label="Cuisine"   value={item.cuisine} />}
                  {item.publisher && <InfoField label="Publisher" value={item.publisher} />}
                  {item.developer && <InfoField label="Developer" value={item.developer} />}
                  {item.pages     && <InfoField label="Pages"     value={`${item.pages} pages`} />}
                </div>

                {/* Ingredients */}
                {item.ingredients?.length > 0 && (
                  <div className="mb-6">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted mb-3">Ingredients</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {item.ingredients.slice(0, 12).map(({ ingredient, measure }, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-ink-muted">
                          <div className="w-1.5 h-1.5 rounded-full bg-sage-500 shrink-0" />
                          {measure && <span className="text-sage-500 font-medium">{measure}</span>}
                          <span>{ingredient}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pair With */}
                {TYPE_DEFAULTS[type] && <PairWith item={item} type={type} />}

                {/* My Notes */}
                {user && (
                  <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7A7268', marginBottom: 8, fontFamily: '"Inter", sans-serif' }}>
                      My Notes
                    </p>
                    <textarea
                      value={note}
                      onChange={e => handleNoteChange(e.target.value)}
                      placeholder="Add your thoughts, what you loved, or a personal rating…"
                      rows={3}
                      style={{
                        width: '100%', padding: '10px 13px',
                        borderRadius: 10, border: '1.5px solid rgba(28,26,24,0.1)',
                        background: '#F8F5F1', color: '#1C1A18', fontSize: 13,
                        fontFamily: '"Inter", sans-serif', resize: 'vertical',
                        outline: 'none', lineHeight: 1.6, boxSizing: 'border-box',
                        transition: 'border-color 0.18s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#C49A6C'}
                      onBlur={e => e.target.style.borderColor = 'rgba(28,26,24,0.1)'}
                    />
                    {note.trim() && (
                      <p style={{ fontSize: 10, color: '#B0A898', marginTop: 5, fontFamily: '"Inter", sans-serif' }}>
                        Saved automatically
                      </p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {item.trailerUrl && (
                    <a href={item.trailerUrl} target="_blank" rel="noopener noreferrer"
                      className="btn-primary flex items-center gap-2 text-sm">
                      <Play className="w-3.5 h-3.5" /> Watch Trailer
                    </a>
                  )}
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all"
                      style={{ background: '#F2EDE5', color: '#3A3630', border: '1.5px solid #D4CCBC' }}>
                      <ExternalLink className="w-3.5 h-3.5" /> Open
                    </a>
                  )}
                  {item.youtube && (
                    <a href={item.youtube} target="_blank" rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all"
                      style={{ background: '#F2EDE5', color: '#3A3630', border: '1.5px solid #D4CCBC' }}>
                      <Play className="w-3.5 h-3.5" /> Watch Recipe
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">{label}</p>
      <p className="text-sm text-ink mt-0.5 font-medium">{value}</p>
    </div>
  )
}
