const testimonials = [
  {
    text: '"JustRefer made it so easy to earn extra cash by referring friends for loans! The process is completely transparent and I always get paid on time."',
    name: 'Rahul S.',
    location: 'Mumbai, Maharashtra',
    initials: 'RS',
    earning: '₹1,25,000',
  },
  {
    text: '"I got a great home loan through a friend\'s referral and earned a bonus too. The team at JustRefer is very professional and supportive."',
    name: 'Priya M.',
    location: 'Delhi NCR',
    initials: 'PM',
    earning: '₹1,50,000',
  },
  {
    text: '"The referral rewards are amazing! I\'ve already earned ₹2,15,000. It\'s the easiest side income I\'ve ever made. Highly recommend to everyone."',
    name: 'Amit K.',
    location: 'Bangalore, Karnataka',
    initials: 'AK',
    earning: '₹2,15,000',
  },
  {
    text: '"As a CA, I regularly come across clients needing loans. JustRefer has become an additional income stream for me. The dashboard makes tracking so simple."',
    name: 'Sneha G.',
    location: 'Pune, Maharashtra',
    initials: 'SG',
    earning: '₹3,40,000',
  },
]

const Testimonials = () => {
  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <span className="section-badge">SUCCESS STORIES</span>
        <h2 className="section-title">What Our Referrers Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card" id={`testimonial-${i + 1}`}>
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-footer">
                <div className="testimonial-avatar">{t.initials}</div>
                <div className="testimonial-info">
                  <span className="testimonial-name">{t.name}</span>
                  <span className="testimonial-location">{t.location}</span>
                </div>
                <span className="testimonial-earning">{t.earning}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
