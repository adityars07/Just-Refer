const Testimonials = () => {
  const reviews = [
    {
      name: 'Aditi Sharma',
      role: 'Homeowner, Bangalore',
      quote: '"I was initially anxious about applying for a ₹75 Lakh home loan online, but JustRefer made the entire paperwork completely stress-free. Their rate match saved me over ₹4,000 on monthly EMI!"',
      rating: 5,
      initials: 'AS',
      color: '#065f46'
    },
    {
      name: 'Rajesh Mehta',
      role: 'Direct Referral Partner, Mumbai',
      quote: '"As a chartered accountant, I referred three of my corporate clients for business loans. JustRefer disbursed ₹2.4 Crores in 4 days, and my referral commission of ₹72,000 was in my bank within 48 hours!"',
      rating: 5,
      initials: 'RM',
      color: '#1e40af'
    },
    {
      name: 'Kavita Nair',
      role: 'Retail Entrepreneur, Kochi',
      quote: '"Needed immediate collateral-free working capital during our festive expansion. Approval was completed inside 24 hours. The terms are 100% transparent with zero hidden fees."',
      rating: 5,
      initials: 'KN',
      color: '#92400e'
    }
  ]

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <span className="section-tag">TESTIMONIALS</span>
          <h2 className="section-title">WHAT OUR CLIENTS ARE SAYING</h2>
          <p className="section-subtitle mx-auto">
            Real feedback from thousands of borrowers and high-earning referral partners across India.
          </p>
        </div>

        <div className="testimonials-grid">
          {reviews.map((rev, idx) => (
            <div key={idx} className="testimonial-mint-card">
              <div>
                <div className="testimonial-avatar-row">
                  <div
                    className="test-avatar"
                    style={{
                      background: '#ffffff',
                      color: rev.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.9rem'
                    }}
                  >
                    {rev.initials}
                  </div>
                  <div className="test-user">
                    <h4>{rev.name}</h4>
                    <span>{rev.role}</span>
                  </div>
                </div>
                <p className="testimonial-quote">{rev.quote}</p>
              </div>
              <div className="testimonial-stars">
                {'★'.repeat(rev.rating)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
