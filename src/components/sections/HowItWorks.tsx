import type { ReactNode } from 'react'
import uploadImg from '../../assets/images/step-upload.jpg'
import syncImg from '../../assets/images/step-sync.jpg'
import protocolImg from '../../assets/images/step-protocol.jpg'

type StepProps = {
  n: number
  title: string
  body: string
  visual: ReactNode
  plain?: boolean
}

function Step({ n, title, body, visual, plain = false }: StepProps) {
  return (
    <div className="step">
      <div className={plain ? 'shot shot--plain' : 'shot'}>
        {visual}
        <span className="snum" aria-hidden="true">
          {n}
        </span>
      </div>
      <div className="step__text">
        <h3 className="step__title">{title}</h3>
        <p className="step__body">{body}</p>
      </div>
    </div>
  )
}

function UploadVisual() {
  return (
    <>
      <img src={uploadImg} alt="Over the shoulder, a man photographs a printed lab report on a wooden kitchen table with his phone." loading="lazy" />
      <div className="glass report-toast">
        <span className="report-toast__icon">
          <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12l5 5 9-10" />
          </svg>
        </span>
        <span style={{ minWidth: 0 }}>
          <span className="report-toast__title">Report read</span>
          <span className="mono report-toast__meta">64 markers found · 14 Oct</span>
        </span>
      </div>
    </>
  )
}

const SOURCES = [
  { name: 'Strava', left: '23.6%', top: '35.6%' },
  { name: 'WHOOP', left: '60.5%', top: '31.5%' },
  { name: 'Apple Health', left: '80.5%', top: '46.7%' },
  { name: 'Fitbit', left: '11.5%', top: '64%' },
]

function SyncVisual() {
  return (
    <>
      <img src={syncImg} alt="A cyclist in muted kit stands beside her road bike on a quiet country lane at sunrise, looking off to the side." loading="lazy" />
      <svg viewBox="0 0 1536 1024" aria-hidden="true">
        {[180, 320, 470, 640].map((r) => (
          <circle key={r} className="ring" cx="770" cy="600" r={r} />
        ))}
      </svg>
      {SOURCES.map((s) => (
        <span key={s.name} className="orb-chip glass" style={{ left: s.left, top: s.top }}>
          {/* Placeholder until partner logos are added */}
          <span className="orb-chip__logo" aria-hidden="true" />
          {s.name}
        </span>
      ))}
      <span className="orb-chip glass" style={{ left: '77.6%', top: '81.5%' }}>
        <span className="orb-chip__logo orb-chip__logo--doc" aria-hidden="true">
          <svg width="62%" height="62%" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5" />
            <path d="M9 13h6" />
            <path d="M9 17h4" />
          </svg>
        </span>
        Lab reports
      </span>
    </>
  )
}

function Sparkline({ points, color }: { points: string; color: string }) {
  return (
    <svg className="week-row__spark" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function OneViewVisual() {
  return (
    <div className="week-card">
      <div className="week-card__head">
        <span className="week-card__title">Your week</span>
        <span className="mono week-card__tag">Sample data</span>
      </div>
      <div className="week-row">
        <span className="week-row__name">Ferritin</span>
        <span className="track">
          <span className="track__band" style={{ left: '17%', right: '50%', background: 'rgba(189,90,56,.24)' }} />
          <span className="track__tick" style={{ left: '5%', background: 'var(--alert)' }} />
        </span>
        <span className="mono week-row__value">18 ng/mL</span>
      </div>
      <div className="week-row">
        <span className="week-row__name">Sleep</span>
        <Sparkline points="0,12 17,9 33,14 50,8 67,11 83,6 100,9" color="var(--ink)" />
        <span className="mono week-row__value">6.4 h avg</span>
      </div>
      <div className="week-row">
        <span className="week-row__name">Training load</span>
        <Sparkline points="0,16 17,15 33,13 50,12 67,9 83,6 100,4" color="var(--warn)" />
        <span className="mono week-row__value">↑ 32%</span>
      </div>
    </div>
  )
}

const PROTOCOL = [
  ['Nutrition', 'Iron-rich lunch, 3× a week'],
  ['Sleep', 'Lights out by 10:30'],
  ['Training', 'Two easy rides a week'],
]

function ProtocolVisual() {
  return (
    <>
      <img src={protocolImg} alt="A woman in a linen shirt slices fruit for breakfast at a sunlit wooden kitchen counter." loading="lazy" />
      <div className="glass protocol-card">
        <span className="protocol-card__head">
          <span className="protocol-card__title">Your protocol</span>
          <span className="mono protocol-card__tag">Sample</span>
        </span>
        {PROTOCOL.map(([key, text]) => (
          <span key={key} className="protocol-card__row">
            <span className="mono protocol-card__key">{key}</span>
            {text}
          </span>
        ))}
      </div>
    </>
  )
}

export function HowItWorks() {
  return (
    <section id="how" className="how">
      <div className="container how__inner">
        <div className="section-intro">
          <p className="eyebrow">How it works</p>
          <h2 className="section-title">
            Everything your body tells you, <em>in one place.</em>
          </h2>
          <p className="section-lede">
            Your lab reports live in one inbox, your sleep in another app, your runs somewhere else. BiomarkHQ gathers
            them so you finally see the full picture.
          </p>
        </div>

        <div className="steps">
          <Step
            n={1}
            title="Upload your blood results"
            body="Add a PDF or snap a photo of your report, from any lab, anywhere in the world."
            visual={<UploadVisual />}
          />
          <Step
            n={2}
            title="Sync your wearables and Strava"
            body="Bring in sleep, heart rate and recovery from the devices you already wear, plus your training from Strava."
            visual={<SyncVisual />}
          />
          <Step
            n={3}
            plain
            title="See it all in one view"
            body="Your biomarkers, sleep, recovery and training sit side by side on one dashboard, so you can see how each one shapes the others."
            visual={<OneViewVisual />}
          />
          <Step
            n={4}
            title="Get your protocol"
            body="BiomarkHQ builds a personalised protocol from your data, with practical steps across nutrition, sleep, training and lifestyle."
            visual={<ProtocolVisual />}
          />
        </div>

        <div className="how__cta">
          <a className="btn" href="#waitlist">
            Join the waitlist
          </a>
        </div>
      </div>
    </section>
  )
}
