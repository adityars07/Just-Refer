const Testimonials = () => {
  const reviews = [
    {
      name: 'Priya Sharma',
      role: 'Principal Advisor, Sharma Realty • Mumbai',
      category: 'Home Loans Specialist',
      categoryClass: 'green',
      avatarBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      initials: 'PS',
      metricText: '₹2.5L+ Monthly Payouts Added',
      metricIcon: '⚡',
      quote:
        'Before JustRefer, I spent hours chasing individual branch managers for homebuyers’ loan updates. With JustRefer, I enter client details in 30 seconds and the bank ops team handles document collection. My clients get 8.5% rates and my commission arrives every Friday without fail.',
    },
    {
      name: 'CA Rajesh Verma',
      role: 'Senior Partner, Verma & Associates • Delhi NCR',
      category: 'LAP & Commercial Finance',
      categoryClass: 'orange',
      avatarBg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      initials: 'RV',
      metricText: '₹12 Cr Disbursed in Q3',
      metricIcon: '📈',
      quote:
        'My business and corporate clients frequently need high-ticket LAP and expansion capital. JustRefer’s multi-bank policy engine queries 24+ lender cut-offs to find the lowest rate and fastest sanction. It is easily the most transparent B2B referral platform in India.',
    },
    {
      name: 'Amit Patel',
      role: 'Independent Wealth Planner • Bengaluru',
      category: 'Personal & Wealth Finance',
      categoryClass: 'blue',
      avatarBg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      initials: 'AP',
      metricText: '48-Hour Digital Disbursals',
      metricIcon: '✓',
      quote:
        'Most referral networks make independent advisors jump through weeks of KYC hurdles before releasing a single rupee. JustRefer required zero KYC to start, gave me live WhatsApp milestone alerts, and credited my ₹75,000 commission directly into my bank account.',
    },
  ]

  return (
    <section className="testimonials-section" id="reviews">
      <div className="container">
        {/* Section Header */}
        <div className="testimonials-header">
          <span className="testimonials-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            VERIFIED PARTNER EXPERIENCES
          </span>
          <h2 className="testimonials-title">
            Discover Why 2,400+ Referrers Trust JustRefer
          </h2>
          <p className="testimonials-subtitle">
            Real estate consultants, Chartered Accountants, and wealth managers share how they unlock institutional commission slabs with direct Friday bank settlements.
          </p>

          {/* Social Proof Metric Bar */}
          <div className="testimonials-metrics-bar">
            <div className="metric-pill-item">
              <span style={{ color: '#f59e0b' }}>★★★★★</span>
              <span><strong>4.9 / 5.0</strong> Partner Rating</span>
            </div>
            <div className="metric-pill-divider" />
            <div className="metric-pill-item">
              <span><strong>₹18.5 Cr+</strong> Settled to Date</span>
            </div>
            <div className="metric-pill-divider" />
            <div className="metric-pill-item">
              <span style={{ color: '#1F9D55' }}>✓</span>
              <span><strong>100% On-Time</strong> Friday IMPS</span>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="testimonials-grid">
          {reviews.map((r, i) => (
            <div key={i} className="testimonial-card">
              <div>
                {/* Top Row: Category + Stars */}
                <div className="testimonial-top-row">
                  <span className={`testimonial-category-pill ${r.categoryClass}`}>
                    {r.category}
                  </span>
                  <div className="testimonial-stars">
                    {[...Array(5)].map((_, idx) => (
                      <svg
                        key={idx}
                        className="star-icon"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                </div>

                {/* Quote Text */}
                <p className="testimonial-quote">“{r.quote}”</p>
              </div>

              <div>
                {/* Metric Chip */}
                <div className="testimonial-metric-chip">
                  <span>{r.metricIcon}</span>
                  <span>Impact: <strong>{r.metricText}</strong></span>
                </div>

                {/* Author Profile */}
                <div className="testimonial-author-row">
                  <div
                    className="testimonial-avatar-circle"
                    style={{ background: r.avatarBg }}
                  >
                    {r.initials}
                  </div>
                  <div className="testimonial-author-info">
                    <div className="testimonial-author-name">
                      {r.name}
                      <span className="verified-badge" title="Verified Partner">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      </span>
                    </div>
                    <div className="testimonial-role-sub">{r.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Assurance Bar */}
        <div className="testimonials-trust-bar">
          <div className="trust-bar-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>RBI-Regulated Scheduled Banks & NBFCs</span>
          </div>
          <div className="trust-bar-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            <span>Direct Bank IMPS Settlements Every Friday</span>
          </div>
          <div className="trust-bar-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Zero KYC Friction & Section 194H Compliant</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
