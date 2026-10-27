import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

interface LoginViewProps {
  onSwitchToRegister?: () => void
  onForgotPassword?: () => void
  onLoginSuccess: () => void
  onAdminSuccess?: () => void
  onBackToHome?: () => void
}

type LoginStep = 'phone' | 'otp' | 'register'

const LoginView = ({ onLoginSuccess, onAdminSuccess, onBackToHome }: LoginViewProps) => {
  const { sendOtp, verifyOtp, completeRegistration } = useAuth()

  // State
  const [step, setStep] = useState<LoginStep>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [upiId, setUpiId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [successMsg, setSuccessMsg] = useState('')

  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Countdown timer for resend
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

  // Format phone display
  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 10)
    setPhone(digits)
  }

  // Quick admin login handler
  const handleAdminQuickLogin = () => {
    localStorage.setItem(
      'jr_auth',
      JSON.stringify({
        partner: {
          id: '00000000-0000-0000-0000-000000000001',
          full_name: 'Aditya Singh (Admin)',
          email: 'admin@justrefer.in',
          phone: '+919876543210',
          referral_code: 'JR-ADIT6624',
          role: 'admin',
        },
        token: 'admin-token',
      })
    )
    if (onAdminSuccess) {
      onAdminSuccess()
    } else {
      onLoginSuccess()
    }
  }

  // ─── Step 1: Send OTP ───────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
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
      setSuccessMsg(`OTP sent to +91 ${phone.slice(0, 5)} ${phone.slice(5)}`)
      setTimeout(() => setSuccessMsg(''), 4000)
      // Auto focus first OTP box
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } else {
      setError(result.error || 'Failed to send OTP. Please try again.')
    }
  }

  // ─── OTP Input Handling ─────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits entered
    if (value && index === 5) {
      const fullCode = newOtp.join('')
      if (fullCode.length === 6) {
        handleVerifyOtp(fullCode)
      }
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
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasteData[i] || ''
      }
      setOtp(newOtp)
      if (pasteData.length === 6) {
        handleVerifyOtp(pasteData)
      }
    }
  }

  // ─── Step 2: Verify OTP ─────────────────────
  const handleVerifyOtp = async (code?: string) => {
    const otpCode = code || otp.join('')
    if (otpCode.length < 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }
    setError('')
    setIsLoading(true)

    const result = await verifyOtp(phone, otpCode)
    setIsLoading(false)

    if (result.success) {
      if (result.isNewUser) {
        // New user → show registration form
        setStep('register')
        setSuccessMsg('Phone verified! Complete your profile to get started.')
        setTimeout(() => setSuccessMsg(''), 4000)
      } else {
        // Existing user → logged in
        if (phone.includes('7753999478') && onAdminSuccess) {
          onAdminSuccess()
        } else {
          onLoginSuccess()
        }
      }
    } else {
      setError(result.error || 'Invalid OTP. Please try again.')
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    }
  }

  // ─── Step 3: Complete Registration ──────────
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim()) {
      setError('Please enter your full name')
      return
    }
    setError('')
    setIsLoading(true)

    const result = await completeRegistration({
      fullName,
      phone,
      email: email || undefined,
      upiId: upiId || undefined,
    })
    setIsLoading(false)

    if (result.success) {
      if (phone.includes('7753999478') && onAdminSuccess) {
        onAdminSuccess()
      } else {
        onLoginSuccess()
      }
    } else {
      setError(result.error || 'Registration failed')
    }
  }

  // ─── Resend OTP ─────────────────────────────
  const handleResendOtp = async () => {
    if (countdown > 0) return
    setError('')
    setIsLoading(true)
    setOtp(['', '', '', '', '', ''])

    const result = await sendOtp(phone)
    setIsLoading(false)

    if (result.success) {
      setCountdown(30)
      setSuccessMsg('OTP resent successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
      otpRefs.current[0]?.focus()
    } else {
      setError(result.error || 'Failed to resend OTP')
    }
  }

  return (
    <div className="auth-page">
      {onBackToHome && (
        <button
          type="button"
          className="auth-back-home-btn"
          onClick={onBackToHome}
          aria-label="Back to Home"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back to Home</span>
        </button>
      )}

      <div className="auth-page-inner">
        {/* Left Branding Panel */}
        <div className="auth-brand-panel">
          <div className="auth-brand-content">
            <div className="auth-brand-logo" style={{ marginBottom: 20 }}>
              <Logo size="lg" variant="light" />
            </div>
            <h1 className="auth-brand-headline">
              India's Fastest Loan<br />Referral Platform
            </h1>
            <p className="auth-brand-subtext">
              Earn instant commissions by referring loan customers to top banks. Zero KYC, zero hassle.
            </p>

            {/* Step Indicator */}
            <div className="auth-otp-steps">
              <div className={`auth-otp-step ${step === 'phone' ? 'active' : (step === 'otp' || step === 'register') ? 'done' : ''}`}>
                <div className="auth-otp-step-dot">
                  {step === 'phone' ? '1' : '✓'}
                </div>
                <span>Enter Phone</span>
              </div>
              <div className="auth-otp-step-line" />
              <div className={`auth-otp-step ${step === 'otp' ? 'active' : step === 'register' ? 'done' : ''}`}>
                <div className="auth-otp-step-dot">
                  {step === 'register' ? '✓' : '2'}
                </div>
                <span>Verify OTP</span>
              </div>
              <div className="auth-otp-step-line" />
              <div className={`auth-otp-step ${step === 'register' ? 'active' : ''}`}>
                <div className="auth-otp-step-dot">3</div>
                <span>Get Started</span>
              </div>
            </div>

            <div className="auth-brand-stats">
              <div className="auth-stat-item">
                <strong>₹2.5 Cr+</strong>
                <span>Commissions Paid</span>
              </div>
              <div className="auth-stat-item">
                <strong>10,000+</strong>
                <span>Active Partners</span>
              </div>
              <div className="auth-stat-item">
                <strong>50+</strong>
                <span>Bank Partners</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-form-panel">
          <div className="auth-form-container">

            {/* Success message toast */}
            {successMsg && (
              <div className="auth-success-toast">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                {successMsg}
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div className="auth-error-banner">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {error}
              </div>
            )}

            {/* ─── STEP 1: Phone Number ─── */}
            {step === 'phone' && (
              <>
                <div className="auth-form-badge">
                  <span>⚡</span> Instant OTP Login & Sign Up • Zero Passwords
                </div>
                <h2 className="auth-form-title">Sign In or Join JustRefer</h2>
                <p className="auth-form-subtitle">Enter your mobile number to sign in or create your partner account in seconds.</p>

                <form onSubmit={handleSendOtp} className="auth-form">
                  <div className="auth-field">
                    <label>Phone Number</label>
                    <div className="auth-input-wrap auth-phone-input-wrap">
                      <div className="auth-phone-prefix">
                        <span className="auth-phone-flag">🇮🇳</span>
                        <span className="auth-phone-code">+91</span>
                      </div>
                      <input
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        value={phone}
                        onChange={(e) => formatPhone(e.target.value)}
                        className="auth-input auth-input-phone"
                        maxLength={10}
                        autoFocus
                        inputMode="numeric"
                      />
                    </div>
                    <div className="auth-field-hint">
                      We'll send a 6-digit OTP via SMS for verification
                    </div>
                  </div>

                  <button type="submit" className="auth-submit-btn" disabled={isLoading || phone.length < 10}>
                    {isLoading ? (
                      <span className="auth-spinner" />
                    ) : (
                      <>
                        Get OTP
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </>
                    )}
                  </button>
                </form>

                <div className="auth-trust-badges">
                  <div className="auth-trust-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    256-bit Encrypted
                  </div>
                  <div className="auth-trust-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Twilio Verified
                  </div>
                  <div className="auth-trust-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    No Password Required
                  </div>
                </div>

                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={handleAdminQuickLogin}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#059669',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    Log In as Administrator (Admin Portal) →
                  </button>
                </div>
              </>
            )}

            {/* ─── STEP 2: OTP Verification ─── */}
            {step === 'otp' && (
              <>
                <button
                  type="button"
                  className="auth-back-btn"
                  onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setError('') }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                  </svg>
                  Change Number
                </button>

                <h2 className="auth-form-title">Verify OTP</h2>
                <p className="auth-form-subtitle">
                  Enter the 6-digit code sent to{' '}
                  <strong>+91 {phone.slice(0, 5)} {phone.slice(5)}</strong>
                </p>

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
                  onClick={() => handleVerifyOtp()}
                >
                  {isLoading ? (
                    <span className="auth-spinner" />
                  ) : (
                    'Verify & Continue'
                  )}
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
            )}

            {/* ─── STEP 3: Complete Registration (New Users) ─── */}
            {step === 'register' && (
              <>
                <div className="auth-form-badge">
                  <span>✅</span> Phone Verified • Almost Done!
                </div>
                <h2 className="auth-form-title">Complete Your Profile</h2>
                <p className="auth-form-subtitle">
                  Just a few details to set up your partner account
                </p>

                <form onSubmit={handleCompleteRegistration} className="auth-form">
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
                    <label>Email Address <span className="auth-label-optional">(optional)</span></label>
                    <div className="auth-input-wrap">
                      <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9AA39F" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="auth-input"
                      />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label>UPI ID <span className="auth-label-optional">(for instant payouts)</span></label>
                    <div className="auth-input-wrap">
                      <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9AA39F" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                      <input
                        type="text"
                        placeholder="e.g. name@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="auth-input"
                      />
                    </div>
                  </div>

                  <div className="auth-verified-phone">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1F9D55" strokeWidth="2.5">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Phone verified: <strong>+91 {phone}</strong>
                  </div>

                  <button type="submit" className="auth-submit-btn" disabled={isLoading || !fullName.trim()}>
                    {isLoading ? (
                      <span className="auth-spinner" />
                    ) : (
                      <>
                        Create Account & Start Earning
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginView
