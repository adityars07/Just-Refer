import { useState } from 'react'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      q: 'Where and how can I apply for a loan or submit a referral?',
      a: 'You can apply directly using our instant online calculator above or via our Partner Portal. Simply choose the loan type, enter the desired amount, and submit the applicant contact info. Our dedicated loan officer will initiate verification within 2 hours.'
    },
    {
      q: 'What documents do I need to submit?',
      a: 'Basic documents required include: Identity Proof (PAN Card & Aadhaar Card), Address Proof, last 6 months Bank Statements, and last 3 months salary slips (for salaried) or 2 years ITR with computation (for self-employed/businesses).'
    },
    {
      q: 'Who is eligible to apply for loans on JustRefer?',
      a: 'Any Indian citizen aged between 21 and 65 years with a stable income source is eligible. Salaried individuals should have at least 1-2 years total work experience; business owners should have at least 2-3 years vintage. A CIBIL score of 700+ qualifies you for the lowest interest rates.'
    },
    {
      q: 'How long does it take to process my application?',
      a: 'Personal loans are pre-approved and disbursed within 24 to 48 hours. Home loans and Loans Against Property typically take 4 to 7 working days, subject to property legal and technical verification.'
    },
    {
      q: 'How are referral commissions calculated and paid?',
      a: 'Referral commission is calculated as a percentage of the total loan disbursed (e.g. 0.3% on Home Loans = ₹30,000 per ₹1 Crore; up to 1.5% on Personal Loans). Commissions are settled directly into your verified bank account via NEFT within T+2 working days of loan disbursal.'
    }
  ]

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="section-eyebrow">Faqs</span>
          <h2 className="section-heading">Answers To Your Questions</h2>
          <p className="hero-desc" style={{ maxWidth: '580px', margin: '0 auto', fontSize: '0.95rem' }}>
            Everything you need to know about getting approved, card limits, and rewards.
          </p>
        </div>

        <div className="faq-container">
          {faqs.map((item, idx) => (
            <div key={idx} className={`faq-item ${openIndex === idx ? 'open' : ''}`}>
              <div className="faq-header" onClick={() => toggle(idx)}>
                <span>{item.q}</span>
                <div className="faq-toggle-icon">
                  {openIndex === idx ? '−' : '+'}
                </div>
              </div>
              {openIndex === idx && (
                <div className="faq-body">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
