import {
  AdminSummary,
  AdminReferral,
  PayoutRun,
  AttentionItem,
  LoanProductId,
} from '../../../shared/types.js';
import { ReferralRepo, referralRepo } from './referralRepo.js';

const PRODUCT_NAME_MAP: Record<LoanProductId, string> = {
  home: 'Home Loan',
  lap: 'Loan Against Property',
  personal: 'Personal Loan',
  business: 'Business Loan',
};

const DEFAULT_LENDER_MAP: Record<LoanProductId, string> = {
  home: 'HDFC Bank',
  lap: 'Bajaj Finserv',
  personal: 'IDFC FIRST',
  business: 'IIFL Finance',
};

export interface AdminRepo {
  getSummary(): Promise<AdminSummary>;
  getReferrals(filter?: { status?: string; page?: number; pageSize?: number }): Promise<{ items: AdminReferral[]; total: number }>;
  getNextPayoutRun(): Promise<PayoutRun | null>;
  setNextPayoutRun(run: PayoutRun | null): Promise<void>;
  getAttentionItems(): Promise<AttentionItem[]>;
}

export class InMemoryAdminRepo implements AdminRepo {
  private referralRepo: ReferralRepo;
  private nextPayoutRun: PayoutRun | null = null;

  constructor(refRepo: ReferralRepo = referralRepo) {
    this.referralRepo = refRepo;
  }

  async getSummary(): Promise<AdminSummary> {
    const all = await this.referralRepo.getAllReferrals();
    const nowMs = Date.now();
    const ms30d = 30 * 24 * 60 * 60 * 1000;
    const last30dCutoff = new Date(nowMs - ms30d).getTime();
    const prev30dCutoff = new Date(nowMs - 2 * ms30d).getTime();

    const disbursed = all.filter(r => r.status === 'disbursed');

    let disbursed30d = 0;
    let prevDisbursed30d = 0;

    for (const r of disbursed) {
      const amt = r.disbursedAmount || r.loanAmount;
      const t = new Date(r.disbursedAt || r.createdAt).getTime();
      if (t >= last30dCutoff) {
        disbursed30d += amt;
      } else if (t >= prev30dCutoff) {
        prevDisbursed30d += amt;
      }
    }

    let disbursedChangePct: number | null = null;
    if (prevDisbursed30d > 0) {
      disbursedChangePct = Math.round(((disbursed30d - prevDisbursed30d) / prevDisbursed30d) * 1000) / 10;
    }

    // Only count unpaid commissions
    const commissionPayable = disbursed
      .filter(r => !r.payoutPaid)
      .reduce((sum, r) => sum + (r.commission || 0), 0);

    const partnerSet = new Set<string>();
    for (const r of all) {
      if (r.partnerName) partnerSet.add(r.partnerName);
    }
    const activePartners = partnerSet.size;

    const openReferrals = all.filter(r =>
      ['in_login', 'underwriting', 'sanctioned'].includes(r.status)
    ).length;

    return {
      disbursed30d,
      disbursedChangePct,
      commissionPayable,
      activePartners,
      openReferrals,
    };
  }

  async getReferrals(filter: { status?: string; page?: number; pageSize?: number } = {}): Promise<{ items: AdminReferral[]; total: number }> {
    const all = await this.referralRepo.getAllReferrals();

    let filtered = [...all];
    if (filter.status && filter.status !== 'all') {
      filtered = filtered.filter(r => r.status === filter.status);
    }

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = filtered.length;
    const page = Math.max(1, filter.page || 1);
    const pageSize = Math.max(1, filter.pageSize || 6);
    const startIndex = (page - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    const items: AdminReferral[] = paginated.map(r => ({
      id: r.id,
      refCode: r.refCode,
      applicant: r.applicant,
      partnerName: r.partnerName || 'Partner',
      productName: PRODUCT_NAME_MAP[r.productId] || r.productId,
      lender: r.lender || DEFAULT_LENDER_MAP[r.productId] || 'Bank',
      loanAmount: r.loanAmount,
      commission: r.commission,
      status: r.status,
      sanctionedAmount: r.sanctionedAmount,
      disbursedAmount: r.disbursedAmount,
      disbursedAt: r.disbursedAt,
      rejectionReason: r.rejectionReason,
      payoutPaid: r.payoutPaid,
      payoutDetails: r.payoutDetails,
      history: r.history,
    }));

    return { items, total };
  }

  async getNextPayoutRun(): Promise<PayoutRun | null> {
    return this.nextPayoutRun ? { ...this.nextPayoutRun } : null;
  }

  async setNextPayoutRun(run: PayoutRun | null): Promise<void> {
    this.nextPayoutRun = run;
  }

  async getAttentionItems(): Promise<AttentionItem[]> {
    const all = await this.referralRepo.getAllReferrals();
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).getTime();
    const stuckUnderwriting = all.filter(r => r.status === 'underwriting' && new Date(r.createdAt).getTime() < fiveDaysAgo).length;

    return [
      { key: 'kyc_pending', count: 0 },
      { key: 'stuck_underwriting', count: stuckUnderwriting },
      { key: 'payouts_on_hold', count: 0 },
    ];
  }
}

export const adminRepo = new InMemoryAdminRepo();

