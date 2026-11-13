import heroImg from '../../assets/images/hero.jpg'
import { StatusPill } from '../StatusPill'
import { WaitlistForm } from '../WaitlistForm'

const FERRITIN_POINTS = [
  { x: 70, y: 50.8, label: 'Mar 25' },
  { x: 210, y: 79.6, label: 'Sep 25' },
  { x: 350, y: 103.6, label: 'Mar 26' },
  { x: 490, y: 121.2, label: 'Oct 26' },
]

function FerritinCard() {
  const last = FERRITIN_POINTS.length - 1
  return (
    <div className="glass hero-card">
      <div className="hero-card__head">
        <div>
          <h3 className="card-title">Ferritin</h3>
          <p className="label" style={{ letterSpacing: '1.2px', marginTop: 4 }}>
            4 results · 2 years · Sample data
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p className="mono hero-card__value">
            18<span className="unit">ng/mL</span>
          </p>
          <div style={{ marginTop: 8 }}>
            <StatusPill kind="alert">Below range</StatusPill>
          </div>
        </div>
      </div>

      <svg
        className="chart"
        viewBox="0 0 520 190"
        role="img"
        aria-label="Sample chart: ferritin falling over four tests from 62 to 18 ng/mL"
      >
        <rect x="40" y="10" width="470" height="92" fill="var(--range-lab)" />
        <rect x="40" y="10" width="470" height="60" fill="var(--range-optimal)" />
        <line x1="40" y1="150" x2="510" y2="150" stroke="rgba(60,48,36,.18)" />
        <polyline
          points={FERRITIN_POINTS.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="var(--ink)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {FERRITIN_POINTS.map((p, i) =>
          i === last ? (
            <circle key={p.label} cx={p.x} cy={p.y} r="5.5" fill="var(--alert)" stroke="var(--surface)" strokeWidth="2.5" />
          ) : (
            <circle key={p.label} cx={p.x} cy={p.y} r="4.5" fill="var(--ink)" />
          ),
        )}
        <g fontFamily="Geist Mono, monospace" fontSize="11" fill="var(--muted)">
          {FERRITIN_POINTS.map((p) => (
            <text key={p.label} x={p.x} y="176" textAnchor="middle">
              {p.label}
            </text>
          ))}
        </g>
      </svg>

      <div className="hero-card__chips">
        <span className="chip">Blood results</span>
        <span className="chip">Sleep · 6.4h avg</span>
        <span className="chip">Training load ↑ 32%</span>
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
          <p className="eyebrow">Early access opening soon</p>
          <h1 className="hero__title">
            Your health, read as <em>one story.</em>
          </h1>
          <p className="hero__lede">
            BiomarkHQ brings your blood results, wearable data and training together, tracks 100+ biomarkers over
            time, and tells you what actually matters.
          </p>
          <WaitlistForm note="Early access is opening soon." />
        </div>

        <div className="hero__card-wrap">
          <FerritinCard />
        </div>
        <div className="hero__spacer" aria-hidden="true" />
      </div>
    </section>
  )
}
