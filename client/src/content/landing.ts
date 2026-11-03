// ─────────────────────────────────────────────
// Landing Page Content Configuration
// All landing page copy lives here. Components read from this file.
// ─────────────────────────────────────────────

export const LANDING = {
  meta: {
    title: 'JustRefer — Every loan pays you',
    description: 'India\'s premier loan referral platform. Earn real commissions on every loan you refer — Home, Business, Personal, or LAP.',
  },

  productBar: {
    rightText: 'India\'s #1 Loan Referral Platform',
  },

  hero: {
    badge: 'India\'s No.1 Referral Platform',
    headlineLine1: 'Every loan',
    headlineLine2: 'pays you.',
    headlineLine3: 'Theirs or yours.',
    subtext: 'Refer your clients or apply for your own home, business, or personal loan. Get the lowest bank rates and earn guaranteed commissions, tracked to the rupee.',
    ctaPrimary: 'Become a Partner',
    ctaSecondary: 'See how payouts work',
    trustTicks: [
      '✓ Zero KYC',
      '✓ Tracked to the rupee',
      '✓ Weekly IMPS settlements',
    ],
  },

  stats: {
    totalDisbursedLabel: 'Cr',
    payoutPctLabel: '%',
    lendingPartnersLabel: 'Lending Partners',
    timeToReferLabel: 'to refer',
  },

  howItWorks: {
    sectionLabel: 'HOW IT WORKS',
    title: 'Refer in 30 seconds. Get paid,\ntracked to the rupee.',
    steps: [
      {
        number: '01',
        title: 'Refer a client',
        description: 'Submit the applicant name, loan type, and requirement in 30 seconds. No paperwork or KYC from your side.',
      },
      {
        number: '02',
        title: 'Track every stage',
        description: 'Follow your referral from login to underwriting to sanction to disbursal — all in real time on your dashboard.',
      },
      {
        number: '03',
        title: 'Get paid to your bank',
        description: 'Commission is credited directly to your bank account via IMPS every Friday. Track every rupee in your settlement ledger.',
      },
    ],
  },

  earn: {
    sectionLabel: 'EARN ON EVERY LOAN',
    title: 'Real commissions on\nevery product you refer',
    calculatorNote: 'Illustrative. Actual rates vary.',
    defaultLoanAmount: 5000000,
    defaultReferralCount: 10,
  },

  trust: {
    sectionLabel: 'TRUST & SECURITY',
    title: 'Your clients\' data and your\npayouts, protected.',
    cards: [
      {
        icon: 'encrypt',
        title: 'Data-grade encryption',
        description: 'Client data is encrypted end-to-end. Only the assigned lending partner can access borrower information.',
      },
      {
        icon: 'noDoc',
        title: 'No paperwork burden',
        description: 'You refer, the bank collects KYC. Zero document handling or physical file submission required from you.',
      },
      {
        icon: 'payout',
        title: 'Payouts you can trace',
        description: 'Every commission is logged with UTR reference, loan ID, and settlement date. Full audit trail in your dashboard.',
      },
      {
        icon: 'rbi',
        title: 'Bank-grade or superior',
        description: 'All lending partners are RBI-regulated scheduled commercial banks and licensed NBFCs.',
      },
    ],
    lendersLabel: 'Lending Partners',
  },

  testimonials: {
    sectionLabel: 'PARTNER STORIES',
    title: 'Partners already earning\nwith JustRefer',
  },

  faq: {
    sectionLabel: 'FAQ',
    title: 'Questions,\nanswered.',
    items: [
      {
        question: 'Do I need to be a DSA to refer loans?',
        answer: 'No. JustRefer is open to anyone — professionals, freelancers, business owners, CAs, real estate brokers, and salaried individuals. You don\'t need a DSA code or prior lending experience. Simply sign up, refer a client, and earn commissions on every disbursed loan.',
      },
      {
        question: 'How and when do I get paid?',
        answer: 'Commissions are credited directly to your registered bank account via IMPS every Friday. You can track your earnings, pending payouts, and settlement history in real time on your partner dashboard.',
      },
      {
        question: 'What products can I refer?',
        answer: 'You can refer Home Loans, Loan Against Property (LAP), Personal Loans, and Business Loans. Each product has transparent payout rates displayed on the platform, so you know exactly what you\'ll earn before you refer.',
      },
      {
        question: 'Is there any fee to join?',
        answer: 'JustRefer is currently free to join during our early access period. There are no hidden charges, no monthly quotas, and no lock-in. You earn commissions purely on successful loan disbursals.',
      },
      {
        question: 'Is there any lock-in period?',
        answer: 'No. You can stop referring at any time. There\'s no minimum volume requirement and no contractual lock-in. Earned commissions on previously disbursed loans will still be paid out as per the settlement schedule.',
      },
    ],
  },

  closingBand: {
    headline: 'Start earning from your first referral',
    subtext: 'Every loan pays you. Every rupee is tracked. It\'s all on JustRefer.',
    cta: 'Become a Partner',
  },

  footer: {
    description: 'JustRefer is India\'s premier loan referral platform, connecting referrers with top banks and NBFCs for transparent, high-yield commission payouts.',
    columns: [
      {
        title: 'PRODUCTS',
        links: [
          { label: 'Home Loans', href: '#products' },
          { label: 'Business Loans', href: '#products' },
          { label: 'Personal Loans', href: '#products' },
          { label: 'Loan Against Property', href: '#products' },
        ],
      },
      {
        title: 'RESOURCES',
        links: [
          { label: 'How It Works', href: '#how-it-works' },
          { label: 'Earnings', href: '#earnings' },
          { label: 'FAQ', href: '#faq' },
          { label: 'Partner Portal', href: '/dashboard' },
        ],
      },
      {
        title: 'COMPANY',
        links: [
          { label: 'About JustRefer', href: '#about' },
          { label: 'Contact Support', href: 'mailto:support@justrefer.in' },
          { label: 'Privacy Policy', href: '#privacy' },
          { label: 'Terms of Service', href: '#terms' },
        ],
      },
    ],
    disclaimer: '© 2026 JustRefer Technologies Pvt. Ltd. All rights reserved. JustRefer is a loan referral platform. All lending is done by RBI-regulated banks and NBFCs. JustRefer does not lend directly.',
    legalLinks: [
      { label: 'Privacy', href: '#privacy' },
      { label: 'Terms', href: '#terms' },
      { label: 'Security', href: '#security' },
    ],
  },
} as const;
