const Testimonials = () => {
  const reviews = [
    {
      name: 'Jordan A.',
      role: 'Business Consultant',
      avatar: 'JA',
      avatarBg: '#dcfce7',
      avatarColor: '#166534',
      quote: "I've tried a lot of cards and this card is in a league of its own. Zero foreign fees, works everywhere, and rewards actually add up. Best card!",
      stars: 5,
    },
    {
      name: 'Ross B.',
      role: 'Software Engineer',
      avatar: 'RB',
      avatarBg: '#e0e7ff',
      avatarColor: '#3730a3',
      quote: "I ditched my old cards. This one does it all — shopping, travel, even groceries. I love it and I'm pledging onto does!",
      stars: 5,
    },
    {
      name: 'Aditi S.',
      role: 'Creative Director',
      avatar: 'AS',
      avatarBg: '#fef3c7',
      avatarColor: '#92400e',
      quote: "The approval was completed in under 2 minutes. The metal card arrived in 48 hours and the mobile app experience is buttery smooth.",
      stars: 5,
    },
  ]

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="section-eyebrow">Testimonials</span>
          <h2 className="section-heading">Don't just take our words for it</h2>
        </div>

        <div className="testimonials-grid">
          {reviews.map((r, i) => (
            <div key={i} className="spendify-testimonial-card">
              <div className="testimonial-stars-top">
                {'★'.repeat(r.stars)}
              </div>
              <p className="testimonial-quote-text">
                "{r.quote}"
              </p>
              <div className="testimonial-user-footer">
                <div className="user-avatar-circle" style={{ background: r.avatarBg, color: r.avatarColor }}>
                  {r.avatar}
                </div>
                <div className="user-details-col">
                  <span className="user-name">{r.name}</span>
                  <span className="user-title">{r.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
