import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { StatusPill } from '../StatusPill'
import { STATUS_COLOR } from '../status'
import type { StatusKind } from '../status'

type Point = { x: number; y: number; v: number; label: string; axis: string; status: string; kind: StatusKind }

const VITAMIN_D: Point[] = [
  { x: 90, y: 186, v: 18, label: '2022', axis: '2022', status: 'Below range', kind: 'alert' },
  { x: 270, y: 170, v: 22, label: '2023', axis: '2023', status: 'Below optimal', kind: 'warn' },
  { x: 450, y: 150, v: 27, label: 'Early 2024', axis: 'Early 24', status: 'Below optimal', kind: 'warn' },
  { x: 630, y: 128, v: 33, label: 'Late 2024', axis: 'Late 24', status: 'Below optimal', kind: 'warn' },
  { x: 810, y: 104, v: 39, label: '2025', axis: '2025', status: 'In optimal range', kind: 'ok' },
  { x: 990, y: 96, v: 41, label: '2026', axis: '2026', status: 'In optimal range', kind: 'ok' },
]

const STEP_MS = 1400
/** Six steps, then hold on the last point for two extra beats before restarting. */
const CYCLE = VITAMIN_D.length + 2

function useTrendStep() {
  const reduceMotion = usePrefersReducedMotion()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (reduceMotion) return
    const id = setInterval(() => setTick((t) => (t + 1) % CYCLE), STEP_MS)
    return () => clearInterval(id)
  }, [reduceMotion])

  return reduceMotion ? VITAMIN_D.length - 1 : Math.min(tick, VITAMIN_D.length - 1)
}

export function Trends() {
  const step = useTrendStep()
  const active = VITAMIN_D[step]
  const linePoints = VITAMIN_D.slice(0, step + 1)
    .map((p) => `${p.x},${p.y}`)
    .join(' ')

  return (
    <section className="container feature-section">
      <div className="trends-intro">
        <p className="eyebrow">Trends over time</p>
        <h2 className="section-title">
          See how your body changes, <em>year after year.</em>
        </h2>
        <p className="section-lede">
          A single test is a snapshot. BiomarkHQ keeps every result in one timeline, so you can spot slow shifts early
          and see whether the changes you've made are working.
        </p>
      </div>

      <div className="panel">
        <div className="panel__head">
          <h3 className="card-title">Vitamin D, 25-OH</h3>
          <div className="legend">
            <span className="legend__item">
              <span className="legend__swatch" style={{ background: 'rgba(60,48,36,.10)' }} />
              Lab range
            </span>
            <span className="legend__item">
              <span className="legend__swatch" style={{ background: 'rgba(189,90,56,.24)' }} />
              Optimal
            </span>
          </div>
        </div>

        <div className="trend-scroll">
          <div className="trend-readout" aria-live="polite">
            <span className="mono trend-readout__year">{active.label}</span>
            <span className="mono trend-readout__value">
              {active.v}
              <span className="unit">ng/mL</span>
            </span>
            <StatusPill kind={active.kind}>{active.status}</StatusPill>
          </div>

          <svg
            className="chart trend-chart"
            viewBox="0 0 1060 240"
            role="img"
            aria-label="Animated sample chart: vitamin D rising from 18 to 41 ng/mL across six tests between 2022 and 2026, each test highlighted in turn"
          >
            <rect x="50" y="20" width="990" height="150" fill="var(--range-lab)" />
            <rect x="50" y="60" width="990" height="56" fill="var(--range-optimal)" />
            <line x1="50" y1="200" x2="1040" y2="200" stroke="rgba(60,48,36,.18)" />
            <line
              className="vd-anim"
              x1={active.x}
              y1="20"
              x2={active.x}
              y2="200"
              stroke="rgba(169,74,42,.35)"
              strokeWidth="1.5"
              strokeDasharray="3 4"
            />
            <polyline
              points={linePoints}
              fill="none"
              stroke="var(--ink)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {VITAMIN_D.map((p, i) => {
              const on = i === step
              return (
                <circle
                  key={p.label}
                  className="vd-anim"
                  cx={p.x}
                  cy={p.y}
                  r={i > step ? 0 : on ? 8 : 5}
                  fill={on ? STATUS_COLOR[p.kind] : 'var(--ink)'}
                  stroke="var(--surface)"
                  strokeWidth="2.5"
                />
              )
            })}
            <text
              className="vd-anim"
              x={active.x}
              y={active.y - 18}
              textAnchor="middle"
              fontFamily="Geist Mono, monospace"
              fontSize="14"
              fontWeight="600"
              fill="var(--ink)"
            >
              {active.v}
            </text>
            <g fontFamily="Geist Mono, monospace" fontSize="12">
              {VITAMIN_D.map((p, i) => (
                <text
                  key={p.label}
                  x={p.x}
                  y="228"
                  textAnchor="middle"
                  fill={i === step ? 'var(--ink)' : 'var(--muted)'}
                  fontWeight={i === step ? 700 : 400}
                >
                  {p.axis}
                </text>
              ))}
            </g>
          </svg>
        </div>

        <p className="label trend-foot">Sample data · Your results, kept for life, in one place</p>
      </div>
    </section>
  )
}
