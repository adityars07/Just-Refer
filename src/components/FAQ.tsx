import { useState } from 'react'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      q: 'What is required to join JustRefer?',
      a: 'You need a valid PAN card, an active bank account for payouts, and a minimum of 1 referral to get started. Our onboarding takes under 5 minutes.',
    },
    {
      q: 'Why does JustRefer have a membership fee?',
      a: 'JustRefer is completely free to join. We earn a small commission from our banking partners when loans are successfully disbursed. You keep the majority of the referral earnings.',
    },
    {
      q: 'Can I track my referrals and commissions in real-time?',
      a: 'Yes! Our dashboard provides real-time tracking of all your referrals, their status (submitted, approved, disbursed), and your earned commissions.',
    },
    {
      q: 'Am I eligible for all loan products?',
      a: 'You can refer customers for any loan product listed on our platform — Home Loans, Personal Loans, Business Loans, Car Loans, Education Loans, and Loans Against Property.',
    },
    {
      q: 'Can I refer unlimited loans with JustRefer?',
      a: 'Absolutely. There is no cap on the number of referrals you can make. The more you refer, the more you earn.',
    },
    {
      q: 'Are there any other fees with JustRefer?',
      a: 'No hidden fees. JustRefer is free for referral partners. All commissions are transparently calculated and paid directly to your bank account.',
    },
    {
      q: 'What customer support options are available?',
      a: 'We offer chat support, email support, and phone support during business hours. Premium partners get dedicated relationship managers.',
    },
  ]

  return (
    <section className="faq-section">
      <div className="container-narrow">
        <h2 className="faq-title">Questions before joining?</h2>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`}>
              <button
                className="faq-question"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span>{faq.q}</span>
                <svg className="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
