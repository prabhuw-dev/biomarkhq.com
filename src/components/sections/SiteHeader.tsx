import { BrandMark } from '../BrandMark'

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a href="#top" className="brand">
          <BrandMark />
          BiomarkHQ
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#privacy">Privacy</a>
        </nav>
        <a className="btn btn--sm" href="#waitlist">
          Join the waitlist
        </a>
      </div>
    </header>
  )
}
