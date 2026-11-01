import { api, formatFullINR } from '../api/client.js';
import { BankAccount } from '../../../shared/types.js';

export function showToast(message: string) {
  const existing = document.querySelector('.jr-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'jr-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

export async function openWithdrawModal(opts: {
  available: number;
  onSuccess: () => void;
}) {
  const existingModal = document.getElementById('wd-modal');
  if (existingModal) existingModal.remove();

  // Fetch saved bank details
  let savedBank: BankAccount | null = null;
  try {
    savedBank = await api.getBankAccount();
  } catch {
    // no saved details
  }

  const hasSaved = !!(savedBank && savedBank.holderName);
  let editMode = !hasSaved;

  const backdrop = document.createElement('div');
  backdrop.id = 'wd-modal';
  backdrop.className = 'wd-modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');

  function renderModal() {
    const availFormatted = formatFullINR(opts.available);

    const bankFieldsHtml = editMode
      ? `
        <div class="wd-modal__group">
          <label class="wd-modal__label" for="wd-holder">Account Holder Name</label>
          <input type="text" id="wd-holder" class="wd-modal__input"
            value="${escapeAttr(savedBank?.holderName || '')}"
            placeholder="Full name as per bank records" autocomplete="name" />
        </div>
        <div class="wd-modal__group">
          <label class="wd-modal__label" for="wd-accnum">Account Number</label>
          <input type="text" id="wd-accnum" class="wd-modal__input"
            value="" placeholder="9-18 digit account number" inputmode="numeric" autocomplete="off" />
        </div>
        <div class="wd-modal__group">
          <label class="wd-modal__label" for="wd-ifsc">IFSC Code</label>
          <div class="wd-modal__ifsc-row">
            <input type="text" id="wd-ifsc" class="wd-modal__input"
              value="${escapeAttr(savedBank?.ifsc || '')}"
              placeholder="e.g. HDFC0000123" maxlength="11" style="text-transform: uppercase;" autocomplete="off" />
            <span id="wd-ifsc-tick" style="display: none;" class="wd-modal__ifsc-tick">✓</span>
          </div>
          <div id="wd-ifsc-name" class="wd-modal__ifsc-name" style="display: none;"></div>
        </div>
      `
      : `
        <div class="wd-modal__group">
          <label class="wd-modal__label">Account Holder Name</label>
          <div style="font-size: 14px; color: #111; padding: 4px 0;">${escapeHtml(savedBank?.holderName || '')}</div>
        </div>
        <div class="wd-modal__group">
          <label class="wd-modal__label">Account Number</label>
          <div style="font-size: 14px; color: #111; padding: 4px 0;">${escapeHtml(savedBank?.accountNumberMasked || '')}</div>
        </div>
        <div class="wd-modal__group">
          <label class="wd-modal__label">IFSC Code</label>
          <div style="font-size: 14px; color: #111; padding: 4px 0;">${escapeHtml(savedBank?.ifsc || '')}</div>
          ${savedBank?.bankName ? `<div class="wd-modal__ifsc-name" style="display: block;">${escapeHtml(savedBank.bankName)}</div>` : ''}
        </div>
      `;

    const sectionTitleHtml = hasSaved && !editMode
      ? `<h3 class="wd-modal__section-title">
           Bank Account Details
           <button type="button" class="wd-modal__edit-link" id="wd-edit-bank">Edit</button>
         </h3>`
      : `<h3 class="wd-modal__section-title">Bank Account Details</h3>`;

    backdrop.innerHTML = `
      <div class="wd-modal">
        <div class="wd-modal__header">
          <h2 class="wd-modal__title">Withdraw commission</h2>
          <button type="button" class="wd-modal__close-btn" id="wd-close" aria-label="Close">&times;</button>
        </div>
        <form id="wd-form" class="wd-modal__body">
          <div class="wd-modal__avail-box">
            <span class="wd-modal__avail-lbl">Available for Payout</span>
            <span class="wd-modal__avail-amount">${availFormatted}</span>
          </div>

          <div id="wd-error" class="wd-modal__error" style="display: none;"></div>

          <div class="wd-modal__group">
            <label class="wd-modal__label" for="wd-amount">Withdrawal Amount</label>
            <div class="wd-modal__input-row">
              <span class="wd-modal__input-prefix">₹</span>
              <input type="text" id="wd-amount" class="wd-modal__input"
                placeholder="Enter amount" inputmode="numeric" autocomplete="off" />
              <button type="button" class="wd-modal__btn-max" id="wd-btn-max">MAX</button>
            </div>
          </div>

          ${sectionTitleHtml}
          ${bankFieldsHtml}

          ${editMode ? `
            <label class="wd-modal__check-row">
              <input type="checkbox" id="wd-save-details" checked />
              Save these details for future withdrawals
            </label>
          ` : ''}

          <p class="wd-modal__note">Payout will be done within 15 business days.</p>

          <div class="wd-modal__footer">
            <button type="button" class="wd-modal__btn-cancel" id="wd-cancel">Cancel</button>
            <button type="submit" class="wd-modal__btn-submit" id="wd-submit">
              Withdraw ${availFormatted}
            </button>
          </div>
        </form>
      </div>
    `;

    // Bind events
    const closeBtn = backdrop.querySelector<HTMLButtonElement>('#wd-close')!;
    const cancelBtn = backdrop.querySelector<HTMLButtonElement>('#wd-cancel')!;
    const submitBtn = backdrop.querySelector<HTMLButtonElement>('#wd-submit')!;
    const amountInput = backdrop.querySelector<HTMLInputElement>('#wd-amount')!;
    const maxBtn = backdrop.querySelector<HTMLButtonElement>('#wd-btn-max')!;
    const form = backdrop.querySelector<HTMLFormElement>('#wd-form')!;
    const errorEl = backdrop.querySelector<HTMLElement>('#wd-error')!;
    const editBankBtn = backdrop.querySelector<HTMLButtonElement>('#wd-edit-bank');

    function closeModal() { backdrop.remove(); }
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });

    // MAX button
    maxBtn.addEventListener('click', () => {
      amountInput.value = String(opts.available);
      updateSubmitLabel();
    });

    // Format the amount for submit button label
    function updateSubmitLabel() {
      const raw = parseFloat(amountInput.value.replace(/,/g, ''));
      if (!isNaN(raw) && raw > 0) {
        submitBtn.textContent = `Withdraw ${formatFullINR(raw)}`;
      } else {
        submitBtn.textContent = `Withdraw ${availFormatted}`;
      }
    }
    amountInput.addEventListener('input', updateSubmitLabel);

    // Edit bank button
    if (editBankBtn) {
      editBankBtn.addEventListener('click', () => {
        editMode = true;
        renderModal();
      });
    }

    // IFSC lookup
    const ifscInput = backdrop.querySelector<HTMLInputElement>('#wd-ifsc');
    if (ifscInput) {
      let ifscTimer: any;
      ifscInput.addEventListener('input', () => {
        ifscInput.value = ifscInput.value.toUpperCase();
        clearTimeout(ifscTimer);
        const tickEl = backdrop.querySelector<HTMLElement>('#wd-ifsc-tick');
        const nameEl = backdrop.querySelector<HTMLElement>('#wd-ifsc-name');
        if (tickEl) tickEl.style.display = 'none';
        if (nameEl) nameEl.style.display = 'none';

        const code = ifscInput.value.trim();
        if (/^[A-Z]{4}0[A-Z0-9]{6}$/.test(code)) {
          ifscTimer = setTimeout(async () => {
            try {
              const result = await api.lookupIFSC(code);
              if (result.valid && result.bankName) {
                if (tickEl) tickEl.style.display = 'flex';
                if (nameEl) {
                  nameEl.textContent = result.bankName;
                  nameEl.style.display = 'block';
                }
              }
            } catch { /* skip */ }
          }, 300);
        }
      });
      // Trigger lookup for pre-filled IFSC
      if (ifscInput.value.length === 11) {
        ifscInput.dispatchEvent(new Event('input'));
      }
    }

    // Handle submit
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorEl.style.display = 'none';

      const amountStr = amountInput.value.replace(/,/g, '').trim();
      const amount = parseFloat(amountStr);

      if (isNaN(amount) || amount <= 0) {
        errorEl.textContent = 'Please enter a valid withdrawal amount';
        errorEl.style.display = 'block';
        return;
      }
      if (amount < 500) {
        errorEl.textContent = 'Minimum withdrawal amount is ₹500';
        errorEl.style.display = 'block';
        return;
      }
      if (amount > opts.available) {
        errorEl.textContent = `Amount exceeds available balance of ${availFormatted}`;
        errorEl.style.display = 'block';
        return;
      }

      const payload: any = { amount };

      if (editMode) {
        const holderInput = backdrop.querySelector<HTMLInputElement>('#wd-holder');
        const accInput = backdrop.querySelector<HTMLInputElement>('#wd-accnum');
        const ifscInp = backdrop.querySelector<HTMLInputElement>('#wd-ifsc');
        const saveCheck = backdrop.querySelector<HTMLInputElement>('#wd-save-details');

        const holderName = holderInput?.value.trim() || '';
        const accountNumber = accInput?.value.replace(/\s/g, '') || '';
        const ifsc = (ifscInp?.value || '').trim().toUpperCase();

        if (!/^[A-Za-z\s.'-]{2,60}$/.test(holderName)) {
          errorEl.textContent = 'Please enter a valid account holder name (2-60 letters)';
          errorEl.style.display = 'block';
          return;
        }
        if (!/^\d{9,18}$/.test(accountNumber)) {
          errorEl.textContent = 'Please enter a valid account number (9-18 digits)';
          errorEl.style.display = 'block';
          return;
        }
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
          errorEl.textContent = 'Please enter a valid IFSC code';
          errorEl.style.display = 'block';
          return;
        }

        payload.holderName = holderName;
        payload.accountNumber = accountNumber;
        payload.ifsc = ifsc;
        payload.saveDetails = saveCheck?.checked !== false;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing...';

      try {
        await api.createWithdrawal(payload);
        closeModal();
        showToast('Withdrawal requested');
        opts.onSuccess();
      } catch (err: any) {
        errorEl.textContent = err.message || 'Failed to process withdrawal';
        errorEl.style.display = 'block';
        submitBtn.disabled = false;
        updateSubmitLabel();
      }
    });
  }

  renderModal();
  document.body.appendChild(backdrop);
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}

