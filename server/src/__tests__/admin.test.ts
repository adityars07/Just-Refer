import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryAdminRepo } from '../repo/adminRepo.js';
import { InMemoryReferralRepo } from '../repo/referralRepo.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { requireUser } from '../middleware/requireUser.js';

// Helper compact INR formatter for test validation
function formatCompactINR(amount: number): string {
  if (amount === 0) return '₹0';
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2);
    return `₹${cr} Cr`;
  }
  if (amount >= 100000) {
    const l = (amount / 100000).toFixed(2);
    return `₹${l} L`;
  }
  return `₹${new Intl.NumberFormat('en-IN').format(amount)}`;
}

// Mock Express response helper
function createMockRes() {
  const res: any = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    body: null as any,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(data: any) {
      this.body = data;
      return this;
    },
    setHeader(key: string, val: string) {
      this.headers[key] = val;
    },
  };
  return res;
}

describe('Admin Dashboard Repository & Logic', () => {
  let referralRepo: InMemoryReferralRepo;
  let adminRepo: InMemoryAdminRepo;

  beforeEach(() => {
    referralRepo = new InMemoryReferralRepo();
    referralRepo.clear();
    adminRepo = new InMemoryAdminRepo(referralRepo);
  });

  describe('Empty Database Responses (Section 5)', () => {
    it('returns honest zeros, null delta, and null payout run on empty store', async () => {
      const summary = await adminRepo.getSummary();
      expect(summary).toEqual({
        disbursed30d: 0,
        disbursedChangePct: null,
        commissionPayable: 0,
        activePartners: 0,
        openReferrals: 0,
      });

      const referrals = await adminRepo.getReferrals({ status: 'all' });
      expect(referrals.total).toBe(0);
      expect(referrals.items).toHaveLength(0);

      const nextRun = await adminRepo.getNextPayoutRun();
      expect(nextRun).toBeNull();

      const attention = await adminRepo.getAttentionItems();
      expect(attention).toHaveLength(3);
      expect(attention[0]).toEqual({ key: 'kyc_pending', count: 0 });
      expect(attention[1]).toEqual({ key: 'stuck_underwriting', count: 0 });
      expect(attention[2]).toEqual({ key: 'payouts_on_hold', count: 0 });
    });
  });

  describe('disbursedChangePct and openReferrals calculation', () => {
    it('returns null for disbursedChangePct when previous 30 days is 0', async () => {
      await referralRepo.create({
        applicant: 'Test Applicant',
        city: 'Mumbai',
        productId: 'personal',
        loanAmount: 1000000,
        status: 'disbursed',
        createdAt: new Date().toISOString(),
      });

      const summary = await adminRepo.getSummary();
      expect(summary.disbursed30d).toBe(1000000);
      expect(summary.disbursedChangePct).toBeNull();
    });

    it('calculates positive and negative disbursedChangePct accurately when previous period has records', async () => {
      const now = Date.now();
      const fortyDaysAgo = new Date(now - 40 * 24 * 60 * 60 * 1000).toISOString();
      const fiveDaysAgo = new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString();

      // Previous period: 10,00,000
      await referralRepo.create({
        applicant: 'Past Applicant',
        city: 'Delhi',
        productId: 'personal',
        loanAmount: 1000000,
        status: 'disbursed',
        createdAt: fortyDaysAgo,
      });

      // Current period: 12,00,000 (+20%)
      await referralRepo.create({
        applicant: 'Recent Applicant',
        city: 'Delhi',
        productId: 'personal',
        loanAmount: 1200000,
        status: 'disbursed',
        createdAt: fiveDaysAgo,
      });

      const summary = await adminRepo.getSummary();
      expect(summary.disbursed30d).toBe(1200000);
      expect(summary.disbursedChangePct).toBe(20.0);
    });

    it('counts openReferrals as exactly in_login + underwriting + sanctioned', async () => {
      await referralRepo.create({
        applicant: 'App 1',
        city: 'Mumbai',
        productId: 'home',
        loanAmount: 5000000,
        status: 'in_login',
      });
      await referralRepo.create({
        applicant: 'App 2',
        city: 'Pune',
        productId: 'lap',
        loanAmount: 10000000,
        status: 'underwriting',
      });
      await referralRepo.create({
        applicant: 'App 3',
        city: 'Delhi',
        productId: 'business',
        loanAmount: 2500000,
        status: 'sanctioned',
      });
      await referralRepo.create({
        applicant: 'App 4',
        city: 'Bengaluru',
        productId: 'personal',
        loanAmount: 500000,
        status: 'disbursed',
      });
      await referralRepo.create({
        applicant: 'App 5',
        city: 'Chennai',
        productId: 'personal',
        loanAmount: 300000,
        status: 'rejected',
      });

      const summary = await adminRepo.getSummary();
      expect(summary.openReferrals).toBe(3);
    });

    it('filters referrals by status correctly', async () => {
      await referralRepo.create({
        applicant: 'App InLogin',
        city: 'Mumbai',
        productId: 'home',
        loanAmount: 5000000,
        status: 'in_login',
      });
      await referralRepo.create({
        applicant: 'App Disbursed',
        city: 'Pune',
        productId: 'lap',
        loanAmount: 10000000,
        status: 'disbursed',
      });

      const all = await adminRepo.getReferrals({ status: 'all' });
      expect(all.total).toBe(2);

      const inLogin = await adminRepo.getReferrals({ status: 'in_login' });
      expect(inLogin.total).toBe(1);
      expect(inLogin.items[0].status).toBe('in_login');

      const sanctioned = await adminRepo.getReferrals({ status: 'sanctioned' });
      expect(sanctioned.total).toBe(0);
      expect(sanctioned.items).toHaveLength(0);
    });
  });

  describe('Compact INR Formatter', () => {
    it('formats ₹0 correctly', () => {
      expect(formatCompactINR(0)).toBe('₹0');
    });

    it('formats values >= 1 Crore with Cr suffix', () => {
      expect(formatCompactINR(157000000)).toBe('₹15.70 Cr');
      expect(formatCompactINR(10000000)).toBe('₹1.00 Cr');
    });

    it('formats values >= 1 Lakh with L suffix', () => {
      expect(formatCompactINR(250000)).toBe('₹2.50 L');
      expect(formatCompactINR(942000)).toBe('₹9.42 L');
    });

    it('formats values < 1 Lakh with standard Indian grouping', () => {
      expect(formatCompactINR(50000)).toBe('₹50,000');
    });
  });

  describe('Manual Status Update & Progression Rules', () => {
    it('progresses forward through stages and saves history', async () => {
      const ref = await referralRepo.create({
        applicant: 'Rohit Sharma',
        city: 'Mumbai',
        productId: 'home',
        loanAmount: 5000000,
        status: 'in_login',
      });

      // 1. Move to underwriting
      const u1 = await referralRepo.updateReferralStatus(ref.id, {
        stage: 'underwriting',
        admin: 'Admin User',
        note: 'Documents submitted to lender',
      });
      expect(u1.status).toBe('underwriting');
      expect(u1.history).toHaveLength(1);
      expect(u1.history![0]).toMatchObject({
        admin: 'Admin User',
        fromStage: 'in_login',
        toStage: 'underwriting',
        note: 'Documents submitted to lender',
      });

      // 2. Move to sanctioned with sanctioned amount
      const u2 = await referralRepo.updateReferralStatus(ref.id, {
        stage: 'sanctioned',
        amount: 4500000,
        admin: 'Admin User',
        note: 'Sanction letter issued',
      });
      expect(u2.status).toBe('sanctioned');
      expect(u2.sanctionedAmount).toBe(4500000);
      expect(u2.history).toHaveLength(2);

      // 3. Move to disbursed with disbursed amount and date
      const u3 = await referralRepo.updateReferralStatus(ref.id, {
        stage: 'disbursed',
        amount: 4500000,
        date: '2026-11-01',
        admin: 'Admin User',
        note: 'Disbursement complete',
      });
      expect(u3.status).toBe('disbursed');
      expect(u3.disbursedAmount).toBe(4500000);
      expect(u3.disbursedAt).toBe('2026-11-01');
      expect(u3.history).toHaveLength(3);
    });

    it('prevents backward stage transition', async () => {
      const ref = await referralRepo.create({
        applicant: 'Anita Roy',
        city: 'Kolkata',
        productId: 'personal',
        loanAmount: 500000,
        status: 'sanctioned',
      });

      await expect(
        referralRepo.updateReferralStatus(ref.id, {
          stage: 'underwriting',
          admin: 'Admin User',
        })
      ).rejects.toThrow(/Cannot move status backwards/);

      await expect(
        referralRepo.updateReferralStatus(ref.id, {
          stage: 'in_login',
          admin: 'Admin User',
        })
      ).rejects.toThrow(/Cannot move status backwards/);
    });

    it('allows rejection from in_login, underwriting, sanctioned, and records reason', async () => {
      const ref = await referralRepo.create({
        applicant: 'Devendra Patel',
        city: 'Ahmedabad',
        productId: 'business',
        loanAmount: 2000000,
        status: 'underwriting',
      });

      const updated = await referralRepo.updateReferralStatus(ref.id, {
        stage: 'rejected',
        reason: 'Low CIBIL score',
        admin: 'Admin User',
      });

      expect(updated.status).toBe('rejected');
      expect(updated.rejectionReason).toBe('Low CIBIL score');
      expect(updated.history).toHaveLength(1);
      expect(updated.history![0].toStage).toBe('rejected');

      // Cannot modify once rejected
      await expect(
        referralRepo.updateReferralStatus(ref.id, {
          stage: 'in_login',
          admin: 'Admin User',
        })
      ).rejects.toThrow(/Cannot change status of a rejected referral/);
    });

    it('prevents rejecting an already disbursed referral', async () => {
      const ref = await referralRepo.create({
        applicant: 'Sunil Rao',
        city: 'Bengaluru',
        productId: 'lap',
        loanAmount: 15000000,
        status: 'disbursed',
      });

      await expect(
        referralRepo.updateReferralStatus(ref.id, {
          stage: 'rejected',
          admin: 'Admin User',
        })
      ).rejects.toThrow(/Cannot reject an already disbursed referral/);
    });

    it('records payout only for disbursed referrals and only once, reducing commissionPayable', async () => {
      const ref = await referralRepo.create({
        applicant: 'Vikram Joshi',
        city: 'Jaipur',
        productId: 'home',
        loanAmount: 5000000,
        status: 'sanctioned',
      });

      // Payout before disbursed is rejected
      await expect(
        referralRepo.recordReferralPayout(ref.id, {
          amount: 15000,
          paidAt: '2026-11-01',
          reference: 'UTR112233',
          admin: 'Admin User',
        })
      ).rejects.toThrow(/Payout is only allowed for disbursed referrals/);

      // Disburse referral
      await referralRepo.updateReferralStatus(ref.id, {
        stage: 'disbursed',
        amount: 5000000,
        date: '2026-11-01',
        admin: 'Admin User',
      });

      // Check summary: commissionPayable has increased
      let summary = await adminRepo.getSummary();
      expect(summary.commissionPayable).toBeGreaterThan(0);
      const prevPayable = summary.commissionPayable;

      // Now record payout
      const paid = await referralRepo.recordReferralPayout(ref.id, {
        amount: 15000,
        paidAt: '2026-11-01',
        reference: 'UTR112233',
        admin: 'Admin User',
      });

      expect(paid.payoutPaid).toBe(true);
      expect(paid.payoutDetails).toMatchObject({
        amount: 15000,
        paidAt: '2026-11-01',
        reference: 'UTR112233',
      });

      // Check summary: commissionPayable decreases
      summary = await adminRepo.getSummary();
      expect(summary.commissionPayable).toBe(prevPayable - (paid.commission || 0));

      // Attempting payout a second time must fail
      await expect(
        referralRepo.recordReferralPayout(ref.id, {
          amount: 15000,
          paidAt: '2026-11-01',
          reference: 'UTR445566',
          admin: 'Admin User',
        })
      ).rejects.toThrow(/Payout has already been recorded as paid/);
    });
  });
});

