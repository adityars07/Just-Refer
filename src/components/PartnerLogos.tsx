const PartnerLogos = () => {
  const partners = [
    { name: 'HDFC Bank', icon: '🏦' },
    { name: 'State Bank of India', icon: '🏛️' },
    { name: 'ICICI Bank', icon: '🏢' },
    { name: 'Axis Bank', icon: '🏛️' },
    { name: 'Kotak Mahindra', icon: '🏦' },
    { name: 'Tata Capital', icon: '📈' },
    { name: 'Google Verified', icon: '🛡️' },
    { name: '256-Bit SSL Secured', icon: '🔒' },
  ]

  return (
    <div className="partners-strip">
      <div className="container">
        <div className="partners-title">
          TRUSTED BY LEADING FINANCIAL INSTITUTIONS & OVER 10,000+ BORROWERS
        </div>
        <div className="partners-logos">
          {partners.map((partner, idx) => (
            <div key={idx} className="partner-logo-item">
              <span style={{ fontSize: '1.25rem' }}>{partner.icon}</span>
              <span>{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PartnerLogos
