import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import PartnerLogos from './components/PartnerLogos'
import DashboardView from './components/DashboardView'
import LoanProducts from './components/LoanProducts'
import HowItWorks from './components/HowItWorks'
import MobileAppShowcase from './components/MobileAppShowcase'
import EarningsPayoutsSection from './components/EarningsPayoutsSection'
import MyReferralsSection from './components/MyReferralsSection'
import CreateAccountCard from './components/CreateAccountCard'
import PromotionalBanner from './components/PromotionalBanner'
import CreateAccountModal from './components/CreateAccountModal'
import './App.css'

type ScreenView =
  | 'all'
  | 'landing'
  | 'dashboard'
  | 'products'
  | 'how-it-works'
  | 'mobile'
  | 'payouts'
  | 'referrals'
  | 'account'
  | 'banner'

function App() {
  const [currentView, setCurrentView] = useState<ScreenView>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const screenTabs: { id: ScreenView; label: string }[] = [
    { id: 'all', label: 'All Screens (Reference Order)' },
    { id: 'landing', label: '1. Landing Page' },
    { id: 'dashboard', label: '2. Dashboard' },
    { id: 'products', label: '3. Loan Products' },
    { id: 'how-it-works', label: '4. How It Works' },
    { id: 'mobile', label: '5. Mobile App' },
    { id: 'payouts', label: '6. Earnings & Payouts' },
    { id: 'referrals', label: '7. My Referrals' },
    { id: 'account', label: '8. Create Account' },
    { id: 'banner', label: '9. Brand Banner' },
  ]

  return (
    <div className="justrefer-app-root">
      {/* Top Screen Selector Bar */}
      <nav className="screen-selector-bar" aria-label="Screens Navigation">
        <div className="selector-inner">
          <span className="selector-title">Screen Selector:</span>
          <div className="selector-tabs-scroll">
            {screenTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`tab-btn ${currentView === tab.id ? 'active' : ''}`}
                onClick={() => setCurrentView(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Screen 1: Landing Page Navbar */}
      {(currentView === 'all' || currentView === 'landing' || currentView === 'products' || currentView === 'how-it-works' || currentView === 'banner') && (
        <Header
          currentView={currentView === 'dashboard' ? 'dashboard' : 'landing'}
          onSwitchView={(v) => setCurrentView(v === 'dashboard' ? 'dashboard' : 'landing')}
          onOpenModal={() => setIsModalOpen(true)}
        />
      )}

      {/* VIEW: ALL SCREENS IN EXACT SEQUENCE */}
      {currentView === 'all' && (
        <div className="all-screens-flow">
          {/* Section 1: Landing Page (Hero + Partner Strip) */}
          <section className="screen-wrapper">
            <div className="screen-divider-badge">1. Landing Page (Hero & Bank Strip)</div>
            <Hero onOpenModal={() => setIsModalOpen(true)} />
            <PartnerLogos />
          </section>

          {/* Section 2: Dashboard (Logged-in) */}
          <section className="screen-wrapper">
            <div className="screen-divider-badge">2. Dashboard (Logged-in Partner View)</div>
            <DashboardView onBackToHome={() => setCurrentView('landing')} />
          </section>

          {/* Section 3: Loan Products Page */}
          <section className="screen-wrapper">
            <div className="screen-divider-badge">3. Loan Products (3x2 Grid)</div>
            <LoanProducts onSelectProduct={() => setIsModalOpen(true)} />
          </section>

          {/* Section 4: How JustRefer Works */}
          <section className="screen-wrapper">
            <div className="screen-divider-badge">4. How JustRefer Works (3 Steps & Join Banner)</div>
            <HowItWorks onOpenModal={() => setIsModalOpen(true)} />
          </section>

          {/* Section 5: Mobile App Screens */}
          <section className="screen-wrapper">
            <div className="screen-divider-badge">5. Mobile App Screens (Two Phone Frames)</div>
            <MobileAppShowcase onOpenModal={() => setIsModalOpen(true)} />
          </section>

          {/* Section 6: Earnings & Payouts Page */}
          <section className="screen-wrapper">
            <div className="screen-divider-badge">6. Earnings & Payouts (Summary & History)</div>
            <EarningsPayoutsSection />
          </section>

          {/* Section 7: My Referrals Page */}
          <section className="screen-wrapper">
            <div className="screen-divider-badge">7. My Referrals (Filters & Full Table)</div>
            <MyReferralsSection onOpenAddModal={() => setIsModalOpen(true)} />
          </section>

          {/* Section 8 & 9: Create Account & Brand Banner */}
          <section className="screen-wrapper">
            <div className="screen-divider-badge">8 & 9. Create Your Account & Brand Banner</div>
            <div className="container" style={{ padding: '60px 24px' }}>
              <div className="account-and-banner-grid">
                <CreateAccountCard
                  onSuccess={() => setCurrentView('dashboard')}
                  onLoginClick={() => setCurrentView('dashboard')}
                />
                <PromotionalBanner onOpenModal={() => setIsModalOpen(true)} />
              </div>
            </div>
          </section>
        </div>
      )}

      {/* INDIVIDUAL SCREEN VIEWS */}
      {currentView === 'landing' && (
        <main>
          <Hero onOpenModal={() => setIsModalOpen(true)} />
          <PartnerLogos />
          <LoanProducts onSelectProduct={() => setIsModalOpen(true)} />
          <HowItWorks onOpenModal={() => setIsModalOpen(true)} />
          <PromotionalBanner onOpenModal={() => setIsModalOpen(true)} />
        </main>
      )}

      {currentView === 'dashboard' && (
        <DashboardView onBackToHome={() => setCurrentView('landing')} />
      )}

      {currentView === 'products' && (
        <main>
          <LoanProducts onSelectProduct={() => setIsModalOpen(true)} />
        </main>
      )}

      {currentView === 'how-it-works' && (
        <main>
          <HowItWorks onOpenModal={() => setIsModalOpen(true)} />
        </main>
      )}

      {currentView === 'mobile' && (
        <main>
          <MobileAppShowcase onOpenModal={() => setIsModalOpen(true)} />
        </main>
      )}

      {currentView === 'payouts' && (
        <main>
          <EarningsPayoutsSection />
        </main>
      )}

      {currentView === 'referrals' && (
        <main>
          <MyReferralsSection onOpenAddModal={() => setIsModalOpen(true)} />
        </main>
      )}

      {currentView === 'account' && (
        <main style={{ padding: '60px 0' }}>
          <div className="container" style={{ maxWidth: '480px' }}>
            <CreateAccountCard
              onSuccess={() => setCurrentView('dashboard')}
              onLoginClick={() => setCurrentView('dashboard')}
            />
          </div>
        </main>
      )}

      {currentView === 'banner' && (
        <main style={{ padding: '40px 0' }}>
          <PromotionalBanner onOpenModal={() => setIsModalOpen(true)} />
        </main>
      )}

      {/* Global Modal for Get Started / Add Referral */}
      <CreateAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setCurrentView('dashboard')}
      />
    </div>
  )
}

export default App
