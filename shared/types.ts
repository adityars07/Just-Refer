export type LoanProductId = 'home' | 'lap' | 'personal' | 'business';
export type ReferralStatus = 'in_login' | 'underwriting' | 'sanctioned' | 'disbursed' | 'rejected';
export type RangeKey = '1W' | '1M' | '3M' | '6M' | 'FY' | 'ALL';

export interface User {
  name: string;
  phone: string;
  phoneVerified: boolean;
  initials: string;
  dsaCode: string;
  referralCode: string;
  roles: Array<'partner' | 'admin'>;
}

export interface LoanProduct {
  id: LoanProductId;
  name: string;
  minAmountLabel: string;
  startingRatePct: number;
  payoutPct: number;
  lenders: string[];
  examplePayoutLabel: string;
  minAmountNum: number;
}

export interface Referral {
  id: string;
  refCode: string;
  applicant: string;
  phone?: string;
  city: string;
  productId: LoanProductId;
  lender?: string;
  loanAmount: number;
  commission: number;
  status: ReferralStatus;
  createdAt: string; // ISO date
}

export interface DashboardSummary {
  range: RangeKey;
  totalEarnings: number;
  availableForPayout: number;
  totalReferrals: number;
  pending: number;
  approved: number;
  pipeline: {
    inLogin: number;
    underwriting: number;
    sanctioned: number;
    disbursed: number;
  };
  series: Array<{ date: string; value: number }>;
  nextPayout?: {
    amount: number;
    scheduledFor: string;
    method: 'IMPS/UPI';
  };
}

export interface SettlementItem {
  refCode: string;
  applicant: string;
  productId: LoanProductId;
  loanAmount: number;
  ratePct: number;
  lender: string;
  commission: number;
  slabPct: number;
}

export interface Settlement {
  utr: string;
  netAmount: number;
  beneficiary: string;
  bankMasked: string;
  items: SettlementItem[];
}

export interface PartnerTestimonial {
  id: string;
  name: string;
  initials: string;
  city: string;
  role: string;
  product: string;
  tileClass: 'amber' | 'pink' | 'blue' | 'green';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
