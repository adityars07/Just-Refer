import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

interface RegisterViewProps {
  onSwitchToLogin: () => void
  onRegisterSuccess: () => void
}

type RegStep = 'details' | 'otp' | 'success'

const RegisterView = ({ onSwitchToLogin, onRegisterSuccess }: RegisterViewProps) => {
  const { sendOtp, verifyOtp, completeRegistration } = useAuth()

  const [step, setStep] = useState<RegStep>('details')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [upiId, setUpiId] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)

  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [countdown])

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 10)
    setPhone(digits)
  }

  // Step 1: Validate details & send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim()) {
      setError('Please enter your full name')
      return
    }
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit phone number')
      return
    }
    setError('')
    setIsLoading(true)

    const result = await sendOtp(phone)
    setIsLoading(false)

    if (result.success) {
      setStep('otp')
      setCountdown(30)
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } else {
      setError(result.error || 'Failed to send OTP')
    }
  }

  // OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
    if (value && index === 5) {
      const fullCode = newOtp.join('')
      if (fullCode.length === 6) handleVerifyAndRegister(fullCode)
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasteData.length > 0) {
      const newOtp = [...otp]
      for (let i = 0; i < 6; i++) newOtp[i] = pasteData[i] || ''
      setOtp(newOtp)
      if (pasteData.length === 6) handleVerifyAndRegister(pasteData)
    }
  }

  // Step 2: Verify OTP & register
  const handleVerifyAndRegister = async (code?: string) => {
    const otpCode = code || otp.join('')
    if (otpCode.length < 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }
    setError('')
    setIsLoading(true)

    const otpResult = await verifyOtp(phone, otpCode)
    if (!otpResult.success) {
      setIsLoading(false)
      setError(otpResult.error || 'Invalid OTP')
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
      return
    }

    // If existing user, they're already logged in via verifyOtp
    if (!otpResult.isNewUser) {
      setIsLoading(false)
      onRegisterSuccess()
      return
    }

    // New user — complete registration
    const regResult = await completeRegistration({
      fullName,
      phone,
      email: email || undefined,
      upiId: upiId || undefined,
    })
    setIsLoading(false)

    if (regResult.success) {
      setStep('success')
      setTimeout(() => onRegisterSuccess(), 2000)
    } else {
      setError(regResult.error || 'Registration failed')
    }
  }

  const handleResendOtp = async () => {
    if (countdown > 0) return
    setError('')
    setIsLoading(true)
    setOtp(['', '', '', '', '', ''])
    const result = await sendOtp(phone)
    setIsLoading(false)
    if (result.success) {
      setCountdown(30)
      otpRefs.current[0]?.focus()
    } else {
      setError(result.error || 'Failed to resend OTP')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page-inner">
        {/* Left Branding Panel */}
        <div className="auth-brand-panel">
          <div className="auth-brand-content">
            <div className="auth-brand-logo" style={{ marginBottom: 20 }}>
              <Logo size="lg" variant="light" />
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
            ) : step === 'otp' ? (
              <>
                <button
                  type="button"
                  className="auth-back-btn"
                  onClick={() => { setStep('details'); setOtp(['', '', '', '', '', '']); setError('') }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                  </svg>
                  Edit Details
                </button>

                <h2 className="auth-form-title">Verify Your Phone</h2>
                <p className="auth-form-subtitle">
                  Enter the 6-digit OTP sent to <strong>+91 {phone.slice(0, 5)} {phone.slice(5)}</strong>
                </p>

                {error && (
                  <div className="auth-error-banner">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    {error}
                  </div>
                )}

                <div className="auth-otp-boxes" onPaste={handleOtpPaste}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { otpRefs.current[idx] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`auth-otp-input ${digit ? 'filled' : ''}`}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="auth-submit-btn"
                  disabled={isLoading || otp.join('').length < 6}
                  onClick={() => handleVerifyAndRegister()}
                >
                  {isLoading ? <span className="auth-spinner" /> : 'Verify & Create Account'}
                </button>

                <div className="auth-resend-row">
                  {countdown > 0 ? (
                    <span className="auth-resend-timer">
                      Resend OTP in <strong>{countdown}s</strong>
                    </span>
                  ) : (
                    <button type="button" className="auth-resend-link" onClick={handleResendOtp}>
                      Didn't receive code? <strong>Resend OTP</strong>
                    </button>
                  )}
                </div>
              </>
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

                <form onSubmit={handleSendOtp} className="auth-form">
                  <div className="auth-field">
                    <label>Full Name *</label>
                    <div className="auth-input-wrap">
                      <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9AA39F" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="auth-input"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label>Phone Number *</label>
                    <div className="auth-input-wrap auth-phone-input-wrap">
                      <div className="auth-phone-prefix">
                        <span className="auth-phone-flag">🇮🇳</span>
                        <span className="auth-phone-code">+91</span>
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="Enter 10-digit number"
                        value={phone}
                        onChange={(e) => formatPhone(e.target.value)}
                        className="auth-input auth-input-phone"
                        maxLength={10}
                        inputMode="numeric"
                      />
                    </div>
                    <div className="auth-field-hint">We'll verify via OTP — no password needed</div>
                  </div>

                  <div className="auth-field">
                    <label>Email Address <span className="auth-label-optional">(optional)</span></label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input"
                      style={{ paddingLeft: 14 }}
                    />
                  </div>

                  <div className="auth-field">
                    <label>UPI ID <span className="auth-label-optional">(for instant payouts)</span></label>
                    <input
                      type="text"
                      placeholder="e.g. name@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="auth-input"
                      style={{ paddingLeft: 14 }}
                    />
                  </div>

                  <button type="submit" className="auth-submit-btn" disabled={isLoading || phone.length < 10 || !fullName.trim()}>
                    {isLoading ? <span className="auth-spinner" /> : (
                      <>
                        Verify Phone & Register
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </>
                    )}
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
