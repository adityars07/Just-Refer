import { useState, useEffect } from 'react'

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = [
    { href: '#about', label: 'About Us' },
    { href: '#why-choose', label: 'Why Choose Us' },
    { href: '#products', label: 'Products' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#careers', label: 'Careers' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <>
      {/* Top Bar — Desktop only */}
      <div className={`top-bar ${scrolled ? 'top-bar-hidden' : ''}`} id="top-bar">
        <div className="container top-bar-inner">
          <nav className="top-nav">
            <a href="#loan-home">Home Loans</a>
            <a href="#loan-lap">Loan Against Property</a>
            <a href="#loan-personal">Personal Loans</a>
            <a href="#loan-business">Business Loans</a>
          </nav>
          <a href="tel:+919870203101" className="top-phone">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            +91 98702 03101
          </a>
        </div>
      </div>

      {/* Main Header */}
      <header className={`header ${scrolled ? 'header-scrolled' : ''}`} id="header">
        <div className="container header-inner">
          {/* Logo */}
          <a href="#" className="logo" id="logo">
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

          {/* Desktop Nav */}
          <nav className="main-nav" id="main-nav">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="nav-link">{link.label}</a>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="header-right">
            <button className="btn-tool" id="btn-emi" onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 9h20"/><path d="M9 21V9"/></svg>
              EMI Calculator
            </button>
            <a
              href="https://www.cibil.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tool btn-tool-dark"
              id="btn-cibil"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
              Check CIBIL
            </a>
            <a href="#" className="btn-login" id="btn-login">Login</a>
            <a href="#" className="btn-get-started" id="btn-get-started">Get Started</a>
          </div>

          {/* Mobile Right — phone + hamburger */}
          <div className="header-mobile-right">
            <a href="tel:+919870203101" className="mobile-call-btn" aria-label="Call us">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </a>
            <button
              className={`mobile-menu-toggle ${menuOpen ? 'active' : ''}`}
              id="mobile-menu-toggle"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} id="mobile-menu">
        <div className="mobile-menu-content">
          <nav className="mobile-nav">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
            ))}
          </nav>
          <div className="mobile-tools">
            <button className="btn-tool" onClick={() => { setMenuOpen(false); document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 9h20"/><path d="M9 21V9"/></svg>
              EMI Calculator
            </button>
            <a
              href="https://www.cibil.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tool btn-tool-dark"
              onClick={() => setMenuOpen(false)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
              Check CIBIL
            </a>
          </div>
          <div className="mobile-auth">
            <a href="#" className="btn-login">Login</a>
            <a href="#" className="btn-get-started">Get Started</a>
          </div>
          <div className="mobile-loan-section">
            <span className="mobile-section-label">Loan Types</span>
            <nav className="mobile-loan-nav">
              <a href="#loan-home" onClick={() => setMenuOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Home Loans
              </a>
              <a href="#loan-lap" onClick={() => setMenuOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                Loan Against Property
              </a>
              <a href="#loan-personal" onClick={() => setMenuOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Personal Loans
              </a>
              <a href="#loan-business" onClick={() => setMenuOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                Business Loans
              </a>
            </nav>
          </div>
          <div className="mobile-contact-bar">
            <a href="tel:+919870203101" className="mobile-phone-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              +91 98702 03101
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
