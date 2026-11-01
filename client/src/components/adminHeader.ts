import { User } from '../../../shared/types.js';
import { renderLogoIcon } from './logo.js';

export interface AdminHeaderOptions {
  user?: User | null;
}

export function initAdminHeader(container: HTMLElement, options: AdminHeaderOptions = {}) {
  const userName = options.user?.name || 'Admin';
  const initial = (options.user?.initials || userName.charAt(0) || 'A').toUpperCase();

  container.innerHTML = `
    <header class="admin-header">
      <div class="admin-wrap admin-header__wrap">
        <a href="/admin" class="admin-header__brand" aria-label="JustRefer Admin Home">
          ${renderLogoIcon(26, 'dark')}
          <span class="admin-header__wordmark">justrefer</span>
          <span class="admin-header__tag">ADMIN</span>
        </a>

        <nav class="admin-header__nav" aria-label="Admin">
          <a href="/admin" class="admin-header__nav-link admin-header__nav-link--active" aria-current="page">Overview</a>
          <a href="/admin/referrals" class="admin-header__nav-link">Referrals</a>
          <a href="/admin/partners" class="admin-header__nav-link">Partners</a>
          <a href="/admin/payouts" class="admin-header__nav-link">Payouts</a>
          <a href="/admin/lenders" class="admin-header__nav-link">Lenders</a>
        </nav>

        <div class="admin-header__spacer"></div>

        <div class="admin-header__right">
          <a href="/dashboard" class="admin-header__partner-btn">Partner view</a>
          <div class="admin-header__avatar" role="img" aria-label="Account: ${userName}, admin">${initial}</div>
        </div>
      </div>
    </header>
  `;

  return {
    updateUser(user: User) {
      const avatar = container.querySelector<HTMLElement>('.admin-header__avatar');
      if (avatar) {
        const uName = user.name || 'Admin';
        const init = (user.initials || uName.charAt(0) || 'A').toUpperCase();
        avatar.setAttribute('aria-label', `Account: ${uName}, admin`);
        avatar.textContent = init;
      }
    },
  };
}

export const init = initAdminHeader;

