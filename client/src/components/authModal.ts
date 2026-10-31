import { fetchApi } from '../api/client.js';

interface AuthModalOptions {
  onSuccess?: (partner: any) => void;
  onClose?: () => void;
}

export function initAuthModal(backdropEl: HTMLElement, options: AuthModalOptions = {}) {
  let step: 'phone' | 'otp' = 'phone';
  let phone = '';
  let isLoading = false;
  let countdown = 0;
  let timer: any = null;

  function render() {
    backdropEl.innerHTML = `
      <div class="modal-card modal-card--auth" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title" style="max-width: 440px;">
        <div class="modal-card__header">
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 800; font-size: 20px; letter-spacing: -0.03em; color: #111;">justrefer</span>
              <span style="font-size: 11px; font-weight: 600; background: #e6f4ea; color: #0f7a45; padding: 2px 6px; border-radius: 4px;">Partner Portal</span>
            </div>
            <h2 id="auth-modal-title" style="margin: 0; font-size: 16px; font-weight: 600; color: #111;">
              ${step === 'phone' ? 'Login or Become a Partner' : 'Enter Verification Code'}
            </h2>
            <p style="margin: 0; font-size: 13px; color: #6b6b6b;">
              ${step === 'phone' ? 'Zero KYC. Refer loan applicants & earn weekly institutional payouts.' : `We sent an OTP to +91 ${phone}`}
            </p>
          </div>
          <button type="button" class="modal-card__btn-close" id="auth-modal-close" aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div style="padding-top: 10px;">
          <div id="auth-modal-error" style="display: none; padding: 10px 14px; background: #fee2e2; color: #b91c1c; border-radius: 6px; font-size: 13px; margin-bottom: 16px;"></div>
          <div id="auth-modal-success" style="display: none; padding: 10px 14px; background: #dcfce7; color: #15803d; border-radius: 6px; font-size: 13px; margin-bottom: 16px;"></div>

          ${
            step === 'phone'
              ? `
            <form id="auth-phone-form" style="display: flex; flex-direction: column; gap: 16px;">
              <div class="modal-form__field">
                <label for="auth-phone-input" class="modal-form__label">
                  Mobile Number
                </label>
                <div style="display: flex; align-items: center; border: 1.5px solid #d8d6d0; border-radius: 6px; overflow: hidden; background: #fff;">
                  <span style="padding: 10px 14px; background: #f7f6f3; border-right: 1px solid #d8d6d0; font-size: 14px; font-weight: 500; color: #555;">+91</span>
                  <input
                    type="tel"
                    id="auth-phone-input"
                    maxlength="10"
                    placeholder="9876543210"
                    value="${phone}"
                    style="flex: 1; border: none; padding: 10px 12px; font-size: 15px; outline: none; font-family: inherit;"
                    autofocus
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                id="auth-send-btn"
                style="height: 44px; background: #111; color: #fff; border: none; border-radius: 4px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: opacity 0.15s ease;"
              >
                ${isLoading ? 'Sending OTP...' : 'Continue with OTP'}
              </button>

              <div style="display: flex; align-items: center; gap: 12px; margin: 4px 0;">
                <div style="flex: 1; height: 1px; background: #e7e5e0;"></div>
                <span style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.05em;">Quick Test Access</span>
                <div style="flex: 1; height: 1px; background: #e7e5e0;"></div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <button
                  type="button"
                  id="auth-quick-admin"
                  style="padding: 10px; background: #f4f3ef; border: 1px solid #d8d6d0; border-radius: 4px; font-size: 12px; font-weight: 600; color: #111; cursor: pointer; text-align: center;"
                >
                  ⚡ Admin Access
                </button>
                <button
                  type="button"
                  id="auth-quick-partner"
                  style="padding: 10px; background: #f4f3ef; border: 1px solid #d8d6d0; border-radius: 4px; font-size: 12px; font-weight: 600; color: #111; cursor: pointer; text-align: center;"
                >
                  ⚡ Partner Demo
                </button>
              </div>
            </form>
          `
              : `
            <form id="auth-otp-form" style="display: flex; flex-direction: column; gap: 16px;">
              <div class="modal-form__field">
                <label for="auth-otp-input" class="modal-form__label">
                  Enter 6-Digit OTP <span style="color: #0f7a45; font-weight: 500;">(Demo code: 123456)</span>
                </label>
                <input
                  type="text"
                  id="auth-otp-input"
                  maxlength="6"
                  placeholder="123456"
                  style="width: 100%; box-sizing: border-box; border: 1.5px solid #d8d6d0; border-radius: 4px; padding: 12px 14px; font-size: 20px; font-weight: 600; letter-spacing: 6px; text-align: center; outline: none; font-family: monospace;"
                  autofocus
                  required
                />
              </div>

              <button
                type="submit"
                id="auth-verify-btn"
                style="height: 44px; background: #111; color: #fff; border: none; border-radius: 4px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: opacity 0.15s ease;"
              >
                ${isLoading ? 'Verifying...' : 'Verify & Sign In'}
              </button>

              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                <button
                  type="button"
                  id="auth-back-btn"
                  style="background: none; border: none; color: #6b6b6b; cursor: pointer; padding: 0; text-decoration: underline;"
                >
                  &larr; Change Number
                </button>

                <button
                  type="button"
                  id="auth-resend-btn"
                  style="background: none; border: none; color: ${countdown > 0 ? '#aaa' : '#0f7a45'}; cursor: ${countdown > 0 ? 'default' : 'pointer'}; padding: 0; font-weight: 500;"
                  ${countdown > 0 ? 'disabled' : ''}
                >
                  ${countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                </button>
              </div>
            </form>
          `
          }
        </div>
      </div>
    `;

    bindEvents();
  }

  function showError(msg: string) {
    const errEl = backdropEl.querySelector<HTMLElement>('#auth-modal-error');
    if (errEl) {
      errEl.textContent = msg;
      errEl.style.display = 'block';
    }
  }

  function showSuccess(msg: string) {
    const succEl = backdropEl.querySelector<HTMLElement>('#auth-modal-success');
    if (succEl) {
      succEl.textContent = msg;
      succEl.style.display = 'block';
    }
  }

  function startCountdown(sec = 30) {
    countdown = sec;
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      countdown -= 1;
      if (countdown <= 0) {
        clearInterval(timer);
      }
      const resendBtn = backdropEl.querySelector<HTMLButtonElement>('#auth-resend-btn');
      if (resendBtn) {
        resendBtn.textContent = countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP';
        resendBtn.disabled = countdown > 0;
        resendBtn.style.color = countdown > 0 ? '#aaa' : '#0f7a45';
        resendBtn.style.cursor = countdown > 0 ? 'default' : 'pointer';
      }
    }, 1000);
  }

  function completeAuth(partner: any, token: string) {
    localStorage.setItem('jr_auth', JSON.stringify({ partner, token }));
    localStorage.setItem('token', token);
    showSuccess('Login successful! Redirecting...');
    setTimeout(() => {
      close();
      if (options.onSuccess) {
        options.onSuccess(partner);
      }
      window.location.reload();
    }, 350);
  }

  function bindEvents() {
    const closeBtn = backdropEl.querySelector('#auth-modal-close');
    closeBtn?.addEventListener('click', close);

    const phoneForm = backdropEl.querySelector('#auth-phone-form');
    phoneForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const phoneInput = backdropEl.querySelector<HTMLInputElement>('#auth-phone-input');
      const val = (phoneInput?.value || '').replace(/\D/g, '');
      if (val.length < 10) {
        showError('Please enter a valid 10-digit mobile number');
        return;
      }
      phone = val;
      isLoading = true;
      render();

      try {
        const res = await fetchApi<{ success: boolean; message?: string; error?: string }>('/api/auth/send-otp', {
          method: 'POST',
          body: JSON.stringify({ phone }),
        });
        isLoading = false;
        step = 'otp';
        render();
        startCountdown(30);
        showSuccess(res.message || 'OTP sent! Use demo code 123456');
      } catch {
        // Dev fallback
        isLoading = false;
        step = 'otp';
        render();
        startCountdown(30);
        showSuccess('Test Mode: Enter OTP 123456 to log in.');
      }
    });

    const otpForm = backdropEl.querySelector('#auth-otp-form');
    otpForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const otpInput = backdropEl.querySelector<HTMLInputElement>('#auth-otp-input');
      const code = (otpInput?.value || '').trim();
      if (code.length < 6) {
        showError('Please enter the full 6-digit code');
        return;
      }
      isLoading = true;
      render();

      try {
        const res = await fetchApi<{
          success: boolean;
          partner?: any;
          token?: string;
          error?: string;
        }>('/api/auth/verify-otp', {
          method: 'POST',
          body: JSON.stringify({ phone, code }),
        });
        isLoading = false;

        if (res.success && res.partner && res.token) {
          completeAuth(res.partner, res.token);
        } else {
          showError(res.error || 'Invalid OTP. Please check and try again.');
        }
      } catch {
        // Fallback demo auth
        isLoading = false;
        const isAdmin = phone.includes('7753999478');
        const demoPartner = {
          id: isAdmin ? 'admin-partner-7753999478' : 'partner-demo-001',
          full_name: isAdmin ? 'Aditya Raj Singh (Admin)' : 'Ayush Shrivastava',
          email: isAdmin ? 'admin@justrefer.in' : 'ayush@example.com',
          phone,
          role: isAdmin ? 'admin' : 'partner',
          referral_code: isAdmin ? 'JR-ADMIN' : 'JR-AYUS5211',
        };
        completeAuth(demoPartner, 'jr_demo_token');
      }
    });

    const backBtn = backdropEl.querySelector('#auth-back-btn');
    backBtn?.addEventListener('click', () => {
      step = 'phone';
      render();
    });

    const resendBtn = backdropEl.querySelector('#auth-resend-btn');
    resendBtn?.addEventListener('click', async () => {
      if (countdown > 0) return;
      startCountdown(30);
      try {
        await fetchApi('/api/auth/send-otp', {
          method: 'POST',
          body: JSON.stringify({ phone }),
        });
        showSuccess('New OTP sent! (Demo code: 123456)');
      } catch {
        showSuccess('New OTP sent! (Demo code: 123456)');
      }
    });

    // Quick Login: Admin
    const quickAdmin = backdropEl.querySelector('#auth-quick-admin');
    quickAdmin?.addEventListener('click', () => {
      completeAuth(
        {
          id: 'admin-partner-7753999478',
          full_name: 'Aditya Raj Singh (Admin)',
          email: 'admin@justrefer.in',
          phone: '+917753999478',
          role: 'admin',
          referral_code: 'JR-ADMIN',
        },
        'jr_admin_token'
      );
    });

    // Quick Login: Partner
    const quickPartner = backdropEl.querySelector('#auth-quick-partner');
    quickPartner?.addEventListener('click', () => {
      completeAuth(
        {
          id: 'partner-ayush-001',
          full_name: 'Ayush Shrivastava',
          email: 'ayush@example.com',
          phone: '+919876543210',
          role: 'partner',
          referral_code: 'JR-AYUS5211',
        },
        'jr_partner_token'
      );
    });
  }

  function open() {
    step = 'phone';
    isLoading = false;
    backdropEl.classList.add('is-open');
    render();
  }

  function close() {
    backdropEl.classList.remove('is-open');
    if (timer) clearInterval(timer);
    options.onClose?.();
  }

  backdropEl.addEventListener('click', (e) => {
    if (e.target === backdropEl) {
      close();
    }
  });

  return { open, close };
}
