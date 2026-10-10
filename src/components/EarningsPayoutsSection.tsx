const EarningsPayoutsSection = () => {
  return (
    <section className="earnings-payouts-section" id="pricing">
      <div className="container">
        <div className="earnings-section-header" style={{ textAlign: 'left', marginBottom: '32px' }}>
          <h2 className="products-title">Earnings & Payouts</h2>
          <p className="products-subtitle">
            Track your earnings, payout history and commission details.
          </p>
        </div>

        {/* 4 Summary Cards */}
        <div className="earnings-stats-row">
          <div className="ep-stat-card">
            <div className="ep-icon green">💵</div>
            <div className="ep-stat-info">
              <span className="ep-stat-label">Total Earnings</span>
              <strong className="ep-stat-num">₹ 1,24,500</strong>
            </div>
          </div>

          <div className="ep-stat-card">
            <div className="ep-icon blue">🏦</div>
            <div className="ep-stat-info">
              <span className="ep-stat-label">Total Payouts</span>
              <strong className="ep-stat-num">₹ 1,00,000</strong>
            </div>
          </div>

          <div className="ep-stat-card">
            <div className="ep-icon orange">⏳</div>
            <div className="ep-stat-info">
              <span className="ep-stat-label">Pending Payout</span>
              <strong className="ep-stat-num">₹ 24,500</strong>
            </div>
          </div>

          <div className="ep-stat-card">
            <div className="ep-icon green">👥</div>
            <div className="ep-stat-info">
              <span className="ep-stat-label">Total Referrals</span>
              <strong className="ep-stat-num">92</strong>
            </div>
          </div>
        </div>

        {/* Payout History Table Card */}
        <div className="ep-table-card">
          <div className="ep-table-header">
            <h3>Payout History</h3>
            <button type="button" className="tab-btn" style={{ background: '#F8F6F0', color: '#0B1F18', borderColor: '#ECE9E1' }}>
              View All
            </button>
          </div>

          <div className="ep-table-responsive">
            <table className="ep-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Referrals</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>30 Sep 2026</td>
                  <td><strong className="amt-strong">₹ 12,500</strong></td>
                  <td><span className="ep-status-pill scheduled">Scheduled</span></td>
                  <td>3</td>
                  <td>Expected payout via NEFT</td>
                </tr>
                <tr>
                  <td>31 Aug 2026</td>
                  <td><strong className="amt-strong">₹ 26,000</strong></td>
                  <td><span className="ep-status-pill paid">Paid</span></td>
                  <td>5</td>
                  <td>UTR: 9285748293</td>
                </tr>
                <tr>
                  <td>31 Jul 2026</td>
                  <td><strong className="amt-strong">₹ 18,000</strong></td>
                  <td><span className="ep-status-pill paid">Paid</span></td>
                  <td>4</td>
                  <td>UTR: 8370647283</td>
                </tr>
                <tr>
                  <td>30 Jun 2026</td>
                  <td><strong className="amt-strong">₹ 15,500</strong></td>
                  <td><span className="ep-status-pill paid">Paid</span></td>
                  <td>3</td>
                  <td>UTR: 7324828301</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EarningsPayoutsSection
