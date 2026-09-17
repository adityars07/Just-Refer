import type { ReactNode } from 'react'

interface LoanProduct {
  id: string
  icon: ReactNode
  name: string
  tagline: string
  earnRate: string
  earnClass: string
  features: string[]
  details: { label: string; value: string; highlight?: boolean }[]
  eligibility: string[]
  documents: string[]
  visualClass: string
  reverse?: boolean
}

const products: LoanProduct[] = [
  {
    id: 'loan-home',
    icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    name: 'Home Loan',
    tagline: 'Make homeownership dreams come true for your referrals',
    earnRate: 'Earn 0.3%',
    earnClass: 'earn-badge-green',
    features: [
      'Loan up to ₹100 crore',
      'Tenure up to 30 years',
      'Lowest interest rates starting 8.35% p.a.',
      'Tax benefits under Section 80C & 24(b)',
      'No prepayment charges on floating rate',
    ],
    details: [
      { label: 'Interest Rate', value: '8.35% - 11.5%' },
      { label: 'Processing Fee', value: '0.25% - 1%' },
      { label: 'Max Tenure', value: '30 years' },
      { label: 'Your Earning', value: '₹30,000/Cr', highlight: true },
    ],
    eligibility: [
      'Salaried individuals with minimum 2 years of work experience',
      'Self-employed with 3+ years of business vintage',
      'Minimum age: 21 years | Maximum age at maturity: 65 years',
      'CIBIL score of 700+ preferred for best rates',
    ],
    documents: ['PAN Card', 'Aadhaar Card', 'Income Proof', 'Bank Statements (6 months)', 'Property Documents', 'Passport Photos'],
    visualClass: 'product-visual-home',
  },
  {
    id: 'loan-lap',
    icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>,
    name: 'Loan Against Property',
    tagline: 'Unlock the value of property for any purpose',
    earnRate: 'Earn 0.5%',
    earnClass: 'earn-badge-orange',
    features: [
      'Loan up to ₹100 crore',
      'Competitive interest rates from 9.2% p.a.',
      'Long repayment period up to 18 years',
      'Use for any purpose – business, education, wedding',
      'Residential & commercial properties accepted',
    ],
    details: [
      { label: 'Interest Rate', value: '9.2% - 14%' },
      { label: 'LTV Ratio', value: 'Up to 70%' },
      { label: 'Max Tenure', value: '18 years' },
      { label: 'Your Earning', value: '₹50,000/Cr', highlight: true },
    ],
    eligibility: [
      'Property owners (residential or commercial)',
      'Salaried or self-employed individuals',
      'Property must be free from any legal dispute',
      'Age: 25-65 years at the time of loan maturity',
    ],
    documents: ['PAN Card', 'Aadhaar Card', 'Property Title Deed', 'Encumbrance Certificate', 'Income Proof / ITR', 'Bank Statements (12 months)'],
    visualClass: 'product-visual-lap',
    reverse: true,
  },
  {
    id: 'loan-personal',
    icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    name: 'Personal Loan',
    tagline: 'Quick funds for life\'s every need',
    earnRate: 'Earn 1%',
    earnClass: 'earn-badge-red',
    features: [
      'Quick approval in 48 hours',
      'Loan up to ₹25 lakh',
      'Flexible tenure up to 5 years',
      'Minimal documentation required',
      'No collateral or security needed',
    ],
    details: [
      { label: 'Interest Rate', value: '10.49% - 24%' },
      { label: 'Processing Fee', value: '1% - 3%' },
      { label: 'Max Tenure', value: '5 years' },
      { label: 'Your Earning', value: '₹10,000/10L', highlight: true },
    ],
    eligibility: [
      'Salaried individuals with minimum ₹25,000 monthly salary',
      'Minimum 1 year of employment with current employer',
      'Age between 21-58 years',
      'Good credit history with CIBIL score 700+',
    ],
    documents: ['PAN Card', 'Aadhaar Card', 'Salary Slips (3 months)', 'Bank Statements (3 months)', 'Employment Proof'],
    visualClass: 'product-visual-personal',
  },
  {
    id: 'loan-business',
    icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    name: 'Business Loan',
    tagline: 'Fuel business growth with the right capital',
    earnRate: 'Earn 1%',
    earnClass: 'earn-badge-red',
    features: [
      'Collateral-free options available',
      'Up to ₹50 lakh without security',
      'Working capital support & term loans',
      'Fast disbursal within 3-5 business days',
      'Flexible EMI options & moratorium period',
    ],
    details: [
      { label: 'Interest Rate', value: '14% - 26%' },
      { label: 'Processing Fee', value: '1.5% - 3%' },
      { label: 'Max Tenure', value: '5 years' },
      { label: 'Your Earning', value: '₹10,000/10L', highlight: true },
    ],
    eligibility: [
      'Business vintage of minimum 3 years',
      'Minimum annual turnover of ₹10 lakh',
      'Proprietorship, Partnership, LLP, or Pvt Ltd companies',
      'ITR filed for last 2 years with stable income',
    ],
    documents: ['Business Registration', 'GST Certificate', 'ITR (2 years)', 'Bank Statements (12 months)', 'KYC Documents', 'Business Proof'],
    visualClass: 'product-visual-business',
    reverse: true,
  },
]

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D8B2D" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
)

const LoanProducts = () => {
  return (
    <section className="products-section" id="products">
      <div className="container">
        <span className="section-badge">OUR PRODUCTS</span>
        <h2 className="section-title">Loan Options & Benefits</h2>
        <p className="section-subtitle">Comprehensive loan solutions for every need. Refer any type and earn attractive commissions.</p>

        {products.map((product) => (
          <div key={product.id} className="product-detail" id={product.id}>
            <div className={`product-detail-card ${product.reverse ? 'product-card-reverse' : ''}`}>
              <div className={`product-visual ${product.visualClass}`}>
                <div className="product-icon-large">{product.icon}</div>
              </div>
              <div className="product-info">
                <div className="product-title-row">
                  <h3>{product.name}</h3>
                  <span className={`earn-badge ${product.earnClass}`}>{product.earnRate}</span>
                </div>
                <p className="product-tagline">{product.tagline}</p>
                <div className="product-features">
                  {product.features.map((f, i) => (
                    <div key={i} className="feature-item">
                      <CheckIcon />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="product-details-grid">
                  {product.details.map((d, i) => (
                    <div key={i} className="detail-box">
                      <span className="detail-label">{d.label}</span>
                      <span className={`detail-value ${d.highlight ? 'highlight' : ''}`}>{d.value}</span>
                    </div>
                  ))}
                </div>
                <div className="product-eligibility">
                  <h4>Eligibility Criteria</h4>
                  <ul>
                    {product.eligibility.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
                <div className="product-documents">
                  <h4>Documents Required</h4>
                  <div className="doc-tags">
                    {product.documents.map((d, i) => (
                      <span key={i} className="doc-tag">{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default LoanProducts
