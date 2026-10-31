import { LoanProductId } from '../../../shared/types.js';

export const COMMISSION_RATES: Record<LoanProductId, number> = {
  home: 0.3,
  lap: 0.5,
  personal: 1.0,
  business: 1.0,
};

export const MIN_LOAN_AMOUNTS: Record<LoanProductId, number> = {
  home: 5000000,     // 50 Lakhs
  lap: 10000000,    // 1 Crore
  personal: 500000,  // 5 Lakhs
  business: 1000000, // 10 Lakhs
};

/**
 * Calculates commission in whole rupees using integer arithmetic where possible.
 */
export function calculateCommission(productId: LoanProductId, loanAmount: number): number {
  if (loanAmount <= 0) return 0;
  const ratePct = COMMISSION_RATES[productId];
  if (ratePct === undefined) {
    throw new Error(`Invalid productId: ${productId}`);
  }
  // ratePct is e.g. 0.3 -> 3 / 1000
  // or 0.5 -> 5 / 1000
  // or 1.0 -> 10 / 1000
  const ratePerThousand = Math.round(ratePct * 10);
  return Math.round((loanAmount * ratePerThousand) / 1000);
}

/**
 * Maps status filter query to underlying ReferralStatus values
 * "pending" = in_login, underwriting, sanctioned
 * "approved" = disbursed
 */
export function mapStatusFilter(filter?: string | null): string[] | null {
  if (!filter || filter.toLowerCase() === 'all') return null;
  const f = filter.toLowerCase();
  if (f === 'pending') {
    return ['in_login', 'underwriting', 'sanctioned'];
  }
  if (f === 'approved') {
    return ['disbursed'];
  }
  return [filter];
}
