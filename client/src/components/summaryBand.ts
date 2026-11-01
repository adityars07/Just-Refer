import { AdminSummary } from '../../../shared/types.js';
import { formatCompactINR, formatFullINR, formatIndianNumber } from '../api/client.js';

export function initSummaryBand(container: HTMLElement) {
  // Initial render with placeholders
  render(null);

  function render(summary: AdminSummary | null, error = false) {
    let headlineText = '—';
    let deltaHtml = '';
    let commissionText = '—';
    let partnersText = '—';
    let openReferralsText = '—';

    if (error) {
      headlineText = '—';
      commissionText = '—';
      partnersText = '—';
      openReferralsText = '—';
      deltaHtml = `<div class="summary-band__delta"><span class="summary-band__delta-text">Couldn't load this section.</span></div>`;
    } else if (summary !== null) {
      headlineText = formatCompactINR(summary.disbursed30d);
      commissionText = formatFullINR(summary.commissionPayable);
      partnersText = formatIndianNumber(summary.activePartners);
      openReferralsText = String(summary.openReferrals);

      if (summary.disbursedChangePct !== null) {
        const isPos = summary.disbursedChangePct >= 0;
        const sign = isPos ? '+' : '−'; // Real unicode minus sign for negative
        const absVal = Math.abs(summary.disbursedChangePct).toFixed(1);
        const colorClass = isPos ? 'summary-band__delta-pct--pos' : 'summary-band__delta-pct--neg';
        deltaHtml = `
          <div class="summary-band__delta">
            <span class="summary-band__delta-pct ${colorClass}">${sign}${absVal}%</span>
            <span class="summary-band__delta-text"> vs previous 30 days</span>
          </div>
        `;
      } else {
        deltaHtml = ''; // Delta line hidden when previous period has no disbursals
      }
    }

    container.innerHTML = `
      <section class="summary-band" aria-label="Disbursed and Key Metrics">
        <div class="admin-wrap summary-band__wrap">
          <div class="summary-band__left">
            <span class="admin-lbl summary-band__label">DISBURSED • LAST 30 DAYS</span>
            <div class="summary-band__headline">${headlineText}</div>
            ${deltaHtml}
          </div>

          <div class="summary-band__right">
            <div class="summary-band__stat summary-band__stat--1">
              <span class="admin-lbl summary-band__stat-label">COMMISSION PAYABLE</span>
              <div class="summary-band__stat-val">${commissionText}</div>
            </div>

            <div class="summary-band__stat summary-band__stat--2">
              <span class="admin-lbl summary-band__stat-label">ACTIVE PARTNERS</span>
              <div class="summary-band__stat-val">${partnersText}</div>
            </div>

            <div class="summary-band__stat summary-band__stat--3">
              <span class="admin-lbl summary-band__stat-label">OPEN REFERRALS</span>
              <div class="summary-band__stat-val">${openReferralsText}</div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  return {
    update(summary: AdminSummary) {
      render(summary, false);
    },
    showError() {
      render(null, true);
    },
  };
}

export const init = initSummaryBand;

