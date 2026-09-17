const features = [
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    title: 'End-to-End Support',
    desc: 'Expert hand-holding throughout the loan process. From application to disbursal, we\'re with you.',
    iconClass: 'feature-icon-1',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    title: 'Unique Incentives',
    desc: 'First-of-its-kind rewards for self and friend referrals. Earn more with every successful referral.',
    iconClass: 'feature-icon-2',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 9h20"/><path d="M9 21V9"/></svg>,
    title: 'Best Rates',
    desc: 'Tailored interest rates based on your profile. We negotiate the best deals from our banking partners.',
    iconClass: 'feature-icon-3',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    title: 'Trusted Partners',
    desc: 'We work with top banks and financial institutions including SBI, HDFC, ICICI, Axis, and 20+ more.',
    iconClass: 'feature-icon-4',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    title: 'Fast Approvals',
    desc: 'Get your loan approved in record time. Our streamlined process ensures minimal delays.',
    iconClass: 'feature-icon-5',
  },
]

const WhyChooseUs = () => {
  return (
    <section className="why-choose" id="why-choose">
      <div className="container">
        <span className="section-badge">OUR STRENGTHS</span>
        <h2 className="section-title">Why Choose Us</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card" id={`feature-${i}`}>
              <div className={`feature-icon-wrap ${f.iconClass}`}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
