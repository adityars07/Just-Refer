import { useState, useEffect } from 'react'

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        {/* Brand Logo */}
        <a href="#" className="brand-logo">
          <div className="brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div>Just<span>Refer</span></div>
        </a>

        {/* Center Nav Links */}
        <nav className="nav-menu">
          <a href="#hero" className="nav-link active">Home</a>
          <a href="#about" className="nav-link">About us</a>
          <a href="#services" className="nav-link">Explore Loans</a>
          <a href="#how-it-works" className="nav-link">How it Works</a>
          <a href="#faq" className="nav-link">FAQs</a>
          <a href="#contact" className="nav-link">Contact Us</a>
        </nav>

        {/* Right Action */}
        <div className="header-actions">
          <a href="#calculator" className="btn-nav-apply">
            Apply Now
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
