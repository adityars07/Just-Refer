// ─────────────────────────────────────────────
// Landing Page Content Configuration
// All landing page copy lives here. Components read from this file.
// ─────────────────────────────────────────────

export interface ProductItem {
  id?: string;
  name: string;
  color: string;
  href?: string;
  minAmount?: string;
  rate?: string;
  payoutPercent?: number;
  payoutText?: string;
  examplePayout?: string;
}

export interface HeroReferral {
  name: string;
  meta: string;
  amount: string;
  status: 'Disbursed' | 'Sanctioned' | 'Underwriting';
  statusType: 'disbursed' | 'sanctioned' | 'underwriting';
  segmentsFilled: number; // 1 to 5
}

export interface HowItWorksCard {
  number: string;
  title: string;
  description: string;
  btnText?: string;
  pillText?: string;
  payoutAmount?: string;
}

export interface TrustCard {
  id: string;
  icon: 'shield-check' | 'bank' | 'route' | 'headset';
  title: string;
  description: string;
}

export interface StoryCard {
  quote: string;
  author: string;
  role: string;
  earnings: string;
  initials: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const LANDING = {
  meta: {
    title: "JustRefer — India's #1 Loan Referral Platform",
    description:
      'Refer your clients or apply for your own loan. Get the lowest bank rates, track every case, and get paid straight to your bank.',
  },

  productBar: {
    allProductsLabel: 'ALL PRODUCTS',
    rightText: 'Free to join · Zero KYC',
    products: [
      { name: 'Home Loan', color: '#F2B746', href: '#products' },
      { name: 'Loan Against Property', color: '#EBD6F0', href: '#products' },
      { name: 'Business Loan', color: '#C8DCF5', href: '#products' },
      { name: 'Personal Loan', color: '#C8ECD7', href: '#products' },
    ],
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
      'Refer your clients or apply for your own loan. Get the lowest\nbank rates, track every case, and get paid straight to your bank.',
    ctaPrimary: 'Become a Partner →',
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
      subtext: '₹15.70 Cr disbursed so far',
    },
    recentReferralsTitle: 'Recent referrals',
    viewAllLabel: 'View all',
    referrals: [
      {
        name: 'Rahul Mehta',
        meta: 'Home Loan · HDFC Bank',
        amount: '₹62,00,000',
        status: 'Disbursed',
        statusType: 'disbursed',
        segmentsFilled: 4,
      },
      {
        name: 'Sneha Kapoor',
        meta: 'Business Loan · IIFL Finance',
        amount: '₹1,20,00,000',
        status: 'Sanctioned',
        statusType: 'sanctioned',
        segmentsFilled: 3,
      },
      {
        name: 'Imran Qureshi',
        meta: 'Personal Loan · Bajaj Finserv',
        amount: '₹8,50,000',
        status: 'Underwriting',
        statusType: 'underwriting',
        segmentsFilled: 2,
      },
    ] as HeroReferral[],
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
    totalDisbursedValue: '₹15.70 Cr',
    payoutDisbursedLabel: 'PAYOUT DISBURSED',
    payoutDisbursedValue: '100%',
    lendingPartnersLabel: 'LENDING PARTNERS',
    lendingPartnersValue: '40+',
    timeToReferLabel: 'TO REFER A CLIENT',
    timeToReferValue: '30 sec',
  },

  howItWorks: {
    monoLabel: 'HOW IT WORKS',
    title: 'Refer in 30 seconds. Get paid,\ntracked to the rupee.',
    cards: [
      {
        number: '01',
        title: 'Refer a client',
        description: 'Submit name and loan need. Zero KYC. We route it to the best lender automatically.',
        btnText: 'Refer',
      },
      {
        number: '02',
        title: 'Track every stage',
        description: 'From login to sanction to disbursal, see each update live in your dashboard.',
        pillText: 'Sanctioned',
      },
      {
        number: '03',
        title: 'Get paid to your bank',
        description: 'Commission is paid out straight to your bank account. Withdraw whenever you like.',
        payoutAmount: '₹25,000',
        pillText: 'Paid',
      },
    ] as HowItWorksCard[],
  },

