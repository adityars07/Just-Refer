const Testimonials = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Real Estate Consultant, Mumbai',
      avatarBg: '#F59E0B',
      avatarText: 'PS',
      quote:
        '“I was skeptical with other referral programs... JustRefer however proved to be the real deal. The automated commission tracking and seamless payouts have added ₹2.5L to my monthly income with zero paperwork hassle.”',
    },
    {
      name: 'Rajesh Verma',
      role: 'Chartered Accountant, Delhi NCR',
      avatarBg: '#3B82F6',
      avatarText: 'RV',
      quote:
        '“Very impressed with JustRefer. Checks every box my business clients need and provides fully transparent payout reports. My clients get the lowest interest rates and I get paid on time. Outstanding relationship support.”',
    },
    {
      name: 'Amit Patel',
      role: 'Financial Planner, Bangalore',
      avatarBg: '#10B981',
      avatarText: 'AP',
      quote:
        '“JustRefer was one of the first platforms that gave independent referrers equal footing with large national DSAs. It took less than 5 minutes to submit my first client, and commission was in my account the same week.”',
    },
  ]

  return (
    <section className="testimonials-section">
      <div className="container">
        <h2 className="testimonials-title">Discover why our referrers trust JustRefer</h2>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div
                className="testimonial-photo"
                style={{
                  backgroundColor: t.avatarBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '28px',
                  fontWeight: 700,
                }}
              >
                {t.avatarText}
              </div>
              <p className="testimonial-quote">{t.quote}</p>
              <div className="testimonial-author">{t.name}</div>
              <div className="testimonial-role-sub">{t.role}</div>
              <div className="testimonial-stars">
                {[...Array(5)].map((_, idx) => (
                  <span key={idx}>★</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="testimonials-note">
          *These are real testimonials from verified JustRefer partners.*
        </p>
      </div>
    </section>
  )
}

export default Testimonials
