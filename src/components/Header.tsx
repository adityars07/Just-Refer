interface HeaderProps {
  currentView: 'landing' | 'dashboard'
  onSwitchView: (view: 'landing' | 'dashboard') => void
  onOpenModal: () => void
}

const Header = ({ currentView, onSwitchView, onOpenModal }: HeaderProps) => {
  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Brand Logo */}
        <div
          className="brand"
          onClick={() => onSwitchView('landing')}
          style={{ cursor: 'pointer' }}
        >
          <div className="brand-dot-logo">
            <span>$</span>
          </div>
          <span className="brand-title-text">JustRefer</span>
        </div>

        {/* Center Nav Links */}
        <nav className="nav-links-center">
          <a
            href="#home"
            className={`nav-item ${currentView === 'landing' ? 'active' : ''}`}
            onClick={() => onSwitchView('landing')}
          >
            Home
          </a>
          <a href="#how-it-works" className="nav-item">How it works</a>
          <a href="#loan-products" className="nav-item">Loan Products</a>
          <a href="#partners" className="nav-item">Partners</a>
          <a href="#pricing" className="nav-item">Pricing</a>
          <a href="#faqs" className="nav-item">FAQs</a>
        </nav>

        {/* Right Action Buttons */}
        <div className="header-actions">
          {currentView === 'landing' ? (
            <>
              <button
                type="button"
                className="btn-header-login"
                onClick={() => onSwitchView('dashboard')}
              >
                Login
              </button>
              <button
                type="button"
                className="btn-header-started"
                onClick={onOpenModal}
              >
                Get Started
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn-header-login"
                onClick={() => onSwitchView('landing')}
              >
                ← Back to Main Site
              </button>
              <button
                type="button"
                className="btn-header-started"
                onClick={onOpenModal}
              >
                + New Referral
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
