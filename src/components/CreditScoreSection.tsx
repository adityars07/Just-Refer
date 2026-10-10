const CreditScoreSection = () => {
  return (
    <section className="credit-score-section">
      <div className="container">
        <div className="credit-score-box">
          {/* Left: Gauge Visual */}
          <div className="score-gauge-visual">
            <div className="gauge-circle">
              <div className="gauge-inner">
                <strong>780</strong>
                <span>CIBIL Score</span>
              </div>
            </div>
            <div>
              <span style={{
                background: '#d1fae5',
                color: '#065f46',
                fontWeight: 800,
                fontSize: '0.72rem',
                padding: '3px 8px',
                borderRadius: '999px',
                textTransform: 'uppercase'
              }}>
                EXCELLENT
              </span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '4px' }}>
                Instant Rate Discounts
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#52665a', margin: 0 }}>
                High scores qualify for up to 0.50% lower APR
              </p>
            </div>
          </div>

          {/* Right: Description & Action */}
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111d16', marginBottom: '8px' }}>
              Check Your Credit Score for Free
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#52665a', marginBottom: '18px', lineHeight: 1.5 }}>
              Checking your credit score with JustRefer takes less than 2 minutes and will <strong>never</strong> impact your credit rating. Discover your eligibility across 40+ lending institutions now.
            </p>
            <a
              href="https://www.cibil.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-primary"
              style={{ fontSize: '0.88rem', padding: '10px 22px' }}
            >
              Check My Free Score
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreditScoreSection
