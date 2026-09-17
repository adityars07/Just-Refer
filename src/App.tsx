import Header from './components/Header'
import Hero from './components/Hero'
import EarningPotential from './components/EarningPotential'
import BonusProgram from './components/BonusProgram'
import HowItWorks from './components/HowItWorks'
import LoanProducts from './components/LoanProducts'
import WhyChooseUs from './components/WhyChooseUs'
import About from './components/About'
import Testimonials from './components/Testimonials'
import EMICalculator from './components/EMICalculator'
import Contact from './components/Contact'
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
        <EarningPotential />
        <BonusProgram />
        <HowItWorks />
        <LoanProducts />
        <WhyChooseUs />
        <About />
        <Testimonials />
        <EMICalculator />
        <Contact />
        <FAQ />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}

export default App
