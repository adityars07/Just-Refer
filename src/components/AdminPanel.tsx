import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

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

  // Fetch all leads and partners on mount
  useEffect(() => {
    fetchLeads()
    fetchPartners()
  }, [])

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads/all')
      const data = await res.json()
      if (data.leads) {
        setLeads(data.leads)
      } else {
        setLeads([])
      }
    } catch {
      setLeads([])
    }
  }

  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/auth/partners')
      const data = await res.json()
      if (data.partners) {
        setPartners(data.partners)
      } else {
        setPartners([])
      }
    } catch {
      setPartners([])
    }
  }

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
    const matchesSearch = !searchQuery ||
      l.applicant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.loan_product.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
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
                  { name: 'Home Loan', rate: '0.5%', max: '₹50,000', icon: '🏠', color: '#fef3c7' },
                  { name: 'Personal Loan', rate: '1.0%', max: '₹10,000', icon: '💳', color: '#dbeafe' },
                  { name: 'Business Loan', rate: '1.5%', max: '₹25,000', icon: '💼', color: '#ffedd5' },
                  { name: 'Car Loan', rate: '0.75%', max: '₹12,000', icon: '🚗', color: '#bbf7d0' },
                  { name: 'Education Loan', rate: '0.75%', max: '₹10,000', icon: '🎓', color: '#99f6e4' },
                  { name: 'Loan Against Property', rate: '0.6%', max: '₹30,000', icon: '🏢', color: '#fed7aa' },
                ].map((prod, i) => (
                  <div key={i} className="admin-product-card">
                    <div className="admin-product-icon" style={{ background: prod.color }}>{prod.icon}</div>
                    <h4>{prod.name}</h4>
                    <div className="admin-product-stats">
                      <div><span>Commission Rate</span><strong>{prod.rate}</strong></div>
                      <div><span>Max Payout</span><strong>{prod.max}</strong></div>
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
    </div>
  )
}

export default AdminPanel
