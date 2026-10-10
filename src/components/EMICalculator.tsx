import { useState, useMemo } from 'react'

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(1000000)
  const [loanTerm, setLoanTerm] = useState(12)
  const [firstName, setFirstName] = useState('')
  const [phone, setPhone] = useState('')
  const rate = 8.5

  const { emi, totalInterest, totalRepayment, commission } = useMemo(() => {
    const mr = rate / 12 / 100
    const m = loanTerm
    const e = Math.round((loanAmount * mr * Math.pow(1 + mr, m)) / (Math.pow(1 + mr, m) - 1))
    const total = e * m
    const interest = total - loanAmount
    return {
      emi: isNaN(e) ? 0 : e,
      totalInterest: isNaN(interest) ? 0 : interest,
      totalRepayment: isNaN(total) ? 0 : total,
      commission: Math.round(loanAmount * 0.003),
    }
  }, [loanAmount, loanTerm])

  return (
    <section className="calc-section" id="calculator">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="section-eyebrow">Calculator</span>
          <h2 className="section-heading">Estimate Repayments</h2>
        </div>

        <div className="calc-wrapper">
          <form className="calc-layout" onSubmit={(e) => { e.preventDefault(); alert(`Thank you ${firstName || 'partner'}! We'll contact you at ${phone || 'your number'} shortly.`) }}>
            <div className="calc-form">
              <h3>Enter your details</h3>
              <p>Simply enter your loan amount and terms to see what works best for you.</p>

              <div className="calc-inputs-grid">
                <div className="calc-field">
                  <label>Loan Amount (₹)</label>
                  <input className="calc-input" type="number" value={loanAmount} onChange={e => setLoanAmount(Math.max(10000, Number(e.target.value)))} step="50000" min="10000" />
                </div>
                <div className="calc-field">
                  <label>Loan Term</label>
                  <select className="calc-select" value={loanTerm} onChange={e => setLoanTerm(Number(e.target.value))}>
                    <option value={6}>6 Months</option>
                    <option value={12}>12 Months</option>
                    <option value={24}>24 Months</option>
                    <option value={36}>36 Months</option>
                    <option value={60}>60 Months</option>
                    <option value={120}>120 Months</option>
                    <option value={240}>240 Months</option>
                  </select>
                </div>
              </div>

              <div className="calc-inputs-grid">
                <div className="calc-field">
                  <label>First Name</label>
                  <input className="calc-input" type="text" placeholder="Your name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div className="calc-field">
                  <label>Phone Number</label>
                  <input className="calc-input" type="tel" placeholder="10-digit mobile" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>

              <p className="calc-note">
                Emergency cash when you need it — transparent rates, zero hidden charges. By submitting you agree to be contacted regarding your loan query.
              </p>
            </div>

            <div className="calc-result">
              <div>
                <div className="calc-result-label">Monthly Repayment</div>
                <div className="calc-result-amount">₹{emi.toLocaleString('en-IN')}</div>
                <div className="calc-result-sub">Estimated EMI @ {rate}% p.a.</div>

                <div className="calc-result-lines">
                  <div className="calc-line">
                    <span>Total Interest & Fees</span>
                    <strong>₹{totalInterest.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="calc-line">
                    <span>Total Loan Repayment</span>
                    <strong>₹{totalRepayment.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="calc-line highlight">
                    <span>Referrer Commission</span>
                    <strong>₹{commission.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-calc">Apply Now</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default EMICalculator
