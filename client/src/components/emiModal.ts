import { iconX } from '../icons.js';
import { formatINRAmount } from '../api/client.js';

export function initEmiModal(backdropEl: HTMLElement) {
  backdropEl.innerHTML = `
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-emi-title">
      <div class="modal-card__header">
        <div>
          <h3 id="modal-emi-title" class="modal-card__title">Loan EMI Calculator</h3>
          <p class="modal-card__sub">Calculate monthly loan repayments instantly</p>
        </div>
        <button type="button" class="modal-card__btn-close" id="emi-btn-close" aria-label="Close EMI calculator">
          ${iconX(18, 'icon')}
        </button>
      </div>

      <div class="modal-form">
        <div class="modal-form__field">
          <label class="modal-form__label" for="emi-amount">Loan Amount (₹)</label>
          <input type="number" id="emi-amount" class="modal-form__input" value="5000000" step="100000" min="100000" />
        </div>

        <div class="modal-form__field">
          <label class="modal-form__label" for="emi-rate">Interest Rate (% p.a.)</label>
          <input type="number" id="emi-rate" class="modal-form__input" value="8.5" step="0.05" min="1" max="30" />
        </div>

        <div class="modal-form__field">
          <label class="modal-form__label" for="emi-tenure">Tenure (Years)</label>
          <input type="number" id="emi-tenure" class="modal-form__input" value="20" min="1" max="30" />
        </div>

        <div class="modal-form__preview" style="flex-direction: column; align-items: flex-start; gap: 8px;">
          <div style="display: flex; justify-content: space-between; width: 100%;">
            <span>Monthly EMI:</span>
            <strong class="modal-form__preview-comm" id="emi-result">₹43,391</strong>
          </div>
          <div style="display: flex; justify-content: space-between; width: 100%; font-size: 12px; color: var(--muted);">
            <span>Total Interest Payable:</span>
            <span id="emi-total-interest">₹54,13,879</span>
          </div>
        </div>
      </div>
    </div>
  `;

  const amountInput = backdropEl.querySelector<HTMLInputElement>('#emi-amount')!;
  const rateInput = backdropEl.querySelector<HTMLInputElement>('#emi-rate')!;
  const tenureInput = backdropEl.querySelector<HTMLInputElement>('#emi-tenure')!;
  const emiResult = backdropEl.querySelector<HTMLElement>('#emi-result')!;
  const interestResult = backdropEl.querySelector<HTMLElement>('#emi-total-interest')!;
  const closeBtn = backdropEl.querySelector<HTMLButtonElement>('#emi-btn-close')!;

  function calculate() {
    const P = parseFloat(amountInput.value) || 0;
    const annualRate = parseFloat(rateInput.value) || 0;
    const years = parseFloat(tenureInput.value) || 0;

    if (P <= 0 || annualRate <= 0 || years <= 0) {
      emiResult.textContent = '₹0';
      interestResult.textContent = '₹0';
      return;
    }

    const r = annualRate / 12 / 100;
    const n = years * 12;

    const emi = Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    emiResult.textContent = formatINRAmount(emi);
    interestResult.textContent = formatINRAmount(Math.max(0, totalInterest));
  }

  [amountInput, rateInput, tenureInput].forEach((el) => {
    el.addEventListener('input', calculate);
  });

  function close() {
    backdropEl.classList.remove('is-open');
  }

  closeBtn.addEventListener('click', close);
  backdropEl.addEventListener('click', (e) => {
    if (e.target === backdropEl) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdropEl.classList.contains('is-open')) {
      close();
    }
  });

  calculate();

  return {
    open() {
      calculate();
      backdropEl.classList.add('is-open');
    },
    close,
  };
}
