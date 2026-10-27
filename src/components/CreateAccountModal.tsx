import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

interface CreateAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  onLoginClick?: () => void
}

type ModalStep = 'phone' | 'otp' | 'details'

const CreateAccountModal = ({ isOpen, onClose, onSuccess, onLoginClick }: CreateAccountModalProps) => {
  const { sendOtp, verifyOtp, completeRegistration } = useAuth()

  const [step, setStep] = useState<ModalStep>('phone')
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

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  if (!isOpen) return null

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
          onClose()
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
        onClose()
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="modal-header">
          <div className="modal-brand-badge">
            <span>$</span>
          </div>
          <h3>{step === 'details' ? 'Almost Done!' : 'Quick Partner Sign Up'}</h3>
          <p>
            {step === 'phone' && 'Verify your mobile number to get started instantly.'}
            {step === 'otp' && `Enter the 6-digit OTP sent to +91 ${phone.replace(/\D/g, '').slice(-10)}`}
            {step === 'details' && 'Just your name and payout details to complete.'}
          </p>
        </div>

        {errorMsg && (
          <div className="auth-error-banner" style={{ margin: '0 0 16px' }}>
            {errorMsg}
          </div>
        )}

        {submitted ? (
          <div className="modal-success-state">
            <div className="modal-success-icon">✓</div>
            <h4>Welcome to JustRefer!</h4>
            <p>Your partner account is ready. Redirecting to your dashboard...</p>
          </div>
        ) : (
          <>
            {/* STEP 1: PHONE */}
            {step === 'phone' && (
              <form onSubmit={handlePhoneSubmit} className="modal-form">
                <div className="form-group">
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
                      autoFocus
                    />
                  </div>
                </div>

                <button type="submit" className="btn-modal-submit" disabled={isLoading}>
                  {isLoading ? 'Sending OTP...' : 'Send OTP via SMS'}
                </button>

                <div className="modal-footer-note">
                  Already registered?{' '}
                  <a
                    href="#login"
                    onClick={(e) => {
                      e.preventDefault()
                      onClose()
                      if (onLoginClick) onLoginClick()
                    }}
                  >
                    Log In
                  </a>
                </div>
              </form>
            )}

            {/* STEP 2: OTP */}
            {step === 'otp' && (
              <div className="modal-form">
                <div className="form-group">
                  <label>Verification Code</label>
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0 16px' }}>
                  <button
                    type="button"
                    onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); }}
                    style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', fontSize: '13px' }}
                  >
                    ← Change Phone
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
                  className="btn-modal-submit"
                  disabled={isLoading || otp.join('').length !== 6}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            )}

            {/* STEP 3: DETAILS (FOR NEW USERS) */}
            {step === 'details' && (
              <form onSubmit={handleDetailsSubmit} className="modal-form">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label>Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="partner@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Payout UPI ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="partner@okhdfcbank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>

                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    required
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <span>I agree to the <a href="#terms">Partner Terms</a></span>
                </label>

                <button type="submit" className="btn-modal-submit" disabled={isLoading}>
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

export default CreateAccountModal
