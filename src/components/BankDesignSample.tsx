import { useState } from 'react'
import '../styles/bank-theme.css'

interface BankDesignSampleProps {
  onClosePreview?: () => void
}

export default function BankDesignSample({ onClosePreview }: BankDesignSampleProps) {
  const [loanType, setLoanType] = useState('Home Loan')
  const [loanAmount, setLoanAmount] = useState('10000000') // 1 Cr

  const calculateCommission = (type: string, amountStr: string) => {
    const amt = parseFloat(amountStr) || 0
    let rate = 0.003
    if (type === 'Loan Against Property') rate = 0.005
    if (type === 'Personal Loan') rate = 0.015
    if (type === 'Business Loan') rate = 0.0125
    return Math.round(amt * rate)
  }

  const commissionYield = calculateCommission(loanType, loanAmount)

  return (
    <div className="bank-preview-container">
      {/* Top Preview Banner with Switcher */}
      <div style={{
        background: '#041324',
        borderBottom: '2px solid #C59B27',
        color: '#f8fafc',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            background: '#C59B27',
            color: '#071527',
            fontWeight: 800,
            fontSize: '0.72rem',
            padding: '2px 8px',
            borderRadius: '4px',
            textTransform: 'uppercase'
          }}>
            PROPOSAL PREVIEW
          </span>
          <strong>Institutional Bank-Style Redesign Prototype</strong>
          <span style={{ color: '#94a3b8' }}>— Demonstrating bank-grade aesthetic, layout & typography</span>
        </div>
        {onClosePreview && (
          <button 
            onClick={onClosePreview}
            style={{
              background: 'transparent',
              border: '1px solid #94a3b8',
              color: '#f8fafc',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            Switch to Original UI
          </button>
        )}
      </div>

      {/* 1. Bank Top Utility Bar */}
      <div className="bank-utility-bar">
        <div className="bank-utility-inner">
          <div className="bank-utility-links">
            <a href="#retail" className="bank-utility-tab active">DSA Referral Network</a>
            <span className="bank-utility-divider">|</span>
            <a href="#corporate" className="bank-utility-tab">Corporate Partners</a>
            <span className="bank-utility-divider">|</span>
            <a href="#borrowers" className="bank-utility-tab">Direct Borrowers</a>
            <span className="bank-utility-divider">|</span>
            <a href="#nri" className="bank-utility-tab">NRI Desk</a>
          </div>
          <div className="bank-utility-right">
            <span className="bank-security-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              256-Bit Encrypted
            </span>
            <a href="tel:18004197333" className="bank-helpline">
              <span>Helpline:</span>
              <strong>1800-419-7333</strong>
            </a>
            <a href="#portal" className="bank-netbanking-btn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              Partner Portal Login
            </a>
          </div>
        </div>
      </div>

      {/* 2. Primary Bank Navbar */}
      <header className="bank-main-nav">
        <div className="bank-nav-inner">
          <a href="#" className="bank-brand">
            <div className="bank-brand-crest">JR</div>
            <div className="bank-brand-text">
              <h1>JustRefer</h1>
              <span>Institutional Loan Intermediation</span>
            </div>
          </a>

          <ul className="bank-menu">
            <li><a href="#products-table" className="bank-menu-link">Loan Catalogs</a></li>
            <li><a href="#rates" className="bank-menu-link">Rates & Matrix</a></li>
            <li><a href="#tiers" className="bank-menu-link">Privilege Tiers</a></li>
            <li><a href="#calculator" className="bank-menu-link">Financial Tools</a></li>
            <li><a href="#regulatory" className="bank-menu-link">Regulatory Compliance</a></li>
          </ul>

          <div className="bank-nav-actions">
            <a href="#track" className="btn-bank-outline">Track Referral</a>
            <a href="#register" className="btn-bank-solid">Become Authorized Partner</a>
          </div>
        </div>
      </header>

      {/* 3. Live Benchmark Lending Rate Ticker */}
      <div className="bank-rate-ticker">
        <div className="bank-rate-inner">
          <div className="bank-ticker-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            Benchmark Rates
          </div>
          <div className="bank-rate-items">
            <div className="bank-rate-item">
              <span className="bank-rate-name">Home Loans:</span>
              <span className="bank-rate-val">8.35% p.a.*</span>
              <span className="bank-rate-yield">Earn 0.30%</span>
            </div>
            <div className="bank-rate-item">
              <span className="bank-rate-name">LAP:</span>
              <span className="bank-rate-val">9.20% p.a.*</span>
              <span className="bank-rate-yield">Earn 0.50%</span>
            </div>
            <div className="bank-rate-item">
              <span className="bank-rate-name">Personal Loans:</span>
              <span className="bank-rate-val">10.49% p.a.*</span>
              <span className="bank-rate-yield">Earn up to 1.5%</span>
            </div>
            <div className="bank-rate-item">
              <span className="bank-rate-name">Business Loans:</span>
              <span className="bank-rate-val">11.99% p.a.*</span>
              <span className="bank-rate-yield">Earn up to 1.25%</span>
            </div>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
            Settlement SLA: <strong>T+2 Days via NEFT</strong>
          </div>
        </div>
      </div>

      {/* 4. Bank Hero Section */}
      <section className="bank-hero">
        <div className="bank-hero-inner">
          <div className="bank-hero-left">
            <div className="bank-hero-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
              RBI-COMPLIANT LENDING NETWORK PARTNER
            </div>
            <h1 className="bank-hero-title">
              India's Premier Institutional <span>Loan Referral</span> Network
            </h1>
            <p className="bank-hero-subtitle">
              Facilitate retail and corporate loan disbursals with 40+ leading banks and NBFCs. 
              Earn industry-leading upfront commissions with transparent payout governance and dedicated relationship management.
            </p>
            <div className="bank-hero-ctas">
              <a href="#partner-register" className="btn-bank-primary-lg">
                Register as DSA Partner
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
              <a href="#products-table" className="btn-bank-secondary-lg">
                View Loan Rate Matrix
              </a>
            </div>

            <div className="bank-hero-trust-metrics">
              <div className="bank-trust-stat">
                <h4>₹500+ Cr</h4>
                <p>Cumulative Disbursal</p>
              </div>
              <div className="bank-trust-stat">
                <h4>40+ Banks</h4>
                <p>Authorized Panel</p>
              </div>
              <div className="bank-trust-stat">
                <h4>99.4%</h4>
                <p>On-Time Payout SLA</p>
              </div>
            </div>
          </div>

          {/* Quick Lead Yield Estimator Widget */}
          <div className="bank-hero-right">
            <div className="bank-quick-card">
              <div className="bank-quick-card-head">
                <h3>Express Yield Estimator</h3>
                <p>Calculate your immediate referral payout on client disbursals</p>
              </div>
              <div className="bank-input-group">
                <label>Select Loan Category</label>
                <select 
                  className="bank-select" 
                  value={loanType} 
                  onChange={(e) => setLoanType(e.target.value)}
                >
                  <option value="Home Loan">Home Loan (0.30% Yield)</option>
                  <option value="Loan Against Property">Loan Against Property (0.50% Yield)</option>
                  <option value="Personal Loan">Personal Loan (1.50% Yield)</option>
                  <option value="Business Loan">Business Loan (1.25% Yield)</option>
                </select>
              </div>
              <div className="bank-input-group">
                <label>Target Disbursal Volume (₹)</label>
                <input 
                  type="number" 
                  className="bank-input" 
                  value={loanAmount} 
                  onChange={(e) => setLoanAmount(e.target.value)}
                  step="500000"
                />
              </div>
              <div className="bank-yield-preview">
                <span>Estimated Partner Commission:</span>
                <strong>₹{commissionYield.toLocaleString('en-IN')}</strong>
              </div>
              <button className="btn-bank-submit" onClick={() => alert(`Ready to refer ₹${loanAmount} for ${loanType}? Submit via Partner Portal!`)}>
                Proceed to Submit Referral
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Floating Banking Action Deck */}
      <div className="bank-action-deck-wrap">
        <div className="bank-action-deck">
          <a href="#calculator" className="bank-action-tile">
            <div className="bank-action-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/></svg>
            </div>
            <div className="bank-action-text">
              <h4>EMI & Yield Engine</h4>
              <p>Simulate amortizations and partner payout returns</p>
            </div>
          </a>

          <a href="#submit" className="bank-action-tile">
            <div className="bank-action-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <div className="bank-action-text">
              <h4>Expedited Lead Entry</h4>
              <p>Direct single-window client dossier lodgement</p>
            </div>
          </a>

          <a href="#track" className="bank-action-tile">
            <div className="bank-action-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <div className="bank-action-text">
              <h4>Lead Status Tracker</h4>
              <p>Real-time banking underwriting stage visibility</p>
            </div>
          </a>

          <a href="#tiers" className="bank-action-tile">
            <div className="bank-action-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <div className="bank-action-text">
              <h4>Privilege Program</h4>
              <p>Unlock RM access and volume bonus multipliers</p>
            </div>
          </a>
        </div>
      </div>

      {/* 6. Institutional Product Comparison Matrix Section */}
      <section className="bank-section" id="products-table">
        <div className="bank-section-header">
          <span className="bank-section-tag">Institutional Rate Schedule</span>
          <h2 className="bank-section-title">Comprehensive Loan Product Catalogs</h2>
          <p className="bank-section-desc">
            Competitive interest rates paired with transparent partner payout slabs across India's top lending institutions.
          </p>
        </div>

        <div className="bank-table-card">
          <div className="bank-table-wrapper">
            <table className="bank-rate-table">
              <thead>
                <tr>
                  <th>Product Category</th>
                  <th>Benchmark Rate</th>
                  <th>Maximum Ticket</th>
                  <th>Tenure</th>
                  <th>Processing Fee</th>
                  <th>Partner Commission Yield</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="bank-product-cell">
                      <div className="bank-prod-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                      </div>
                      <div className="bank-prod-info">
                        <strong>Home Loan</strong>
                        <span>Purchase, Construction & Resale</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="bank-rate-val-cell">8.35% - 11.50%</span></td>
                  <td>₹100 Crore</td>
                  <td>Up to 30 Yrs</td>
                  <td>0.25% - 1.00%</td>
                  <td><span className="bank-yield-badge-cell">₹30,000 / Cr (0.3%)</span></td>
                  <td><a href="#apply" className="btn-table-action">Refer Now</a></td>
                </tr>

                <tr>
                  <td>
                    <div className="bank-product-cell">
                      <div className="bank-prod-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                      </div>
                      <div className="bank-prod-info">
                        <strong>Loan Against Property (LAP)</strong>
                        <span>Commercial & Residential Collateral</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="bank-rate-val-cell">9.20% - 13.00%</span></td>
                  <td>₹100 Crore</td>
                  <td>Up to 20 Yrs</td>
                  <td>0.50% - 1.50%</td>
                  <td><span className="bank-yield-badge-cell">₹50,000 / Cr (0.5%)</span></td>
                  <td><a href="#apply" className="btn-table-action">Refer Now</a></td>
                </tr>

                <tr>
                  <td>
                    <div className="bank-product-cell">
                      <div className="bank-prod-icon" style={{ background: '#dcfce7', color: '#15803d' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <div className="bank-prod-info">
                        <strong>Personal Loan</strong>
                        <span>Unsecured Instant Liquidity</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="bank-rate-val-cell">10.49% - 24.00%</span></td>
                  <td>₹40 Lakh</td>
                  <td>Up to 5 Yrs</td>
                  <td>1.00% - 2.50%</td>
                  <td><span className="bank-yield-badge-cell">Up to 1.50%</span></td>
                  <td><a href="#apply" className="btn-table-action">Refer Now</a></td>
                </tr>

                <tr>
                  <td>
                    <div className="bank-product-cell">
                      <div className="bank-prod-icon" style={{ background: '#ede9fe', color: '#6d28d9' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                      </div>
                      <div className="bank-prod-info">
                        <strong>Business & MSME Loan</strong>
                        <span>Working Capital & Expansion</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="bank-rate-val-cell">11.99% - 22.00%</span></td>
                  <td>₹75 Lakh</td>
                  <td>Up to 7 Yrs</td>
                  <td>1.25% - 2.00%</td>
                  <td><span className="bank-yield-badge-cell">Up to 1.25%</span></td>
                  <td><a href="#apply" className="btn-table-action">Refer Now</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. Priority Partner Privilege Tiers */}
      <section className="bank-section" id="tiers" style={{ background: '#f1f5f9' }}>
        <div className="bank-section-header">
          <span className="bank-section-tag">Tiered Incentive Framework</span>
          <h2 className="bank-section-title">Privilege Partner Membership Tiers</h2>
          <p className="bank-section-desc">
            Structured partner grades designed like Private Wealth tiers, rewarding cumulative quarterly disbursal volumes.
          </p>
        </div>

        <div className="bank-tiers-grid">
          {/* Silver */}
          <div className="bank-tier-card">
            <h3 className="bank-tier-name">Silver Associate</h3>
            <p className="bank-tier-subtitle">Entry tier for active individual referrers</p>
            <div className="bank-tier-bonus">
              Base <small>Standard Commission</small>
            </div>
            <ul className="bank-tier-perks">
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Standard T+2 Payout Settlement
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Online Lead Tracking Portal
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Access to 40+ Bank Products
              </li>
            </ul>
            <a href="#join-silver" className="btn-bank-outline" style={{ display: 'block', textAlign: 'center' }}>
              Enrol as Silver
            </a>
          </div>

          {/* Gold */}
          <div className="bank-tier-card featured">
            <div className="bank-tier-badge">MOST POPULAR TIER</div>
            <h3 className="bank-tier-name">Gold Privilege Partner</h3>
            <p className="bank-tier-subtitle">For established financial consultants & agents</p>
            <div className="bank-tier-bonus">
              +10% <small>Volume Incentive Bonus</small>
            </div>
            <ul className="bank-tier-perks">
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Dedicated Relationship Manager
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Priority Credit Appraisal Queue
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                24-Hour Expedited Disbursal Escrow
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Quarterly Cash Bonus Pool
              </li>
            </ul>
            <a href="#join-gold" className="btn-bank-solid" style={{ display: 'block', textAlign: 'center', background: '#C59B27', borderColor: '#C59B27', color: '#071527' }}>
              Qualify for Gold Privilege
            </a>
          </div>

          {/* Platinum */}
          <div className="bank-tier-card">
            <h3 className="bank-tier-name">Platinum Wealth Partner</h3>
            <p className="bank-tier-subtitle">Institutional DSAs & High Net-Worth intermediaries</p>
            <div className="bank-tier-bonus">
              +25% <small>Maximum Bonus Yield</small>
            </div>
            <ul className="bank-tier-perks">
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Direct Bank Underwriting Desk Access
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Same-Day Instant Disbursal Settlement
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Custom White-label Referral Landing Page
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Executive Concierge Desk
              </li>
            </ul>
            <a href="#join-platinum" className="btn-bank-outline" style={{ display: 'block', textAlign: 'center' }}>
              Apply for Platinum Desk
            </a>
          </div>
        </div>
      </section>

      {/* 8. Authorized Lending Partner Strip */}
      <div className="bank-lenders-strip">
        <div className="bank-lenders-inner">
          <p>AUTHORIZED DIRECT REFERRAL PARTNER FOR INDIA'S FOREMOST SCHEDULED COMMERCIAL BANKS & NBFCs</p>
          <div className="bank-lender-badges">
            <div className="bank-lender-pill">🏦 HDFC Bank</div>
            <div className="bank-lender-pill">🏛️ State Bank of India (SBI)</div>
            <div className="bank-lender-pill">🏢 ICICI Bank</div>
            <div className="bank-lender-pill">🏛️ Axis Bank</div>
            <div className="bank-lender-pill">🏦 Kotak Mahindra Bank</div>
            <div className="bank-lender-pill">📈 Tata Capital</div>
            <div className="bank-lender-pill">🛡️ Bajaj Finserv</div>
          </div>
        </div>
      </div>
    </div>
  )
}
