import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (data: Partial<Partner>) => void
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
          setPartner(parsed.partner)
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

  const login = async (identifier: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        const p: Partner = {
          ...data.partner,
          role: data.partner.email?.includes('admin') ? 'admin' : 'partner',
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
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
