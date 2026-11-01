import { AttentionItem } from '../../../shared/types.js';
import { iconChevronRight } from '../icons.js';

interface AttentionRowConfig {
  key: AttentionItem['key'];
  label: string;
  link: string;
  tileClass: string;
}

const ATTENTION_ROWS: AttentionRowConfig[] = [
  {
    key: 'kyc_pending',
    label: 'Partner KYC to verify',
    link: '/admin/partners?kyc=pending',
    tileClass: 'attention-card__tile--kyc_pending',
  },
  {
    key: 'stuck_underwriting',
    label: 'Stuck in underwriting',
    link: '/admin/referrals?status=underwriting&stale=5d',
    tileClass: 'attention-card__tile--stuck_underwriting',
  },
  {
    key: 'payouts_on_hold',
    label: 'Payouts on hold',
    link: '/admin/payouts?hold=1',
    tileClass: 'attention-card__tile--payouts_on_hold',
  },
];

export function initAttentionList(container: HTMLElement) {
  function render(items: AttentionItem[] | null, error = false) {
    let bodyHtml = '';

    if (error) {
      bodyHtml = `<p class="attention-card__error">Couldn't load this section.</p>`;
    } else if (items === null) {
      // Placeholder / loading
      const placeholderRows = ATTENTION_ROWS.map((row) => `
        <div class="attention-card__row">
          <span class="attention-card__tile attention-card__tile--zero">—</span>
          <span class="attention-card__label">${row.label}</span>
          <span class="attention-card__icon">${iconChevronRight(14)}</span>
        </div>
      `).join('');
      bodyHtml = `<div class="attention-card__list">${placeholderRows}</div>`;
    } else {
      const countsMap = new Map<string, number>();
      items.forEach((item) => countsMap.set(item.key, item.count));

      const allZero = ATTENTION_ROWS.every((r) => (countsMap.get(r.key) || 0) === 0);

      if (allZero) {
        // Empty state: Section 2.3 & Section 5
        bodyHtml = `<p class="attention-card__empty">Nothing needs attention.</p>`;
      } else {
        const rowsHtml = ATTENTION_ROWS.map((row) => {
          const count = countsMap.get(row.key) || 0;
          const isZero = count === 0;
          const tileClass = isZero ? 'attention-card__tile--zero' : row.tileClass;

          return `
            <a
              href="${row.link}"
              class="attention-card__row"
              aria-label="${count} ${row.label}"
            >
              <span class="attention-card__tile ${tileClass}">${count}</span>
              <span class="attention-card__label">${row.label}</span>
              <span class="attention-card__icon">${iconChevronRight(14)}</span>
            </a>
          `;
        }).join('');

        bodyHtml = `<div class="attention-card__list">${rowsHtml}</div>`;
      }
    }

    container.innerHTML = `
      <section class="attention-card" aria-labelledby="admin-attention-title">
        <h2 id="admin-attention-title" class="attention-card__title">Needs attention</h2>
        ${bodyHtml}
      </section>
    `;
  }

  // Initial render
  render(null);

  return {
    update(items: AttentionItem[]) {
      render(items, false);
    },
    showError() {
      render(null, true);
    },
  };
}

export const init = initAttentionList;

