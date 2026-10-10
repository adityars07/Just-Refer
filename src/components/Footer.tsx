const Footer = () => {
  return (
    <footer className="spendify-footer" id="footer">
      <div className="container">
        <div className="footer-main-grid">
          {/* Brand Left */}
          <div className="footer-brand-side">
            <div className="footer-logo-row">
              <div className="brand-dot-footer">J</div>
              <span className="footer-brand-title">JustRefer</span>
            </div>
            <p className="footer-tagline">
              <strong>Your Network. Your Earnings.</strong> The modern financial platform for smart cardholders and verified partners across the nation.
            </p>
            <div className="footer-review-pill">
              <div className="footer-review-stars">★★★★★</div>
              <span className="footer-review-text"><strong>4.9</strong> | 20,000+ reviews</span>
            </div>
          </div>

          {/* Right Columns */}
          <div className="footer-nav-columns">
            <div className="footer-column">
              <span className="footer-col-title">PRODUCT</span>
              <ul className="footer-link-list">
                <li><a href="#benefits">Features</a></li>
                <li><a href="#how-it-works">How it works</a></li>
                <li><a href="#plans">Plans</a></li>
                <li><a href="#plans">Apply now</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <span className="footer-col-title">COMPANY</span>
              <ul className="footer-link-list">
                <li><a href="#about">About us</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#contact">Contact us</a></li>
                <li><a href="#press">Press</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <span className="footer-col-title">LEGAL</span>
              <ul className="footer-link-list">
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#cookie">Cookie Policy</a></li>
                <li><a href="#security">Security</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social Icons & Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            © {new Date().getFullYear()} JustRefer. All rights reserved.
          </div>

          <div className="footer-social-icons">
            <a href="#twitter" aria-label="Twitter" className="social-icon-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#instagram" aria-label="Instagram" className="social-icon-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#linkedin" aria-label="LinkedIn" className="social-icon-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
