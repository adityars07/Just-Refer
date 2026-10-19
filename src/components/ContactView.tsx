import { useState } from 'react'

const ContactView = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="contact-page">
      {/* Hero Banner */}
      <section className="contact-hero">
        <div className="container">
          <h1 className="contact-hero-title">Get In Touch</h1>
          <p className="contact-hero-sub">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </section>

      <section className="contact-body">
        <div className="container">
          <div className="contact-grid">
            {/* Left: Contact Info Cards */}
            <div className="contact-info-col">
              <div className="contact-info-card">
                <div className="contact-info-icon" style={{ background: '#e6f4ec', color: '#1F9D55' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <h4>Office Address</h4>
                  <p>WeWork, BKC, Bandra Kurla Complex,<br/>Mumbai, Maharashtra 400051</p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon" style={{ background: '#dbeafe', color: '#3B82F6' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <h4>Email Us</h4>
                  <p>support@justrefer.in<br/>partners@justrefer.in</p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div>
                  <h4>Call Us</h4>
                  <p>+91 22 4050 6070<br/>Mon-Sat, 9 AM - 7 PM IST</p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon" style={{ background: '#f3e8ff', color: '#7c3aed' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <h4>Business Hours</h4>
                  <p>Mon-Fri: 9:00 AM - 7:00 PM<br/>Sat: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="contact-form-col">
              {submitted ? (
                <div className="contact-success-card">
                  <div className="contact-success-icon">✓</div>
                  <h3>Message Sent Successfully!</h3>
                  <p>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                  <button type="button" className="auth-submit-btn" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="contact-form-card">
                  <h3>Send Us a Message</h3>
                  <p>Fill out the form below and we'll get back to you shortly.</p>

                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="contact-field-row">
                      <div className="auth-field">
                        <label>Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="auth-input"
                        />
                      </div>
                      <div className="auth-field">
                        <label>Email</label>
                        <input
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="auth-input"
                        />
                      </div>
                    </div>

                    <div className="contact-field-row">
                      <div className="auth-field">
                        <label>Phone</label>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="auth-input"
                        />
                      </div>
                      <div className="auth-field">
                        <label>Subject</label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="auth-input"
                        >
                          <option value="">Select a topic</option>
                          <option value="partnership">Partnership Inquiry</option>
                          <option value="commission">Commission Query</option>
                          <option value="technical">Technical Support</option>
                          <option value="feedback">Feedback</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="auth-field">
                      <label>Message</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="How can we help you?"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="auth-input contact-textarea"
                      />
                    </div>

                    <button type="submit" className="auth-submit-btn">
                      Send Message →
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactView
