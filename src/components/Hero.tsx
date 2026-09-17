import { useEffect, useRef } from 'react'

const Hero = () => {
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number')
            counters.forEach((counter) => {
              const el = counter as HTMLElement
              const target = parseInt(el.dataset.count || '0', 10)
              let current = 0
              const increment = target / 60
              const timer = setInterval(() => {
                current += increment
                if (current >= target) {
                  el.textContent = target.toLocaleString('en-IN')
                  clearInterval(timer)
                } else {
                  el.textContent = Math.floor(current).toLocaleString('en-IN')
                }
              }, 25)
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="hero" id="hero">
      <div className="container hero-inner">
        <div className="hero-content">
          <span className="hero-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            INDIA'S 1ST LOAN REFERRAL PLATFORM
          </span>
          <h1 className="hero-title">
            Refer Loans,<br />
            <span className="gradient-text">Earn Big</span>
          </h1>
          <p className="hero-desc">
            Connect friends & family with the best loan deals while earning attractive incentives.
            Let your network build for you a steady income stream where you do nothing but <em>JustRefer.</em>
          </p>
          <p className="hero-tagline">Refer more. Earn more. It's that simple.</p>
          <div className="hero-cta">
            <a href="#" className="btn-primary" id="btn-start-earning">
              Start Earning Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
            <a href="#how-it-works" className="btn-secondary" id="btn-how-it-works">How It Works</a>
          </div>
          <div className="hero-stats" ref={statsRef}>
            <div className="stat-item">
              <div className="stat-value">
                <span className="stat-number" data-count="10000">0</span><span className="stat-suffix">+</span>
              </div>
              <span className="stat-label">Active Referrers</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value">
                <span className="stat-prefix">₹</span><span className="stat-number" data-count="50">0</span><span className="stat-suffix">Cr+</span>
              </div>
              <span className="stat-label">Loans Disbursed</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value">
                <span className="stat-number" data-count="25">0</span><span className="stat-suffix">+</span>
              </div>
              <span className="stat-label">Bank Partners</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-card">
            <div className="visual-ring ring-1" />
            <div className="visual-ring ring-2" />
            <div className="visual-ring ring-3" />
            <div className="visual-coin">
              <div className="coin-inner">
                <span>₹</span>
              </div>
            </div>
            <div className="floating-badge badge-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D8B2D" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
              <span>Instant Payouts</span>
            </div>
            <div className="floating-badge badge-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8530E" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span>Up to 1% Commission</span>
            </div>
            <div className="floating-badge badge-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8530E" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>Refer Anyone</span>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-wave">
        <svg viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
          <path d="M0,80 C360,20 720,120 1440,60 L1440,120 L0,120 Z" fill="var(--bg-primary)"/>
        </svg>
      </div>
    </section>
  )
}

export default Hero
