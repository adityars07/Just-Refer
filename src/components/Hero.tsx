import { useState, useMemo } from 'react'

const Hero = () => {
  const [loanAmount, setLoanAmount] = useState<number>(1000000)
  const [loanTerm, setLoanTerm] = useState<number>(12)
  const [firstName, setFirstName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [interestRate] = useState<number>(8.5) // 8.5% p.a.

  // Real-time repayment and referrer commission calculations
  const { monthlyEMI, totalInterest, totalRepayment, referralCommission } = useMemo(() => {
    const monthlyRate = interestRate / 12 / 100
    const months = loanTerm
    const emi = Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
    )
    const totalRepay = emi * months
    const interest = totalRepay - loanAmount
    const commission = Math.round(loanAmount * 0.003) // 0.3% commission for referrer
    return {
      monthlyEMI: isNaN(emi) ? 0 : emi,
      totalInterest: isNaN(interest) ? 0 : interest,
      totalRepayment: isNaN(totalRepay) ? 0 : totalRepay,
      referralCommission: commission
    }
  }, [loanAmount, loanTerm, interestRate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Thank you ${firstName || 'valued client'}! Your loan estimate for ₹${loanAmount.toLocaleString('en-IN')} has been submitted for instant processing.`)
  }

  return (
    <section className="hero-section" id="hero">
      <div className="container">
        {/* Hero Top Grid */}
        <div className="hero-main-grid">
          {/* Left Column: Text & CTA */}
          <div className="hero-text-col">
            <span className="hero-kicker">
              APPLY FOR SHORT TERM & LONG TERM LOANS
            </span>
            <h1 className="hero-heading">
              Get The Loan You Need,<br />
              <span>When You Need It</span>
            </h1>
            <p className="hero-description">
              We offer fast, flexible loan options and high referral rewards tailored for hard-working individuals and growing businesses across India.
            </p>

            <div className="hero-cta-row">
              <a href="#calculator" className="btn-pill-primary">
                Apply Now
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>

            {/* Social Proof */}
            <div className="hero-social-proof">
              <div className="avatar-stack">
                <div className="avatar-circle" style={{ background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#065f46' }}>AR</div>
                <div className="avatar-circle" style={{ background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#92400e' }}>SK</div>
                <div className="avatar-circle" style={{ background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#3730a3' }}>RM</div>
              </div>
              <div className="proof-text">
                <strong>1,286+ Happy Customers</strong>
                <div className="proof-rating">
                  ★★★★★ <span>4.8/5 Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Graphic */}
          <div className="hero-visual-col">
            <div className="hero-circle-backdrop">
              <img
                src="/images/products/personal-loan.jpg"
                alt="Happy customer with loan approval"
                className="hero-person-img"
              />
              <div className="floating-badge badge-top-right">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#10b981"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4" stroke="#ffffff" strokeWidth="2"/></svg>
                Instant Pre-Approval
              </div>
              <div className="floating-badge badge-bottom-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Disbursed in 24 Hrs
              </div>
            </div>
          </div>
        </div>

        {/* Hero Bottom: 2-Column Estimate Repayments Card */}
        <div className="hero-calc-card" id="calculator">
          <form className="calc-grid" onSubmit={handleSubmit}>
            {/* Left Form: Inputs */}
            <div className="calc-form-left">
              <h3>Estimate Repayments</h3>
              <p>Simply enter your loan amount and terms to see what works best for you.</p>

              <div className="calc-input-row">
                <div className="calc-field">
                  <label>Loan Amount (₹)</label>
                  <input
                    type="number"
                    className="calc-input"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Math.max(10000, Number(e.target.value)))}
                    step="50000"
                    min="10000"
                    required
                  />
                </div>
                <div className="calc-field">
                  <label>Loan Term / Months</label>
                  <select
                    className="calc-select"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                  >
                    <option value={6}>6 Months</option>
                    <option value={12}>12 Months (1 Year)</option>
                    <option value={24}>24 Months (2 Years)</option>
                    <option value={36}>36 Months (3 Years)</option>
                    <option value={60}>60 Months (5 Years)</option>
                    <option value={120}>120 Months (10 Years)</option>
                    <option value={240}>240 Months (20 Years)</option>
                  </select>
                </div>
              </div>

              <div className="calc-input-row">
                <div className="calc-field">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="calc-input"
                    placeholder="Enter your name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="calc-field">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    className="calc-input"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <p className="calc-disclaimer">
                <strong>Emergency cash when you need it:</strong> Transparent interest rates with zero hidden charges. By submitting this form you agree to instant contact regarding your loan or referral query.
              </p>
            </div>

            {/* Right Form: Mint Highlight Summary */}
            <div className="calc-summary-right">
              <div>
                <div className="summary-heading">Monthly Repayment</div>
                <div className="summary-amount">
                  ₹{monthlyEMI.toLocaleString('en-IN')}
                </div>
                <div className="summary-amount-sub">
                  Estimated monthly installment @ {interestRate}% p.a.
                </div>

                <div className="summary-line-items">
                  <div className="summary-line">
                    <span>Total Interest & Fees:</span>
                    <strong>₹{totalInterest.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="summary-line">
                    <span>Total Loan Repayment:</span>
                    <strong>₹{totalRepayment.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="summary-line highlight">
                    <span>Referrer Commission Yield:</span>
                    <strong>₹{referralCommission.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-calc-apply">
                Apply Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Hero
