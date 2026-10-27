import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/Header'
import Hero from './components/Hero'
import PartnerLogos from './components/PartnerLogos'
import CategoryTabs from './components/CategoryTabs'
import FeatureSections from './components/FeatureSections'
import FeaturesGrid from './components/FeaturesGrid'
import Testimonial2 from './components/ui/testimonial-section-2'
import FAQ from './components/FAQ'
import PillTags from './components/PillTags'
import Footer from './components/Footer'
import DashboardView from './components/DashboardView'
import LoanProducts from './components/LoanProducts'
import HowItWorks from './components/HowItWorks'
import MobileAppShowcase from './components/MobileAppShowcase'
import EarningsPayoutsSection from './components/EarningsPayoutsSection'
import MyReferralsSection from './components/MyReferralsSection'
import CreateAccountCard from './components/CreateAccountCard'
import PromotionalBanner from './components/PromotionalBanner'
import EMICalculatorModal from './components/EMICalculatorModal'
import LoginView from './components/LoginView'
import RegisterView from './components/RegisterView'
import ForgotPasswordView from './components/ForgotPasswordView'
import ContactView from './components/ContactView'
import SettingsView from './components/SettingsView'
import AdminPanel from './components/AdminPanel'
import './App.css'
import './styles/carry-theme.css'

type ScreenView =
  | 'landing'
  | 'all'
  | 'dashboard'
  | 'products'
  | 'how-it-works'
  | 'mobile'
  | 'payouts'
  | 'referrals'
  | 'account'
  | 'banner'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'contact'
  | 'settings'
  | 'admin'

