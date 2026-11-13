import type { ReactNode } from 'react'
import runnerImg from '../../assets/images/insights-runner.jpg'

type Insight = { kicker: string; text: string; tint: string; icon: ReactNode }

function Icon({ color, children }: { color: string; children: ReactNode }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

const INSIGHTS: Insight[] = [
  {
    kicker: 'Blood + training',
    text: 'Your ferritin has dipped across your last two tests, during your highest training months.',
    tint: 'rgba(138,90,16,.12)',
    icon: (
      <Icon color="var(--warn)">
        <path d="M4 7l6 6 4-4 6 6" />
        <path d="M20 11v4h-4" />
      </Icon>
    ),
  },
  {
    kicker: 'Sleep + heart',
    text: 'Your resting heart rate improves in weeks you sleep 7+ hours.',
    tint: 'rgba(189,90,56,.10)',
    icon: (
      <Icon color="var(--accent)">
        <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
      </Icon>
    ),
  },
  {
    kicker: 'Trend',
    text: 'Your vitamin D is trending up since your last test.',
    tint: 'rgba(60,48,36,.08)',
    icon: (
      <Icon color="var(--ink)">
        <path d="M12 19V5" />
        <path d="M6 11l6-6 6 6" />
      </Icon>
    ),
  },
]

export function Insights() {
  return (
    <section className="container feature-section">
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div className="col-text">
          <p className="eyebrow">Personalised insights</p>
          <h2 className="section-title">
            Insights that see <em>the whole you,</em> not just the numbers.
          </h2>
          <p className="section-lede feature-lede">
            BiomarkHQ's AI reads your biomarkers alongside your sleep, recovery and training, then explains what the
            patterns mean for you, in plain language.
          </p>
          <img
            className="insights-photo"
            src={runnerImg}
            alt="A runner catches his breath on a country road at dusk, hand on hip, checking his watch."
            loading="lazy"
          />
        </div>

        <div className="col-vis insight-list">
          {INSIGHTS.map((item) => (
            <div key={item.kicker} className="insight">
              <div className="icon-tile" style={{ background: item.tint }}>
                {item.icon}
              </div>
              <div>
                <p className="label insight__kicker">{item.kicker}</p>
                <p className="insight__text">{item.text}</p>
              </div>
            </div>
          ))}
          <p className="label"></p>
        </div>
      </div>
    </section>
  )
}
