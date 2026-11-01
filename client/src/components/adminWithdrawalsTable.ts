import { Withdrawal, WithdrawalStatus } from '../../../shared/types.js';
import { api, formatFullINR, formatDate } from '../api/client.js';

export type WithdrawalFilterKey = 'all' | WithdrawalStatus;

export interface AdminWithdrawalsTableOptions {
  onUpdated?: () => void;
}

const FILTER_PILLS: Array<{ key: WithdrawalFilterKey; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'requested', label: 'Requested' },
  { key: 'processing', label: 'Processing' },
  { key: 'paid', label: 'Paid' },
  { key: 'rejected', label: 'Rejected' },
];

export function initAdminWithdrawalsTable(container: HTMLElement, options: AdminWithdrawalsTableOptions) {
  let activeFilter: WithdrawalFilterKey = 'all';
  let allItems: Withdrawal[] = [];

  function render() {
    const filtered = allItems.filter((w) => {
      if (activeFilter === 'all') return true;
      return w.status === activeFilter;
    });

    const pillsHtml = FILTER_PILLS.map((p) => {
      const isActive = p.key === activeFilter;
      return `
        <button
          type="button"
          class="admin-withdrawals-card__pill ${isActive ? 'admin-withdrawals-card__pill--active' : ''}"
          data-status="${p.key}"
          aria-pressed="${isActive ? 'true' : 'false'}"
        >
          ${p.label}
        </button>
      `;
    }).join('');

    let bodyContent = '';
    if (filtered.length === 0) {
      const msg = activeFilter === 'all' ? 'No withdrawal requests yet.' : `No ${activeFilter} withdrawals.`;
      bodyContent = `<div class="admin-withdrawals-card__empty">${msg}</div>`;
    } else {
      bodyContent = filtered
        .map((w) => {
          const amtFormatted = formatFullINR(w.amount);
          const reqDate = formatDate(w.requestedAt);

          let actionsHtml = '';
          if (w.status === 'requested') {
            actionsHtml = `
              <button type="button" class="admin-withdrawals-table__btn-action btn-mark-processing" data-id="${escapeHtml(w.id)}">
                Mark processing
              </button>
              <button type="button" class="admin-withdrawals-table__btn-action admin-withdrawals-table__btn-action--reject btn-reject" data-id="${escapeHtml(w.id)}">
                Reject
              </button>
            `;
          } else if (w.status === 'processing') {
            actionsHtml = `
              <button type="button" class="admin-withdrawals-table__btn-action admin-withdrawals-table__btn-action--pay btn-mark-paid" data-id="${escapeHtml(w.id)}">
                Mark paid
              </button>
              <button type="button" class="admin-withdrawals-table__btn-action admin-withdrawals-table__btn-action--reject btn-reject" data-id="${escapeHtml(w.id)}">
                Reject
              </button>
            `;
          } else if (w.status === 'paid') {
            actionsHtml = `<span style="font-size: 11px; font-family: monospace; color: #1A6E3D;">UTR: ${escapeHtml(w.utr || '—')}</span>`;
          } else if (w.status === 'rejected') {
            actionsHtml = `<span style="font-size: 11px; color: #A12A24;" title="${escapeHtml(w.rejectReason || '')}">Reason: ${escapeHtml(w.rejectReason || 'Rejected')}</span>`;
          }

          return `
            <div class="admin-withdrawals-table__row admin-withdrawals-table__row--body" role="row">
              <div class="admin-withdrawals-table__cell-partner" role="cell">
                <span class="admin-withdrawals-table__partner-name">${escapeHtml(w.partnerName || 'Partner')}</span>
                <span class="admin-withdrawals-table__partner-phone">${escapeHtml(w.partnerId)}</span>
              </div>
              <div class="admin-withdrawals-table__cell-amount" role="cell">
                ${amtFormatted}
              </div>
              <div class="admin-withdrawals-table__cell-account" role="cell">
                ${escapeHtml(w.bankSnapshot.accountNumberMasked)}
              </div>
              <div class="admin-withdrawals-table__cell-ifsc" role="cell">
                <span class="admin-withdrawals-table__ifsc-code">${escapeHtml(w.bankSnapshot.ifsc)}</span>
                ${w.bankSnapshot.bankName ? `<span class="admin-withdrawals-table__ifsc-bank">${escapeHtml(w.bankSnapshot.bankName)}</span>` : ''}
              </div>
              <div class="admin-withdrawals-table__cell-date" role="cell">
                ${reqDate}
              </div>
              <div role="cell">
                <span class="admin-withdrawals-table__badge admin-withdrawals-table__badge--${w.status}">
                  ${w.status}
                </span>
              </div>
              <div class="admin-withdrawals-table__actions" role="cell">
                ${actionsHtml}
              </div>
            </div>
          `;
        })
        .join('');
    }

    container.innerHTML = `
      <section class="admin-withdrawals-card" aria-label="Withdrawals list" id="admin-withdrawals-section">
        <div class="admin-withdrawals-card__header">
          <h2 class="admin-withdrawals-card__title">Withdrawals</h2>
          <div class="admin-withdrawals-card__filters" role="group" aria-label="Filter by status">
            ${pillsHtml}
          </div>
        </div>
        <div class="admin-withdrawals-card__table-wrap">
          <div class="admin-withdrawals-table" role="table" aria-label="Withdrawal Requests">
            <div class="admin-withdrawals-table__row admin-withdrawals-table__row--header" role="row">
              <div class="admin-lbl admin-withdrawals-table__header-cell" role="columnheader">PARTNER</div>
              <div class="admin-lbl admin-withdrawals-table__header-cell" role="columnheader">AMOUNT</div>
              <div class="admin-lbl admin-withdrawals-table__header-cell" role="columnheader">ACCOUNT</div>
              <div class="admin-lbl admin-withdrawals-table__header-cell" role="columnheader">IFSC / BANK</div>
              <div class="admin-lbl admin-withdrawals-table__header-cell" role="columnheader">DATE</div>
              <div class="admin-lbl admin-withdrawals-table__header-cell" role="columnheader">STATUS</div>
              <div class="admin-lbl admin-withdrawals-table__header-cell" role="columnheader" style="text-align: right;">ACTIONS</div>
            </div>
            ${bodyContent}
          </div>
        </div>
      </section>
    `;

    // Filter pills
    container.querySelectorAll<HTMLButtonElement>('.admin-withdrawals-card__pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        const s = btn.getAttribute('data-status') as WithdrawalFilterKey;
        if (s && s !== activeFilter) {
          activeFilter = s;
          render();
        }
      });
    });

    // Mark processing
    container.querySelectorAll<HTMLButtonElement>('.btn-mark-processing').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!id) return;
        btn.disabled = true;
        btn.textContent = 'Updating...';
        try {
          await api.updateAdminWithdrawalStatus(id, { status: 'processing' });
          options.onUpdated?.();
        } catch (err: any) {
          alert(err.message || 'Failed to update withdrawal status');
          btn.disabled = false;
          btn.textContent = 'Mark processing';
        }
      });
    });

    // Mark paid modal
    container.querySelectorAll<HTMLButtonElement>('.btn-mark-paid').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (!id) return;
        openMarkPaidModal(id);
      });
    });

    // Reject modal
    container.querySelectorAll<HTMLButtonElement>('.btn-reject').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (!id) return;
        openRejectModal(id);
      });
    });
  }

  function openMarkPaidModal(id: string) {
    const existing = document.getElementById('wd-admin-paid-modal');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'wd-admin-paid-modal';
    backdrop.className = 'ref-modal-backdrop';

    const todayStr = new Date().toISOString().substring(0, 10);

    backdrop.innerHTML = `
      <div class="ref-modal" style="max-width: 400px;">
        <div class="ref-modal__header">
          <div>
            <h2 class="ref-modal__title">Mark Withdrawal as Paid</h2>
            <div class="ref-modal__subtitle">ID: ${escapeHtml(id)}</div>
          </div>
          <button type="button" class="ref-modal__close-btn" id="modal-close">&times;</button>
        </div>
        <form id="paid-form" class="ref-modal__body">
          <div id="modal-err" class="ref-modal__error" style="display: none;"></div>
          <div class="ref-modal__group">
            <label class="ref-modal__label" for="paid-utr">UTR / Reference Number</label>
            <input type="text" id="paid-utr" class="ref-modal__input" placeholder="e.g. UTR-99882200" required />
          </div>
          <div class="ref-modal__group">
            <label class="ref-modal__label" for="paid-date">Payment Date</label>
            <input type="date" id="paid-date" class="ref-modal__input" value="${todayStr}" required />
          </div>
          <div class="ref-modal__footer" style="padding: 12px 0 0 0; border: none; background: transparent;">
            <button type="button" class="ref-modal__btn-cancel" id="modal-cancel">Cancel</button>
            <button type="submit" class="ref-modal__btn-save" id="modal-submit">Confirm Paid</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(backdrop);

    const close = () => backdrop.remove();
    backdrop.querySelector('#modal-close')?.addEventListener('click', close);
    backdrop.querySelector('#modal-cancel')?.addEventListener('click', close);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

    const form = backdrop.querySelector<HTMLFormElement>('#paid-form')!;
    const errEl = backdrop.querySelector<HTMLElement>('#modal-err')!;
    const submitBtn = backdrop.querySelector<HTMLButtonElement>('#modal-submit')!;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errEl.style.display = 'none';
      const utr = (backdrop.querySelector<HTMLInputElement>('#paid-utr')?.value || '').trim();
      const paidAt = backdrop.querySelector<HTMLInputElement>('#paid-date')?.value || todayStr;

      if (!utr) {
        errEl.textContent = 'Please enter a UTR or payment reference number';
        errEl.style.display = 'block';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';
      try {
        await api.updateAdminWithdrawalStatus(id, { status: 'paid', utr, paidAt });
        close();
        options.onUpdated?.();
      } catch (err: any) {
        errEl.textContent = err.message || 'Failed to mark as paid';
        errEl.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm Paid';
      }
    });
  }

  function openRejectModal(id: string) {
    const existing = document.getElementById('wd-admin-reject-modal');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'wd-admin-reject-modal';
    backdrop.className = 'ref-modal-backdrop';

    backdrop.innerHTML = `
      <div class="ref-modal" style="max-width: 400px;">
        <div class="ref-modal__header">
          <div>
            <h2 class="ref-modal__title">Reject Withdrawal Request</h2>
            <div class="ref-modal__subtitle">ID: ${escapeHtml(id)}</div>
          </div>
          <button type="button" class="ref-modal__close-btn" id="modal-close">&times;</button>
        </div>
        <form id="reject-form" class="ref-modal__body">
          <div id="modal-err" class="ref-modal__error" style="display: none;"></div>
          <p style="font-size: 13px; color: #555; margin: 0;">
            Rejecting this request will return the full withdrawal amount back to the partner's available balance.
          </p>
          <div class="ref-modal__group">
            <label class="ref-modal__label" for="reject-reason">Rejection Reason</label>
            <input type="text" id="reject-reason" class="ref-modal__input" placeholder="e.g. Account name mismatch or invalid IFSC" required />
          </div>
          <div class="ref-modal__footer" style="padding: 12px 0 0 0; border: none; background: transparent;">
            <button type="button" class="ref-modal__btn-cancel" id="modal-cancel">Cancel</button>
            <button type="submit" class="ref-modal__btn-save" style="background: #A12A24;" id="modal-submit">Confirm Rejection</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(backdrop);

    const close = () => backdrop.remove();
    backdrop.querySelector('#modal-close')?.addEventListener('click', close);
    backdrop.querySelector('#modal-cancel')?.addEventListener('click', close);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

    const form = backdrop.querySelector<HTMLFormElement>('#reject-form')!;
    const errEl = backdrop.querySelector<HTMLElement>('#modal-err')!;
    const submitBtn = backdrop.querySelector<HTMLButtonElement>('#modal-submit')!;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errEl.style.display = 'none';
      const reason = (backdrop.querySelector<HTMLInputElement>('#reject-reason')?.value || '').trim();

      if (!reason) {
        errEl.textContent = 'Please enter a rejection reason';
        errEl.style.display = 'block';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Rejecting...';
      try {
        await api.updateAdminWithdrawalStatus(id, { status: 'rejected', rejectReason: reason });
        close();
        options.onUpdated?.();
      } catch (err: any) {
        errEl.textContent = err.message || 'Failed to reject withdrawal';
        errEl.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm Rejection';
      }
    });
  }

  // Initial render with empty
  render();

  return {
    update(items: Withdrawal[]) {
      allItems = items;
      render();
    },
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

