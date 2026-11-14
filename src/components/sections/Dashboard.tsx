import { StatusPill } from '../StatusPill'
import { STATUS_COLOR } from '../status'
import type { StatusKind } from '../status'

type Band = { left: string; right: string }

type Marker = {
  name: string
  group: string
  value: string
  unit: string
  lab: Band
  optimal: Band
  position: string
  status: StatusKind
  statusLabel: string
}

const MARKERS: Marker[] = [
  {
    name: 'Ferritin',
    group: 'Iron',
    value: '18',
    unit: 'ng/mL',
    lab: { left: '10%', right: '17%' },
    optimal: { left: '17%', right: '50%' },
    position: '6%',
    status: 'alert',
    statusLabel: 'Below range',
  },
  {
    name: 'Apolipoprotein B',
    group: 'Heart',
    value: '104',
    unit: 'mg/dL',
    lab: { left: '0', right: '19%' },
    optimal: { left: '0', right: '44%' },
    position: '65%',
    status: 'warn',
    statusLabel: 'Above optimal',
  },
  {
    name: 'HbA1c',
    group: 'Metabolic',
    value: '5.1',
    unit: '%',
    lab: { left: '0', right: '46%' },
    optimal: { left: '32%', right: '54%' },
    position: '42%',
    status: 'ok',
    statusLabel: 'In range',
  },
  {
    name: 'Vitamin D',
    group: 'Nutrient',
    value: '41',
    unit: 'ng/mL',
    lab: { left: '30%', right: '0' },
    optimal: { left: '40%', right: '40%' },
    position: '47%',
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
        <span className="unit">{m.unit}</span>
      </p>
      <div className="mrow__range" aria-hidden="true">
        <div className="track">
          <div className="track__band track__band--lab" style={m.lab} />
          <div className="track__band track__band--optimal" style={m.optimal} />
        </div>
        <div className="mrow__marker" style={{ left: m.position, background: STATUS_COLOR[m.status] }} />
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
          <p className="eyebrow">Biomarker dashboard</p>
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
              <span className="mrow__id">Marker</span>
              <span className="mrow__value">Latest</span>
              <span className="mrow__range">Range</span>
              <span className="mrow__status">Status</span>
            </div>
            {MARKERS.map((m) => (
              <MarkerRow key={m.name} m={m} />
            ))}
            <div className="marker-table__foot">
              <span className="label">4 of 112 markers</span>
              <span className="marker-table__more">View all →</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
