import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import '../styles/admin-panel.css'
import {
  getStoredTestimonials,
  saveStoredTestimonials,
  resetToDefaultTestimonials,
  type PartnerTestimonial,
} from '../data/testimonialsData'

interface Lead {
  id: string
  partner_id: string
  applicant_name: string
  applicant_phone: string
  applicant_city: string
  loan_product: string
  loan_amount: number
  assigned_bank: string
  status: string
  commission_amount: number
  notes: string
  created_at: string
  partner_name?: string
}

interface PartnerRow {
  id: string
  full_name: string
  email: string
  phone: string
  referral_code: string
  payout_upi_id: string
  created_at: string
  lead_count?: number
  total_earned?: number
}

const AdminPanel = ({ onBackToHome }: { onBackToHome: () => void }) => {
  const { partner, logout } = useAuth()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [leads, setLeads] = useState<Lead[]>([])
  const [partners, setPartners] = useState<PartnerRow[]>([])
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [statusNote, setStatusNote] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Testimonials management
  const [testimonials, setTestimonials] = useState<PartnerTestimonial[]>(() => getStoredTestimonials())
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [tForm, setTForm] = useState<{
    name: string
    role: string
    firm: string
    city: string
    category: 'Home Loan' | 'Business Loan' | 'Loan Against Property' | 'Personal Loan'
    image: string
    quote: string
    metricBadge: string
  }>({
    name: '',
    role: '',
    firm: '',
    city: 'Mumbai',
    category: 'Home Loan',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    quote: '',
    metricBadge: '',
  })

  const handleOpenAddTestimonial = () => {
    setEditingId(null)
    setTForm({
      name: '',
      role: '',
      firm: '',
      city: 'Mumbai',
      category: 'Home Loan',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      quote: '',
      metricBadge: '',
    })
    setIsTestimonialModalOpen(true)
  }

  const handleOpenEditTestimonial = (t: PartnerTestimonial) => {
    setEditingId(t.id)
    setTForm({
      name: t.name,
      role: t.role,
      firm: t.firm || '',
      city: t.city,
      category: t.category,
      image: t.image,
      quote: t.quote,
      metricBadge: t.metricBadge || '',
    })
    setIsTestimonialModalOpen(true)
  }

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tForm.name.trim() || !tForm.quote.trim()) return

    let updated: PartnerTestimonial[]
    if (editingId) {
      updated = testimonials.map(item =>
        item.id === editingId
          ? { ...item, ...tForm }
          : item
      )
    } else {
      const newItem: PartnerTestimonial = {
        id: Date.now().toString(),
        ...tForm,
      }
      updated = [newItem, ...testimonials]
    }
    setTestimonials(updated)
    saveStoredTestimonials(updated)
    setIsTestimonialModalOpen(false)
  }

  const handleDeleteTestimonial = (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return
    const updated = testimonials.filter(t => t.id !== id)
    setTestimonials(updated)
    saveStoredTestimonials(updated)
  }

  const handleResetTestimonials = () => {
    if (!confirm('Reset testimonials to default verified partner stories?')) return
    const def = resetToDefaultTestimonials()
    setTestimonials(def)
  }

  const fetchLeads = async (silent = false) => {
    if (!silent) setIsRefreshing(true)
    try {
      const res = await fetch('/api/leads/all')
      const data = await res.json()
      if (data && Array.isArray(data.leads)) {
        setLeads(data.leads)
      } else {
        setLeads([])
      }
    } catch {
      // keep existing leads on error
    } finally {
      if (!silent) setIsRefreshing(false)
    }
  }

  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/auth/partners')
      const data = await res.json()
      if (data && Array.isArray(data.partners)) {
        setPartners(data.partners)
      } else {
        setPartners([])
      }
    } catch {
      // keep existing partners on error
    }
  }

  // Fetch all leads and partners on mount + real-time interval polling
  useEffect(() => {
    fetchLeads(false)
    fetchPartners()

    // Real-time synchronization polling every 3 seconds
    const interval = setInterval(() => {
      fetchLeads(true)
      fetchPartners()
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Also fetch fresh data whenever switching active sections
  useEffect(() => {
    fetchLeads(true)
  }, [activeSection])

  const handleUpdateLeadStatus = async () => {
    if (!selectedLead || !newStatus) return
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/leads/${selectedLead.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes: statusNote }),
      })
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status: newStatus } : l))
        setSelectedLead(null)
        setStatusNote('')
        setNewStatus('')
      }
    } catch {
      // Optimistic update
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status: newStatus } : l))
      setSelectedLead(null)
    }
    setIsUpdating(false)
  }

  const filteredLeads = leads.filter(l => {
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter
    const q = searchQuery.toLowerCase().trim()
    if (!q) return matchesStatus
    const applicant = (l.applicant_name || '').toLowerCase()
    const product = (l.loan_product || '').toLowerCase()
    const partnerName = (l.partner_name || '').toLowerCase()
    const phone = (l.applicant_phone || '').toLowerCase()
    const city = (l.applicant_city || '').toLowerCase()
    return matchesStatus && (
      applicant.includes(q) ||
      product.includes(q) ||
      partnerName.includes(q) ||
      phone.includes(q) ||
      city.includes(q)
    )
  })

  // Dashboard stats
  const totalLeads = leads.length
  const disbursedLeads = leads.filter(l => l.status === 'Disbursed').length
  const pendingLeads = leads.filter(l => ['Submitted', 'In Review'].includes(l.status)).length
  const totalCommissions = leads.reduce((sum, l) => sum + (l.status === 'Disbursed' ? Number(l.commission_amount) : 0), 0)
  const totalPartners = partners.length

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'leads', label: 'All Referrals', icon: '📋' },
    { id: 'partners', label: 'Partners', icon: '👥' },
    { id: 'testimonials', label: 'Testimonials', icon: '💬' },
    { id: 'products', label: 'Loan Products', icon: '🏷️' },
    { id: 'payouts', label: 'Payouts', icon: '💰' },
  ]

  const statusColors: Record<string, string> = {
    Submitted: '#3B82F6',
    'In Review': '#F59E0B',
    Sanctioned: '#8B5CF6',
    Disbursed: '#1F9D55',
    Rejected: '#EF4444',
  }

  return (
    <div className="dashboard-container admin-panel">
      {/* Sidebar */}
      <aside className="dash-sidebar admin-sidebar">
        <div className="dash-brand-row" onClick={onBackToHome} style={{ cursor: 'pointer' }}>
          <div className="brand-dot-logo" style={{ background: '#dc2626' }}><span>A</span></div>
          <span className="brand-wordmark">Admin Panel</span>
        </div>

        <nav className="dash-nav-menu">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              type="button"
              className={`dash-menu-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="dash-sidebar-footer">
          <button type="button" className="btn-exit-portal" onClick={logout}>
            🚪 Sign Out
          </button>
          <button type="button" className="btn-exit-portal" onClick={onBackToHome} style={{ marginTop: 4 }}>
            ← Back to Site
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dash-content-area">
        <header className="dash-header-bar">
          <div className="dash-search-container">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9AA39F" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Search leads, partners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="dash-search-field"
            />
          </div>
          <div className="dash-header-right">
            <button
              type="button"
              onClick={() => { fetchLeads(false); fetchPartners(); }}
              title="Refresh leads and partners data"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#e2e8f0',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              <span style={{ display: 'inline-block', transform: isRefreshing ? 'rotate(180deg)' : 'none', transition: 'transform 0.4s' }}>🔄</span>
              <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
            </button>
            <div className="admin-badge-pill">ADMIN</div>
            <div className="user-profile-widget">
              <div className="user-avatar-circle" style={{ background: '#dc2626' }}>{(partner?.full_name || 'A')[0]}</div>
              <div className="user-text-col">
                <strong className="user-name-title">{partner?.full_name || 'Admin'}</strong>
                <span className="user-role-label">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dash-workspace">
          {/* ADMIN DASHBOARD */}
          {activeSection === 'dashboard' && (
            <>
              <div className="welcome-greeting-row">
                <div>
                  <h2 className="greeting-title">Admin Dashboard 🛡️</h2>
                  <p className="greeting-subtitle">Overview of platform performance and activity</p>
                </div>
              </div>

              <div className="stats-metric-cards-grid">
                <div className="metric-box">
                  <div className="metric-icon-tile blue">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div className="metric-data-wrap">
                    <span className="metric-label">Total Partners</span>
                    <strong className="metric-bold-value">{totalPartners}</strong>
                    <span className="metric-growth-text blue">Active accounts</span>
                  </div>
                </div>

                <div className="metric-box">
                  <div className="metric-icon-tile green">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F9D55" strokeWidth="2.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                  </div>
                  <div className="metric-data-wrap">
                    <span className="metric-label">Total Referrals</span>
                    <strong className="metric-bold-value">{totalLeads}</strong>
                    <span className="metric-growth-text green">All time</span>
                  </div>
                </div>

                <div className="metric-box">
                  <div className="metric-icon-tile green">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F9D55" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div className="metric-data-wrap">
                    <span className="metric-label">Disbursed</span>
                    <strong className="metric-bold-value">{disbursedLeads}</strong>
                    <span className="metric-growth-text neutral">{totalLeads > 0 ? Math.round(disbursedLeads / totalLeads * 100) : 0}% conversion</span>
                  </div>
                </div>

                <div className="metric-box">
                  <div className="metric-icon-tile orange">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div className="metric-data-wrap">
                    <span className="metric-label">Pending</span>
                    <strong className="metric-bold-value">{pendingLeads}</strong>
                    <span className="metric-growth-text orange">Awaiting action</span>
                  </div>
                </div>
              </div>

              <div className="stats-metric-cards-grid" style={{ marginTop: 16 }}>
                <div className="metric-box" style={{ gridColumn: 'span 2' }}>
                  <div className="metric-icon-tile green">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F9D55" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <div className="metric-data-wrap">
                    <span className="metric-label">Total Commissions Paid</span>
                    <strong className="metric-bold-value">₹ {totalCommissions.toLocaleString('en-IN')}</strong>
                    <span className="metric-growth-text green">To all partners</span>
                  </div>
                </div>
              </div>

              {/* Recent Leads Quick View */}
              <div className="panel-card" style={{ marginTop: 24 }}>
                <div className="panel-card-header">
                  <h3 className="panel-title">Recent Referrals</h3>
                  <button type="button" className="link-view-all" onClick={() => setActiveSection('leads')}>View all →</button>
                </div>
                <div className="admin-table-wrapper">
                  {leads.length === 0 ? (
                    <div className="admin-empty-state">
                      <span>📋</span>
                      <p>No referrals submitted yet. Real leads submitted by partners will appear here.</p>
                    </div>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Applicant</th>
                          <th>Partner</th>
                          <th>Product</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.slice(0, 5).map(lead => (
                          <tr key={lead.id}>
                            <td><strong>{lead.applicant_name}</strong></td>
                            <td style={{ color: '#10b981' }}>{lead.partner_name || 'Verified Partner'}</td>
                            <td>{lead.loan_product}</td>
                            <td>₹ {Number(lead.loan_amount).toLocaleString('en-IN')}</td>
                            <td>
                              <span className="admin-status-pill" style={{ background: `${statusColors[lead.status] || '#666'}20`, color: statusColors[lead.status] || '#666' }}>
                                {lead.status}
                              </span>
                            </td>
                            <td>{new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ALL REFERRALS */}
          {activeSection === 'leads' && (
            <>
              <div className="welcome-greeting-row">
                <div>
                  <h2 className="greeting-title">All Referrals</h2>
                  <p className="greeting-subtitle">Manage and update referral lead statuses</p>
                </div>
              </div>

              <div className="admin-filters-bar">
                {['All', 'Submitted', 'In Review', 'Sanctioned', 'Disbursed', 'Rejected'].map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`admin-filter-pill ${statusFilter === s ? 'active' : ''}`}
                    onClick={() => setStatusFilter(s)}
                    style={statusFilter === s ? { background: statusColors[s] || '#0f3d2e', color: '#fff' } : {}}
                  >
                    {s} {s !== 'All' ? `(${leads.filter(l => l.status === s).length})` : `(${leads.length})`}
                  </button>
                ))}
              </div>

              <div className="panel-card" style={{ marginTop: 16 }}>
                <div className="admin-table-wrapper">
                  {filteredLeads.length === 0 ? (
                    <div className="admin-empty-state">
                      <span>🔍</span>
                      <p>No referrals found matching the selected criteria.</p>
                    </div>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Applicant</th>
                          <th>Partner</th>
                          <th>Phone</th>
                          <th>City</th>
                          <th>Product</th>
                          <th>Amount</th>
                          <th>Bank</th>
                          <th>Commission</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map(lead => (
                          <tr key={lead.id}>
                            <td><strong>{lead.applicant_name}</strong></td>
                            <td style={{ color: '#10b981', fontWeight: 600 }}>{lead.partner_name || 'Verified Partner'}</td>
                            <td>{lead.applicant_phone}</td>
                            <td>{lead.applicant_city}</td>
                            <td>{lead.loan_product}</td>
                            <td>₹ {Number(lead.loan_amount).toLocaleString('en-IN')}</td>
                            <td>{lead.assigned_bank}</td>
                            <td>₹ {Number(lead.commission_amount).toLocaleString('en-IN')}</td>
                            <td>
                              <span className="admin-status-pill" style={{ background: `${statusColors[lead.status] || '#666'}20`, color: statusColors[lead.status] || '#666' }}>
                                {lead.status}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="admin-action-btn"
                                onClick={() => { setSelectedLead(lead); setNewStatus(lead.status) }}
                              >
                                Update
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}

          {/* PARTNERS LIST */}
          {activeSection === 'partners' && (
            <>
              <div className="welcome-greeting-row">
                <div>
                  <h2 className="greeting-title">Partners</h2>
                  <p className="greeting-subtitle">View and manage all registered partners</p>
                </div>
              </div>

              <div className="panel-card" style={{ marginTop: 16 }}>
                <div className="admin-table-wrapper">
                  {partners.length === 0 ? (
                    <div className="admin-empty-state">
                      <span>👥</span>
                      <p>No partners registered yet. Registered partner accounts will appear here.</p>
                    </div>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Referral Code</th>
                          <th>UPI ID</th>
                          <th>Leads</th>
                          <th>Earned</th>
                          <th>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {partners.map(p => (
                          <tr key={p.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div className="user-avatar-circle" style={{ width: 28, height: 28, fontSize: 11 }}>
                                  {p.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <strong>{p.full_name}</strong>
                              </div>
                            </td>
                            <td>{p.email}</td>
                            <td>{p.phone}</td>
                            <td><code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{p.referral_code}</code></td>
                            <td>{p.payout_upi_id || '—'}</td>
                            <td>{p.lead_count || 0}</td>
                            <td>₹ {(p.total_earned || 0).toLocaleString('en-IN')}</td>
                            <td>{new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}

          {/* LOAN PRODUCTS MANAGEMENT */}
          {activeSection === 'products' && (
            <>
              <div className="welcome-greeting-row">
                <div>
                  <h2 className="greeting-title">Loan Products</h2>
                  <p className="greeting-subtitle">Manage available loan products and commission rates</p>
                </div>
              </div>

              <div className="admin-products-grid">
                {[
                  { name: 'Home Loan', rate: '0.3%', min: '₹50 Lacs', example: '₹30k on ₹1 Cr', icon: '🏠', color: '#e6f7ee' },
                  { name: 'Loan Against Property', rate: '0.5%', min: '₹1 Crore', example: '₹50k on ₹1 Cr', icon: '🏢', color: '#fff7ed' },
                  { name: 'Personal Loan', rate: '1.0%', min: '₹5 Lacs', example: '₹10k on ₹10L', icon: '💳', color: '#eff6ff' },
                  { name: 'Business Loan', rate: '1.0%', min: '₹10 Lacs', example: '₹25k on ₹25L', icon: '💼', color: '#f5f3ff' },
                ].map((prod, i) => (
                  <div key={i} className="admin-product-card">
                    <div className="admin-product-icon" style={{ background: prod.color }}>{prod.icon}</div>
                    <h4>{prod.name}</h4>
                    <div className="admin-product-stats">
                      <div><span>Commission Rate</span><strong style={{ color: '#1F9D55' }}>{prod.rate}</strong></div>
                      <div><span>Min Amount</span><strong>{prod.min}</strong></div>
                      <div><span>Example Payout</span><strong style={{ fontSize: 12, color: '#6b7280' }}>{prod.example}</strong></div>
                    </div>
                    <span className="admin-product-active-badge">Active</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* PAYOUTS SECTION */}
          {activeSection === 'payouts' && (
            <>
              <div className="welcome-greeting-row">
                <div>
                  <h2 className="greeting-title">Payout Management</h2>
                  <p className="greeting-subtitle">Track and manage partner commission payouts</p>
                </div>
              </div>

              <div className="stats-metric-cards-grid">
                <div className="metric-box">
                  <div className="metric-icon-tile green">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F9D55" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <div className="metric-data-wrap">
                    <span className="metric-label">Total Paid Out</span>
                    <strong className="metric-bold-value">₹ {totalCommissions.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
                <div className="metric-box">
                  <div className="metric-icon-tile orange">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div className="metric-data-wrap">
                    <span className="metric-label">Pending Payouts</span>
                    <strong className="metric-bold-value">₹ 0</strong>
                  </div>
                </div>
              </div>

              <div className="panel-card" style={{ marginTop: 24 }}>
                <div className="panel-card-header">
                  <h3 className="panel-title">Payout History</h3>
                </div>
                <div className="admin-empty-state">
                  <span>💰</span>
                  <p>All payouts are up to date. No pending disbursements.</p>
                </div>
              </div>
            </>
          )}

          {/* TESTIMONIALS MANAGER */}
          {activeSection === 'testimonials' && (
            <>
              <div className="welcome-greeting-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 className="greeting-title">Partner Testimonials Manager 💬</h2>
                  <p className="greeting-subtitle">Manage verified stories from loan referrers displayed on the homepage</p>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleResetTestimonials}
                    style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid #d1d5db', background: '#ffffff', color: '#4b5563', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  >
                    ↺ Reset Defaults
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenAddTestimonial}
                    style={{ padding: '9px 16px', borderRadius: 8, border: 'none', background: '#1F9D55', color: '#ffffff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    + Add Testimonial
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 16, marginTop: 20 }}>
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: 14,
                      padding: 18,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img
                            src={t.image}
                            alt={t.name}
                            style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #1F9D55' }}
                          />
                          <div>
                            <strong style={{ fontSize: 14, color: '#111827', display: 'block' }}>{t.name}</strong>
                            <span style={{ fontSize: 12, color: '#6b7280' }}>
                              {t.role} {t.firm ? `• ${t.firm}` : ''}
                            </span>
                          </div>
                        </div>
                        <span style={{ fontSize: 11, background: '#f3f4f6', color: '#374151', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                          {t.city}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                        <span style={{ fontSize: 11, background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                          {t.category}
                        </span>
                        {t.metricBadge && (
                          <span style={{ fontSize: 11, background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: 999, fontWeight: 600 }}>
                            ⚡ {t.metricBadge}
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.5, margin: '8px 0', fontStyle: 'italic' }}>
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14, paddingTop: 12, borderTop: '1px solid #f3f4f6' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEditTestimonial(t)}
                        style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #d1d5db', background: '#f9fafb', fontSize: 12, fontWeight: 600, color: '#374151', cursor: 'pointer' }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTestimonial(t.id)}
                        style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #fee2e2', background: '#fef2f2', fontSize: 12, fontWeight: 600, color: '#dc2626', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Status Update Modal */}
      {selectedLead && (
        <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <button className="modal-close-btn" onClick={() => setSelectedLead(null)}>✕</button>
            <div className="modal-header">
              <h3>Update Lead Status</h3>
              <p>Applicant: <strong>{selectedLead.applicant_name}</strong> • {selectedLead.loan_product}</p>
            </div>

            <div className="modal-form" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="admin-lead-detail-row">
                <span>Current Status:</span>
                <span className="admin-status-pill" style={{ background: `${statusColors[selectedLead.status]}20`, color: statusColors[selectedLead.status] }}>
                  {selectedLead.status}
                </span>
              </div>

              <div className="form-group">
                <label>New Status</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="filter-select">
                  <option value="Submitted">Submitted</option>
                  <option value="In Review">In Review</option>
                  <option value="Sanctioned">Sanctioned</option>
                  <option value="Disbursed">Disbursed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="form-group">
                <label>Admin Notes</label>
                <textarea
                  rows={3}
                  placeholder="Add notes about this status change..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e5e3', borderRadius: 10, fontSize: 14, resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <button
                type="button"
                className="btn-modal-submit"
                disabled={isUpdating}
                onClick={handleUpdateLeadStatus}
              >
                {isUpdating ? 'Updating...' : `Update to "${newStatus}" →`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Add/Edit Modal */}
      {isTestimonialModalOpen && (
        <div className="modal-overlay" onClick={() => setIsTestimonialModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <button className="modal-close-btn" onClick={() => setIsTestimonialModalOpen(false)}>✕</button>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Testimonial' : 'Add New Partner Testimonial'}</h3>
              <p>This will update the live homepage testimonial marquee immediately.</p>
            </div>

            <form onSubmit={handleSaveTestimonial} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                <div className="form-group">
                  <label>Partner Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CA Rajesh Verma"
                    value={tForm.name}
                    onChange={(e) => setTForm({ ...tForm, name: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e0e5e3', borderRadius: 8, fontSize: 13 }}
                  />
                </div>
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai, Bengaluru"
                    value={tForm.city}
                    onChange={(e) => setTForm({ ...tForm, city: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e0e5e3', borderRadius: 8, fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                <div className="form-group">
                  <label>Professional Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chartered Accountant, Real Estate Broker"
                    value={tForm.role}
                    onChange={(e) => setTForm({ ...tForm, role: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e0e5e3', borderRadius: 8, fontSize: 13 }}
                  />
                </div>
                <div className="form-group">
                  <label>Firm / Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sharma Realty, Verma & Co."
                    value={tForm.firm}
                    onChange={(e) => setTForm({ ...tForm, firm: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e0e5e3', borderRadius: 8, fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                <div className="form-group">
                  <label>Loan Specialty</label>
                  <select
                    value={tForm.category}
                    onChange={(e) => setTForm({ ...tForm, category: e.target.value as any })}
                    style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e0e5e3', borderRadius: 8, fontSize: 13 }}
                  >
                    <option value="Home Loan">Home Loan</option>
                    <option value="Loan Against Property">Loan Against Property</option>
                    <option value="Business Loan">Business Loan</option>
                    <option value="Personal Loan">Personal Loan</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Metric Badge (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹12 Cr Disbursed in Q3"
                    value={tForm.metricBadge}
                    onChange={(e) => setTForm({ ...tForm, metricBadge: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e0e5e3', borderRadius: 8, fontSize: 13 }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Avatar Photo URL (Square ratio)</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={tForm.image}
                  onChange={(e) => setTForm({ ...tForm, image: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e0e5e3', borderRadius: 8, fontSize: 13 }}
                />
              </div>

              <div className="form-group">
                <label>Partner Testimonial Quote *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share their real experience with JustRefer, disbursals, commission payouts, bank support..."
                  value={tForm.quote}
                  onChange={(e) => setTForm({ ...tForm, quote: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e5e3', borderRadius: 8, fontSize: 13, resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <button
                type="submit"
                className="btn-modal-submit"
                style={{ marginTop: 8 }}
              >
                {editingId ? 'Save Changes' : '+ Publish Testimonial to Homepage'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
