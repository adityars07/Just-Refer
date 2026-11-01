import {
  User,
  LoanProduct,
  DashboardSummary,
  Referral,
  Settlement,
  PartnerTestimonial,
  FAQItem,
  RangeKey,
  LoanProductId,
  AdminSummary,
  AdminReferral,
  PayoutRun,
  AttentionItem,
  BankAccount,
  Withdrawal,
} from '../../../shared/types.js';

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = 'API_ERROR', status = 500) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

export async function fetchApi<T>(path: string, options?: RequestInit, retryCount = 1): Promise<T> {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const res = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...(options?.headers || {}),
      },
    });

    // If server is currently booting up (503) and we have retries left, wait 1.5s and retry
    if (res.status === 503 && retryCount > 0) {
      await new Promise((r) => setTimeout(r, 1500));
      return fetchApi<T>(path, options, retryCount - 1);
    }

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const errorObj = data && typeof data === 'object' && data.error ? data.error : null;
      const message = errorObj?.message || (typeof data === 'string' ? data : res.statusText);
      const code = errorObj?.code || `HTTP_${res.status}`;
      throw new ApiError(message, code, res.status);
    }

    return data as T;
  } catch (err: any) {
    if (retryCount > 0 && (err.name === 'TypeError' || err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError'))) {
      await new Promise((r) => setTimeout(r, 1500));
      return fetchApi<T>(path, options, retryCount - 1);
    }
    throw err;
  }
}

