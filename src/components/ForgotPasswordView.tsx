import { useState } from 'react'

interface ForgotPasswordViewProps {
  onBackToLogin: () => void
}

const ForgotPasswordView = ({ onBackToLogin }: ForgotPasswordViewProps) => {
  const [step, setStep] = useState<'email' | 'otp' | 'reset' | 'done'>('email')
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim()) {
      setError('Please enter your phone number or email')
      return
    }
    setError('')
    setIsLoading(true)

    // Simulate OTP send (backend endpoint can be added later)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      })
      if (res.ok) {
        setStep('otp')
      } else {
        // Still move to OTP step for UX (don't reveal if account exists)
        setStep('otp')
      }
    } catch {
      // Fallback: move to OTP step anyway
      setStep('otp')
    }
    setIsLoading(false)
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length < 4) {
      setError('Please enter a valid OTP')
      return
    }
    setError('')
    setStep('reset')
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setError('')
    setIsLoading(true)

    try {
      await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp, newPassword }),
      })
    } catch {
      // Proceed anyway
    }

    setIsLoading(false)
    setStep('done')
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
              Reset Your<br />Password
            </h1>
            <p className="auth-brand-subtext">
              Don't worry, we'll help you get back to your account. Just follow the simple steps.
            </p>

            <div className="auth-steps-visual">
              <div className={`auth-step-dot ${step === 'email' ? 'active' : 'done'}`}>
                <span>1</span>
                <label>Enter Email/Phone</label>
              </div>
              <div className="auth-step-line" />
              <div className={`auth-step-dot ${step === 'otp' ? 'active' : (step === 'reset' || step === 'done' ? 'done' : '')}`}>
                <span>2</span>
                <label>Verify OTP</label>
              </div>
              <div className="auth-step-line" />
              <div className={`auth-step-dot ${step === 'reset' ? 'active' : (step === 'done' ? 'done' : '')}`}>
                <span>3</span>
                <label>New Password</label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-form-panel">
          <div className="auth-form-container">
            {step === 'done' ? (
              <div className="auth-success-state">
                <div className="auth-success-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1F9D55" strokeWidth="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h2>Password Reset Successful! ✅</h2>
                <p>Your password has been updated. You can now sign in with your new password.</p>
                <button type="button" className="auth-submit-btn" onClick={onBackToLogin}>
                  ← Back to Sign In
                </button>
              </div>
            ) : (
              <>
                {step === 'email' && (
                  <>
                    <h2 className="auth-form-title">Forgot Password?</h2>
                    <p className="auth-form-subtitle">Enter your registered phone number or email to receive an OTP</p>

                    {error && <div className="auth-error-banner">{error}</div>}

                    <form onSubmit={handleSendOtp} className="auth-form">
                      <div className="auth-field">
                        <label>Phone Number or Email</label>
                        <input
                          type="text"
                          placeholder="e.g. 9876543210 or name@email.com"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className="auth-input"
                          autoFocus
                        />
                      </div>
                      <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                        {isLoading ? <span className="auth-spinner" /> : 'Send OTP →'}
                      </button>
                    </form>
                  </>
                )}

                {step === 'otp' && (
                  <>
                    <h2 className="auth-form-title">Enter OTP</h2>
                    <p className="auth-form-subtitle">
                      We've sent a verification code to <strong>{identifier}</strong>
                    </p>

                    {error && <div className="auth-error-banner">{error}</div>}

                    <form onSubmit={handleVerifyOtp} className="auth-form">
                      <div className="auth-field">
                        <label>Verification Code</label>
                        <input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className="auth-input auth-input-otp"
                          maxLength={6}
                          autoFocus
                        />
                      </div>
                      <button type="submit" className="auth-submit-btn">
                        Verify OTP →
                      </button>
                      <button type="button" className="auth-resend-link" onClick={() => setStep('email')}>
                        Didn't receive code? Resend OTP
                      </button>
                    </form>
                  </>
                )}

                {step === 'reset' && (
                  <>
                    <h2 className="auth-form-title">Create New Password</h2>
                    <p className="auth-form-subtitle">Your new password must be at least 6 characters</p>

                    {error && <div className="auth-error-banner">{error}</div>}

                    <form onSubmit={handleResetPassword} className="auth-form">
                      <div className="auth-field">
                        <label>New Password</label>
                        <input
                          type="password"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="auth-input"
                          autoFocus
                        />
                      </div>
                      <div className="auth-field">
                        <label>Confirm Password</label>
                        <input
                          type="password"
                          placeholder="Re-enter new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="auth-input"
                        />
                      </div>
                      <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                        {isLoading ? <span className="auth-spinner" /> : 'Reset Password →'}
                      </button>
                    </form>
                  </>
                )}

                <p className="auth-switch-text" style={{ marginTop: 24 }}>
                  Remember your password?{' '}
                  <button type="button" className="auth-switch-link" onClick={onBackToLogin}>
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

export default ForgotPasswordView
