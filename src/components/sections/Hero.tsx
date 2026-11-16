import heroImg from '../../assets/images/hero.jpg'
import { useElementWidth } from '../../hooks/useElementWidth'
import { CHART_TEXT, monoWidth } from '../chartText'
import type { ChartLevel } from '../chartText'
import { StatusPill } from '../StatusPill'
import { WaitlistForm } from '../WaitlistForm'

/**
 * Ferritin readings four months apart, rising into the optimal range. Heights
 * are in px; the optimal level starts at 50 ng/mL (y = 66). Horizontal
 * positions come from the card's actual width.
 */
const FERRITIN_POINTS = [
  { y: 107, v: 18, label: 'Feb 26' },
  { y: 87.8, v: 33, label: 'Jun 26' },
  { y: 58.3, v: 56, label: 'Oct 26' },
]
const OPTIMAL_FLOOR_Y = 66

/**
 * Levels per design system v1.3: only those a reading falls in are drawn.
 * Marked by fill and a coloured left edge only; no text labels in this card.
 */
const FERRITIN_LEVELS: ChartLevel[] = [
  { name: 'Optimal', top: 18, bottom: OPTIMAL_FLOOR_Y, fill: 'var(--range-optimal)', edge: 'var(--ok)' },
  {
    name: 'Below range',
    top: OPTIMAL_FLOOR_Y,
    bottom: 124,
    fill: 'color-mix(in srgb, var(--alert) 9%, transparent)',
    edge: 'var(--alert)',
  },
]

const HEIGHT = 162
const DOT = 4.5
const BASELINE = 130
const AXIS_W = Math.max(...FERRITIN_POINTS.map((p) => monoWidth(p.label, CHART_TEXT.axis)))
/** Room at each end for the first and last date labels, centred on their readings. */
const PAD_LEFT = Math.ceil(AXIS_W / 2) + 12
const PAD_RIGHT = Math.ceil(AXIS_W / 2) + 2

function FerritinCard() {
  const last = FERRITIN_POINTS.length - 1
  const [boxRef, width] = useElementWidth<HTMLDivElement>(340)
  const dx = (width - PAD_LEFT - PAD_RIGHT) / (FERRITIN_POINTS.length - 1)
  const xAt = (i: number) => PAD_LEFT + i * dx
  return (
    <div className="glass hero-card">
      <div className="hero-card__head">
        <div>
          <h3 className="card-title">Ferritin</h3>
          <p className="label" style={{ letterSpacing: '1.2px', marginTop: 4 }}>
            3 RESULTS · 8 MONTHS
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p className="mono hero-card__value">
            56<span className="unit">{'\u202F'}ng/mL</span>
          </p>
          <div style={{ marginTop: 8 }}>
            <StatusPill kind="ok">In range</StatusPill>
          </div>
        </div>
      </div>

      <div ref={boxRef}>
        <svg
          className="chart"
          viewBox={`0 0 ${width} ${HEIGHT}`}
          role="img"
          aria-label="Ferritin trending up over three tests four months apart: 18 and 33 ng/mL below the optimal range, then 56, inside it"
        >
          {FERRITIN_LEVELS.map((l) => (
            <g key={l.name}>
              <rect x="0" y={l.top} width={width} height={l.bottom - l.top} fill={l.fill} />
              <rect x="0" y={l.top} width="4" height={l.bottom - l.top} fill={l.edge} />
            </g>
          ))}
          <line x1="0" y1={BASELINE} x2={width} y2={BASELINE} stroke="rgba(60,48,36,.18)" />
          <text
            x={width}
            y="12"
            textAnchor="end"
            fontFamily="Geist Mono, monospace"
            fontSize={CHART_TEXT.unit}
            fill="var(--dim)"
          >
            ng/mL
          </text>
          <polyline
            points={FERRITIN_POINTS.map((p, i) => `${xAt(i)},${p.y}`).join(' ')}
            fill="none"
            stroke="var(--muted)"
            strokeOpacity=".7"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {FERRITIN_POINTS.map((p, i) => {
            const inRange = p.y <= OPTIMAL_FLOOR_Y
            const color = inRange ? 'var(--ok)' : 'var(--alert)'
            return (
              <g key={p.label}>
                {/* Every reading is the same solid dot; only the latest adds a 2px ring. */}
                {i === last && <circle cx={xAt(i)} cy={p.y} r={DOT + 3} fill="none" stroke={color} strokeWidth="2" />}
                <circle cx={xAt(i)} cy={p.y} r={DOT} fill={color} />
                <text
                  x={xAt(i)}
                  y={p.y - (i === last ? DOT + 10 : DOT + 7)}
                  textAnchor="middle"
                  fontFamily="Geist Mono, monospace"
                  fontSize={CHART_TEXT.value}
                  fontWeight={i === last ? 600 : 400}
                  fill={color}
                >
                  {p.v}
                </text>
              </g>
            )
          })}
          <g fontFamily="Geist Mono, monospace" fontSize={CHART_TEXT.axis} fill="var(--dim)">
            {FERRITIN_POINTS.map((p, i) => (
              <text key={p.label} x={xAt(i)} y={BASELINE + 22} textAnchor="middle">
                {p.label}
              </text>
            ))}
          </g>
        </svg>
      </div>

      <div className="hero-card__chips">
        <span className="chip">BLOOD RESULTS</span>
        <span className="chip">SLEEP AVG· 6.4h</span>
        <span className="chip">TRAINING LOAD ↑ 32%</span>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="hero">
      <img
        className="hero__photo"
        src={heroImg}
        alt="A woman in a linen shirt stands on a dry grass ridge at sunset, looking out over hazy hills."
        fetchPriority="high"
      />
      <div className="hero__wash" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow">EARLY ACCESS OPENING SOON</p>
          <h1 className="hero__title">
            Your health, read as <em>one story.</em>
          </h1>
          <p className="hero__lede">
            Biomarkhq brings your blood results, wearable data and training together, tracks 100+ biomarkers over
            time, and tells you what actually matters.
          </p>
          <WaitlistForm note="Early access is opening soon." />
        </div>

        <div className="hero__card-wrap">
          <FerritinCard />
        </div>
      </div>
    </section>
  )
}
