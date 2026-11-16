import { useEffect, useState } from 'react'
import { useElementWidth } from '../../hooks/useElementWidth'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { ChartLevelLegend } from '../ChartLevelLegend'
import { CHART_TEXT, LEVEL_TRACKING, levelGutter, monoWidth } from '../chartText'
import type { ChartLevel } from '../chartText'
import { StatusPill } from '../StatusPill'
import { STATUS_COLOR } from '../status'
import type { StatusKind } from '../status'

type Point = { y: number; v: number; label: string; axis: string; status: string; kind: StatusKind }

const VITAMIN_D: Point[] = [
  { y: 186, v: 18, label: 'Feb 2025', axis: 'Feb 25', status: 'Below range', kind: 'alert' },
  { y: 170, v: 22, label: 'Jun 2025', axis: 'Jun 25', status: 'Below range', kind: 'alert' },
  { y: 150, v: 27, label: 'Oct 2025', axis: 'Oct 25', status: 'Below range', kind: 'alert' },
  { y: 128, v: 33, label: 'Feb 2026', axis: 'Feb 26', status: 'Below range', kind: 'alert' },
  { y: 38, v: 64, label: 'Jun 2026', axis: 'Jun 26', status: 'Above range', kind: 'warn' },
  { y: 96, v: 41, label: 'Oct 2026', axis: 'Oct 26', status: 'In range', kind: 'ok' },
]

/**
 * The chart's levels, measured against the optimal range (design system v1.3):
 * ochre above, green optimal, oxblood below. Each has at least one reading.
 */
const LEVELS: ChartLevel[] = [
  {
    name: 'Above range',
    top: 22,
    bottom: 60,
    fill: 'color-mix(in srgb, var(--warn) 10%, transparent)',
    edge: 'var(--warn)',
  },
  { name: 'Optimal', top: 60, bottom: 116, fill: 'var(--range-optimal)', edge: 'var(--ok)' },
  {
    name: 'Below range',
    top: 116,
    bottom: 196,
    fill: 'color-mix(in srgb, var(--alert) 9%, transparent)',
    edge: 'var(--alert)',
  },
]

/** Chart height in px. The width is whatever the panel gives it. */
const HEIGHT = 240
const PAD_RIGHT = 22
const AXIS_W = Math.max(...VITAMIN_D.map((p) => monoWidth(p.axis, CHART_TEXT.axis)))
const GUTTER = levelGutter(LEVELS.map((l) => l.name))

/**
 * Horizontal layout for a given width. The chart draws one viewBox unit per
 * CSS pixel, so text is always shown at CHART_TEXT sizes. When the readings
 * would be too cramped beside the in-chart level labels, the labels move to a
 * legend above the chart and the readings use the full width.
 */
function layout(width: number) {
  const n = VITAMIN_D.length
  const roomy = (width - GUTTER - PAD_RIGHT) / (n - 1) >= AXIS_W + 12
  const x0 = roomy ? GUTTER : 24
  const dx = (width - PAD_RIGHT - x0) / (n - 1)
  return {
    inlineLevels: roomy,
    x0,
    dx,
    dot: roomy ? 5 : 4.5,
  }
}

/**
 * Which date labels to show. When they all fit, all of them. Otherwise the
 * current one always shows, then the first, the last and the rest are added
 * only where they keep a clear gap from every label already shown.
 */
