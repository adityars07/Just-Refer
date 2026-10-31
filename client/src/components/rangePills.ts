import { RangeKey } from '../../../shared/types.js';

export function initRangePills(
  container: HTMLElement,
  options: RangeKey[],
  defaultSelected: RangeKey,
  onChange: (selected: RangeKey) => void
) {
  let current = defaultSelected;

  container.innerHTML = options
    .map(
      (opt) => `
      <button
        type="button"
        class="dash-pill ${opt === current ? 'is-active' : ''}"
        data-range="${opt}"
        aria-pressed="${opt === current ? 'true' : 'false'}"
      >
        ${opt}
      </button>
    `
    )
    .join('');

  const buttons = container.querySelectorAll<HTMLButtonElement>('.dash-pill');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selected = btn.dataset.range as RangeKey;
      if (selected === current) return;

      current = selected;
      buttons.forEach((b) => {
        const isActive = b.dataset.range === current;
        b.classList.toggle('is-active', isActive);
        b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      onChange(current);
    });
  });
}
