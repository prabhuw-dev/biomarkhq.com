import nutritionImg from '../../assets/images/plan-nutrition.jpg'
import sleepImg from '../../assets/images/plan-sleep.jpg'
import trainingImg from '../../assets/images/plan-training.jpg'
import lifestyleImg from '../../assets/images/plan-lifestyle.jpg'

const PLAN = [
  { key: 'Nutrition', text: 'Add an iron-rich lunch three times a week', img: nutritionImg, alt: 'A plate of lentils, greens and a soft-boiled egg.', done: true },
  { key: 'Sleep', text: 'Lights out by 10:30 on weeknights', img: sleepImg, alt: 'A bedside lamp glowing beside an open book at dusk.', done: false },
  { key: 'Training', text: 'Keep two of your weekly rides easy', img: trainingImg, alt: 'A woman doing a dumbbell row in a sunlit studio.', done: false },
  { key: 'Lifestyle', text: 'Take a 15-minute walk after dinner', img: lifestyleImg, alt: 'An older couple walking a dog on a coastal path.', done: false },
]

export function PlansAndRetesting() {
  return (
    <section className="container feature-section">
      <div className="duo">
        <div className="duo-card duo-card--light">
          <div>
            <p className="eyebrow">Action plans</p>
            <h2 className="duo-card__title">
              From insight to <em>a plan you can follow.</em>
            </h2>
            <p className="duo-card__body">
              Knowing isn't enough. BiomarkHQ turns your insights into simple, practical steps across nutrition, sleep,
              training and lifestyle, so you know what to do next.
            </p>
          </div>
          <ul className="plan-list" style={{ listStyle: 'none', padding: 0, margin: 0 }} aria-label="Action plan">
            {PLAN.map((item) => (
              <li key={item.key} className="plan-item">
                <span className={item.done ? 'plan-item__check plan-item__check--done' : 'plan-item__check'}>
                  {item.done && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12l5 5 9-10" />
                    </svg>
                  )}
                  <span className="sr-only">{item.done ? 'Done' : 'To do'}</span>
                </span>
                <img className="plan-item__thumb" src={item.img} alt={item.alt} loading="lazy" />
                <span className="plan-item__body">
                  <span className="label plan-item__key">{item.key}</span>
                  <span className="plan-item__text">{item.text}</span>
                </span>
              </li>
            ))}
          </ul>
          <div>
            <a className="btn" href="#waitlist">
              Join the waitlist
            </a>
          </div>
        </div>

        <div className="duo-card duo-card--dark">
          <div>
            <p className="eyebrow">Retesting reminders</p>
            <h2 className="duo-card__title">
              Know when to <em>test again.</em>
            </h2>
            <p className="duo-card__body">
              BiomarkHQ reminds you when it's time to retest, so you can see whether your changes are working and never
              lose track of a marker that needs watching.
            </p>
          </div>
          <div className="reminder">
            <div className="icon-tile" style={{ background: 'rgba(189,90,56,.12)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="5" width="16" height="15" rx="2" />
                <path d="M4 10h16" />
                <path d="M9 3v4" />
                <path d="M15 3v4" />
              </svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="reminder__head">
                <p className="reminder__title">Lipid panel</p>
                <span className="label">Due now</span>
              </div>
              <p className="reminder__body">It's been 6 months since your last lipid panel. Time to check your progress.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
