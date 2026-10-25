import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

interface CreateAccountCardProps {
  onSuccess?: () => void
  onLoginClick?: () => void
}

type CardStep = 'phone' | 'otp' | 'details'

const CreateAccountCard = ({ onSuccess, onLoginClick }: CreateAccountCardProps) => {
  const { sendOtp, verifyOtp, completeRegistration } = useAuth()

  const [step, setStep] = useState<CardStep>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [upiId, setUpiId] = useState('')
  const [agreed, setAgreed] = useState(true)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    const cleanDigits = phone.replace(/\D/g, '')
    if (cleanDigits.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number')
      return
    }

    setIsLoading(true)
    const formattedPhone = cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`
    const result = await sendOtp(formattedPhone)
    setIsLoading(false)

    if (result.success) {
      setStep('otp')
      setCountdown(30)
      setTimeout(() => otpInputsRef.current[0]?.focus(), 100)
    } else {
      setErrorMsg(result.error || 'Failed to send OTP')
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)

    if (digit && index < 5) {
      otpInputsRef.current[index + 1]?.focus()
    }

    const fullCode = newOtp.join('')
    if (fullCode.length === 6 && !newOtp.includes('')) {
      handleVerifyOtp(fullCode)
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const newOtp = [...otp]
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i]
    }
    setOtp(newOtp)
    if (pasted.length === 6) {
      handleVerifyOtp(pasted)
    } else {
      otpInputsRef.current[pasted.length]?.focus()
    }
  }

  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otp.join('')
    if (code.length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP')
      return
    }

    setErrorMsg('')
    setIsLoading(true)
    const cleanDigits = phone.replace(/\D/g, '')
    const formattedPhone = cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`

    const result = await verifyOtp(formattedPhone, code)
    setIsLoading(false)

    if (result.success) {
      if (result.isNewUser) {
        setStep('details')
      } else {
        setSubmitted(true)
        setTimeout(() => {
          if (onSuccess) onSuccess()
        }, 1000)
      }
    } else {
      setErrorMsg(result.error || 'Invalid OTP. Please try again.')
    }
  }

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim()) {
      setErrorMsg('Full name is required')
      return
    }

    setErrorMsg('')
    setIsLoading(true)
    const cleanDigits = phone.replace(/\D/g, '')
    const formattedPhone = cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`

    const result = await completeRegistration({
      fullName: fullName.trim(),
      phone: formattedPhone,
      email: email.trim() || undefined,
      upiId: upiId.trim() || undefined,
    })
    setIsLoading(false)

    if (result.success) {
      setSubmitted(true)
      setTimeout(() => {
        if (onSuccess) onSuccess()
      }, 1000)
    } else {
      setErrorMsg(result.error || 'Failed to complete registration')
    }
  }

  const handleResendOtp = async () => {
    if (countdown > 0) return
    setErrorMsg('')
    setIsLoading(true)
    const cleanDigits = phone.replace(/\D/g, '')
    const formattedPhone = cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`
    const result = await sendOtp(formattedPhone)
    setIsLoading(false)
    if (result.success) {
      setCountdown(30)
      setOtp(['', '', '', '', '', ''])
      otpInputsRef.current[0]?.focus()
    } else {
      setErrorMsg(result.error || 'Failed to resend OTP')
    }
  }

  return (
    <div className="create-account-card-wrapper">
      <div className="account-card-box">
        <div className="card-brand-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
          <Logo size="md" variant="dark" />
        </div>

        <h3 className="account-card-title">
          {step === 'details' ? 'Complete Profile' : 'Partner Sign In / Sign Up'}
        </h3>
        <p className="account-card-subtitle">
          {step === 'phone' && 'Fast, passwordless login with Twilio SMS OTP.'}
          {step === 'otp' && `Enter 6-digit OTP sent to +91 ${phone.replace(/\D/g, '').slice(-10)}`}
          {step === 'details' && 'Enter your name to complete your partner profile.'}
        </p>

        {errorMsg && (
          <div className="auth-error-banner" style={{ marginBottom: 16 }}>
            {errorMsg}
          </div>
        )}

        {submitted ? (
          <div className="account-success-msg">
            <span className="success-check-icon">✓</span>
            <h4>Account Ready!</h4>
            <p>Welcome to JustRefer. Redirecting to your dashboard...</p>
          </div>
        ) : (
          <>
            {/* STEP 1: PHONE */}
            {step === 'phone' && (
              <form onSubmit={handlePhoneSubmit} className="account-form-grid">
                <div className="field-group">
                  <label>Mobile Number</label>
                  <div className="auth-phone-input-wrap">
                    <span className="auth-country-prefix">+91</span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={12}
                      className="card-input"
                      autoFocus
                    />
                  </div>
                </div>

                <button type="submit" className="btn-create-account-dark" disabled={isLoading}>
                  {isLoading ? 'Sending OTP...' : 'Continue with OTP'}
                </button>

                <div className="account-login-redirect">
                  Need help? <a href="#login" onClick={(e) => { e.preventDefault(); if (onLoginClick) onLoginClick(); }}>Switch to Full Login</a>
                </div>
              </form>
            )}

            {/* STEP 2: OTP */}
            {step === 'otp' && (
              <div className="account-form-grid">
                <div className="field-group">
                  <label>Enter 6-Digit Code</label>
                  <div className="otp-digit-inputs" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { otpInputsRef.current[idx] = el }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className={`otp-digit-box ${digit ? 'filled' : ''}`}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0 12px' }}>
                  <button
                    type="button"
                    onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); }}
                    style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', fontSize: '13px' }}
                  >
                    ← Change
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || isLoading}
                    style={{ background: 'none', border: 'none', color: countdown > 0 ? '#9ca3af' : '#16a34a', cursor: countdown > 0 ? 'default' : 'pointer', fontSize: '13px' }}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleVerifyOtp()}
                  className="btn-create-account-dark"
                  disabled={isLoading || otp.join('').length !== 6}
                >
                  {isLoading ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </div>
            )}

            {/* STEP 3: DETAILS */}
            {step === 'details' && (
              <form onSubmit={handleDetailsSubmit} className="account-form-grid">
                <div className="field-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="card-input"
                    autoFocus
                  />
                </div>

                <div className="field-group">
                  <label>Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="card-input"
                  />
                </div>

                <div className="field-group">
                  <label>Payout UPI ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="name@okaxis"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
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
                  <span>I agree to the <a href="#terms">Partner Terms</a></span>
                </label>

                <button type="submit" className="btn-create-account-dark" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Complete & Open Dashboard'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CreateAccountCard
