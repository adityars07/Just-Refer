const FeaturesGrid = () => {
  const features = [
    {
      tag: 'JustRefer Strategies',
      title: 'Complex banking, made simple',
      description:
        'JustRefer automates loan matching — Personal, Home, Business, and LAP — setting your borrowers up with lowest rates and you with highest commission in a few clicks.',
    },
    {
      tag: 'Multi-Lender Network',
      title: 'Earn across 30+ leading institutions',
      description:
        'Access top-tier DSA commission slabs from private banks, PSUs, and premier NBFCs without needing individual bank DSA codes or monthly volume quotas.',
    },
    {
      tag: 'Fast Payouts',
      title: 'Automate cash payouts with Smart Settle',
      description:
        'Smart Settle is our instant payout system replacing traditional 60-day DSA payment delays — automatically credited directly to your bank account as soon as the loan disburses.',
    },
    {
      tag: 'Loan Eligibility AI',
      title: 'Navigate loan eligibility with confidence',
      description:
        'Whether you are calculating FOIR, finding the best loan for low CIBIL, or structuring complex business financials, our AI loan advisor is here to help 24/7.',
      comingSoon: true,
    },
  ]

  return (
    <section className="features-grid-section">
      <div className="container">
        <div className="features-grid-2x2">
          {features.map((feature, index) => (
            <div key={index} className="features-grid-cell">
              <span className="feature-tag">{feature.tag}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              {feature.comingSoon && (
                <span className="coming-soon">Coming soon</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesGrid
