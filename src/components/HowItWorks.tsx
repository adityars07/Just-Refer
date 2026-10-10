const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Apply Online',
      desc: 'Complete our quick and secure online application or lead entry form with personal and financial details.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      )
    },
    {
      step: '02',
      title: 'Verification',
      desc: "We'll verify your submitted documents and KYC records to ensure instant eligibility matching with partner banks.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      )
    },
    {
      step: '03',
      title: 'Credit Assessment',
      desc: 'Our AI engine compares 40+ lending options to secure the lowest interest rates and highest loan sanctioned amount.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="m16 10-5.5 5.5L8 13"/>
        </svg>
      )
    },
    {
      step: '04',
      title: 'Loan Approval',
      desc: 'Once sanctioned, loan amounts are disbursed directly to your account, and referral rewards are transferred in T+2 days.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      )
    }
  ]

  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <span className="section-tag">HOW IT WORKS</span>
          <h2 className="section-title">Get Approved In 4 Easy Steps</h2>
          <p className="section-subtitle mx-auto">
            From seamless digital application to fast disbursal, our automated process ensures maximum speed and total transparency.
          </p>
        </div>

        <div className="how-steps-grid">
          {steps.map((item, idx) => (
            <div key={idx} className="how-step-card">
              <div className="how-step-icon">
                {item.icon}
              </div>
              <h3 className="how-step-title">{item.title}</h3>
              <p className="how-step-desc">{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <a href="#calculator" className="btn-pill-primary">
            Apply Now
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