describe('Admin Auth & Access Control Middleware', () => {
  it('rejects unauthenticated requests in requireUser with 401', async () => {
    const req: any = { headers: {}, query: {} };
    const res = createMockRes();
    let nextCalled = false;

    await requireUser(req, res, () => { nextCalled = true; });

    expect(nextCalled).toBe(false);
    expect(res.statusCode).toBe(401);
    expect(res.body.error?.code).toBe('unauthorized');
  });

  it('rejects non-admin users in requireAdmin with 403 forbidden', () => {
    const req: any = {
      user: {
        name: 'Normal Partner',
        phone: '9999999999',
        roles: ['partner'],
      },
    };
    const res = createMockRes();
    let nextCalled = false;

    requireAdmin(req, res, () => { nextCalled = true; });

    expect(nextCalled).toBe(false);
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toEqual({
      code: 'forbidden',
      message: 'Admin access required',
    });
  });

  it('allows admin users in requireAdmin to pass to next()', () => {
    const req: any = {
      user: {
        name: 'Aditya Raj Singh (Admin)',
        phone: '7753999478',
        roles: ['partner', 'admin'],
      },
    };
    const res = createMockRes();
    let nextCalled = false;

    requireAdmin(req, res, () => { nextCalled = true; });

    expect(nextCalled).toBe(true);
    expect(res.statusCode).toBe(200);
  });
});
