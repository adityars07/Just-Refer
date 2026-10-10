interface MobileAppShowcaseProps {
  onOpenModal: () => void
}

const MobileAppShowcase = ({ onOpenModal }: MobileAppShowcaseProps) => {
  return (
    <section className="mobile-showcase-section" id="mobile-app">
      <div className="container">
        <div className="mobile-showcase-header">
          <span className="section-eyebrow">Mobile Experience</span>
          <h2 className="section-heading">Manage Referrals On The Go</h2>
          <p className="section-subtext">
            Track applications, monitor instant commission payouts, and share loan links directly from WhatsApp or SMS.
          </p>
        </div>

        <div className="mobile-phones-row">
          {/* Phone 1: Mobile Partner Dashboard */}
          <div className="phone-device-frame">
            <div className="phone-island-notch"></div>
            <div className="phone-inner-screen">
              <div className="phone-top-status">
                <span>9:41</span>
                <span>📶 🔋</span>
              </div>

              <div className="phone-brand-header">
                <div className="phone-brand-logo">
                  <span>$</span>
                  <strong>JustRefer</strong>
                </div>
                <div className="phone-user-dot">AS</div>
              </div>

              <div className="phone-greeting">
                <h4>Hi, Aditya 👋</h4>
                <p>Here's your overview.</p>
              </div>

              {/* Total Earnings Card */}
              <div className="phone-green-card">
                <span className="pcard-label">Total Earnings</span>
                <div className="pcard-amt-row">
                  <span className="pcard-amt">₹ 24,500</span>
                  <span className="pcard-trend">+12% this month</span>
                </div>

                <div className="pcard-stats-trio">
                  <div className="trio-item">
                    <strong>18</strong>
                    <span>Referrals</span>
                  </div>
                  <div className="trio-item">
                    <strong>12</strong>
                    <span>Approved</span>
                  </div>
                  <div className="trio-item">
                    <strong>4</strong>
                    <span>Pending</span>
                  </div>
                </div>
              </div>

              {/* Recent Referrals on Mobile */}
              <div className="phone-section-title">
                <span>Recent Referrals</span>
                <a href="#view" onClick={(e) => { e.preventDefault(); onOpenModal(); }}>View →</a>
              </div>

              <div className="phone-recent-list">
                <div className="phone-rec-item">
                  <div className="rec-avatar">AK</div>
                  <div className="rec-info">
                    <strong>Amit Kumar</strong>
                    <span>Home Loan · Approved</span>
                  </div>
                  <span className="rec-comm">+₹4,000</span>
                </div>

                <div className="phone-rec-item">
                  <div className="rec-avatar">SP</div>
                  <div className="rec-info">
                    <strong>Sneha Patel</strong>
                    <span>Personal Loan · In Progress</span>
                  </div>
                  <span className="rec-comm pending">Pending</span>
                </div>
              </div>

              {/* Mobile Bottom Nav */}
              <div className="phone-bottom-nav">
                <div className="pnav-item active">🏠 <span>Home</span></div>
                <div className="pnav-item">👥 <span>Referrals</span></div>
                <div className="pnav-item">💳 <span>Loans</span></div>
                <div className="pnav-item">💰 <span>Earnings</span></div>
              </div>
            </div>
          </div>

          {/* Phone 2: Refer & Earn Onboarding */}
          <div className="phone-device-frame">
            <div className="phone-island-notch"></div>
            <div className="phone-inner-screen">
              <div className="phone-top-status">
                <span>9:41</span>
                <span>📶 🔋</span>
              </div>

              <div className="phone-back-nav">
                <span>←</span>
                <strong>Refer & Earn</strong>
              </div>

              <div className="phone-refer-visual">
                <div className="refer-illustration-circle">
                  <span className="ill-char">👨‍💼</span>
                  <span className="ill-heart">🤝</span>
                  <span className="ill-char">👩‍💼</span>
                </div>
              </div>

              <div className="phone-refer-copy">
                <h3>Refer Loans.<br />Earn Rewards.</h3>
                <p>
                  Share loan options with your network and earn attractive commission on every successful disbursal.
                </p>
              </div>

              <div className="phone-action-stack">
                <button
                  type="button"
                  className="btn-phone-primary"
                  onClick={onOpenModal}
                >
                  Get Started
                </button>
                <button
                  type="button"
                  className="btn-phone-secondary"
                  onClick={onOpenModal}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MobileAppShowcase
