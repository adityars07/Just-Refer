import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const EarningsPayoutsSection = () => {
  const { partner } = useAuth()
  const partnerId = partner?.id || '00000000-0000-0000-0000-000000000001'

  const [wallet, setWallet] = useState({
    available_balance: '0.00',
    total_earned: '0.00',
    total_withdrawn: '0.00'
  })
  const [referralsCount, setReferralsCount] = useState(0)

  useEffect(() => {
    fetch(`/api/wallet/partner/${partnerId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.wallet) {
          setWallet(data.wallet)
        }
      })
      .catch(() => {})

    fetch(`/api/leads/partner/${partnerId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.leads) {
          setReferralsCount(data.leads.length)
        }
      })
      .catch(() => {})
  }, [partnerId])

  const availableAmt = parseFloat(wallet.available_balance) || 0
  const earnedAmt = parseFloat(wallet.total_earned) || 0
  const withdrawnAmt = parseFloat(wallet.total_withdrawn) || 0

  return (
    <section className="earnings-payouts-section" id="pricing">
      <div className="container">
        <div className="earnings-section-header" style={{ textAlign: 'left', marginBottom: '32px' }}>
          <h2 className="products-title">Earnings & Payouts</h2>
          <p className="products-subtitle">
            Track your commission earnings, balance, and payout history. Zero KYC hassle.
          </p>
        </div>

        {/* 4 Dynamic Summary Cards */}
        <div className="earnings-stats-row">
          <div className="ep-stat-card">
            <div className="ep-icon green">💵</div>
            <div className="ep-stat-info">
              <span className="ep-stat-label">Total Earnings</span>
              <strong className="ep-stat-num">₹ {earnedAmt.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <div className="ep-stat-card">
            <div className="ep-icon blue">🏦</div>
            <div className="ep-stat-info">
              <span className="ep-stat-label">Total Paid Out</span>
              <strong className="ep-stat-num">₹ {withdrawnAmt.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <div className="ep-stat-card">
            <div className="ep-icon orange">⏳</div>
            <div className="ep-stat-info">
              <span className="ep-stat-label">Available Payout</span>
              <strong className="ep-stat-num">₹ {availableAmt.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <div className="ep-stat-card">
            <div className="ep-icon green">👥</div>
            <div className="ep-stat-info">
              <span className="ep-stat-label">Total Referrals</span>
              <strong className="ep-stat-num">{referralsCount}</strong>
            </div>
          </div>
        </div>

        {/* Payout History Table Card */}
        <div className="ep-table-card">
          <div className="ep-table-header">
            <h3>Payout History</h3>
          </div>

          <div className="ep-table-responsive">
            <div style={{ padding: '56px 24px', textAlign: 'center', color: '#6b7280' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>💳</div>
              <h4 style={{ fontSize: 16, color: '#111827', marginBottom: 6, fontWeight: 700 }}>No Payout Records Yet</h4>
              <p style={{ fontSize: 13, color: '#6b7280', maxWidth: 460, margin: '0 auto', lineHeight: 1.5 }}>
                Payout disbursements will automatically appear here once your referred loans are disbursed by partner banks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EarningsPayoutsSection
