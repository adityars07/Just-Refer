export function initCopyCode(btnEl: HTMLButtonElement, code: string) {
  let timeoutId: number | undefined;

  btnEl.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Fallback if clipboard API is not available
      const tempInput = document.createElement('input');
      tempInput.value = code;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
    }

    btnEl.textContent = 'Copied';
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => {
      btnEl.textContent = 'Copy';
    }, 1800);
  });
}
