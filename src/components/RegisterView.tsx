import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface RegisterViewProps {
  onSwitchToLogin: () => void
  onRegisterSuccess: () => void
}

const RegisterView = ({ onSwitchToLogin, onRegisterSuccess }: RegisterViewProps) => {
  const { register } = useAuth()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [upiId, setUpiId] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'form' | 'success'>('form')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !phone.trim()) {
      setError('Name and phone number are required')
      return
    }
    if (!agreed) {
      setError('Please agree to the terms')
      return
    }
    setError('')
    setIsLoading(true)

    const result = await register({ fullName, email, phone, password, upiId })
    setIsLoading(false)

    if (result.success) {
      setStep('success')
      setTimeout(() => onRegisterSuccess(), 2000)
    } else {
      setError(result.error || 'Registration failed')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page-inner">
        {/* Left Branding Panel */}
        <div className="auth-brand-panel">
          <div className="auth-brand-content">
            <div className="auth-brand-logo">
              <div className="brand-dot-logo"><span>$</span></div>
              <span className="brand-wordmark" style={{ color: '#fff' }}>JustRefer</span>
            </div>
            <h1 className="auth-brand-headline">
              Start Earning<br />In 2 Minutes
            </h1>
            <p className="auth-brand-subtext">
              No KYC. No paperwork. Simply register and start referring loan customers to earn instant commissions.
            </p>

            <div className="auth-features-list">
              <div className="auth-feature-item">
                <div className="auth-feature-icon">⚡</div>
                <div>
                  <strong>Zero KYC Required</strong>
                  <span>Start referring without any document uploads</span>
                </div>
              </div>
              <div className="auth-feature-item">
                <div className="auth-feature-icon">💰</div>
                <div>
                  <strong>Instant Commissions</strong>
                  <span>Get paid directly to your UPI within 24 hours</span>
                </div>
              </div>
              <div className="auth-feature-item">
                <div className="auth-feature-icon">🏦</div>
                <div>
                  <strong>50+ Bank Partners</strong>
                  <span>Access the widest loan product catalog in India</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-form-panel">
          <div className="auth-form-container">
            {step === 'success' ? (
              <div className="auth-success-state">
                <div className="auth-success-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1F9D55" strokeWidth="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h2>Welcome to JustRefer! 🎉</h2>
                <p>Your partner account has been created successfully. Loading your dashboard...</p>
                <div className="auth-spinner-lg" />
              </div>
            ) : (
              <>
                <div className="auth-form-badge">
                  <span>⚡</span> Zero KYC • 30 Second Setup
                </div>
                <h2 className="auth-form-title">Create Your Account</h2>
                <p className="auth-form-subtitle">Join 10,000+ partners earning with JustRefer</p>

                {error && (
                  <div className="auth-error-banner">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="auth-field-row">
                    <div className="auth-field">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="auth-input"
                        autoFocus
                      />
                    </div>
                    <div className="auth-field">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="auth-input"
                      />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="name@example.com (optional)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input"
                    />
                  </div>

                  <div className="auth-field">
                    <label>Password *</label>
                    <div className="auth-input-wrap">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="auth-input"
                      />
                      <button
                        type="button"
                        className="auth-toggle-pw"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  <div className="auth-field">
                    <label>UPI ID (for instant payouts)</label>
                    <input
                      type="text"
                      placeholder="e.g. name@upi (optional)"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="auth-input"
                    />
                  </div>

                  <label className="auth-checkbox-row">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                    />
                    <span>I agree to the <a href="#terms">Terms & Conditions</a> and <a href="#privacy">Privacy Policy</a></span>
                  </label>

                  <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                    {isLoading ? <span className="auth-spinner" /> : 'Create Account →'}
                  </button>
                </form>

                <p className="auth-switch-text">
                  Already have an account?{' '}
                  <button type="button" className="auth-switch-link" onClick={onSwitchToLogin}>
                    Sign In
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterView
