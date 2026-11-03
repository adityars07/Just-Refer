import { LANDING } from '../content/landing.js';
import { api } from '../api/client.js';
import { iconChevronDown, iconArrowRight, iconX } from '../icons.js';
import { getStoredUser } from './topbar.js';
import type { PublicStats, PublicProduct, PublicLender, PublicTestimonial } from '../../../shared/types.js';

interface LandingOptions {
  onOpenAuth: (screen?: 'signin' | 'signup') => void;
}

export async function initLanding(container: HTMLElement, options: LandingOptions) {
  const stored = getStoredUser();
  const isLoggedIn = !!stored;
  const firstName = stored?.full_name?.trim().split(' ')[0] || '';
  const initial = firstName ? firstName.charAt(0).toUpperCase() : 'P';

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

  // --- Helper: format ₹ compactly ---
  function formatCr(amount: number): string {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} ${C.stats.totalDisbursedLabel}`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${new Intl.NumberFormat('en-IN').format(amount)}`;
  }

  function formatINR(n: number): string {
    return `₹${new Intl.NumberFormat('en-IN').format(n)}`;
  }

  // --- Product bar ---
  const colorMap: Record<string, string> = {
    home: '#F4B942', lap: '#ECC6E4', personal: '#B9C9F5', business: '#BFE5C8',
  };

  const productBarHTML = products.length ? `
    <div class="product-bar">
      <div class="product-bar__inner">
        <div class="product-bar__left">
          <span class="product-bar__all">ALL PRODUCTS</span>
          ${products.map(p => `
            <a href="#products" class="product-bar__link">
              <span class="product-bar__dot" style="background:${colorMap[p.id] || '#ccc'}"></span>
              <span>${p.name}</span>
            </a>
          `).join('')}
        </div>
        <span class="product-bar__right-text">${C.productBar.rightText}</span>
      </div>
    </div>
  ` : '';

  // --- Main Nav ---
  const navHTML = `
    <nav class="main-nav" role="navigation" aria-label="Main Navigation">
      <div class="main-nav__inner">
        <a href="/" class="main-nav__logo">
          <div class="main-nav__logo-icon">J</div>
          justrefer
        </a>

        <ul class="main-nav__links">
          <li class="main-nav__dropdown-wrap">
            <button type="button" class="main-nav__link" id="nav-products-btn" aria-expanded="false" aria-haspopup="true">
              <span>Products</span>
              <span style="display:flex;transition:transform .2s">${iconChevronDown(14, 'icon')}</span>
            </button>
            <div class="main-nav__dropdown" id="nav-products-menu" role="menu">
              ${products.map(p => `
                <a href="#products" class="main-nav__dropdown-item" role="menuitem">${p.name}</a>
              `).join('')}
            </div>
          </li>
          <li><a href="#how-it-works" class="main-nav__link">How it works</a></li>
          <li><a href="#earnings" class="main-nav__link">Earnings</a></li>
          <li><a href="#trust" class="main-nav__link">Trust</a></li>
          <li><a href="#faq" class="main-nav__link">FAQ</a></li>
        </ul>

        <div class="main-nav__spacer"></div>

        <div class="main-nav__actions">
          ${isLoggedIn ? `
            <div class="main-nav__user-chip" id="nav-user-chip">
              <div class="main-nav__user-avatar">${initial}</div>
              <span>${firstName}</span>
              <span style="display:flex">${iconChevronDown(14, 'icon')}</span>
            </div>
            <a href="/dashboard" class="main-nav__btn-dashboard">Dashboard</a>
          ` : `
            <button type="button" class="main-nav__btn-login" id="nav-btn-login">Login</button>
            <button type="button" class="main-nav__btn-partner" id="nav-btn-partner">Become a Partner</button>
          `}
        </div>

        <button type="button" class="main-nav__hamburger" id="nav-hamburger" aria-label="Toggle Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="main-nav__mobile-panel" id="nav-mobile-panel">
        <div class="main-nav__mobile-top">
          <a href="/" class="main-nav__logo">
            <div class="main-nav__logo-icon">J</div>
            justrefer
          </a>
          <button type="button" class="main-nav__hamburger" id="nav-mobile-close" aria-label="Close Menu">
            ${iconX(24, 'icon')}
          </button>
        </div>
        <ul class="main-nav__mobile-links">
          <li><a href="#products" class="main-nav__mobile-link" data-close-mobile>Products</a></li>
          <li><a href="#how-it-works" class="main-nav__mobile-link" data-close-mobile>How it works</a></li>
          <li><a href="#earnings" class="main-nav__mobile-link" data-close-mobile>Earnings</a></li>
          <li><a href="#trust" class="main-nav__mobile-link" data-close-mobile>Trust</a></li>
          <li><a href="#faq" class="main-nav__mobile-link" data-close-mobile>FAQ</a></li>
        </ul>
        <div class="main-nav__mobile-actions">
          ${isLoggedIn ? `
            <a href="/dashboard" class="main-nav__btn-partner" style="text-align:center;text-decoration:none">Dashboard</a>
          ` : `
            <button type="button" class="main-nav__btn-login" id="mobile-btn-login" style="width:100%">Login</button>
            <button type="button" class="main-nav__btn-partner" id="mobile-btn-partner" style="width:100%">Become a Partner</button>
          `}
        </div>
      </div>
    </nav>
  `;

  // --- Hero ---
  const heroHTML = `
    <section class="landing-hero" aria-labelledby="landing-hero-heading">
      <div class="landing-hero__inner">
        <div class="landing-hero__text">
          <div class="landing-hero__badge">
            <span class="landing-hero__badge-dot"></span>
            <span>${C.hero.badge}</span>
          </div>

          <h1 id="landing-hero-heading" class="landing-hero__h1">
            ${C.hero.headlineLine1}<br>
            ${C.hero.headlineLine2}<br>
            <span class="landing-hero__h1-green">${C.hero.headlineLine3}</span>
          </h1>

          <p class="landing-hero__subtext">${C.hero.subtext}</p>

          <div class="landing-hero__ctas">
            <button type="button" class="landing-hero__cta-primary" id="hero-cta-partner">
              <span>${C.hero.ctaPrimary}</span>
              ${iconArrowRight(16, 'icon')}
            </button>
            <a href="#how-it-works" class="landing-hero__cta-secondary">${C.hero.ctaSecondary}</a>
          </div>

          <div class="landing-hero__ticks">
            ${C.hero.trustTicks.map(t => `
              <span class="landing-hero__tick">${t}</span>
            `).join('')}
          </div>
        </div>

        <div class="landing-hero__preview" aria-hidden="true">
          ${renderHeroPreview(products)}
        </div>
      </div>
    </section>
  `;

  // --- Stats Strip ---
  const hasStats = stats.totalDisbursed || stats.payoutDisbursedPct || stats.lendingPartners || stats.timeToRefer;
  const statsHTML = hasStats ? `
    <section class="stats-strip" aria-label="Platform Statistics">
      <div class="stats-strip__inner">
        ${stats.totalDisbursed ? `
          <div class="stats-strip__item">
            <span class="stats-strip__value">${formatCr(stats.totalDisbursed)}</span>
            <span class="stats-strip__label">Total Disbursed</span>
          </div>
        ` : ''}
        ${stats.payoutDisbursedPct ? `
          <div class="stats-strip__item">
            <span class="stats-strip__value">${stats.payoutDisbursedPct}${C.stats.payoutPctLabel}</span>
            <span class="stats-strip__label">Payout Disbursed</span>
          </div>
        ` : ''}
        ${stats.lendingPartners ? `
          <div class="stats-strip__item">
            <span class="stats-strip__value">${stats.lendingPartners}+</span>
            <span class="stats-strip__label">${C.stats.lendingPartnersLabel}</span>
          </div>
        ` : ''}
        ${stats.timeToRefer ? `
          <div class="stats-strip__item">
            <span class="stats-strip__value">${stats.timeToRefer}</span>
            <span class="stats-strip__label">${C.stats.timeToReferLabel}</span>
          </div>
        ` : ''}
      </div>
    </section>
  ` : '';

  // --- How It Works ---
  const howHTML = `
    <section class="how-it-works" id="how-it-works" aria-labelledby="how-it-works-title">
      <div class="how-it-works__inner">
        <div class="how-it-works__label">${C.howItWorks.sectionLabel}</div>
        <h2 id="how-it-works-title" class="how-it-works__title">${C.howItWorks.title}</h2>
        <div class="how-it-works__steps">
          ${C.howItWorks.steps.map((step, i) => `
            <div class="how-it-works__step">
              <div class="how-it-works__step-visual">
                ${i === 0 ? `
                  <div class="how-it-works__step-preview">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <span>Submit referral in 30s</span>
                  </div>
                ` : i === 1 ? `
                  <div class="how-it-works__step-preview">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    <span style="font-weight:600;color:var(--ink)">₹25,000</span>
                    <span>Commission tracked</span>
                  </div>
                ` : `
                  <div class="how-it-works__step-preview">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--green-accent)" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                    <span>Get paid to your bank</span>
                  </div>
                `}
              </div>
              <h3 class="how-it-works__step-title">${step.title}</h3>
              <p class="how-it-works__step-desc">${step.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  // --- Earn Section ---
  const selectedProduct = products[0] || null;
  const earnHTML = products.length ? `
    <section class="earn-section" id="earnings" aria-labelledby="earn-title">
      <div class="earn-section__inner">
        <div class="earn-section__left-col">
          <div class="earn-section__label">${C.earn.sectionLabel}</div>
          <h2 id="earn-title" class="earn-section__title">${C.earn.title}</h2>
          <div class="earn-section__products" id="earn-products">
            ${products.map((p, i) => `
              <div class="earn-product-row${i === 0 ? ' is-active' : ''}" data-product-id="${p.id}" data-payout="${p.payoutPct}" data-name="${p.name}" tabindex="0" role="button" aria-label="Select ${p.name}">
                <span class="earn-product-row__dot" style="background:${colorMap[p.id] || '#ccc'}"></span>
                <span class="earn-product-row__name">${p.name}</span>
                <span class="earn-product-row__payout">${p.payoutPct}% payout</span>
                <span class="earn-product-row__label">${p.examplePayoutLabel}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="earn-calculator" id="earn-calculator">
          <div class="earn-calculator__product-name" id="calc-product-name">${selectedProduct?.name || ''}</div>
          <div class="earn-calculator__amount" id="calc-amount">${selectedProduct ? formatINR(Math.round(C.earn.defaultLoanAmount * selectedProduct.payoutPct / 100) * C.earn.defaultReferralCount) : '₹0'}</div>
          <div class="earn-calculator__sub" id="calc-sub">for ${C.earn.defaultReferralCount} referrals at ${selectedProduct?.payoutPct || 0}% payout</div>

          <div class="earn-calculator__slider-group">
            <div class="earn-calculator__slider-label">
              <span>Loan Amount</span>
              <span class="earn-calculator__slider-value" id="calc-loan-label">${formatINR(C.earn.defaultLoanAmount)}</span>
            </div>
            <input type="range" class="earn-calculator__slider" id="calc-loan-slider" min="500000" max="50000000" step="500000" value="${C.earn.defaultLoanAmount}">
          </div>

          <div class="earn-calculator__slider-group">
            <div class="earn-calculator__slider-label">
              <span>Number of Referrals</span>
              <span class="earn-calculator__slider-value" id="calc-ref-label">${C.earn.defaultReferralCount}</span>
            </div>
            <input type="range" class="earn-calculator__slider" id="calc-ref-slider" min="1" max="50" step="1" value="${C.earn.defaultReferralCount}">
          </div>

          <div class="earn-calculator__note">${C.earn.calculatorNote}</div>
        </div>
      </div>
    </section>
  ` : '';

  // --- Trust Section ---
  const trustIconSVGs: Record<string, string> = {
    encrypt: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    noDoc: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/></svg>',
    payout: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    rbi: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
  };

  const trustHTML = `
    <section class="trust-section" id="trust" aria-labelledby="trust-title">
      <div class="trust-section__inner">
        <div class="trust-section__label">${C.trust.sectionLabel}</div>
        <h2 id="trust-title" class="trust-section__title">${C.trust.title}</h2>

        <div class="trust-section__cards">
          ${C.trust.cards.map(card => `
            <div class="trust-card">
              <div class="trust-card__icon">${trustIconSVGs[card.icon] || ''}</div>
              <h3 class="trust-card__title">${card.title}</h3>
              <p class="trust-card__desc">${card.description}</p>
            </div>
          `).join('')}
        </div>

        ${lenders.length ? `
          <div class="trust-lenders">
            ${lenders.map(l => `
              <div class="trust-lender-chip">
                <span class="trust-lender-chip__dot"></span>
                <span>${l.name}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </section>
  `;

  // --- Testimonials ---
  const approvedTestimonials = testimonials.filter(t => t.quote);
  const testimonialColors = ['#F4B942', '#ECC6E4', '#B9C9F5', '#BFE5C8'];
  const testimonialsHTML = approvedTestimonials.length ? `
    <section class="testimonials-section" aria-labelledby="testimonials-title">
      <div class="testimonials-section__inner">
        <div class="testimonials-section__label">${C.testimonials.sectionLabel}</div>
        <h2 id="testimonials-title" class="testimonials-section__title">${C.testimonials.title}</h2>
        <div class="testimonials-section__grid">
          ${approvedTestimonials.map((t, i) => `
            <div class="testimonial-card">
              <p class="testimonial-card__quote">"${t.quote}"</p>
              <div class="testimonial-card__author">
                <div class="testimonial-card__avatar" style="background:${testimonialColors[i % testimonialColors.length]}">${t.name.charAt(0)}</div>
                <div>
                  <div class="testimonial-card__name">${t.name}</div>
                  <div class="testimonial-card__role">${t.role}, ${t.city}</div>
                  ${t.earnings ? `<div class="testimonial-card__earnings">${t.earnings}</div>` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  ` : '';

  // --- FAQ ---
  const faqHTML = `
    <section class="landing-faq" id="faq" aria-labelledby="faq-title">
      <div class="landing-faq__inner">
        <div>
          <div class="landing-faq__label">${C.faq.sectionLabel}</div>
          <h2 id="faq-title" class="landing-faq__title">${C.faq.title}</h2>
        </div>
        <div class="landing-faq__items">
          ${C.faq.items.map((item, i) => `
            <div class="landing-faq__item" data-faq-index="${i}">
              <button type="button" class="landing-faq__question" aria-expanded="false" aria-controls="faq-answer-${i}">
                <span>${item.question}</span>
                <span class="landing-faq__icon">+</span>
              </button>
              <div class="landing-faq__answer" id="faq-answer-${i}" role="region">${item.answer}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  // --- Closing Band ---
  const closingHTML = `
    <section class="landing-closing" aria-label="Get Started">
      <div class="landing-closing__inner">
        <h2 class="landing-closing__headline">${C.closingBand.headline}</h2>
        <p class="landing-closing__subtext">${C.closingBand.subtext}</p>
        <button type="button" class="landing-closing__btn" id="closing-cta-btn">
          <span>${C.closingBand.cta}</span>
          ${iconArrowRight(16, 'icon')}
        </button>
      </div>
    </section>
  `;

  // --- Footer ---
  const footerHTML = `
    <footer class="landing-footer">
      <div class="landing-footer__inner">
        <div class="landing-footer__top">
          <div>
            <div class="landing-footer__brand-logo">justrefer</div>
            <p class="landing-footer__brand-desc">${C.footer.description}</p>
          </div>
          ${C.footer.columns.map(col => `
            <div>
              <div class="landing-footer__col-title">${col.title}</div>
              <ul class="landing-footer__links">
                ${col.links.map(link => `
                  <li><a href="${link.href}" class="landing-footer__link">${link.label}</a></li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
        <div class="landing-footer__bottom">
          <span class="landing-footer__disclaimer">${C.footer.disclaimer}</span>
          <ul class="landing-footer__legal-links">
            ${C.footer.legalLinks.map(link => `
              <li><a href="${link.href}" class="landing-footer__legal-link">${link.label}</a></li>
            `).join('')}
          </ul>
        </div>
      </div>
    </footer>
  `;

  // --- Set Meta ---
  document.title = C.meta.title;
  let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = C.meta.description;

  // --- Render ---
  container.innerHTML = `
    ${productBarHTML}
    ${navHTML}
    <main>
      ${heroHTML}
      ${statsHTML}
      ${howHTML}
      ${earnHTML}
      ${trustHTML}
      ${testimonialsHTML}
      ${faqHTML}
      ${closingHTML}
    </main>
    ${footerHTML}
  `;

  // --- Bind Events ---
  bindNavEvents(container, options, isLoggedIn);
  bindFaqEvents(container);
  bindCalculatorEvents(container, products);
  bindCTAEvents(container, options);
}

function renderHeroPreview(products: PublicProduct[]): string {
  return `
    <div style="padding:20px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-weight:700;font-style:italic;font-size:13px;color:var(--ink)">justrefer</span>
        <div style="flex:1"></div>
        <div style="width:24px;height:24px;border-radius:50%;background:var(--line);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:var(--ink)">AR</div>
      </div>

      <div style="background:var(--white);border-radius:12px;padding:16px;border:1px solid var(--line);margin-bottom:12px">
        <div style="font-size:10px;font-family:var(--font-mono);text-transform:uppercase;color:var(--muted);letter-spacing:0.05em;margin-bottom:4px">COMMISSION EARNED</div>
        <div style="font-size:24px;font-weight:700;color:var(--ink)">₹7,85,000</div>
        <div style="font-size:11px;color:var(--green-accent);margin-top:2px">100% Payout Disbursed</div>
        <svg style="width:100%;height:40px;margin-top:8px" viewBox="0 0 300 40" preserveAspectRatio="none">
          <path d="M 0,35 Q 60,30 110,24 T 210,15 T 290,5 L 290,40 L 0,40 Z" fill="var(--green-tint)"/>
          <path d="M 0,35 Q 60,30 110,24 T 210,15 T 290,5" fill="none" stroke="var(--green-accent)" stroke-width="2" stroke-linecap="round"/>
          <circle cx="290" cy="5" r="3" fill="var(--green-accent)"/>
        </svg>
      </div>

      ${products.slice(0, 3).map(p => `
        <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--line)">
          <div style="width:8px;height:8px;border-radius:50%;background:${p.iconColor || '#ccc'}"></div>
          <span style="font-size:12px;font-weight:500;color:var(--ink);flex:1">${p.name}</span>
          <span style="font-size:11px;color:var(--green-accent);font-family:var(--font-mono)">${p.payoutPct}%</span>
        </div>
      `).join('')}

      <div style="background:var(--green-tint);border-radius:8px;padding:10px 12px;margin-top:12px;display:flex;align-items:center;gap:6px">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green-accent)" stroke-width="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
        <span style="font-size:11px;color:var(--green-accent);font-weight:500">Tracked to the rupee • Weekly IMPS</span>
      </div>
    </div>
  `;
}

function bindNavEvents(container: HTMLElement, options: LandingOptions, isLoggedIn: boolean) {
  // Products dropdown
  const productsBtn = container.querySelector<HTMLElement>('#nav-products-btn');
  const productsMenu = container.querySelector<HTMLElement>('#nav-products-menu');
  let productsOpen = false;

  productsBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    productsOpen = !productsOpen;
    productsMenu?.classList.toggle('is-open', productsOpen);
    productsBtn.setAttribute('aria-expanded', String(productsOpen));
  });

  productsMenu?.querySelectorAll('.main-nav__dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      productsOpen = false;
      productsMenu.classList.remove('is-open');
      productsBtn?.setAttribute('aria-expanded', 'false');
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

  container.querySelectorAll('[data-close-mobile]').forEach(el => {
    el.addEventListener('click', () => {
      mobilePanel?.classList.remove('is-open');
    });
  });

  // Auth buttons
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

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (productsOpen && productsMenu && !productsBtn?.contains(e.target as Node) && !productsMenu.contains(e.target as Node)) {
      productsOpen = false;
      productsMenu.classList.remove('is-open');
      productsBtn?.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (productsOpen) {
        productsOpen = false;
        productsMenu?.classList.remove('is-open');
        productsBtn?.setAttribute('aria-expanded', 'false');
      }
      mobilePanel?.classList.remove('is-open');
    }
  });
}

function bindFaqEvents(container: HTMLElement) {
  const faqItems = container.querySelectorAll<HTMLElement>('.landing-faq__item');
  faqItems.forEach(item => {
    const btn = item.querySelector<HTMLButtonElement>('.landing-faq__question');
    btn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      // Close all
      faqItems.forEach(i => {
        i.classList.remove('is-open');
        i.querySelector('.landing-faq__question')?.setAttribute('aria-expanded', 'false');
      });
      // Open this one if it was closed
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard accessible
    btn?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
}

function bindCalculatorEvents(container: HTMLElement, products: PublicProduct[]) {
  if (!products.length) return;

  let selectedPayout = products[0].payoutPct;
  let selectedName = products[0].name;

  const loanSlider = container.querySelector<HTMLInputElement>('#calc-loan-slider');
  const refSlider = container.querySelector<HTMLInputElement>('#calc-ref-slider');
  const calcAmount = container.querySelector<HTMLElement>('#calc-amount');
  const calcSub = container.querySelector<HTMLElement>('#calc-sub');
  const calcLoanLabel = container.querySelector<HTMLElement>('#calc-loan-label');
  const calcRefLabel = container.querySelector<HTMLElement>('#calc-ref-label');
  const calcProductName = container.querySelector<HTMLElement>('#calc-product-name');
  const productRows = container.querySelectorAll<HTMLElement>('.earn-product-row');

  function formatINR(n: number): string {
    return '₹' + new Intl.NumberFormat('en-IN').format(n);
  }

  function updateCalc() {
    if (!loanSlider || !refSlider || !calcAmount || !calcSub || !calcLoanLabel || !calcRefLabel) return;
    const loan = Number(loanSlider.value);
    const refs = Number(refSlider.value);
    const earning = Math.round(loan * selectedPayout / 100) * refs;
    calcAmount.textContent = formatINR(earning);
    calcSub.textContent = `for ${refs} referral${refs > 1 ? 's' : ''} at ${selectedPayout}% payout`;
    calcLoanLabel.textContent = formatINR(loan);
    calcRefLabel.textContent = String(refs);
    if (calcProductName) calcProductName.textContent = selectedName;
  }

  loanSlider?.addEventListener('input', updateCalc);
  refSlider?.addEventListener('input', updateCalc);

  productRows.forEach(row => {
    row.addEventListener('click', () => {
      productRows.forEach(r => r.classList.remove('is-active'));
      row.classList.add('is-active');
      selectedPayout = Number(row.dataset.payout || 0);
      selectedName = row.dataset.name || '';
      updateCalc();
    });
  });
}

function bindCTAEvents(container: HTMLElement, options: LandingOptions) {
  container.querySelector('#hero-cta-partner')?.addEventListener('click', () => options.onOpenAuth('signup'));
  container.querySelector('#closing-cta-btn')?.addEventListener('click', () => options.onOpenAuth('signup'));
}

