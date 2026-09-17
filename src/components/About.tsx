const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-content">
            <span className="section-badge">ABOUT JUSTREFER</span>
            <h2 className="section-title section-title-left">Empowering Financial Growth Through Trusted Referrals</h2>
            <p>JustRefer is a loan referral platform by FinzoMoney, connecting borrowers with the best loan products while rewarding our referrers with attractive incentives.</p>
            <p>Founded with a mission to democratize access to credit, we help families and businesses secure the financing they need through trusted referrals.</p>
            <p>We work with multiple partner banks and NBFCs, and are committed to transparent, ethical lending practices.</p>
            <div className="about-counters">
              <div className="counter-item">
                <span className="counter-number">25+</span>
                <span className="counter-label">Banking Partners</span>
              </div>
              <div className="counter-item">
                <span className="counter-number">50+</span>
                <span className="counter-label">Cities Covered</span>
              </div>
              <div className="counter-item">
                <span className="counter-number">98%</span>
                <span className="counter-label">Satisfaction Rate</span>
              </div>
            </div>
          </div>
          <div className="mission-card">
            <h3>Our Mission</h3>
            <div className="mission-items">
              {['Make credit accessible to every Indian', 'Create earning opportunities for millions', 'Build a community-driven financial ecosystem'].map((item, i) => (
                <div key={i} className="mission-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8530E" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mission-vision">
              <h4>Our Vision</h4>
              <p>To become India's largest loan referral network, enabling financial inclusion through the power of personal recommendations and trust.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
