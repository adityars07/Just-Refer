import { useState } from 'react'

interface CreateAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const CreateAccountModal = ({ isOpen, onClose, onSuccess }: CreateAccountModalProps) => {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      if (onSuccess) onSuccess()
      onClose()
    }, 1200)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="modal-header">
          <div className="modal-brand-badge">
            <span>$</span>
          </div>
          <h3>Create Your Account</h3>
          <p>Start referring and earning in minutes.</p>
        </div>

        {submitted ? (
          <div className="modal-success-state">
            <div className="modal-success-icon">✓</div>
            <h4>Welcome to JustRefer, {fullName || 'Partner'}!</h4>
            <p>Your partner account has been created. Redirecting to your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                required
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Create Password</label>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <label className="checkbox-row">
              <input
                type="checkbox"
                required
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span>I agree to the <a href="#terms">Terms & Conditions</a></span>
            </label>

            <button type="submit" className="btn-modal-submit">
              Create Account
            </button>

            <div className="modal-footer-note">
              Already have an account? <a href="#login" onClick={(e) => { e.preventDefault(); if (onSuccess) onSuccess(); onClose(); }}>Login</a>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default CreateAccountModal
