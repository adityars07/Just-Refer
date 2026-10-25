import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

interface ForgotPasswordViewProps {
  onBackToLogin: () => void
}

/**
 * With OTP-only auth, "Forgot Password" becomes a simple
 * re-verification flow: verify phone → auto-login.
 * No password reset needed since we don't use passwords.
 */
const ForgotPasswordView = ({ onBackToLogin }: ForgotPasswordViewProps) => {
  const { sendOtp, verifyOtp } = useAuth()
  const [step, setStep] = useState<'phone' | 'otp' | 'done'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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
    setPhone(val.replace(/\D/g, '').slice(0, 10))
  }

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
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } else {
      setError(result.error || 'Failed to send OTP')
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
    if (value && index === 5) {
      const fullCode = newOtp.join('')
      if (fullCode.length === 6) handleVerifyOtp(fullCode)
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
      if (pasteData.length === 6) handleVerifyOtp(pasteData)
    }
  }

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
      setStep('done')
    } else {
      setError(result.error || 'Invalid OTP. Please try again.')
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
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
              Can't Sign In?<br />No Worries!
            </h1>
            <p className="auth-brand-subtext">
              Just verify your phone number with OTP and you'll be back in your account instantly. No password needed.
            </p>

            <div className="auth-otp-steps">
              <div className={`auth-otp-step ${step === 'phone' ? 'active' : 'done'}`}>
                <div className="auth-otp-step-dot">
                  {step === 'phone' ? '1' : '✓'}
                </div>
                <span>Enter Phone</span>
              </div>
              <div className="auth-otp-step-line" />
              <div className={`auth-otp-step ${step === 'otp' ? 'active' : step === 'done' ? 'done' : ''}`}>
                <div className="auth-otp-step-dot">
                  {step === 'done' ? '✓' : '2'}
                </div>
                <span>Verify OTP</span>
              </div>
              <div className="auth-otp-step-line" />
              <div className={`auth-otp-step ${step === 'done' ? 'active' : ''}`}>
                <div className="auth-otp-step-dot">3</div>
                <span>Access Restored</span>
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
                <h2>You're Back In! ✅</h2>
                <p>Your phone has been verified and you're now logged in. Head to your dashboard to continue.</p>
                <button type="button" className="auth-submit-btn" onClick={onBackToLogin} style={{ marginTop: 16 }}>
                  Go to Dashboard →
                </button>
              </div>
            ) : step === 'otp' ? (
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

                <h2 className="auth-form-title">Enter OTP</h2>
                <p className="auth-form-subtitle">
                  We've sent a verification code to <strong>+91 {phone.slice(0, 5)} {phone.slice(5)}</strong>
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
                  onClick={() => handleVerifyOtp()}
                >
                  {isLoading ? <span className="auth-spinner" /> : 'Verify & Sign In'}
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
                <h2 className="auth-form-title">Account Recovery</h2>
                <p className="auth-form-subtitle">Enter your registered phone number to verify and sign in instantly</p>

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
                    <label>Phone Number</label>
                    <div className="auth-input-wrap auth-phone-input-wrap">
                      <div className="auth-phone-prefix">
                        <span className="auth-phone-flag">🇮🇳</span>
                        <span className="auth-phone-code">+91</span>
                      </div>
                      <input
                        type="tel"
                        placeholder="Enter registered phone number"
                        value={phone}
                        onChange={(e) => formatPhone(e.target.value)}
                        className="auth-input auth-input-phone"
                        maxLength={10}
                        autoFocus
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                  <button type="submit" className="auth-submit-btn" disabled={isLoading || phone.length < 10}>
                    {isLoading ? <span className="auth-spinner" /> : 'Send OTP →'}
                  </button>
                </form>

                <p className="auth-switch-text" style={{ marginTop: 24 }}>
                  Remember your account?{' '}
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
