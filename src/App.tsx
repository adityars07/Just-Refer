import Header from './components/Header'
import Hero from './components/Hero'
import PartnerLogos from './components/PartnerLogos'
import LoanProducts from './components/LoanProducts'
import FeatureRibbon from './components/FeatureRibbon'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import WhyChooseUs from './components/WhyChooseUs'
import PromotionalBanner from './components/PromotionalBanner'
import FAQ from './components/FAQ'
import CreditScoreSection from './components/CreditScoreSection'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import './App.css'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PartnerLogos />
        <LoanProducts />
        <FeatureRibbon />
        <HowItWorks />
        <Testimonials />
        <WhyChooseUs />
        <PromotionalBanner />
        <FAQ />
        <CreditScoreSection />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}

export default App
