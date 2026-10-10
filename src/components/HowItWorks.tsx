interface HowItWorksProps {
  onOpenModal?: () => void
}

const HowItWorks = ({ onOpenModal }: HowItWorksProps) => {
  const steps = [
    {
      num: '1',
      title: 'Sign Up',
      desc: 'Create your free account in a few seconds.',
      color: '#1F9D55',
      bg: '#E6F4EC',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      num: '2',
      title: 'Refer Applicants',
      desc: 'Share loan options with your network.',
      color: '#3B82F6',
      bg: '#E8F0FE',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      ),
    },
    {
      num: '3',
      title: 'Earn Commission',
      desc: 'Get paid on every successful referral.',
      color: '#1F9D55',
      bg: '#E6F4EC',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <circle cx="12" cy="12" r="3" />
          <path d="M6 12h.01M18 12h.01" />
        </svg>
      ),
    },
  ]

  return (
    <section className="how-works-section" id="how-it-works">
      <div className="container">
        <div className="how-works-header">
          <h2 className="how-works-title">How JustRefer Works</h2>
          <p className="how-works-subtitle">
            Start earning in just 3 simple steps. No paperwork, no investment.
          </p>
        </div>

        {/* 3 Step Cards with connecting arrows */}
        <div className="how-stepper-row">
          {steps.map((s, idx) => (
            <div key={s.num} className="how-step-wrapper">
              <div className="how-step-bubble-card">
                <div className="step-badge-number" style={{ background: s.bg, color: s.color }}>
                  {s.num}
                </div>
                <div className="step-icon-round" style={{ background: s.bg, color: s.color }}>
                  {s.icon}
                </div>
                <h3 className="step-card-title">{s.title}</h3>
                <p className="step-card-desc">{s.desc}</p>
              </div>

              {idx < steps.length - 1 && (
                <div className="step-arrow-divider">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="13 6 19 12 13 18" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Dark Green Banner */}
        <div className="how-join-banner">
          <div className="banner-text-side">
            <h3>Join thousands of referrers already earning with JustRefer.</h3>
            <div className="banner-avatars-row">
              <div className="avatar-group">
                <span className="av a1">👨‍💼</span>
                <span className="av a2">👩‍💼</span>
                <span className="av a3">👨‍💻</span>
                <span className="av a4">👩‍💻</span>
              </div>
              <span className="avatar-text-label">+5,000 active referrers</span>
            </div>
          </div>

          <div className="banner-cta-side">
            <button
              type="button"
              className="btn-banner-pill"
              onClick={onOpenModal}
            >
              Get Started for Free →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
