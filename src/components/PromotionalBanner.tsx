interface PromotionalBannerProps {
  onOpenModal?: () => void
}

const PromotionalBanner = ({ onOpenModal }: PromotionalBannerProps) => {
  return (
    <section className="corporate-promo-section">
      <div className="container">
        <div className="corporate-banner-card">
          <div className="corporate-content-col">
            <div className="corporate-logo-badge">
              <span className="corp-dot">$</span>
              <span>JustRefer</span>
            </div>

            <h2 className="corporate-heading">
              More Referrals.<br />
              More Opportunities.
            </h2>

            <p className="corporate-subtext">
              Join a growing community of referrers and earn commission by helping people get the right loans.
            </p>

            <div className="corporate-action-row">
              <button
                type="button"
                className="btn-corporate-cta"
                onClick={onOpenModal}
              >
                Get Started for Free →
              </button>
            </div>

            <div className="corporate-community-row">
              <div className="corp-avatars">
                <span className="corp-av">👨‍💼</span>
                <span className="corp-av">👩‍💼</span>
                <span className="corp-av">👨‍💻</span>
              </div>
              <div className="corp-community-text">
                <strong>5,000+</strong>
                <span>Active Referrers</span>
              </div>
            </div>
          </div>

          <div className="corporate-image-col">
            <img
              src="/images/justrefer-building-banner.jpg"
              alt="JustRefer Corporate Headquarters"
              className="corporate-building-photo"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default PromotionalBanner
