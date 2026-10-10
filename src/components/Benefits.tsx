const Benefits = () => {
  return (
    <section className="benefits-section" id="benefits">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="section-eyebrow">Benefits</span>
          <h2 className="section-heading">
            Smarter Spending<br />Starts Here
          </h2>
        </div>

        {/* Bento Grid Top Row */}
        <div className="benefits-bento-top">
          {/* Card 1: Global Acceptance (Green) */}
          <div className="bento-card bento-card-green">
            <div className="bento-card-content">
              <h3 className="bento-title">Global Acceptance</h3>
              <p className="bento-desc">
                Use it in over 200 countries no borders, no boundaries.
              </p>
            </div>
            
            {/* World Map Dotted Graphic with Pins */}
            <div className="bento-map-visual">
              <svg viewBox="0 0 540 220" className="map-dots-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Simplified World Dots Pattern */}
                <g fill="rgba(255, 255, 255, 0.45)">
                  {/* North America */}
                  <circle cx="90" cy="50" r="3"/><circle cx="110" cy="55" r="3"/><circle cx="130" cy="65" r="3"/>
                  <circle cx="80" cy="70" r="3"/><circle cx="100" cy="75" r="3"/><circle cx="120" cy="80" r="3"/><circle cx="140" cy="75" r="3"/>
                  <circle cx="90" cy="95" r="3"/><circle cx="110" cy="100" r="3"/><circle cx="130" cy="95" r="3"/>
                  
                  {/* South America */}
                  <circle cx="140" cy="130" r="3"/><circle cx="155" cy="145" r="3"/><circle cx="150" cy="165" r="3"/><circle cx="160" cy="185" r="3"/>
                  
                  {/* Europe */}
                  <circle cx="250" cy="55" r="3"/><circle cx="270" cy="50" r="3"/><circle cx="290" cy="60" r="3"/>
                  <circle cx="245" cy="75" r="3"/><circle cx="265" cy="70" r="3"/><circle cx="285" cy="75" r="3"/>
                  
                  {/* Africa */}
                  <circle cx="260" cy="105" r="3"/><circle cx="280" cy="115" r="3"/><circle cx="270" cy="135" r="3"/><circle cx="285" cy="155" r="3"/>
                  
                  {/* Asia / India */}
                  <circle cx="330" cy="60" r="3"/><circle cx="360" cy="55" r="3"/><circle cx="390" cy="65" r="3"/><circle cx="420" cy="60" r="3"/>
                  <circle cx="340" cy="85" r="3"/><circle cx="370" cy="80" r="3"/><circle cx="400" cy="85" r="3"/><circle cx="430" cy="80" r="3"/>
                  <circle cx="350" cy="105" r="3"/><circle cx="370" cy="110" r="3"/><circle cx="390" cy="115" r="3"/><circle cx="415" cy="110" r="3"/>
                  
                  {/* Australia */}
                  <circle cx="430" cy="160" r="3"/><circle cx="450" cy="170" r="3"/><circle cx="465" cy="160" r="3"/>
                </g>
              </svg>

              {/* Pin 1 - Canada */}
              <div className="map-pin-tag" style={{ top: '25%', left: '20%' }}>
                <span className="flag-circle">🇨🇦</span>
              </div>
              {/* Pin 2 - Brazil */}
              <div className="map-pin-tag" style={{ top: '65%', left: '26%' }}>
                <span className="flag-circle">🇧🇷</span>
              </div>
              {/* Pin 3 - Europe / Russia */}
              <div className="map-pin-tag" style={{ top: '28%', left: '52%' }}>
                <span className="flag-circle">🇬🇧</span>
              </div>
              {/* Pin 4 - Nigeria / Africa */}
              <div className="map-pin-tag" style={{ top: '56%', left: '51%' }}>
                <span className="flag-circle">🇳🇬</span>
              </div>
              {/* Pin 5 - India */}
              <div className="map-pin-tag" style={{ top: '48%', left: '68%' }}>
                <span className="flag-circle">🇮🇳</span>
              </div>
              {/* Pin 6 - Australia */}
              <div className="map-pin-tag" style={{ top: '75%', left: '80%' }}>
                <span className="flag-circle">🇦🇺</span>
              </div>
            </div>
          </div>

          {/* Card 2: Zero Foreign Fees (Peach) */}
          <div className="bento-card bento-card-peach">
            <div className="bento-card-content">
              <h3 className="bento-title" style={{ color: '#111827' }}>Zero Foreign Fees</h3>
              <p className="bento-desc" style={{ color: '#6b7280' }}>
                Spend confidently without hidden charges or currency fees.
              </p>
            </div>

            {/* Currency conversion visual */}
            <div className="fx-convert-container">
              <div className="fx-row">
                <div className="fx-curr">
                  <span className="fx-flag">🇮🇳</span>
                  <span className="fx-code">INR</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div className="fx-val">₹2,50,000.00</div>
              </div>

              <div className="fx-swap-bubble">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="7" y1="17" x2="17" y2="17"/>
                  <polyline points="13 13 17 17 13 21"/>
                  <line x1="17" y1="7" x2="7" y2="7"/>
                  <polyline points="11 3 7 7 11 11"/>
                </svg>
              </div>

              <div className="fx-row">
                <div className="fx-curr">
                  <span className="fx-flag">🇺🇸</span>
                  <span className="fx-code">USD</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div className="fx-val">$3,000.00</div>
              </div>

              <div className="fx-footer-note">
                <div className="fx-tag">Converted — No Foreign Fees</div>
                <div className="fx-saved">Typical FX Fee: $0.00</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid Bottom Row — 3 cards */}
        <div className="benefits-bento-bottom">
          {/* Card 3: Earn on Every Swipe (White) */}
          <div className="bento-card bento-card-white">
            <div className="swipe-visual">
              <div className="swipe-alert-pill">
                <div className="swipe-alert-left">
                  <span className="swipe-alert-title">Bill Payment</span>
                  <span className="swipe-alert-date">Nov 24, 2026 · 11:20 AM</span>
                </div>
                <div className="swipe-alert-right">
                  <span className="swipe-alert-amount">-$500.20</span>
                  <span className="swipe-alert-status">Completed</span>
                </div>
              </div>
              <div className="swipe-cashback-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>+$50.00 Cashback Earned</span>
              </div>
            </div>

            <div className="bento-bottom-text">
              <h4 className="bento-mini-title">Earn on Every Swipe</h4>
              <p className="bento-mini-desc">Cashback and rewards, no matter what or where you're buying.</p>
            </div>
          </div>

          {/* Card 4: Lightning-Fast Setup (Light Blue) */}
          <div className="bento-card bento-card-blue">
            <div className="setup-visual">
              <div className="setup-glow-circle">
                <div className="setup-icon-box">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#2563eb" stroke="#2563eb" strokeWidth="1"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                </div>
                <div className="setup-sparkle s1">✦</div>
                <div className="setup-sparkle s2">✦</div>
                <div className="setup-sparkle s3">✦</div>
              </div>
            </div>

            <div className="bento-bottom-text">
              <h4 className="bento-mini-title">Lightning-Fast Setup</h4>
              <p className="bento-mini-desc">Apply, activate, and start using it in minutes.</p>
            </div>
          </div>

          {/* Card 5: Security (Mint Green) */}
          <div className="bento-card bento-card-mint">
            <div className="security-visual">
              <div className="security-radar">
                <div className="radar-ring ring-3"></div>
                <div className="radar-ring ring-2"></div>
                <div className="radar-ring ring-1"></div>
                <div className="security-lock-core">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bento-bottom-text">
              <h4 className="bento-mini-title">Security</h4>
              <p className="bento-mini-desc">Advanced fraud protection with instant alerts and card lock.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Benefits
