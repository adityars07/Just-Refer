const WhyChooseUs = () => {
  const points = [
    {
      title: 'Quick Online Applications',
      desc: 'Apply in minutes with our simple and secure online process from any mobile device or PC.'
    },
    {
      title: 'Transparent Loan Terms',
      desc: 'No hidden fees or unexpected penalties. Clear interest rates and straightforward repayment schedules.'
    },
    {
      title: 'Cutting-Edge Technology For Fast Approvals',
      desc: 'AI-assisted underwriting connected with India’s top 40+ lending institutions for prompt disbursals.'
    },
    {
      title: 'Highest Referral Commissions in India',
      desc: 'Earn up to ₹50,000 per crore disbursed with fast T+2 days direct bank settlements.'
    }
  ]

  return (
    <section className="why-section" id="about">
      <div className="container">
        <div className="why-split-grid">
          {/* Left: Who We Are & Visual */}
          <div className="why-left-content">
            <span className="section-tag">ABOUT US</span>
            <h3>Apply With Confidence</h3>
            <p>
              Founded in 2022, JustRefer bridges the gap between borrowers seeking affordable loans and top financial institutions, while empowering individuals to monetize their personal and professional networks.
            </p>

            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(11, 71, 42, 0.08)',
              border: '1.5px solid #e4eee7',
              marginTop: '20px'
            }}>
              <img
                src="/images/products/business-loan.jpg"
                alt="Our financial advisory team"
                style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '20px 24px', background: '#f4f9f5' }}>
                <strong style={{ display: 'block', color: '#0d5c3a', fontSize: '1.1rem' }}>
                  ₹500+ Crore Disbursed Across India
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#52665a' }}>
                  Authorized loan distribution network with 100% regulatory compliance.
                </span>
              </div>
            </div>
          </div>

          {/* Right: Why Choose Us Checklist */}
          <div>
            <span className="section-tag">ADVANTAGES</span>
            <h2 className="section-title" style={{ fontSize: '2rem' }}>Why Choose Us?</h2>
            
            <ul className="why-checklist" style={{ marginTop: '24px' }}>
              {points.map((pt, i) => (
                <li key={i} className="why-check-item">
                  <div className="check-icon-circle">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="check-content">
                    <h4>{pt.title}</h4>
                    <p>{pt.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
