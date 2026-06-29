import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function SectionHeader({ title, subtitle, emoji, viewAllLink, className = '' }) {
  return (
    <div className={`flex items-end justify-between mb-6 ${className}`}>
      <div>
        <h2 className="section-title flex items-center gap-2">
          {emoji && <span className="text-2xl">{emoji}</span>}
          {title}
        </h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="flex items-center gap-1.5 text-sm text-gold-400 hover:text-gold-300 font-medium transition-colors group"
        >
          View all
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}
