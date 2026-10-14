interface PillTagsProps {
  onOpenModal: () => void
}

const PillTags = ({ onOpenModal }: PillTagsProps) => {
  return (
    <section className="tags-section">
      <div className="container">
        <p className="tags-label">It's all possible on JustRefer</p>
        <div className="tags-container">
          <div className="tags-row">
            <span className="tag-pill tag-yellow">Home Loans</span>
            <span className="tag-pill tag-pink">Business Loans</span>
            <span className="tag-pill tag-orange">Personal Loans</span>
            <span className="tag-pill tag-amber">Loan Against Property</span>
            <span className="tag-pill tag-green">Smart Payouts</span>
          </div>
          <div className="tags-row" style={{ marginTop: '8px' }}>
            <span className="tag-pill tag-cyan">AI Bank Matching</span>
            <span className="tag-pill tag-emerald">Instant Sanctions</span>
            <span className="tag-pill tag-indigo">Direct Lenders</span>
            <button
              type="button"
              className="tag-pill tag-dark-btn"
              onClick={onOpenModal}
            >
              Get Started →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PillTags
