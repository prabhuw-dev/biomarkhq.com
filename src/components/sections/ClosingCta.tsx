import ctaImg from '../../assets/images/cta.jpg'
import { WaitlistForm } from '../WaitlistForm'

export function ClosingCta() {
  return (
    <section id="waitlist" className="container feature-section">
      <div className="cta">
        <img className="cta__photo" src={ctaImg} alt="" aria-hidden="true" loading="lazy" />
        <div className="cta__wash" aria-hidden="true" />
        <div className="cta__content">
          <h2 className="cta__title">
            Start understanding your body, <em>not just measuring it.</em>
          </h2>
          <p className="section-lede cta__lede">Join the waitlist and be among the first to try BiomarkHQ.</p>
          <WaitlistForm centered note="No spam. We'll only email you when your access is ready." />
        </div>
      </div>
    </section>
  )
}
