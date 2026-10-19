import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

interface MyReferralsSectionProps {
  onOpenAddModal?: () => void
}

interface ReferralLead {
  id: string
  name: string
  loan: string
  amount: string
  status: string
  commission: string
  date: string
}

const MyReferralsSection = ({ onOpenAddModal }: MyReferralsSectionProps) => {
  const { partner } = useAuth()
  const partnerId = partner?.id || '00000000-0000-0000-0000-000000000001'

  const [selectedLoan, setSelectedLoan] = useState('All Loans')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [searchQuery, setSearchQuery] = useState('')
  const [referrals, setReferrals] = useState<ReferralLead[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/leads/partner/${partnerId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.leads) {
          setReferrals(
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
      .finally(() => setIsLoading(false))
  }, [partnerId])

  const filtered = referrals.filter((item) => {
    const matchesLoan = selectedLoan === 'All Loans' || item.loan === selectedLoan
    const matchesStatus = selectedStatus === 'All Status' || item.status === selectedStatus
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesLoan && matchesStatus && matchesSearch
  })

  return (
    <section className="my-referrals-page-section" id="my-referrals">
      <div className="container">
        {/* Header Strip with Title & Action */}
        <div className="referrals-section-header">
          <div>
            <h2 className="section-title-bold">My Referrals</h2>
            <p className="section-sub-copy">Track all your referrals and their real-time application status.</p>
          </div>
          <button
            type="button"
            className="btn-add-referral-dark"
            onClick={onOpenAddModal}
          >
            + Add Referral
          </button>
        </div>

        {/* Filters Bar */}
        <div className="referrals-filters-bar">
          <div className="filter-dropdown-wrap">
            <select
              value={selectedLoan}
              onChange={(e) => setSelectedLoan(e.target.value)}
              className="ref-select"
            >
              <option value="All Loans">All Loans ▾</option>
              <option value="Home Loan">Home Loan</option>
              <option value="Personal Loan">Personal Loan</option>
              <option value="Car Loan">Car Loan</option>
              <option value="Business Loan">Business Loan</option>
              <option value="Education Loan">Education Loan</option>
            </select>
          </div>

          <div className="filter-dropdown-wrap">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="ref-select"
            >
              <option value="All Status">All Status ▾</option>
              <option value="Submitted">Submitted</option>
              <option value="In Review">In Review</option>
              <option value="Sanctioned">Sanctioned</option>
              <option value="Disbursed">Disbursed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="ref-search-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9AA39F" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Search by applicant name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ref-search-input"
            />
          </div>
        </div>

        {/* Referrals Table Card */}
        <div className="referrals-table-card">
          <div className="table-responsive-box">
            {isLoading ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
                <span className="auth-spinner" style={{ display: 'inline-block', borderColor: '#1F9D55', borderTopColor: 'transparent', width: 24, height: 24 }} />
                <p style={{ marginTop: 12, fontSize: 14 }}>Loading referrals...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '64px 24px', textAlign: 'center', color: '#6b7280' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                <h3 style={{ fontSize: 18, color: '#111827', marginBottom: 6, fontWeight: 700 }}>No Referrals Found</h3>
                <p style={{ fontSize: 14, color: '#6b7280', maxWidth: 420, margin: '0 auto 20px', lineHeight: 1.5 }}>
                  {referrals.length === 0
                    ? 'You have not submitted any referrals yet. Add your first applicant to start tracking and earning.'
                    : 'No referrals match your current filters. Try resetting search or loan filter.'}
                </p>
                {referrals.length === 0 && (
                  <button
                    type="button"
                    className="btn-add-referral-dark"
                    style={{ margin: '0 auto', display: 'inline-flex' }}
                    onClick={onOpenAddModal}
                  >
                    + Add Your First Referral
                  </button>
                )}
              </div>
            ) : (
              <table className="ref-table">
                <thead>
                  <tr>
                    <th>Applicant Name ▾</th>
                    <th>Loan Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Commission</th>
                    <th>Date ▾</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="user-name-cell">
                          <div className="user-avatar-mini">
                            {row.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="user-full-name">{row.name}</span>
                        </div>
                      </td>
                      <td className="text-muted-cell">{row.loan}</td>
                      <td className="text-dark-cell">{row.amount}</td>
                      <td>
                        <span className={`ref-status-badge ${row.status.toLowerCase().replace(' ', '-')}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="comm-bold-cell">{row.commission}</td>
                      <td className="text-muted-cell">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyReferralsSection
