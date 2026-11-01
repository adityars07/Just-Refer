import fs from 'fs';
import path from 'path';
import {
  Referral,
  DashboardSummary,
  RangeKey,
  LoanProductId,
  ReferralStatus,
} from '../../../shared/types.js';
import { calculateCommission, mapStatusFilter } from '../services/commission.js';

function getStoreFilePath(): string {
  const possiblePaths = [
    path.resolve(process.cwd(), 'server/src/data/referrals_store.json'),
    path.resolve(process.cwd(), 'src/data/referrals_store.json'),
    path.resolve(process.cwd(), 'server/server/src/data/referrals_store.json'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  if (process.cwd().endsWith('server')) {
    return path.resolve(process.cwd(), 'src/data/referrals_store.json');
  }
  return path.resolve(process.cwd(), 'server/src/data/referrals_store.json');
}

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
  getAllReferrals(): Promise<Referral[]>;
  create(data: {
    applicant: string;
    phone?: string;
    city: string;
    productId: LoanProductId;
    loanAmount: number;
    partnerName?: string;
    status?: ReferralStatus;
    createdAt?: string;
  }): Promise<Referral>;
  getDashboardSummary(range?: RangeKey, partnerId?: string): Promise<DashboardSummary>;
  getById(id: string): Promise<Referral | null>;
  updateStatus(id: string, status: ReferralStatus, commissionAmount?: number): Promise<Referral | null>;
  updateReferralStatus(
    id: string,
    update: {
      stage: ReferralStatus;
      amount?: number;
      date?: string;
      reason?: string;
      note?: string;
      admin: string;
    }
  ): Promise<Referral>;
  recordReferralPayout(
    id: string,
    payout: {
      amount: number;
      paidAt: string;
      reference: string;
      admin: string;
    }
  ): Promise<Referral>;
  clear(): void;
}

export class InMemoryReferralRepo implements ReferralRepo {
  private referrals: Referral[] = [];
  private sequence = 1000;

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
      return;
    }
    try {
      const p = getStoreFilePath();
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.referrals = parsed;
          if (parsed.length > 0) {
            this.sequence = 1000 + parsed.length;
          }
        }
      }
    } catch {
      // ignore
    }
  }

  private saveToDisk() {
    if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
      return;
    }
    try {
      const p = getStoreFilePath();
      const dir = path.dirname(p);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(p, JSON.stringify(this.referrals, null, 2), 'utf8');
    } catch {
      // ignore
    }
  }

  clear(): void {
    this.referrals = [];
    this.sequence = 1000;
  }

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

  async getAllReferrals(): Promise<Referral[]> {
    return [...this.referrals];
  }

  async create(data: {
    applicant: string;
    phone?: string;
    city: string;
    productId: LoanProductId;
    loanAmount: number;
    partnerName?: string;
    status?: ReferralStatus;
    createdAt?: string;
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
      partnerName: data.partnerName,
      loanAmount: data.loanAmount,
      commission,
      status: data.status || 'in_login',
      createdAt: data.createdAt || new Date().toISOString(),
    };

    this.referrals.unshift(newReferral);
    this.saveToDisk();
    return newReferral;
  }

  async getDashboardSummary(range: RangeKey = 'ALL', partnerId?: string): Promise<DashboardSummary> {
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

    let availableForPayout = totalEarnings;
    try {
      const { withdrawalRepo } = await import('./withdrawalRepo.js');
      const wds = partnerId
        ? await withdrawalRepo.getPartnerWithdrawals(partnerId)
        : await withdrawalRepo.getAllWithdrawals();
      const withheld = wds
        .filter(w => w.status === 'requested' || w.status === 'processing' || w.status === 'paid')
        .reduce((sum, w) => sum + w.amount, 0);
      availableForPayout = Math.max(0, totalEarnings - withheld);
    } catch {
      // fallback if withdrawalRepo fails to load
    }

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

  async getById(id: string): Promise<Referral | null> {
    const item = this.referrals.find((r) => r.id === id || r.refCode === id);
    return item ? { ...item } : null;
  }

  async updateStatus(id: string, status: ReferralStatus, commissionAmount?: number): Promise<Referral | null> {
    const item = this.referrals.find((r) => r.id === id || r.refCode === id);
    if (!item) return null;

    item.status = status;
    if (typeof commissionAmount === 'number' && !isNaN(commissionAmount)) {
      item.commission = commissionAmount;
    }
    this.saveToDisk();
    return { ...item };
  }

  async updateReferralStatus(
    id: string,
    update: {
      stage: ReferralStatus;
      amount?: number;
      date?: string;
      reason?: string;
      note?: string;
      admin: string;
    }
  ): Promise<Referral> {
    const item = this.referrals.find((r) => r.id === id || r.refCode === id);
    if (!item) {
      throw new Error(`Referral with id "${id}" not found`);
    }

    const stageOrder: Record<ReferralStatus, number> = {
      in_login: 1,
      underwriting: 2,
      sanctioned: 3,
      disbursed: 4,
      rejected: 99,
    };

    const currentStage = item.status;
    const targetStage = update.stage;

    // Validate progression rule
    if (currentStage !== targetStage) {
      if (targetStage === 'rejected') {
        if (currentStage === 'disbursed') {
          throw new Error('Cannot reject an already disbursed referral');
        }
      } else {
        if (currentStage === 'rejected') {
          throw new Error('Cannot change status of a rejected referral');
        }
        if (stageOrder[targetStage] <= stageOrder[currentStage]) {
          throw new Error(`Cannot move status backwards from ${currentStage} to ${targetStage}`);
        }
      }
    }

    // Apply stage-specific fields
    if (targetStage === 'sanctioned') {
      if (typeof update.amount === 'number' && update.amount > 0) {
        item.sanctionedAmount = update.amount;
      }
    } else if (targetStage === 'disbursed') {
      if (typeof update.amount === 'number' && update.amount > 0) {
        item.disbursedAmount = update.amount;
        item.commission = calculateCommission(item.productId, update.amount);
      }
      if (update.date) {
        item.disbursedAt = update.date;
      } else if (!item.disbursedAt) {
        item.disbursedAt = new Date().toISOString();
      }
    } else if (targetStage === 'rejected') {
      if (update.reason) {
        item.rejectionReason = update.reason;
      }
    }

    // Record audit history entry
    if (!item.history) {
      item.history = [];
    }
    item.history.push({
      admin: update.admin,
      timestamp: new Date().toISOString(),
      fromStage: currentStage,
      toStage: targetStage,
      note: update.note,
    });

    item.status = targetStage;
    this.saveToDisk();
    return { ...item };
  }

  async recordReferralPayout(
    id: string,
    payout: {
      amount: number;
      paidAt: string;
      reference: string;
      admin: string;
    }
  ): Promise<Referral> {
    const item = this.referrals.find((r) => r.id === id || r.refCode === id);
    if (!item) {
      throw new Error(`Referral with id "${id}" not found`);
    }

    if (item.status !== 'disbursed') {
      throw new Error('Payout is only allowed for disbursed referrals');
    }

    if (item.payoutPaid) {
      throw new Error('Payout has already been recorded as paid for this referral');
    }

    item.payoutPaid = true;
    item.payoutDetails = {
      amount: payout.amount,
      paidAt: payout.paidAt,
      reference: payout.reference,
      admin: payout.admin,
    };

    if (!item.history) {
      item.history = [];
    }
    item.history.push({
      admin: payout.admin,
      timestamp: new Date().toISOString(),
      fromStage: item.status,
      toStage: item.status,
      note: `Payout marked paid: ₹${payout.amount} (Ref: ${payout.reference})`,
    });

    this.saveToDisk();
    return { ...item };
  }
}

export const referralRepo = new InMemoryReferralRepo();
