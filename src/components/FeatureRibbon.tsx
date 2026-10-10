const FeatureRibbon = () => {
  const items = [
    { title: 'Apply Online', desc: '100% digital process' },
    { title: 'No hidden fees', desc: 'Complete rate transparency' },
    { title: 'Flexible options', desc: 'Customized tenures & LTV' },
    { title: 'T+2 Payouts', desc: 'Rapid commission settlement' },
  ]

  return (
    <div className="container">
      <div className="feature-ribbon-bar">
        {items.map((item, idx) => (
          <div key={idx} className="ribbon-item">
            <div className="ribbon-icon-circle">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeatureRibbon
