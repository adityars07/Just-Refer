import Header from './components/Header'
import Hero from './components/Hero'
import Benefits from './components/Benefits'
import HowItWorks from './components/HowItWorks'
import Plans from './components/Plans'
import LoanProducts from './components/LoanProducts'
import Testimonials from './components/Testimonials'
import PromotionalBanner from './components/PromotionalBanner'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import './App.css'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Benefits />
        <HowItWorks />
        <Plans />
        <LoanProducts />
        <Testimonials />
        <PromotionalBanner />
        <FAQ />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}

export default App
