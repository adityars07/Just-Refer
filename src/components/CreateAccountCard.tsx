import { useState } from 'react'

interface CreateAccountCardProps {
  onSuccess?: () => void
  onLoginClick?: () => void
}

const CreateAccountCard = ({ onSuccess, onLoginClick }: CreateAccountCardProps) => {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      if (onSuccess) onSuccess()
    }, 1200)
  }

  return (
    <div className="create-account-card-wrapper">
      <div className="account-card-box">
        <div className="card-brand-header">
          <div className="brand-dot-logo">
            <span>$</span>
          </div>
          <span className="brand-wordmark">JustRefer</span>
        </div>

        <h3 className="account-card-title">Create Your Account</h3>
        <p className="account-card-subtitle">Start referring and earning in minutes.</p>

        {submitted ? (
          <div className="account-success-msg">
            <span className="success-check-icon">✓</span>
            <h4>Account Created Successfully!</h4>
            <p>Welcome to JustRefer. Loading your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="account-form-grid">
            <div className="field-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="card-input"
              />
            </div>

            <div className="field-group">
              <label>Phone Number</label>
              <input
                type="tel"
                required
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="card-input"
              />
            </div>

            <div className="field-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="card-input"
              />
            </div>

            <div className="field-group">
              <label>Create Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="card-input"
              />
            </div>

            <label className="checkbox-agreement-row">
              <input
                type="checkbox"
                required
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span>I agree to the <a href="#terms">Terms & Conditions</a></span>
            </label>

            <button type="submit" className="btn-create-account-dark">
              Create Account
            </button>

            <div className="account-login-redirect">
              Already have an account? <a href="#login" onClick={(e) => { e.preventDefault(); if (onLoginClick) onLoginClick(); }}>Login</a>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default CreateAccountCard
