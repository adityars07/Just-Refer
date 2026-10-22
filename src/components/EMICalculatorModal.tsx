import { useState, useEffect, useMemo } from 'react'

interface EMICalculatorModalProps {
  isOpen: boolean
  onClose: () => void
  onReferClick?: () => void
}

type LoanProduct = 'home-loan' | 'lap' | 'personal-loan' | 'business-loan'

interface ProductConfig {
  id: LoanProduct
  label: string
  sublabel: string
  payoutRate: number // commission % for JustRefer partners
  minRate: number
  maxRate: number
  defaultRate: number
  minAmount: number
  maxAmount: number
  defaultAmount: number
  minTenureYears: number
  maxTenureYears: number
  defaultTenureYears: number
  stepAmount: number
  quickAmounts: number[]
}

const PRODUCTS: Record<LoanProduct, ProductConfig> = {
  'home-loan': {
    id: 'home-loan',
    label: 'Home Loan',
    sublabel: 'Purchase, Resale & Balance Transfer',
    payoutRate: 0.5,
    minRate: 7.25,
    maxRate: 15.0,
    defaultRate: 7.25,
    minAmount: 500000,
    maxAmount: 50000000,
    defaultAmount: 5000000,
    minTenureYears: 5,
    maxTenureYears: 30,
    defaultTenureYears: 20,
    stepAmount: 100000,
    quickAmounts: [2500000, 5000000, 7500000, 10000000, 20000000],
  },
  'lap': {
    id: 'lap',
    label: 'Loan Against Property',
    sublabel: 'Commercial & Residential Mortgage',
    payoutRate: 0.75,
    minRate: 8.0,
    maxRate: 18.0,
    defaultRate: 8.0,
    minAmount: 1000000,
    maxAmount: 100000000,
    defaultAmount: 10000000,
    minTenureYears: 3,
    maxTenureYears: 20,
    defaultTenureYears: 15,
    stepAmount: 500000,
    quickAmounts: [5000000, 10000000, 20000000, 50000000],
  },
  'personal-loan': {
    id: 'personal-loan',
    label: 'Personal Loan',
    sublabel: 'Instant Unsecured Financing',
    payoutRate: 1.5,
    minRate: 9.99,
    maxRate: 26.0,
    defaultRate: 9.99,
    minAmount: 100000,
    maxAmount: 5000000,
    defaultAmount: 500000,
    minTenureYears: 1,
    maxTenureYears: 6,
    defaultTenureYears: 4,
    stepAmount: 50000,
    quickAmounts: [200000, 500000, 1000000, 2000000],
  },
  'business-loan': {
    id: 'business-loan',
    label: 'Business Loan',
    sublabel: 'Working Capital & Expansion',
    payoutRate: 1.25,
    minRate: 10.99,
    maxRate: 26.0,
    defaultRate: 10.99,
    minAmount: 500000,
    maxAmount: 50000000,
    defaultAmount: 2500000,
    minTenureYears: 1,
    maxTenureYears: 8,
    defaultTenureYears: 5,
    stepAmount: 100000,
    quickAmounts: [1000000, 2500000, 5000000, 10000000],
  },
}

function formatINRShort(val: number): string {
  if (val >= 10000000) {
    const cr = val / 10000000
    return `₹${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr`
  }
  if (val >= 100000) {
    const lac = val / 100000
    return `₹${lac % 1 === 0 ? lac : lac.toFixed(2)} Lac`
  }
  return `₹${val.toLocaleString('en-IN')}`
}

function formatINRFull(val: number): string {
  return `₹${Math.round(val).toLocaleString('en-IN')}`
}

interface AmortizationRow {
  year: number
  openingBalance: number
  principalPaid: number
  interestPaid: number
  closingBalance: number
}

