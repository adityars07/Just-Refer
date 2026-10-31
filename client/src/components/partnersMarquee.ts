import { api } from '../api/client.js';
import { MARKETING_PARTNERS } from '../data/marketing.js';
import { PartnerTestimonial } from '../../../shared/types.js';
import { iconShieldCheck } from '../icons.js';

export async function initPartnersMarquee(container: HTMLElement) {
  let partners: PartnerTestimonial[] = MARKETING_PARTNERS;
  try {
    const res = await api.getPartners();
    if (res && res.length) partners = res;
  } catch {
    partners = MARKETING_PARTNERS;
  }

  // Row splits as specified in section 2.8:
  // Row 1: Amit Patel, CA Rajesh Verma, Priya Sharma, Vikram Singhania
  const row1Items = [partners[0], partners[1], partners[2], partners[3]];
  // Row 2: Ananya Deshmukh, Karthik Sundaram, Harish Rawat, Rohan Mehta
  const row2Items = [partners[4], partners[5], partners[6], partners[7]];
  // Row 3: Sneha Kulkarni, then repeat Amit Patel, CA Rajesh Verma, Priya Sharma
  const row3Items = [partners[8], partners[0], partners[1], partners[2]];

  function renderPills(list: PartnerTestimonial[]): string {
    return list
      .map(
        (p) => `
        <div class="card partner-pill">
          <div class="partner-pill__avatar partner-pill__avatar--${p.tileClass}">${p.initials}</div>
          <div class="partner-pill__info">
            <div class="partner-pill__name-row">
              <span class="partner-pill__name">${p.name}</span>
              <span class="partner-pill__city">${p.city}</span>
            </div>
            <span class="partner-pill__role">${p.role} • ${p.product}</span>
          </div>
        </div>
      `
      )
      .join('');
  }

  // Duplicate for seamless loop
  const row1Html = renderPills([...row1Items, ...row1Items, ...row1Items]);
  const row2Html = renderPills([...row2Items, ...row2Items, ...row2Items]);
  const row3Html = renderPills([...row3Items, ...row3Items, ...row3Items]);

  container.innerHTML = `
    <section class="partners" aria-labelledby="partners-heading">
      <div class="wrap partners__header">
        <div class="gt partners__badge">
          ${iconShieldCheck(14, 'icon')}
          <span>VERIFIED PARTNER EXPERIENCES</span>
        </div>

        <h2 id="partners-heading" class="partners__h2">
          Trusted by 2,400+ Financial & Property Advisors
        </h2>

        <p class="partners__sub">
          Discover how real estate brokers, Chartered Accountants, and wealth managers scale their loan disbursals with direct bank commissions.
        </p>
      </div>

      <div class="partners__marquee-container" aria-hidden="true">
        <div class="marquee-track marquee-track--row1">
          ${row1Html}
        </div>
        <div class="marquee-track marquee-track--row2">
          ${row2Html}
        </div>
        <div class="marquee-track marquee-track--row3">
          ${row3Html}
        </div>
      </div>
    </section>
  `;
}
