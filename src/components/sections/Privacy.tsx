import type { ReactNode } from 'react'

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

const PROMISES = [
  {
    label: 'Encrypted',
    icon: (
      <Icon>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </Icon>
    ),
  },
  {
    label: 'Never sold',
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="9" />
        <path d="M5.6 5.6l12.8 12.8" />
      </Icon>
    ),
  },
  {
    label: 'Delete anytime',
    icon: (
      <Icon>
        <path d="M4 7h16" />
        <path d="M9 7V4h6v3" />
        <path d="M6 7l1 13h10l1-13" />
      </Icon>
    ),
  },
]

export function Privacy() {
  return (
    <section id="privacy" className="container feature-section">
      <div className="privacy-intro">
        <p className="eyebrow eyebrow--center">Privacy</p>
        <h2 className="section-title">
          Your health data <em>stays yours.</em>
        </h2>
        <p className="section-lede">
          Your biomarkers are some of the most personal data you have. So we treat them that way. Your data is
          encrypted, never sold, and yours to delete anytime.
        </p>
      </div>
      <div className="privacy-grid">
        {PROMISES.map((p) => (
          <div key={p.label} className="privacy-item">
            {p.icon}
            <span>{p.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
