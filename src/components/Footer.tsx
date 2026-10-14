import Logo from './Logo'

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <Logo size="md" variant="dark" />
            </div>
            <p className="footer-description">
              JustRefer is India's premier loan referral platform, connecting referrers with top banks and NBFCs for transparent, high-yield commission payouts.
            </p>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Products</div>
            <div className="footer-links">
              <a href="#products">Home Loans</a>
              <a href="#products">Business Loans</a>
              <a href="#products">Personal Loans</a>
              <a href="#products">Loan Against Property</a>
              <a href="#payouts">Smart Settle Payouts</a>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Resources</div>
            <div className="footer-links">
              <a href="#learn">Commission Calculator</a>
              <a href="#learn">Bank Guidelines</a>
              <a href="#learn">CIBIL Score Guide</a>
              <a href="#learn">Referral Playbook</a>
              <a href="#faq">FAQ</a>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Company</div>
            <div className="footer-links">
              <a href="#about">About JustRefer</a>
              <a href="#careers">Careers</a>
              <a href="#contact">Contact Support</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            © {new Date().getFullYear()} JustRefer Technologies Pvt. Ltd. All rights reserved. Lending partners are RBI-regulated entities.
          </div>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#security">Security</a>
            <a href="#disclosures">Disclosures</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
