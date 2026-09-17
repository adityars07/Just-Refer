import { useState } from 'react'

const faqData = [
  {
    question: 'What is JustRefer?',
    answer: 'JustRefer is India\'s first loan referral platform by FinzoMoney. It allows you to refer friends, family, or anyone in need of a loan and earn attractive commissions on every successful disbursement. You don\'t need any financial expertise – just refer and earn!',
  },
  {
    question: 'How much can I earn?',
    answer: 'Your earnings depend on the loan type and amount. Home Loans earn 0.3% (₹30,000 per crore), Loan Against Property earns 0.5% (₹50,000 per crore), and Personal & Business Loans earn 1% (₹10,000 per ₹10 lakh). Plus, our Referral Bonus Program offers additional 0.10% bonuses on milestones!',
  },
  {
    question: 'When do I get paid?',
    answer: 'Your commission is processed once the referred loan is successfully disbursed. The payment is made directly to your registered bank account within 7-10 business days of disbursal. You can track all your referrals and payments through the JustRefer dashboard.',
  },
  {
    question: 'Is there any cost to join?',
    answer: 'Absolutely not! Joining JustRefer is completely free. There are no sign-up fees, no hidden charges, and no minimum referral requirements. Just register, start referring, and earn commissions.',
  },
  {
    question: 'Which banks do you work with?',
    answer: 'We partner with 25+ leading banks and NBFCs including SBI, HDFC, ICICI, Axis Bank, Kotak Mahindra, Bank of Baroda, and many more. This allows us to offer the best rates and most suitable products to the borrowers you refer.',
  },
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <span className="section-badge">HAVE QUESTIONS?</span>
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqData.map((faq, i) => (
            <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`} id={`faq-${i + 1}`}>
              <button className="faq-question" onClick={() => toggle(i)}>
                <span>{faq.question}</span>
                <svg className="faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
