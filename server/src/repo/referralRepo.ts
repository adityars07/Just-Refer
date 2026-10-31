import {
  Referral,
  DashboardSummary,
  RangeKey,
  LoanProductId,
} from '../../../shared/types.js';
import { calculateCommission, mapStatusFilter } from '../services/commission.js';

export interface ReferralFilter {
  status?: string;
  range?: string;
  page?: number;
  pageSize?: number;
}

export interface ReferralQueryResult {
  items: Referral[];
  total: number;
  counts: {
    all: number;
    pending: number;
    approved: number;
  };
}

export interface ReferralRepo {
  getAll(filter?: ReferralFilter): Promise<ReferralQueryResult>;
  create(data: {
    applicant: string;
    phone?: string;
    city: string;
    productId: LoanProductId;
    loanAmount: number;
  }): Promise<Referral>;
  getDashboardSummary(range?: RangeKey): Promise<DashboardSummary>;
}

export class InMemoryReferralRepo implements ReferralRepo {
  private referrals: Referral[] = [];
  private sequence = 1000;

  async getAll(filter: ReferralFilter = {}): Promise<ReferralQueryResult> {
    const all = this.referrals;

    const pendingStatuses = ['in_login', 'underwriting', 'sanctioned'];
    const approvedStatuses = ['disbursed'];

    const pendingCount = all.filter(r => pendingStatuses.includes(r.status)).length;
    const approvedCount = all.filter(r => approvedStatuses.includes(r.status)).length;
    const allCount = all.length;

    let filtered = [...all];
    const allowedStatuses = mapStatusFilter(filter.status);
    if (allowedStatuses) {
      filtered = filtered.filter(r => allowedStatuses.includes(r.status));
    }

    // Sort by createdAt descending
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const page = Math.max(1, filter.page || 1);
    const pageSize = Math.max(1, filter.pageSize || 20);
    const startIndex = (page - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    return {
      items: paginated,
      total: filtered.length,
      counts: {
        all: allCount,
        pending: pendingCount,
        approved: approvedCount,
      },
    };
  }

  async create(data: {
    applicant: string;
    phone?: string;
    city: string;
    productId: LoanProductId;
    loanAmount: number;
  }): Promise<Referral> {
    this.sequence += 1;
    const id = `ref_${Date.now()}_${this.sequence}`;
    const prefixMap: Record<LoanProductId, string> = {
      home: 'HL',
      lap: 'LAP',
      personal: 'PL',
      business: 'BL',
    };
    const refCode = `${prefixMap[data.productId] || 'JR'}-${this.sequence}`;
    const commission = calculateCommission(data.productId, data.loanAmount);

    const newReferral: Referral = {
      id,
      refCode,
      applicant: data.applicant,
      phone: data.phone,
      city: data.city,
      productId: data.productId,
      loanAmount: data.loanAmount,
      commission,
      status: 'in_login',
      createdAt: new Date().toISOString(),
    };

    this.referrals.unshift(newReferral);
    return newReferral;
  }

  async getDashboardSummary(range: RangeKey = 'ALL'): Promise<DashboardSummary> {
    const all = this.referrals;
    const pendingStatuses = ['in_login', 'underwriting', 'sanctioned'];
    const approvedStatuses = ['disbursed'];

    const pending = all.filter(r => pendingStatuses.includes(r.status)).length;
    const approved = all.filter(r => approvedStatuses.includes(r.status)).length;

    const pipeline = {
      inLogin: all.filter(r => r.status === 'in_login').length,
      underwriting: all.filter(r => r.status === 'underwriting').length,
      sanctioned: all.filter(r => r.status === 'sanctioned').length,
      disbursed: all.filter(r => r.status === 'disbursed').length,
    };

    const totalEarnings = all
      .filter(r => r.status === 'disbursed')
      .reduce((sum, r) => sum + r.commission, 0);

    const availableForPayout = totalEarnings;

    // Series is empty for initial user as required by spec:
    // "A brand-new user returns zeros and an empty series."
    const series: Array<{ date: string; value: number }> = [];

    return {
      range,
      totalEarnings,
      availableForPayout,
      totalReferrals: all.length,
      pending,
      approved,
      pipeline,
      series,
      nextPayout: totalEarnings > 0 ? {
        amount: totalEarnings,
        scheduledFor: 'Friday',
        method: 'IMPS/UPI',
      } : undefined,
    };
  }
}

export const referralRepo = new InMemoryReferralRepo();
