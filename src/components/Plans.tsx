import { useState } from 'react'

const Plans = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <section className="plans-section" id="plans">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="section-eyebrow">Plans</span>
          <h2 className="section-heading">Choose your plan</h2>
          <div className="plan-billing-toggle">
            <button
              type="button"
              className={`plan-toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`plan-toggle-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="plans-grid">
          {/* Card 1: Free Plan */}
          <div className="plan-card plan-card-free">
            <div className="plan-badge-placeholder"></div>
            <div className="plan-price-wrap">
              <span className="plan-price">$0</span>
              <span className="plan-period">/ month</span>
            </div>
            <div className="plan-features-list">
              <div className="plan-feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Global access, cashback, standard rewards</span>
              </div>
              <div className="plan-feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Virtual debit & credit card instantly issued</span>
              </div>
              <div className="plan-feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Standard ATM withdrawals nationwide</span>
              </div>
            </div>
            <button type="button" className="btn-plan-outline">
              Try it now for Free
            </button>
          </div>

          {/* Card 2: Platinum Plan */}
          <div className="plan-card plan-card-premium">
            <div className="plan-suggested-tag">Suggested</div>
            <div className="plan-price-wrap">
              <span className="plan-price">{billingCycle === 'monthly' ? '$10' : '$99'}</span>
              <span className="plan-period">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
            </div>
            <div className="plan-features-list">
              <div className="plan-feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>All basic features + premium 5x rewards</span>
              </div>
              <div className="plan-feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Zero foreign currency exchange (FX) fees</span>
              </div>
              <div className="plan-feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Airport lounge access & concierge service</span>
              </div>
              <div className="plan-feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>24/7 dedicated priority relationship manager</span>
              </div>
            </div>
            <button type="button" className="btn-plan-dark">
              Try it now for Free
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Plans
