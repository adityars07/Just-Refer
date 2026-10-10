interface LoanProductsProps {
  onSelectProduct?: (productName: string) => void
}

const LoanProducts = ({ onSelectProduct }: LoanProductsProps) => {
  const products = [
    {
      id: 'personal-loan',
      name: 'Personal Loan',
      limit: 'Up to ₹5,00,000',
      commission: 'Commission up to ₹5,000',
      image: '/images/products/personal-loan.jpg',
    },
    {
      id: 'home-loan',
      name: 'Home Loan',
      limit: 'Up to ₹10,00,00,000',
      commission: 'Commission up to ₹10,000',
      image: '/images/products/home-loan.jpg',
    },
    {
      id: 'car-loan',
      name: 'Car Loan',
      limit: 'Up to ₹50,00,000',
      commission: 'Commission up to ₹7,500',
      image: '/images/products/car-loan.jpg',
    },
    {
      id: 'business-loan',
      name: 'Business Loan',
      limit: 'Up to ₹5,00,00,000',
      commission: 'Commission up to ₹15,000',
      image: '/images/products/business-loan.jpg',
    },
    {
      id: 'education-loan',
      name: 'Education Loan',
      limit: 'Up to ₹1,00,00,000',
      commission: 'Commission up to ₹7,500',
      image: '/images/products/education-loan.jpg',
    },
    {
      id: 'lap',
      name: 'Loan Against Property',
      limit: 'Up to ₹2,00,00,000',
      commission: 'Commission up to ₹10,000',
      image: '/images/products/loan-against-property.jpg',
    },
  ]

  return (
    <section className="products-grid-section" id="loan-products">
      <div className="container">
        <div className="products-header">
          <h2 className="products-title">Loan Products</h2>
          <p className="products-subtitle">
            Choose from a wide range of loan products and earn attractive commission for every successful referral.
          </p>
        </div>

        <div className="products-card-grid">
          {products.map((item) => (
            <div
              key={item.id}
              className="loan-product-item"
              onClick={() => onSelectProduct && onSelectProduct(item.name)}
            >
              <div className="loan-thumb-wrapper">
                <img src={item.image} alt={item.name} className="loan-thumb-img" />
              </div>

              <div className="loan-info-body">
                <div className="loan-text-col">
                  <h3 className="loan-name">{item.name}</h3>
                  <span className="loan-limit">{item.limit}</span>
                  <span className="loan-commission">{item.commission}</span>
                </div>

                <div className="loan-arrow-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
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
