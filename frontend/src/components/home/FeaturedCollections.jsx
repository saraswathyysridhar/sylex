import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import collectionsData from '../../data/collections.json'

export default function FeaturedCollections() {
  return (
    <section className="py-16" style={{ background: '#EDE8E0' }}>
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="section-label mb-2"><Sparkles className="w-3.5 h-3.5" /> Curated Experiences</p>
            <h2 className="font-display font-semibold text-ink leading-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', letterSpacing: '-0.02em' }}>
              Featured Collections
            </h2>
            <p className="text-ink-muted mt-2 text-base">Perfect bundles for every mood and occasion</p>
          </div>
          <Link to="/collections"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-sage-500 hover:text-sage-600 group transition-colors">
            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-4 h-[520px] lg:h-[440px]">

          {/* Large card — col 1-2, row 1-2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="col-span-2 row-span-2"
          >
            <CollectionCard collection={collectionsData[0]} large />
          </motion.div>

          {/* Top right */}
          {[1, 2, 3, 4].map((i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <CollectionCard collection={collectionsData[i]} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CollectionCard({ collection, large = false }) {
  const [hov, setHov] = useState(false)
  return (
    <Link to="/collections"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="block relative rounded-3xl overflow-hidden h-full cursor-pointer"
      style={{ boxShadow: hov ? '0 20px 60px rgba(28,26,24,0.18)' : '0 4px 20px rgba(28,26,24,0.1)', transition: 'box-shadow 0.3s' }}
    >
      <img
        src={collection.image}
        alt={collection.title}
        className="w-full h-full object-cover transition-transform duration-700"
        style={{ transform: hov ? 'scale(1.06)' : 'scale(1)' }}
      />
      {/* Tint */}
      <div className={`absolute inset-0 bg-gradient-to-br ${collection.color} opacity-60`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Hover sage glow */}
      <div className="absolute inset-0 transition-opacity duration-300"
        style={{ background: 'radial-gradient(ellipse at 20% 80%, rgba(77,122,82,0.2), transparent 60%)', opacity: hov ? 1 : 0 }} />

      <div className={`absolute inset-0 flex flex-col justify-between ${large ? 'p-7' : 'p-5'}`}>
        <div className="flex items-start justify-between">
          <span className={large ? 'text-5xl' : 'text-3xl'}>{collection.emoji}</span>
          <div className="flex gap-1.5">
            {collection.tags.slice(0, large ? 2 : 1).map(t => (
              <span key={t} className="px-2.5 py-1 rounded-full text-[10px] font-semibold text-white/80"
                style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className={`font-bold text-white ${large ? 'text-2xl mb-1.5' : 'text-base mb-1'}`}>
            {collection.title}
          </h3>
          {large && <p className="text-white/55 text-sm mb-4">{collection.description}</p>}
          <div className="flex flex-wrap gap-1.5">
            {collection.items.slice(0, large ? 3 : 2).map(item => (
              <span key={item.title}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs text-white/70"
                style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(6px)' }}>
                {item.emoji} {item.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
