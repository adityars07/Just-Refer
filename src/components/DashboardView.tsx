import React, { useState, useEffect, useCallback } from 'react'
import {
  Home,
  PlusCircle,
  Plus,
  Users,
  CreditCard,
  Package,
  BarChart2,
  Settings,
  Headphones,
  Search,
  Bell,
  QrCode,
  Copy,
  Check,
  Calendar,
  MoreHorizontal,
  TrendingUp,
  Clock,
  CheckCircle2,
  Wallet,
  X,
  ChevronDown,
  ArrowUpRight,
  Building2,
  Briefcase,
  User,
  LogOut,
  ExternalLink,
  Shield,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import '../styles/dashboard-single.css'

interface DashboardViewProps {
  onBackToHome: () => void
  onOpenAdmin?: () => void
}

interface ProductDef {
  id: string
  name: string
  commRate: string
  commPercent: number
  minAmountStr: string
  minAmountNum: number
  examplePayout: string
  startingRate: string
  colorType: 'green' | 'amber' | 'blue' | 'purple'
  icon: React.ReactNode
}

const PRODUCTS: ProductDef[] = [
  {
    id: 'home-loan',
    name: 'Home Loan',
    commRate: '0.3% Payout',
    commPercent: 0.003,
    minAmountStr: '₹50 Lakhs',
    minAmountNum: 5000000,
    examplePayout: '₹15,000 per ₹50L',
    startingRate: '7.25% p.a.',
    colorType: 'green',
    icon: <Home size={18} />,
  },
  {
    id: 'lap',
    name: 'Loan Against Property',
    commRate: '0.5% Payout',
    commPercent: 0.005,
    minAmountStr: '₹1 Crore',
    minAmountNum: 10000000,
    examplePayout: '₹50,000 per ₹1Cr',
    startingRate: '8.00% p.a.',
    colorType: 'amber',
    icon: <Building2 size={18} />,
  },
  {
    id: 'personal-loan',
    name: 'Personal Loan',
    commRate: '1.0% Payout',
    commPercent: 0.01,
    minAmountStr: '₹5 Lakhs',
    minAmountNum: 500000,
    examplePayout: '₹10,000 per ₹10L',
    startingRate: '9.99% p.a.',
    colorType: 'blue',
    icon: <User size={18} />,
  },
  {
    id: 'business-loan',
    name: 'Business Loan',
    commRate: '1.0% Payout',
    commPercent: 0.01,
    minAmountStr: '₹10 Lakhs',
    minAmountNum: 1000000,
    examplePayout: '₹25,000 per ₹25L',
    startingRate: '10.99% p.a.',
    colorType: 'purple',
    icon: <Briefcase size={18} />,
  },
]

export interface ReferralItem {
  id: number
  leadId?: string
  initials: string
  name: string
  phone: string
  city: string
  product: string
  productClass: string
  loanAmount: string
  amountNum: number
  estCommission: string
  status: string
  statusClass: string
  date: string
}

const DashboardView = ({ onBackToHome, onOpenAdmin }: DashboardViewProps) => {
  const { partner, logout } = useAuth()
  const partnerId = partner?.id || '00000000-0000-0000-0000-000000000001'
  const partnerName = partner?.full_name || 'Aditya Raj Singh'
  const referralCode = partner?.referral_code || 'JR-ADIT6624'

  const userInitials = (partnerName || 'AR')
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  // Navigation state
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Approved'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  // Live state from PostgreSQL microservices
  const [referrals, setReferrals] = useState<ReferralItem[]>([])
  const [wallet, setWallet] = useState({
    available_balance: 0,
    total_earned: 0,
    total_withdrawn: 0,
  })

  // Modal Form State
  const [selectedProduct, setSelectedProduct] = useState<ProductDef>(PRODUCTS[0])
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formCity, setFormCity] = useState('')
  const [formAmount, setFormAmount] = useState('5000000')

  // Load real leads & wallet from PostgreSQL
  const loadData = useCallback(() => {
    // 1. Fetch partner referral leads
    fetch(`/api/leads/partner/${partnerId}`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data && Array.isArray(data.leads)) {
          const mapped: ReferralItem[] = data.leads.map((l: any, idx: number) => {
            const p = PRODUCTS.find(x => x.name.toLowerCase() === (l.loan_product || '').toLowerCase()) || PRODUCTS[0]
            const amt = Number(l.loan_amount) || p.minAmountNum
            const comm = Number(l.commission_amount) || Math.round(amt * p.commPercent)
            const initials = (l.applicant_name || 'AP')
              .split(' ')
              .filter(Boolean)
              .map((n: string) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()
            const st = l.status || 'Submitted'
            const stClass =
              st.toLowerCase().includes('approv') || st.toLowerCase().includes('disburs') || st.toLowerCase().includes('sanction')
                ? 'approved'
                : st.toLowerCase().includes('progress') || st.toLowerCase().includes('review')
                ? 'progress'
                : 'pending'

            return {
              id: idx + 1,
              leadId: l.id,
              initials,
              name: l.applicant_name,
              phone: l.applicant_phone || '—',
              city: l.applicant_city || '—',
              product: l.loan_product || 'Home Loan',
              productClass:
                p.colorType === 'green' ? 'home' : p.colorType === 'amber' ? 'lap' : p.colorType === 'blue' ? 'personal' : 'business',
              loanAmount: `₹${amt.toLocaleString('en-IN')}`,
              amountNum: amt,
              estCommission: `₹${comm.toLocaleString('en-IN')}`,
              status: st,
              statusClass: stClass,
              date: l.created_at
                ? new Date(l.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'Today',
            }
          })
          setReferrals(mapped)
        } else {
          setReferrals([])
        }
      })
      .catch(() => setReferrals([]))

    // 2. Fetch partner wallet
    fetch(`/api/wallet/partner/${partnerId}`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data && data.wallet) {
          setWallet({
            available_balance: parseFloat(data.wallet.available_balance) || 0,
            total_earned: parseFloat(data.wallet.total_earned) || 0,
            total_withdrawn: parseFloat(data.wallet.total_withdrawn) || 0,
          })
        }
      })
      .catch(() => {})
  }, [partnerId])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Copy referral code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Open modal preselected for product
  const handleOpenModal = (p?: ProductDef) => {
    const prod = p || PRODUCTS[0]
    setSelectedProduct(prod)
    setFormAmount(String(prod.minAmountNum))
    setFormName('')
    setFormPhone('')
    setFormCity('')
    setIsModalOpen(true)
  }

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return

    const numAmt = parseFloat(formAmount.replace(/[^0-9.]/g, '')) || selectedProduct.minAmountNum
    const comm = Math.round(numAmt * selectedProduct.commPercent)
    const initials = formName
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()

    const newRow: ReferralItem = {
      id: referrals.length + 1,
      initials,
      name: formName,
      phone: formPhone || '—',
      city: formCity || '—',
      product: selectedProduct.name,
      productClass: selectedProduct.colorType === 'green' ? 'home' : selectedProduct.colorType === 'amber' ? 'lap' : selectedProduct.colorType === 'blue' ? 'personal' : 'business',
      loanAmount: `₹${numAmt.toLocaleString('en-IN')}`,
      amountNum: numAmt,
      estCommission: `₹${comm.toLocaleString('en-IN')}`,
      status: 'Submitted',
      statusClass: 'pending',
      date: 'Today',
    }

    // Save optimistically
    setReferrals(prev => [newRow, ...prev])
    setIsModalOpen(false)

    // Send to backend API
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId,
          applicantName: formName,
          applicantPhone: formPhone || '+91 98765 43210',
          applicantCity: formCity || 'Mumbai',
          loanProduct: selectedProduct.name,
          loanAmount: numAmt,
        }),
      })
      if (res.ok) {
        loadData()
      }
    } catch {}
  }

  // Filter calculations
  const pendingCount = referrals.filter(r =>
    ['pending', 'in progress', 'progress', 'under review', 'review'].includes(r.status.toLowerCase())
  ).length

  const approvedCount = referrals.filter(r =>
    ['approved', 'disbursed', 'sanctioned'].includes(r.status.toLowerCase())
  ).length

  const filteredReferrals = referrals.filter(r => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      r.name.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      r.product.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q)

    if (!matchesSearch) return false

    if (activeFilter === 'Pending') {
      return ['pending', 'in progress', 'progress', 'under review', 'review'].includes(r.status.toLowerCase())
    }
    if (activeFilter === 'Approved') {
      return ['approved', 'disbursed', 'sanctioned'].includes(r.status.toLowerCase())
    }
    return true
  })

  // Live commission preview in modal
  const liveAmt = parseFloat(formAmount.replace(/[^0-9.]/g, '')) || 0
  const liveComm = Math.round(liveAmt * selectedProduct.commPercent)

  return (
    <div className="dk-shell">
      {/* ── Left Sidebar ── */}
      <aside className="dk-sidebar">
        <div>
          {/* Logo */}
          <div className="dk-logo-section" onClick={onBackToHome}>
            <div className="dk-logo-row">
              <svg
                className="dk-logo-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5 3C19.5376 3 22 5.46243 22 8.5C22 11.5376 19.5376 14 16.5 14H13V12H16.5C18.433 12 20 10.433 20 8.5C20 6.567 18.433 5 16.5 5H12C10.067 5 8.5 6.567 8.5 8.5V9H6.5V8.5C6.5 5.46243 8.96243 3 12 3H16.5Z"
                  fill="#10B981"
                />
                <path
                  d="M7.5 21C4.46243 21 2 18.5376 2 15.5C2 12.4624 4.46243 10 7.5 10H11V12H7.5C5.567 12 4 13.567 4 15.5C4 17.433 5.567 19 7.5 19H12C13.933 19 15.5 17.433 15.5 15.5V15H17.5V15.5C17.5 18.5376 15.0376 21 12 21H7.5Z"
                  fill="#10B981"
                />
              </svg>
              <span className="dk-logo-text">justrefer</span>
            </div>
            <div className="dk-logo-sub">Partner Portal</div>
          </div>

          {/* Navigation Items */}
          <nav className="dk-nav-list">
            <button
              type="button"
              className={`dk-nav-item ${activeNav === 'Dashboard' ? 'active' : ''}`}
              onClick={() => setActiveNav('Dashboard')}
            >
              <Home size={18} />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              className={`dk-nav-item ${activeNav === 'Create Referral' ? 'active' : ''}`}
              onClick={() => handleOpenModal()}
            >
              <PlusCircle size={18} />
              <span>Create Referral</span>
            </button>

            <button
              type="button"
              className={`dk-nav-item ${activeNav === 'Referrals' ? 'active' : ''}`}
              onClick={() => setActiveNav('Referrals')}
            >
              <Users size={18} />
              <span>Referrals</span>
            </button>

            <button
              type="button"
              className={`dk-nav-item ${activeNav === 'Payouts' ? 'active' : ''}`}
              onClick={() => setActiveNav('Payouts')}
            >
              <CreditCard size={18} />
              <span>Payouts</span>
            </button>

            <button
              type="button"
              className={`dk-nav-item ${activeNav === 'Products' ? 'active' : ''}`}
              onClick={() => setActiveNav('Products')}
            >
              <Package size={18} />
              <span>Products</span>
            </button>

            <button
              type="button"
              className={`dk-nav-item ${activeNav === 'Reports' ? 'active' : ''}`}
              onClick={() => setActiveNav('Reports')}
            >
              <BarChart2 size={18} />
              <span>Reports</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="dk-sidebar-bottom">
          <button
            type="button"
            className="dk-nav-item"
            onClick={() => setActiveNav('Settings')}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>

          <button
            type="button"
            className="dk-nav-item"
            onClick={() => setActiveNav('Support')}
          >
            <Headphones size={18} />
            <span>Support</span>
          </button>

          {onOpenAdmin && (
            <button
              type="button"
              className="dk-nav-item"
              onClick={onOpenAdmin}
              style={{ color: '#10b981' }}
            >
              <Shield size={18} />
              <span>Admin Panel</span>
            </button>
          )}
        </div>
      </aside>

      {/* ── Main Area ── */}
      <main className="dk-main">
        {/* Top Header Bar */}
        <header className="dk-topbar">
          {/* Search Box */}
          <div className="dk-search-wrap">
            <Search size={16} className="dk-search-icon" />
            <input
              type="text"
              placeholder="Search by name, phone number, or product..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="dk-search-input"
            />
            <div className="dk-search-shortcut">Ctrl K</div>
          </div>

          {/* Right Header Actions */}
          <div className="dk-topbar-actions">
            <button
              type="button"
              className="dk-btn-create"
              onClick={() => handleOpenModal()}
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Create Referral</span>
            </button>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="dk-bell-btn"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                title="Notifications"
              >
                <Bell size={18} />
                <span className="dk-bell-dot" />
              </button>

              {isNotificationsOpen && (
                <div className="dk-popover-menu" style={{ width: 260 }}>
                  <div style={{ padding: '6px 10px', fontSize: 12, fontWeight: 700, color: '#ffffff' }}>
                    Notifications
                  </div>
                  {referrals.length === 0 ? (
                    <div style={{ padding: '12px 10px', fontSize: 12, color: '#64748b', textAlign: 'center' }}>
                      No new notifications
                    </div>
                  ) : (
                    referrals.slice(0, 3).map((r, i) => (
                      <div key={i} style={{ padding: '8px 10px', fontSize: 12, color: '#94a3b8', borderTop: '1px solid #1e2634' }}>
                        {r.statusClass === 'approved' ? '🎉' : '📋'}{' '}
                        <strong style={{ color: '#ffffff' }}>{r.name}</strong>'s {r.product} application is{' '}
                        <span style={{ color: r.statusClass === 'approved' ? '#10b981' : '#f59e0b' }}>{r.status}</span>.
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* User Avatar with Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="dk-avatar-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                title={partnerName}
              >
                {userInitials}
              </button>

              {isUserMenuOpen && (
                <div className="dk-popover-menu">
                  <div style={{ padding: '6px 10px', borderBottom: '1px solid #1e2634', marginBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>{partnerName}</div>
                    <div style={{ fontSize: 11, color: '#10b981' }}>Verified Partner</div>
                  </div>
                  {onOpenAdmin && (
                    <button
                      type="button"
                      className="dk-popover-item"
                      onClick={onOpenAdmin}
                      style={{ color: '#10b981' }}
                    >
                      <Shield size={14} />
                      <span style={{ fontWeight: 600 }}>Admin Dashboard</span>
                    </button>
                  )}
                  <button
                    type="button"
                    className="dk-popover-item"
                    onClick={onBackToHome}
                  >
                    <ExternalLink size={14} />
                    <span>Exit to Main Site</span>
                  </button>
                  <button
                    type="button"
                    className="dk-popover-item"
                    onClick={() => {
                      logout()
                      onBackToHome()
                    }}
                    style={{ color: '#f87171' }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Body Content */}
        <div className="dk-body">
          {/* Row 1: Metrics Grid (5 Cards) */}
          <section className="dk-metrics-grid">
            {/* 1. Total Earnings */}
            <div className="dk-metric-card">
              <div className="dk-metric-top">
                <div className="dk-metric-icon-wrap">
                  <Wallet size={18} />
                </div>
                <div className="dk-metric-info">
                  <span className="dk-metric-label">Total Earnings</span>
                  <strong className="dk-metric-val">₹{wallet.total_earned.toLocaleString('en-IN')}</strong>
                </div>
              </div>
              <div className="dk-metric-sub green">
                <TrendingUp size={13} />
                <span>₹{wallet.available_balance.toLocaleString('en-IN')} available for payout</span>
              </div>
            </div>

            {/* 2. Total Referrals */}
            <div className="dk-metric-card">
              <div className="dk-metric-top">
                <div className="dk-metric-icon-wrap">
                  <Users size={18} />
                </div>
                <div className="dk-metric-info">
                  <span className="dk-metric-label">Total Referrals</span>
                  <strong className="dk-metric-val">{referrals.length}</strong>
                </div>
              </div>
              <div className="dk-metric-sub green">
                <TrendingUp size={13} />
                <span>{referrals.length === 1 ? '1 lead submitted' : `${referrals.length} leads submitted`}</span>
              </div>
            </div>

            {/* 3. Pending */}
            <div className="dk-metric-card">
              <div className="dk-metric-top">
                <div className="dk-metric-icon-wrap amber">
                  <Clock size={18} />
                </div>
                <div className="dk-metric-info">
                  <span className="dk-metric-label">Pending</span>
                  <strong className="dk-metric-val">{pendingCount}</strong>
                </div>
              </div>
              <div className="dk-metric-sub">
                <span>{referrals.length > 0 ? `${Math.round((pendingCount / referrals.length) * 100)}% of total` : '0% of total'}</span>
              </div>
            </div>

            {/* 4. Approved */}
            <div className="dk-metric-card">
              <div className="dk-metric-top">
                <div className="dk-metric-icon-wrap green">
                  <CheckCircle2 size={18} />
                </div>
                <div className="dk-metric-info">
                  <span className="dk-metric-label">Approved</span>
                  <strong className="dk-metric-val">{approvedCount}</strong>
                </div>
              </div>
              <div className="dk-metric-sub">
                <span>{referrals.length > 0 ? `${Math.round((approvedCount / referrals.length) * 100)}% of total` : '0% of total'}</span>
              </div>
            </div>

            {/* 5. Your Referral Code */}
            <div className="dk-ref-code-card">
              <div className="dk-ref-code-left">
                <div className="dk-metric-icon-wrap">
                  <QrCode size={18} />
                </div>
                <div>
                  <div className="dk-ref-code-label">Your Referral Code</div>
                  <strong className="dk-ref-code-val">{referralCode}</strong>
                </div>
              </div>
              <button
                type="button"
                className={`dk-ref-copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopyCode}
                title="Copy Referral Code"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </section>

          {/* Row 2: Loan Products Section */}
          <section className="dk-products-section">
            <div className="dk-section-header">
              <div>
                <h2 className="dk-section-title">Loan Products</h2>
                <p className="dk-section-sub">Select a loan product to create a referral</p>
              </div>
              <div
                className="dk-view-all-link"
                onClick={() => handleOpenModal(PRODUCTS[0])}
              >
                <span>View All Products</span>
                <ArrowUpRight size={14} />
              </div>
            </div>

            <div className="dk-products-grid">
              {PRODUCTS.map(prod => (
                <div key={prod.id} className="dk-prod-card">
                  <div>
                    {/* Top Row: Icon + Badge */}
                    <div className="dk-prod-card-top">
                      <div className={`dk-prod-icon-box ${prod.colorType}`}>
                        {prod.icon}
                      </div>
                      <span className={`dk-prod-badge ${prod.colorType}`}>
                        {prod.commRate}
                      </span>
                    </div>

                    <h3 className="dk-prod-name">{prod.name}</h3>

                    {/* Specifications */}
                    <div className="dk-prod-specs">
                      <div className="dk-prod-spec-row">
                        <span>Min. Loan Amount</span>
                        <strong>{prod.minAmountStr}</strong>
                      </div>
                      <div className="dk-prod-spec-row">
                        <span>Starting Rate</span>
                        <strong>{prod.startingRate}</strong>
                      </div>
                      <div className="dk-prod-spec-row">
                        <span>Est. Payout</span>
                        <strong
                          style={{
                            color:
                              prod.colorType === 'green'
                                ? '#10b981'
                                : prod.colorType === 'amber'
                                ? '#f59e0b'
                                : prod.colorType === 'blue'
                                ? '#3b82f6'
                                : '#a855f7',
                          }}
                        >
                          {prod.examplePayout}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Create Referral Button */}
                  <button
                    type="button"
                    className="dk-prod-btn"
                    onClick={() => handleOpenModal(prod)}
                  >
                    <Plus size={15} strokeWidth={2.5} />
                    <span>Create Referral</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Row 3: Recent Referrals Table Section */}
          <section className="dk-table-card">
            {/* Table Header with Filters */}
            <div className="dk-table-header">
              <div className="dk-table-left-group">
                <h2 className="dk-table-title">Recent Referrals</h2>
                <div className="dk-filter-pills">
                  <button
                    type="button"
                    className={`dk-filter-pill ${activeFilter === 'All' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('All')}
                  >
                    All ({referrals.length})
                  </button>
                  <button
                    type="button"
                    className={`dk-filter-pill ${activeFilter === 'Pending' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('Pending')}
                  >
                    Pending ({pendingCount})
                  </button>
                  <button
                    type="button"
                    className={`dk-filter-pill ${activeFilter === 'Approved' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('Approved')}
                  >
                    Approved ({approvedCount})
                  </button>
                </div>
              </div>

              {/* Date Filter Dropdown */}
              <div className="dk-date-dropdown">
                <Calendar size={14} />
                <span>Last 30 days</span>
                <ChevronDown size={14} />
              </div>
            </div>

            {/* Table */}
            <div className="dk-table-wrap">
              <table className="dk-table">
                <thead>
                  <tr>
                    <th style={{ width: 36 }}>#</th>
                    <th>APPLICANT</th>
                    <th>CITY</th>
                    <th>PRODUCT</th>
                    <th>LOAN AMOUNT</th>
                    <th>EST. COMMISSION</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                    <th style={{ textAlign: 'center', width: 60 }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReferrals.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '56px 16px', color: '#64748b' }}>
                        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                          <Users size={36} style={{ color: '#475569' }} />
                          <div style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>
                            {searchQuery ? 'No referrals found' : 'No referrals yet'}
                          </div>
                          <p style={{ fontSize: 13, color: '#64748b', maxWidth: 360, margin: 0, lineHeight: 1.5 }}>
                            {searchQuery
                              ? `No applicants matched "${searchQuery}". Try a different name or search term.`
                              : 'Submit your first referral lead using the button below to start tracking applications and earning payouts.'}
                          </p>
                          {!searchQuery && (
                            <button
                              type="button"
                              className="dk-btn-create"
                              style={{ marginTop: 6 }}
                              onClick={() => handleOpenModal()}
                            >
                              <Plus size={15} strokeWidth={2.5} />
                              <span>Create Your First Referral</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredReferrals.map(row => (
                      <tr key={row.id}>
                        <td style={{ color: '#64748b', fontWeight: 600 }}>{row.id}</td>
                        <td>
                          <div className="dk-app-cell">
                            <div className="dk-app-avatar">{row.initials}</div>
                            <div>
                              <span className="dk-app-name">{row.name}</span>
                              <span className="dk-app-phone">{row.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: '#94a3b8' }}>{row.city}</td>
                        <td>
                          <span className={`dk-tag ${row.productClass}`}>
                            {row.product}
                          </span>
                        </td>
                        <td style={{ color: '#ffffff', fontWeight: 700 }}>
                          {row.loanAmount}
                        </td>
                        <td style={{ color: '#10b981', fontWeight: 700 }}>
                          {row.estCommission}
                        </td>
                        <td>
                          <span className={`dk-status-pill ${row.statusClass}`}>
                            ● {row.status}
                          </span>
                        </td>
                        <td style={{ color: '#94a3b8' }}>{row.date}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            className="dk-action-btn"
                            title="Actions"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* ── Create Referral Modal ── */}
      {isModalOpen && (
        <div className="dk-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="dk-modal" onClick={e => e.stopPropagation()}>
            <div className="dk-modal-head">
              <div>
                <h3 className="dk-modal-title">Create Referral</h3>
                <p className="dk-modal-sub">
                  {selectedProduct.name} •{' '}
                  <span style={{ color: '#10b981', fontWeight: 700 }}>
                    {selectedProduct.commRate}
                  </span>
                </p>
              </div>
              <button
                type="button"
                className="dk-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="dk-form-group">
                <label className="dk-form-label">Loan Product</label>
                <select
                  className="dk-form-select"
                  value={selectedProduct.id}
                  onChange={e => {
                    const found = PRODUCTS.find(p => p.id === e.target.value) || PRODUCTS[0]
                    setSelectedProduct(found)
                    setFormAmount(String(found.minAmountNum))
                  }}
                >
                  {PRODUCTS.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.commRate} • Min {p.minAmountStr})
                    </option>
                  ))}
                </select>
              </div>

              <div className="dk-form-group">
                <label className="dk-form-label">Applicant Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="dk-form-input"
                  autoFocus
                />
              </div>

              <div className="dk-form-row">
                <div className="dk-form-group">
                  <label className="dk-form-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    className="dk-form-input"
                  />
                </div>

                <div className="dk-form-group">
                  <label className="dk-form-label">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={formCity}
                    onChange={e => setFormCity(e.target.value)}
                    className="dk-form-input"
                  />
                </div>
              </div>

              <div className="dk-form-group">
                <label className="dk-form-label">Requested Loan Amount (₹) *</label>
                <input
                  type="text"
                  required
                  value={formAmount}
                  onChange={e => setFormAmount(e.target.value)}
                  className="dk-form-input"
                />
              </div>

              {/* Live Commission Calculator */}
              <div className="dk-calc-box">
                <div>
                  <span className="dk-calc-label">
                    Estimated Partner Commission ({selectedProduct.commRate})
                  </span>
                  <div style={{ fontSize: 11, color: '#10b981', marginTop: 2 }}>
                    Instant settlement via UPI on loan disbursement
                  </div>
                </div>
                <strong className="dk-calc-val">
                  ₹{liveComm.toLocaleString('en-IN')}
                </strong>
              </div>

              <button type="submit" className="dk-modal-submit-btn">
                Submit Referral
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardView
