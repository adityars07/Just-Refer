import { useState, useEffect, useCallback, useRef } from 'react'

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(3000000)
  const [interestRate, setInterestRate] = useState(10)
  const [tenure, setTenure] = useState(15)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const formatINR = (num: number): string => {
    return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 0 })
  }

  const calculateEMI = useCallback(() => {
    const P = loanAmount
    const r = interestRate / 12 / 100
    const n = tenure * 12

    if (r === 0) {
      return { emi: P / n, totalInterest: 0, totalPayable: P }
    }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalPayable = emi * n
    const totalInterest = totalPayable - P

    return { emi, totalInterest, totalPayable }
  }, [loanAmount, interestRate, tenure])

  const { emi, totalInterest, totalPayable } = calculateEMI()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = 180
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const radius = 70
    const lineWidth = 24

    const interestRatio = totalInterest / totalPayable

    ctx.clearRect(0, 0, size, size)

    // Interest arc
    ctx.beginPath()
    ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * interestRatio)
    ctx.strokeStyle = '#fb923c'
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.stroke()

    // Principal arc
    ctx.beginPath()
    ctx.arc(cx, cy, radius, -Math.PI / 2 + 2 * Math.PI * interestRatio, -Math.PI / 2 + 2 * Math.PI)
    ctx.strokeStyle = '#2D8B2D'
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.stroke()

  }, [loanAmount, totalInterest, totalPayable])

  return (
    <section className="calculator-section" id="calculator">
      <div className="container">
        <span className="section-badge">FINANCIAL TOOL</span>
        <h2 className="section-title">EMI Calculator</h2>
        <p className="section-subtitle">Plan your loan with our easy-to-use EMI calculator</p>
        <div className="calculator-card">
          <div className="calc-inputs">
            <div className="calc-field">
              <label htmlFor="loan-amount">Loan Amount (₹)</label>
              <input
                type="range"
                id="loan-amount"
                min={100000}
                max={10000000}
                value={loanAmount}
                step={100000}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
              />
              <div className="calc-range-labels">
                <span>₹1L</span>
                <output className="calc-output">{formatINR(loanAmount)}</output>
                <span>₹1Cr</span>
              </div>
            </div>
            <div className="calc-field">
              <label htmlFor="interest-rate">Interest Rate (%)</label>
              <input
                type="range"
                id="interest-rate"
                min={5}
                max={30}
                value={interestRate}
                step={0.25}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
              <div className="calc-range-labels">
                <span>5%</span>
                <output className="calc-output">{interestRate}%</output>
                <span>30%</span>
              </div>
            </div>
            <div className="calc-field">
              <label htmlFor="loan-tenure">Loan Tenure (Years)</label>
              <input
                type="range"
                id="loan-tenure"
                min={1}
                max={30}
                value={tenure}
                step={1}
                onChange={(e) => setTenure(Number(e.target.value))}
              />
              <div className="calc-range-labels">
                <span>1 yr</span>
                <output className="calc-output">{tenure} years</output>
                <span>30 yrs</span>
              </div>
            </div>
          </div>
          <div className="calc-results">
            <div className="calc-emi">
              <span className="calc-label">Monthly EMI</span>
              <span className="calc-emi-value">{formatINR(Math.round(emi))}</span>
            </div>
            <div className="calc-breakdown">
              <div className="calc-breakdown-item">
                <span className="calc-breakdown-label">Principal Amount</span>
                <span className="calc-breakdown-value">{formatINR(loanAmount)}</span>
              </div>
              <div className="calc-breakdown-item">
                <span className="calc-breakdown-label">Total Interest</span>
                <span className="calc-breakdown-value">{formatINR(Math.round(totalInterest))}</span>
              </div>
              <div className="calc-breakdown-item calc-total">
                <span className="calc-breakdown-label">Total Payable</span>
                <span className="calc-breakdown-value">{formatINR(Math.round(totalPayable))}</span>
              </div>
            </div>
            <div className="calc-chart">
              <canvas ref={canvasRef} width="180" height="180" />
              <div className="chart-legend">
                <span className="legend-principal"><span className="legend-dot" /> Principal</span>
                <span className="legend-interest"><span className="legend-dot" /> Interest</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EMICalculator
