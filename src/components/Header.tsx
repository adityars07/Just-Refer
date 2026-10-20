import { useState, useRef, useEffect } from 'react'

interface HeaderProps {
  currentView?: string
  onSwitchView?: (view: any) => void
  onOpenModal: () => void
  onSignIn?: () => void
  isLoggedIn?: boolean
  isAdmin?: boolean
  onAdminClick?: () => void
  onLogout?: () => void
  onSettings?: () => void
  onEMICalculator?: () => void
}

type DropdownKey = 'products' | 'how-it-works' | null

const Header = ({ currentView = 'landing', onSwitchView, onOpenModal, onSignIn, isLoggedIn, isAdmin, onAdminClick, onLogout, onSettings, onEMICalculator }: HeaderProps) => {
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
            <span className="carry-wordmark-logo">justrefer</span>
          </a>

          <nav className="navbar-links">
            {/* 1. Invest Dropdown (Carry "Invest" style) */}
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
                Invest
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
                  <div className="mega-card mega-card-products" style={{ maxWidth: 780 }}>
                    <div className="mega-section">
                      <div className="mega-section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Official Loan Products & Commission Rates</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#1F9D55', background: '#e6f7ee', padding: '2px 8px', borderRadius: 4 }}>
                          Direct Partner Payouts
                        </span>
                      </div>
                      <div className="mega-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                        <div
                          className="mega-item"
                          onClick={() => handleNavClick('products', 'loan-products')}
                        >
                          <div className="mega-icon-box" style={{ background: '#e6f7ee', color: '#1F9D55' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                              <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                          </div>
                          <div className="mega-item-text">
                            <div className="mega-item-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span>Home Loan</span>
                              <span style={{ fontSize: 11, color: '#1F9D55', fontWeight: 800 }}>0.3% Comm.</span>
                            </div>
                            <div className="mega-item-desc">Min ₹50 Lacs • Starting from 8.5% p.a. for purchase & balance transfers</div>
                          </div>
                        </div>

                        <div
                          className="mega-item"
                          onClick={() => handleNavClick('products', 'loan-products')}
                        >
                          <div className="mega-icon-box" style={{ background: '#fff7ed', color: '#ea580c' }}>
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
                            <div className="mega-item-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span>Loan Against Property (LAP)</span>
                              <span style={{ fontSize: 11, color: '#ea580c', fontWeight: 800 }}>0.5% Comm.</span>
                            </div>
                            <div className="mega-item-desc">Min ₹1 Crore • Starting from 8.99% p.a. unlocking property equity</div>
                          </div>
                        </div>

                        <div
                          className="mega-item"
                          onClick={() => handleNavClick('products', 'loan-products')}
                        >
                          <div className="mega-icon-box" style={{ background: '#eff6ff', color: '#2563EB' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="4" width="20" height="16" rx="2" />
                              <line x1="2" y1="10" x2="22" y2="10" />
                              <circle cx="8" cy="15" r="1.5" />
                              <path d="M14 15h4" />
                            </svg>
                          </div>
                          <div className="mega-item-text">
                            <div className="mega-item-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span>Personal Loan</span>
                              <span style={{ fontSize: 11, color: '#2563EB', fontWeight: 800 }}>1.0% Comm.</span>
                            </div>
                            <div className="mega-item-desc">Min ₹5 Lacs • Starting from 8.25% p.a. with swift 24h approval</div>
                          </div>
                        </div>

                        <div
                          className="mega-item"
                          onClick={() => handleNavClick('products', 'loan-products')}
                        >
                          <div className="mega-icon-box" style={{ background: '#f5f3ff', color: '#7C3AED' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="7" width="20" height="14" rx="2" />
                              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                              <line x1="12" y1="12" x2="12" y2="12.01" />
                            </svg>
                          </div>
                          <div className="mega-item-text">
                            <div className="mega-item-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span>Business Loan</span>
                              <span style={{ fontSize: 11, color: '#7C3AED', fontWeight: 800 }}>1.0% Comm.</span>
                            </div>
                            <div className="mega-item-desc">Min ₹10 Lacs • Starting from 9.99% p.a. for working capital & scale</div>
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
                Learn
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
                      <div className="mega-section-label">Resources</div>
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

            {/* 3. Direct Link: Pricing (Carry "Pricing" style) */}
            <a
              className={`navbar-link ${currentView === 'payouts' ? 'active' : ''}`}
              href="#pricing"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('payouts', 'features')
              }}
            >
              Pricing
            </a>
          </nav>
        </div>

        <div className="navbar-right">
          {/* Utility Pill Buttons */}
          <div className="navbar-utility-actions">
            <button
              type="button"
              className="btn-utility-pill"
              onClick={() => onEMICalculator ? onEMICalculator() : handleNavClick('emi-calculator')}
              title="EMI Calculator"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="utility-pill-icon">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="6" x2="16" y2="6" />
                <line x1="8" y1="10" x2="10" y2="10" />
                <line x1="14" y1="10" x2="16" y2="10" />
                <line x1="8" y1="14" x2="10" y2="14" />
                <line x1="14" y1="14" x2="16" y2="14" />
                <line x1="8" y1="18" x2="10" y2="18" />
                <line x1="14" y1="18" x2="16" y2="18" />
              </svg>
              EMI Calculator
            </button>
            <a
              href="https://www.cibil.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-utility-pill btn-utility-pill--cibil"
              title="Check CIBIL Free"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="utility-pill-icon">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              Check CIBIL Free
            </a>
          </div>

          {isLoggedIn ? (
            <>
              {isAdmin && (
                <button
                  type="button"
                  className="btn-signin"
                  onClick={onAdminClick}
                  style={{ background: '#dc262610', color: '#dc2626', border: '1px solid #dc262640' }}
                >
                  Admin Panel
                </button>
              )}
              <button
                type="button"
                className="btn-signin"
                onClick={() => onSwitchView?.('dashboard')}
              >
                Dashboard
              </button>
              <div className="navbar-user-menu">
                <button type="button" className="navbar-avatar-btn" onClick={onSettings}>
                  <div className="user-avatar-circle" style={{ width: 32, height: 32, fontSize: 12 }}>U</div>
                </button>
                <button
                  type="button"
                  className="btn-get-started"
                  onClick={onLogout}
                  style={{ background: '#dc2626' }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn-signin"
                onClick={() => onSignIn ? onSignIn() : (onSwitchView ? onSwitchView('dashboard') : onOpenModal())}
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
            </>
          )}
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
              <div className="mobile-nav-title">Invest</div>
              <a href="#products" onClick={(e) => { e.preventDefault(); handleNavClick('products', 'loan-products') }}>Home Loan</a>
              <a href="#products" onClick={(e) => { e.preventDefault(); handleNavClick('products', 'loan-products') }}>Personal Loan</a>
              <a href="#products" onClick={(e) => { e.preventDefault(); handleNavClick('products', 'loan-products') }}>Business Loan</a>
              <a href="#products" onClick={(e) => { e.preventDefault(); handleNavClick('products', 'loan-products') }}>Loan Against Property</a>
            </div>

            <div className="mobile-nav-group">
              <div className="mobile-nav-title">Learn</div>
              <a href="#how-it-works" onClick={(e) => { e.preventDefault(); handleNavClick('how-it-works', 'how-it-works') }}>How It Works</a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); handleNavClick('payouts', 'features') }}>Pricing & Commissions</a>
            </div>

            <div className="mobile-nav-group mobile-nav-utility">
              <div className="mobile-nav-title">Tools</div>
              <button type="button" className="btn-utility-pill" onClick={() => { setMobileMenuOpen(false); onEMICalculator ? onEMICalculator() : handleNavClick('emi-calculator'); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="utility-pill-icon"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/></svg>
                EMI Calculator
              </button>
              <a href="https://www.cibil.com/" target="_blank" rel="noopener noreferrer" className="btn-utility-pill btn-utility-pill--cibil" onClick={() => setMobileMenuOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="utility-pill-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                Check CIBIL Free
              </a>
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
