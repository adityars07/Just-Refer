// ─────────────────────────────────────────────
// Landing Page Content Configuration
// All landing page copy lives here. Components read from this file.
// ─────────────────────────────────────────────

export const LANDING = {
  meta: {
    title: "JustRefer — India's #1 Loan Referral Platform",
    description:
      'Refer your clients or apply for your own loan. Get the lowest bank rates, track every case, and get paid straight to your bank.',
  },

  productBar: {
    allProductsLabel: 'ALL PRODUCTS',
    rightText: "India's #1 Loan Referral Platform",
  },

  mainNav: {
    logoText: 'justrefer',
    links: [
      { label: 'Products', href: '#products', hasDropdown: true },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Earnings', href: '#earnings' },
      { label: 'Trust', href: '#trust' },
      { label: 'FAQ', href: '#faq' },
    ],
    loginBtn: 'Login',
    partnerBtn: 'Become a Partner',
    dashboardBtn: 'Dashboard',
  },

  hero: {
    badgeText: "India's #1 Loan Referral Platform",
    headlineLine1: 'Every loan',
    headlineLine2: 'pays you.',
    headlineLine3: 'Theirs or yours.',
    subtext:
      'Refer your clients or apply for your own loan. Get the lowest bank rates, track every case, and get paid straight to your bank.',
    ctaPrimary: 'Become a Partner',
    ctaSecondary: 'See how payouts work',
    trustTicks: ['Zero KYC', 'Weekly payouts', '40+ lending partners'],
  },

  heroPreview: {
    wordmark: 'justrefer',
    tabs: ['Home', 'Referrals', 'Payouts'],
    userInitials: 'AR',
    commissionCard: {
      label: 'COMMISSION EARNED',
      amount: '₹7,85,000',
      status: '100% payout disbursed',
      subtext: 'Tracked to the rupee',
    },
    recentReferralsTitle: 'Recent referrals',
    viewAllLabel: 'View all',
    referrals: [
      {
        name: 'Rahul Mehta',
        meta: 'Home Loan · HDFC Bank',
        amount: '₹24,500',
        status: 'Disbursed',
        statusType: 'disbursed',
        segmentsFilled: 5,
      },
      {
        name: 'Kavita Singhal',
        meta: 'Business Loan · Kotak',
        amount: '₹35,000',
        status: 'Sanctioned',
        statusType: 'sanctioned',
        segmentsFilled: 4,
      },
      {
        name: 'Aman Qureshi',
        meta: 'LAP · Bajaj Finserv',
        amount: '₹60,000',
        status: 'Underwriting',
        statusType: 'underwriting',
        segmentsFilled: 2,
      },
    ],
    floatingChipTop: {
      title: 'Payout received',
      sub: '₹25,000 · just now',
    },
    floatingChipBottom: {
      title: 'Secure & private',
      sub: 'Zero KYC · Encrypted',
    },
  },

  stats: {
    totalDisbursedLabel: 'TOTAL DISBURSED',
    payoutDisbursedLabel: 'PAYOUT DISBURSED',
    lendingPartnersLabel: 'LENDING PARTNERS',
    timeToReferLabel: 'TO REFER A CLIENT',
  },

  howItWorks: {
    monoLabel: 'HOW IT WORKS',
    title: 'Refer in 30 seconds. Get paid,\ntracked to the rupee.',
    cards: [
      {
        number: '01',
        title: 'Refer a client',
        description:
          'Submit the borrower contact & requirement in 30 seconds. The lending bank collects borrower KYC and physical files directly.',
        btnText: 'Refer',
      },
      {
        number: '02',
        title: 'Track every stage',
        description:
          'Real-time automated status tracking across all phases: Ingested, Sanctioned, Legal Clear, Disbursed, and Commission Transferred.',
        pillText: 'Sanctioned',
      },
      {
        number: '03',
        title: 'Get paid to your bank',
        description:
          'Direct automated bank credit every Friday via IMPS with complete ledger breakdowns, UTR reference, and zero payment delays.',
        payoutAmount: '₹25,000',
        pillText: 'Paid',
      },
    ],
  },

  earn: {
    monoLabel: 'PRODUCTS & COMMISSIONS',
    title: 'Real commissions on\nevery product you refer',
    calcLabel: 'EARNINGS CALCULATOR',
    sliderLoanLabel: 'Loan size',
    sliderRefLabel: 'Referrals per month',
    resultLabel: 'YOU COULD EARN',
    perMonthLabel: '/ month',
    defaultLoanAmount: 5000000,
    defaultReferrals: 4,
    yearSummaryTemplate: 'That is ₹{lakhs} lakh a year, from {product} alone.',
    footnote: 'Illustrative, at {rate}% {product} payout. Actual rates vary.',
  },

  trust: {
    monoLabel: 'TRUST & COMPLIANCE',
    title: "Your clients' data and your\npayouts, protected.",
    cards: [
      {
        id: 'encryption',
        icon: 'shield-check',
        title: 'Bank-grade encryption',
        description:
          'Borrower data is 256-bit encrypted end-to-end. Only the assigned lending bank ops desk receives credit files.',
      },
      {
        id: 'regulated',
        icon: 'bank',
        title: 'RBI-regulated lenders',
        description:
          'All lending partners are scheduled commercial banks and licensed NBFCs operating under RBI regulatory guidelines.',
      },
      {
        id: 'audit',
        icon: 'route',
        title: 'Payouts you can trace',
        description:
          'Every commission payout includes bank UTR reference numbers, borrower file IDs, and Section 194H tax compliance.',
      },
      {
        id: 'support',
        icon: 'headset',
        title: 'Real people on support',
        description:
          'Dedicated enterprise loan managers available via phone and WhatsApp to resolve stuck files and speed up sanctions.',
      },
    ],
    lendersMonoLabel: 'OUR LENDING PARTNERS',
  },

  partnerStories: {
    monoLabel: 'PARTNER STORIES',
    title: 'Partners already earning\nwith JustRefer',
  },

  faq: {
    monoLabel: 'FAQ',
    title: 'Questions,\nanswered.',
    items: [
      {
        question: 'Do I need to be a DSA to refer loans?',
        answer:
          'No. JustRefer is open to anyone — wealth advisors, CAs, real estate brokers, and individual referrers. You do not need prior DSA codes or monthly volume quotas to earn top-tier institutional commissions.',
      },
      {
        question: 'How and when do I get paid?',
        answer:
          'Commissions are credited directly to your verified bank account every Friday via automated IMPS settlements. Every payout comes with complete transaction ledgers and official UTR reference numbers.',
      },
      {
        question: 'Which loan products can I refer?',
        answer:
          'You can refer Home Loans, Loan Against Property (LAP), Business Loans, and Personal Loans across 40+ scheduled banks and RBI-regulated NBFC partners.',
      },
      {
        question: 'Is there any fee to join?',
        answer:
          'No, joining JustRefer is 100% free with zero registration fees, zero maintenance charges, and zero platform deduction. You keep the full commission payout earned.',
      },
    ],
  },

  closingBand: {
    headline: 'Start earning from your first referral',
    subtext: 'Free to join. Zero KYC. Payouts tracked to the rupee.',
    cta: 'Become a Partner',
  },

  footer: {
    tagline: 'India\'s premier loan referral platform.\nDirect bank tie-ups & instant payouts.',
    columns: [
      {
        title: 'PRODUCT',
        links: [
          { label: 'Home Loans', href: '#products' },
          { label: 'Loan Against Property', href: '#products' },
          { label: 'Business Loans', href: '#products' },
          { label: 'Personal Loans', href: '#products' },
        ],
      },
      {
        title: 'COMPANY',
        links: [
          { label: 'About', href: '#how-it-works' },
          { label: 'How It Works', href: '#how-it-works' },
          { label: 'Earnings', href: '#earnings' },
          { label: 'Contact', href: 'mailto:support@justrefer.in' },
        ],
      },
      {
        title: 'LEGAL',
        links: [
          { label: 'Terms of Use', href: '#terms' },
          { label: 'Privacy Policy', href: '#privacy' },
          { label: 'Disclaimer', href: '#disclaimer' },
        ],
      },
    ],
    copyright: '© 2026 JustRefer Technologies Pvt. Ltd. All rights reserved.',
    disclaimer:
      'Loans are sanctioned and disbursed at the sole discretion of partner banks and NBFCs. JustRefer is an institutional referral platform and does not lend directly.',
  },
} as const;
