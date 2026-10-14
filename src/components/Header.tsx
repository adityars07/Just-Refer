import { useState, useRef, useEffect } from 'react'
import Logo from './Logo'

interface HeaderProps {
  currentView?: string
  onSwitchView?: (view: any) => void
  onOpenModal: () => void
}

type DropdownKey = 'products' | 'how-it-works' | null

const Header = ({ currentView = 'landing', onSwitchView, onOpenModal }: HeaderProps) => {
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = (key: DropdownKey) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setActiveDropdown(key)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  const toggleDropdown = (key: DropdownKey) => {
    setActiveDropdown((prev) => (prev === key ? null : key))
  }

  // Close on outside click or escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
        setMobileMenuOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null)
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleNavClick = (view: any, anchorId?: string) => {
    setActiveDropdown(null)
    setMobileMenuOpen(false)
    if (currentView === 'landing' && anchorId) {
      const el = document.getElementById(anchorId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    if (onSwitchView) {
      onSwitchView(view)
    }
  }

  return (
    <header className="navbar" ref={navRef}>
      <div className="navbar-inner">
        <div className="navbar-left">
          <a
            className="navbar-brand"
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              handleNavClick('landing')
            }}
          >
            <Logo size="sm" variant="dark" />
          </a>

          <nav className="navbar-links">
            {/* 1. Loan Products Dropdown (Carry "Invest" style) */}
            <div
              className={`nav-dropdown-wrapper ${activeDropdown === 'products' ? 'is-active' : ''}`}
              onMouseEnter={() => handleMouseEnter('products')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`navbar-link ${currentView === 'products' || activeDropdown === 'products' ? 'active' : ''}`}
                onClick={() => toggleDropdown('products')}
                aria-expanded={activeDropdown === 'products'}
              >
                Loan Products
                <svg
                  className={`nav-chevron ${activeDropdown === 'products' ? 'open' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {activeDropdown === 'products' && (
                <div className="mega-dropdown mega-dropdown-products">
                  <div className="mega-card mega-card-products">
                    {/* Category 1: Accounts / Core Retail Loans */}
                    <div className="mega-section">
                      <div className="mega-section-label">Accounts & Retail Loans</div>
                      <div className="mega-grid-3">
                        <div
                          className="mega-item"
                          onClick={() => handleNavClick('products', 'loan-products')}
                        >
                          <div className="mega-icon-box" style={{ background: '#fef3c7', color: '#b45309' }}>
                            {/* Home Icon */}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                              <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                          </div>
                          <div className="mega-item-text">
                            <div className="mega-item-title">Home Loan</div>
                            <div className="mega-item-desc">Lowest interest rates from 8.35% for new & resale properties</div>
                          </div>
                        </div>

                        <div
                          className="mega-item"
                          onClick={() => handleNavClick('products', 'loan-products')}
                        >
                          <div className="mega-icon-box" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                            {/* Personal Loan Icon */}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="4" width="20" height="16" rx="2" />
                              <line x1="2" y1="10" x2="22" y2="10" />
                              <circle cx="8" cy="15" r="1.5" />
                              <path d="M14 15h4" />
                            </svg>
                          </div>
                          <div className="mega-item-text">
                            <div className="mega-item-title">Personal Loan</div>
                            <div className="mega-item-desc">Instant collateral-free funds up to ₹50 Lakhs within 24 hours</div>
                          </div>
                        </div>

                        <div
                          className="mega-item"
                          onClick={() => handleNavClick('products', 'loan-products')}
                        >
                          <div className="mega-icon-box" style={{ background: '#ffedd5', color: '#c2410c' }}>
                            {/* Business Loan Icon */}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="7" width="20" height="14" rx="2" />
                              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                              <line x1="12" y1="12" x2="12" y2="12.01" />
                            </svg>
                          </div>
                          <div className="mega-item-text">
                            <div className="mega-item-title">Business Loan</div>
                            <div className="mega-item-desc">Working capital & MSME term financing to scale your business</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Category 2: Specialized Financing */}
                    <div className="mega-section" style={{ marginTop: '22px' }}>
                      <div className="mega-section-label">Specialized Financing & Credit</div>
                      <div className="mega-grid-3">
                        <div
                          className="mega-item"
                          onClick={() => handleNavClick('products', 'loan-products')}
                        >
                          <div className="mega-icon-box" style={{ background: '#fed7aa', color: '#ea580c' }}>
                            {/* LAP Icon */}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="4" y="2" width="16" height="20" rx="2" />
                              <line x1="9" y1="6" x2="9" y2="6.01" />
                              <line x1="15" y1="6" x2="15" y2="6.01" />
                              <line x1="9" y1="10" x2="9" y2="10.01" />
                              <line x1="15" y1="10" x2="15" y2="10.01" />
                              <line x1="9" y1="14" x2="9" y2="14.01" />
                              <line x1="15" y1="14" x2="15" y2="14.01" />
                              <path d="M10 18h4" />
                            </svg>
                          </div>
                          <div className="mega-item-text">
                            <div className="mega-item-title">Loan Against Property</div>
                            <div className="mega-item-desc">High-ticket liquidity unlocking equity of your real estate</div>
                          </div>
                        </div>

                        <div
                          className="mega-item"
                          onClick={() => handleNavClick('products', 'loan-products')}
                        >
                          <div className="mega-icon-box" style={{ background: '#bbf7d0', color: '#15803d' }}>
                            {/* Car Loan Icon */}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 17h14v-5l-2-5H7L5 12v5z" />
                              <circle cx="7.5" cy="17.5" r="2.5" />
                              <circle cx="16.5" cy="17.5" r="2.5" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </div>
                          <div className="mega-item-text">
                            <div className="mega-item-title">Car & Auto Loan</div>
                            <div className="mega-item-desc">Quick approvals with up to 100% on-road funding for vehicles</div>
                          </div>
                        </div>

                        <div
                          className="mega-item"
                          onClick={() => handleNavClick('products', 'loan-products')}
                        >
                          <div className="mega-icon-box" style={{ background: '#99f6e4', color: '#0f766e' }}>
                            {/* Education Loan Icon */}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                              <path d="M6 12v5c3 3 9 3 12 0v-5" />
                            </svg>
                          </div>
                          <div className="mega-item-text">
                            <div className="mega-item-title">Education Loan</div>
                            <div className="mega-item-desc">Domestic & overseas study financing with flexible moratorium</div>
                          </div>
                        </div>

                        <div
                          className="mega-item"
                          onClick={() => handleNavClick('products', 'loan-products')}
                        >
                          <div className="mega-icon-box" style={{ background: '#d9f99d', color: '#4d7c0f' }}>
                            {/* Gold Loan Icon */}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="9" />
                              <path d="M12 6v12M8 10h8M8 14h6" />
                            </svg>
                          </div>
                          <div className="mega-item-text">
                            <div className="mega-item-title">Gold Loan</div>
                            <div className="mega-item-desc">Instant 30-minute disbursals backed by physical gold jewelry</div>
                          </div>
                        </div>

                        <div
                          className="mega-item"
                          onClick={() => handleNavClick('products', 'loan-products')}
                        >
                          <div className="mega-icon-box" style={{ background: '#c7d2fe', color: '#4338ca' }}>
                            {/* Working Capital Icon */}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="23 4 23 10 17 10" />
                              <polyline points="1 20 1 14 7 14" />
                              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                          </div>
                          <div className="mega-item-text">
                            <div className="mega-item-title">Working Capital & OD</div>
                            <div className="mega-item-desc">Flexible overdraft lines to smoothen company operations</div>
                          </div>
                        </div>

                        <div
                          className="mega-item"
                          onClick={() => handleNavClick('products', 'loan-products')}
                        >
                          <div className="mega-icon-box" style={{ background: '#fbcfe8', color: '#be185d' }}>
                            {/* Equipment Icon */}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="3" />
                              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                          </div>
                          <div className="mega-item-text">
                            <div className="mega-item-title">Machinery Loan</div>
                            <div className="mega-item-desc">Asset financing for high-output industrial & commercial equipment</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. How It Works / Learn Dropdown (Carry "Learn" style) */}
            <div
              className={`nav-dropdown-wrapper ${activeDropdown === 'how-it-works' ? 'is-active' : ''}`}
              onMouseEnter={() => handleMouseEnter('how-it-works')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`navbar-link ${currentView === 'how-it-works' || activeDropdown === 'how-it-works' ? 'active' : ''}`}
                onClick={() => toggleDropdown('how-it-works')}
                aria-expanded={activeDropdown === 'how-it-works'}
              >
                How It Works
                <svg
                  className={`nav-chevron ${activeDropdown === 'how-it-works' ? 'open' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {activeDropdown === 'how-it-works' && (
                <div className="mega-dropdown mega-dropdown-learn">
                  <div className="mega-card mega-card-learn">
                    {/* Left Column: Learn */}
                    <div className="mega-column">
                      <div className="mega-section-label">Learn</div>
                      <div className="mega-list">
                        <div
                          className="mega-text-item"
                          onClick={() => handleNavClick('how-it-works', 'how-it-works')}
                        >
                          <div className="mega-item-title">Referral Playbook</div>
                          <div className="mega-item-desc">The JustRefer guide to client pitching & conversion strategies</div>
                        </div>

                        <div
                          className="mega-text-item"
                          onClick={() => handleNavClick('payouts', 'pricing')}
                        >
                          <div className="mega-item-title">Commission Calculator</div>
                          <div className="mega-item-desc">Free simulator to project your monthly referral payouts</div>
                        </div>

                        <div
                          className="mega-text-item"
                          onClick={() => handleNavClick('how-it-works', 'how-it-works')}
                        >
                          <div className="mega-item-title">Partner Release Notes</div>
                          <div className="mega-item-desc">Stay up to date with new bank tie-ups, features, and policy updates</div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Support */}
                    <div className="mega-column">
                      <div className="mega-section-label">Support</div>
                      <div className="mega-list">
                        <div
                          className="mega-text-item"
                          onClick={() => {
                            setActiveDropdown(null)
                            document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })
                          }}
                        >
                          <div className="mega-item-title">Help Center</div>
                          <div className="mega-item-desc">Get assistance with your JustRefer partner account & tracking</div>
                        </div>

                        <div
                          className="mega-text-item"
                          onClick={() => {
                            setActiveDropdown(null)
                            onOpenModal()
                          }}
                        >
                          <div className="mega-item-title">Dedicated RM Desk</div>
                          <div className="mega-item-desc">Direct access to loan officers for urgent case sanctions</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Direct Link: Commissions */}
            <a
              className={`navbar-link ${currentView === 'payouts' ? 'active' : ''}`}
              href="#payouts"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('payouts', 'pricing')
              }}
            >
              Commissions
            </a>

            {/* 4. Direct Link: Partner Portal */}
            <a
              className={`navbar-link ${currentView === 'dashboard' ? 'active' : ''}`}
              href="#dashboard"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('dashboard')
              }}
            >
              Partner Portal
            </a>
          </nav>
        </div>

        <div className="navbar-right">
          <button
            type="button"
            className="btn-signin"
            onClick={() => {
              if (onSwitchView) onSwitchView('dashboard')
              else onOpenModal()
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className="btn-get-started"
            onClick={onOpenModal}
          >
            Join JustRefer
          </button>
        </div>

        <button
          type="button"
          className="navbar-hamburger"
          aria-label="Menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span />
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <>
          <div className="mobile-nav-backdrop" onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-nav-drawer">
            <div className="mobile-nav-group">
              <div className="mobile-nav-title">Loan Products</div>
              <a href="#products" onClick={(e) => { e.preventDefault(); handleNavClick('products', 'loan-products') }}>Home Loan</a>
              <a href="#products" onClick={(e) => { e.preventDefault(); handleNavClick('products', 'loan-products') }}>Personal Loan</a>
              <a href="#products" onClick={(e) => { e.preventDefault(); handleNavClick('products', 'loan-products') }}>Business Loan</a>
              <a href="#products" onClick={(e) => { e.preventDefault(); handleNavClick('products', 'loan-products') }}>Loan Against Property</a>
            </div>

            <div className="mobile-nav-group">
              <div className="mobile-nav-title">Resources</div>
              <a href="#how-it-works" onClick={(e) => { e.preventDefault(); handleNavClick('how-it-works', 'how-it-works') }}>How It Works</a>
              <a href="#payouts" onClick={(e) => { e.preventDefault(); handleNavClick('payouts', 'pricing') }}>Commissions</a>
              <a href="#dashboard" onClick={(e) => { e.preventDefault(); handleNavClick('dashboard') }}>Partner Portal</a>
            </div>

            <div className="mobile-nav-actions">
              <button type="button" className="btn-signin" onClick={() => { setMobileMenuOpen(false); onSwitchView ? onSwitchView('dashboard') : onOpenModal() }}>
                Sign In
              </button>
              <button type="button" className="btn-get-started" onClick={() => { setMobileMenuOpen(false); onOpenModal() }}>
                Join JustRefer
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  )
}

export default Header
