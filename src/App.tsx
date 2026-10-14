import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import PartnerLogos from './components/PartnerLogos'
import CategoryTabs from './components/CategoryTabs'
import FeatureSections from './components/FeatureSections'
import FeaturesGrid from './components/FeaturesGrid'
import Testimonials from './components/Testimonials'
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
import CreateAccountModal from './components/CreateAccountModal'
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

function App() {
  const [currentView, setCurrentView] = useState<ScreenView>('landing')
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="justrefer-app-root">
      {/* Main Navbar */}
      <Header
        currentView={currentView}
        onSwitchView={(v: ScreenView) => setCurrentView(v)}
        onOpenModal={() => setIsModalOpen(true)}
      />

      {/* VIEW: REDESIGNED LANDING PAGE (CARRY.COM STYLE) */}
      {currentView === 'landing' && (
        <main>
          {/* 1. Dark Hero with Floating Mockup */}
          <Hero onOpenModal={() => setIsModalOpen(true)} />

          {/* 2. Bank Partners Strip */}
          <PartnerLogos />

          {/* 3. Category Tabs (3D Cubes) */}
          <CategoryTabs onSelectCategory={() => setIsModalOpen(true)} />

          {/* 4. Alternating Feature Sections (Wave Chart + Risk Bar) */}
          <FeatureSections onOpenModal={() => setIsModalOpen(true)} />

          {/* 5. 2x2 Features Grid with Borders */}
          <FeaturesGrid />

          {/* 6. Testimonials with 5 Stars & Avatars */}
          <Testimonials />

          {/* 7. FAQ Accordion */}
          <FAQ />

          {/* 8. Pill Tags ("It's all possible on JustRefer") */}
          <PillTags onOpenModal={() => setIsModalOpen(true)} />

          {/* 9. Minimal Carry Footer */}
          <Footer />
        </main>
      )}

      {/* VIEW: ALL SCREENS IN SEQUENCE */}
      {currentView === 'all' && (
        <div className="all-screens-flow">
          {/* Section 1: Redesigned Landing Page */}
          <section className="screen-wrapper">
            <div className="screen-divider-badge">1. Redesigned Landing Page (Carry Design)</div>
            <Hero onOpenModal={() => setIsModalOpen(true)} />
            <PartnerLogos />
            <CategoryTabs onSelectCategory={() => setIsModalOpen(true)} />
            <FeatureSections onOpenModal={() => setIsModalOpen(true)} />
            <FeaturesGrid />
            <Testimonials />
            <FAQ />
            <PillTags onOpenModal={() => setIsModalOpen(true)} />
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

          <Footer />
        </div>
      )}

      {/* INDIVIDUAL SUB-SCREEN VIEWS */}
      {currentView === 'dashboard' && (
        <DashboardView onBackToHome={() => setCurrentView('landing')} />
      )}

      {currentView === 'products' && (
        <main>
          <LoanProducts onSelectProduct={() => setIsModalOpen(true)} />
          <Footer />
        </main>
      )}

      {currentView === 'how-it-works' && (
        <main>
          <HowItWorks onOpenModal={() => setIsModalOpen(true)} />
          <Footer />
        </main>
      )}

      {currentView === 'mobile' && (
        <main>
          <MobileAppShowcase onOpenModal={() => setIsModalOpen(true)} />
          <Footer />
        </main>
      )}

      {currentView === 'payouts' && (
        <main>
          <EarningsPayoutsSection />
          <Footer />
        </main>
      )}

      {currentView === 'referrals' && (
        <main>
          <MyReferralsSection onOpenAddModal={() => setIsModalOpen(true)} />
          <Footer />
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
          <Footer />
        </main>
      )}

      {currentView === 'banner' && (
        <main style={{ padding: '40px 0' }}>
          <PromotionalBanner onOpenModal={() => setIsModalOpen(true)} />
          <Footer />
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