function AppContent() {
  const [currentView, setCurrentView] = useState<ScreenView>('landing')
  const [isEMIOpen, setIsEMIOpen] = useState(false)
  const { partner, isLoggedIn, isAdmin, logout } = useAuth()

  // Listen to #admin, ?admin, or ?view=admin from URL
  useEffect(() => {
    const checkRoute = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '')
      const params = new URLSearchParams(window.location.search)
      const viewParam = params.get('view')?.toLowerCase()

      if (hash === 'admin' || viewParam === 'admin' || params.has('admin')) {
        setCurrentView('admin')
      } else if (hash === 'dashboard' || viewParam === 'dashboard') {
        setCurrentView('dashboard')
      }
    }
    checkRoute()
    window.addEventListener('hashchange', checkRoute)
    return () => window.removeEventListener('hashchange', checkRoute)
  }, [])

  // Views that show the public header
  const publicViews = ['landing', 'all', 'products', 'how-it-works', 'mobile', 'payouts', 'referrals', 'account', 'banner', 'contact']
  const showHeader = publicViews.includes(currentView)

  // Unified auth click handler: takes users directly to the OTP screen
  const handleAuthClick = () => {
    if (isLoggedIn) {
      if (isAdmin || partner?.phone?.includes('7753999478')) {
        setCurrentView('admin')
      } else {
        setCurrentView('dashboard')
      }
    } else {
      setCurrentView('login')
    }
  }

  // Handle admin access
  const handleAdminClick = () => {
    setCurrentView('admin')
  }

  return (
    <div className="justrefer-app-root">
      {/* Public Header - only on public pages */}
      {showHeader && (
        <Header
          currentView={currentView}
          onSwitchView={(v: ScreenView) => {
            if (v === 'dashboard') {
              if (isLoggedIn) {
                if (isAdmin || partner?.phone?.includes('7753999478')) {
                  setCurrentView('admin')
                } else {
                  setCurrentView('dashboard')
                }
              } else {
                setCurrentView('login')
              }
            } else {
              setCurrentView(v)
            }
          }}
          onOpenModal={handleAuthClick}
          onSignIn={handleAuthClick}
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin || partner?.phone?.includes('7753999478')}
          onAdminClick={handleAdminClick}
          onLogout={() => { logout(); setCurrentView('landing') }}
          onSettings={() => setCurrentView('settings')}
          onEMICalculator={() => setIsEMIOpen(true)}
        />
      )}

      {/* === AUTH VIEWS (Full Page, No Header) === */}
      {currentView === 'login' && (
        <LoginView
          onSwitchToRegister={() => setCurrentView('register')}
          onForgotPassword={() => setCurrentView('forgot-password')}
          onLoginSuccess={() => {
            const saved = localStorage.getItem('jr_auth')
            if (saved && (saved.includes('7753999478') || saved.includes('"role":"admin"'))) {
              setCurrentView('admin')
            } else {
              setCurrentView('dashboard')
            }
          }}
          onAdminSuccess={() => setCurrentView('admin')}
          onBackToHome={() => setCurrentView('landing')}
        />
      )}

      {currentView === 'register' && (
        <RegisterView
          onSwitchToLogin={() => setCurrentView('login')}
          onRegisterSuccess={() => {
            const saved = localStorage.getItem('jr_auth')
            if (saved && (saved.includes('7753999478') || saved.includes('"role":"admin"'))) {
              setCurrentView('admin')
            } else {
              setCurrentView('dashboard')
            }
          }}
        />
      )}

      {currentView === 'forgot-password' && (
        <ForgotPasswordView onBackToLogin={() => setCurrentView('login')} />
      )}

      {/* === LANDING PAGE === */}
      {currentView === 'landing' && (
        <main>
          <Hero onOpenModal={handleAuthClick} />
          <PartnerLogos />
          <CategoryTabs onSelectCategory={handleAuthClick} />
          <FeatureSections onOpenModal={handleAuthClick} />
          <FeaturesGrid />
          <Testimonial2 />
          <FAQ />
          <PillTags onOpenModal={handleAuthClick} />
          <Footer onSwitchView={setCurrentView} />
        </main>
      )}

      {/* === ALL SCREENS VIEW === */}
      {currentView === 'all' && (
        <div className="all-screens-flow">
          <section className="screen-wrapper">
            <div className="screen-divider-badge">1. Redesigned Landing Page (Carry Design)</div>
            <Hero onOpenModal={handleAuthClick} />
            <PartnerLogos />
            <CategoryTabs onSelectCategory={handleAuthClick} />
            <FeatureSections onOpenModal={handleAuthClick} />
            <FeaturesGrid />
            <Testimonial2 />
            <FAQ />
            <PillTags onOpenModal={handleAuthClick} />
          </section>
          <section className="screen-wrapper">
            <div className="screen-divider-badge">2. Dashboard (Logged-in Partner View)</div>
            <DashboardView onBackToHome={() => setCurrentView('landing')} />
          </section>
          <section className="screen-wrapper">
            <div className="screen-divider-badge">3. Loan Products (3x2 Grid)</div>
            <LoanProducts onSelectProduct={handleAuthClick} />
          </section>
          <section className="screen-wrapper">
            <div className="screen-divider-badge">4. How JustRefer Works (3 Steps & Join Banner)</div>
            <HowItWorks onOpenModal={handleAuthClick} />
          </section>
          <section className="screen-wrapper">
            <div className="screen-divider-badge">5. Mobile App Screens (Two Phone Frames)</div>
            <MobileAppShowcase onOpenModal={handleAuthClick} />
          </section>
          <section className="screen-wrapper">
            <div className="screen-divider-badge">6. Earnings & Payouts (Summary & History)</div>
            <EarningsPayoutsSection />
          </section>
          <section className="screen-wrapper">
            <div className="screen-divider-badge">7. My Referrals (Filters & Full Table)</div>
            <MyReferralsSection onOpenAddModal={handleAuthClick} />
          </section>
          <section className="screen-wrapper">
            <div className="screen-divider-badge">8 & 9. Create Your Account & Brand Banner</div>
            <div className="container" style={{ padding: '60px 24px' }}>
              <div className="account-and-banner-grid">
                <CreateAccountCard
                  onSuccess={() => setCurrentView('dashboard')}
                  onLoginClick={() => setCurrentView('login')}
                />
                <PromotionalBanner onOpenModal={handleAuthClick} />
              </div>
            </div>
          </section>
          <Footer onSwitchView={setCurrentView} />
        </div>
      )}

      {/* === PROTECTED: DASHBOARD === */}
      {currentView === 'dashboard' && (
        <DashboardView
          onBackToHome={() => setCurrentView('landing')}
          onOpenAdmin={() => setCurrentView('admin')}
        />
      )}

      {/* === PROTECTED: SETTINGS === */}
      {currentView === 'settings' && (
        <main>
          <SettingsView />
          <Footer onSwitchView={setCurrentView} />
        </main>
      )}

      {/* === PROTECTED: ADMIN PANEL === */}
      {currentView === 'admin' && (
        <AdminPanel onBackToHome={() => setCurrentView('landing')} />
      )}

      {/* === PUBLIC PAGES === */}
      {currentView === 'products' && (
        <main>
          <LoanProducts onSelectProduct={handleAuthClick} />
          <Footer onSwitchView={setCurrentView} />
        </main>
      )}

      {currentView === 'how-it-works' && (
        <main>
          <HowItWorks onOpenModal={handleAuthClick} />
          <Footer onSwitchView={setCurrentView} />
        </main>
      )}

      {currentView === 'mobile' && (
        <main>
          <MobileAppShowcase onOpenModal={handleAuthClick} />
          <Footer onSwitchView={setCurrentView} />
        </main>
      )}

      {currentView === 'payouts' && (
        <main>
          <EarningsPayoutsSection />
          <Footer onSwitchView={setCurrentView} />
        </main>
      )}

      {currentView === 'referrals' && (
        <main>
          <MyReferralsSection onOpenAddModal={handleAuthClick} />
          <Footer onSwitchView={setCurrentView} />
        </main>
      )}

      {currentView === 'account' && (
        <main style={{ padding: '60px 0' }}>
          <div className="container" style={{ maxWidth: '480px' }}>
            <CreateAccountCard
              onSuccess={() => setCurrentView('dashboard')}
              onLoginClick={() => setCurrentView('login')}
            />
          </div>
          <Footer onSwitchView={setCurrentView} />
        </main>
      )}

      {currentView === 'banner' && (
        <main style={{ padding: '40px 0' }}>
          <PromotionalBanner onOpenModal={handleAuthClick} />
          <Footer onSwitchView={setCurrentView} />
        </main>
      )}

      {currentView === 'contact' && (
        <main>
          <ContactView />
          <Footer onSwitchView={setCurrentView} />
        </main>
      )}

      {/* EMI Calculator Modal */}
      <EMICalculatorModal
        isOpen={isEMIOpen}
        onClose={() => setIsEMIOpen(false)}
        onReferClick={handleAuthClick}
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
