// Particle positions computed once at module load — stable across renders
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id:       i,
  left:     `${(i * 3.71 + 4) % 93}%`,
  bottom:   `${(i * 6.13 % 34) + 1}%`,
  size:     1.5 + (i % 5) * 0.55,
  dur:      10 + (i % 11) * 1.7,
  delay:    -(i * 1.13),
  dx:       -44 + (i * 19 % 88),
  colorIdx: i % 3,
}))

export default function AmbientBg({ color1 = '#4D7A52', color2 = '#8B5E3C', color3 = '#5A9FBF' }) {
  const colors = [color1, color2, color3]

  return (
    <>
      {/* Aurora mesh — large shifting gradient layer */}
      <div className="ambient-aurora" style={{
        background: `
          radial-gradient(ellipse 75% 55% at 12% 22%, ${color1}1E 0%, transparent 58%),
          radial-gradient(ellipse 65% 75% at 88% 78%, ${color2}18 0%, transparent 52%),
          radial-gradient(ellipse 85% 65% at 50% 48%, ${color3}12 0%, transparent 62%)
        `,
      }} />

      {/* Primary orbs — large, slow, soft */}
      <div className="ambient-orb ambient-orb-1"
        style={{ width: '860px', height: '860px', background: color1, top: '-5%', left: '-14%' }} />
      <div className="ambient-orb ambient-orb-2"
        style={{ width: '740px', height: '740px', background: color2, top: '30%', right: '-12%' }} />
      <div className="ambient-orb ambient-orb-3"
        style={{ width: '580px', height: '580px', background: color3, bottom: '-5%', left: '22%' }} />

      {/* Secondary accent orbs */}
      <div className="ambient-orb ambient-orb-4"
        style={{ width: '440px', height: '440px', background: color1, top: '60%', left: '-4%', opacity: 0.07 }} />
      <div className="ambient-orb ambient-orb-5"
        style={{ width: '380px', height: '380px', background: color3, top: '8%', right: '18%', opacity: 0.08 }} />

      {/* Floating particles */}
      {PARTICLES.map(p => (
        <div
          key={p.id}
          className="ambient-particle"
          style={{
            left:                p.left,
            bottom:              p.bottom,
            width:               `${p.size}px`,
            height:              `${p.size}px`,
            background:          colors[p.colorIdx],
            opacity:             0.28 + (p.id % 5) * 0.09,
            animationDuration:   `${p.dur}s`,
            animationDelay:      `${p.delay}s`,
            '--pdx':             `${p.dx}px`,
          }}
        />
      ))}
    </>
  )
}
