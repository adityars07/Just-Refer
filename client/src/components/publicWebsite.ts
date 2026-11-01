import { api } from '../api/client.js';
import {
  MARKETING_PRODUCTS,
  MARKETING_SETTLEMENT,
  LENDERS_LIST,
} from '../data/marketing.js';
import {
  iconUser,
  iconCube,
  iconHouse,
  iconBuilding,
  iconBriefcase,
  iconCheck,
  iconArrowRight,
} from '../icons.js';

interface PublicWebsiteOptions {
  onOpenReferralModal: () => void;
}

export async function initPublicWebsite(
  container: HTMLElement,
  options: PublicWebsiteOptions
) {
  let products = MARKETING_PRODUCTS;
  let settlement = MARKETING_SETTLEMENT;

  try {
    const pData = await api.getProducts();
    if (pData && pData.length) products = pData;
  } catch {
    products = MARKETING_PRODUCTS;
  }

  try {
    const sData = await api.getLatestSettlement();
    if (sData) settlement = sData;
  } catch {
    settlement = MARKETING_SETTLEMENT;
  }

  const getTileClass = (id: string) => {
    switch (id) {
      case 'home': return 'amber';
      case 'lap': return 'pink';
      case 'personal': return 'blue';
      case 'business': return 'green';
      default: return 'amber';
    }
  };

  const getProductIcon = (id: string) => {
    switch (id) {
      case 'home': return iconHouse(20, 'icon');
      case 'lap': return iconBuilding(20, 'icon');
      case 'personal': return iconUser(20, 'icon');
      case 'business': return iconBriefcase(20, 'icon');
      default: return iconHouse(20, 'icon');
    }
  };

  container.innerHTML = `
    <!-- 2.3 Lenders Strip -->
    <section class="lenders-strip" aria-label="Lending Partners">
      <div class="wrap lenders-strip__inner">
        <span class="lenders-strip__label">Loans sanctioned through India's top lenders:</span>
        ${LENDERS_LIST.map((l) => `<span class="lenders-strip__name">${l}</span>`).join('')}
        <span class="gt lenders-strip__badge">+ 35 more</span>
      </div>
    </section>

    <!-- 2.4 Audience Tiles -->
    <section class="audience" aria-label="Target Audience">
      <div class="wrap audience__grid">
        <div class="card audience-card">
          <div class="tile tile--green">${iconUser(20, 'icon')}</div>
          <span class="audience-card__label">For individual referrers</span>
        </div>
        <div class="card audience-card">
          <div class="tile tile--blue">${iconCube(20, 'icon')}</div>
          <span class="audience-card__label">For CAs & advisors</span>
        </div>
        <div class="card audience-card">
          <div class="tile tile--pink">${iconHouse(20, 'icon')}</div>
          <span class="audience-card__label">For real estate brokers</span>
        </div>
      </div>
    </section>

    <!-- 2.5 Direct Payouts Section -->
    <section class="direct-payouts" id="products" aria-labelledby="direct-payouts-title">
      <div class="wrap">
        <div class="direct-payouts__top-row">
          <!-- Left Column -->
          <div class="direct-payouts__left">
            <span class="lbl direct-payouts__tag">Direct lender tie-ups</span>

            <h2 id="direct-payouts-title" class="direct-payouts__h2">
              Direct Institutional Payouts & Transparent Slabs
            </h2>

            <p class="direct-payouts__paragraph">
              Refer your network for high-value loans with direct bank tie-ups. JustRefer provides institutional commission slabs, guaranteed weekly IMPS settlements, and zero document collection burden on you.
            </p>

            <!-- 2x2 Product Cards Grid -->
            <div class="direct-payouts__product-grid">
              ${products
                .map((p) => {
                  let payoutVal = '₹30,000';
                  let payoutSub = 'on ₹1 Cr loan';
                  if (p.examplePayoutLabel && p.examplePayoutLabel.includes(' on ')) {
                    const parts = p.examplePayoutLabel.split(' on ');
                    payoutVal = parts[0];
                    payoutSub = 'on ' + parts[1];
                  } else if (p.id === 'home') {
                    payoutVal = '₹30,000';
                    payoutSub = 'on ₹1 Cr loan';
                  } else if (p.id === 'lap') {
                    payoutVal = '₹50,000';
                    payoutSub = 'on ₹1 Cr loan';
                  } else if (p.id === 'personal') {
                    payoutVal = '₹10,000';
                    payoutSub = 'on ₹10L loan';
                  } else if (p.id === 'business') {
                    payoutVal = '₹25,000';
                    payoutSub = 'on ₹25L loan';
                  }

                  return `
                <div class="card payout-product-card">
                  <div class="payout-product-card__header">
                    <div class="tile tile--${getTileClass(p.id)} payout-product-card__tile">
                      ${getProductIcon(p.id)}
                    </div>
                    <div class="payout-product-card__title-box">
                      <h3 class="payout-product-card__name">${p.name}</h3>
                      <span class="payout-product-card__min">${p.minAmountLabel}</span>
                    </div>
                    <span class="gt payout-product-card__badge">${p.payoutPct.toFixed(2)}% Payout</span>
                  </div>

                  <div class="payout-product-card__lenders">
                    ${p.lenders.join(' • ')}
                  </div>

                  <div class="payout-product-card__bottom">
                    <div class="payout-product-card__rate-box">
                      <span class="lbl" style="font-size: 10px;">STARTING RATE</span>
                      <div class="payout-product-card__rate">
                        ${p.startingRatePct.toFixed(2)}% <span>p.a.</span>
                      </div>
                    </div>
                    <div class="payout-product-card__calc-box">
                      <span class="payout-product-card__calc-val">${payoutVal}</span>
                      <span class="payout-product-card__calc-sub">${payoutSub}</span>
                    </div>
                  </div>
                </div>
              `;
                })
                .join('')}
            </div>
          </div>

          <!-- Right Column: Settlement Card -->
          <div class="card settlement-card">
            <div class="settlement-card__top">
              <span class="gt settlement-card__pill">
                <span class="settlement-card__dot"></span>
                IMPS Settlement Confirmed
              </span>
              <span class="settlement-card__utr">UTR: ${settlement.utr}</span>
            </div>

            <div class="settlement-card__inner-box">
              <span class="lbl">NET WEEKLY COMMISSION CREDITED</span>
              <strong class="settlement-card__amount">₹${settlement.netAmount.toLocaleString('en-IN')}.00</strong>
              <div class="settlement-card__beneficiary-row">
                <span>Beneficiary: <strong>${settlement.beneficiary}</strong></span>
                <span>${settlement.bankMasked}</span>
              </div>
            </div>

            <span class="lbl" style="color: var(--ink); font-weight: 500;">
              DISBURSED LOANS IN THIS SETTLEMENT
            </span>

            <div class="settlement-card__rows">
              ${settlement.items
                .map(
                  (item) => `
                <div class="settlement-row">
                  <div class="settlement-row__left">
                    <span class="settlement-row__name">${item.applicant} (Ref #${item.refCode})</span>
                    <span class="settlement-row__sub">
                      ${item.productId === 'home' ? 'Home Loan' : item.productId === 'lap' ? 'LAP' : item.productId === 'personal' ? 'Personal Loan' : 'Business Loan'} • ₹${item.loanAmount.toLocaleString('en-IN')} @ ${item.ratePct.toFixed(2)}% (${item.lender})
                    </span>
                  </div>
                  <div class="settlement-row__right">
                    <span class="settlement-row__amount">₹${item.commission.toLocaleString('en-IN')}</span>
                    <span class="settlement-row__slab">${item.slabPct.toFixed(2)}% Slab</span>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>

            <div class="settlement-card__footer">
              <span class="settlement-card__footer-left">Section 194H Compliant • Official TDS Certificate</span>
              <span class="settlement-card__footer-right">Direct IMPS Credit ✓</span>
            </div>
          </div>
        </div>

        <!-- Three Feature Cards -->
        <div class="direct-payouts__features">
          <div class="card feature-check-card">
            <div class="feature-check-card__icon-wrap">
              ${iconCheck(14, 'icon')}
            </div>
            <div class="feature-check-card__content">
              <h3 class="feature-check-card__title">Zero KYC Burden on You</h3>
              <p class="feature-check-card__body">
                Simply submit borrower contact & requirement in 30 seconds. The lending bank collects borrower KYC and physical files directly.
              </p>
            </div>
          </div>

          <div class="card feature-check-card">
            <div class="feature-check-card__icon-wrap">
              ${iconCheck(14, 'icon')}
            </div>
            <div class="feature-check-card__content">
              <h3 class="feature-check-card__title">Weekly Friday IMPS Settlements</h3>
              <p class="feature-check-card__body">
                Direct bank credit every Friday with complete ledger breakdowns, UTR reference, and Section 194H tax compliance.
              </p>
            </div>
          </div>

          <div class="card feature-check-card">
            <div class="feature-check-card__icon-wrap">
              ${iconCheck(14, 'icon')}
            </div>
            <div class="feature-check-card__content">
              <h3 class="feature-check-card__title">Enterprise Loan Ops Desk</h3>
              <p class="feature-check-card__body">
                High-ticket cases (₹1 Cr+) are managed by a dedicated JustRefer enterprise loan manager to ensure fast-track underwriting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2.6 Matching Engine Section -->
    <section class="matching-engine on-charcoal" id="learn" aria-labelledby="matching-engine-title">
      <div class="wrap matching-engine__inner">
        <!-- Left Column -->
        <div class="matching-engine__left">
          <span class="lbl matching-engine__tag">Intelligent loan matching</span>

          <h2 id="matching-engine-title" class="matching-engine__h2">
            Automated Multi-Bank Eligibility Engine
          </h2>

          <p class="matching-engine__paragraph">
            Avoid manual bank rejections and delayed sanctions. JustRefer's algorithmic underwriting engine matches each borrower's profile against real-time credit policies from 24+ scheduled banks and NBFCs to ensure the highest approval probability.
          </p>

          <div class="matching-engine__bullets">
            <div class="matching-engine__bullet">
              <div class="matching-engine__check-wrap">
                ${iconCheck(14, 'icon')}
              </div>
              <p class="matching-engine__bullet-text">
                <strong>Algorithmic Underwriting Match:</strong> Cross-references credit score, income streams, and collateral type to select the right bank before file submission.
              </p>
            </div>

            <div class="matching-engine__bullet">
              <div class="matching-engine__check-wrap">
                ${iconCheck(14, 'icon')}
              </div>
              <p class="matching-engine__bullet-text">
                <strong>Real-Time WhatsApp Milestone Alerts:</strong> Automated status tracking at every phase: Ingested, Sanctioned, Legal Clear, Disbursed, and Commission Transferred.
              </p>
            </div>

            <div class="matching-engine__bullet">
              <div class="matching-engine__check-wrap">
                ${iconCheck(14, 'icon')}
              </div>
              <p class="matching-engine__bullet-text">
                <strong>Single Digital Entry:</strong> No need to submit physical paperwork to multiple branches. One 30-second digital referral covers India's top lending institutions.
              </p>
            </div>
          </div>

          <p class="matching-engine__note">
            All lending institutions are RBI-regulated scheduled commercial banks and licensed NBFCs.
          </p>
        </div>

        <!-- Right Column: Off-white Card -->
        <div class="matching-card">
          <div class="matching-card__top">
            <span class="gt" style="border-radius: var(--radius-pill); width: fit-content;">
              <span class="settlement-card__dot"></span>
              Live Underwriting Routing
            </span>

            <div class="matching-card__lead-row">
              <span class="matching-card__lead-name">Kavita Patel (Director, TechSphere)</span>
              <span class="matching-card__lead-amount">₹80,00,000</span>
            </div>

            <span class="matching-card__lead-sub">
              Home Loan • Bengaluru • CIBIL Score: 785 (Verified)
            </span>
          </div>

          <div class="matching-card__divider"></div>

          <span class="lbl" style="color: var(--ink); font-weight: 500;">
            MULTI-LENDER CREDIT POLICY MATCH
          </span>

          <div class="matching-card__lenders">
            <div class="matching-lender-row matching-lender-row--highlight">
              <div class="matching-lender-logo">HDFC</div>
              <div class="matching-lender-info">
                <span class="matching-lender-name">HDFC Bank</span>
                <span class="matching-lender-details">8.50% p.a. • Pre-approved in 24 hrs</span>
              </div>
              <div class="matching-lender-right">
                <span class="gt" style="background-color: var(--white); border: 1px solid var(--border);">96% Sanction Odds</span>
                <span class="matching-best-match">★ Best Match</span>
              </div>
            </div>

            <div class="matching-lender-row">
              <div class="matching-lender-logo">ICICI</div>
              <div class="matching-lender-info">
                <span class="matching-lender-name">ICICI Bank</span>
                <span class="matching-lender-details">8.55% p.a. • 48 hrs processing</span>
              </div>
              <div class="matching-lender-right">
                <span class="matching-odds-chip">91% Odds</span>
              </div>
            </div>

            <div class="matching-lender-row">
              <div class="matching-lender-logo">AXIS</div>
              <div class="matching-lender-info">
                <span class="matching-lender-name">Axis Bank</span>
                <span class="matching-lender-details">8.60% p.a. • 72 hrs processing</span>
              </div>
              <div class="matching-lender-right">
                <span class="matching-odds-chip">87% Odds</span>
              </div>
            </div>
          </div>

          <!-- Milestones Card -->
          <div class="card milestones-box">
            <span class="lbl">DIGITAL APPLICATION MILESTONES</span>

            <div class="milestones-grid">
              <div class="milestone-col">
                <div class="milestone-circle">
                  ${iconCheck(12, 'icon')}
                </div>
                <span class="milestone-label">Lead Submitted</span>
              </div>

              <div class="milestone-col">
                <div class="milestone-circle">
                  ${iconCheck(12, 'icon')}
                </div>
                <span class="milestone-label">Bank Field Ops</span>
              </div>

              <div class="milestone-col">
                <div class="milestone-circle">
                  ${iconCheck(12, 'icon')}
                </div>
                <span class="milestone-label">Sanction Issued</span>
              </div>

              <div class="milestone-col">
                <div class="milestone-circle milestone-circle--active">
                  <span class="milestone-dot-inner"></span>
                </div>
                <span class="milestone-label milestone-label--bold">Disbursal & Payout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2.7 Why Grid Section -->
    <section class="why-grid" id="pricing" aria-labelledby="why-grid-title">
      <div class="wrap">
        <h2 id="why-grid-title" class="sr-only" style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0;">Why JustRefer</h2>
        
        <div class="why-grid__list">
          <div class="card why-card">
            <span class="why-card__tag">JustRefer Strategies</span>
            <h3 class="why-card__h3">Complex banking, made simple</h3>
            <p class="why-card__body">
              JustRefer automates loan matching — Personal, Home, Business, and LAP — setting your borrowers up with lowest rates and you with highest commission in a few clicks.
            </p>
          </div>

          <div class="card why-card">
            <span class="why-card__tag">Multi-Lender Network</span>
            <h3 class="why-card__h3">Earn across 30+ leading institutions</h3>
            <p class="why-card__body">
              Access top-tier DSA commission slabs from private banks, PSUs, and premier NBFCs without needing individual bank DSA codes or monthly volume quotas.
            </p>
          </div>

          <div class="card why-card">
            <span class="why-card__tag">Fast Payouts</span>
            <h3 class="why-card__h3">Automate cash payouts with Smart Settle</h3>
            <p class="why-card__body">
              Smart Settle is our instant payout system replacing traditional 60-day DSA payment delays — automatically credited directly to your bank account as soon as the loan disburses.
            </p>
          </div>

          <div class="card why-card">
            <span class="why-card__tag">Loan Eligibility AI</span>
            <h3 class="why-card__h3">Navigate loan eligibility with confidence</h3>
            <p class="why-card__body">
              Whether you are calculating FOIR, finding the best loan for low CIBIL, or structuring complex business financials, our AI loan advisor is here to help 24/7.
            </p>
            <span class="why-card__coming-soon">Coming soon</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 2.8 Partners Section Container -->
    <div id="partners-section-container"></div>

    <!-- 2.9 FAQ Section Container -->
    <div id="faq-section-container"></div>

    <!-- 2.10 Closing Band -->
    <section class="closing-band on-charcoal" aria-label="Get Started with JustRefer">
      <div class="wrap closing-band__inner">
        <p class="closing-band__tagline">It's all possible on JustRefer</p>

        <div class="closing-band__chips">
          <span class="closing-band__chip closing-band__chip--amber">Home Loans</span>
          <span class="closing-band__chip closing-band__chip--pink">Business Loans</span>
          <span class="closing-band__chip closing-band__chip--blue">Personal Loans</span>
          <span class="closing-band__chip closing-band__chip--green">Loan Against Property</span>
          <span class="closing-band__chip closing-band__chip--neutral">Smart Payouts</span>
          <span class="closing-band__chip closing-band__chip--neutral">AI Bank Matching</span>
          <span class="closing-band__chip closing-band__chip--neutral">Instant Sanctions</span>
          <span class="closing-band__chip closing-band__chip--neutral">Direct Lenders</span>
        </div>

        <button type="button" class="closing-band__btn" id="closing-get-started-btn">
          <span>Get Started</span>
          ${iconArrowRight(16, 'icon')}
        </button>
      </div>
    </section>

    <!-- 2.11 Footer -->
    <footer class="footer">
      <div class="wrap footer__inner">
        <div class="footer__top">
          <div class="footer__brand">
            <span class="footer__logo">justrefer</span>
            <p class="footer__desc">
              JustRefer is India's premier loan referral platform, connecting referrers with top banks and NBFCs for transparent, high-yield commission payouts.
            </p>
          </div>

          <div class="footer__col">
            <span class="lbl footer__col-title">PRODUCTS</span>
            <ul class="footer__links">
              <li><a href="#products" class="footer__link">Home Loans</a></li>
              <li><a href="#products" class="footer__link">Business Loans</a></li>
              <li><a href="#products" class="footer__link">Personal Loans</a></li>
              <li><a href="#products" class="footer__link">Loan Against Property</a></li>
              <li><a href="#products" class="footer__link">Smart Settle Payouts</a></li>
            </ul>
          </div>

          <div class="footer__col">
            <span class="lbl footer__col-title">RESOURCES</span>
            <ul class="footer__links">
              <li><a href="#learn" class="footer__link">How It Works</a></li>
              <li><a href="#emi" class="footer__link" id="footer-link-emi">Commission Calculator</a></li>
              <li><a href="#faq" class="footer__link" id="footer-link-faq">FAQ</a></li>
              <li><a href="/dashboard" class="footer__link">Partner Portal</a></li>
              <li><a href="/#admin" class="footer__link">Admin Portal</a></li>
            </ul>
          </div>

          <div class="footer__col">
            <span class="lbl footer__col-title">COMPANY</span>
            <ul class="footer__links">
              <li><a href="#about" class="footer__link">About JustRefer</a></li>
              <li><a href="mailto:support@justrefer.in" class="footer__link">Contact Support</a></li>
              <li><a href="#privacy" class="footer__link">Privacy Policy</a></li>
              <li><a href="#terms" class="footer__link">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div class="footer__bottom">
          <span>
            © 2026 JustRefer Technologies Pvt. Ltd. All rights reserved. All lending institutions are RBI-regulated entities.
          </span>
          <ul class="footer__legal-links">
            <li><a href="#privacy" class="footer__legal-link">Privacy</a></li>
            <li><a href="#terms" class="footer__legal-link">Terms</a></li>
            <li><a href="#security" class="footer__legal-link">Security</a></li>
            <li><a href="mailto:support@justrefer.in" class="footer__legal-link">Support</a></li>
          </ul>
        </div>
      </div>
    </footer>
  `;

  // Attach button events
  const getStartedBtn = container.querySelector<HTMLButtonElement>('#closing-get-started-btn');
  getStartedBtn?.addEventListener('click', () => {
    options.onOpenReferralModal();
  });

  const footerFaqLink = container.querySelector<HTMLElement>('#footer-link-faq');
  footerFaqLink?.addEventListener('click', (e) => {
    e.preventDefault();
    container.querySelector('#faq-section-container')?.scrollIntoView({ behavior: 'smooth' });
  });
}
