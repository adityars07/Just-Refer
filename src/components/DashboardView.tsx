import React, { useState, useEffect, useCallback } from 'react'
import {
  Home,
  Building2,
  User,
  Briefcase,
  Bell,
  ArrowRight,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import '../styles/partner-dashboard.css'

interface DashboardViewProps {
  onBackToHome: () => void
  onOpenAdmin?: () => void
  onOpenSettings?: () => void
}

interface ProductDef {
  id: string
  name: string
  subtitle: string
  commRate: string
  commPercent: number
  examplePayout: string
  startingRate: string
  minAmountStr: string
  minAmountNum: number
  tileClass: 'amber' | 'pink' | 'blue' | 'green'
  icon: React.ReactNode
}

const PRODUCTS: ProductDef[] = [
  {
    id: 'home-loan',
    name: 'Home Loan',
    subtitle: 'From ₹50 Lakhs · 7.25% p.a.',
    commRate: '0.3% payout',
    commPercent: 0.003,
    examplePayout: '₹15,000 per ₹50L',
    startingRate: '7.25% p.a.',
    minAmountStr: '₹50 Lakhs',
    minAmountNum: 5000000,
    tileClass: 'amber',
    icon: <Home size={18} strokeWidth={1.75} color="#111111" />,
  },
  {
    id: 'lap',
    name: 'Loan Against Property',
    subtitle: 'From ₹1 Crore · 8.00% p.a.',
    commRate: '0.5% payout',
    commPercent: 0.005,
    examplePayout: '₹50,000 per ₹1Cr',
    startingRate: '8.00% p.a.',
    minAmountStr: '₹1 Crore',
    minAmountNum: 10000000,
    tileClass: 'pink',
    icon: <Building2 size={18} strokeWidth={1.75} color="#111111" />,
  },
  {
    id: 'personal-loan',
    name: 'Personal Loan',
    subtitle: 'From ₹5 Lakhs · 9.99% p.a.',
    commRate: '1.0% payout',
    commPercent: 0.01,
    examplePayout: '₹10,000 per ₹10L',
    startingRate: '9.99% p.a.',
    minAmountStr: '₹5 Lakhs',
    minAmountNum: 500000,
    tileClass: 'blue',
    icon: <User size={18} strokeWidth={1.75} color="#111111" />,
  },
  {
    id: 'business-loan',
    name: 'Business Loan',
    subtitle: 'From ₹10 Lakhs · 10.99% p.a.',
    commRate: '1.0% payout',
    commPercent: 0.01,
    examplePayout: '₹25,000 per ₹25L',
    startingRate: '10.99% p.a.',
    minAmountStr: '₹10 Lakhs',
    minAmountNum: 1000000,
    tileClass: 'green',
    icon: <Briefcase size={18} strokeWidth={1.75} color="#111111" />,
  },
]

export interface ReferralItem {
  id: number
  leadId?: string
  applicant_name: string
  applicant_phone: string
  applicant_city: string
  loan_product: string
  loan_amount: number
  est_commission: number
  status: string
  created_at: string
}

type RangeOption = '1W' | '1M' | '3M' | 'ALL'
type StatusFilter = 'All' | 'Pending' | 'Approved'

const DashboardView = ({ onBackToHome, onOpenAdmin, onOpenSettings }: DashboardViewProps) => {
  const { partner } = useAuth()
  const partnerId = partner?.id || '00000000-0000-0000-0000-000000000001'
  const partnerName = partner?.full_name ? partner.full_name.trim().split(' ')[0] : 'Aditya'
  const partnerCode = partner?.referral_code || 'JR-AYUS7175'

  // Interactive States
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [activeTab, setActiveTab] = useState<'Home' | 'Referrals'>('Home')
  const [activeRange, setActiveRange] = useState<RangeOption>('ALL')
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('All')
  const [copied, setCopied] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Real backend data states
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
  const [isSubmitting, setIsSubmitting] = useState(false)

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
            return {
              id: idx + 1,
              leadId: l.id,
              applicant_name: l.applicant_name,
              applicant_phone: l.applicant_phone || '—',
              applicant_city: l.applicant_city || '—',
              loan_product: l.loan_product || 'Home Loan',
              loan_amount: amt,
              est_commission: comm,
              status: l.status || 'Submitted',
              created_at: l.created_at
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

  // Copy referral code (changes to "Copied" for 1.8 seconds)
  const handleCopyCode = () => {
    navigator.clipboard.writeText(partnerCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  // Open modal with specific product
  const handleOpenModal = (p?: ProductDef) => {
    const prod = p || PRODUCTS[0]
    setSelectedProduct(prod)
    setFormAmount(String(prod.minAmountNum))
    setFormName('')
    setFormPhone('')
    setFormCity('')
    setIsModalOpen(true)
  }

  // Form submission to backend
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return

    const numAmt = parseFloat(formAmount.replace(/[^0-9.]/g, '')) || selectedProduct.minAmountNum
    const comm = Math.round(numAmt * selectedProduct.commPercent)

    setIsSubmitting(true)
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
        setIsModalOpen(false)
      } else {
        // Fallback optimistic update
        const newRow: ReferralItem = {
          id: referrals.length + 1,
          applicant_name: formName,
          applicant_phone: formPhone || '—',
          applicant_city: formCity || '—',
          loan_product: selectedProduct.name,
          loan_amount: numAmt,
          est_commission: comm,
          status: 'Submitted',
          created_at: 'Today',
        }
        setReferrals(prev => [newRow, ...prev])
        setIsModalOpen(false)
      }
    } catch {
      setIsModalOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Counts calculation
  const pendingCount = referrals.filter(r =>
    ['submitted', 'pending', 'in review', 'in progress', 'progress', 'review'].includes(r.status.toLowerCase())
  ).length

  const approvedCount = referrals.filter(r =>
    ['approved', 'disbursed', 'sanctioned'].includes(r.status.toLowerCase())
  ).length

  // Filtered referrals
  const filteredReferrals = referrals.filter(r => {
    const st = r.status.toLowerCase()
    if (activeFilter === 'Pending') {
      return ['submitted', 'pending', 'in review', 'in progress', 'progress', 'review'].includes(st)
    }
    if (activeFilter === 'Approved') {
      return ['approved', 'disbursed', 'sanctioned'].includes(st)
    }
    return true
  })

  // Live Commission preview in modal
  const liveAmt = parseFloat(formAmount.replace(/[^0-9.]/g, '')) || 0
  const liveComm = Math.round(liveAmt * selectedProduct.commPercent)

  return (
    <div className="pd-page">
      {/* ─────────────────────────────────────────────
          1. HEADER
          ───────────────────────────────────────────── */}
      <header className="pd-header">
        <div className="pd-header-inner">
          <a
            href="#home"
            className="pd-wordmark"
            onClick={e => {
              e.preventDefault()
              onBackToHome()
            }}
          >
            justrefer
          </a>

          <nav className="pd-nav" aria-label="Main Navigation">
            {['Dashboard', 'Referrals', 'Payouts', 'Products', 'Reports'].map(item => (
              <button
                key={item}
                type="button"
                className={`pd-nav-link ${activeNav === item ? 'active' : ''}`}
                onClick={() => {
                  setActiveNav(item)
                  if (item === 'Referrals') {
                    const el = document.getElementById('recent-referrals-section')
                    el?.scrollIntoView({ behavior: 'smooth' })
                  } else if (item === 'Products') {
                    const el = document.getElementById('loan-products-section')
                    el?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                aria-current={activeNav === item ? 'page' : undefined}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="pd-header-actions">
            <button
              type="button"
              className="pd-btn-support"
              onClick={() => {
                window.location.href = 'mailto:support@justrefer.in?subject=Partner%20Support%20Request'
              }}
            >
              Support
            </button>

            <button
              type="button"
              className="pd-btn-create"
              onClick={() => handleOpenModal()}
            >
              <span>Create Referral</span>
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────
          2. CHARCOAL BAND
          ───────────────────────────────────────────── */}
      <main className="pd-charcoal-band">
        <div className="pd-band-inner">
          {/* Centred Heading Block */}
          <div className="pd-heading-block">
            <h1 className="pd-h1">Welcome back, {partnerName}</h1>
            <p className="pd-subtitle">
              Share loan products, track every referral and get paid.
            </p>
          </div>

          {/* App Panel */}
          <div className="pd-panel">
            {/* 2a. Panel Top Bar */}
            <div className="pd-panel-topbar">
              <span className="pd-panel-wordmark">justrefer</span>

              <div className="pd-mini-tabs" role="tablist">
                <button
                  type="button"
                  className={`pd-mini-tab ${activeTab === 'Home' ? 'active' : ''}`}
                  onClick={() => setActiveTab('Home')}
                  role="tab"
                  aria-selected={activeTab === 'Home'}
                >
                  Home
                </button>
                <button
                  type="button"
                  className={`pd-mini-tab ${activeTab === 'Referrals' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('Referrals')
                    const el = document.getElementById('recent-referrals-section')
                    el?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  role="tab"
                  aria-selected={activeTab === 'Referrals'}
                >
                  Referrals
                </button>
              </div>

              <div className="pd-panel-top-right">
                <button
                  type="button"
                  className="pd-btn-bell"
                  aria-label="Notifications"
                  title="Notifications"
                >
                  <Bell size={14} fill="currentColor" strokeWidth={1} />
                </button>

                <div className="pd-avatar-circle" title={partner?.full_name || 'Aditya'}>
                  {partner?.full_name ? partner.full_name.trim().charAt(0).toUpperCase() : 'A'}
                </div>
              </div>
            </div>

            {/* 2b. Panel Body */}
            <div className="pd-panel-body">
              {/* Row 1: Earnings card + Code card */}
              <div className="pd-row-earnings">
                {/* Earnings Card */}
                <section className="pd-card-earnings" aria-labelledby="total-earnings-title">
                  <div className="pd-earnings-left">
                    <span id="total-earnings-title" className="pd-mono-label">
                      TOTAL EARNINGS
                    </span>
                    <strong className="pd-earnings-val">
                      ₹{wallet.total_earned.toLocaleString('en-IN')}
                    </strong>

                    <div className="pd-payout-block">
                      <span className="pd-mono-label">AVAILABLE FOR PAYOUT</span>
                      <strong className="pd-payout-val">
                        ₹{wallet.available_balance.toFixed(2)}
                      </strong>
                    </div>
                  </div>

                  <div className="pd-earnings-right">
                    <div className="pd-pill-group" role="group" aria-label="Timeframe Range">
                      {(['1W', '1M', '3M', 'ALL'] as RangeOption[]).map(r => (
                        <button
                          key={r}
                          type="button"
                          className={`pd-pill ${activeRange === r ? 'active' : ''}`}
                          onClick={() => setActiveRange(r)}
                          aria-pressed={activeRange === r}
                        >
                          {r}
                        </button>
                      ))}
                    </div>

                    {/* Empty flat sparkline: one horizontal dotted line */}
                    <div className="pd-sparkline-wrap">
                      <svg
                        className="pd-sparkline-svg"
                        viewBox="0 0 280 60"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <line
                          x1="0"
                          y1="38"
                          x2="280"
                          y2="38"
                          stroke="#C9C7C1"
                          strokeWidth="1.5"
                          strokeDasharray="2 4"
                        />
                      </svg>
                    </div>
                  </div>
                </section>

                {/* Code Card */}
                <section className="pd-card-code" aria-labelledby="your-code-title">
                  <span id="your-code-title" className="pd-code-tag">
                    YOUR CODE
                  </span>

                  <div className="pd-code-row">
                    <span className="pd-code-val">{partnerCode}</span>
                    <button
                      type="button"
                      className="pd-btn-copy"
                      onClick={handleCopyCode}
                      aria-label="Copy referral code"
                    >
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <p className="pd-code-desc">
                    Share this code with new partners to link their referrals to your account.
                  </p>
                </section>
              </div>

              {/* Row 2: Three count cards */}
              <div className="pd-row-counts">
                <section className="pd-card-count" aria-labelledby="total-referrals-label">
                  <span id="total-referrals-label" className="pd-mono-label">
                    TOTAL REFERRALS
                  </span>
                  <strong className="pd-count-num">{referrals.length}</strong>
                </section>

                <section className="pd-card-count" aria-labelledby="pending-label">
                  <span id="pending-label" className="pd-mono-label">
                    PENDING
                  </span>
                  <strong className="pd-count-num">{pendingCount}</strong>
                </section>

                <section className="pd-card-count" aria-labelledby="approved-label">
                  <span id="approved-label" className="pd-mono-label">
                    APPROVED
                  </span>
                  <strong className="pd-count-num">{approvedCount}</strong>
                </section>
              </div>

              {/* Row 3: Loan Products Card */}
              <section
                id="loan-products-section"
                className="pd-card-products"
                aria-labelledby="loan-products-title"
              >
                <div className="pd-card-header">
                  <h2 id="loan-products-title" className="pd-card-title">
                    Loan products
                  </h2>
                  <a
                    href="#view-all-products"
                    className="pd-link-viewall"
                    onClick={e => {
                      e.preventDefault()
                      handleOpenModal()
                    }}
                  >
                    View all
                  </a>
                </div>

                <div className="pd-products-list">
                  {PRODUCTS.map(p => (
                    <div key={p.id} className="pd-product-row">
                      <div className={`pd-icon-tile ${p.tileClass}`} aria-hidden="true">
                        {p.icon}
                      </div>

                      <div className="pd-product-info">
                        <span className="pd-product-name">{p.name}</span>
                        <span className="pd-product-sub">{p.subtitle}</span>
                      </div>

                      <div className="pd-payout-box">
                        <span className="pd-payout-rate">{p.commRate}</span>
                        <span className="pd-payout-detail">{p.examplePayout}</span>
                      </div>

                      <button
                        type="button"
                        className="pd-btn-refer"
                        onClick={() => handleOpenModal(p)}
                        aria-label={`Refer ${p.name}`}
                      >
                        Refer
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Row 4: Recent Referrals Card */}
              <section
                id="recent-referrals-section"
                className="pd-card-referrals"
                aria-labelledby="recent-referrals-title"
              >
                <div className="pd-referrals-header">
                  <h2 id="recent-referrals-title" className="pd-card-title">
                    Recent referrals
                  </h2>

                  <div className="pd-pill-group" role="group" aria-label="Referrals Filter">
                    <button
                      type="button"
                      className={`pd-pill ${activeFilter === 'All' ? 'active' : ''}`}
                      onClick={() => setActiveFilter('All')}
                      aria-pressed={activeFilter === 'All'}
                    >
                      All ({referrals.length})
                    </button>
                    <button
                      type="button"
                      className={`pd-pill ${activeFilter === 'Pending' ? 'active' : ''}`}
                      onClick={() => setActiveFilter('Pending')}
                      aria-pressed={activeFilter === 'Pending'}
                    >
                      Pending ({pendingCount})
                    </button>
                    <button
                      type="button"
                      className={`pd-pill ${activeFilter === 'Approved' ? 'active' : ''}`}
                      onClick={() => setActiveFilter('Approved')}
                      aria-pressed={activeFilter === 'Approved'}
                    >
                      Approved ({approvedCount})
                    </button>
                  </div>

                  <span className="pd-mono-label" style={{ marginLeft: 'auto' }}>
                    LAST 30 DAYS
                  </span>
                </div>

                {/* Empty State vs Real Data Table */}
                {filteredReferrals.length === 0 ? (
                  <div className="pd-empty-box">
                    <p className="pd-empty-title">No referrals yet</p>
                    <p className="pd-empty-desc">
                      Create your first referral to start tracking applications and earning payouts.
                    </p>
                  </div>
                ) : (
                  <div className="pd-table-wrap">
                    <table className="pd-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Applicant</th>
                          <th>City</th>
                          <th>Product</th>
                          <th>Loan Amount</th>
                          <th>Est. Commission</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReferrals.map((r, index) => (
                          <tr key={r.leadId || r.id}>
                            <td style={{ color: '#6B6B6B' }}>{index + 1}</td>
                            <td>
                              <strong>{r.applicant_name}</strong>
                              <div style={{ fontSize: 11, color: '#6B6B6B' }}>{r.applicant_phone}</div>
                            </td>
                            <td style={{ color: '#55555A' }}>{r.applicant_city}</td>
                            <td>{r.loan_product}</td>
                            <td style={{ fontWeight: 600 }}>₹{r.loan_amount.toLocaleString('en-IN')}</td>
                            <td style={{ color: '#1F8A4C', fontWeight: 600 }}>
                              ₹{r.est_commission.toLocaleString('en-IN')}
                            </td>
                            <td>
                              <span
                                className={`pd-status-tag ${
                                  r.status.toLowerCase().includes('approv') || r.status.toLowerCase().includes('disburs')
                                    ? 'approved'
                                    : r.status.toLowerCase().includes('progress') || r.status.toLowerCase().includes('review')
                                    ? 'progress'
                                    : 'pending'
                                }`}
                              >
                                {r.status}
                              </span>
                            </td>
                            <td style={{ color: '#6B6B6B' }}>{r.created_at}</td>
                            <td style={{ textAlign: 'center' }}>
                              <button
                                type="button"
                                className="pd-btn-refer"
                                style={{ height: 28, padding: '0 10px', fontSize: 11 }}
                                onClick={() => handleOpenModal()}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* ─────────────────────────────────────────────
          3. FOOTER
          ───────────────────────────────────────────── */}
      <footer className="pd-footer">
        <div className="pd-footer-inner">
          <button
            type="button"
            className="pd-footer-link"
            onClick={() => {
              if (onOpenSettings) onOpenSettings()
              else onBackToHome()
            }}
          >
            Settings
          </button>
          <a
            href="mailto:support@justrefer.in"
            className="pd-footer-link"
          >
            Support
          </a>
          <button
            type="button"
            className="pd-footer-link"
            onClick={() => {
              if (onOpenAdmin) onOpenAdmin()
              else window.location.hash = 'admin'
            }}
          >
            Admin Panel
          </button>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────
          CREATE REFERRAL MODAL (FLAT, MATCHING SPEC TOKENS)
          ───────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="pd-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="pd-modal-card" onClick={e => e.stopPropagation()}>
            <div className="pd-modal-head">
              <div>
                <h3 className="pd-modal-title">Create Referral</h3>
                <p className="pd-modal-sub">
                  {selectedProduct.name} ·{' '}
                  <span style={{ color: '#1F8A4C', fontWeight: 500 }}>
                    {selectedProduct.commRate}
                  </span>
                </p>
              </div>
              <button
                type="button"
                className="pd-modal-close"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="pd-form">
              <div className="pd-form-group">
                <label className="pd-form-label">Select Loan Product</label>
                <select
                  value={selectedProduct.id}
                  onChange={e => {
                    const p = PRODUCTS.find(x => x.id === e.target.value)
                    if (p) {
                      setSelectedProduct(p)
                      setFormAmount(String(p.minAmountNum))
                    }
                  }}
                  className="pd-form-select"
                >
                  {PRODUCTS.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.commRate} · Min {p.minAmountStr})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pd-form-group">
                <label className="pd-form-label">Applicant Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="pd-form-input"
                  autoFocus
                />
              </div>

              <div className="pd-form-row">
                <div className="pd-form-group">
                  <label className="pd-form-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    className="pd-form-input"
                  />
                </div>

                <div className="pd-form-group">
                  <label className="pd-form-label">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={formCity}
                    onChange={e => setFormCity(e.target.value)}
                    className="pd-form-input"
                  />
                </div>
              </div>

              <div className="pd-form-group">
                <label className="pd-form-label">Requested Loan Amount (₹) *</label>
                <input
                  type="text"
                  required
                  value={formAmount}
                  onChange={e => setFormAmount(e.target.value)}
                  className="pd-form-input"
                />
              </div>

              <div className="pd-calc-summary">
                <div>
                  <div style={{ fontSize: 11, color: '#6B6B6B' }}>
                    Estimated Partner Commission ({selectedProduct.commRate})
                  </div>
                  <div style={{ fontSize: 11, color: '#1F8A4C', marginTop: 2 }}>
                    Direct payout settlement on loan disbursement
                  </div>
                </div>
                <strong style={{ fontSize: 16, color: '#111111', fontFamily: 'var(--pd-font-mono)' }}>
                  ₹{liveComm.toLocaleString('en-IN')}
                </strong>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="pd-btn-submit"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Referral →'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardView
