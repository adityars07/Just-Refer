import {
  iconArrowRight,
  iconRefresh,
  iconBell,
  iconHouse,
  iconBuilding,
  iconBriefcase,
  iconUser,
  iconBolt,
} from '../icons.js';

export function initHero(container: HTMLElement, onOpenReferralModal: () => void) {
  container.innerHTML = `
    <section class="hero on-charcoal" aria-labelledby="hero-heading">
      <div class="wrap hero__inner">
        <div class="hero__text-block">
          <div class="hero__badge">
            <span class="hero__badge-dot"></span>
            <span>India's #1 Loan Referral Platform</span>
          </div>

          <h1 id="hero-heading" class="hero__h1">
            Earn commissions on every loan — theirs or yours
          </h1>

          <p class="hero__paragraph">
            Whether you refer a client or apply for your own home, business, or personal loan, get the lowest bank rates and keep the payout for yourself.
          </p>

          <button type="button" class="hero__cta-btn" id="hero-cta-btn">
            <span>Join JustRefer</span>
            ${iconArrowRight(16, 'icon')}
          </button>
        </div>

        <!-- Product Preview Panel -->
        <div class="preview-panel" role="region" aria-label="JustRefer Platform Preview">
          <div class="preview-panel__topbar">
            <span class="preview-panel__wordmark">justrefer</span>

            <div class="preview-panel__tabs" role="tablist">
              <button type="button" class="preview-panel__tab is-active" role="tab" aria-selected="true">Home</button>
              <button type="button" class="preview-panel__tab" role="tab" aria-selected="false">Referrals</button>
              <button type="button" class="preview-panel__tab" role="tab" aria-selected="false">Payouts</button>
            </div>

            <div class="preview-panel__topbar-right">
              <button type="button" class="preview-panel__icon-btn" aria-label="Refresh Data">
                ${iconRefresh(14, 'icon')}
              </button>
              <button type="button" class="preview-panel__icon-btn" aria-label="Notifications">
                ${iconBell(14, 'icon', true)}
                <span class="preview-panel__notif-dot"></span>
              </button>
              <span class="preview-panel__dsa-tag">DSA #JR-4821</span>
              <div class="preview-panel__avatar" title="Aditya">AR</div>
            </div>
          </div>

          <div class="preview-panel__body">
            <!-- Left Column -->
            <div class="preview-panel__left">
              <!-- Commission Card -->
              <div class="card preview-commission-card">
                <div class="preview-commission-card__left">
                  <span class="lbl">COMMISSION EARNED</span>
                  <strong class="preview-commission-card__amount">₹7,85,000.00</strong>
                  <div class="preview-commission-card__meta">
                    <span class="preview-commission-card__payout">100% Payout Disbursed</span>
                    <span class="preview-commission-card__disbursed">• ₹15.70 Cr Disbursed</span>
                  </div>
                </div>

                <div class="preview-commission-card__right">
                  <div class="preview-range-selector" role="group" aria-label="Preview Range">
                    <button type="button" class="preview-range-btn">1M</button>
                    <button type="button" class="preview-range-btn">3M</button>
                    <button type="button" class="preview-range-btn">6M</button>
                    <button type="button" class="preview-range-btn">FY</button>
                    <button type="button" class="preview-range-btn is-active">ALL</button>
                  </div>

                  <svg class="preview-chart-svg" viewBox="0 0 300 80" preserveAspectRatio="none" role="img" aria-label="Commission growth chart">
                    <defs>
                      <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#E6F4EA" stop-opacity="1"/>
                        <stop offset="100%" stop-color="#E6F4EA" stop-opacity="0.3"/>
                      </linearGradient>
                    </defs>
                    <path d="M 0,65 Q 60,60 110,48 T 210,30 T 290,14 L 290,80 L 0,80 Z" fill="#E6F4EA" />
                    <path d="M 0,65 Q 60,60 110,48 T 210,30 T 290,14" fill="none" stroke="#1F8A4C" stroke-width="2.25" stroke-linecap="round" />
                    <circle cx="290" cy="14" r="4" fill="#1F8A4C" />
                  </svg>
                </div>
              </div>

              <!-- 4 Loan Rows -->
              <div class="card preview-loan-row">
                <div class="tile tile--amber">${iconHouse(20, 'icon')}</div>
                <div class="preview-loan-row__content">
                  <div class="preview-loan-row__title-wrap">
                    <span class="preview-loan-row__title">Home Loan</span>
                    <span class="gt">✓ Disbursed</span>
                  </div>
                  <span class="preview-loan-row__subtitle">HDFC Bank • Rajesh Sharma • ₹75L Disbursed (Min ₹50L)</span>
                </div>
                <div class="preview-loan-row__right">
                  <span class="preview-loan-row__amount">₹22,500.00</span>
                  <span class="preview-loan-row__comm">+0.3% Comm.</span>
                </div>
              </div>

              <div class="card preview-loan-row">
                <div class="tile tile--pink">${iconBuilding(20, 'icon')}</div>
                <div class="preview-loan-row__content">
                  <div class="preview-loan-row__title-wrap">
                    <span class="preview-loan-row__title">Loan Against Property</span>
                    <span class="gt">✓ Disbursed</span>
                  </div>
                  <span class="preview-loan-row__subtitle">Bajaj Finserv • Mehta Ent. • ₹1.5 Cr Disbursed (Min ₹1 Cr)</span>
                </div>
                <div class="preview-loan-row__right">
                  <span class="preview-loan-row__amount">₹75,000.00</span>
                  <span class="preview-loan-row__comm">+0.5% Comm.</span>
                </div>
              </div>

              <div class="card preview-loan-row">
                <div class="tile tile--green">${iconBriefcase(20, 'icon')}</div>
                <div class="preview-loan-row__content">
                  <div class="preview-loan-row__title-wrap">
                    <span class="preview-loan-row__title">Business Loan</span>
                    <span class="gt">✓ Disbursed</span>
                  </div>
                  <span class="preview-loan-row__subtitle">ICICI Bank • Apex Logistics • ₹25L Disbursed (Min ₹10L)</span>
                </div>
                <div class="preview-loan-row__right">
                  <span class="preview-loan-row__amount">₹25,000.00</span>
                  <span class="preview-loan-row__comm">+1.0% Comm.</span>
                </div>
              </div>

              <div class="card preview-loan-row">
                <div class="tile tile--blue">${iconUser(20, 'icon')}</div>
                <div class="preview-loan-row__content">
                  <div class="preview-loan-row__title-wrap">
                    <span class="preview-loan-row__title">Personal Loan</span>
                    <span class="gt">✓ Disbursed</span>
                  </div>
                  <span class="preview-loan-row__subtitle">Axis Bank • Priya Verma • ₹10L Disbursed (Min ₹5L)</span>
                </div>
                <div class="preview-loan-row__right">
                  <span class="preview-loan-row__amount">₹10,000.00</span>
                  <span class="preview-loan-row__comm">+1.0% Comm.</span>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="preview-panel__right">
              <!-- Zero KYC Card -->
              <div class="card preview-kyc-card">
                <div class="preview-kyc-card__tag">
                  ${iconBolt(12, 'icon')}
                  <span class="lbl" style="color: var(--green-text);">ZERO KYC REQUIRED</span>
                </div>

                <h2 class="preview-kyc-card__title">Refer a Client in 30s</h2>

                <p class="preview-kyc-card__desc">
                  Submit applicant name & loan requirement. Direct automated routing to 40+ lending institutions with top approval odds.
                </p>

                <div class="preview-kyc-card__chips">
                  <span class="preview-kyc-chip">Home (0.3%)</span>
                  <span class="preview-kyc-chip">LAP (0.5%)</span>
                  <span class="preview-kyc-chip">Personal (1%)</span>
                  <span class="preview-kyc-chip">Business (1%)</span>
                </div>

                <button type="button" class="preview-kyc-card__submit-btn" id="preview-submit-btn">
                  + Submit Loan Referral →
                </button>
              </div>

              <!-- Next Payout Card -->
              <div class="card preview-payout-card">
                <span class="lbl">NEXT WEEKLY PAYOUT</span>
                <strong class="preview-payout-card__amount">₹48,500.00</strong>
                <div class="preview-payout-card__status">
                  <span class="preview-payout-card__dot"></span>
                  <span>Scheduled for Friday • Auto IMPS/UPI</span>
                </div>
                <div class="preview-payout-card__row">
                  <span class="preview-payout-card__row-left">Direct Bank Credit</span>
                  <span class="preview-payout-card__row-right">Zero TDS Deducted</span>
                </div>
              </div>

              <!-- Pipeline Card -->
              <div class="card preview-pipeline-card">
                <div class="preview-pipeline-col">
                  <strong class="preview-pipeline-num">3</strong>
                  <span class="preview-pipeline-label">In Login</span>
                </div>
                <div class="preview-pipeline-col">
                  <strong class="preview-pipeline-num">2</strong>
                  <span class="preview-pipeline-label">Underwriting</span>
                </div>
                <div class="preview-pipeline-col">
                  <strong class="preview-pipeline-num">2</strong>
                  <span class="preview-pipeline-label">Sanctioned</span>
                </div>
                <div class="preview-pipeline-col">
                  <strong class="preview-pipeline-num preview-pipeline-num--green">4</strong>
                  <span class="preview-pipeline-label">Disbursed</span>
                </div>
              </div>
            </div>
          </div>

          <div class="preview-panel__footer">
            JustRefer Partner Platform. Commission structure: Home Loan 0.3%, LAP 0.5%, Personal Loan 1.0%, Business Loan 1.0% of disbursement. Zero KYC required.
          </div>
        </div>
      </div>
    </section>
  `;

  // Attach button events
  const ctaBtn = container.querySelector('#hero-cta-btn');
  ctaBtn?.addEventListener('click', onOpenReferralModal);

  const previewSubmitBtn = container.querySelector('#preview-submit-btn');
  previewSubmitBtn?.addEventListener('click', onOpenReferralModal);
}
