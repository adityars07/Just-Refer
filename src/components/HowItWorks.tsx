const HowItWorks = () => {
  return (
    <section className="how-section" id="how-it-works">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="section-eyebrow">How it works</span>
          <h2 className="section-heading">
            Get to know how to get<br />started
          </h2>
        </div>

        {/* 2 Big Feature Cards Side-by-Side */}
        <div className="how-bento-grid">
          {/* Card 1: Apply Online (Peach Background with Phone UI) */}
          <div className="how-card-box how-card-peach">
            <div className="how-card-header">
              <h3 className="how-card-title">Apply Online</h3>
              <p className="how-card-subtitle">
                Fill out a quick, secure form in under 5 minutes.
              </p>
            </div>

            {/* Realistic iPhone Phone Mockup */}
            <div className="phone-mockup-wrapper">
              <div className="phone-device">
                <div className="phone-notch"></div>
                <div className="phone-screen">
                  <div className="phone-status-bar">
                    <span className="phone-time">9:41</span>
                    <div className="phone-icons">
                      <span>📶</span>
                      <span>🔋</span>
                    </div>
                  </div>
                  
                  <div className="phone-app-content">
                    <div className="phone-blue-banner">
                      <h5>Get the best card now</h5>
                      <span className="phone-badge">Instant Approval</span>
                    </div>
                    
                    <div className="phone-step-indicator">
                      <div className="phone-step-pill active">1</div>
                      <div className="phone-step-pill">2</div>
                      <div className="phone-step-pill">3</div>
                    </div>

                    <div className="phone-form-preview">
                      <label>Full Name</label>
                      <div className="phone-input-fake">Aditya Sharma</div>
                      <label>Phone Number</label>
                      <div className="phone-input-fake">+91 98765 43210</div>
                      <button type="button" className="phone-btn-fake">Continue →</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Get Approved Instantly (Mint Background with Approval Badges) */}
          <div className="how-card-box how-card-mint">
            <div className="how-card-header">
              <h3 className="how-card-title">Get Approved Instantly</h3>
              <p className="how-card-subtitle">
                We'll notify you the moment your application is accepted.
              </p>
            </div>

            {/* Approval comparison notification widgets */}
            <div className="approval-notifications-wrapper">
              {/* Other cards rejection/slow pill */}
              <div className="notify-pill notify-slow">
                <div className="notify-icon-circle slow-icon">?</div>
                <div className="notify-text-col">
                  <strong className="notify-sender">Other banks & cards</strong>
                  <span className="notify-msg">Your card will be ready in 3-5 business days</span>
                </div>
                <div className="notify-badge-cross">✕</div>
              </div>

              {/* JustRefer instant approval pill */}
              <div className="notify-pill notify-approved">
                <div className="notify-icon-circle instant-icon">
                  <div className="brand-dot-mini">J</div>
                </div>
                <div className="notify-text-col">
                  <strong className="notify-sender">JustRefer</strong>
                  <span className="notify-msg">Your card has been approved! Start spending immediately.</span>
                </div>
                <div className="notify-badge-check">✓</div>
              </div>

              {/* Instant Virtual Limit Widget */}
              <div className="instant-limit-card">
                <div className="limit-row">
                  <span>Approved Limit</span>
                  <strong className="limit-amt">₹2,50,000</strong>
                </div>
                <div className="limit-progress-bar">
                  <div className="limit-progress-fill" style={{ width: '100%' }}></div>
                </div>
                <div className="limit-sub">Available instantly on Apple Pay & Google Pay</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Start spending (Wide card with card in hand) */}
        <div className="how-card-wide">
          <div className="how-wide-text">
            <h3 className="how-card-title">Start Spending</h3>
            <p className="how-card-subtitle">
              Use your digital card right away while your physical card is on the way. Zero waiting, maximum freedom.
            </p>
            <div className="how-wide-tags">
              <span className="how-tag">✓ Instant Virtual Activation</span>
              <span className="how-tag">✓ NFC & Tap-to-Pay</span>
              <span className="how-tag">✓ Free Metal Card by Mail</span>
            </div>
          </div>
          <div className="how-wide-card-visual">
            <div className="sleek-card-preview">
              <div className="sleek-chip"></div>
              <div className="sleek-brand">JustRefer</div>
              <div className="sleek-number">•••• •••• •••• 8842</div>
              <div className="sleek-bottom">
                <span>PREMIUM MEMBER</span>
                <span>EXP 08/29</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
