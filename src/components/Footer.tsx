const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#" className="logo">
              <div className="logo-icon">
                <svg width="40" height="28" viewBox="0 0 40 28" fill="none">
                  <circle cx="12" cy="14" r="10" stroke="#E8530E" strokeWidth="3.5" fill="none"/>
                  <circle cx="28" cy="14" r="10" stroke="#2D8B2D" strokeWidth="3.5" fill="none"/>
                </svg>
              </div>
              <div className="logo-text">
                <span className="logo-just">Just</span>
                <span className="logo-refer">Refer</span>
              </div>
            </a>
            <p className="footer-tagline">India's 1st Loan Referral Platform. Powered by FinzoMoney.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Quick Links</h4>
              <a href="#about">About Us</a>
              <a href="#products">Products</a>
              <a href="#why-choose">Why Choose Us</a>
              <a href="#testimonials">Testimonials</a>
            </div>
            <div className="footer-col">
              <h4>Loan Types</h4>
              <a href="#loan-home">Home Loan</a>
              <a href="#loan-lap">Loan Against Property</a>
              <a href="#loan-personal">Personal Loan</a>
              <a href="#loan-business">Business Loan</a>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <a href="#calculator">EMI Calculator</a>
              <a href="#faq">FAQs</a>
              <a href="#careers">Careers</a>
              <a href="#contact">Contact Us</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 JustRefer by Finzo Pvt Ltd. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
