const steps = [
  {
    number: '01',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    title: 'Refer',
    desc: 'Share loan opportunities with friends, family, or colleagues who need financial assistance. Simply fill in their details on our platform.',
    iconClass: 'step-icon-refer',
  },
  {
    number: '02',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
    title: 'We Process',
    desc: 'Our team reviews and processes the loan application with care and efficiency. We work with 25+ banking partners to find the best deal.',
    iconClass: 'step-icon-process',
  },
  {
    number: '03',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    title: 'Earn',
    desc: 'Get rewarded with attractive commissions once the loan is disbursed. Payments are processed directly to your bank account.',
    iconClass: 'step-icon-earn',
  },
]

const HowItWorks = () => {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <span className="section-badge">SIMPLE PROCESS</span>
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          {steps.map((step, i) => (
            <div key={i} className="step-card" id={`step-${i + 1}`}>
              <div className="step-number">{step.number}</div>
              <div className={`step-icon ${step.iconClass}`}>{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="step-connector">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
