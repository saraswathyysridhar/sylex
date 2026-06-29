import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react'

const FILTERS = {
  mood:    { label: 'Mood',    options: ['Cozy', 'Romantic', 'Energetic', 'Relaxed', 'Adventurous', 'Focused'], emoji: '🌙' },
  time:    { label: 'Time',    options: ['15 min', '30 min', '1 hr', '2 hrs', '3+ hrs'],                        emoji: '⏱' },
  company: { label: 'Company', options: ['Solo', 'Partner', 'Friends', 'Family'],                               emoji: '👥' },
  energy:  { label: 'Energy',  options: ['Low', 'Medium', 'High'],                                              emoji: '⚡' },
  weather: { label: 'Weather', options: ['Rainy', 'Sunny', 'Cloudy', 'Snowy'],                                  emoji: '🌧' },
}

export default function FilterBar({ onFilterChange, activeFilters = {} }) {
  const [expanded, setExpanded] = useState(false)
  const [local, setLocal]       = useState(activeFilters)

  const activeCount = Object.values(local).filter(Boolean).length

  const toggle = (key, value) => {
    const updated = { ...local, [key]: local[key] === value ? '' : value }
    setLocal(updated)
    onFilterChange?.(updated)
  }

  const clear = () => { setLocal({}); onFilterChange?.({}) }

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: '#fff', border: '1.5px solid #E8E2D8', boxShadow: '0 1px 6px rgba(28,26,24,0.06)' }}>

      <button onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-cream-100/50 transition-colors">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="w-4 h-4 text-sage-500" />
          <span className="text-sm font-medium text-ink-muted">Smart Filters</span>
          {activeCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white"
              style={{ background: '#4D7A52' }}>
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button onClick={e => { e.stopPropagation(); clear() }}
              className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink px-2 py-1 rounded-lg transition-colors">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-ink-muted transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6"
              style={{ borderTop: '1px solid #E8E2D8', paddingTop: '20px' }}>
              {Object.entries(FILTERS).map(([key, { label, options, emoji }]) => (
                <div key={key}>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
                    {emoji} {label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {options.map(opt => {
                      const isActive = local[key] === opt
                      return (
                        <button key={opt} onClick={() => toggle(key, opt)}
                          className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                          style={{
                            background: isActive ? '#4D7A52' : '#F2EDE5',
                            color: isActive ? '#fff' : '#7A7268',
                            border: '1.5px solid',
                            borderColor: isActive ? '#4D7A52' : '#E8E2D8',
                          }}>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
