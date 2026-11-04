import { LANDING } from '../content/landing.js';
import { api } from '../api/client.js';
import {
  iconChevronDown,
  iconArrowRight,
  iconX,
  iconShieldCheck,
  iconBank,
  iconRoute,
  iconHeadset,
  iconHouse,
  iconBuilding,
  iconBriefcase,
  iconUser,
} from '../icons.js';
import { getStoredUser } from './topbar.js';
import type { PublicStats, PublicProduct, PublicLender, PublicTestimonial } from '../../../shared/types.js';

interface LandingOptions {
  onOpenAuth: (screen?: 'signin' | 'signup') => void;
}

export async function initLanding(container: HTMLElement, options: LandingOptions) {
  const stored = getStoredUser();
  const isLoggedIn = !!stored;

  // Fetch public data (gracefully handle failures)
  let stats: PublicStats = {};
  let products: PublicProduct[] = [];
  let lenders: PublicLender[] = [];
  let testimonials: PublicTestimonial[] = [];

  const [statsResult, productsResult, lendersResult, testimonialsResult] = await Promise.allSettled([
    api.getPublicStats(),
    api.getPublicProducts(),
    api.getPublicLenders(),
    api.getPublicTestimonials(),
  ]);

  if (statsResult.status === 'fulfilled') stats = statsResult.value;
  if (productsResult.status === 'fulfilled') products = productsResult.value;
  if (lendersResult.status === 'fulfilled') lenders = lendersResult.value;
  if (testimonialsResult.status === 'fulfilled') testimonials = testimonialsResult.value;

  const C = LANDING;

  // Formatting helpers
  function formatCompactINR(amount?: number): string {
    if (!amount) return '';
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${new Intl.NumberFormat('en-IN').format(amount)}`;
  }

  function formatINR(n: number): string {
    return `₹${new Intl.NumberFormat('en-IN').format(n)}`;
  }

  // ─────────────────────────────────────────────
  // 1. PRODUCT BAR (44px tall, #111)
  // ─────────────────────────────────────────────
  const productBarHTML = products.length
    ? `
    <header class="product-bar" role="region" aria-label="Products overview">
      <div class="landing-wrap product-bar__inner">
        <div class="product-bar__left">
          <div class="product-bar__prefix">
            <span class="product-bar__green-dot"></span>
            <span class="product-bar__title">${C.productBar.allProductsLabel}</span>
          </div>
          <div class="product-bar__divider"></div>
          <div class="product-bar__items">
            ${products
              .map(
                (p) => `
              <a href="#products" class="product-bar__link">
                <span class="product-bar__marker" style="background:${p.iconColor || 'var(--accent-green)'}"></span>
                <span>${p.name}</span>
              </a>
            `
              )
              .join('')}
          </div>
        </div>
        <div class="product-bar__right">
          ${C.productBar.rightText}
        </div>
      </div>
    </header>
  `
    : '';

  // ─────────────────────────────────────────────
  // 2. MAIN NAV (80px tall, white, 1px bottom line)
  // ─────────────────────────────────────────────
  const navHTML = `
    <nav class="main-nav" role="navigation" aria-label="Main Navigation">
      <div class="landing-wrap main-nav__inner">
        <div class="main-nav__left">
          <a href="/" class="main-nav__logo">${C.mainNav.logoText}</a>

          <ul class="main-nav__links">
            ${C.mainNav.links
              .map((link) => {
                if ('hasDropdown' in link && (link as any).hasDropdown) {
                  return `
                  <li class="main-nav__dropdown-wrap">
                    <button type="button" class="main-nav__link" id="nav-products-btn" aria-expanded="false" aria-haspopup="true">
                      <span>${link.label}</span>
                      <span style="display:flex;transition:transform .2s">${iconChevronDown(14, 'icon')}</span>
                    </button>
                    <div class="main-nav__dropdown" id="nav-products-menu" role="menu">
                      ${products
                        .map(
                          (p) => `
                        <a href="#products" class="main-nav__dropdown-item" role="menuitem">${p.name}</a>
                      `
                        )
                        .join('')}
                    </div>
                  </li>
                `;
                }
                return `
                <li><a href="${link.href}" class="main-nav__link">${link.label}</a></li>
              `;
              })
              .join('')}
          </ul>
        </div>

        <div class="main-nav__actions">
          ${
            isLoggedIn
              ? `
            <a href="/dashboard" class="main-nav__btn-partner">${C.mainNav.dashboardBtn}</a>
          `
              : `
            <button type="button" class="main-nav__btn-login" id="nav-btn-login">${C.mainNav.loginBtn}</button>
            <button type="button" class="main-nav__btn-partner" id="nav-btn-partner">${C.mainNav.partnerBtn}</button>
          `
          }
        </div>

        <button type="button" class="main-nav__hamburger" id="nav-hamburger" aria-label="Toggle Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Mobile panel -->
      <div class="main-nav__mobile-panel" id="nav-mobile-panel">
        <div class="main-nav__mobile-top">
          <a href="/" class="main-nav__logo">${C.mainNav.logoText}</a>
          <button type="button" class="main-nav__hamburger" id="nav-mobile-close" aria-label="Close Menu">
            ${iconX(24, 'icon')}
          </button>
        </div>
        <ul class="main-nav__mobile-links">
          ${C.mainNav.links
            .map(
              (l) => `
            <li><a href="${l.href}" class="main-nav__mobile-link" data-close-mobile>${l.label}</a></li>
          `
            )
            .join('')}
        </ul>
        <div class="main-nav__mobile-actions">
          ${
            isLoggedIn
              ? `
            <a href="/dashboard" class="main-nav__btn-partner" style="text-align:center;width:100%">${C.mainNav.dashboardBtn}</a>
          `
              : `
            <button type="button" class="main-nav__btn-login" id="mobile-btn-login" style="width:100%">${C.mainNav.loginBtn}</button>
            <button type="button" class="main-nav__btn-partner" id="mobile-btn-partner" style="width:100%">${C.mainNav.partnerBtn}</button>
          `
          }
        </div>
      </div>
    </nav>
  `;

  // ─────────────────────────────────────────────
  // 3. HERO (about 720px tall, #2E2F34, two columns)
  // ─────────────────────────────────────────────
  const hp = C.heroPreview;
  const heroHTML = `
    <section class="hero-section" aria-labelledby="hero-main-heading">
      <div class="landing-wrap hero-section__inner">
        <!-- Left Column -->
        <div class="hero-left">
          <div class="hero-badge">
            <span class="hero-badge__dot"></span>
            <span class="hero-badge__text">${C.hero.badgeText}</span>
          </div>

          <h1 id="hero-main-heading" class="hero-h1">
            ${C.hero.headlineLine1}<br>
            ${C.hero.headlineLine2}<br>
            <span class="hero-h1__accent">${C.hero.headlineLine3}</span>
          </h1>

          <p class="hero-subtext">${C.hero.subtext}</p>

          <div class="hero-ctas">
            <button type="button" class="hero-btn-partner" id="hero-cta-partner">
              <span>${C.hero.ctaPrimary}</span>
              ${iconArrowRight(16, 'icon')}
            </button>
            <a href="#earnings" class="hero-btn-payouts">${C.hero.ctaSecondary}</a>
          </div>

          <div class="hero-ticks">
            ${C.hero.trustTicks
              .map(
                (tick) => `
              <div class="hero-tick">
                <span class="hero-tick__icon">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <span>${tick}</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <!-- Right Column: 580x580 Preview Card -->
        <div class="hero-preview-wrap">
          <!-- Floating Chip: Top Right -->
          <div class="hero-floating-chip hero-floating-chip--top">
            <div class="hero-chip-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div class="hero-chip-text">
              <span class="hero-chip-title">${hp.floatingChipTop.title}</span>
              <span class="hero-chip-sub">${hp.floatingChipTop.sub}</span>
            </div>
          </div>

          <!-- Preview Card -->
          <div class="hero-preview-card" role="region" aria-label="JustRefer Dashboard Preview">
            <div class="hero-preview-header">
              <span class="hero-preview-logo">${hp.wordmark}</span>
              <div class="hero-preview-tabs">
                <span class="hero-preview-tab hero-preview-tab--active">${hp.tabs[0]}</span>
                <span class="hero-preview-tab">${hp.tabs[1]}</span>
                <span class="hero-preview-tab">${hp.tabs[2]}</span>
              </div>
              <div class="hero-preview-avatar">${hp.userInitials}</div>
            </div>

            <div class="hero-preview-body">
              <!-- Commission Earned Card -->
              <div class="hero-commission-card">
                <div class="hero-commission-left">
                  <span class="hero-commission-label">${hp.commissionCard.label}</span>
                  <div class="hero-commission-amount">${hp.commissionCard.amount}</div>
                  <div class="hero-commission-status">${hp.commissionCard.status}</div>
                  <div class="hero-commission-sub">${hp.commissionCard.subtext}</div>
                </div>

                <div class="hero-commission-chart">
                  <svg viewBox="0 0 180 70" preserveAspectRatio="none" style="width:100%;height:100%">
                    <defs>
                      <linearGradient id="heroChartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#0F7A45" stop-opacity="0.18"/>
                        <stop offset="100%" stop-color="#E8F5EE" stop-opacity="0.02"/>
                      </linearGradient>
                    </defs>
                    <path d="M 0,55 Q 40,48 80,38 T 140,20 T 175,6 L 175,70 L 0,70 Z" fill="url(#heroChartGrad)" />
                    <path d="M 0,55 Q 40,48 80,38 T 140,20 T 175,6" fill="none" stroke="#0F7A45" stroke-width="2.4" stroke-linecap="round" />
                    <circle cx="175" cy="6" r="3.5" fill="#0F7A45" />
                  </svg>
                </div>
              </div>

              <!-- Recent Referrals Header -->
              <div class="hero-referrals-header">
                <span class="hero-referrals-title">${hp.recentReferralsTitle}</span>
                <span class="hero-referrals-viewall">${hp.viewAllLabel}</span>
              </div>

              <!-- 3 Referral Rows -->
              ${hp.referrals
                .map((ref) => {
                  const segments = Array.from({ length: 5 }, (_, i) => {
                    const isFilled = i < ref.segmentsFilled;
                    return `<span class="hero-progress-seg ${isFilled ? 'hero-progress-seg--filled' : ''}"></span>`;
                  }).join('');

                  let pillClass = 'hero-status-pill--disbursed';
                  if (ref.statusType === 'sanctioned') pillClass = 'hero-status-pill--sanctioned';
                  if (ref.statusType === 'underwriting') pillClass = 'hero-status-pill--underwriting';

                  return `
                  <div class="hero-referral-row">
                    <div class="hero-referral-left">
                      <span class="hero-referral-name">${ref.name}</span>
                      <span class="hero-referral-meta">${ref.meta}</span>
                    </div>

                    <div class="hero-referral-progress">
                      ${segments}
                    </div>

                    <div class="hero-referral-right">
                      <span class="hero-referral-amount">${ref.amount}</span>
                      <span class="hero-status-pill ${pillClass}">${ref.status}</span>
                    </div>
                  </div>
                `;
                })
                .join('')}
            </div>
          </div>

          <!-- Floating Chip: Bottom Left -->
          <div class="hero-floating-chip hero-floating-chip--bottom">
            <div class="hero-chip-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div class="hero-chip-text">
              <span class="hero-chip-title">${hp.floatingChipBottom.title}</span>
              <span class="hero-chip-sub">${hp.floatingChipBottom.sub}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // ─────────────────────────────────────────────
  // 4. STATS STRIP (white, 4 columns, 1px separators)
  // ─────────────────────────────────────────────
  const hasStats = stats.totalDisbursed || stats.payoutDisbursedPct || stats.lendingPartners || stats.timeToRefer;
  const statsHTML = hasStats
    ? `
    <section class="stats-strip" aria-label="Key Statistics">
      <div class="landing-wrap stats-strip__inner">
        ${
          stats.totalDisbursed
            ? `
          <div class="stats-strip__item">
            <div class="stats-strip__value">${formatCompactINR(stats.totalDisbursed)}</div>
            <div class="stats-strip__label">${C.stats.totalDisbursedLabel}</div>
          </div>
        `
            : ''
        }
        ${
          stats.payoutDisbursedPct
            ? `
          <div class="stats-strip__item">
            <div class="stats-strip__value">${stats.payoutDisbursedPct}%</div>
            <div class="stats-strip__label">${C.stats.payoutDisbursedLabel}</div>
          </div>
        `
            : ''
        }
        ${
          stats.lendingPartners
            ? `
          <div class="stats-strip__item">
            <div class="stats-strip__value">${stats.lendingPartners}+</div>
            <div class="stats-strip__label">${C.stats.lendingPartnersLabel}</div>
          </div>
        `
            : ''
        }
        ${
          stats.timeToRefer
            ? `
          <div class="stats-strip__item">
            <div class="stats-strip__value">${stats.timeToRefer}</div>
            <div class="stats-strip__label">${C.stats.timeToReferLabel}</div>
          </div>
        `
            : ''
        }
      </div>
    </section>
  `
    : '';

  // ─────────────────────────────────────────────
  // 5. HOW IT WORKS (3 cards 384x360, gap 24, #F6F5F4)
  // ─────────────────────────────────────────────
  const howHTML = `
    <section class="how-section" id="how-it-works" aria-labelledby="how-heading">
      <div class="landing-wrap">
        <span class="section-label">${C.howItWorks.monoLabel}</span>
        <h2 id="how-heading" class="section-h2">${C.howItWorks.title}</h2>

        <div class="how-grid">
          <!-- Card 1 -->
          <div class="how-card">
            <span class="how-card__mono">${C.howItWorks.cards[0].number}</span>
            <div class="how-mini-ui">
              <div class="how-ui-card1">
                <div class="how-ui-input" style="width: 140px;"></div>
                <div class="how-ui-input" style="width: 90px;"></div>
                <button type="button" class="how-ui-btn">${C.howItWorks.cards[0].btnText}</button>
              </div>
            </div>
            <h3 class="how-card__title">${C.howItWorks.cards[0].title}</h3>
            <p class="how-card__desc">${C.howItWorks.cards[0].description}</p>
          </div>

          <!-- Card 2 -->
          <div class="how-card">
            <span class="how-card__mono">${C.howItWorks.cards[1].number}</span>
            <div class="how-mini-ui">
              <div class="how-ui-card2">
                <div class="how-ui-stepper">
                  <span class="how-ui-step-dot how-ui-step-dot--filled"></span>
                  <span class="how-ui-step-line how-ui-step-line--filled"></span>
                  <span class="how-ui-step-dot how-ui-step-dot--filled"></span>
                  <span class="how-ui-step-line how-ui-step-line--filled"></span>
                  <span class="how-ui-step-dot how-ui-step-dot--filled"></span>
                  <span class="how-ui-step-line"></span>
                  <span class="how-ui-step-dot"></span>
                  <span class="how-ui-step-line"></span>
                  <span class="how-ui-step-dot"></span>
                </div>
                <span class="hero-status-pill hero-status-pill--sanctioned">${C.howItWorks.cards[1].pillText}</span>
              </div>
            </div>
            <h3 class="how-card__title">${C.howItWorks.cards[1].title}</h3>
            <p class="how-card__desc">${C.howItWorks.cards[1].description}</p>
          </div>

          <!-- Card 3 -->
          <div class="how-card">
            <span class="how-card__mono">${C.howItWorks.cards[2].number}</span>
            <div class="how-mini-ui">
              <div class="how-ui-card3">
                <div class="how-ui-rupee-circle">₹</div>
                <div style="display:flex;flex-direction:column">
                  <span style="font-size:11px;color:#6B6F76">Payout received</span>
                  <span style="font-size:13px;font-weight:700;color:#111">${C.howItWorks.cards[2].payoutAmount}</span>
                </div>
                <span class="hero-status-pill hero-status-pill--disbursed" style="margin-left:auto">${C.howItWorks.cards[2].pillText}</span>
              </div>
            </div>
            <h3 class="how-card__title">${C.howItWorks.cards[2].title}</h3>
            <p class="how-card__desc">${C.howItWorks.cards[2].description}</p>
          </div>
        </div>
      </div>
    </section>
  `;

  // ─────────────────────────────────────────────
  // 6. EARN ON EVERY LOAN (Two cards 480px tall)
  // ─────────────────────────────────────────────
  const productIcons: Record<string, string> = {
    home: iconHouse(22, 'icon'),
    lap: iconBuilding(22, 'icon'),
    business: iconBriefcase(22, 'icon'),
    personal: iconUser(22, 'icon'),
  };

  const defaultProd = products[0] || {
    id: 'home',
    name: 'Home Loan',
    payoutPct: 0.3,
    startingRatePct: 7.25,
    minAmountLabel: 'Min ₹50 Lacs',
    examplePayoutLabel: '₹15,000 per ₹50L',
    iconColor: '#F4B942',
  };

  const earnHTML = `
    <section class="earn-section" id="earnings" aria-labelledby="earn-heading">
      <div class="landing-wrap">
        <span class="section-label">${C.earn.monoLabel}</span>
        <h2 id="earn-heading" class="section-h2">${C.earn.title}</h2>

        <div class="earn-grid" id="products">
          <!-- Left Card: 580px wide, 480px tall, 4 rows -->
          <div class="earn-products-card" id="earn-products-list">
            ${products
              .map((p, index) => {
                const isActive = index === 0 ? 'earn-product-row--active' : '';
                const svgIcon = productIcons[p.id] || iconHouse(22, 'icon');
                return `
                <div
                  class="earn-product-row ${isActive}"
                  data-prod-id="${p.id}"
                  data-prod-name="${p.name}"
                  data-prod-payout="${p.payoutPct}"
                  role="button"
                  tabindex="0"
                  aria-label="Select ${p.name}"
                >
                  <div class="earn-prod-left">
                    <div class="earn-prod-icon" style="background:${p.iconColor || '#F4B942'}">
                      ${svgIcon}
                    </div>
                    <div class="earn-prod-info">
                      <span class="earn-prod-name">${p.name}</span>
                      <span class="earn-prod-sub">From ${p.minAmountLabel.replace('Min ', '')} · ${p.startingRatePct.toFixed(2)}% p.a.</span>
                    </div>
                  </div>
                  <div class="earn-prod-right">
                    <span class="earn-prod-payout">${p.payoutPct}% payout</span>
                    <span class="earn-prod-example">${p.examplePayoutLabel}</span>
                  </div>
                </div>
              `;
              })
              .join('')}
          </div>

          <!-- Right Card: 560px wide, 480px tall, dark #2E2F34 -->
          <div class="earn-calculator-card">
            <div class="earn-calc-top">
              <span class="earn-calc-mono">${C.earn.calcLabel}</span>

              <!-- Slider 1: Loan size -->
              <div class="earn-slider-group">
                <div class="earn-slider-header">
                  <span class="earn-slider-title">${C.earn.sliderLoanLabel}</span>
                  <span class="earn-slider-val" id="calc-loan-val">${formatINR(C.earn.defaultLoanAmount)}</span>
                </div>
                <input
                  type="range"
                  class="earn-slider-input"
                  id="calc-loan-input"
                  min="500000"
                  max="50000000"
                  step="500000"
                  value="${C.earn.defaultLoanAmount}"
                />
              </div>

              <!-- Slider 2: Referrals per month -->
              <div class="earn-slider-group">
                <div class="earn-slider-header">
                  <span class="earn-slider-title">${C.earn.sliderRefLabel}</span>
                  <span class="earn-slider-val" id="calc-ref-val">${C.earn.defaultReferrals}</span>
                </div>
                <input
                  type="range"
                  class="earn-slider-input"
                  id="calc-ref-input"
                  min="1"
                  max="25"
                  step="1"
                  value="${C.earn.defaultReferrals}"
                />
              </div>
            </div>

            <div class="earn-calc-divider"></div>

            <div class="earn-calc-bottom">
              <span class="earn-calc-result-label">${C.earn.resultLabel}</span>
              <div class="earn-calc-result-wrap">
                <span class="earn-calc-amount" id="calc-total-amount">₹60,000</span>
                <span class="earn-calc-permonth">${C.earn.perMonthLabel}</span>
              </div>
              <div class="earn-calc-year" id="calc-year-summary">
                That is ₹7.20 lakh a year, from ${defaultProd.name.toLowerCase()} alone.
              </div>
              <div class="earn-calc-footnote" id="calc-footnote">
                Illustrative, at ${defaultProd.payoutPct}% ${defaultProd.name.toLowerCase()} payout. Actual rates vary.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // ─────────────────────────────────────────────
  // 7. TRUST & SECURITY (4 cards 282x250, gap 24)
  // ─────────────────────────────────────────────
  const trustIcons: Record<string, string> = {
    'shield-check': iconShieldCheck(24, 'icon'),
    bank: iconBank(24, 'icon'),
    route: iconRoute(24, 'icon'),
    headset: iconHeadset(24, 'icon'),
  };

  const trustHTML = `
    <section class="trust-section" id="trust" aria-labelledby="trust-heading">
      <div class="landing-wrap">
        <span class="section-label">${C.trust.monoLabel}</span>
        <h2 id="trust-heading" class="section-h2">${C.trust.title}</h2>

        <div class="trust-cards-grid">
          ${C.trust.cards
            .map(
              (card) => `
            <div class="trust-card">
              <div class="trust-icon-circle">
                ${trustIcons[card.icon] || iconShieldCheck(24, 'icon')}
              </div>
              <h3 class="trust-card__title">${card.title}</h3>
              <p class="trust-card__desc">${card.description}</p>
            </div>
          `
            )
            .join('')}
        </div>

        ${
          lenders.length
            ? `
          <div class="lenders-band">
            <div class="lenders-mono">${C.trust.lendersMonoLabel}</div>
            <div class="lenders-row">
              ${lenders
                .map(
                  (l) => `
                <span class="lender-name-text">${l.name}</span>
              `
                )
                .join('')}
            </div>
          </div>
        `
            : ''
        }
      </div>
    </section>
  `;

  // ─────────────────────────────────────────────
  // 8. PARTNER STORIES (3 cards 384x290, gap 24)
  // ─────────────────────────────────────────────
  const approvedTestimonials = testimonials.filter((t) => t.quote && (t as any).approved !== false);
  const storiesHTML = approvedTestimonials.length
    ? `
    <section class="stories-section" aria-labelledby="stories-heading">
      <div class="landing-wrap">
        <span class="section-label">${C.partnerStories.monoLabel}</span>
        <h2 id="stories-heading" class="section-h2">${C.partnerStories.title}</h2>

        <div class="stories-grid">
          ${approvedTestimonials
            .map(
              (t) => `
            <div class="story-card">
              <div>
                <div class="story-quote-mark">“</div>
                <p class="story-quote-text">${t.quote}</p>
              </div>

              <div>
                <div class="story-divider"></div>
                <div class="story-author-row">
                  <div class="story-author-left">
                    <div class="story-avatar">${t.initials || t.name.charAt(0)}</div>
                    <div class="story-author-info">
                      <span class="story-author-name">${t.name}</span>
                      <span class="story-author-role">${t.role}</span>
                    </div>
                  </div>
                  ${
                    t.earnings
                      ? `
                    <span class="story-earnings-pill">${t.earnings}</span>
                  `
                      : ''
                  }
                </div>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </section>
  `
    : '';

  // ─────────────────────────────────────────────
  // 9. FAQ (Two columns: Left H2, Right questions)
  // ─────────────────────────────────────────────
  const faqHTML = `
    <section class="faq-section" id="faq" aria-labelledby="faq-heading">
      <div class="landing-wrap faq-grid">
        <div class="faq-left">
          <span class="section-label">${C.faq.monoLabel}</span>
          <h2 id="faq-heading" class="section-h2">${C.faq.title}</h2>
        </div>

        <div class="faq-items" id="faq-items-wrap">
          ${C.faq.items
            .map(
              (item, idx) => `
            <div class="faq-item ${idx === 0 ? 'is-open' : ''}" data-faq-index="${idx}">
              <button
                type="button"
                class="faq-question-btn"
                aria-expanded="${idx === 0 ? 'true' : 'false'}"
                aria-controls="faq-ans-${idx}"
              >
                <span>${item.question}</span>
                <span class="faq-toggle-icon">${idx === 0 ? '−' : '+'}</span>
              </button>
              <div class="faq-answer" id="faq-ans-${idx}" role="region">
                ${item.answer}
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </section>
  `;

  // ─────────────────────────────────────────────
  // 10. CLOSING BAND (#2E2F34, ~260px tall, centered)
  // ─────────────────────────────────────────────
  const closingHTML = `
    <section class="closing-band" aria-label="Get started">
      <div class="landing-wrap closing-band__inner">
        <h2 class="closing-heading">${C.closingBand.headline}</h2>
        <p class="closing-subtext">${C.closingBand.subtext}</p>
        <button type="button" class="closing-btn" id="closing-cta-btn">
          <span>${C.closingBand.cta}</span>
          ${iconArrowRight(16, 'icon')}
        </button>
      </div>
    </section>
  `;

  // ─────────────────────────────────────────────
  // 11. FOOTER (128px logo, 3 columns, disclaimer)
  // ─────────────────────────────────────────────
  const footerHTML = `
    <footer class="landing-footer" role="contentinfo">
      <div class="landing-wrap">
        <div class="footer-top">
          <div>
            <a href="/" class="footer-logo">${C.mainNav.logoText}</a>
            <p class="footer-tagline">${C.footer.tagline}</p>
          </div>

          ${C.footer.columns
            .map(
              (col) => `
            <div>
              <div class="footer-col-title">${col.title}</div>
              <ul class="footer-links">
                ${col.links
                  .map(
                    (link) => `
                  <li><a href="${link.href}" class="footer-link">${link.label}</a></li>
                `
                  )
                  .join('')}
              </ul>
            </div>
          `
            )
            .join('')}
        </div>

        <div class="footer-bottom-divider"></div>

        <div class="footer-bottom">
          <span class="footer-copyright">${C.footer.copyright}</span>
          <span class="footer-disclaimer">${C.footer.disclaimer}</span>
        </div>
      </div>
    </footer>
  `;

  // Set page meta title & description
  document.title = C.meta.title;
  let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = C.meta.description;

  // Mount HTML
  container.innerHTML = `
    ${productBarHTML}
    ${navHTML}
    <main>
      ${heroHTML}
      ${statsHTML}
      ${howHTML}
      ${earnHTML}
      ${trustHTML}
      ${storiesHTML}
      ${faqHTML}
      ${closingHTML}
    </main>
    ${footerHTML}
  `;

  // ─────────────────────────────────────────────
  // EVENT BINDINGS
  // ─────────────────────────────────────────────

  // Navigation events
  bindNavigationEvents(container, options, isLoggedIn);

  // Calculator events
  bindCalculator(container, products);

  // FAQ events
  bindFaq(container);

  // CTA button events
  container.querySelector('#hero-cta-partner')?.addEventListener('click', () => {
    options.onOpenAuth('signup');
  });
  container.querySelector('#closing-cta-btn')?.addEventListener('click', () => {
    options.onOpenAuth('signup');
  });
}

function bindNavigationEvents(container: HTMLElement, options: LandingOptions, isLoggedIn: boolean) {
  // Products dropdown
  const prodBtn = container.querySelector<HTMLElement>('#nav-products-btn');
  const prodMenu = container.querySelector<HTMLElement>('#nav-products-menu');
  let prodOpen = false;

  prodBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    prodOpen = !prodOpen;
    prodMenu?.classList.toggle('is-open', prodOpen);
    prodBtn.setAttribute('aria-expanded', String(prodOpen));
    const chevron = prodBtn.querySelector('span:last-child') as HTMLElement | null;
    if (chevron) {
      chevron.style.transform = prodOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    }
  });

  prodMenu?.querySelectorAll('.main-nav__dropdown-item').forEach((item) => {
    item.addEventListener('click', () => {
      prodOpen = false;
      prodMenu.classList.remove('is-open');
      prodBtn?.setAttribute('aria-expanded', 'false');
    });
  });

  // Mobile hamburger
  const hamburger = container.querySelector<HTMLElement>('#nav-hamburger');
  const mobilePanel = container.querySelector<HTMLElement>('#nav-mobile-panel');
  const mobileClose = container.querySelector<HTMLElement>('#nav-mobile-close');

  hamburger?.addEventListener('click', () => {
    mobilePanel?.classList.add('is-open');
  });

  mobileClose?.addEventListener('click', () => {
    mobilePanel?.classList.remove('is-open');
  });

  container.querySelectorAll('[data-close-mobile]').forEach((el) => {
    el.addEventListener('click', () => {
      mobilePanel?.classList.remove('is-open');
    });
  });

  // Auth modal triggers
  if (!isLoggedIn) {
    container.querySelector('#nav-btn-login')?.addEventListener('click', () => options.onOpenAuth('signin'));
    container.querySelector('#nav-btn-partner')?.addEventListener('click', () => options.onOpenAuth('signup'));
    container.querySelector('#mobile-btn-login')?.addEventListener('click', () => {
      mobilePanel?.classList.remove('is-open');
      options.onOpenAuth('signin');
    });
    container.querySelector('#mobile-btn-partner')?.addEventListener('click', () => {
      mobilePanel?.classList.remove('is-open');
      options.onOpenAuth('signup');
    });
  }

  // Outside click to close dropdowns
  document.addEventListener('click', (e) => {
    if (prodOpen && prodMenu && !prodBtn?.contains(e.target as Node) && !prodMenu.contains(e.target as Node)) {
      prodOpen = false;
      prodMenu.classList.remove('is-open');
      prodBtn?.setAttribute('aria-expanded', 'false');
      const chevron = prodBtn?.querySelector('span:last-child') as HTMLElement | null;
      if (chevron) chevron.style.transform = 'rotate(0deg)';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (prodOpen) {
        prodOpen = false;
        prodMenu?.classList.remove('is-open');
        prodBtn?.setAttribute('aria-expanded', 'false');
        const chevron = prodBtn?.querySelector('span:last-child') as HTMLElement | null;
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      }
      mobilePanel?.classList.remove('is-open');
    }
  });
}

function bindCalculator(container: HTMLElement, products: PublicProduct[]) {
  const loanInput = container.querySelector<HTMLInputElement>('#calc-loan-input');
  const refInput = container.querySelector<HTMLInputElement>('#calc-ref-input');
  const loanVal = container.querySelector<HTMLElement>('#calc-loan-val');
  const refVal = container.querySelector<HTMLElement>('#calc-ref-val');
  const totalAmount = container.querySelector<HTMLElement>('#calc-total-amount');
  const yearSummary = container.querySelector<HTMLElement>('#calc-year-summary');
  const footnote = container.querySelector<HTMLElement>('#calc-footnote');
  const productRows = container.querySelectorAll<HTMLElement>('.earn-product-row');

  let activeProduct = products[0] || {
    id: 'home',
    name: 'Home Loan',
    payoutPct: 0.3,
  };

  function updateCalc() {
    if (!loanInput || !refInput || !loanVal || !refVal || !totalAmount) return;

    const loan = Number(loanInput.value);
    const refs = Number(refInput.value);
    const rate = activeProduct.payoutPct;

    // Computed monthly commission
    const monthlyCommission = Math.round((loan * rate) / 100) * refs;
    const annualLakhs = ((monthlyCommission * 12) / 100000).toFixed(2);

    // Update UI
    loanVal.textContent = `₹${new Intl.NumberFormat('en-IN').format(loan)}`;
    refVal.textContent = String(refs);
    totalAmount.textContent = `₹${new Intl.NumberFormat('en-IN').format(monthlyCommission)}`;

    if (yearSummary) {
      yearSummary.textContent = `That is ₹${annualLakhs} lakh a year, from ${activeProduct.name.toLowerCase()} alone.`;
    }

    if (footnote) {
      footnote.textContent = `Illustrative, at ${rate}% ${activeProduct.name.toLowerCase()} payout. Actual rates vary.`;
    }

    // Dynamic slider fill percentage
    const loanPct = ((loan - 500000) / (50000000 - 500000)) * 100;
    loanInput.style.background = `linear-gradient(to right, #5FDC9A ${loanPct}%, #565860 ${loanPct}%)`;

    const refPct = ((refs - 1) / (25 - 1)) * 100;
    refInput.style.background = `linear-gradient(to right, #5FDC9A ${refPct}%, #565860 ${refPct}%)`;
  }

  loanInput?.addEventListener('input', updateCalc);
  refInput?.addEventListener('input', updateCalc);

  productRows.forEach((row) => {
    row.addEventListener('click', () => {
      productRows.forEach((r) => r.classList.remove('earn-product-row--active'));
      row.classList.add('earn-product-row--active');

      const prodId = row.dataset.prodId;
      const found = products.find((p) => p.id === prodId);
      if (found) {
        activeProduct = found;
        updateCalc();
      }
    });

    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        row.click();
      }
    });
  });

  // Initial calculation
  updateCalc();
}

function bindFaq(container: HTMLElement) {
  const faqItems = container.querySelectorAll<HTMLElement>('.faq-item');

  faqItems.forEach((item) => {
    const btn = item.querySelector<HTMLButtonElement>('.faq-question-btn');
    const toggleIcon = item.querySelector<HTMLElement>('.faq-toggle-icon');

    btn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all items
      faqItems.forEach((other) => {
        other.classList.remove('is-open');
        const otherBtn = other.querySelector('.faq-question-btn');
        const otherIcon = other.querySelector('.faq-toggle-icon');
        otherBtn?.setAttribute('aria-expanded', 'false');
        if (otherIcon) otherIcon.textContent = '+';
      });

      // If clicked item was closed, open it
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        if (toggleIcon) toggleIcon.textContent = '−';
      }
    });

    // Keyboard support
    btn?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
}
