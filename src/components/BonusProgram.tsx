const BonusProgram = () => {
  return (
    <section className="bonus-section" id="bonus">
      <div className="container">
        <div className="bonus-card">
          <div className="bonus-content">
            <div className="bonus-header">
              <span className="bonus-icon">🎁</span>
              <h3>Referral Bonus Program</h3>
            </div>
            <div className="bonus-tiers">
              <div className="bonus-tier">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D8B2D" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                <p><strong>5 successful referrals</strong> → Extra <span className="highlight-green">0.10% bonus</span> on total disbursal</p>
              </div>
              <div className="bonus-tier">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D8B2D" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                <p><strong>10 successful referrals</strong> → Unlock additional <span className="highlight-orange">0.10% bonus</span> on the entire amount</p>
              </div>
            </div>
          </div>
          <div className="bonus-example">
            <span className="example-label">Example</span>
            <p className="example-text">₹5 Cr disbursal = <strong>₹50,000 extra earnings</strong></p>
          </div>
        </div>
        <div className="bonus-cta">
          <a href="#" className="btn-primary" id="btn-start-earning-today">
            Start Earning Today
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default BonusProgram
