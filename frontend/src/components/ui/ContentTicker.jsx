/**
 * ContentTicker — per-page card ticker. Each variant has a structurally
 * different layout, not just different card sizes.
 *
 * HORIZONTAL rows (cards scroll left / right):
 *   "cinema"   Movies  — wide 16:9 landscape, 3 rows
 *   "neon"     Games   — square neon-glow cards, 3 rows, fast
 *   "mosaic"   Recipes — tight square grid, 3 rows, middle row offset
 *   "board"    Activities — landscape cards, 2 rows, second row shorter
 *
 * VERTICAL columns (cards scroll up / down) — fundamentally different:
 *   "waterfall" Books  — 5 columns scrolling at different speeds
 *
 * DIAGONAL band (whole strip rotated):
 *   "diagonal"  Music  — 2-row ticker rotated ~5° so it cuts across the page
 *
 * ORIGINAL 2-row portrait:
 *   "album"    Music fallback, "standard" default
 */

/* ─────────────────────────────────────────────────────────────
   Horizontal variant config
───────────────────────────────────────────────────────────── */
const H_VARIANTS = {
  cinema:   { w: 248, h: 140, r: 8,  rows: 3, speeds: [22, 32, 26], gap: 10, padV: '20px' },
  neon:     { w: 140, h: 140, r: 4,  rows: 3, speeds: [11, 15,  9], gap: 8,  padV: '14px' },
  mosaic:   { w: 148, h: 148, r: 10, rows: 3, speeds: [14, 20, 12], gap: 10, padV: '18px' },
  board:    { w: 214, h: 143, r: 12, rows: 2, speeds: [21, 16],     gap: 12, padV: '22px' },
  album:    { w: 164, h: 164, r: 14, rows: 2, speeds: [20, 27],     gap: 14, padV: '26px' },
  standard: { w: 148, h: 222, r: 14, rows: 2, speeds: [22, 28],     gap: 14, padV: '28px' },
}

/* ─────────────────────────────────────────────────────────────
   Shared card renderer (horizontal variants)
───────────────────────────────────────────────────────────── */
function HCard({ item, variant, accentColor, w, h, r }) {
  const isNeon   = variant === 'neon'
  const isCinema = variant === 'cinema'

  let shadow = '0 4px 20px rgba(14,10,6,0.1)'
  if (isNeon) shadow = `0 0 14px ${accentColor}50, 0 0 3px ${accentColor}30, inset 0 0 0 1px ${accentColor}55`

  let grad = `linear-gradient(to top, rgba(4,3,2,0.86) 0%, rgba(4,3,2,0.18) 40%, transparent 65%)`
  if (isCinema) grad = `linear-gradient(to top, rgba(4,3,2,0.7) 0%, transparent 50%)`
  if (isNeon)   grad = `linear-gradient(to top, rgba(8,0,0,0.88) 0%, transparent 65%)`

  return (
    <div style={{ width: `${w}px`, height: `${h}px`, flexShrink: 0, borderRadius: `${r}px`, overflow: 'hidden', position: 'relative', boxShadow: shadow }}>
      <img src={item.image} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: grad }} />

      {/* neon top glow line */}
      {isNeon && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px', background: `linear-gradient(90deg, transparent, ${accentColor}BB, transparent)` }} />}

      {/* cinema sprocket notches */}
      {isCinema && <>
        <div style={{ position: 'absolute', top: 7,   left: -1, width: 6, height: 9, borderRadius: '0 4px 4px 0', background: 'rgba(0,0,0,0.4)' }} />
        <div style={{ position: 'absolute', bottom: 7, left: -1, width: 6, height: 9, borderRadius: '0 4px 4px 0', background: 'rgba(0,0,0,0.4)' }} />
        <div style={{ position: 'absolute', top: 7,   right: -1, width: 6, height: 9, borderRadius: '4px 0 0 4px', background: 'rgba(0,0,0,0.4)' }} />
        <div style={{ position: 'absolute', bottom: 7, right: -1, width: 6, height: 9, borderRadius: '4px 0 0 4px', background: 'rgba(0,0,0,0.4)' }} />
      </>}

      {/* text (not on cinema) */}
      {!isCinema && (item.title || item.label) && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '7px 9px 9px' }}>
          {item.title && variant !== 'mosaic' && (
            <p style={{
              fontFamily: isNeon ? '"Bebas Neue", sans-serif' : '"Italiana", "Cormorant Garamond", serif',
              fontSize: '13px', color: isNeon ? accentColor : '#fff',
              lineHeight: 1.2, letterSpacing: isNeon ? '0.06em' : '0.01em',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{item.title}</p>
          )}
          {item.label && (
            <span style={{ display: 'inline-block', marginTop: item.title && variant !== 'mosaic' ? 3 : 0, fontSize: '9px', letterSpacing: '0.1em', fontWeight: 700, color: accentColor, textTransform: 'uppercase' }}>{item.label}</span>
          )}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   WATERFALL layout — vertical columns (Books)
   5 columns scrolling up/down at different speeds.
   Completely different from horizontal rows.
───────────────────────────────────────────────────────────── */
const WF_COL_CFG = [
  { speed: 26, dir: 'up'   },
  { speed: 20, dir: 'down' },
  { speed: 32, dir: 'up'   },
  { speed: 17, dir: 'down' },
  { speed: 24, dir: 'up'   },
]

function WaterfallCard({ item, accentColor }) {
  return (
    <div style={{ borderRadius: '8px', overflow: 'hidden', position: 'relative', flexShrink: 0, boxShadow: '-3px 0 10px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)' }}>
      <img src={item.image} alt="" loading="lazy" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,3,2,0.8) 0%, transparent 52%)' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '6px', background: 'linear-gradient(to right, rgba(0,0,0,0.28), transparent)' }} />
      {item.label && (
        <span style={{ position: 'absolute', bottom: 7, left: 8, fontSize: '9px', letterSpacing: '0.09em', fontWeight: 700, color: accentColor, textTransform: 'uppercase' }}>{item.label}</span>
      )}
    </div>
  )
}

