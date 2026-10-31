import { describe, it, expect } from 'vitest';
import { calculateCommission } from '../services/commission.js';

describe('Commission Calculation Service', () => {
  it('calculates 0.3% payout accurately for Home Loan', () => {
    expect(calculateCommission('home', 5000000)).toBe(15000); // 50L -> 15k
    expect(calculateCommission('home', 7500000)).toBe(22500); // 75L -> 22.5k
    expect(calculateCommission('home', 10000000)).toBe(30000); // 1Cr -> 30k
  });

  it('calculates 0.5% payout accurately for Loan Against Property (LAP)', () => {
    expect(calculateCommission('lap', 10000000)).toBe(50000); // 1Cr -> 50k
    expect(calculateCommission('lap', 15000000)).toBe(75000); // 1.5Cr -> 75k
  });

  it('calculates 1.0% payout accurately for Personal Loan', () => {
    expect(calculateCommission('personal', 500000)).toBe(5000); // 5L -> 5k
    expect(calculateCommission('personal', 1000000)).toBe(10000); // 10L -> 10k
  });

  it('calculates 1.0% payout accurately for Business Loan', () => {
    expect(calculateCommission('business', 1000000)).toBe(10000); // 10L -> 10k
    expect(calculateCommission('business', 2500000)).toBe(25000); // 25L -> 25k
  });

  it('returns 0 for zero or negative loan amounts', () => {
    expect(calculateCommission('home', 0)).toBe(0);
    expect(calculateCommission('business', -50000)).toBe(0);
  });

  it('throws an error for unrecognized product IDs', () => {
    expect(() => calculateCommission('car' as any, 1000000)).toThrow();
  });
});
