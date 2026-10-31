import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import '../styles/carry-topbar.css'

interface HeaderProps {
  currentView?: string
  onSwitchView?: (view: any) => void
  onOpenModal?: () => void
  onSignIn?: () => void
  isLoggedIn?: boolean
  isAdmin?: boolean
  onAdminClick?: () => void
  onLogout?: () => void
  onSettings?: () => void
  onEMICalculator?: () => void
}

const Header = ({
  onSwitchView,
  onOpenModal,
  onSignIn,
  isLoggedIn: propIsLoggedIn,
  onLogout,
  onSettings,
  onEMICalculator,
}: HeaderProps) => {
  const { partner, logout } = useAuth()
  const [productsOpen, setProductsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const productsRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  const loggedIn = propIsLoggedIn !== undefined ? propIsLoggedIn : !!partner
  const partnerFullName = partner?.full_name || 'Partner'
  const partnerFirstName = partner?.full_name ? partner.full_name.trim().split(' ')[0] : 'Partner'
  const partnerInitial = partnerFirstName ? partnerFirstName.charAt(0).toUpperCase() : 'P'
  const partnerPhone = partner?.phone || ''
  const partnerCode = partner?.referral_code || partner?.id || 'JR-PARTNER'

  // Close dropdowns on outside click or escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (productsRef.current && !productsRef.current.contains(e.target as Node)) {
        setProductsOpen(false)
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProductsOpen(false)
        setUserMenuOpen(false)
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

  const handleProductSelect = (_productKey: string) => {
    setProductsOpen(false)
    setMobileMenuOpen(false)
    const el = document.getElementById('products') || document.getElementById('loan-products')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else if (onSwitchView) {
      onSwitchView('products')
    }
  }

  const handleDashboardClick = () => {
    setProductsOpen(false)
    setUserMenuOpen(false)
    setMobileMenuOpen(false)
    if (onSwitchView) {
      onSwitchView('dashboard')
    } else {
      window.location.hash = 'dashboard'
    }
  }

  const handleLogoutClick = () => {
    setUserMenuOpen(false)
    setMobileMenuOpen(false)
    if (onLogout) {
      onLogout()
    } else {
      logout()
    }
  }

  return (
    <header className="carry-topbar" role="banner">
      <div className="carry-topbar__inner">
        {/* 1. Logo "justrefer" */}
        <a
          href="/"
          className="carry-topbar__logo"
          onClick={(e) => {
            e.preventDefault()
            if (onSwitchView) onSwitchView('landing')
            else window.location.href = '/'
          }}
        >
          justrefer
        </a>

        {/* 2. Nav links: Products ▾, EMI Calculator, Check CIBIL Free */}
        <nav className="carry-topbar__nav" aria-label="Main Navigation">
          {/* Products with Dropdown */}
          <div className="carry-topbar__nav-item-wrap" ref={productsRef}>
            <button
              type="button"
              className="carry-topbar__link"
              onClick={() => {
                setProductsOpen(!productsOpen)
                setUserMenuOpen(false)
              }}
              aria-expanded={productsOpen}
              aria-haspopup="true"
            >
              <span>Products</span>
              <svg
                className={`carry-topbar__link-chevron ${productsOpen ? 'is-open' : ''}`}
                viewBox="0 0 24 24"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {productsOpen && (
              <div className="carry-dropdown carry-dropdown--products" role="menu">
                <button
                  type="button"
                  className="carry-dropdown__item"
                  onClick={() => handleProductSelect('home')}
                  role="menuitem"
                >
                  <span>Home Loan</span>
                </button>
                <button
                  type="button"
                  className="carry-dropdown__item"
                  onClick={() => handleProductSelect('business')}
                  role="menuitem"
                >
                  <span>Business Loan</span>
                </button>
                <button
                  type="button"
                  className="carry-dropdown__item"
                  onClick={() => handleProductSelect('personal')}
                  role="menuitem"
                >
                  <span>Personal Loan</span>
                </button>
                <button
                  type="button"
                  className="carry-dropdown__item"
                  onClick={() => handleProductSelect('lap')}
                  role="menuitem"
                >
                  <span>Loan Against Property</span>
                </button>
              </div>
            )}
          </div>

          {/* EMI Calculator */}
          <button
            type="button"
            className="carry-topbar__link"
            onClick={() => {
              if (onEMICalculator) onEMICalculator()
              else {
                const el = document.getElementById('emi')
                el?.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          >
            EMI Calculator
          </button>

          {/* Check CIBIL Free with green shield icon (#0f7a45) */}
          <a
            href="https://www.cibil.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="carry-topbar__link"
          >
            <svg
              className="carry-topbar__shield-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <span>Check CIBIL Free</span>
          </a>
        </nav>

        {/* 3. Flexible Spacer */}
        <div className="carry-topbar__spacer" />

        {/* 4. Right side actions */}
        <div className="carry-topbar__actions">
          {loggedIn ? (
            <>
              {/* Logged in: Outlined User Avatar Button */}
              <div className="carry-topbar__user-wrapper" ref={userRef}>
                <button
                  type="button"
                  className="carry-topbar__btn-user"
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen)
                    setProductsOpen(false)
                  }}
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  aria-label="User Profile Menu"
                >
                  <div className="carry-topbar__avatar-circle">{partnerInitial}</div>
                  <span className="carry-topbar__user-name">{partnerFirstName}</span>
                  <svg
                    className={`carry-topbar__user-chevron ${userMenuOpen ? 'is-open' : ''}`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="carry-dropdown carry-dropdown--user" role="menu">
                    <div style={{ padding: '8px 14px 10px', borderBottom: '1px solid #e7e5e0', marginBottom: '6px' }}>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: '#111' }}>{partnerFullName}</div>
                      <div style={{ fontSize: '11px', color: '#6b6b6b', marginTop: '2px' }}>{partnerCode} &bull; {partnerPhone}</div>
                    </div>
                    <button
                      type="button"
                      className="carry-dropdown__item"
                      onClick={handleDashboardClick}
                      role="menuitem"
                    >
                      Dashboard
                    </button>
                    <button
                      type="button"
                      className="carry-dropdown__item"
                      onClick={() => {
                        setUserMenuOpen(false)
                        if (onSettings) onSettings()
                        else window.location.hash = 'settings'
                      }}
                      role="menuitem"
                    >
                      Profile
                    </button>
                    <button
                      type="button"
                      className="carry-dropdown__item"
                      onClick={() => {
                        setUserMenuOpen(false)
                        if (onSettings) onSettings()
                        else window.location.hash = 'settings'
                      }}
                      role="menuitem"
                    >
                      Bank / UPI Settings
                    </button>
                    <div className="carry-dropdown__divider" />
                    <button
                      type="button"
                      className="carry-dropdown__item carry-dropdown__item--danger"
                      onClick={handleLogoutClick}
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Solid Dashboard Button */}
              <button
                type="button"
                className="carry-topbar__btn-dashboard"
                onClick={handleDashboardClick}
              >
                Dashboard
              </button>
            </>
          ) : (
            <>
              {/* Logged out: Login + Become a Partner */}
              <button
                type="button"
                className="carry-topbar__btn-login"
                onClick={() => {
                  if (onSignIn) onSignIn()
                  else if (onOpenModal) onOpenModal()
                  else if (onSwitchView) onSwitchView('login')
                }}
              >
                Login
              </button>
              <button
                type="button"
                className="carry-topbar__btn-partner"
                onClick={() => {
                  if (onSignIn) onSignIn()
                  else if (onOpenModal) onOpenModal()
                  else if (onSwitchView) onSwitchView('login')
                }}
              >
                Become a Partner
              </button>
            </>
          )}
        </div>

        {/* 5. Mobile Hamburger Button (<860px) */}
        <button
          type="button"
          className="carry-topbar__hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer Panel */}
      {mobileMenuOpen && (
        <div className="carry-topbar__mobile-panel">
          <button
            type="button"
            className="carry-topbar__link"
            onClick={() => handleProductSelect('all')}
          >
            <span>Products</span>
            <span style={{ fontSize: 12, color: '#6b6b6b' }}>Home, LAP, Personal, Business</span>
          </button>

          <button
            type="button"
            className="carry-topbar__link"
            onClick={() => {
              setMobileMenuOpen(false)
              onEMICalculator?.()
            }}
          >
            <span>EMI Calculator</span>
          </button>

          <a
            href="https://www.cibil.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="carry-topbar__link"
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg className="carry-topbar__shield-icon" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              Check CIBIL Free
            </span>
          </a>

          <div className="carry-topbar__mobile-actions" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {loggedIn ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#f7f6f3', borderRadius: '6px' }}>
                  <div className="carry-topbar__avatar-circle">{partnerInitial}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#111' }}>{partnerFullName}</div>
                    <div style={{ fontSize: '12px', color: '#6b6b6b' }}>{partnerCode} &bull; {partnerPhone}</div>
                  </div>
                </div>

                <button
                  type="button"
                  className="carry-topbar__btn-dashboard"
                  onClick={handleDashboardClick}
                  style={{ width: '100%' }}
                >
                  Dashboard
                </button>

                <button
                  type="button"
                  className="carry-topbar__btn-login"
                  onClick={handleLogoutClick}
                  style={{ width: '100%', color: '#c92a2a', borderColor: '#fee2e2' }}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="carry-topbar__btn-login"
                  style={{ width: '100%' }}
                  onClick={() => {
                    setMobileMenuOpen(false)
                    if (onSignIn) onSignIn()
                    else if (onOpenModal) onOpenModal()
                    else if (onSwitchView) onSwitchView('login')
                  }}
                >
                  Login
                </button>
                <button
                  type="button"
                  className="carry-topbar__btn-partner"
                  style={{ width: '100%' }}
                  onClick={() => {
                    setMobileMenuOpen(false)
                    if (onSignIn) onSignIn()
                    else if (onOpenModal) onOpenModal()
                    else if (onSwitchView) onSwitchView('login')
                  }}
                >
                  Become a Partner
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
