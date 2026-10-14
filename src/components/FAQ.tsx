import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface FAQItem {
  q: string
  a: string
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      q: 'Who is eligible to join JustRefer?',
      a: 'Anyone with a professional or personal network can join JustRefer — including Chartered Accountants, financial advisors, real estate brokers, tax consultants, and corporate professionals. All you need is a valid PAN and an active Indian bank account for commission payouts.',
    },
    {
      q: 'Why does JustRefer have a membership fee?',
      a: 'JustRefer is 100% free to join with zero subscription or upfront membership fees. We earn institutional partner fees directly from our 40+ lending banks and NBFCs when loans are successfully disbursed, passing the maximum commission share directly to you.',
    },
    {
      q: 'Can I move my existing client accounts to JustRefer?',
      a: 'Yes, absolutely. You can seamlessly submit your existing loan leads or transfer ongoing client cases. Our intelligent bank routing matrix automatically maps each applicant to the lending partner with the highest approval odds and lowest interest rates.',
    },
    {
      q: 'Am I eligible for all loan products?',
      a: 'Yes! As a verified JustRefer partner, you can immediately refer clients across our full product suite: Home Loans, Personal Loans, Business & MSME Loans, Loans Against Property (LAP), Auto Loans, Education Loans, Gold Loans, and Working Capital credit lines.',
    },
    {
      q: 'Can I refer alternative & high-ticket assets with JustRefer?',
      a: 'Yes. Beyond standard retail loans, JustRefer supports high-ticket commercial property financing, machinery & industrial equipment leasing, and customized debt structuring up to ₹25 Crores with our premier private banking partners.',
    },
    {
      q: 'Are there any other fees with JustRefer?',
      a: 'No, there are zero hidden fees, zero maintenance charges, and zero platform deductions. The commission rate displayed on your dashboard is the exact net amount transferred to your bank account every Friday.',
    },
    {
      q: 'What customer support options are available?',
      a: 'We provide dedicated Relationship Manager (RM) support for fast-tracking high-ticket cases, priority WhatsApp assistance, live email/phone underwriting help during business hours, and a 24/7 self-service Partner Knowledge Base.',
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section className="faq-section" id="faq">
      <div className="faq-framed-wrapper">
        <div className="faq-inner-container">
          <h2 className="faq-title">Questions before joining?</h2>

          <div className="faq-list">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i
              return (
                <div key={faq.q} className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleFAQ(i)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-q-text">{faq.q}</span>
                    <svg
                      className={`faq-icon ${isOpen ? 'open' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="faq-answer-wrapper"
                      >
                        <p className="faq-answer-text">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ
