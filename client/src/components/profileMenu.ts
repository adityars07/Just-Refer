import { User } from '../../../shared/types.js';

export function initProfileMenu(
  chipEl: HTMLElement,
  menuEl: HTMLElement,
  user: User | any,
  _onOpenEmi?: () => void,
  onLogout?: () => void
) {
  // Extract partner code or ID
  const partnerCode = user.referralCode || user.dsaCode || user.referral_code || user.id || 'JR-PARTNER';
  const phone = user.phone || '+91 98765 43210';

  // Populate menu markup
  menuEl.innerHTML = `
    <div class="profile-menu__header">
      <div class="profile-menu__user-info">
        <span class="profile-menu__user-name">${user.name}</span>
        <span class="profile-menu__user-id">${partnerCode} &bull; ${phone}</span>
      </div>
      ${
        user.phoneVerified
          ? `<span class="profile-menu__badge"><span class="profile-menu__dot"></span>Verified</span>`
          : ''
      }
    </div>
    <div class="profile-menu__items" role="menu">
      <a href="/dashboard" class="profile-menu__item" role="menuitem">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span>Dashboard</span>
      </a>
      <a href="/dashboard#profile" class="profile-menu__item" role="menuitem">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Profile</span>
      </a>
      <a href="/dashboard#settings" class="profile-menu__item" role="menuitem">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
        <span>Bank / UPI Settings</span>
      </a>
      <div class="profile-menu__divider"></div>
      <button type="button" class="profile-menu__item profile-menu__item--danger" id="menu-btn-signout" role="menuitem">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        <span>Logout</span>
      </button>
    </div>
  `;

  // Toggle behavior
  let isOpen = false;

  function toggle(open?: boolean) {
    isOpen = open !== undefined ? open : !isOpen;
    if (isOpen) {
      menuEl.classList.add('is-open');
      chipEl.setAttribute('aria-expanded', 'true');
    } else {
      menuEl.classList.remove('is-open');
      chipEl.setAttribute('aria-expanded', 'false');
    }
  }

  chipEl.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle();
  });

  document.addEventListener('click', (e) => {
    if (isOpen && !menuEl.contains(e.target as Node) && !chipEl.contains(e.target as Node)) {
      toggle(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      toggle(false);
      chipEl.focus();
    }
  });

  const signOutBtn = menuEl.querySelector('#menu-btn-signout');
  signOutBtn?.addEventListener('click', () => {
    toggle(false);
    localStorage.removeItem('jr_auth');
    localStorage.removeItem('token');
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '/';
    }
  });
}
