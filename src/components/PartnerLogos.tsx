const PartnerLogos = () => {
  const partners = [
    { name: 'HDFC Bank', code: 'HDFC BANK', bg: '#004c8f', color: '#fff' },
    { name: 'ICICI Bank', code: 'ICICI Bank', bg: '#b3282d', color: '#fff' },
    { name: 'State Bank of India', code: 'SBI', bg: '#280071', color: '#fff' },
    { name: 'Axis Bank', code: 'AXIS BANK', bg: '#97144d', color: '#fff' },
    { name: 'Bajaj Finserv', code: 'BAJAJ FINSERV', bg: '#0072bc', color: '#fff' },
    { name: 'Tata Capital', code: 'TATA CAPITAL', bg: '#00539b', color: '#fff' },
    { name: 'Aditya Birla Finance', code: 'ADITYA BIRLA FINANCE', bg: '#c72027', color: '#fff' },
  ]

  return (
    <section className="partner-strip-section">
      <div className="container">
        <div className="partner-strip-header">
          <span>Trusted by Leading Banks & NBFCs</span>
        </div>
        <div className="partner-strip-logos">
          {partners.map((p, idx) => (
            <div key={idx} className="partner-bank-pill">
              <span className="bank-logo-text" style={{ borderColor: p.bg }}>
                {p.code}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PartnerLogos