export const api = {
  getMe(): Promise<User> {
    return fetchApi<User>('/api/me');
  },

  getProducts(): Promise<LoanProduct[]> {
    return fetchApi<LoanProduct[]>('/api/products');
  },

  getDashboardSummary(range: RangeKey = 'ALL'): Promise<DashboardSummary> {
    return fetchApi<DashboardSummary>(`/api/dashboard/summary?range=${encodeURIComponent(range)}`);
  },

  getReferrals(params: {
    status?: string;
    range?: string;
    page?: number;
    pageSize?: number;
  } = {}): Promise<{
    items: Referral[];
    total: number;
    counts: { all: number; pending: number; approved: number };
  }> {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set('status', params.status);
    if (params.range) searchParams.set('range', params.range);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));

    const qs = searchParams.toString();
    return fetchApi(`/api/referrals${qs ? `?${qs}` : ''}`);
  },

  createReferral(data: {
    applicant: string;
    phone: string;
    city: string;
    productId: LoanProductId;
    loanAmount: number;
    partnerName?: string;
  }): Promise<Referral> {
    return fetchApi<Referral>('/api/referrals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getLatestSettlement(): Promise<Settlement> {
    return fetchApi<Settlement>('/api/settlements/latest');
  },

  getPartners(): Promise<PartnerTestimonial[]> {
    return fetchApi<PartnerTestimonial[]>('/api/partners');
  },

  getFaqs(): Promise<FAQItem[]> {
    return fetchApi<FAQItem[]>('/api/faqs');
  },

  getAdminSummary(): Promise<AdminSummary> {
    const token = localStorage.getItem('token');
    return fetchApi<AdminSummary>('/api/admin/summary', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  getAdminReferrals(params: {
    status?: string;
    page?: number;
    pageSize?: number;
  } = {}): Promise<{ items: AdminReferral[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set('status', params.status);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));

    const qs = searchParams.toString();
    const token = localStorage.getItem('token');
    return fetchApi(`/api/admin/referrals${qs ? `?${qs}` : ''}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  getNextPayoutRun(): Promise<PayoutRun | null> {
    const token = localStorage.getItem('token');
    return fetchApi<PayoutRun | null>('/api/admin/payout-run/next', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  getAdminAttention(): Promise<AttentionItem[]> {
    const token = localStorage.getItem('token');
    return fetchApi<AttentionItem[]>('/api/admin/attention', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  updateReferralStatus(
    id: string,
    data: {
      stage: string;
      amount?: number;
      date?: string;
      reason?: string;
      note?: string;
    }
  ): Promise<{ success: boolean; referral: Referral }> {
    const token = localStorage.getItem('token');
    return fetchApi<{ success: boolean; referral: Referral }>(`/api/admin/referrals/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  recordReferralPayout(
    id: string,
    data: {
      amount: number;
      paidAt: string;
      reference: string;
    }
  ): Promise<{ success: boolean; referral: Referral }> {
    const token = localStorage.getItem('token');
    return fetchApi<{ success: boolean; referral: Referral }>(`/api/admin/referrals/${encodeURIComponent(id)}/payout`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // ── Withdrawal APIs ──

  getBankAccount(): Promise<BankAccount | null> {
    const token = localStorage.getItem('token');
    return fetchApi<BankAccount | null>('/api/bank-account', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  saveBankAccount(data: {
    holderName: string;
    accountNumber: string;
    ifsc: string;
  }): Promise<BankAccount> {
    const token = localStorage.getItem('token');
    return fetchApi<BankAccount>('/api/bank-account', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  lookupIFSC(code: string): Promise<{
    valid: boolean;
    bank?: string;
    branch?: string;
    bankName?: string;
  }> {
    const token = localStorage.getItem('token');
    return fetchApi(`/api/ifsc/${encodeURIComponent(code.toUpperCase())}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  createWithdrawal(data: {
    amount: number;
    saveDetails?: boolean;
    holderName?: string;
    accountNumber?: string;
    ifsc?: string;
  }): Promise<{ success: boolean; withdrawal: Withdrawal }> {
    const token = localStorage.getItem('token');
    return fetchApi<{ success: boolean; withdrawal: Withdrawal }>('/api/withdrawals', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  getWithdrawals(): Promise<{ withdrawals: Withdrawal[]; available: number }> {
    const token = localStorage.getItem('token');
    return fetchApi<{ withdrawals: Withdrawal[]; available: number }>('/api/withdrawals', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  getAdminWithdrawals(): Promise<{ withdrawals: Withdrawal[] }> {
    const token = localStorage.getItem('token');
    return fetchApi<{ withdrawals: Withdrawal[] }>('/api/admin/withdrawals', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  updateAdminWithdrawalStatus(
    id: string,
    data: { status: string; utr?: string; paidAt?: string; rejectReason?: string }
  ): Promise<{ success: boolean; withdrawal: Withdrawal }> {
    const token = localStorage.getItem('token');
    return fetchApi<{ success: boolean; withdrawal: Withdrawal }>(
      `/api/admin/withdrawals/${encodeURIComponent(id)}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
  },
};

/**
 * Compact INR Formatter (Spec Section 4.3):
 * >= 1 Cr -> ₹{x.xx} Cr
 * >= 1 L  -> ₹{x.xx} L
 * else full grouping, 0 -> ₹0
 */
export function formatCompactINR(amount: number): string {
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

/**
 * Format Indian digits with en-IN grouping (e.g. 1,000 or 0)
 */
export function formatIndianNumber(num: number): string {
  if (num === 0) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
}

/**
 * Format full INR grouping without decimals (e.g. ₹10,000 or ₹0)
 */
export function formatFullINR(amount: number): string {
  if (amount === 0) return '₹0';
  return `₹${new Intl.NumberFormat('en-IN').format(amount)}`;
}

/**
 * Format payout run amount with 2 decimal places
 */
export function formatPayoutRunAmount(amount: number): string {
  return `₹${new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

/**
 * Format ISO date string into weekday, day and month style
 */
export function formatPayoutDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    }).format(d);
  } catch {
    return isoString;
  }
}

/**
 * Format currency using Indian Rupee format
 */
export function formatINR(amount: number, showDecimals = true): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });
  return formatter.format(amount);
}

/**
 * Format Indian Rupee integer without decimals (e.g. ₹50,000)
 */
export function formatINRAmount(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

/**
 * Format ISO Date string to human readable format
 */
export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}
