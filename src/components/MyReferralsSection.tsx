import { useState } from 'react'

interface MyReferralsSectionProps {
  onOpenAddModal?: () => void
}

const MyReferralsSection = ({ onOpenAddModal }: MyReferralsSectionProps) => {
  const [selectedLoan, setSelectedLoan] = useState('All Loans')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [searchQuery, setSearchQuery] = useState('')

  const referrals = [
    {
      name: 'Amit Kumar',
      loan: 'Home Loan',
      amount: '₹ 50,00,000',
      status: 'Approved',
      commission: '₹ 4,000',
      date: '12 Sep 2026',
    },
    {
      name: 'Sneha Patel',
      loan: 'Personal Loan',
      amount: '₹ 2,00,000',
      status: 'In Progress',
      commission: '—',
      date: '10 Sep 2026',
    },
    {
      name: 'Vikram Mehta',
      loan: 'Car Loan',
      amount: '₹ 8,00,000',
      status: 'Disbursed',
      commission: '₹ 3,500',
      date: '8 Sep 2026',
    },
    {
      name: 'Priya Singh',
      loan: 'Business Loan',
      amount: '₹ 25,00,000',
      status: 'Rejected',
      commission: '—',
      date: '5 Sep 2026',
    },
    {
      name: 'Rahul Verma',
      loan: 'Education Loan',
      amount: '₹ 10,00,000',
      status: 'Approved',
      commission: '₹ 2,500',
      date: '2 Sep 2026',
    },
  ]

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
            <p className="section-sub-copy">Track all your referrals and their current status.</p>
          </div>
          <button
            type="button"
            className="btn-add-referral-dark"
            onClick={onOpenAddModal}
          >
            Add Referral
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
              <option value="Approved">Approved</option>
              <option value="In Progress">In Progress</option>
              <option value="Disbursed">Disbursed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="ref-search-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9AA39F" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ref-search-input"
            />
          </div>
        </div>

        {/* Referrals Table Card */}
        <div className="referrals-table-card">
          <div className="table-responsive-box">
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
                {filtered.map((row, i) => (
                  <tr key={i}>
                    <td>
                      <div className="user-name-cell">
                        <div className="user-avatar-mini">
                          {row.name.split(' ').map(n => n[0]).join('')}
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
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyReferralsSection
