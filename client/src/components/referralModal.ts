import { api, formatINRAmount } from '../api/client.js';
import { LoanProductId } from '../../../shared/types.js';
import { iconX } from '../icons.js';

interface ReferralModalOptions {
  onSuccess?: () => void;
  defaultProductId?: LoanProductId;
}

const PRODUCTS_INFO = [
  { id: 'home' as LoanProductId, name: 'Home Loan', minAmount: 5000000, ratePct: 0.3 },
  { id: 'lap' as LoanProductId, name: 'Loan Against Property', minAmount: 10000000, ratePct: 0.5 },
  { id: 'personal' as LoanProductId, name: 'Personal Loan', minAmount: 500000, ratePct: 1.0 },
  { id: 'business' as LoanProductId, name: 'Business Loan', minAmount: 1000000, ratePct: 1.0 },
];

export function initReferralModal(backdropEl: HTMLElement, options: ReferralModalOptions = {}) {
  let selectedProd = PRODUCTS_INFO.find((p) => p.id === options.defaultProductId) || PRODUCTS_INFO[0];

  backdropEl.innerHTML = `
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-referral-title">
      <div class="modal-card__header">
        <div>
          <h3 id="modal-referral-title" class="modal-card__title">Create Referral</h3>
          <p class="modal-card__sub" id="modal-product-sub">
            ${selectedProd.name} · ${selectedProd.ratePct}% payout
          </p>
        </div>
        <button type="button" class="modal-card__btn-close" id="modal-btn-close" aria-label="Close dialog">
          ${iconX(18, 'icon')}
        </button>
      </div>

      <form class="modal-form" id="referral-form">
        <div class="modal-form__field">
          <label class="modal-form__label" for="ref-product">Loan Product</label>
          <select id="ref-product" class="modal-form__select" required>
            ${PRODUCTS_INFO.map(
              (p) =>
                `<option value="${p.id}" ${p.id === selectedProd.id ? 'selected' : ''}>
                  ${p.name} (${p.ratePct}% payout)
                </option>`
            ).join('')}
          </select>
        </div>

        <div class="modal-form__field">
          <label class="modal-form__label" for="ref-name">Applicant Name</label>
          <input
            type="text"
            id="ref-name"
            class="modal-form__input"
            placeholder="e.g. Rajesh Sharma"
            required
            minlength="2"
            maxlength="80"
          />
        </div>

        <div class="modal-form__field">
          <label class="modal-form__label" for="ref-phone">Applicant Phone Number</label>
          <input
            type="tel"
            id="ref-phone"
            class="modal-form__input"
            placeholder="10-digit mobile number"
            pattern="[0-9]{10}"
            required
          />
        </div>

        <div class="modal-form__field">
          <label class="modal-form__label" for="ref-city">City</label>
          <input
            type="text"
            id="ref-city"
            class="modal-form__input"
            placeholder="e.g. Mumbai"
            required
          />
        </div>

        <div class="modal-form__field">
          <label class="modal-form__label" for="ref-amount">Loan Amount (₹)</label>
          <input
            type="number"
            id="ref-amount"
            class="modal-form__input"
            value="${selectedProd.minAmount}"
            min="${selectedProd.minAmount}"
            step="50000"
            required
          />
        </div>

        <div class="modal-form__preview">
          <span>Estimated Commission:</span>
          <span class="modal-form__preview-comm" id="ref-comm-preview">
            ${formatINRAmount(Math.round(selectedProd.minAmount * (selectedProd.ratePct / 100)))}
          </span>
        </div>

        <div class="modal-form__error" id="ref-form-error" style="display: none;"></div>

        <button type="submit" class="modal-form__btn-submit" id="ref-submit-btn">
          <span>Submit Loan Referral →</span>
        </button>
      </form>
    </div>
  `;

  const form = backdropEl.querySelector<HTMLFormElement>('#referral-form')!;
  const closeBtn = backdropEl.querySelector<HTMLButtonElement>('#modal-btn-close')!;
  const productSelect = backdropEl.querySelector<HTMLSelectElement>('#ref-product')!;
  const amountInput = backdropEl.querySelector<HTMLInputElement>('#ref-amount')!;
  const commPreview = backdropEl.querySelector<HTMLElement>('#ref-comm-preview')!;
  const productSub = backdropEl.querySelector<HTMLElement>('#modal-product-sub')!;
  const errorEl = backdropEl.querySelector<HTMLElement>('#ref-form-error')!;
  const submitBtn = backdropEl.querySelector<HTMLButtonElement>('#ref-submit-btn')!;

  function updateCommission() {
    const pId = productSelect.value as LoanProductId;
    selectedProd = PRODUCTS_INFO.find((p) => p.id === pId) || PRODUCTS_INFO[0];
    productSub.textContent = `${selectedProd.name} · ${selectedProd.ratePct}% payout`;

    const amt = parseFloat(amountInput.value) || 0;
    const comm = Math.round(amt * (selectedProd.ratePct / 100));
    commPreview.textContent = formatINRAmount(comm);
  }

  productSelect.addEventListener('change', () => {
    const pId = productSelect.value as LoanProductId;
    selectedProd = PRODUCTS_INFO.find((p) => p.id === pId) || PRODUCTS_INFO[0];
    amountInput.min = String(selectedProd.minAmount);
    if (parseFloat(amountInput.value) < selectedProd.minAmount) {
      amountInput.value = String(selectedProd.minAmount);
    }
    updateCommission();
  });

  amountInput.addEventListener('input', updateCommission);

  function closeModal() {
    backdropEl.classList.remove('is-open');
    errorEl.style.display = 'none';
  }

  closeBtn.addEventListener('click', closeModal);
  backdropEl.addEventListener('click', (e) => {
    if (e.target === backdropEl) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdropEl.classList.contains('is-open')) {
      closeModal();
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.style.display = 'none';

    const name = (form.querySelector('#ref-name') as HTMLInputElement).value.trim();
    const phone = (form.querySelector('#ref-phone') as HTMLInputElement).value.trim();
    const city = (form.querySelector('#ref-city') as HTMLInputElement).value.trim();
    const productId = productSelect.value as LoanProductId;
    const loanAmount = parseFloat(amountInput.value) || 0;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      await api.createReferral({
        applicant: name,
        phone,
        city,
        productId,
        loanAmount,
      });

      closeModal();
      form.reset();
      options.onSuccess?.();
    } catch (err: any) {
      errorEl.textContent = err.message || 'Failed to submit referral. Please try again.';
      errorEl.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Loan Referral →';
    }
  });

  return {
    open(productId?: LoanProductId) {
      if (productId) {
        productSelect.value = productId;
        const p = PRODUCTS_INFO.find((x) => x.id === productId);
        if (p) {
          selectedProd = p;
          amountInput.value = String(p.minAmount);
          amountInput.min = String(p.minAmount);
        }
      }
      updateCommission();
      backdropEl.classList.add('is-open');
      (form.querySelector('#ref-name') as HTMLInputElement).focus();
    },
    close: closeModal,
  };
}
