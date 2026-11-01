// Styles
import './styles/tokens.css';
import './styles/base.css';
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
import { initTopbar } from './components/topbar.js';
import { initHero } from './components/hero.js';
import { initPublicWebsite } from './components/publicWebsite.js';
import { initPartnersMarquee } from './components/partnersMarquee.js';
import { initFaq } from './components/faq.js';
import { initDashboard } from './components/dashboard.js';
import { initReferralModal } from './components/referralModal.js';
import { initEmiModal } from './components/emiModal.js';
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
    // PAGE A: Public Website
    root.innerHTML = `
      <div id="topbar-mount"></div>
      <main id="main-content">
        <div id="hero-mount"></div>
        <div id="public-mount"></div>
      </main>
      <div id="modal-referral-backdrop" class="modal-backdrop"></div>
      <div id="modal-emi-backdrop" class="modal-backdrop"></div>
      <div id="modal-auth-backdrop" class="auth-overlay"></div>
    `;

    const topbarMount = root.querySelector<HTMLElement>('#topbar-mount')!;
    const heroMount = root.querySelector<HTMLElement>('#hero-mount')!;
    const publicMount = root.querySelector<HTMLElement>('#public-mount')!;
    const refBackdrop = root.querySelector<HTMLElement>('#modal-referral-backdrop')!;
    const emiBackdrop = root.querySelector<HTMLElement>('#modal-emi-backdrop')!;
    const authBackdrop = root.querySelector<HTMLElement>('#modal-auth-backdrop')!;

    const refModal = initReferralModal(refBackdrop);
    const emiModal = initEmiModal(emiBackdrop);

    let topbarController: { reload: () => void } | undefined;

    const authModal = initAuthModal(authBackdrop, {
      onSuccess: () => {
        topbarController?.reload();
      },
    });

    // Initialize Topbar
    topbarController = await initTopbar(topbarMount, {
      onOpenEmi: () => emiModal.open(),
      onOpenAuth: (screen?: 'signin' | 'signup') => authModal.open(screen),
      onLogout: () => {
        // re-rendered automatically
      },
    });

    // Initialize Hero
    initHero(heroMount, () => {
      refModal.open();
    });

    // Initialize Public Website Sections (2.3 - 2.7, 2.10, 2.11)
    await initPublicWebsite(publicMount, {
      onOpenReferralModal: () => {
        refModal.open();
      },
    });

    // Initialize Partners Marquee (2.8)
    const partnersMount = root.querySelector<HTMLElement>('#partners-section-container');
    if (partnersMount) {
      await initPartnersMarquee(partnersMount);
    }

    // Initialize FAQ Accordion (2.9)
    const faqMount = root.querySelector<HTMLElement>('#faq-section-container');
    if (faqMount) {
      await initFaq(faqMount);
    }

    // Footer EMI link
    const footerEmiLink = root.querySelector<HTMLElement>('#footer-link-emi');
    footerEmiLink?.addEventListener('click', (e) => {
      e.preventDefault();
      emiModal.open();
    });
  }
}

// Run after DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