function visibleAxisLabels(step: number, dx: number) {
  const n = VITAMIN_D.length
  const minGap = AXIS_W + 8
  if (dx >= minGap) return new Set(VITAMIN_D.map((_, i) => i))
  const shown = new Set([step])
  const candidates = [0, n - 1, ...VITAMIN_D.map((_, i) => i).filter((i) => i !== 0 && i !== n - 1)]
  for (const i of candidates) {
    if ([...shown].every((j) => Math.abs(i - j) * dx >= minGap)) shown.add(i)
  }
  return shown
}

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
  const [boxRef, width] = useElementWidth<HTMLDivElement>(1000)
  const geo = layout(width)
  const axisLabels = visibleAxisLabels(step, geo.dx)
  const xAt = (i: number) => geo.x0 + i * geo.dx
  const active = VITAMIN_D[step]
  const activeX = xAt(step)
  const linePoints = VITAMIN_D.slice(0, step + 1)
    .map((p, i) => `${xAt(i)},${p.y}`)
    .join(' ')

  return (
    <section className="container feature-section">
      <div className="trends-intro">
        <p className="eyebrow">Trends over time</p>
        <h2 className="section-title">
          See how your body changes, <em>year after year.</em>
        </h2>
        <p className="section-lede">
          A single test is a snapshot. Biomarkhq keeps every result in one timeline, so you can spot slow shifts early
          and see whether the changes you've made are working.
        </p>
      </div>

      <div className="panel">
        <div className="panel__head">
          <h3 className="card-title">Vitamin D, 25-OH</h3>
        </div>

        <div className="trend-body">
          <div className="trend-readout" aria-live="polite">
            <span className="mono trend-readout__value">
              {active.v}
              <span className="unit">{'\u202F'}ng/mL</span>
            </span>
            <StatusPill kind={active.kind}>{active.status}</StatusPill>
          </div>

          <div ref={boxRef}>
            {!geo.inlineLevels && <ChartLevelLegend levels={LEVELS} />}
            <svg
              className="chart trend-chart"
              viewBox={`0 0 ${width} ${HEIGHT}`}
              role="img"
              aria-label="Vitamin D from 18 to 41 ng/mL across six tests four months apart, from February 2025 to October 2026: four readings below the optimal range, one above it at 64, then 41, inside it, each test highlighted in turn"
            >
              {LEVELS.map((l) => (
                <g key={l.name}>
                  <rect x="0" y={l.top} width={width} height={l.bottom - l.top} fill={l.fill} />
                  <rect x="0" y={l.top} width="4" height={l.bottom - l.top} fill={l.edge} />
                  {geo.inlineLevels && (
                    <text
                      x="14"
                      y={(l.top + l.bottom) / 2 + CHART_TEXT.level * 0.36}
                      fontFamily="Geist Mono, monospace"
                      fontSize={CHART_TEXT.level}
                      letterSpacing={LEVEL_TRACKING}
                      fill={l.edge}
                    >
                      {l.name}
                    </text>
                  )}
                </g>
              ))}
              <line x1="0" y1="200" x2={width} y2="200" stroke="rgba(60,48,36,.18)" />
              <text
                x={width}
                y="14"
                textAnchor="end"
                fontFamily="Geist Mono, monospace"
                fontSize={CHART_TEXT.unit}
                fill="var(--dim)"
              >
                ng/mL
              </text>
              <line
                className="vd-anim"
                x1={activeX}
                y1="20"
                x2={activeX}
                y2="200"
                stroke="rgba(60,48,36,.28)"
                strokeWidth="1.5"
                strokeDasharray="3 4"
              />
              <polyline
                points={linePoints}
                fill="none"
                stroke="var(--muted)"
                strokeOpacity=".7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {VITAMIN_D.map((p, i) => {
                const shown = i <= step
                const on = i === step
                const color = STATUS_COLOR[p.kind]
                return (
                  <g key={p.label}>
                    {/* Every reading is the same solid dot; only the highlighted one adds a 2px ring. */}
                    <circle
                      className="vd-anim"
                      cx={xAt(i)}
                      cy={p.y}
                      r={shown && on ? geo.dot + 3 : 0}
                      fill="none"
                      stroke={color}
                      strokeWidth="2"
                    />
                    <circle
                      className="vd-anim"
                      cx={xAt(i)}
                      cy={p.y}
                      r={shown ? geo.dot : 0}
                      fill={color}
                    />
                    {shown && (
                      <text
                        x={xAt(i)}
                        y={p.y - (on ? geo.dot + 10 : geo.dot + 8)}
                        textAnchor="middle"
                        fontFamily="Geist Mono, monospace"
                        fontSize={CHART_TEXT.value}
                        fontWeight={on ? 600 : 400}
                        fill={color}
                      >
                        {p.v}
                      </text>
                    )}
                  </g>
                )
              })}
              <g fontFamily="Geist Mono, monospace" fontSize={CHART_TEXT.axis}>
                {VITAMIN_D.map((p, i) =>
                  axisLabels.has(i) ? (
                    <text
                      key={p.label}
                      x={xAt(i)}
                      y="222"
                      textAnchor="middle"
                      fill={i === step ? 'var(--ink)' : 'var(--dim)'}
                      fontWeight={i === step ? 600 : 400}
                    >
                      {p.axis}
                    </text>
                  ) : null,
                )}
              </g>
            </svg>
          </div>
        </div>

        <p className="label trend-foot">YOUR RESULTS, KEPT FOR LIFE, IN ONE PLACE.</p>
      </div>
    </section>
  )
}
