import { motion } from 'framer-motion'

export default function PageHeader({ emoji, title, description, accent, children }) {
  return (
    <div className="relative pt-28 pb-12 px-5 sm:px-8 max-w-7xl mx-auto overflow-hidden">

      {/* Subtle glow behind title */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-64 pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${accent || 'rgba(90,140,90,0.08)'} 0%, transparent 70%)` }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            {emoji && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl mb-4"
              >
                {emoji}
              </motion.div>
            )}

            <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight leading-tight text-cream">
              {title}
            </h1>

            {description && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-3 text-cream/35 max-w-xl leading-relaxed"
              >
                {description}
              </motion.p>
            )}
          </div>

          {children && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="shrink-0"
            >
              {children}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
