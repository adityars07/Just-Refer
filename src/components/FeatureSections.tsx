interface FeatureSectionsProps {
  onOpenModal: () => void
}

const FeatureSections = ({ onOpenModal }: FeatureSectionsProps) => {
  return (
    <>
      {/* FEATURE 1: Highest Commission Loans (Exact Carry Solo 401k layout) */}
      <section className="feature-section">
        <div className="container">
          <div className="feature-grid">
            <div className="feature-text">
              <h2>The most powerful referral platform in India †</h2>
              <p>
                If you have a network of homebuyers, entrepreneurs, or salaried borrowers,
                you're eligible for highest payout slabs. Rupee for rupee, JustRefer beats
                out traditional DSAs in commission size, transparency, and speed.
              </p>
              <ul>
                <li>
                  Direct bank tie-ups offering up to <strong>₹75,000+ per referral</strong> (up to 3.5% on business loans)
                </li>
                <li>
                  Access to Home Loans, Personal Loans, Business Loans, LAP, and Doctor Loans
                </li>
                <li>
                  Multi-bank submission options, including <strong>instant pre-approvals</strong>
                </li>
                <li>
                  Penalty-free, zero deduction payouts credited directly to your verified bank account
                </li>
                <li>
                  Weekly payout cycles with instant TDS certificates and GST invoices
                </li>
              </ul>
              <button
                type="button"
                className="btn-learn-more"
                onClick={onOpenModal}
              >
                <span>Learn more</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Right Side: Exact Carry-style Solo 401k Card */}
            <div className="feature-card-wrapper">
              <div className="feature-card">
                <div className="feature-card-top">
                  <span className="feature-card-title">Home Loan Portfolio</span>
                  <div className="feature-card-amount">₹1,05,242.22</div>
                  <div className="feature-card-change">+₹5,010.03 (5.0%)</div>
                </div>

                {/* Smooth Yellow/Gold Wave Chart like Carry's */}
                <div className="feature-card-chart-area">
                  <svg className="feature-wave-svg" viewBox="0 0 400 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="carry-wave-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EAB308" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#EAB308" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 90 Q 50 85, 90 70 T 170 50 T 230 40 T 310 32 T 370 20 T 400 15 L 400 120 L 0 120 Z"
                      fill="url(#carry-wave-gradient)"
                    />
                    <path
                      d="M 0 90 Q 50 85, 90 70 T 170 50 T 230 40 T 310 32 T 370 20 T 400 15"
                      fill="none"
                      stroke="#EAB308"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>

                <div className="feature-sub-cards">
                  <div className="feature-sub-card">
                    <div className="feature-sub-card-left">
                      <span className="feature-dot-dark" />
                      <span className="feature-sub-card-label">Pre-Approval</span>
                    </div>
                    <span className="feature-sub-card-amount">₹45,283.00</span>
                  </div>

                  <div className="feature-sub-card">
                    <div className="feature-sub-card-left">
                      <span className="feature-dot-dark" />
                      <span className="feature-sub-card-label">Disbursed</span>
                    </div>
                    <span className="feature-sub-card-amount">₹48,217.24</span>
                  </div>
                </div>
              </div>
              <div className="image-note">Image is hypothetical.</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE 2: Modern Referral Platform (Carry Image 3 layout) */}
      <section className="feature-section alt-bg">
        <div className="container">
          <div className="feature-grid reversed">
            {/* Left Card: Automated Portfolio & Recurring Deposit */}
            <div className="portfolio-card-wrapper">
              <div className="portfolio-card">
                <div className="portfolio-inner">
                  <div className="portfolio-header">
                    <div className="portfolio-label">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-warning">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Automated Bank Matching</span>
                    </div>
                    <div className="portfolio-ratio">
                      <strong>5</strong> / 6
                    </div>
                  </div>

                  {/* 6-segment Risk / Matching Bar */}
                  <div className="risk-bar">
                    <div className="risk-bar-segment filled" />
                    <div className="risk-bar-segment filled" />
                    <div className="risk-bar-segment filled" />
                    <div className="risk-bar-segment filled" />
                    <div className="risk-bar-segment filled" />
                    <div className="risk-bar-segment empty" />
                  </div>

                  <div className="risk-labels">
                    <span>LESS RISK</span>
                    <span>MORE RISK</span>
                  </div>

                  {/* Recurring Card */}
                  <div className="recurring-card">
                    <div className="recurring-left">
                      <div className="recurring-icon-circle">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="23 4 23 10 17 10" />
                          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                        </svg>
                      </div>
                      <span className="recurring-label">Recurring Payout</span>
                    </div>
                    <span className="recurring-amount">₹5,000.00</span>
                  </div>

                  <div className="recurring-sub">
                    <span>HOME LOAN</span>
                    <span>WEEKLY</span>
                  </div>
                </div>
              </div>
              <div className="image-note">Image is hypothetical.</div>
            </div>

            {/* Right Text */}
            <div className="feature-text">
              <h2>A modern referral platform built for long-term growth</h2>
              <p>
                JustRefer combines direct bank contracts with a powerful technology
                platform. Refer clients for Home Loans, Business Loans, LAP, and Personal
                Loans on your own, or let our automated matching engine route your client to
                the bank with the highest sanction probability.
              </p>
              <p>
                Turn on automated referral updates and instant payout alerts, so you don't
                have to chase bank managers or wait weeks for status.
              </p>
              <p className="feature-disclaimer-text">
                Lending partners are RBI-regulated scheduled commercial banks and NBFCs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default FeatureSections
