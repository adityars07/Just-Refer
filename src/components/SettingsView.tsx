import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const SettingsView = () => {
  const { partner, updateProfile, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  // Profile fields
  const [fullName, setFullName] = useState(partner?.full_name || '')
  const [email, setEmail] = useState(partner?.email || '')
  const [phone, setPhone] = useState(partner?.phone || '')

  // Payout fields
  const [upiId, setUpiId] = useState(partner?.payout_upi_id || '')
  const [bankAccount, setBankAccount] = useState(partner?.bank_account_no || '')
  const [bankIfsc, setBankIfsc] = useState(partner?.bank_ifsc || '')
  const [bankName, setBankName] = useState(partner?.bank_name || '')

  // Password fields
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveMsg('')

    try {
      // Update profile on backend
      if (partner?.id) {
        await fetch(`/api/auth/partner/${partner.id}/payout`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payoutUpiId: upiId,
            bankAccountNo: bankAccount,
            bankIfsc: bankIfsc,
            bankName: bankName,
          }),
        })
      }
      updateProfile({
        full_name: fullName,
        email,
        phone,
        payout_upi_id: upiId,
        bank_account_no: bankAccount,
        bank_ifsc: bankIfsc,
        bank_name: bankName,
      })
      setSaveMsg('Profile updated successfully!')
    } catch {
      setSaveMsg('Failed to save. Please try again.')
    }
    setIsSaving(false)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPw.length < 6) {
      setSaveMsg('Password must be at least 6 characters')
      return
    }
    if (newPw !== confirmPw) {
      setSaveMsg('Passwords do not match')
      return
    }
    setSaveMsg('')
    setIsSaving(true)

    try {
      await fetch(`/api/auth/partner/${partner?.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      })
      setSaveMsg('Password changed successfully!')
      setCurrentPw('')
      setNewPw('')
      setConfirmPw('')
    } catch {
      setSaveMsg('Failed to change password')
    }
    setIsSaving(false)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'payout', label: 'Payout Settings', icon: '💳' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ]

  return (
    <div className="settings-page">
      <div className="settings-inner">
        {/* Left Tabs */}
        <div className="settings-sidebar">
          <div className="settings-sidebar-header">
            <div className="settings-avatar">
              {(partner?.full_name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <strong>{partner?.full_name || 'Partner'}</strong>
              <span className="settings-role-badge">{partner?.role === 'admin' ? 'Admin' : 'Partner'}</span>
            </div>
          </div>
          <nav className="settings-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => { setActiveTab(tab.id); setSaveMsg('') }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
            <div className="settings-tab-divider" />
            <button type="button" className="settings-tab-btn danger" onClick={logout}>
              <span>🚪</span>
              Sign Out
            </button>
          </nav>
        </div>

        {/* Right Content */}
        <div className="settings-content">
          {saveMsg && (
            <div className={`settings-toast ${saveMsg.includes('success') ? 'success' : 'error'}`}>
              {saveMsg}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>Profile Information</h2>
              <p className="settings-section-desc">Update your personal details and referral information</p>

              <form onSubmit={handleSaveProfile} className="settings-form">
                <div className="settings-field-row">
                  <div className="auth-field">
                    <label>Full Name</label>
                    <input type="text" className="auth-input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div className="auth-field">
                    <label>Referral Code</label>
                    <input type="text" className="auth-input" value={partner?.referral_code || ''} disabled style={{ opacity: 0.6 }} />
                  </div>
                </div>
                <div className="settings-field-row">
                  <div className="auth-field">
                    <label>Phone Number</label>
                    <input type="tel" className="auth-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="auth-field">
                    <label>Email</label>
                    <input type="email" className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="auth-submit-btn settings-save-btn" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Payout Settings Tab */}
          {activeTab === 'payout' && (
            <div className="settings-section">
              <h2>Payout Settings</h2>
              <p className="settings-section-desc">Configure how you receive your commission payouts</p>

              <div className="settings-payout-methods">
                <div className="payout-method-card active">
                  <div className="payout-method-header">
                    <span className="payout-method-icon">⚡</span>
                    <h4>UPI (Instant)</h4>
                    <span className="payout-method-badge">Recommended</span>
                  </div>
                  <p>Receive payouts instantly via UPI. Available 24×7.</p>
                </div>
                <div className="payout-method-card">
                  <div className="payout-method-header">
                    <span className="payout-method-icon">🏦</span>
                    <h4>Bank Transfer (NEFT/IMPS)</h4>
                  </div>
                  <p>Standard bank transfer within 1-2 business days.</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="settings-form" style={{ marginTop: 24 }}>
                <div className="auth-field">
                  <label>UPI ID</label>
                  <input type="text" className="auth-input" placeholder="e.g. name@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                </div>

                <div className="settings-divider-line" />
                <h4 style={{ margin: '16px 0 12px' }}>Bank Account Details (Optional)</h4>

                <div className="settings-field-row">
                  <div className="auth-field">
                    <label>Bank Name</label>
                    <input type="text" className="auth-input" placeholder="e.g. HDFC Bank" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                  </div>
                  <div className="auth-field">
                    <label>Account Number</label>
                    <input type="text" className="auth-input" placeholder="e.g. 12345678901234" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} />
                  </div>
                </div>
                <div className="auth-field" style={{ maxWidth: 320 }}>
                  <label>IFSC Code</label>
                  <input type="text" className="auth-input" placeholder="e.g. HDFC0001234" value={bankIfsc} onChange={(e) => setBankIfsc(e.target.value)} />
                </div>

                <button type="submit" className="auth-submit-btn settings-save-btn" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Payout Settings'}
                </button>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>Security</h2>
              <p className="settings-section-desc">Change your password and manage security preferences</p>

              <form onSubmit={handleChangePassword} className="settings-form">
                <div className="auth-field">
                  <label>Current Password</label>
                  <input type="password" className="auth-input" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
                </div>
                <div className="settings-field-row">
                  <div className="auth-field">
                    <label>New Password</label>
                    <input type="password" className="auth-input" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
                  </div>
                  <div className="auth-field">
                    <label>Confirm New Password</label>
                    <input type="password" className="auth-input" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="auth-submit-btn settings-save-btn" disabled={isSaving}>
                  {isSaving ? 'Changing...' : 'Change Password'}
                </button>
              </form>

              <div className="settings-divider-line" />

              <div className="settings-danger-zone">
                <h4>Danger Zone</h4>
                <p>Permanently delete your partner account and all associated data.</p>
                <button type="button" className="settings-delete-btn">
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              <p className="settings-section-desc">Manage how you receive updates</p>

              <div className="settings-notification-list">
                {[
                  { label: 'Lead Status Updates', desc: 'Get notified when your referral status changes', default: true },
                  { label: 'Commission Credited', desc: 'Alert when commission is added to your wallet', default: true },
                  { label: 'Payout Processed', desc: 'Notification when payout is dispatched', default: true },
                  { label: 'New Loan Products', desc: 'Updates about new bank products and offers', default: false },
                  { label: 'Weekly Summary', desc: 'Weekly email digest of your referral performance', default: true },
                  { label: 'Promotional Offers', desc: 'Special commission boosts and seasonal offers', default: false },
                ].map((item, i) => (
                  <div key={i} className="notification-toggle-row">
                    <div>
                      <strong>{item.label}</strong>
                      <span>{item.desc}</span>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked={item.default} />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsView
