interface HeroProps {
  onOpenModal?: () => void
}

const Hero = ({ onOpenModal }: HeroProps) => {
  return (
    <section className="justrefer-hero" id="home">
      <div className="container">
        <div className="hero-main-layout">
          {/* Left Column: Typography & CTAs */}
          <div className="hero-text-column">
            <div className="hero-kicker-pill">
              <span className="sparkle-icon">✨</span>
              <span>Earn Commission by Referring Loans</span>
            </div>

            <h1 className="hero-main-headline">
              Your Network<br />
              Can Open Doors.<br />
              Refer Loans.<br />
              Earn Rewards.
            </h1>

            <p className="hero-subtext">
              Help people get the right loans from trusted banks & NBFCs and earn attractive commission on every successful referral.
            </p>

            <div className="hero-cta-group">
              <button
                type="button"
                className="btn-hero-primary"
                onClick={onOpenModal}
              >
                Get Started for Free →
              </button>
              <a href="#how-it-works" className="btn-hero-video">
                <span className="play-triangle">▶</span>
                <span>Watch Video</span>
              </a>
            </div>

            {/* 4 Trust points in 2x2 grid */}
            <div className="hero-trust-grid">
              <div className="trust-item">
                <span className="trust-check">✓</span>
                <div className="trust-text">
                  <strong>Free to join</strong>
                  <span>No hidden charges</span>
                </div>
              </div>

              <div className="trust-item">
                <span className="trust-check">✓</span>
                <div className="trust-text">
                  <strong>Trusted partners</strong>
                  <span>Banks & NBFCs</span>
                </div>
              </div>

              <div className="trust-item">
                <span className="trust-check">✓</span>
                <div className="trust-text">
                  <strong>Attractive commission</strong>
                  <span>On successful referrals</span>
                </div>
              </div>

              <div className="trust-item">
                <span className="trust-check">✓</span>
                <div className="trust-text">
                  <strong>100% online</strong>
                  <span>Track everything in real-time</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Live Floating Cards */}
          <div className="hero-visual-column">
            <div className="hero-image-card">
              <img
                src="/images/hero-indian-professional.jpg"
                alt="Smiling partner earning on JustRefer platform"
                className="hero-main-photo"
              />

              {/* Floating Card 1: Total Earnings (Top Left) */}
              <div className="float-card-earnings">
                <div className="earnings-label">Total Earnings</div>
                <div className="earnings-amount-row">
                  <span className="earnings-amt">₹ 24,500</span>
                  <div className="earnings-trend-badge">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                  </div>
                </div>
                <span className="earnings-growth">+12% this month</span>
              </div>

              {/* Floating Card 2: Commission Feed (Bottom Right) */}
              <div className="float-card-feed">
                <div className="feed-item">
                  <div className="feed-icon blue">🏠</div>
                  <span className="feed-name">Home Loan</span>
                  <strong className="feed-val">+₹4,000</strong>
                </div>
                <div className="feed-item">
                  <div className="feed-icon green">👤</div>
                  <span className="feed-name">Personal Loan</span>
                  <strong className="feed-val">+₹2,500</strong>
                </div>
                <div className="feed-item">
                  <div className="feed-icon orange">💼</div>
                  <span className="feed-name">Business Loan</span>
                  <strong className="feed-val">+₹5,000</strong>
                </div>
              </div>

              {/* Floating Toast 3: Live Payout Activity (Bottom Left) */}
              <div className="float-card-toast">
                <div className="toast-avatar">R</div>
                <div className="toast-info">
                  <strong>Rohit just earned ₹4,000 commission</strong>
                  <span>2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
