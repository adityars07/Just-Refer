const Footer = () => {
  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <h3>Just<span>Refer</span></h3>
            <p>
              India's premier digital loan referral and financial intermediation platform. Connecting borrowers with over 40+ leading scheduled banks & NBFCs while rewarding partners with transparent upfront commissions.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '999px', fontSize: '0.76rem', color: '#a7d6b6' }}>
                🔒 256-Bit SSL Encrypted
              </span>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '999px', fontSize: '0.76rem', color: '#a7d6b6' }}>
                🏛️ RBI-Compliant Network
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#hero">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#services">Loan Products</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#calculator">Repayment Calculator</a></li>
              <li><a href="#testimonials">Client Testimonials</a></li>
              <li><a href="#faq">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* Loan Catalogs */}
          <div className="footer-col">
            <h4>Loan Catalogs</h4>
            <ul className="footer-links">
              <li><a href="#services">Home Loans (8.35% p.a.)</a></li>
              <li><a href="#services">Personal Loans (10.49% p.a.)</a></li>
              <li><a href="#services">Loan Against Property (9.20% p.a.)</a></li>
              <li><a href="#services">Business & MSME Loans (11.99% p.a.)</a></li>
              <li><a href="#calculator">Partner Commission Calculator</a></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="footer-col">
            <h4>Support & Desk</h4>
            <ul className="footer-links">
              <li style={{ color: '#cbd5e1' }}>
                <strong>Helpline:</strong> 1800-419-7333 (Toll-Free)
              </li>
              <li style={{ color: '#cbd5e1' }}>
                <strong>Support:</strong> desk@justrefer.in
              </li>
              <li style={{ color: '#cbd5e1' }}>
                <strong>Hours:</strong> Mon - Sat: 9:30 AM – 6:30 PM
              </li>
              <li style={{ color: '#cbd5e1', marginTop: '10px' }}>
                Corporate Office: Level 5, FinTech Park, Mumbai, Maharashtra 400051
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} JustRefer Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#privacy" style={{ color: '#94a3b8' }}>Privacy Policy</a>
            <a href="#terms" style={{ color: '#94a3b8' }}>Terms of Service</a>
            <a href="#fair-lending" style={{ color: '#94a3b8' }}>Fair Practices Code</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
