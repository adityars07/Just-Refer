import type { ReactNode } from 'react'

interface EarningCard {
  icon: ReactNode
  name: string
  rate: string
  badgeClass: string
  amount: string
  basis: string
  desc: string
  featured?: boolean
}

const EarningPotential = () => {
  const cards: EarningCard[] = [
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
      name: 'Home Loan',
      rate: '0.3%',
      badgeClass: 'badge-green',
      amount: '₹30,000',
      basis: 'on ₹1 Crore referral',
      desc: 'Refer home loan seekers and earn attractive commissions on every successful disbursement.',
    },
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>,
      name: 'Loan Against Property',
      rate: '0.5%',
      badgeClass: 'badge-orange',
      amount: '₹50,000',
      basis: 'on ₹1 Crore referral',
      desc: 'Higher commission rates for property-backed loans. Maximize your earnings!',
      featured: true,
    },
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
      name: 'Personal & Business Loan',
      rate: '1%',
      badgeClass: 'badge-red',
      amount: '₹10,000',
      basis: 'on ₹10 Lacs referral',
      desc: 'Best rates for personal and business loans. Quick processing, quick earnings!',
    },
  ]

  return (
    <section className="earning-section" id="earning">
      <div className="container">
        <span className="section-badge">YOUR EARNING POTENTIAL</span>
        <h2 className="section-title">See How Much You Can <span className="gradient-text">Earn</span></h2>
        <div className="earning-cards">
          {cards.map((card, i) => (
            <div key={i} className={`earning-card ${card.featured ? 'earning-card-featured' : ''}`}>
              <div className="earning-card-header">
                <div className="card-icon">{card.icon}</div>
                <span className="card-loan-name">{card.name}</span>
                <span className={`commission-badge ${card.badgeClass}`}>{card.rate}</span>
              </div>
              <div className="earning-amount">{card.amount}</div>
              <span className="earning-basis">{card.basis}</span>
              <p className="earning-desc">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EarningPotential
