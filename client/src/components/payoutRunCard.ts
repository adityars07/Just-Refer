import { PayoutRun } from '../../../shared/types.js';
import { formatPayoutDate, formatPayoutRunAmount } from '../api/client.js';

const STATUS_BADGE_MAP: Record<PayoutRun['status'], { label: string; class: string }> = {
  awaiting_approval: { label: 'Awaiting approval', class: 'payout-run-card__badge--awaiting_approval' },
  approved: { label: 'Approved', class: 'payout-run-card__badge--approved' },
  released: { label: 'Released', class: 'payout-run-card__badge--released' },
};

export function initPayoutRunCard(container: HTMLElement) {
  function render(run: PayoutRun | null | undefined, error = false) {
    if (error) {
      container.innerHTML = `
        <div class="payout-run-card">
          <div class="payout-run-card__top">
            <span class="admin-lbl payout-run-card__label">NEXT PAYOUT RUN</span>
          </div>
          <p class="payout-run-card__error-text">Couldn't load this section.</p>
        </div>
      `;
      return;
    }

    if (run === undefined) {
      // Loading / initial placeholder
      container.innerHTML = `
        <div class="payout-run-card">
          <div class="payout-run-card__top">
            <span class="admin-lbl payout-run-card__label">NEXT PAYOUT RUN</span>
          </div>
          <div class="payout-run-card__date">—</div>
          <div class="payout-run-card__amount">—</div>
        </div>
      `;
      return;
    }

    if (run === null) {
      // Empty state (Section 2.3 & Section 5)
      container.innerHTML = `
        <div class="payout-run-card">
          <div class="payout-run-card__top">
            <span class="admin-lbl payout-run-card__label">NEXT PAYOUT RUN</span>
          </div>
          <p class="payout-run-card__empty-text">No payout run scheduled.</p>
        </div>
      `;
      return;
    }

    const badge = STATUS_BADGE_MAP[run.status] || { label: run.status, class: '' };
    const dateFormatted = formatPayoutDate(run.scheduledFor);
    const amountFormatted = formatPayoutRunAmount(run.totalAmount);
    const btnLabel = run.status === 'awaiting_approval' ? 'Review run →' : 'View run →';

    container.innerHTML = `
      <div class="payout-run-card">
        <div class="payout-run-card__top">
          <span class="admin-lbl payout-run-card__label">NEXT PAYOUT RUN</span>
          <span class="payout-run-card__badge ${badge.class}">${badge.label}</span>
        </div>
        <div class="payout-run-card__date">${dateFormatted}</div>
        <div class="payout-run-card__amount">${amountFormatted}</div>
        <div class="payout-run-card__subtext">${run.partnerCount} partners • ${run.method}</div>
        <a href="/admin/payouts/${encodeURIComponent(run.id)}" class="payout-run-card__btn">${btnLabel}</a>
      </div>
    `;
  }

  // Initial render with placeholder
  render(undefined);

  return {
    update(run: PayoutRun | null) {
      render(run, false);
    },
    showError() {
      render(undefined, true);
    },
  };
}

export const init = initPayoutRunCard;

