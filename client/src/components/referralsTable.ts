import { AdminReferral, ReferralStatus } from '../../../shared/types.js';
import { api, formatFullINR } from '../api/client.js';

export type StatusFilterKey = 'all' | ReferralStatus;

export interface ReferralsTableOptions {
  onFilterChange: (status: StatusFilterKey) => void;
  onReferralUpdated?: () => void;
}

const FILTER_PILLS: Array<{ key: StatusFilterKey; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'in_login', label: 'In login' },
  { key: 'underwriting', label: 'Underwriting' },
  { key: 'sanctioned', label: 'Sanctioned' },
  { key: 'disbursed', label: 'Disbursed' },
  { key: 'rejected', label: 'Rejected' },
];

const STATUS_LABELS: Record<ReferralStatus, string> = {
  in_login: 'In login',
  underwriting: 'Underwriting',
  sanctioned: 'Sanctioned',
  disbursed: 'Disbursed',
  rejected: 'Rejected',
};

const STAGE_ORDER: Record<ReferralStatus, number> = {
  in_login: 1,
  underwriting: 2,
  sanctioned: 3,
  disbursed: 4,
  rejected: 99,
};

export function initReferralsTable(container: HTMLElement, options: ReferralsTableOptions) {
  let activeStatus: StatusFilterKey = 'all';
  let currentItems: AdminReferral[] = [];

  function render(items: AdminReferral[] | null, error = false) {
    if (items) {
      currentItems = items;
    }

    const pillsHtml = FILTER_PILLS.map((p) => {
      const isActive = p.key === activeStatus;
      const activeClass = isActive ? 'referrals-card__pill--active' : '';
      return `
        <button
          type="button"
          class="referrals-card__pill ${activeClass}"
          data-status="${p.key}"
          aria-pressed="${isActive ? 'true' : 'false'}"
        >
          ${p.label}
        </button>
      `;
    }).join('');

    let bodyContent = '';
    let errorHtml = '';

    if (error) {
      errorHtml = `<div class="referrals-card__error">Couldn't load this section.</div>`;
    } else if (items === null) {
      // Loading / placeholder state
      bodyContent = `<div class="referrals-card__empty">—</div>`;
    } else if (items.length === 0) {
      const emptyMsg = activeStatus === 'all' ? 'No referrals yet.' : 'No referrals with this status.';
      bodyContent = `<div class="referrals-card__empty">${emptyMsg}</div>`;
    } else {
      const rowsHtml = items.map((r) => {
        const badgeLabel = STATUS_LABELS[r.status] || r.status;
        const amountFormatted = formatFullINR(r.loanAmount);
        const paidBadge = r.payoutPaid
          ? `<span class="referrals-table__badge referrals-table__badge--paid">Paid</span>`
          : '';

        return `
          <div class="referrals-table__row referrals-table__row--body" role="row">
            <div class="referrals-table__cell-applicant" role="cell">
              <span class="referrals-table__applicant-name">${escapeHtml(r.applicant)}</span>
              <span class="referrals-table__applicant-ref">${escapeHtml(r.refCode)}</span>
            </div>
            <div class="referrals-table__cell-partner" role="cell">
              ${escapeHtml(r.partnerName)}
            </div>
            <div class="referrals-table__cell-product" role="cell">
              <span class="referrals-table__product-name">${escapeHtml(r.productName)}</span>
              <span class="referrals-table__product-lender">${escapeHtml(r.lender)}</span>
            </div>
            <div class="referrals-table__cell-amount" role="cell">
              ${amountFormatted}
            </div>
            <div class="referrals-table__cell-status" role="cell">
              <span class="referrals-table__badge referrals-table__badge--${r.status}">
                ${badgeLabel}
              </span>
              ${paidBadge}
            </div>
            <div class="referrals-table__cell-action" role="cell">
              <button
                type="button"
                class="referrals-table__btn-update"
                data-id="${escapeHtml(r.id)}"
              >
                Update
              </button>
            </div>
          </div>
        `;
      }).join('');

      bodyContent = rowsHtml;
    }

    container.innerHTML = `
      <section class="referrals-card" aria-label="Referrals list">
        <div class="referrals-card__header">
          <h2 class="referrals-card__title">Referrals</h2>
          <div class="referrals-card__filters" role="group" aria-label="Filter by status">
            ${pillsHtml}
          </div>
        </div>
        ${errorHtml}
        <div class="referrals-card__table-wrap">
          <div class="referrals-table" role="table" aria-label="Referrals">
            <div class="referrals-table__row referrals-table__row--header" role="row">
              <div class="admin-lbl referrals-table__header-cell" role="columnheader">APPLICANT</div>
              <div class="admin-lbl referrals-table__header-cell" role="columnheader">PARTNER</div>
              <div class="admin-lbl referrals-table__header-cell" role="columnheader">PRODUCT</div>
              <div class="admin-lbl referrals-table__header-cell" role="columnheader">AMOUNT</div>
              <div class="admin-lbl referrals-table__header-cell" role="columnheader">STATUS</div>
              <div class="admin-lbl referrals-table__header-cell" role="columnheader" style="text-align: right;">ACTION</div>
            </div>
            ${bodyContent}
          </div>
        </div>
      </section>
    `;

    // Bind click events on pills
    const pillButtons = container.querySelectorAll<HTMLButtonElement>('.referrals-card__pill');
    pillButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const status = btn.getAttribute('data-status') as StatusFilterKey;
        if (status && status !== activeStatus) {
          activeStatus = status;
          options.onFilterChange(status);
        }
      });
    });

    // Bind click events on Update buttons
    const updateButtons = container.querySelectorAll<HTMLButtonElement>('.referrals-table__btn-update');
    updateButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const referral = currentItems.find((i) => i.id === id);
        if (referral) {
          openUpdateModal(referral);
        }
      });
    });
  }

  function openUpdateModal(referral: AdminReferral) {
    const existingModal = document.getElementById('ref-status-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'ref-status-modal';
    modalBackdrop.className = 'ref-modal-backdrop';
    modalBackdrop.setAttribute('role', 'dialog');
    modalBackdrop.setAttribute('aria-modal', 'true');
    modalBackdrop.setAttribute('aria-labelledby', 'modal-ref-title');

    const stages: Array<{ key: ReferralStatus; label: string }> = [
      { key: 'in_login', label: 'In login' },
      { key: 'underwriting', label: 'Underwriting' },
      { key: 'sanctioned', label: 'Sanctioned' },
      { key: 'disbursed', label: 'Disbursed' },
      { key: 'rejected', label: 'Rejected' },
    ];

    const currentOrder = STAGE_ORDER[referral.status];
    const isRejected = referral.status === 'rejected';
    const isDisbursed = referral.status === 'disbursed';

    const stageOptionsHtml = stages.map((s) => {
      const isSelected = s.key === referral.status;
      let isDisabled = false;

      if (isRejected) {
        isDisabled = s.key !== 'rejected';
      } else if (isDisbursed) {
        // Disbursed can only stay disbursed (or cannot go backward)
        isDisabled = s.key !== 'disbursed';
      } else if (s.key !== 'rejected') {
        isDisabled = STAGE_ORDER[s.key] < currentOrder;
      }

      return `<option value="${s.key}" ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}>${s.label}</option>`;
    }).join('');

    const defaultSanctionedAmt = referral.sanctionedAmount || referral.loanAmount;
    const defaultDisbursedAmt = referral.disbursedAmount || referral.loanAmount;
    const defaultDisbursedDate = referral.disbursedAt
      ? referral.disbursedAt.substring(0, 10)
      : new Date().toISOString().substring(0, 10);
    const defaultReason = referral.rejectionReason || '';

    // Payout section HTML
    let payoutSectionHtml = '';
    if (referral.status === 'disbursed') {
      if (referral.payoutPaid) {
        const pd = referral.payoutDetails;
        payoutSectionHtml = `
          <div class="ref-modal__payout-card">
            <h3 class="ref-modal__payout-title">Payout Status</h3>
            <div class="ref-modal__payout-paid-info">
              ✓ <strong>Paid:</strong> ${pd ? formatFullINR(pd.amount) : formatFullINR(referral.commission)} on ${escapeHtml(pd?.paidAt || 'Recorded')} (Ref: ${escapeHtml(pd?.reference || 'N/A')})
            </div>
          </div>
        `;
      } else {
        const todayStr = new Date().toISOString().substring(0, 10);
        payoutSectionHtml = `
          <div class="ref-modal__payout-card">
            <h3 class="ref-modal__payout-title">Mark payout paid</h3>
            <div class="ref-modal__group">
              <label class="ref-modal__label">Commission Amount (₹)</label>
              <input type="number" id="payout-amount" class="ref-modal__input" value="${referral.commission || 0}" min="1" step="1" required />
            </div>
            <div class="ref-modal__group">
              <label class="ref-modal__label">Payment Date</label>
              <input type="date" id="payout-date" class="ref-modal__input" value="${todayStr}" required />
            </div>
            <div class="ref-modal__group">
              <label class="ref-modal__label">UTR / Reference Number</label>
              <input type="text" id="payout-ref" class="ref-modal__input" placeholder="e.g. UTR-9982012" required />
            </div>
            <div id="payout-error" class="ref-modal__error" style="display: none;"></div>
            <button type="button" class="ref-modal__btn-payout" id="btn-submit-payout">Record Payout</button>
          </div>
        `;
      }
    }

    modalBackdrop.innerHTML = `
      <div class="ref-modal">
        <div class="ref-modal__header">
          <div>
            <h2 class="ref-modal__title" id="modal-ref-title">Update Referral Status</h2>
            <div class="ref-modal__subtitle">${escapeHtml(referral.applicant)} • ${escapeHtml(referral.refCode)}</div>
          </div>
          <button type="button" class="ref-modal__close-btn" id="modal-close-btn" aria-label="Close modal">&times;</button>
        </div>

        <form id="ref-update-form" class="ref-modal__body">
          <div id="status-error" class="ref-modal__error" style="display: none;"></div>

          <div class="ref-modal__group">
            <label class="ref-modal__label" for="modal-stage-select">Stage</label>
            <select id="modal-stage-select" class="ref-modal__select">
              ${stageOptionsHtml}
            </select>
          </div>

          <!-- Sanctioned amount (shown for Sanctioned) -->
          <div class="ref-modal__group" id="field-sanctioned" style="display: ${referral.status === 'sanctioned' ? 'flex' : 'none'};">
            <label class="ref-modal__label" for="modal-sanctioned-amount">Sanctioned Amount (₹)</label>
            <input type="number" id="modal-sanctioned-amount" class="ref-modal__input" value="${defaultSanctionedAmt}" min="1" step="1" />
          </div>

          <!-- Disbursed amount and date (shown for Disbursed) -->
          <div class="ref-modal__group" id="field-disbursed-amount" style="display: ${referral.status === 'disbursed' ? 'flex' : 'none'};">
            <label class="ref-modal__label" for="modal-disbursed-amount">Disbursed Amount (₹)</label>
            <input type="number" id="modal-disbursed-amount" class="ref-modal__input" value="${defaultDisbursedAmt}" min="1" step="1" />
          </div>
          <div class="ref-modal__group" id="field-disbursed-date" style="display: ${referral.status === 'disbursed' ? 'flex' : 'none'};">
            <label class="ref-modal__label" for="modal-disbursed-date">Disbursed Date</label>
            <input type="date" id="modal-disbursed-date" class="ref-modal__input" value="${defaultDisbursedDate}" />
          </div>

          <!-- Rejection reason (shown for Rejected) -->
          <div class="ref-modal__group" id="field-rejection-reason" style="display: ${referral.status === 'rejected' ? 'flex' : 'none'};">
            <label class="ref-modal__label" for="modal-rejection-reason">Rejection Reason</label>
            <input type="text" id="modal-rejection-reason" class="ref-modal__input" value="${escapeHtml(defaultReason)}" placeholder="e.g. Ineligible credit score" />
          </div>

          <!-- Optional note -->
          <div class="ref-modal__group">
            <label class="ref-modal__label" for="modal-note">Optional Note</label>
            <textarea id="modal-note" class="ref-modal__textarea" placeholder="Add an internal note for this update..."></textarea>
          </div>

          <!-- Payout action for Disbursed referrals -->
          ${payoutSectionHtml}

          <div class="ref-modal__footer">
            <button type="button" class="ref-modal__btn-cancel" id="modal-cancel-btn">Cancel</button>
            <button type="submit" class="ref-modal__btn-save" id="modal-save-btn">Save changes</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modalBackdrop);

    // Modal elements
    const stageSelect = modalBackdrop.querySelector<HTMLSelectElement>('#modal-stage-select')!;
    const fieldSanctioned = modalBackdrop.querySelector<HTMLElement>('#field-sanctioned')!;
    const fieldDisbursedAmount = modalBackdrop.querySelector<HTMLElement>('#field-disbursed-amount')!;
    const fieldDisbursedDate = modalBackdrop.querySelector<HTMLElement>('#field-disbursed-date')!;
    const fieldRejection = modalBackdrop.querySelector<HTMLElement>('#field-rejection-reason')!;
    const statusError = modalBackdrop.querySelector<HTMLElement>('#status-error')!;
    const form = modalBackdrop.querySelector<HTMLFormElement>('#ref-update-form')!;
    const closeBtn = modalBackdrop.querySelector<HTMLButtonElement>('#modal-close-btn')!;
    const cancelBtn = modalBackdrop.querySelector<HTMLButtonElement>('#modal-cancel-btn')!;
    const saveBtn = modalBackdrop.querySelector<HTMLButtonElement>('#modal-save-btn')!;

    function closeModal() {
      modalBackdrop.remove();
    }

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });

    // Toggle fields on stage select change
    stageSelect.addEventListener('change', () => {
      const selectedStage = stageSelect.value;
      fieldSanctioned.style.display = selectedStage === 'sanctioned' ? 'flex' : 'none';
      fieldDisbursedAmount.style.display = selectedStage === 'disbursed' ? 'flex' : 'none';
      fieldDisbursedDate.style.display = selectedStage === 'disbursed' ? 'flex' : 'none';
      fieldRejection.style.display = selectedStage === 'rejected' ? 'flex' : 'none';
    });

    // Handle form submit for status update
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      statusError.style.display = 'none';
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      const stage = stageSelect.value as ReferralStatus;
      const noteInput = modalBackdrop.querySelector<HTMLTextAreaElement>('#modal-note');
      const note = noteInput?.value.trim() || undefined;

      const payload: {
        stage: ReferralStatus;
        amount?: number;
        date?: string;
        reason?: string;
        note?: string;
      } = { stage, note };

      if (stage === 'sanctioned') {
        const amtInput = modalBackdrop.querySelector<HTMLInputElement>('#modal-sanctioned-amount');
        if (amtInput && amtInput.value) {
          payload.amount = parseFloat(amtInput.value);
        }
      } else if (stage === 'disbursed') {
        const amtInput = modalBackdrop.querySelector<HTMLInputElement>('#modal-disbursed-amount');
        const dateInput = modalBackdrop.querySelector<HTMLInputElement>('#modal-disbursed-date');
        if (amtInput && amtInput.value) {
          payload.amount = parseFloat(amtInput.value);
        }
        if (dateInput && dateInput.value) {
          payload.date = dateInput.value;
        }
      } else if (stage === 'rejected') {
        const reasonInput = modalBackdrop.querySelector<HTMLInputElement>('#modal-rejection-reason');
        if (reasonInput && reasonInput.value.trim()) {
          payload.reason = reasonInput.value.trim();
        }
      }

      try {
        await api.updateReferralStatus(referral.id, payload);
        closeModal();
        options.onReferralUpdated?.();
      } catch (err: any) {
        statusError.textContent = err.message || 'Failed to update referral status';
        statusError.style.display = 'block';
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save changes';
      }
    });

    // Handle payout recording if present
    const payoutSubmitBtn = modalBackdrop.querySelector<HTMLButtonElement>('#btn-submit-payout');
    if (payoutSubmitBtn) {
      payoutSubmitBtn.addEventListener('click', async () => {
        const payoutAmountInput = modalBackdrop.querySelector<HTMLInputElement>('#payout-amount')!;
        const payoutDateInput = modalBackdrop.querySelector<HTMLInputElement>('#payout-date')!;
        const payoutRefInput = modalBackdrop.querySelector<HTMLInputElement>('#payout-ref')!;
        const payoutError = modalBackdrop.querySelector<HTMLElement>('#payout-error')!;

        payoutError.style.display = 'none';

        const amount = parseFloat(payoutAmountInput.value);
        const paidAt = payoutDateInput.value;
        const reference = payoutRefInput.value.trim();

        if (isNaN(amount) || amount <= 0) {
          payoutError.textContent = 'Please enter a valid positive commission amount';
          payoutError.style.display = 'block';
          return;
        }
        if (!paidAt) {
          payoutError.textContent = 'Please select a payment date';
          payoutError.style.display = 'block';
          return;
        }
        if (!reference) {
          payoutError.textContent = 'Please enter a UTR or payment reference number';
          payoutError.style.display = 'block';
          return;
        }

        payoutSubmitBtn.disabled = true;
        payoutSubmitBtn.textContent = 'Recording...';

        try {
          await api.recordReferralPayout(referral.id, { amount, paidAt, reference });
          closeModal();
          options.onReferralUpdated?.();
        } catch (err: any) {
          payoutError.textContent = err.message || 'Failed to record payout';
          payoutError.style.display = 'block';
          payoutSubmitBtn.disabled = false;
          payoutSubmitBtn.textContent = 'Record Payout';
        }
      });
    }
  }

  // Initial render
  render(null);

  return {
    update(items: AdminReferral[]) {
      render(items, false);
    },
    showError() {
      render(null, true);
    },
    getActiveStatus() {
      return activeStatus;
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

export const init = initReferralsTable;


