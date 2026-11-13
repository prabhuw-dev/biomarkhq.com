export function SiteFooter() {
  return (
    <footer className="container site-footer">
      <p className="site-footer__disclaimer">
        BiomarkHQ provides educational insights and is not a substitute for professional medical advice, diagnosis or
        treatment. Always talk to a qualified healthcare provider about your results.
      </p>
      <div className="site-footer__bar">
        <span className="mono site-footer__copy">© {new Date().getFullYear()} BiomarkHQ</span>
        <nav aria-label="Legal">
          {/* TODO: point these at the real pages */}
          <a href="#">Privacy policy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </nav>
      </div>
    </footer>
  )
}
