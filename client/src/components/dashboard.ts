import { api, formatINR, formatINRAmount, formatDate } from '../api/client.js';
import {
  RangeKey,
  LoanProductId,
  DashboardSummary,
  Referral,
} from '../../../shared/types.js';
import {
  iconArrowRight,
  iconBell,
  iconHouse,
  iconBuilding,
  iconUser,
  iconBriefcase,
} from '../icons.js';
import { initCopyCode } from './copyCode.js';
import { initRangePills } from './rangePills.js';

interface DashboardOptions {
  onOpenReferralModal: (productId?: LoanProductId) => void;
}

export async function initDashboard(container: HTMLElement, options: DashboardOptions) {
  let activeRange: RangeKey = 'ALL';
  let activeStatusFilter: 'all' | 'pending' | 'approved' = 'all';

  let summary: DashboardSummary = {
    range: 'ALL',
    totalEarnings: 0,
    availableForPayout: 0,
    totalReferrals: 0,
    pending: 0,
    approved: 0,
    pipeline: { inLogin: 0, underwriting: 0, sanctioned: 0, disbursed: 0 },
    series: [],
  };

  let referralsData: {
    items: Referral[];
    total: number;
    counts: { all: number; pending: number; approved: number };
  } = {
    items: [],
    total: 0,
    counts: { all: 0, pending: 0, approved: 0 },
  };

  // Render initial static shell
  container.innerHTML = `
    <div class="dashboard-page">
      <!-- 1. Header -->
      <header class="dash-header">
        <div class="wrap dash-header__inner">
          <a href="/" class="dash-header__logo">justrefer</a>

          <nav class="dash-header__nav" aria-label="Dashboard Navigation">
            <a href="/dashboard" class="dash-header__nav-link is-active" aria-current="page">Dashboard</a>
            <a href="#referrals" class="dash-header__nav-link" id="nav-referrals">Referrals</a>
            <a href="#payouts" class="dash-header__nav-link">Payouts</a>
            <a href="#products" class="dash-header__nav-link" id="nav-products">Products</a>
            <a href="#reports" class="dash-header__nav-link">Reports</a>
          </nav>

          <div class="dash-header__actions">
            <a href="mailto:support@justrefer.in" class="dash-header__btn-support">Support</a>
            <button type="button" class="dash-header__btn-create" id="btn-create-referral-top">
              <span>Create Referral</span>
              ${iconArrowRight(16, 'icon')}
            </button>
          </div>
        </div>
      </header>

      <!-- 2. Charcoal Band -->
      <main class="dash-stage">
        <div class="wrap dash-stage__inner">
          <div class="dash-stage__heading">
            <h1 class="dash-stage__h1">Welcome back, Aditya</h1>
            <p class="dash-stage__sub">
              Share loan products, track every referral and get paid.
            </p>
          </div>

          <!-- App Panel -->
          <div class="dash-panel" role="region" aria-label="Partner Dashboard Area">
            <!-- 2a. Top Bar -->
            <div class="dash-panel__topbar">
              <span class="dash-panel__wordmark">justrefer</span>

              <div class="dash-panel__tabs" role="tablist">
                <button type="button" class="dash-panel__tab is-active" role="tab" aria-selected="true" id="tab-home">Home</button>
                <button type="button" class="dash-panel__tab" role="tab" aria-selected="false" id="tab-referrals">Referrals</button>
              </div>

              <div class="dash-panel__topbar-right">
                <button type="button" class="dash-panel__btn-bell" aria-label="Notifications" title="Notifications">
                  ${iconBell(14, 'icon', true)}
                </button>
                <div class="dash-panel__avatar" title="Aditya">A</div>
              </div>
            </div>

            <!-- 2b. Body -->
            <div class="dash-panel__body">
              <!-- Row 1: Earnings & Code -->
              <div class="dash-row-1">
                <!-- Earnings Card -->
                <section class="card dash-earnings-card" aria-labelledby="total-earnings-lbl">
                  <div class="dash-earnings-card__left">
                    <span id="total-earnings-lbl" class="lbl">TOTAL EARNINGS</span>
                    <strong class="dash-earnings-card__amount" id="dash-total-earnings">₹0</strong>
                    
                    <div class="dash-earnings-card__payout-block">
                      <span class="lbl">AVAILABLE FOR PAYOUT</span>
                      <strong class="dash-earnings-card__payout-val" id="dash-payout-val">₹0.00</strong>
                    </div>
                  </div>

                  <div class="dash-earnings-card__right">
                    <div class="dash-pills" id="dash-range-pills" role="group" aria-label="Timeframe Range"></div>

                    <!-- Flat empty sparkline: one horizontal dotted line -->
                    <div class="dash-sparkline-wrap" role="img" aria-label="Earnings sparkline">
                      <svg class="dash-sparkline-svg" viewBox="0 0 280 60" preserveAspectRatio="none" aria-hidden="true">
                        <line x1="0" y1="30" x2="280" y2="30" stroke="#C9C7C1" stroke-width="1.5" stroke-dasharray="2 4" />
                      </svg>
                    </div>
                  </div>
                </section>

                <!-- Code Card -->
                <section class="card dash-code-card" aria-labelledby="code-card-lbl">
                  <span id="code-card-lbl" class="dash-code-card__tag">YOUR CODE</span>
                  <div class="dash-code-card__row">
                    <span class="dash-code-card__code">JR-AYUS7175</span>
                    <button type="button" class="dash-code-card__btn-copy" id="dash-btn-copy" aria-label="Copy referral code">
                      Copy
                    </button>
                  </div>
                  <p class="dash-code-card__desc">
                    Share this code with new partners to link their referrals to your account.
                  </p>
                </section>
              </div>

              <!-- Row 2: Three Count Cards -->
              <div class="dash-row-2">
                <section class="card dash-count-card" aria-labelledby="count-total-lbl">
                  <span id="count-total-lbl" class="lbl">TOTAL REFERRALS</span>
                  <strong class="dash-count-card__num" id="dash-count-total">0</strong>
                </section>

                <section class="card dash-count-card" aria-labelledby="count-pending-lbl">
                  <span id="count-pending-lbl" class="lbl">PENDING</span>
                  <strong class="dash-count-card__num" id="dash-count-pending">0</strong>
                </section>

                <section class="card dash-count-card" aria-labelledby="count-approved-lbl">
                  <span id="count-approved-lbl" class="lbl">APPROVED</span>
                  <strong class="dash-count-card__num" id="dash-count-approved">0</strong>
                </section>
              </div>

              <!-- Row 3: Loan Products Card -->
              <section class="card dash-products-card" id="dash-products-section" aria-labelledby="loan-products-title">
                <div class="dash-products-card__header">
                  <h2 id="loan-products-title" class="dash-products-card__title">Loan products</h2>
                  <a href="#view-all-products" class="dash-products-card__link-all" id="link-view-all">View all</a>
                </div>

                <div class="dash-products-list">
                  <!-- Home Loan -->
                  <div class="dash-product-row">
                    <div class="dash-product-row__tile dash-product-row__tile--amber" aria-hidden="true">
                      ${iconHouse(18, 'icon')}
                    </div>
                    <div class="dash-product-row__info">
                      <span class="dash-product-row__name">Home Loan</span>
                      <span class="dash-product-row__sub">From ₹50 Lakhs · 7.25% p.a.</span>
                    </div>
                    <div class="dash-product-row__payout">
                      <span class="dash-product-row__payout-rate">0.3% payout</span>
                      <span class="dash-product-row__payout-detail">₹15,000 per ₹50L</span>
                    </div>
                    <button type="button" class="dash-product-row__btn-refer" data-product="home">Refer</button>
                  </div>

                  <!-- Loan Against Property -->
                  <div class="dash-product-row">
                    <div class="dash-product-row__tile dash-product-row__tile--pink" aria-hidden="true">
                      ${iconBuilding(18, 'icon')}
                    </div>
                    <div class="dash-product-row__info">
                      <span class="dash-product-row__name">Loan Against Property</span>
                      <span class="dash-product-row__sub">From ₹1 Crore · 8.00% p.a.</span>
                    </div>
                    <div class="dash-product-row__payout">
                      <span class="dash-product-row__payout-rate">0.5% payout</span>
                      <span class="dash-product-row__payout-detail">₹50,000 per ₹1Cr</span>
                    </div>
                    <button type="button" class="dash-product-row__btn-refer" data-product="lap">Refer</button>
                  </div>

                  <!-- Personal Loan -->
                  <div class="dash-product-row">
                    <div class="dash-product-row__tile dash-product-row__tile--blue" aria-hidden="true">
                      ${iconUser(18, 'icon')}
                    </div>
                    <div class="dash-product-row__info">
                      <span class="dash-product-row__name">Personal Loan</span>
                      <span class="dash-product-row__sub">From ₹5 Lakhs · 9.99% p.a.</span>
                    </div>
                    <div class="dash-product-row__payout">
                      <span class="dash-product-row__payout-rate">1.0% payout</span>
                      <span class="dash-product-row__payout-detail">₹10,000 per ₹10L</span>
                    </div>
                    <button type="button" class="dash-product-row__btn-refer" data-product="personal">Refer</button>
                  </div>

                  <!-- Business Loan -->
                  <div class="dash-product-row">
                    <div class="dash-product-row__tile dash-product-row__tile--green" aria-hidden="true">
                      ${iconBriefcase(18, 'icon')}
                    </div>
                    <div class="dash-product-row__info">
                      <span class="dash-product-row__name">Business Loan</span>
                      <span class="dash-product-row__sub">From ₹10 Lakhs · 10.99% p.a.</span>
                    </div>
                    <div class="dash-product-row__payout">
                      <span class="dash-product-row__payout-rate">1.0% payout</span>
                      <span class="dash-product-row__payout-detail">₹25,000 per ₹25L</span>
                    </div>
                    <button type="button" class="dash-product-row__btn-refer" data-product="business">Refer</button>
                  </div>
                </div>
              </section>

              <!-- Row 4: Recent Referrals Card -->
              <section class="card dash-referrals-card" id="dash-referrals-section" aria-labelledby="recent-referrals-title">
                <div class="dash-referrals-card__header">
                  <h2 id="recent-referrals-title" class="dash-referrals-card__title">Recent referrals</h2>
                  
                  <div class="dash-pills" id="dash-status-pills" role="group" aria-label="Referrals Filter">
                    <button type="button" class="dash-pill is-active" data-status="all" aria-pressed="true">All (0)</button>
                    <button type="button" class="dash-pill" data-status="pending" aria-pressed="false">Pending (0)</button>
                    <button type="button" class="dash-pill" data-status="approved" aria-pressed="false">Approved (0)</button>
                  </div>

                  <span class="lbl dash-referrals-card__last-days">LAST 30 DAYS</span>
                </div>

                <!-- Referral Content Container -->
                <div id="dash-referrals-content"></div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <!-- 3. Footer -->
      <footer class="dash-footer">
        <div class="wrap dash-footer__inner">
          <a href="/#settings" class="dash-footer__link">Settings</a>
          <a href="mailto:support@justrefer.in" class="dash-footer__link">Support</a>
          <a href="/#admin" class="dash-footer__link">Admin Panel</a>
        </div>
      </footer>
    </div>
  `;

  // Attach elements
  const totalEarningsEl = container.querySelector<HTMLElement>('#dash-total-earnings')!;
  const payoutValEl = container.querySelector<HTMLElement>('#dash-payout-val')!;
  const countTotalEl = container.querySelector<HTMLElement>('#dash-count-total')!;
  const countPendingEl = container.querySelector<HTMLElement>('#dash-count-pending')!;
  const countApprovedEl = container.querySelector<HTMLElement>('#dash-count-approved')!;
  const rangePillsEl = container.querySelector<HTMLElement>('#dash-range-pills')!;
  const copyBtn = container.querySelector<HTMLButtonElement>('#dash-btn-copy')!;
  const referralsContentEl = container.querySelector<HTMLElement>('#dash-referrals-content')!;
  const statusPillsEl = container.querySelector<HTMLElement>('#dash-status-pills')!;
  const createTopBtn = container.querySelector<HTMLButtonElement>('#btn-create-referral-top')!;
  const viewAllLink = container.querySelector<HTMLElement>('#link-view-all')!;

  // Copy referral code
  initCopyCode(copyBtn, 'JR-AYUS7175');

  // Range pills selector
  initRangePills(rangePillsEl, ['1W', '1M', '3M', 'ALL'], 'ALL', async (range) => {
    activeRange = range;
    await refreshSummary();
  });

  // Create buttons
  createTopBtn.addEventListener('click', () => {
    options.onOpenReferralModal();
  });

  viewAllLink.addEventListener('click', (e) => {
    e.preventDefault();
    options.onOpenReferralModal();
  });

  // Product row refer buttons
  container.querySelectorAll<HTMLButtonElement>('.dash-product-row__btn-refer').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = btn.dataset.product as LoanProductId;
      options.onOpenReferralModal(p);
    });
  });

  // Nav scrolling
  container.querySelector('#nav-referrals')?.addEventListener('click', (e) => {
    e.preventDefault();
    container.querySelector('#dash-referrals-section')?.scrollIntoView({ behavior: 'smooth' });
  });

  container.querySelector('#nav-products')?.addEventListener('click', (e) => {
    e.preventDefault();
    container.querySelector('#dash-products-section')?.scrollIntoView({ behavior: 'smooth' });
  });

  container.querySelector('#tab-referrals')?.addEventListener('click', () => {
    container.querySelector('#dash-referrals-section')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Fetch summary
  async function refreshSummary() {
    try {
      summary = await api.getDashboardSummary(activeRange);
      totalEarningsEl.textContent = formatINRAmount(summary.totalEarnings);
      payoutValEl.textContent = formatINR(summary.availableForPayout);
      countTotalEl.textContent = String(summary.totalReferrals);
      countPendingEl.textContent = String(summary.pending);
      countApprovedEl.textContent = String(summary.approved);
    } catch {
      totalEarningsEl.textContent = '₹0';
      payoutValEl.textContent = '₹0.00';
    }
  }

  // Fetch referrals
  async function refreshReferrals() {
    try {
      referralsData = await api.getReferrals({
        status: activeStatusFilter === 'all' ? undefined : activeStatusFilter,
      });

      // Update status pill labels
      statusPillsEl.innerHTML = `
        <button type="button" class="dash-pill ${activeStatusFilter === 'all' ? 'is-active' : ''}" data-status="all" aria-pressed="${activeStatusFilter === 'all'}">All (${referralsData.counts.all})</button>
        <button type="button" class="dash-pill ${activeStatusFilter === 'pending' ? 'is-active' : ''}" data-status="pending" aria-pressed="${activeStatusFilter === 'pending'}">Pending (${referralsData.counts.pending})</button>
        <button type="button" class="dash-pill ${activeStatusFilter === 'approved' ? 'is-active' : ''}" data-status="approved" aria-pressed="${activeStatusFilter === 'approved'}">Approved (${referralsData.counts.approved})</button>
      `;

      // Re-attach status pill listeners
      statusPillsEl.querySelectorAll<HTMLButtonElement>('.dash-pill').forEach((btn) => {
        btn.addEventListener('click', () => {
          activeStatusFilter = btn.dataset.status as any;
          refreshReferrals();
        });
      });

      // Render Empty state vs Table
      if (referralsData.items.length === 0) {
        referralsContentEl.innerHTML = `
          <div class="dash-empty-state">
            <p class="dash-empty-state__title">No referrals yet</p>
            <p class="dash-empty-state__desc">
              Create your first referral to start tracking applications and earning payouts.
            </p>
          </div>
        `;
      } else {
        referralsContentEl.innerHTML = `
          <div class="dash-table-wrap">
            <table class="dash-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Applicant</th>
                  <th>City</th>
                  <th>Product</th>
                  <th>Loan Amount</th>
                  <th>Est. Commission</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style="text-align: center;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${referralsData.items
                  .map(
                    (r, idx) => `
                  <tr>
                    <td style="color: var(--muted);">${idx + 1}</td>
                    <td>
                      <strong>${r.applicant}</strong>
                      ${r.phone ? `<div style="font-size: 11px; color: var(--muted);">${r.phone}</div>` : ''}
                    </td>
                    <td style="color: var(--secondary);">${r.city}</td>
                    <td style="text-transform: capitalize;">${r.productId} Loan</td>
                    <td style="font-weight: 600;">${formatINRAmount(r.loanAmount)}</td>
                    <td style="color: var(--green-money); font-weight: 600;">${formatINRAmount(r.commission)}</td>
                    <td>
                      <span class="dash-status-pill dash-status-pill--${r.status}">
                        ${r.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style="color: var(--muted); font-size: 12px;">${formatDate(r.createdAt)}</td>
                    <td style="text-align: center;">
                      <button type="button" class="dash-product-row__btn-refer" style="height: 28px; padding: 0 10px; font-size: 11px;">
                        View
                      </button>
                    </td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        `;
      }
    } catch {
      referralsContentEl.innerHTML = `
        <div class="dash-empty-state">
          <p class="dash-empty-state__title">No referrals yet</p>
          <p class="dash-empty-state__desc">
            Create your first referral to start tracking applications and earning payouts.
          </p>
        </div>
      `;
    }
  }

  await Promise.all([refreshSummary(), refreshReferrals()]);

  return {
    reload: async () => {
      await Promise.all([refreshSummary(), refreshReferrals()]);
    },
  };
}
