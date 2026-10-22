interface LoanProductsProps {
  onSelectProduct?: (productName: string) => void
}

const LoanProducts = ({ onSelectProduct }: LoanProductsProps) => {
  const products = [
    {
      id: 'home-loan',
      name: 'Home Loan',
      minAmount: '₹50 Lacs',
      rate: '0.3%',
      rateDisplay: '0.3% of Disbursement',
      example: 'Earn ₹30,000 on ₹1 Crore disbursement',
      features: ['Starting from 7.25% p.a.', 'Tenure up to 30 years', 'Balance transfer & top-up'],
      color: '#1F9D55',
      bgColor: '#e6f7ee',
      image: '/images/products/home-loan.jpg',
    },
    {
      id: 'lap',
      name: 'Loan Against Property',
      minAmount: '₹1 Crore',
      rate: '0.5%',
      rateDisplay: '0.5% of Disbursement',
      example: 'Earn ₹50,000 on ₹1 Crore disbursement',
      features: ['Starting from 8% p.a.', 'High loan-to-value (LTV)', 'Residential & commercial property'],
      color: '#ea580c',
      bgColor: '#fff7ed',
      image: '/images/products/loan-against-property.jpg',
    },
    {
      id: 'personal-loan',
      name: 'Personal Loan',
      minAmount: '₹5 Lacs',
      rate: '1.0%',
      rateDisplay: '1% of Disbursement',
      example: 'Earn ₹10,000 on ₹10 Lakhs disbursement',
      features: ['Starting from 9.99% p.a.', 'Zero collateral required', '24-hour instant sanction'],
      color: '#2563EB',
      bgColor: '#eff6ff',
      image: '/images/products/personal-loan.jpg',
    },
    {
      id: 'business-loan',
      name: 'Business Loan',
      minAmount: '₹10 Lacs',
      rate: '1.0%',
      rateDisplay: '1% of Disbursement',
      example: 'Earn ₹25,000 on ₹25 Lakhs disbursement',
      features: ['Starting from 10.99% p.a.', 'Working capital & term funding', 'MSME & enterprise schemes'],
      color: '#7C3AED',
      bgColor: '#f5f3ff',
      image: '/images/products/business-loan.jpg',
    },
  ]

  return (
    <section className="products-grid-section" id="loan-products">
      <div className="container">
        <div className="products-header">
          <span className="products-tag-pill" style={{ display: 'inline-block', padding: '6px 14px', background: '#e6f7ee', color: '#1F9D55', borderRadius: 100, fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
            OFFICIAL LOAN CATALOG
          </span>
          <h2 className="products-title">Loan Products & Commissions</h2>
          <p className="products-subtitle">
            Partner with top RBI-regulated banks & NBFCs. Direct commission payouts with zero KYC barriers.
          </p>
        </div>

        <div className="products-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {products.map((item) => (
            <div
              key={item.id}
              className="loan-product-item"
              onClick={() => onSelectProduct && onSelectProduct(item.name)}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <div className="loan-thumb-wrapper" style={{ position: 'relative' }}>
                <img src={item.image} alt={item.name} className="loan-thumb-img" />
                <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(15, 61, 46, 0.85)', backdropFilter: 'blur(4px)', color: '#fff', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                  Min: {item.minAmount}
                </div>
              </div>

              <div className="loan-info-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 20 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <h3 className="loan-name" style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{item.name}</h3>
                    <span style={{ fontSize: 12, fontWeight: 800, color: item.color, background: item.bgColor, padding: '3px 8px', borderRadius: 6 }}>
                      {item.rate} Comm.
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 16, margin: '12px 0 16px', padding: '10px 12px', background: '#f9fafb', borderRadius: 8, fontSize: 13 }}>
                    <div>
                      <span style={{ display: 'block', color: '#6b7280', fontSize: 11, fontWeight: 600 }}>MIN AMOUNT</span>
                      <strong style={{ color: '#111827' }}>{item.minAmount}</strong>
                    </div>
                    <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: 16 }}>
                      <span style={{ display: 'block', color: '#6b7280', fontSize: 11, fontWeight: 600 }}>COMMISSION</span>
                      <strong style={{ color: item.color }}>{item.rateDisplay}</strong>
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.5, background: '#f8fafc', padding: '8px 10px', borderRadius: 6, marginBottom: 16, borderLeft: `3px solid ${item.color}` }}>
                    💡 <strong>Earning Example:</strong> {item.example}
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {item.features.map((feat, i) => (
                      <li key={i} style={{ fontSize: 13, color: '#4b5563', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: '#1F9D55', fontWeight: 800 }}>✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid #f3f4f6' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1F9D55' }}>Refer Now</span>
                  <div className="loan-arrow-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LoanProducts