  earn: {
    monoLabel: 'EARN ON EVERY LOAN',
    title: 'Real commissions on\nevery product you refer',
    products: [
      {
        id: 'home-loan',
        name: 'Home Loan',
        color: '#F2B746',
        rate: 'From ₹50 Lakhs · 7.25% p.a.',
        payoutPercent: 0.3,
        payoutText: '0.3% payout',
        examplePayout: '₹15,000 per ₹50L',
      },
      {
        id: 'lap',
        name: 'Loan Against Property',
        color: '#EBD6F0',
        rate: 'From ₹1 Crore · 8.00% p.a.',
        payoutPercent: 0.5,
        payoutText: '0.5% payout',
        examplePayout: '₹50,000 per ₹1Cr',
      },
      {
        id: 'business-loan',
        name: 'Business Loan',
        color: '#C8DCF5',
        rate: 'From ₹10 Lakhs · 9.50% p.a.',
        payoutPercent: 0.4,
        payoutText: '0.4% payout',
        examplePayout: '₹40,000 per ₹1Cr',
      },
      {
        id: 'personal-loan',
        name: 'Personal Loan',
        color: '#C8ECD7',
        rate: 'From ₹1 Lakh · 10.50% p.a.',
        payoutPercent: 1.0,
        payoutText: '1.0% payout',
        examplePayout: '₹5,000 per ₹5L',
      },
    ] as ProductItem[],
    calcLabel: 'EARNINGS CALCULATOR',
    sliderLoanLabel: 'Loan size',
    sliderRefLabel: 'Referrals per month',
    resultLabel: 'YOU COULD EARN',
    perMonthLabel: '/ month',
    defaultLoanAmount: 5000000,
    defaultReferrals: 4,
    defaultPayoutRate: 0.003,
    yearSummaryTemplate: 'That is ₹{lakhs} lakh a year, from {product} alone.',
    footnote: 'Illustrative, at 0.3% home-loan payout. Actual rates vary.',
  },

  trust: {
    monoLabel: 'TRUST & SECURITY',
    title: "Your clients' data and your\npayouts, protected.",
    cards: [
      {
        id: 'encryption',
        icon: 'shield-check',
        title: 'Bank-grade encryption',
        description: 'Client and bank details are encrypted at rest and in transit.',
      },
      {
        id: 'regulated',
        icon: 'bank',
        title: 'RBI-regulated lenders',
        description: 'Every case goes to licensed banks and NBFCs only.',
      },
      {
        id: 'audit',
        icon: 'route',
        title: 'Payouts you can trace',
        description: 'Each commission is tracked from sanction to your bank account.',
      },
      {
        id: 'support',
        icon: 'headset',
        title: 'Real people on support',
        description: 'Talk to a relationship manager when a case needs a push.',
      },
    ] as TrustCard[],
    lendersMonoLabel: 'OUR LENDING PARTNERS',
    lenders: ['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'IIFL Finance', 'Bajaj Finserv', 'Tata Capital'],
  },

  partnerStories: {
    monoLabel: 'PARTNER STORIES',
    title: 'Partners already earning\nwith JustRefer',
    sampleContentBadge: 'SAMPLE CONTENT',
    cards: [
      {
        quote: 'I started with my own home loan and kept the commission. Now I refer clients every week.',
        author: 'Priya Nair',
        role: 'CA · Mumbai',
        earnings: '₹4.2L earned',
        initials: 'PN',
      },
      {
        quote: 'Tracking every case in one place means I never chase lenders for updates.',
        author: 'Karan Malhotra',
        role: 'Independent DSA · Delhi',
        earnings: '₹9.8L earned',
        initials: 'KM',
      },
      {
        quote: 'Payouts arrive on time, and my clients get better rates than the branch offered.',
        author: 'Sana Sheikh',
        role: 'Real estate agent · Pune',
        earnings: '₹2.6L earned',
        initials: 'SS',
      },
    ] as StoryCard[],
  },

  faq: {
    monoLabel: 'FAQ',
    title: 'Questions,\nanswered.',
    items: [
      {
        question: 'Do I need KYC to become a partner?',
        answer: 'No. You can start referring clients right away. The lender handles verification when the loan is processed.',
      },
      {
        question: 'How and when do I get paid?',
        answer: 'Commissions are credited directly to your bank account every Friday via IMPS. Track every payout live in your dashboard.',
      },
      {
        question: 'Which loan products can I refer?',
        answer: 'Home Loans, Loan Against Property, Business Loans, and Personal Loans across all partner banks and NBFCs.',
      },
      {
        question: 'Is there any fee to join?',
        answer: 'No, joining JustRefer is 100% free with zero registration fees or maintenance charges. You keep 100% of your commission.',
      },
    ] as FAQItem[],
  },

  closingBand: {
    headline: 'Start earning from your first referral',
    subtext: 'Free to join. Zero KYC. Payouts tracked to the rupee.',
    cta: 'Become a Partner →',
  },

  footer: {
    tagline: "India's loan referral platform.\nRefer, track and get paid.",
    columns: [
      {
        title: 'PRODUCT',
        links: [
          { label: 'Home Loan', href: '#products' },
          { label: 'Loan Against Property', href: '#products' },
          { label: 'Business Loan', href: '#products' },
          { label: 'Personal Loan', href: '#products' },
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
    copyright: '© 2026 JustRefer. All rights reserved.',
    disclaimer:
      'Loans are sanctioned and disbursed by RBI-regulated banks and NBFCs. Commission rates shown are indicative.',
  },
} as const;
