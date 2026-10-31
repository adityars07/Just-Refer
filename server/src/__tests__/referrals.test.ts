import { describe, it, expect, beforeEach } from 'vitest';
import { mapStatusFilter } from '../services/commission.js';
import { InMemoryReferralRepo } from '../repo/referralRepo.js';

describe('Status Filter Mapping', () => {
  it('maps "pending" to in_login, underwriting, and sanctioned', () => {
    expect(mapStatusFilter('pending')).toEqual(['in_login', 'underwriting', 'sanctioned']);
    expect(mapStatusFilter('Pending')).toEqual(['in_login', 'underwriting', 'sanctioned']);
  });

  it('maps "approved" to disbursed', () => {
    expect(mapStatusFilter('approved')).toEqual(['disbursed']);
    expect(mapStatusFilter('Approved')).toEqual(['disbursed']);
  });

  it('returns null for "all", empty string, or undefined', () => {
    expect(mapStatusFilter('all')).toBeNull();
    expect(mapStatusFilter('ALL')).toBeNull();
    expect(mapStatusFilter('')).toBeNull();
    expect(mapStatusFilter(undefined)).toBeNull();
  });
});

describe('InMemoryReferralRepo', () => {
  let repo: InMemoryReferralRepo;

  beforeEach(() => {
    repo = new InMemoryReferralRepo();
  });

  it('starts with an empty referral set for a brand new user', async () => {
    const list = await repo.getAll();
    expect(list.total).toBe(0);
    expect(list.items).toHaveLength(0);
    expect(list.counts).toEqual({ all: 0, pending: 0, approved: 0 });

    const summary = await repo.getDashboardSummary('ALL');
    expect(summary.totalEarnings).toBe(0);
    expect(summary.availableForPayout).toBe(0);
    expect(summary.totalReferrals).toBe(0);
    expect(summary.pending).toBe(0);
    expect(summary.approved).toBe(0);
    expect(summary.series).toHaveLength(0);
  });

  it('creates a referral with correct commission and status in_login', async () => {
    const created = await repo.create({
      applicant: 'Kavita Patel',
      phone: '9876543210',
      city: 'Mumbai',
      productId: 'home',
      loanAmount: 5000000,
    });

    expect(created.id).toBeDefined();
    expect(created.refCode).toMatch(/^HL-\d+$/);
    expect(created.status).toBe('in_login');
    expect(created.commission).toBe(15000); // 0.3% of 50L

    const list = await repo.getAll();
    expect(list.total).toBe(1);
    expect(list.counts.all).toBe(1);
    expect(list.counts.pending).toBe(1);
    expect(list.counts.approved).toBe(0);

    const pendingOnly = await repo.getAll({ status: 'pending' });
    expect(pendingOnly.items).toHaveLength(1);

    const approvedOnly = await repo.getAll({ status: 'approved' });
    expect(approvedOnly.items).toHaveLength(0);
  });
});
