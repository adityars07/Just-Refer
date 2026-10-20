const PartnerLogos = () => {
  const partners = [
    { name: 'HDFC Bank', sub: 'Housing & Business' },
    { name: 'ICICI Bank', sub: 'Personal & Auto' },
    { name: 'State Bank of India', sub: 'PSU Home Loans' },
    { name: 'Axis Bank', sub: 'Corporate & SME' },
    { name: 'Kotak Mahindra', sub: 'Fast Track LAP' },
    { name: 'Bajaj Finserv', sub: 'Instant Approvals' },
  ]

  return (
    <section className="featured-strip">
      <div className="container">
        <div className="featured-strip-inner">
          <span className="featured-label">Loans sanctioned through India's top lenders:</span>
          <div className="featured-logos">
            {partners.map((partner) => (
              <div key={partner.name} className="featured-partner-item">
                <span className="featured-logo">{partner.name}</span>
              </div>
            ))}
            <div className="featured-partner-item">
              <span className="featured-logo" style={{ color: '#1F9D55', fontWeight: 600, fontSize: 13, background: '#e6f7ee', padding: '3px 10px', borderRadius: 999 }}>
                + 35 more
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PartnerLogos
