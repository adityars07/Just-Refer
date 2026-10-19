import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useAuth } from '../context/AuthContext'

interface DashboardViewProps {
  onBackToHome: () => void
}

function useAnimatedCount(target: number, isReady: boolean, durationMs = 1200): number {
  const [current, setCurrent] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!isReady) return
    if (shouldReduceMotion) {
      setCurrent(target)
      return
    }

    let start: number | null = null
    let rafId: number
    const initial = current

    const step = (now: number) => {
      if (start === null) start = now
      const elapsed = now - start
      const progress = Math.min(elapsed / durationMs, 1)
      const ease = 1 - Math.pow(1 - progress, 4)
      setCurrent(initial + (target - initial) * ease)

      if (progress < 1) {
        rafId = requestAnimationFrame(step)
      } else {
        setCurrent(target)
      }
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [target, isReady, durationMs, shouldReduceMotion])

  return current
}

const DashboardView = ({ onBackToHome }: DashboardViewProps) => {
  const { partner, logout } = useAuth()
  const partnerId = partner?.id || '00000000-0000-0000-0000-000000000001'
  const partnerName = partner?.full_name || 'Aditya Singh'
  const partnerInitials = partnerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const [activeItem, setActiveItem] = useState('Dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [monthSelect, setMonthSelect] = useState('Sep 2026')
  const [chartRange, setChartRange] = useState('Last 6 months')
  const [isAddReferralOpen, setIsAddReferralOpen] = useState(false)
  const [newApplicant, setNewApplicant] = useState({ name: '', phone: '', loan: 'Home Loan', amount: '', city: 'Mumbai' })
  const [walletData, setWalletData] = useState({ available_balance: '0.00', total_earned: '0.00', total_withdrawn: '0.00' })
  const shouldReduceMotion = useReducedMotion()

  const [referralsList, setReferralsList] = useState<any[]>([])

  // Fetch live leads & wallet from microservices backend on mount
  useEffect(() => {
    fetch(`/api/leads/partner/${partnerId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.leads) {
          setReferralsList(
            data.leads.map((l: any) => ({
              id: l.id,
              name: l.applicant_name,
              loan: l.loan_product,
              amount: `₹ ${Number(l.loan_amount).toLocaleString('en-IN')}`,
              status: l.status,
              commission: l.commission_amount > 0 ? `₹ ${Number(l.commission_amount).toLocaleString('en-IN')}` : '—',
              date: new Date(l.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            }))
          )
        }
      })
      .catch(() => {})

    fetch(`/api/wallet/partner/${partnerId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.wallet) {
          setWalletData(data.wallet)
        }
      })
      .catch(() => {})
  }, [partnerId])

  // Dynamic animated metric counters computed from real data
  const targetEarnings = parseFloat(walletData.available_balance) || 0
  const totalReferrals = referralsList.length
  const approvedCount = referralsList.filter(l => l.status === 'Approved' || l.status === 'Disbursed').length
  const pendingCount = referralsList.filter(l => l.status === 'Submitted' || l.status === 'In Progress' || l.status === 'In Review').length

  const animatedEarnings = useAnimatedCount(targetEarnings, true, 1000)
  const animatedReferrals = useAnimatedCount(totalReferrals, true, 800)
  const animatedApproved = useAnimatedCount(approvedCount, true, 800)
  const animatedPending = useAnimatedCount(pendingCount, true, 800)

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] as const },
    },
  }

  const sidebarItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'My Referrals', icon: '👥' },
    { name: 'Loan Products', icon: '📋' },
    { name: 'Earnings', icon: '💰' },
    { name: 'Payouts', icon: '💳' },
    { name: 'Partners', icon: '🏛️' },
    { name: 'Resources', icon: '📁' },
    { name: 'Settings', icon: '⚙️' },
  ]

  const handleAddReferralSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newApplicant.name || !newApplicant.amount) return

    const cleanAmt = parseFloat(newApplicant.amount.replace(/[^0-9.]/g, '')) || 500000

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId,
          applicantName: newApplicant.name,
          applicantPhone: newApplicant.phone || `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`,
          applicantCity: newApplicant.city || 'Mumbai',
          loanProduct: newApplicant.loan,
          loanAmount: cleanAmt,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.lead) {
          setReferralsList((prev) => [
            {
              name: data.lead.applicant_name,
              loan: data.lead.loan_product,
              amount: `₹ ${Number(data.lead.loan_amount).toLocaleString('en-IN')}`,
              status: data.lead.status,
              commission: data.lead.commission_amount > 0 ? `₹ ${Number(data.lead.commission_amount).toLocaleString('en-IN')}` : 'Pending',
              date: 'Today',
            },
            ...prev,
          ])
        }
      }
    } catch {
      // Fallback optimistic UI update
      setReferralsList((prev) => [
        {
          name: newApplicant.name,
          loan: newApplicant.loan,
          amount: `₹ ${cleanAmt.toLocaleString('en-IN')}`,
          status: 'Submitted',
          commission: 'Pending',
          date: 'Today',
        },
        ...prev,
      ])
    }

    setNewApplicant({ name: '', phone: '', loan: 'Home Loan', amount: '', city: 'Mumbai' })
    setIsAddReferralOpen(false)
  }

  return (
    <div className="dashboard-container">
      {/* Left Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-brand-row" onClick={onBackToHome} style={{ cursor: 'pointer' }}>
          <div className="brand-dot-logo">
            <span>$</span>
          </div>
          <span className="brand-wordmark">JustRefer</span>
        </div>

        <nav className="dash-nav-menu">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              type="button"
              className={`dash-menu-item ${activeItem === item.name ? 'active' : ''}`}
              onClick={() => setActiveItem(item.name)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="dash-sidebar-footer">
          <button type="button" className="btn-exit-portal" onClick={logout} style={{ marginBottom: 6 }}>
            🚪 Sign Out
          </button>
          <button type="button" className="btn-exit-portal" onClick={onBackToHome}>
            ← Exit to Main Site
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="dash-content-area">
        {/* Top Bar */}
        <header className="dash-header-bar">
          <div className="dash-search-container">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9AA39F" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Search referrals, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="dash-search-field"
            />
          </div>

          <div className="dash-header-right">
            <button type="button" className="btn-bell-notification" aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5F6B66" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </button>

            <div className="user-profile-widget">
              <div className="user-avatar-circle">{partnerInitials}</div>
              <div className="user-text-col">
                <strong className="user-name-title">{partnerName}</strong>
                <span className="user-role-label">{partner?.role === 'admin' ? 'Admin' : 'Referrer'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <div className="dash-workspace">
          {/* Welcome Row */}
          <div className="welcome-greeting-row">
            <div>
              <h2 className="greeting-title">Welcome back, {partnerName.split(' ')[0]} 👋</h2>
              <p className="greeting-subtitle">Here's your referral performance this month.</p>
            </div>

            <div className="month-dropdown-box">
              <select
                value={monthSelect}
                onChange={(e) => setMonthSelect(e.target.value)}
                className="select-month"
              >
                <option value="Sep 2026">Sep 2026 ▾</option>
                <option value="Aug 2026">Aug 2026</option>
                <option value="Jul 2026">Jul 2026</option>
              </select>
            </div>
          </div>

          {/* 4 Stat Cards with Count-Up Animation */}
          <div className="stats-metric-cards-grid">
            {/* Card 1: Total Earnings */}
            <motion.div variants={cardVariants} initial="hidden" animate="visible" className="metric-box">
              <div className="metric-icon-tile green">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F9D55" strokeWidth="2.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              </div>
              <div className="metric-data-wrap">
                <span className="metric-label">Total Earnings</span>
                <strong className="metric-bold-value">
                  ₹ {Math.round(animatedEarnings).toLocaleString('en-IN')}
                </strong>
                <span className="metric-growth-text green">+12% from last month</span>
              </div>
            </motion.div>

            {/* Card 2: Total Referrals */}
            <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: shouldReduceMotion ? 0 : 0.08 }} className="metric-box">
              <div className="metric-icon-tile blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div className="metric-data-wrap">
                <span className="metric-label">Total Referrals</span>
                <strong className="metric-bold-value">{Math.round(animatedReferrals)}</strong>
                <span className="metric-growth-text blue">+4 this month</span>
              </div>
            </motion.div>

            {/* Card 3: Approved Loans */}
            <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: shouldReduceMotion ? 0 : 0.16 }} className="metric-box">
              <div className="metric-icon-tile green">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F9D55" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div className="metric-data-wrap">
                <span className="metric-label">Approved Loans</span>
                <strong className="metric-bold-value">{Math.round(animatedApproved)}</strong>
                <span className="metric-growth-text neutral">66% conversion</span>
              </div>
            </motion.div>

            {/* Card 4: Pending Applications */}
            <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: shouldReduceMotion ? 0 : 0.24 }} className="metric-box">
              <div className="metric-icon-tile orange">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div className="metric-data-wrap">
                <span className="metric-label">Pending Applications</span>
                <strong className="metric-bold-value">{Math.round(animatedPending)}</strong>
                <span className="metric-growth-text orange">In progress</span>
              </div>
            </motion.div>
          </div>

          {/* Middle Row: Earnings Overview Chart + Recent Referrals */}
          <div className="chart-and-referrals-grid">
            {/* Chart Card */}
            <div className="panel-card chart-card">
              <div className="panel-card-header">
                <div>
                  <h3 className="panel-title">Earnings Overview</h3>
                </div>
                <div className="dropdown-inline">
                  <select
                    value={chartRange}
                    onChange={(e) => setChartRange(e.target.value)}
                    className="select-range-pill"
                  >
                    <option value="Last 6 months">Last 6 months ▾</option>
                    <option value="This Year">This Year</option>
                  </select>
                </div>
              </div>

              <div className="chart-svg-wrapper">
                <svg viewBox="0 0 540 180" className="chart-canvas">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E6F4EC" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#E6F4EC" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M 20 145 Q 110 120, 190 130 T 360 85 T 510 35 L 510 175 L 20 175 Z"
                    fill="url(#chartGradient)"
                    initial={shouldReduceMotion ? { opacity: 0.85 } : { opacity: 0 }}
                    animate={{ opacity: 0.85 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : 0.3 }}
                  />
                  {/* Left to right drawn line */}
                  <motion.path
                    d="M 20 145 Q 110 120, 190 130 T 360 85 T 510 35"
                    fill="none"
                    stroke="#1F9D55"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 1.4, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <motion.circle
                    cx="510"
                    cy="35"
                    r="5"
                    fill="#1F9D55"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    initial={shouldReduceMotion ? { scale: 1 } : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 1.2, duration: 0.25 }}
                  />
                </svg>

                <div className="chart-pinned-tooltip">
                  <strong>₹ {targetEarnings.toLocaleString('en-IN')}</strong>
                  <span>Available</span>
                </div>
              </div>

              <div className="chart-x-labels">
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span className="active-chart-month">Sep</span>
              </div>
            </div>

            {/* Recent Referrals Card */}
            <div className="panel-card recent-referrals-card">
              <div className="panel-card-header">
                <h3 className="panel-title">Recent Referrals</h3>
                <button
                  type="button"
                  className="link-view-all"
                  onClick={() => setIsAddReferralOpen(true)}
                >
                  View all →
                </button>
              </div>

              <div className="recent-rows-list">
                {referralsList.length === 0 ? (
                  <div style={{ padding: '36px 16px', textAlign: 'center', color: '#6b7280' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
                    <strong style={{ display: 'block', fontSize: 15, color: '#111827', marginBottom: 4 }}>No Referrals Yet</strong>
                    <p style={{ fontSize: 13, margin: '0 0 16px', color: '#6b7280' }}>Submit your first referral to start tracking loan status and commission payouts.</p>
                    <button
                      type="button"
                      className="btn-add-referral-dark"
                      style={{ fontSize: 13, padding: '8px 16px', margin: '0 auto', display: 'inline-flex' }}
                      onClick={() => setIsAddReferralOpen(true)}
                    >
                      + Add First Referral
                    </button>
                  </div>
                ) : (
                  referralsList.map((row, idx) => (
                    <div key={idx} className="recent-list-row">
                      <div className="recent-avatar-bubble">
                        {row.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div className="recent-info-block">
                        <strong>{row.name}</strong>
                        <span>{row.loan}</span>
                      </div>
                      <div className="recent-status-block">
                        <span className={`ref-status-badge ${row.status.toLowerCase().replace(' ', '-')}`}>
                          {row.status}
                        </span>
                        <span className="recent-row-date">{row.date}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Bottom Row: 5 Loan Products Row + Your Next Payout Card */}
          <div className="products-and-payout-row">
            {/* 5 My Loan Products Cards */}
            <div className="panel-card loan-products-strip-card">
              <div className="panel-card-header">
                <h3 className="panel-title">My Loan Products</h3>
                <a href="#view-all" className="link-view-all">View all →</a>
              </div>

              <div className="five-products-row">
                <div className="prod-mini-tile">
                  <div className="prod-icon-box blue">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <strong>Personal Loan</strong>
                  <span className="limit-sub">Up to ₹5 Lakh</span>
                  <span className="comm-sub">Commission up to ₹5,000</span>
                </div>

                <div className="prod-mini-tile">
                  <div className="prod-icon-box green">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  </div>
                  <strong>Home Loan</strong>
                  <span className="limit-sub">Up to ₹10 Cr</span>
                  <span className="comm-sub">Commission up to ₹10,000</span>
                </div>

                <div className="prod-mini-tile">
                  <div className="prod-icon-box red">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  </div>
                  <strong>Car Loan</strong>
                  <span className="limit-sub">Up to ₹50 Lakh</span>
                  <span className="comm-sub">Commission up to ₹7,500</span>
                </div>

                <div className="prod-mini-tile">
                  <div className="prod-icon-box orange">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  </div>
                  <strong>Business Loan</strong>
                  <span className="limit-sub">Up to ₹5 Cr</span>
                  <span className="comm-sub">Commission up to ₹15,000</span>
                </div>

                <div className="prod-mini-tile">
                  <div className="prod-icon-box teal">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
                  </div>
                  <strong>Education Loan</strong>
                  <span className="limit-sub">Up to ₹1 Cr</span>
                  <span className="comm-sub">Commission up to ₹7,500</span>
                </div>
              </div>
            </div>

            {/* Your Next Payout Dark Green Card */}
            <div className="payout-highlight-card">
              <div className="payout-head-row">
                <span className="payout-lead-title">Your Next Payout</span>
                <div className="payout-wallet-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                </div>
              </div>

              <div className="payout-figure">₹ {targetEarnings.toLocaleString('en-IN')}</div>
              <div className="payout-due-date">{targetEarnings > 0 ? 'Ready for payout' : 'No pending payouts'}</div>

              <button
                type="button"
                className="btn-payout-view-outline"
                onClick={() => setActiveItem('Payouts')}
              >
                View Payouts →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Add Referral Modal */}
      {isAddReferralOpen && (
        <div className="modal-overlay" onClick={() => setIsAddReferralOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsAddReferralOpen(false)}>✕</button>
            <div className="modal-header">
              <h3>Add Referral</h3>
              <p>Enter applicant details to submit a new loan referral.</p>
            </div>
            <form onSubmit={handleAddReferralSubmit} className="modal-form">
              <div className="zero-kyc-banner" style={{ background: '#e6f4ec', color: '#0f3d2e', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                <span>⚡</span>
                <span>Zero KYC Required • Fast 30-Second Submission</span>
              </div>

              <div className="form-group">
                <label>Applicant Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sharma"
                  value={newApplicant.name}
                  onChange={(e) => setNewApplicant({ ...newApplicant, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Applicant Mobile Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={newApplicant.phone}
                  onChange={(e) => setNewApplicant({ ...newApplicant, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Delhi, Bengaluru"
                  value={newApplicant.city}
                  onChange={(e) => setNewApplicant({ ...newApplicant, city: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Loan Type</label>
                <select
                  value={newApplicant.loan}
                  onChange={(e) => setNewApplicant({ ...newApplicant, loan: e.target.value })}
                  className="filter-select"
                >
                  <option value="Home Loan">Home Loan</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Car Loan">Car Loan</option>
                  <option value="Business Loan">Business Loan</option>
                  <option value="Education Loan">Education Loan</option>
                </select>
              </div>

              <div className="form-group">
                <label>Loan Amount (₹)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5,00,000"
                  value={newApplicant.amount}
                  onChange={(e) => setNewApplicant({ ...newApplicant, amount: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-modal-submit">
                Submit Referral Instantly →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardView
