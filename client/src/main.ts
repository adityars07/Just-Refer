// Styles
import './styles/tokens.css';
import './styles/base.css';
import './styles/landing.css';
import './styles/topbar.css';
import './styles/profileMenu.css';
import './styles/hero.css';
import './styles/lenders.css';
import './styles/audience.css';
import './styles/directPayouts.css';
import './styles/matchingEngine.css';
import './styles/whyGrid.css';
import './styles/partners.css';
import './styles/faq.css';
import './styles/closingBand.css';
import './styles/footer.css';
import './styles/dashboard.css';
import './styles/modal.css';
import './styles/auth.css';
import './styles/admin.css';
import './styles/adminHeader.css';
import './styles/summaryBand.css';
import './styles/referralsTable.css';
import './styles/payoutRunCard.css';
import './styles/attentionList.css';
import './styles/withdraw.css';
import './styles/adminWithdrawals.css';

// Components
import { initLanding } from './components/landing.js';
import { initDashboard } from './components/dashboard.js';
import { initReferralModal } from './components/referralModal.js';
import { initAuthModal } from './components/authModal.js';
import { initAdminView } from './components/adminView.js';
import { LoanProductId } from '../../shared/types.js';

function ensureFavicon() {
  let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = '/favicon.svg';
}

async function bootstrap() {
  ensureFavicon();
  const root = document.getElementById('app');
  if (!root) return;

  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  const isAdmin = path.endsWith('/admin') || path.includes('/admin') || hash === '#admin';
  if (isAdmin) {
    // PAGE C: Admin Dashboard
    await initAdminView(root);
    return;
  }

  const isDashboard = path.endsWith('/dashboard') || path.includes('dashboard') || hash === '#dashboard';

  if (isDashboard) {
    // PAGE B: Partner Dashboard
    root.innerHTML = `
      <div id="dash-mount"></div>
      <div id="modal-referral-backdrop" class="modal-backdrop"></div>
    `;

    const dashMount = root.querySelector<HTMLElement>('#dash-mount')!;
    const refBackdrop = root.querySelector<HTMLElement>('#modal-referral-backdrop')!;

    let dashController: { reload: () => Promise<void> } | undefined;

    const refModal = initReferralModal(refBackdrop, {
      onSuccess: async () => {
        if (dashController) await dashController.reload();
      },
    });

    dashController = await initDashboard(dashMount, {
      onOpenReferralModal: (productId?: LoanProductId) => {
        refModal.open(productId);
      },
    });
  } else {
    // PAGE A: Public Landing Page (Redesigned)
    root.innerHTML = `
      <div id="landing-mount"></div>
      <div id="modal-auth-backdrop" class="auth-overlay"></div>
    `;

    const landingMount = root.querySelector<HTMLElement>('#landing-mount')!;
    const authBackdrop = root.querySelector<HTMLElement>('#modal-auth-backdrop')!;

    const authModal = initAuthModal(authBackdrop, {
      onSuccess: () => {
        // Reload the landing page to update nav state
        initLanding(landingMount, {
          onOpenAuth: (screen?: 'signin' | 'signup') => authModal.open(screen),
        });
      },
    });

    await initLanding(landingMount, {
      onOpenAuth: (screen?: 'signin' | 'signup') => authModal.open(screen),
    });
  }
}

// Run after DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
