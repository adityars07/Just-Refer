const PromotionalBanner = () => {
  return (
    <section className="promo-section">
      <div className="container">
        <div className="promo-card-container">
          {/* Left: Card visual */}
          <div className="promo-visual-left">
            <div className="promo-card-mini card-top">
              <div className="mini-chip"></div>
              <div className="mini-brand">JustRefer</div>
            </div>
            <div className="promo-card-mini card-bottom">
              <div className="mini-chip"></div>
              <div className="mini-brand">Titanium</div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="promo-content-right">
            <h2 className="promo-heading">
              Go Further With the Card<br />That Does More
            </h2>
            <p className="promo-sub">
              Apply in minutes and start spending smarter, anywhere in the world.
            </p>
            <div className="promo-btn-group">
              <a href="#plans" className="btn-dark">
                Apply Now
              </a>
              <a href="#benefits" className="btn-outline">
                Explore Features
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PromotionalBanner
