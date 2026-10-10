import { useState, useEffect } from 'react'

const Header = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="site-header" style={scrolled ? { boxShadow: '0 2px 12px rgba(0,0,0,0.04)' } : undefined}>
      <div className="container header-inner">
        <a href="#" className="brand">
          <div className="brand-dot">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div className="brand-text-block">
            <span className="brand-name">JustRefer</span>
            <span className="brand-tagline">Your Network. Your Earnings.</span>
          </div>
        </a>

        <nav className="nav-links">
          <a href="#hero" className="nav-link active">Home</a>
          <a href="#benefits" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How it works</a>
          <a href="#faq" className="nav-link">FAQs</a>
        </nav>

        <a href="#plans" className="btn-dark">Get Started</a>
      </div>
    </header>
  )
}

export default Header
