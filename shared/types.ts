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

export interface StatusHistoryEntry {
  admin: string;
  timestamp: string; // ISO date
  fromStage: ReferralStatus;
  toStage: ReferralStatus;
  note?: string;
}

export interface PayoutDetails {
  amount: number;
  paidAt: string;
  reference: string;
  admin?: string;
}

export interface Referral {
  id: string;
  refCode: string;
  applicant: string;
  phone?: string;
  city: string;
  productId: LoanProductId;
  lender?: string;
  partnerName?: string;
  partnerReferralCode?: string;
  loanAmount: number;
  commission: number;
  status: ReferralStatus;
  createdAt: string; // ISO date
  sanctionedAmount?: number;
  disbursedAmount?: number;
  disbursedAt?: string;
  rejectionReason?: string;
  payoutPaid?: boolean;
  payoutDetails?: PayoutDetails;
  history?: StatusHistoryEntry[];
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

export interface BankAccount {
  partnerId: string;
  holderName: string;
  accountNumberMasked: string;
  ifsc: string;
  bankName?: string;
  updatedAt: string;
}

export type WithdrawalStatus = 'requested' | 'processing' | 'paid' | 'rejected';

export interface Withdrawal {
  id: string;
  partnerId: string;
  partnerName?: string;
  amount: number;
  status: WithdrawalStatus;
  bankSnapshot: {
    holderName: string;
    accountNumberMasked: string;
    ifsc: string;
    bankName?: string;
  };
  utr?: string;
  rejectReason?: string;
  requestedAt: string;
  updatedAt: string;
  history?: Array<{
    admin: string;
    timestamp: string;
    fromStatus: string;
    toStatus: string;
    note?: string;
  }>;
}

// ─────────────────────────────────────────────
// Admin Dashboard Types (Section 4.2)
// ─────────────────────────────────────────────
export interface AdminSummary {
  disbursed30d: number;              // rupees, integer
  disbursedChangePct: number | null; // vs previous 30 days; null when previous period is 0
  commissionPayable: number;         // rupees
  activePartners: number;
  openReferrals: number;             // in_login + underwriting + sanctioned
}

export interface AdminReferral {
  id: string;
  refCode: string;
  applicant: string;
  partnerName: string;
  partnerReferralCode?: string;
  productName: string;
  lender: string;
  loanAmount: number;
  commission: number;
  status: ReferralStatus;
  sanctionedAmount?: number;
  disbursedAmount?: number;
  disbursedAt?: string;
  rejectionReason?: string;
  payoutPaid?: boolean;
  payoutDetails?: PayoutDetails;
  history?: StatusHistoryEntry[];
}

export interface PayoutRun {
  id: string;
  scheduledFor: string;   // ISO date (a Friday)
  totalAmount: number;
  partnerCount: number;
  method: 'IMPS/UPI';
  status: 'awaiting_approval' | 'approved' | 'released';
}

export interface AttentionItem {
  key: 'kyc_pending' | 'stuck_underwriting' | 'payouts_on_hold';
  count: number;          // labels and links are static UI constants, not API data
}

// ─────────────────────────────────────────────
// Public Landing Page Types
// ─────────────────────────────────────────────
export interface PublicStats {
  totalDisbursed?: number;
  payoutDisbursedPct?: number;
  lendingPartners?: number;
  timeToRefer?: string;
}

export interface PublicProduct {
  id: LoanProductId;
  name: string;
  minAmountLabel: string;
  startingRatePct: number;
  payoutPct: number;
  examplePayoutLabel: string;
  iconColor: string;
}

export interface PublicLender {
  name: string;
  shortName: string;
}

export interface PublicTestimonial {
  id: string;
  name: string;
  initials?: string;
  role: string;
  city: string;
  quote: string;
  product: string;
  earnings?: string;
}
