import { useState } from 'react'
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
import BankDesignSample from './components/BankDesignSample'
import './App.css'

function App() {
  const [showBankSample, setShowBankSample] = useState(true)

  if (showBankSample) {
    return <BankDesignSample onClosePreview={() => setShowBankSample(false)} />
  }

  return (
    <>
      <div style={{
        background: '#0A2540',
        color: '#ffffff',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.85rem',
        position: 'sticky',
        top: 0,
        zIndex: 9999
      }}>
        <span>Viewing <strong>Current UI</strong></span>
        <button 
          onClick={() => setShowBankSample(true)}
          style={{
            background: '#C59B27',
            color: '#071527',
            border: 'none',
            padding: '6px 14px',
            borderRadius: '4px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          View Bank-Style Redesign Sample ↗
        </button>
      </div>
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
