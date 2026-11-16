import { RangeStrip } from '../RangeStrip'
import { StatusPill } from '../StatusPill'
import type { StatusKind } from '../status'

type Marker = {
  name: string
  group: string
  value: string
  unit: string
  /** Optimal range along the strip, as start and end percentages. */
  optimal: [number, number]
  /** This result's position along the strip, as a percentage. */
  position: number
  status: StatusKind
  statusLabel: string
}

const MARKERS: Marker[] = [
  {
    name: 'Ferritin',
    group: 'Iron',
    value: '18',
    unit: 'ng/mL',
    optimal: [17, 50],
    position: 6,
    status: 'alert',
    statusLabel: 'Below range',
  },
  {
    name: 'Apolipoprotein B',
    group: 'Heart',
    value: '104',
    unit: 'mg/dL',
    optimal: [0, 56],
    position: 65,
    status: 'warn',
    statusLabel: 'Above range',
  },
  {
    name: 'HbA1c',
    group: 'Metabolic',
    value: '5.1',
    unit: '%',
    optimal: [32, 46],
    position: 42,
    status: 'ok',
    statusLabel: 'In range',
  },
  {
    name: 'Vitamin D',
    group: 'Nutrient',
    value: '41',
    unit: 'ng/mL',
    optimal: [40, 60],
    position: 47,
    status: 'ok',
    statusLabel: 'In range',
  },
]

function MarkerRow({ m }: { m: Marker }) {
  return (
    <div className="mrow">
      <div className="mrow__id">
        <p className="mrow__name">{m.name}</p>
        <p className="label mrow__group">{m.group}</p>
      </div>
      <p className="mono mrow__value">
        {m.value}
        <span className="unit">
          {'\u202F'}
          {m.unit}
        </span>
      </p>
      <div className="mrow__range">
        <RangeStrip optimal={m.optimal} position={m.position} status={m.status} />
      </div>
      <div className="mrow__status">
        <StatusPill kind={m.status}>{m.statusLabel}</StatusPill>
      </div>
    </div>
  )
}

export function Dashboard() {
  return (
    <section id="features" className="container feature-section feature-section--first">
      <div className="row">
        <div className="col-text">
          <p className="eyebrow">BIOMARKER DASHBOARD</p>
          <h2 className="section-title">
            100+ biomarkers. <em>One clear view.</em>
          </h2>
          <p className="section-lede feature-lede feature-lede--cta">
            See every marker at a glance: what's in range, what's drifting, and what deserves your attention first. No
            medical jargon, no endless PDFs. Just a calm, organised picture of how your body is doing.
          </p>
          <a className="btn" href="#waitlist">
            Join the waitlist
          </a>
        </div>

        <div className="col-vis">
          <div className="marker-table">
            <div className="mrow mrow--head">
              <span className="mrow__id">MARKER</span>
              <span className="mrow__value">LATEST</span>
              <span className="mrow__range">RANGE</span>
              <span className="mrow__status">STATUS</span>
            </div>
            {MARKERS.map((m) => (
              <MarkerRow key={m.name} m={m} />
            ))}
            <div className="marker-table__foot">
              <span className="label">4 OF 112 MARKERS</span>
              <span className="marker-table__more">View all →</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