const EMICalculatorModal = ({ isOpen, onClose, onReferClick }: EMICalculatorModalProps) => {
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct>('home-loan')
  const [amount, setAmount] = useState<number>(5000000)
  const [rate, setRate] = useState<number>(7.25)
  const [tenureYears, setTenureYears] = useState<number>(20)
  const [activeTab, setActiveTab] = useState<'summary' | 'schedule'>('summary')

  const product = PRODUCTS[selectedProduct]

  // When product changes, sync realistic initial values
  const handleProductSelect = (pId: LoanProduct) => {
    setSelectedProduct(pId)
    const p = PRODUCTS[pId]
    setAmount(p.defaultAmount)
    setRate(p.defaultRate)
    setTenureYears(p.defaultTenureYears)
  }

  // EMI Math Calculation
  const calculation = useMemo(() => {
    const P = amount
    const annualRate = rate
    const n = tenureYears * 12

    if (P <= 0 || annualRate <= 0 || n <= 0) {
      return {
        emi: 0,
        totalInterest: 0,
        totalPayment: 0,
        months: 0,
        principalPercent: 50,
        interestPercent: 50,
        partnerCommission: 0,
        firstMonthInterest: 0,
        firstMonthPrincipal: 0,
        schedule: [] as AmortizationRow[],
      }
    }

    const monthlyRate = annualRate / 12 / 100
    const factor = Math.pow(1 + monthlyRate, n)
    const emi = (P * monthlyRate * factor) / (factor - 1)
    const totalPayment = emi * n
    const totalInterest = totalPayment - P

    const principalPercent = totalPayment > 0 ? (P / totalPayment) * 100 : 50
    const interestPercent = 100 - principalPercent

    // Partner commission estimate on loan amount
    const partnerCommission = Math.round((P * product.payoutRate) / 100)

    const firstMonthInterest = P * monthlyRate
    const firstMonthPrincipal = emi - firstMonthInterest

    // Amortization Schedule (Year-by-year)
    let balance = P
    const schedule: AmortizationRow[] = []
    const displayYears = Math.min(tenureYears, 10) // Show up to first 10 years or all

    for (let yr = 1; yr <= displayYears; yr++) {
      let yrPrincipal = 0
      let yrInterest = 0
      const openBal = balance

      for (let m = 1; m <= 12; m++) {
        if (balance <= 0) break
        const mInterest = balance * monthlyRate
        const mPrincipal = emi - mInterest
        yrInterest += mInterest
        yrPrincipal += mPrincipal
        balance -= mPrincipal
      }

      schedule.push({
        year: yr,
        openingBalance: Math.max(0, openBal),
        principalPaid: yrPrincipal,
        interestPaid: yrInterest,
        closingBalance: Math.max(0, balance),
      })
    }

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      months: n,
      principalPercent,
      interestPercent,
      partnerCommission,
      firstMonthInterest: Math.round(firstMonthInterest),
      firstMonthPrincipal: Math.round(firstMonthPrincipal),
      schedule,
    }
  }, [amount, rate, tenureYears, product.payoutRate])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Tenure quick options based on product
  const tenurePresets = [
    5, 10, 15, 20, 25, 30
  ].filter(t => t >= product.minTenureYears && t <= product.maxTenureYears)

  return (
    <div className="jr-emi-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="jr-emi-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Top Bar */}
        <div className="jr-emi-header">
          <div className="jr-emi-header-left">
            <div className="jr-emi-badge">
              <span className="jr-emi-badge-dot" />
              FINANCIAL CALCULATOR
            </div>
            <h2 className="jr-emi-title">Loan EMI & Commission Planner</h2>
            <p className="jr-emi-subtitle">
              Interactive instalment modeling with real-time JustRefer partner payouts.
            </p>
          </div>
          <button
            type="button"
            className="jr-emi-close-btn"
            onClick={onClose}
            aria-label="Close EMI Calculator"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Product Navigation Segment */}
        <div className="jr-emi-products-row">
          {(Object.keys(PRODUCTS) as LoanProduct[]).map((pKey) => {
            const p = PRODUCTS[pKey]
            const isSelected = selectedProduct === pKey
            return (
              <button
                key={pKey}
                type="button"
                className={`jr-emi-product-card ${isSelected ? 'is-active' : ''}`}
                onClick={() => handleProductSelect(pKey)}
              >
                <div className="jr-emi-product-icon-wrap">
                  {pKey === 'home-loan' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  )}
                  {pKey === 'lap' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="2" width="16" height="20" rx="2" />
                      <path d="M9 22v-4h6v4" />
                      <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
                    </svg>
                  )}
                  {pKey === 'personal-loan' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  )}
                  {pKey === 'business-loan' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  )}
                </div>
                <div className="jr-emi-product-text">
                  <span className="jr-emi-product-name">{p.label}</span>
                  <span className="jr-emi-product-rate">From {p.minRate}% p.a.</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Modal Main Content */}
        <div className="jr-emi-body-layout">
          
          {/* Left Column: Sliders & Controls */}
          <div className="jr-emi-inputs-column">
            
            {/* Amount Slider & Presets */}
            <div className="jr-emi-control-card">
              <div className="jr-emi-control-header">
                <div>
                  <label className="jr-emi-control-label" htmlFor="loan-amount-range">
                    Loan Amount Required
                  </label>
                  <span className="jr-emi-control-hint">Min {formatINRShort(product.minAmount)} — Max {formatINRShort(product.maxAmount)}</span>
                </div>
                <div className="jr-emi-display-box">
                  <span className="jr-emi-currency-prefix">₹</span>
                  <span className="jr-emi-display-number">{amount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Slider */}
              <div className="jr-emi-slider-wrap">
                <input
                  id="loan-amount-range"
                  type="range"
                  className="jr-emi-slider"
                  min={product.minAmount}
                  max={product.maxAmount}
                  step={product.stepAmount}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, #059669 0%, #10b981 ${((amount - product.minAmount) / (product.maxAmount - product.minAmount)) * 100}%, #e2e8f0 ${((amount - product.minAmount) / (product.maxAmount - product.minAmount)) * 100}%, #e2e8f0 100%)`
                  }}
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="jr-emi-presets-row">
                {product.quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className={`jr-emi-preset-chip ${amount === q ? 'is-active' : ''}`}
                    onClick={() => setAmount(q)}
                  >
                    {formatINRShort(q)}
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate (No range restriction) */}
            <div className="jr-emi-control-card">
              <div className="jr-emi-control-header">
                <div>
                  <label className="jr-emi-control-label" htmlFor="interest-rate-input">
                    Interest Rate (% per annum)
                  </label>
                  <span className="jr-emi-control-hint">Enter any rate without restriction</span>
                </div>

                <div className="jr-emi-stepper-box" style={{ padding: '4px 6px' }}>
                  <button
                    type="button"
                    className="jr-emi-stepper-btn"
                    onClick={() => setRate(prev => Math.max(0.1, +(prev - 0.1).toFixed(2)))}
                    aria-label="Decrease interest rate"
                  >
                    −
                  </button>
                  <div style={{ display: 'inline-flex', alignItems: 'center', margin: '0 4px' }}>
                    <input
                      id="interest-rate-input"
                      type="number"
                      step="0.05"
                      min="0.1"
                      value={rate}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value)
                        setRate(isNaN(val) ? 0 : val)
                      }}
                      className="jr-emi-rate-input"
                      style={{
                        width: '70px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        background: '#ffffff',
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: '15px',
                        color: '#0f172a',
                        padding: '4px 2px',
                        outline: 'none',
                      }}
                    />
                    <span style={{ fontWeight: 700, fontSize: '14px', color: '#64748b', marginLeft: '4px' }}>%</span>
                  </div>
                  <button
                    type="button"
                    className="jr-emi-stepper-btn"
                    onClick={() => setRate(prev => +(prev + 0.1).toFixed(2))}
                    aria-label="Increase interest rate"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Tenure & Quick Years */}
            <div className="jr-emi-control-card">
              <div className="jr-emi-control-header">
                <div>
                  <label className="jr-emi-control-label" htmlFor="tenure-range">
                    Loan Tenure (Duration)
                  </label>
                  <span className="jr-emi-control-hint">Total: {calculation.months} Monthly Payments</span>
                </div>
                <div className="jr-emi-display-box">
                  <span className="jr-emi-display-number">{tenureYears}</span>
                  <span className="jr-emi-currency-prefix" style={{ marginLeft: 4 }}>Years</span>
                </div>
              </div>

              <div className="jr-emi-slider-wrap">
                <input
                  id="tenure-range"
                  type="range"
                  className="jr-emi-slider"
                  min={product.minTenureYears}
                  max={product.maxTenureYears}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, #059669 0%, #10b981 ${((tenureYears - product.minTenureYears) / (product.maxTenureYears - product.minTenureYears)) * 100}%, #e2e8f0 ${((tenureYears - product.minTenureYears) / (product.maxTenureYears - product.minTenureYears)) * 100}%, #e2e8f0 100%)`
                  }}
                />
              </div>

              {/* Quick Tenure Chips */}
              <div className="jr-emi-presets-row">
                {tenurePresets.map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    className={`jr-emi-preset-chip ${tenureYears === yr ? 'is-active' : ''}`}
                    onClick={() => setTenureYears(yr)}
                  >
                    {yr} Yrs
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: High-End Fintech Results Card */}
          <div className="jr-emi-results-column">
            
            {/* Dark Obsidian Hero EMI Card */}
            <div className="jr-emi-hero-card">
              <div className="jr-emi-hero-pattern" />
              <div className="jr-emi-hero-content">
                <div className="jr-emi-hero-tag">MONTHLY INSTALMENT (EMI)</div>
                <div className="jr-emi-hero-amount">
                  {formatINRFull(calculation.emi)}
                  <span className="jr-emi-hero-period">/ month</span>
                </div>
                <div className="jr-emi-hero-sub">
                  Month 1: {formatINRFull(calculation.firstMonthPrincipal)} Principal + {formatINRFull(calculation.firstMonthInterest)} Interest
                </div>

                {/* JustRefer Commission Pill */}
                <div className="jr-emi-commission-badge">
                  <div className="jr-emi-commission-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div className="jr-emi-commission-text">
                    Referral Earning: <strong>{formatINRFull(calculation.partnerCommission)}</strong>
                    <span className="jr-emi-commission-rate">({product.payoutRate}% payout)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab switch between Summary & Amortization */}
            <div className="jr-emi-tab-toggle-bar">
              <button
                type="button"
                className={`jr-emi-view-tab ${activeTab === 'summary' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('summary')}
              >
                Cost Breakdown
              </button>
              <button
                type="button"
                className={`jr-emi-view-tab ${activeTab === 'schedule' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('schedule')}
              >
                Amortization Preview
              </button>
            </div>

            {activeTab === 'summary' ? (
              <div className="jr-emi-summary-box">
                {/* Proportional Split Bar */}
                <div className="jr-emi-split-section">
                  <div className="jr-emi-split-labels">
                    <div className="jr-emi-split-label principal">
                      <span className="jr-emi-dot principal" />
                      <span>Principal ({calculation.principalPercent.toFixed(1)}%)</span>
                    </div>
                    <div className="jr-emi-split-label interest">
                      <span className="jr-emi-dot interest" />
                      <span>Interest ({calculation.interestPercent.toFixed(1)}%)</span>
                    </div>
                  </div>

                  <div className="jr-emi-split-bar">
                    <div
                      className="jr-emi-split-fill principal"
                      style={{ width: `${calculation.principalPercent}%` }}
                    />
                    <div
                      className="jr-emi-split-fill interest"
                      style={{ width: `${calculation.interestPercent}%` }}
                    />
                  </div>
                </div>

                {/* Ledger Items */}
                <div className="jr-emi-ledger">
                  <div className="jr-emi-ledger-row">
                    <span className="jr-emi-ledger-title">Principal Loan Amount</span>
                    <span className="jr-emi-ledger-value">{formatINRFull(amount)}</span>
                  </div>
                  <div className="jr-emi-ledger-row">
                    <span className="jr-emi-ledger-title">Total Interest Charges</span>
                    <span className="jr-emi-ledger-value">{formatINRFull(calculation.totalInterest)}</span>
                  </div>
                  <div className="jr-emi-ledger-row total">
                    <span className="jr-emi-ledger-title">Total Repayment Amount</span>
                    <span className="jr-emi-ledger-value highlight">{formatINRFull(calculation.totalPayment)}</span>
                  </div>
                </div>

                {/* Refer Client Action CTA */}
                {onReferClick && (
                  <button
                    type="button"
                    className="jr-emi-cta-button"
                    onClick={() => {
                      onClose()
                      onReferClick()
                    }}
                  >
                    <span>Refer Client & Earn {formatINRFull(calculation.partnerCommission)}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                )}
              </div>
            ) : (
              /* Amortization Schedule Table */
              <div className="jr-emi-schedule-box">
                <div className="jr-emi-schedule-scroll">
                  <table className="jr-emi-table">
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th>Opening</th>
                        <th>Principal</th>
                        <th>Interest</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculation.schedule.map((row) => (
                        <tr key={row.year}>
                          <td className="jr-cell-year">Yr {row.year}</td>
                          <td>{formatINRShort(row.openingBalance)}</td>
                          <td className="jr-cell-principal">{formatINRShort(row.principalPaid)}</td>
                          <td className="jr-cell-interest">{formatINRShort(row.interestPaid)}</td>
                          <td className="jr-cell-balance">{formatINRShort(row.closingBalance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="jr-emi-schedule-footnote">
                  Showing first {calculation.schedule.length} years of {tenureYears}-year amortization.
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Modal Footer Note */}
        <div className="jr-emi-footer">
          <div className="jr-emi-footer-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>
              Calculations are based on monthly reducing balance and indicative partner rates. Actual loan offers, processing fees, and disbursements vary by partner banks and NBFCs.
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default EMICalculatorModal
