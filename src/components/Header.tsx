import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

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
  const { partner } = useAuth()
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)

  const partnerInitials = partner?.full_name
    ? partner.full_name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : (partner?.phone ? partner.phone.slice(-4) : 'P')

  const partnerFirstName = partner?.full_name ? partner.full_name.split(' ')[0] : 'Partner'

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
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null)
        setMobileMenuOpen(false)
        setUserDropdownOpen(false)
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
            <Logo size="md" variant="dark" />
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
                Products
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
                            <div className="mega-item-desc">Min ₹50 Lacs • Starting from 7.25% p.a. for purchase & balance transfers</div>
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
                            <div className="mega-item-desc">Min ₹1 Crore • Starting from 8% p.a. unlocking property equity</div>
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
                            <div className="mega-item-desc">Min ₹5 Lacs • Starting from 9.99% p.a. with swift 24h approval</div>
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
                            <div className="mega-item-desc">Min ₹10 Lacs • Starting from 10.99% p.a. for working capital & scale</div>
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
            <div className="navbar-user-section">
              {isAdmin && (
                <button
                  type="button"
                  className="btn-signin btn-admin-nav"
                  onClick={onAdminClick}
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

              {/* User Avatar Pill & Dropdown */}
              <div className="navbar-user-dropdown-wrap" ref={userDropdownRef}>
                <button
                  type="button"
                  className={`navbar-user-pill-btn ${userDropdownOpen ? 'active' : ''}`}
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-label="User profile menu"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="user-avatar-circle navbar-avatar-circle">
                    {partnerInitials}
                  </div>
                  <span className="navbar-user-firstname">{partnerFirstName}</span>
                  <svg
                    className={`navbar-user-chevron ${userDropdownOpen ? 'open' : ''}`}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {userDropdownOpen && (
                  <div className="navbar-user-dropdown-menu">
                    <div className="user-dropdown-header">
                      <div className="user-avatar-circle dropdown-large-avatar">
                        {partnerInitials}
                      </div>
                      <div className="user-dropdown-info">
                        <div className="user-dropdown-name">{partner?.full_name || 'JustRefer Partner'}</div>
                        <div className="user-dropdown-contact">
                          {partner?.phone || partner?.email || 'Verified Partner'}
                        </div>
                        <span className="user-dropdown-badge">
                          <span className="badge-dot" /> {partner?.role === 'admin' ? 'Administrator' : 'Twilio Verified'}
                        </span>
                      </div>
                    </div>

                    <div className="user-dropdown-divider" />

                    <button
                      type="button"
                      className="user-dropdown-item"
                      onClick={() => {
                        setUserDropdownOpen(false)
                        onSwitchView?.('dashboard')
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="9" />
                        <rect x="14" y="3" width="7" height="5" />
                        <rect x="14" y="12" width="7" height="9" />
                        <rect x="3" y="16" width="7" height="5" />
                      </svg>
                      <span>Partner Dashboard</span>
                    </button>

                    {onAdminClick && (
                      <button
                        type="button"
                        className="user-dropdown-item"
                        onClick={() => {
                          setUserDropdownOpen(false)
                          onAdminClick()
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        <span style={{ color: '#10b981', fontWeight: 600 }}>Admin Panel</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className="user-dropdown-item"
                      onClick={() => {
                        setUserDropdownOpen(false)
                        onSettings?.()
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                      <span>Settings & Payout UPI</span>
                    </button>

                    <button
                      type="button"
                      className="user-dropdown-item"
                      onClick={() => {
                        setUserDropdownOpen(false)
                        onEMICalculator?.()
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="4" y="2" width="16" height="20" rx="2" />
                        <line x1="8" y1="6" x2="16" y2="6" />
                        <line x1="8" y1="10" x2="10" y2="10" />
                        <line x1="14" y1="10" x2="16" y2="10" />
                      </svg>
                      <span>EMI Calculator</span>
                    </button>

                    <div className="user-dropdown-divider" />

                    <button
                      type="button"
                      className="user-dropdown-item user-dropdown-item--logout"
                      onClick={() => {
                        setUserDropdownOpen(false)
                        onLogout?.()
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
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
            {isLoggedIn && (
              <div className="mobile-user-card">
                <div className="user-avatar-circle" style={{ width: 38, height: 38, fontSize: 13 }}>
                  {partnerInitials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{partner?.full_name || 'JustRefer Partner'}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {partner?.phone || partner?.email}
                  </div>
                </div>
              </div>
            )}

            <div className="mobile-nav-group">
              <div className="mobile-nav-title">Products</div>
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
              {isLoggedIn ? (
                <>
                  <button type="button" className="btn-signin" onClick={() => { setMobileMenuOpen(false); onSwitchView ? onSwitchView('dashboard') : undefined }}>
                    Open Dashboard
                  </button>
                  <button
                    type="button"
                    className="btn-signin"
                    style={{ background: '#fee2e2', color: '#dc2626', borderColor: '#fca5a5' }}
                    onClick={() => { setMobileMenuOpen(false); onLogout?.() }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="btn-signin" onClick={() => { setMobileMenuOpen(false); onSwitchView ? onSwitchView('dashboard') : onOpenModal() }}>
                    Sign In
                  </button>
                  <button type="button" className="btn-get-started" onClick={() => { setMobileMenuOpen(false); onOpenModal() }}>
                    Join JustRefer
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  )
}

export default Header
