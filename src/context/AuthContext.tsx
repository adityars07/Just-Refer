import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface Partner {
  id: string
  full_name: string
  email: string
  phone: string
  referral_code: string
  payout_upi_id?: string
  bank_account_no?: string
  bank_ifsc?: string
  bank_name?: string
  role?: string
}

interface AuthContextType {
  partner: Partner | null
  token: string | null
  isLoggedIn: boolean
  isAdmin: boolean
  // OTP-based auth (primary)
  sendOtp: (phone: string) => Promise<{ success: boolean; error?: string }>
  verifyOtp: (phone: string, code: string) => Promise<{ success: boolean; isNewUser?: boolean; error?: string }>
  completeRegistration: (data: RegistrationData) => Promise<{ success: boolean; error?: string }>
  // Legacy auth (backward compat)
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  setAuthSession: (partner: Partner, token: string) => void
  updateProfile: (data: Partial<Partner>) => void
}

interface RegistrationData {
  fullName: string
  phone: string
  email?: string
  upiId?: string
}

interface RegisterData {
  fullName: string
  email: string
  phone: string
  password: string
  upiId?: string
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [partner, setPartner] = useState<Partner | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('jr_auth')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.partner && parsed.token) {
          const isPhoneAdmin = parsed.partner.phone?.includes('7753999478')
          const p = {
            ...parsed.partner,
            role: (isPhoneAdmin || parsed.partner.role === 'admin' || parsed.partner.email?.includes('admin')) ? 'admin' : 'partner',
          }
          setPartner(p)
          setToken(parsed.token)
        }
      }
    } catch {
      // ignore invalid JSON
    }
  }, [])

  const persistAuth = (p: Partner, t: string) => {
    setPartner(p)
    setToken(t)
    localStorage.setItem('jr_auth', JSON.stringify({ partner: p, token: t }))
  }

  // ─── OTP Auth Flow ───────────────────────────

  /** Step 1: Send OTP to phone number */
  const sendOtp = async (phone: string) => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        return { success: true }
      }
      return { success: false, error: data.error || 'Failed to send OTP' }
    } catch {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  /** Step 2: Verify OTP code — returns isNewUser flag */
  const verifyOtp = async (phone: string, code: string) => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        if (!data.isNewUser && data.partner && data.token) {
          // Existing user — auto-login
          const isPhoneAdmin = phone?.includes('7753999478') || data.partner.phone?.includes('7753999478')
          const p: Partner = {
            ...data.partner,
            role: (isPhoneAdmin || data.partner.role === 'admin' || data.partner.email?.includes('admin')) ? 'admin' : 'partner',
          }
          persistAuth(p, data.token)
          return { success: true, isNewUser: false }
        }
        // New user — needs to complete registration
        return { success: true, isNewUser: true }
      }
      return { success: false, error: data.error || 'OTP verification failed' }
    } catch {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  /** Step 3: Complete registration for new users (after OTP verified) */
  const completeRegistration = async (regData: RegistrationData) => {
    try {
      const res = await fetch('/api/auth/complete-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regData.fullName,
          phone: regData.phone,
          email: regData.email,
          upiId: regData.upiId,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        const isPhoneAdmin = regData.phone?.includes('7753999478') || data.partner?.phone?.includes('7753999478')
        const p: Partner = {
          ...data.partner,
          role: (isPhoneAdmin || data.partner?.role === 'admin' || data.partner?.email?.includes('admin')) ? 'admin' : 'partner',
        }
        persistAuth(p, data.token)
        return { success: true }
      }
      return { success: false, error: data.error || 'Registration failed' }
    } catch {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  // ─── Legacy Auth (backward compat) ───────────

  const login = async (identifier: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        const isPhoneAdmin = identifier?.includes('7753999478') || data.partner?.phone?.includes('7753999478')
        const p: Partner = {
          ...data.partner,
          role: (isPhoneAdmin || data.partner?.role === 'admin' || data.partner?.email?.includes('admin')) ? 'admin' : 'partner',
        }
        persistAuth(p, data.token)
        return { success: true }
      }
      return { success: false, error: data.error || 'Login failed' }
    } catch {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const register = async (regData: RegisterData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regData.fullName,
          email: regData.email,
          phone: regData.phone,
          password: regData.password,
          upiId: regData.upiId,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        const p: Partner = {
          ...data.partner,
          role: 'partner',
        }
        persistAuth(p, data.token)
        return { success: true }
      }
      return { success: false, error: data.error || 'Registration failed' }
    } catch {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const logout = () => {
    setPartner(null)
    setToken(null)
    localStorage.removeItem('jr_auth')
  }

  const updateProfile = (data: Partial<Partner>) => {
    if (partner) {
      const updated = { ...partner, ...data }
      setPartner(updated)
      if (token) {
        localStorage.setItem('jr_auth', JSON.stringify({ partner: updated, token }))
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        partner,
        token,
        isLoggedIn: !!partner,
        isAdmin: partner?.role === 'admin',
        sendOtp,
        verifyOtp,
        completeRegistration,
        login,
        register,
        logout,
        setAuthSession: persistAuth,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