function WaterfallLayout({ items, bg, accentColor }) {
  const double = [...items, ...items]
  return (
    <div style={{ position: 'relative', overflow: 'hidden', padding: '24px 0' }}>
      {/* top / bottom fades */}
      <div style={{ position: 'absolute', inset: 0, top: 0, height: '70px', background: `linear-gradient(to bottom, ${bg}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, top: 'auto', bottom: 0, height: '70px', background: `linear-gradient(to top, ${bg}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />
      {/* left / right fades */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '60px', background: `linear-gradient(to right, ${bg}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '60px', background: `linear-gradient(to left, ${bg}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', gap: '12px', height: '340px', padding: '0 24px' }}>
        {WF_COL_CFG.map((col, ci) => (
          <div key={ci} style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '10px',
              animation: `wf${col.dir === 'up' ? 'Up' : 'Down'} ${col.speed}s linear infinite`,
            }}>
              {double.map((item, j) => <WaterfallCard key={`wf${ci}-${j}`} item={item} accentColor={accentColor} />)}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes wfUp   { from { transform: translateY(0);    } to { transform: translateY(-50%); } }
        @keyframes wfDown { from { transform: translateY(-50%); } to { transform: translateY(0);    } }
      `}</style>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   DIAGONAL layout — 2-row ticker rotated ~5° (Music)
   The strip cuts diagonally across the section. Hides
   beyond edges via overflow:hidden + expanded inner bounds.
───────────────────────────────────────────────────────────── */
function DiagonalLayout({ items, bg, accentColor }) {
  const triple = [...items, ...items, ...items]
  const V = H_VARIANTS.album // square cards look best at a diagonal

  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: '280px', userSelect: 'none' }}>
      {/* rotated inner band — extends beyond edges to fill width after rotation */}
      <div style={{
        position: 'absolute',
        top: -36, bottom: -36, left: -80, right: -80,
        transform: 'rotate(-5deg)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '14px',
        overflow: 'hidden',
      }}>
        {[{ speed: 18, dir: 'ctLeft' }, { speed: 24, dir: 'ctRight' }].map(({ speed, dir }, ri) => (
          <div key={ri} style={{ overflow: 'hidden' }}>
            <div className="flex" style={{ gap: `${V.gap}px`, width: 'max-content', animation: `${dir} ${speed}s linear infinite` }}>
              {triple.map((item, j) => (
                <HCard key={`d${ri}-${j}`} item={item} variant="album" accentColor={accentColor} w={V.w} h={V.h} r={V.r} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* edge fades — same bg, sharp near edges */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '90px', background: `linear-gradient(to right, ${bg} 40%, transparent 100%)`, zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '90px', background: `linear-gradient(to left, ${bg} 40%, transparent 100%)`, zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40px', background: `linear-gradient(to bottom, ${bg}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: `linear-gradient(to top, ${bg}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />

      <style>{`
        @keyframes ctLeft  { from { transform: translateX(0);          } to { transform: translateX(-33.3334%); } }
        @keyframes ctRight { from { transform: translateX(-33.3334%);  } to { transform: translateX(0);         } }
      `}</style>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Main export
───────────────────────────────────────────────────────────── */
export default function ContentTicker({ items, bg = '#F7F3EE', accentColor = '#C49A6C', variant = 'standard' }) {
  /* structural variants get their own renderer */
  if (variant === 'waterfall') return <WaterfallLayout items={items} bg={bg} accentColor={accentColor} />
  if (variant === 'diagonal')  return <DiagonalLayout  items={items} bg={bg} accentColor={accentColor} />

  /* all horizontal variants */
  const V = H_VARIANTS[variant] || H_VARIANTS.standard
  const triple = [...items, ...items, ...items]

  return (
    <div style={{ overflow: 'hidden', position: 'relative', padding: `${V.padV} 0`, userSelect: 'none' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '110px', background: `linear-gradient(to right, ${bg} 20%, transparent 100%)`, zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '110px', background: `linear-gradient(to left, ${bg} 20%, transparent 100%)`, zIndex: 2, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: `${V.gap}px` }}>
        {V.speeds.map((speed, ri) => {
          const anim = ri % 2 === 0 ? `ctLeft ${speed}s linear infinite` : `ctRight ${speed}s linear infinite`
          const h = variant === 'board' && ri === 1 ? 120
                  : variant === 'mosaic' && ri === 1 ? 162
                  : V.h
          return (
            <div key={ri} style={{ overflow: 'hidden', marginLeft: ri === 1 && variant === 'mosaic' ? '12px' : 0 }}>
              <div className="flex" style={{ gap: `${V.gap}px`, width: 'max-content', animation: anim }}>
                {triple.map((item, j) => (
                  <HCard key={`r${ri}-${j}`} item={item} variant={variant} accentColor={accentColor} w={V.w} h={h} r={V.r} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes ctLeft  { from { transform: translateX(0);          } to { transform: translateX(-33.3334%); } }
        @keyframes ctRight { from { transform: translateX(-33.3334%); } to { transform: translateX(0);          } }
      `}</style>
    </div>
  )
}
