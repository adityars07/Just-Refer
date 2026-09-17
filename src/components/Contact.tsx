const Contact = () => {
  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info">
            <span className="section-badge">GET IN TOUCH</span>
            <h2 className="section-title section-title-left">Contact Us</h2>
            <p className="contact-desc">Have questions? We're here to help. Reach out to our team and we'll get back to you within 24 hours.</p>
            <div className="contact-items">
              <div className="contact-item" id="contact-phone">
                <div className="contact-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <span className="contact-label">Phone</span>
                  <a href="tel:+919870203101" className="contact-value">+91 98702 03101</a>
                </div>
              </div>
              <div className="contact-item" id="contact-email">
                <div className="contact-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <div>
                  <span className="contact-label">Email</span>
                  <a href="mailto:info@finzomoney.com" className="contact-value">info@finzomoney.com</a>
                </div>
              </div>
              <div className="contact-item" id="contact-address">
                <div className="contact-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <span className="contact-label">Address</span>
                  <span className="contact-value">Finzo Pvt Ltd, D-160, Sector 63, Noida – 201301</span>
                </div>
              </div>
            </div>
          </div>
          <div className="careers-card" id="careers">
            <h3>Careers</h3>
            <p>Join our mission to democratize financial access. We're always looking for talented individuals who are passionate about fintech and making a difference.</p>
            <div className="careers-benefits">
              {['Competitive compensation', 'Fast-growing startup culture', 'Learning & development focus'].map((b, i) => (
                <div key={i} className="career-benefit">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D8B2D" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                  <span>{b}</span>
                </div>
              ))}
            </div>
            <a href="#" className="btn-careers" id="btn-join-team">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
              Join Our Team
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
