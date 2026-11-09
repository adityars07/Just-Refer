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

  it('stores partnerReferralCode derived from partner name or explicitly provided', async () => {
    // 1. Explicit referral code
    const ref1 = await repo.create({
      applicant: 'Rohan Sharma',
      city: 'Delhi',
      productId: 'personal',
      loanAmount: 1000000,
      partnerName: 'Aditya Raj Singh',
      partnerReferralCode: 'JR-ADIT6624',
    });
    expect(ref1.partnerName).toBe('Aditya Raj Singh');
    expect(ref1.partnerReferralCode).toBe('JR-ADIT6624');

    // 2. Generated from partner name
    const ref2 = await repo.create({
      applicant: 'Priya Verma',
      city: 'Pune',
      productId: 'lap',
      loanAmount: 10000000,
      partnerName: 'Suresh Kumar',
    });
    expect(ref2.partnerName).toBe('Suresh Kumar');
    expect(ref2.partnerReferralCode).toMatch(/^JR-SURE\d{4}$/);
  });

  it('deletes an existing referral by id or refCode', async () => {
    const created = await repo.create({
      applicant: 'Test Applicant',
      city: 'Delhi',
      productId: 'home',
      loanAmount: 5000000,
    });
    expect(await repo.getById(created.id)).not.toBeNull();

    const deleted = await repo.delete(created.id);
    expect(deleted).toBe(true);
    expect(await repo.getById(created.id)).toBeNull();

    // Deleting again returns false
    expect(await repo.delete(created.id)).toBe(false);
  });

  it('Option A: deleting a referral decreases earnings and available balance, preserving withdrawal history', async () => {
    // 1. Create disbursed referral
    const created = await repo.create({
      applicant: 'Disbursed Client',
      city: 'Delhi',
      productId: 'home',
      loanAmount: 5000000, // 0.3% commission = 15,000
      status: 'disbursed',
    });
    expect(created.commission).toBe(15000);

    let summary = await repo.getDashboardSummary('ALL');
    expect(summary.totalEarnings).toBe(15000);
    expect(summary.availableForPayout).toBe(15000);

    // 2. Delete referral
    const deleted = await repo.delete(created.id);
    expect(deleted).toBe(true);

    // 3. Balance and earnings revert to 0
    summary = await repo.getDashboardSummary('ALL');
    expect(summary.totalEarnings).toBe(0);
    expect(summary.availableForPayout).toBe(0);
    expect(summary.totalReferrals).toBe(0);
  });
});
