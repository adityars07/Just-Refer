const LoanProducts = () => {
  const products = [
    {
      id: 'home-loan',
      name: 'Home Loans',
      desc: 'Lowest interest rates starting 8.35% p.a. for residential purchases, construction & resale.',
      payout: 'Earn ₹30,000 / Crore (0.3%)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
      specs: [
        'Loan amounts up to ₹100 Crore',
        'Flexible tenure up to 30 years',
        'Tax savings under Sec 80C & 24(b)',
        'Zero prepayment charges on floating rate'
      ]
    },
    {
      id: 'personal-loan',
      name: 'Personal Loans',
      desc: 'Quick collateral-free liquidity starting from 10.49% p.a. with same-day sanction.',
      payout: 'Earn up to 1.50% Commission',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      specs: [
        'Instant approvals up to ₹40 Lakh',
        'Minimal paperless documentation',
        'Flexible tenures from 1 to 5 years',
        'Funds disbursed directly to bank account'
      ]
    },
    {
      id: 'lap',
      name: 'Loan Against Property',
      desc: 'Unlock high loan value by pledging commercial or residential property starting 9.20% p.a.',
      payout: 'Earn ₹50,000 / Crore (0.5%)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 9h18"/>
          <path d="M9 21V9"/>
        </svg>
      ),
      specs: [
        'Loan sanctions up to ₹100 Crore',
        'Long repayment tenures up to 20 years',
        'High LTV ratios up to 75%',
        'Retain full occupancy and usage of property'
      ]
    },
    {
      id: 'business-loan',
      name: 'Business & MSME Loans',
      desc: 'Fuel business scaling, machinery purchase & working capital starting 11.99% p.a.',
      payout: 'Earn up to 1.25% Commission',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      ),
      specs: [
        'Collateral-free loans up to ₹75 Lakh',
        'Overdraft and drop-line limits available',
        'Quick assessment within 48 hours',
        'Structured repayment aligned with cash flow'
      ]
    }
  ]

  return (
    <section className="services-section" id="services">
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="section-tag">OUR SERVICES</span>
          <h2 className="section-title">Fast, Flexible, And Reliable Loans</h2>
          <p className="section-subtitle mx-auto">
            Whether you need to cover unexpected expenses, acquire dream property, or expand business horizons, we deliver quick, accessible lending solutions tailored for you.
          </p>
        </div>

        {/* Layout: Cards on Left + Visual on Right */}
        <div className="services-layout">
          <div className="services-cards-grid">
            {products.map((item) => (
              <div key={item.id} className="service-card">
                <div className="service-card-top">
                  <div className="service-icon-wrap">
                    {item.icon}
                  </div>
                  <h3 className="service-title">{item.name}</h3>
                  <p className="service-desc">{item.desc}</p>
                  <div className="service-payout-badge">
                    💰 {item.payout}
                  </div>
                  <ul className="service-specs">
                    {item.specs.map((spec, i) => (
                      <li key={i}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
                <a href="#calculator" className="btn-service-apply">
                  Apply Now
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            ))}
          </div>

          {/* Right Visual Image */}
          <div className="services-visual-right">
            <img
              src="/images/products/home-loan.jpg"
              alt="Happy borrower with loan sanction letter"
              className="services-visual-img"
            />
            <div className="services-visual-badge">
              <h4>Direct Bank Disbursals</h4>
              <p>Partnered with 40+ scheduled banks across 100+ cities in India.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoanProducts
