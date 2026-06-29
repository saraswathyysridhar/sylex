const STREAKS = Array.from({ length: 22 }, (_, i) => ({
  id:    i,
  top:   `${(i * 4.72) % 100}%`,
  w:     28 + (i % 8) * 24,
  h:     i % 7 === 0 ? 2 : 1,
  dur:   3.2 + (i % 7) * 0.65,
  delay: -(i * 0.88),
  op:    0.06 + (i % 6) * 0.038,
}))

export default function PageStreaks({ color = '#4D7A52' }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {STREAKS.map(s => (
        <div key={s.id} style={{
          position:     'absolute',
          top:          s.top,
          left:         '-120px',
          width:        `${s.w}px`,
          height:       `${s.h}px`,
          borderRadius: '2px',
          background:   `linear-gradient(to right, transparent, ${color} 55%, ${color}50)`,
          boxShadow:    `0 0 ${s.h * 6}px ${s.h * 2}px ${color}55`,
          opacity:      s.op,
          animation:    `rushLeft ${s.dur}s linear ${s.delay}s infinite`,
          willChange:   'transform',
        }} />
      ))}
    </div>
  )
}
