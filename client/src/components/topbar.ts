import { initProfileMenu } from './profileMenu.js';
import { iconChevronDown } from '../icons.js';

interface TopbarOptions {
  onOpenEmi: () => void;
  onOpenAuth: () => void;
  onLogout?: () => void;
}

export function getStoredUser(): any | null {
  try {
    const raw = localStorage.getItem('jr_auth');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.partner) {
        return parsed.partner;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export async function initTopbar(container: HTMLElement, options: TopbarOptions) {
  function render() {
    const stored = getStoredUser();
    const isLoggedIn = !!stored;

    const fullName = stored?.full_name || stored?.name || '';
    const firstName = fullName ? fullName.trim().split(' ')[0] : '';
    const initial = firstName ? firstName.charAt(0).toUpperCase() : 'P';

    container.innerHTML = `
      <header class="topbar" role="banner">
        <div class="topbar__inner">
          <!-- 1. Logo "justrefer" -->
          <a href="/" class="topbar__logo">justrefer</a>

          <!-- 2. Nav links: Products ▾, EMI Calculator, Check CIBIL Free -->
          <nav class="topbar__nav" aria-label="Main Navigation">
            <!-- Products with Dropdown -->
            <div class="topbar__nav-item-wrap" id="topbar-products-wrap">
              <button
                type="button"
                class="topbar__link"
                id="topbar-products-btn"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span>Products</span>
                <span class="topbar__link-chevron">${iconChevronDown(14, 'icon')}</span>
              </button>

              <div class="topbar-dropdown topbar-dropdown--products" id="topbar-products-menu" style="display: none;" role="menu">
                <a href="#products" class="topbar-dropdown__item" role="menuitem">
                  <span>Home Loan</span>
                </a>
                <a href="#products" class="topbar-dropdown__item" role="menuitem">
                  <span>Business Loan</span>
                </a>
                <a href="#products" class="topbar-dropdown__item" role="menuitem">
                  <span>Personal Loan</span>
                </a>
                <a href="#products" class="topbar-dropdown__item" role="menuitem">
                  <span>Loan Against Property</span>
                </a>
              </div>
            </div>

            <!-- EMI Calculator -->
            <button type="button" class="topbar__link" id="topbar-btn-emi">
              EMI Calculator
            </button>

            <!-- Check CIBIL Free with green shield icon (#0f7a45) -->
            <a
              href="https://www.cibil.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="topbar__link"
            >
              <svg
                class="topbar__shield-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0f7a45"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span>Check CIBIL Free</span>
            </a>
          </nav>

          <!-- 3. Flexible Spacer -->
          <div class="topbar__spacer"></div>

          <!-- 4. Right side actions -->
          <div class="topbar__actions">
            ${
              isLoggedIn
                ? `
              <!-- Logged In: Outlined User Button with Avatar -->
              <div class="topbar__user-wrapper">
                <button
                  type="button"
                  class="topbar__btn-user"
                  id="topbar-profile-chip"
                  aria-haspopup="menu"
                  aria-expanded="false"
                  aria-label="User Profile Menu"
                >
                  <div class="topbar__avatar-circle">${initial}</div>
                  <span class="topbar__user-name">${firstName}</span>
                  <span class="topbar__user-chevron">${iconChevronDown(14, 'icon')}</span>
                </button>

                <div class="profile-menu" id="topbar-profile-menu"></div>
              </div>

              <!-- Solid Dashboard Button -->
              <a href="/dashboard" class="topbar__btn-dashboard">
                Dashboard
              </a>
            `
                : `
              <!-- Logged Out: Login + Become a Partner -->
              <button type="button" class="topbar__btn-login" id="topbar-btn-login">
                Login
              </button>
              <button type="button" class="topbar__btn-partner" id="topbar-btn-partner">
                Become a Partner
              </button>
            `
            }
          </div>

          <!-- 5. Mobile Hamburger Button (<860px) -->
          <button
            type="button"
            class="topbar__hamburger"
            id="topbar-hamburger-btn"
            aria-label="Toggle Navigation Menu"
            aria-expanded="false"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        <!-- Mobile Drawer Panel -->
        <div class="topbar__mobile-panel" id="topbar-mobile-panel" style="display: none;">
          <button type="button" class="topbar__link" id="mobile-products-link">
            <span>Products (Home, Business, Personal, LAP)</span>
          </button>
          <button type="button" class="topbar__link" id="mobile-emi-link">
            <span>EMI Calculator</span>
          </button>
          <a href="https://www.cibil.com/" target="_blank" rel="noopener noreferrer" class="topbar__link">
            <span style="display: flex; align-items: center; gap: 8px;">
              <svg class="topbar__shield-icon" viewBox="0 0 24 24" fill="none" stroke="#0f7a45" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              Check CIBIL Free
            </span>
          </a>
          <div class="topbar__mobile-actions" style="margin-top: 16px; display: flex; flex-direction: column; gap: 10px;">
            ${
              isLoggedIn
                ? `
              <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: #f7f6f3; border-radius: 6px;">
                <div class="topbar__avatar-circle">${initial}</div>
                <div>
                  <div style="font-weight: 600; font-size: 14px; color: #111;">${fullName}</div>
                  <div style="font-size: 12px; color: #6b6b6b;">${stored?.phone || ''}</div>
                </div>
              </div>
              <a href="/dashboard" class="topbar__btn-dashboard" style="text-align: center;">
                Dashboard
              </a>
              <button type="button" class="topbar__btn-login" id="mobile-btn-logout" style="color: #c92a2a; border-color: #fee2e2;">
                Log out
              </button>
            `
                : `
              <button type="button" class="topbar__btn-login" id="mobile-btn-login" style="width: 100%;">
                Login
              </button>
              <button type="button" class="topbar__btn-partner" id="mobile-btn-partner" style="width: 100%;">
                Become a Partner
              </button>
            `
            }
          </div>
        </div>
      </header>
    `;

    bindActions(isLoggedIn, stored);
  }

  function bindActions(isLoggedIn: boolean, stored: any) {
    // EMI Click
    const emiBtn = container.querySelector<HTMLElement>('#topbar-btn-emi');
    emiBtn?.addEventListener('click', () => options.onOpenEmi());

    // Logged In actions
    if (isLoggedIn) {
      const chipEl = container.querySelector<HTMLElement>('#topbar-profile-chip');
      const menuEl = container.querySelector<HTMLElement>('#topbar-profile-menu');
      if (chipEl && menuEl) {
        initProfileMenu(chipEl, menuEl, stored, options.onOpenEmi, () => {
          localStorage.removeItem('jr_auth');
          localStorage.removeItem('token');
          render();
          options.onLogout?.();
        });
      }

      const mobileLogout = container.querySelector<HTMLElement>('#mobile-btn-logout');
      mobileLogout?.addEventListener('click', () => {
        localStorage.removeItem('jr_auth');
        localStorage.removeItem('token');
        render();
        options.onLogout?.();
      });
    } else {
      // Logged Out actions
      const loginBtn = container.querySelector<HTMLElement>('#topbar-btn-login');
      const partnerBtn = container.querySelector<HTMLElement>('#topbar-btn-partner');
      const mobileLogin = container.querySelector<HTMLElement>('#mobile-btn-login');
      const mobilePartner = container.querySelector<HTMLElement>('#mobile-btn-partner');

      const handleOpenAuth = () => options.onOpenAuth();

      loginBtn?.addEventListener('click', handleOpenAuth);
      partnerBtn?.addEventListener('click', handleOpenAuth);
      mobileLogin?.addEventListener('click', handleOpenAuth);
      mobilePartner?.addEventListener('click', handleOpenAuth);
    }

    // Products dropdown toggle
    const productsBtn = container.querySelector<HTMLElement>('#topbar-products-btn');
    const productsMenu = container.querySelector<HTMLElement>('#topbar-products-menu');
    const productsWrap = container.querySelector<HTMLElement>('#topbar-products-wrap');

    let productsOpen = false;
    function toggleProducts(open?: boolean) {
      productsOpen = open !== undefined ? open : !productsOpen;
      if (productsMenu && productsBtn) {
        productsMenu.style.display = productsOpen ? 'flex' : 'none';
        productsBtn.setAttribute('aria-expanded', productsOpen ? 'true' : 'false');
        const chevron = productsBtn.querySelector('.topbar__link-chevron');
        if (chevron) {
          (chevron as HTMLElement).style.transform = productsOpen ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      }
    }

    productsBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const menuEl = container.querySelector<HTMLElement>('#topbar-profile-menu');
      const chipEl = container.querySelector<HTMLElement>('#topbar-profile-chip');
      if (!productsOpen && menuEl) {
        menuEl.classList.remove('is-open');
        chipEl?.setAttribute('aria-expanded', 'false');
      }
      toggleProducts();
    });

    const productItems = productsMenu?.querySelectorAll('.topbar-dropdown__item');
    productItems?.forEach((item) => {
      item.addEventListener('click', () => {
        toggleProducts(false);
        const target = document.getElementById('products');
        target?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Mobile Hamburger toggle
    const hamburgerBtn = container.querySelector<HTMLElement>('#topbar-hamburger-btn');
    const mobilePanel = container.querySelector<HTMLElement>('#topbar-mobile-panel');
    let mobileOpen = false;

    function toggleMobile(open?: boolean) {
      mobileOpen = open !== undefined ? open : !mobileOpen;
      if (mobilePanel && hamburgerBtn) {
        mobilePanel.style.display = mobileOpen ? 'flex' : 'none';
        hamburgerBtn.setAttribute('aria-expanded', mobileOpen ? 'true' : 'false');
      }
    }

    hamburgerBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobile();
    });

    const mobileEmi = container.querySelector<HTMLElement>('#mobile-emi-link');
    mobileEmi?.addEventListener('click', () => {
      toggleMobile(false);
      options.onOpenEmi();
    });

    const mobileProducts = container.querySelector<HTMLElement>('#mobile-products-link');
    mobileProducts?.addEventListener('click', () => {
      toggleMobile(false);
      const target = document.getElementById('products');
      target?.scrollIntoView({ behavior: 'smooth' });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (productsOpen && productsWrap && !productsWrap.contains(e.target as Node)) {
        toggleProducts(false);
      }
      if (mobileOpen && mobilePanel && !mobilePanel.contains(e.target as Node) && !hamburgerBtn?.contains(e.target as Node)) {
        toggleMobile(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (productsOpen) toggleProducts(false);
        if (mobileOpen) toggleMobile(false);
      }
    });
  }

  render();

  return {
    reload: render,
  };
}
