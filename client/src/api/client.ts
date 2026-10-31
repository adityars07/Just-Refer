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

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

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
};

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
