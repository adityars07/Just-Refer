import { api } from '../api/client.js';
import { User } from '../../../shared/types.js';
import { initAdminHeader } from './adminHeader.js';
import { initSummaryBand } from './summaryBand.js';
import { initReferralsTable, StatusFilterKey } from './referralsTable.js';
import { initPayoutRunCard } from './payoutRunCard.js';
import { initAttentionList } from './attentionList.js';
import { initAdminWithdrawalsTable } from './adminWithdrawalsTable.js';

export async function initAdminView(root: HTMLElement) {
  // Check auth and permissions first (Section 4.1)
  let currentUser: User | null = null;
  try {
    currentUser = await api.getMe();
    if (!currentUser.roles || !currentUser.roles.includes('admin')) {
      window.location.href = '/dashboard';
      return;
    }
  } catch (err) {
    // If auth fails or user is not logged in / not admin, redirect
    window.location.href = '/dashboard';
    return;
  }

  // Render scaffold with accessible landmarks (Section 7)
  root.className = 'admin-body';
  root.innerHTML = `
    <h1 class="admin-sr-only">Admin overview</h1>
    <div id="admin-header-mount"></div>
    <div id="admin-summary-mount"></div>
    <main class="admin-wrap admin-main-wrap" id="admin-main-content">
      <div style="flex: 1 1 760px; min-width: 0; display: flex; flex-direction: column; gap: 24px;">
        <div id="admin-referrals-mount"></div>
        <div id="admin-withdrawals-mount"></div>
      </div>
      <aside class="admin-aside" aria-label="Admin side actions">
        <div id="admin-payout-mount"></div>
        <div id="admin-attention-mount"></div>
      </aside>
    </main>
  `;

  const headerMount = root.querySelector<HTMLElement>('#admin-header-mount')!;
  const summaryMount = root.querySelector<HTMLElement>('#admin-summary-mount')!;
  const referralsMount = root.querySelector<HTMLElement>('#admin-referrals-mount')!;
  const withdrawalsMount = root.querySelector<HTMLElement>('#admin-withdrawals-mount')!;
  const payoutMount = root.querySelector<HTMLElement>('#admin-payout-mount')!;
  const attentionMount = root.querySelector<HTMLElement>('#admin-attention-mount')!;

  // Initialize components
  initAdminHeader(headerMount, { user: currentUser });
  const summaryBand = initSummaryBand(summaryMount);
  const payoutRunCard = initPayoutRunCard(payoutMount);
  const attentionList = initAttentionList(attentionMount);

  let currentStatus: StatusFilterKey = 'all';

  const referralsTable = initReferralsTable(referralsMount, {
    onFilterChange: async (status) => {
      currentStatus = status;
      try {
        const res = await api.getAdminReferrals({ status: currentStatus, page: 1, pageSize: 6 });
        referralsTable.update(res.items);
      } catch (err) {
        referralsTable.showError();
      }
    },
    onReferralUpdated: () => {
      loadData();
    },
  });

  const withdrawalsTable = initAdminWithdrawalsTable(withdrawalsMount, {
    onUpdated: () => {
      loadData();
    },
  });

  // Fetch real data from API
  async function loadData() {
    // 1. Summary
    api.getAdminSummary()
      .then((summary) => summaryBand.update(summary))
      .catch(() => summaryBand.showError());

    // 2. Referrals
    api.getAdminReferrals({ status: currentStatus, page: 1, pageSize: 6 })
      .then((res) => referralsTable.update(res.items))
      .catch(() => referralsTable.showError());

    // 3. Payout Run
    api.getNextPayoutRun()
      .then((run) => payoutRunCard.update(run))
      .catch(() => payoutRunCard.showError());

    // 4. Attention Items
    api.getAdminAttention()
      .then((items) => attentionList.update(items))
      .catch(() => attentionList.showError());

    // 5. Withdrawals
    api.getAdminWithdrawals()
      .then((data) => withdrawalsTable.update(data.withdrawals))
      .catch(() => {});
  }

  window.addEventListener('focus', loadData);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      loadData();
    }
  });

  await loadData();
}

export const init = initAdminView;
