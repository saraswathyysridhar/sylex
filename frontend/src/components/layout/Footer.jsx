import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'

const LINKS = [
  { to: '/movies', label: 'Movies' }, { to: '/recipes', label: 'Recipes' },
  { to: '/games', label: 'Games' },   { to: '/books', label: 'Books' },
  { to: '/music', label: 'Music' },   { to: '/activities', label: 'Activities' },
  { to: '/drinks', label: 'Drinks' }, { to: '/collections', label: 'Collections' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#EDE8E0', borderTop: '1px solid #D4CCBC' }} className="mt-24">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(77,122,82,0.1)', border: '1.5px solid rgba(77,122,82,0.25)' }}>
                <Leaf className="w-4 h-4 text-sage-500" />
              </div>
              <span className="text-base font-bold tracking-[0.18em] text-ink">SYLEX</span>
            </div>
            <p className="text-ink-muted text-sm leading-relaxed max-w-xs">
              A visual discovery platform for movies, food, games, books, music and more — curated by mood.
            </p>
            <p className="text-ink-faint text-xs italic">Taste · Lifestyle · Warmth · Nature</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-5">Discover</h3>
            <ul className="grid grid-cols-2 gap-y-3">
              {LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-ink-muted hover:text-sage-500 text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-5">Powered by</h3>
            <ul className="space-y-2">
              {['TMDB — Movies', 'TheMealDB — Recipes', 'RAWG — Games', 'Google Books', 'YouTube — Music'].map(a => (
                <li key={a}><span className="text-ink-faint text-sm">{a}</span></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider mt-12 mb-8" />
        <div className="flex items-center justify-between">
          <p className="text-ink-faint text-xs">© 2025 Sylex. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
