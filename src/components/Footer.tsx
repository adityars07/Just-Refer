import Logo from './Logo'

interface FooterProps {
  onSwitchView?: (view: any) => void
}

const Footer = ({ onSwitchView }: FooterProps) => {
  const handleClick = (e: React.MouseEvent, view: string) => {
    e.preventDefault()
    if (onSwitchView) {
      onSwitchView(view)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

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
              <a href="#products" onClick={(e) => handleClick(e, 'products')}>Home Loans</a>
              <a href="#products" onClick={(e) => handleClick(e, 'products')}>Business Loans</a>
              <a href="#products" onClick={(e) => handleClick(e, 'products')}>Personal Loans</a>
              <a href="#products" onClick={(e) => handleClick(e, 'products')}>Loan Against Property</a>
              <a href="#payouts" onClick={(e) => handleClick(e, 'payouts')}>Smart Settle Payouts</a>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Resources</div>
            <div className="footer-links">
              <a href="#how-it-works" onClick={(e) => handleClick(e, 'how-it-works')}>How It Works</a>
              <a href="#payouts" onClick={(e) => handleClick(e, 'payouts')}>Commission Calculator</a>
              <a href="#faq" onClick={(e) => handleClick(e, 'landing')}>FAQ</a>
              <a href="#dashboard" onClick={(e) => handleClick(e, 'dashboard')}>Partner Portal</a>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Company</div>
            <div className="footer-links">
              <a href="#about" onClick={(e) => handleClick(e, 'landing')}>About JustRefer</a>
              <a href="#contact" onClick={(e) => handleClick(e, 'contact')}>Contact Support</a>
              <a href="#privacy" onClick={(e) => handleClick(e, 'landing')}>Privacy Policy</a>
              <a href="#terms" onClick={(e) => handleClick(e, 'landing')}>Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            © {new Date().getFullYear()} JustRefer Technologies Pvt. Ltd. All rights reserved. All lending institutions are RBI-regulated entities.
          </div>
          <div className="footer-bottom-links">
            <a href="#privacy" onClick={(e) => handleClick(e, 'landing')}>Privacy</a>
            <a href="#terms" onClick={(e) => handleClick(e, 'landing')}>Terms</a>
            <a href="#security" onClick={(e) => handleClick(e, 'landing')}>Security</a>
            <a href="#contact" onClick={(e) => handleClick(e, 'contact')}>Support</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
