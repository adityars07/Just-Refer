interface FeatureSectionsProps {
  onOpenModal?: () => void
}

const FeatureSections = ({ onOpenModal: _onOpenModal }: FeatureSectionsProps) => {
  return (
    <>
      {/* FEATURE 1: Highest Commission Loans & Official Partner Settlement */}
      <section className="feature-section" id="features">
        <div className="container">
          <div className="feature-grid">
            <div className="feature-text">
              <span className="products-tag-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: '#e6f7ee', color: '#1F9D55', borderRadius: 100, fontSize: 12, fontWeight: 700, marginBottom: 14 }}>
                DIRECT LENDER TIE-UPS
              </span>
              <h2 style={{ fontSize: '34px', lineHeight: 1.22, fontWeight: 800, color: '#0f172a', margin: '0 0 14px', letterSpacing: '-0.5px' }}>
                Direct Institutional Payouts & Transparent Slabs
              </h2>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6, margin: '0 0 20px' }}>
                Refer your network for high-value loans with direct bank tie-ups. JustRefer provides institutional commission slabs, guaranteed weekly IMPS settlements, and zero document collection burden on you.
              </p>

              {/* 4 Official Loan Product Rate Cards */}
              <div className="feature-rate-card-grid">
                {/* 1. Home Loan */}
                <div className="feature-rate-card">
                  <div className="rate-card-header">
                    <div className="rate-card-header-left">
                      <div className="rate-card-icon green">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      </div>
                      <div>
                        <strong className="rate-card-name">Home Loan</strong>
                        <span className="rate-card-min">Min ₹50 Lacs</span>
                      </div>
                    </div>
                    <span className="rate-card-badge">0.30% Payout</span>
                  </div>
                  <div className="rate-card-lenders">
                    HDFC Bank • SBI • ICICI • Axis
                  </div>
                  <div className="rate-card-body">
                    <div>
                      <span className="rate-card-sublabel">Starting Rate</span>
                      <div className="rate-card-big-rate">
                        8.50% <span className="rate-card-unit">p.a.</span>
                      </div>
                    </div>
                    <div className="rate-card-example">
                      ₹30,000
                      <span>on ₹1 Cr loan</span>
                    </div>
                  </div>
                </div>

                {/* 2. LAP */}
                <div className="feature-rate-card">
                  <div className="rate-card-header">
                    <div className="rate-card-header-left">
                      <div className="rate-card-icon orange">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/></svg>
                      </div>
                      <div>
                        <strong className="rate-card-name">Loan Against Property</strong>
                        <span className="rate-card-min">Min ₹1 Crore</span>
                      </div>
                    </div>
                    <span className="rate-card-badge">0.50% Payout</span>
                  </div>
                  <div className="rate-card-lenders">
                    Bajaj Finserv • Tata Capital • PNB HFL
                  </div>
                  <div className="rate-card-body">
                    <div>
                      <span className="rate-card-sublabel">Starting Rate</span>
                      <div className="rate-card-big-rate">
                        8.99% <span className="rate-card-unit">p.a.</span>
                      </div>
                    </div>
                    <div className="rate-card-example">
                      ₹50,000
                      <span>on ₹1 Cr loan</span>
                    </div>
                  </div>
                </div>

                {/* 3. Personal Loan */}
                <div className="feature-rate-card">
                  <div className="rate-card-header">
                    <div className="rate-card-header-left">
                      <div className="rate-card-icon blue">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="8" cy="15" r="1.5"/><path d="M14 15h4"/></svg>
                      </div>
                      <div>
                        <strong className="rate-card-name">Personal Loan</strong>
                        <span className="rate-card-min">Min ₹5 Lacs</span>
                      </div>
                    </div>
                    <span className="rate-card-badge">1.00% Payout</span>
                  </div>
                  <div className="rate-card-lenders">
                    Kotak • IDFC FIRST • IndusInd
                  </div>
                  <div className="rate-card-body">
                    <div>
                      <span className="rate-card-sublabel">Starting Rate</span>
                      <div className="rate-card-big-rate">
                        8.25% <span className="rate-card-unit">p.a.</span>
                      </div>
                    </div>
                    <div className="rate-card-example">
                      ₹10,000
                      <span>on ₹10L loan</span>
                    </div>
                  </div>
                </div>

                {/* 4. Business Loan */}
                <div className="feature-rate-card">
                  <div className="rate-card-header">
                    <div className="rate-card-header-left">
                      <div className="rate-card-icon purple">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12.01"/></svg>
                      </div>
                      <div>
                        <strong className="rate-card-name">Business Loan</strong>
                        <span className="rate-card-min">Min ₹10 Lacs</span>
                      </div>
                    </div>
                    <span className="rate-card-badge">1.00% Payout</span>
                  </div>
                  <div className="rate-card-lenders">
                    Lendingkart • IIFL Finance • Yes Bank
                  </div>
                  <div className="rate-card-body">
                    <div>
                      <span className="rate-card-sublabel">Starting Rate</span>
                      <div className="rate-card-big-rate">
                        9.99% <span className="rate-card-unit">p.a.</span>
                      </div>
                    </div>
                    <div className="rate-card-example">
                      ₹25,000
                      <span>on ₹25L loan</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Proportioned Settlement Voucher */}
            <div className="settlement-voucher-wrapper">
              <div className="settlement-voucher-card">
                <div className="voucher-header">
                  <span className="voucher-status-pill">
                    ● IMPS Settlement Confirmed
                  </span>
                  <span className="voucher-ref">UTR: CMS8892109420</span>
                </div>

                <div className="voucher-hero-box">
                  <div className="voucher-hero-label">Net Weekly Commission Credited</div>
                  <div className="voucher-hero-amount">₹1,32,500.00</div>
                  <div className="voucher-hero-meta">
                    <span>Beneficiary: <strong>Aditya Sharma</strong></span>
                    <span>HDFC Bank ••4092</span>
                  </div>
                </div>

                <div className="voucher-ledger-title">Disbursed Loans in this Settlement</div>
                <div className="voucher-ledger-list">
                  <div className="voucher-ledger-item">
                    <div className="ledger-item-left">
                      <span className="ledger-item-client">Rajesh & Sunita M. (Ref #HL-88219)</span>
                      <span className="ledger-item-product">Home Loan • ₹75,00,000 @ 8.50% (HDFC Bank)</span>
                    </div>
                    <div className="ledger-item-right">
                      <span className="ledger-item-amount">₹22,500</span>
                      <span className="ledger-item-slab">0.30% Slab</span>
                    </div>
                  </div>

                  <div className="voucher-ledger-item">
                    <div className="ledger-item-left">
                      <span className="ledger-item-client">Apex Logistics Pvt Ltd (Ref #LAP-40192)</span>
                      <span className="ledger-item-product">LAP • ₹1,50,00,000 @ 8.99% (Bajaj Finserv)</span>
                    </div>
                    <div className="ledger-item-right">
                      <span className="ledger-item-amount">₹75,000</span>
                      <span className="ledger-item-slab">0.50% Slab</span>
                    </div>
                  </div>

                  <div className="voucher-ledger-item">
                    <div className="ledger-item-left">
                      <span className="ledger-item-client">Kavita Patel (Ref #PL-55102)</span>
                      <span className="ledger-item-product">Personal Loan • ₹10,00,000 @ 8.25% (IDFC FIRST)</span>
                    </div>
                    <div className="ledger-item-right">
                      <span className="ledger-item-amount">₹10,000</span>
                      <span className="ledger-item-slab">1.00% Slab</span>
                    </div>
                  </div>

                  <div className="voucher-ledger-item">
                    <div className="ledger-item-left">
                      <span className="ledger-item-client">Dr. Vikram Singhania (Ref #BL-29104)</span>
                      <span className="ledger-item-product">Business Loan • ₹25,00,000 @ 9.99% (IIFL Finance)</span>
                    </div>
                    <div className="ledger-item-right">
                      <span className="ledger-item-amount">₹25,000</span>
                      <span className="ledger-item-slab">1.00% Slab</span>
                    </div>
                  </div>
                </div>

                <div className="voucher-footer-compliance">
                  <span>Section 194H Compliant • Official TDS Certificate</span>
                  <strong>Direct IMPS Credit ✓</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Real Value Pillars - Balanced Full-Width Strip */}
          <div className="feature-pillars-banner">
            <div className="pillar-banner-card">
              <div className="pillar-check">✓</div>
              <div>
                <strong>Zero KYC Burden on You</strong>
                <p>Simply submit borrower contact & requirement in 30 seconds. The lending bank collects borrower KYC and physical files directly.</p>
              </div>
            </div>
            <div className="pillar-banner-card">
              <div className="pillar-check">✓</div>
              <div>
                <strong>Weekly Friday IMPS Settlements</strong>
                <p>Direct bank credit every Friday with complete ledger breakdowns, UTR reference, and Section 194H tax compliance.</p>
              </div>
            </div>
            <div className="pillar-banner-card">
              <div className="pillar-check">✓</div>
              <div>
                <strong>Enterprise Loan Ops Desk</strong>
                <p>High-ticket cases (₹1 Cr+) are managed by a dedicated JustRefer enterprise loan manager to ensure fast-track underwriting.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE 2: Real Digital Lending Routing Engine */}
      <section className="feature-section alt-bg">
        <div className="container">
          <div className="feature-grid reversed">
            {/* Left Card: Live Multi-Bank Underwriting & Sanction Pipeline */}
            <div className="routing-card-wrapper">
              <div className="routing-engine-card">
                <div className="routing-card-top">
                  <div className="routing-live-badge">
                    ● Live Underwriting Routing
                  </div>
                  <div className="routing-lead-header">
                    <span className="routing-lead-name">Kavita Patel (Director, TechSphere)</span>
                    <span className="routing-lead-amount">₹80,00,000</span>
                  </div>
                  <div className="routing-lead-meta">
                    Home Loan • Bengaluru • CIBIL Score: 785 (Verified)
                  </div>
                </div>

                <div className="routing-match-title">Multi-Lender Credit Policy Match</div>
                <div className="routing-lender-matches">
                  <div className="lender-match-item is-best">
                    <div className="lender-match-left">
                      <div className="lender-logo-circle" style={{ color: '#004c8f' }}>HDFC</div>
                      <div>
                        <div className="lender-name-text">HDFC Bank</div>
                        <div className="lender-terms-text">8.50% p.a. • Pre-approved in 24 hrs</div>
                      </div>
                    </div>
                    <div className="lender-match-right">
                      <span className="match-odds-pill">96% Sanction Odds</span>
                      <span className="match-recom-tag">★ Best Match</span>
                    </div>
                  </div>

                  <div className="lender-match-item">
                    <div className="lender-match-left">
                      <div className="lender-logo-circle" style={{ color: '#b02a30' }}>ICICI</div>
                      <div>
                        <div className="lender-name-text">ICICI Bank</div>
                        <div className="lender-terms-text">8.55% p.a. • 48 hrs processing</div>
                      </div>
                    </div>
                    <div className="lender-match-right">
                      <span className="match-odds-pill" style={{ background: '#f1f5f9', color: '#475569' }}>91% Odds</span>
                    </div>
                  </div>

                  <div className="lender-match-item">
                    <div className="lender-match-left">
                      <div className="lender-logo-circle" style={{ color: '#97144d' }}>AXIS</div>
                      <div>
                        <div className="lender-name-text">Axis Bank</div>
                        <div className="lender-terms-text">8.60% p.a. • 72 hrs processing</div>
                      </div>
                    </div>
                    <div className="lender-match-right">
                      <span className="match-odds-pill" style={{ background: '#f1f5f9', color: '#475569' }}>87% Odds</span>
                    </div>
                  </div>
                </div>

                <div className="routing-stepper">
                  <div className="stepper-header">Digital Application Milestones</div>
                  <div className="stepper-steps-row">
                    <div className="step-indicator">
                      <div className="step-dot done">✓</div>
                      <span className="step-label">Lead Submitted</span>
                    </div>
                    <div className="step-indicator">
                      <div className="step-dot done">✓</div>
                      <span className="step-label">Bank Field Ops</span>
                    </div>
                    <div className="step-indicator">
                      <div className="step-dot done">✓</div>
                      <span className="step-label">Sanction Issued</span>
                    </div>
                    <div className="step-indicator">
                      <div className="step-dot active">●</div>
                      <span className="step-label">Disbursal & Payout</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Text */}
            <div className="feature-text">
              <span className="products-tag-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: '#eff6ff', color: '#2563eb', borderRadius: 100, fontSize: 12, fontWeight: 700, marginBottom: 14 }}>
                INTELLIGENT LOAN MATCHING
              </span>
              <h2 style={{ fontSize: '34px', lineHeight: 1.25, fontWeight: 800, color: '#0f172a', margin: '0 0 16px', letterSpacing: '-0.5px' }}>
                Automated Multi-Bank Eligibility Engine
              </h2>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6, margin: '0 0 20px' }}>
                Avoid manual bank rejections and delayed sanctions. JustRefer's algorithmic underwriting engine matches each borrower's profile against real-time credit policies from 24+ scheduled banks and NBFCs to ensure the highest approval probability.
              </p>
              
              <div className="feature-pillars-row" style={{ marginTop: 0 }}>
                <div className="feature-pillar-item">
                  <div className="pillar-check">✓</div>
                  <span><strong>Algorithmic Underwriting Match:</strong> Cross-references credit score, income streams, and collateral type to select the right bank before file submission.</span>
                </div>
                <div className="feature-pillar-item">
                  <div className="pillar-check">✓</div>
                  <span><strong>Real-Time WhatsApp Milestone Alerts:</strong> Automated status tracking at every phase: Ingested, Sanctioned, Legal Clear, Disbursed, and Commission Transferred.</span>
                </div>
                <div className="feature-pillar-item">
                  <div className="pillar-check">✓</div>
                  <span><strong>Single Digital Entry:</strong> No need to submit physical paperwork to multiple branches. One 30-second digital referral covers India's top lending institutions.</span>
                </div>
              </div>

              <p className="feature-disclaimer-text" style={{ marginTop: 24, fontSize: '12px', color: '#94a3b8' }}>
                All lending institutions are RBI-regulated scheduled commercial banks and licensed NBFCs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default FeatureSections
