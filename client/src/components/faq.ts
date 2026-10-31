import { api } from '../api/client.js';
import { MARKETING_FAQS } from '../data/marketing.js';
import { FAQItem } from '../../../shared/types.js';
import { iconChevronDown } from '../icons.js';

export async function initFaq(container: HTMLElement) {
  let faqs: FAQItem[] = MARKETING_FAQS;
  try {
    const res = await api.getFaqs();
    if (res && res.length) faqs = res;
  } catch {
    faqs = MARKETING_FAQS;
  }

  container.innerHTML = `
    <section class="faq" aria-labelledby="faq-heading">
      <div class="faq__wrap">
        <h2 id="faq-heading" class="faq__h2">Questions before joining?</h2>

        <div class="faq__list" role="region" aria-label="Frequently Asked Questions">
          ${faqs
            .map(
              (item, idx) => `
            <div class="faq-item" id="faq-item-${idx}">
              <button
                type="button"
                class="faq-item__trigger"
                aria-expanded="false"
                aria-controls="faq-ans-${idx}"
                id="faq-btn-${idx}"
              >
                <span>${item.question}</span>
                <span class="faq-item__icon">${iconChevronDown(16, 'icon')}</span>
              </button>
              <div
                class="faq-item__content"
                id="faq-ans-${idx}"
                role="region"
                aria-labelledby="faq-btn-${idx}"
              >
                <p><em>${item.answer}</em></p>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </section>
  `;

  const items = container.querySelectorAll<HTMLElement>('.faq-item');
  items.forEach((item) => {
    const trigger = item.querySelector<HTMLButtonElement>('.faq-item__trigger');
    trigger?.addEventListener('click', () => {
      const isAlreadyOpen = item.classList.contains('is-open');

      // Close all items (single-open accordion behavior)
      items.forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('.faq-item__trigger')?.setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked item
      if (!isAlreadyOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}
