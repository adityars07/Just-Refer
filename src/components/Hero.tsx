const Hero = () => {
  return (
    <section className="hero" id="hero">
      <div className="container">
        <div className="hero-grid">
          {/* Left — Text */}
          <div className="hero-left-content">
            <span className="hero-kicker">YOUR NETWORK. YOUR EARNINGS.</span>
            <h1 className="hero-title">
              The only credit<br />
              card you will<br />
              ever need.
            </h1>
            <p className="hero-desc">
              Your network is your greatest asset. Spend smarter, earn rewards effortlessly, and manage all your loans and referrals with one powerful platform.
            </p>
            <div className="hero-actions">
              <a href="#plans" className="btn-dark hero-btn">
                Get your first card for free
              </a>
            </div>

            {/* Partner logos */}
            <div className="hero-partners">
              <span className="hero-partners-label">Partnered with:</span>
              <div className="hero-partner-logos-clean">
                {/* Mastercard Logo SVG */}
                <div className="card-network-pill">
                  <svg width="34" height="22" viewBox="0 0 36 24" fill="none">
                    <circle cx="13" cy="12" r="10" fill="#EB001B" fillOpacity="0.85"/>
                    <circle cx="23" cy="12" r="10" fill="#F79E1B" fillOpacity="0.85"/>
                  </svg>
                  <span>mastercard</span>
                </div>
                {/* Visa Logo SVG */}
                <div className="card-network-pill">
                  <span className="visa-text">VISA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Hand Holding Credit Cards Image Visual */}
          <div className="hero-visual-spendify">
            <div className="hero-image-wrapper">
              <img
                src="/images/hero-card-hand.jpg"
                alt="Human hand holding sleek titanium and matte credit cards"
                className="hero-card-photo"
              />
              <div className="hero-chip-badge">
                <div className="badge-glow-dot"></div>
                <span>Titanium Edition</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
