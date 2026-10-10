const PromotionalBanner = () => {
  return (
    <div className="container">
      <div className="promo-dark-banner">
        <h2>Flexible Loans For Everyday People</h2>
        <p>
          We offer fast, flexible retail & commercial loans tailored for every financial milestone. Apply today or refer a contact to start earning immediately.
        </p>
        <a href="#calculator" className="btn-pill-primary" style={{ background: '#ffffff', color: '#0b472a', fontWeight: 800 }}>
          Apply Now
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    </div>
  )
}

export default PromotionalBanner
