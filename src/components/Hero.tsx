import { useState, useRef, useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Logo from './Logo'

interface HeroProps {
  onOpenModal: () => void
}

type Timeframe = '1M' | '3M' | '6M' | 'FY' | 'ALL'
type MockupTab = 'Home' | 'Referrals' | 'Payouts'

interface TimeframeData {
  commissionEarned: number
  disbursedVolume: string
  activeCases: string
  growthLabel: string
  path: string
  fillPath: string
}

const TIMEFRAME_DATA: Record<Timeframe, TimeframeData> = {
  '1M': {
    commissionEarned: 48500.0,
    disbursedVolume: '₹1.05 Cr',
    activeCases: '4 Cases Disbursed',
    growthLabel: '+₹12,400 (20.3% vs last mo)',
    path: 'M2 38 Q 40 45, 75 30 T 135 25 T 195 15 T 235 12 T 258 4',
    fillPath: 'M2 38 Q 40 45, 75 30 T 135 25 T 195 15 T 235 12 T 258 4 L 258 55 L 2 55 Z',
  },
  '3M': {
    commissionEarned: 132500.0,
    disbursedVolume: '₹2.65 Cr',
    activeCases: '12 Cases Disbursed',
    growthLabel: '+₹28,500 (24.2% vs Q2)',
    path: 'M2 42 Q 35 30, 80 35 T 140 18 T 190 22 T 235 8 T 258 4',
    fillPath: 'M2 42 Q 35 30, 80 35 T 140 18 T 190 22 T 235 8 T 258 4 L 258 55 L 2 55 Z',
  },
  '6M': {
    commissionEarned: 245000.0,
    disbursedVolume: '₹4.90 Cr',
    activeCases: '24 Cases Disbursed',
    growthLabel: '+₹64,000 (31.0% YoY)',
    path: 'M2 46 Q 30 40, 70 28 T 130 32 T 185 14 T 230 16 T 258 4',
    fillPath: 'M2 46 Q 30 40, 70 28 T 130 32 T 185 14 T 230 16 T 258 4 L 258 55 L 2 55 Z',
  },
  'FY': {
    commissionEarned: 520000.0,
    disbursedVolume: '₹10.40 Cr',
    activeCases: '52 Cases Disbursed',
    growthLabel: '+₹1,45,000 (38.6% YoY)',
    path: 'M2 48 Q 28 35, 65 38 T 120 22 T 180 20 T 225 10 T 258 4',
    fillPath: 'M2 48 Q 28 35, 65 38 T 120 22 T 180 20 T 225 10 T 258 4 L 258 55 L 2 55 Z',
  },
  'ALL': {
    commissionEarned: 785000.0,
    disbursedVolume: '₹15.70 Cr',
    activeCases: '78 Cases Disbursed',
    growthLabel: '100% Payout Disbursed',
    path: 'M2 44 Q 28 42, 45 32 T 95 36 T 145 22 T 195 24 T 235 10 T 258 4',
    fillPath: 'M2 44 Q 28 42, 45 32 T 95 36 T 145 22 T 195 24 T 235 10 T 258 4 L 258 55 L 2 55 Z',
  },
}

function formatIndianCurrency(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(val)
}

// Hook for immediate, smooth count-up animation with ZERO artificial delay
function useAnimatedCount(target: number, triggerKey: number, durationMs = 1200): number {
  const [current, setCurrent] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) {
      setCurrent(target)
      return
    }

    let start: number | null = null
    let rafId: number
    const initial = 0

    const step = (now: number) => {
      if (start === null) start = now
      const elapsed = now - start
      const progress = Math.min(elapsed / durationMs, 1)
      // Ease out quartic curve for buttery smooth deceleration
      const ease = 1 - Math.pow(1 - progress, 4)
      setCurrent(initial + (target - initial) * ease)

      if (progress < 1) {
        rafId = requestAnimationFrame(step)
      } else {
        setCurrent(target)
      }
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [target, triggerKey, durationMs, shouldReduceMotion])

  return current
}

const Hero = ({ onOpenModal }: HeroProps) => {
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('ALL')
  const [activeTab, setActiveTab] = useState<MockupTab>('Home')
  const [animKey, setAnimKey] = useState(0)
  const [isRotating, setIsRotating] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  // 3D Parallax Tilt State
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleManualReplay = () => {
    setIsRotating(true)
    setAnimKey((prev) => prev + 1)
    setTimeout(() => setIsRotating(false), 600)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const rotX = -(y / (rect.height / 2)) * 3.5
    const rotY = (x / (rect.width / 2)) * 3.5
    setTilt({ x: rotX, y: rotY })
  }

  const handleMouseEnter = () => {
    if (!shouldReduceMotion) setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
  }

  const currentData = TIMEFRAME_DATA[activeTimeframe]

  // Smooth Count-Up Values - Starts IMMEDIATELY on render
  const animatedTotal = useAnimatedCount(currentData.commissionEarned, animKey, 1200)

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
        delayChildren: 0,
      },
    },
  }

  const cardItemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.35,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  }

  return (
    <section className="hero-dark">
      <div className="container">
        <div className="hero-content">
          <div className="hero-pill-tag">
            <span className="hero-pill-dot" />
            <span>India's #1 Loan Referral Platform</span>
          </div>

          <h1 className="hero-main-title">
            Keep more, earn more
          </h1>

          <p className="hero-main-subtitle">
            JustRefer helps you unlock high-paying loan referral commissions with top banks.
            Turn your professional network into your greatest income stream with zero KYC friction.
          </p>

          <div className="hero-cta-wrapper">
            <button
              type="button"
              className="btn-hero-white-cta"
              onClick={onOpenModal}
            >
              <span>Join JustRefer</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Interactive Floating Mockup Container with Ambient Glow */}
          <div className="hero-mockup-wrapper">
            <div className="hero-mockup-ambient-glow" />

            <div
              ref={cardRef}
              className={`hero-mockup-card ${isHovered ? 'is-tilting' : 'is-floating'}`}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: isHovered
                  ? `perspective(1200px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) translateY(-6px)`
                  : undefined,
              }}
            >
              {/* Top Navigation Bar Inside Mockup */}
              <div className="mockup-header-bar">
                <div className="mockup-nav-left">
                  <Logo size="sm" variant="dark" />
                  <button
                    type="button"
                    className={`mockup-tab-link ${activeTab === 'Home' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Home')}
                  >
                    Home
                  </button>
                  <button
                    type="button"
                    className={`mockup-tab-link ${activeTab === 'Referrals' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Referrals')}
                  >
                    Referrals
                  </button>
                  <button
                    type="button"
                    className={`mockup-tab-link ${activeTab === 'Payouts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Payouts')}
                  >
                    Payouts
                  </button>
                </div>

                <div className="mockup-nav-right">
                  <div
                    className="mockup-icon-btn"
                    title="Refresh data"
                    onClick={handleManualReplay}
                    style={{ cursor: 'pointer' }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      style={{
                        transform: isRotating ? 'rotate(360deg)' : 'none',
                        transition: isRotating ? 'transform 0.5s ease' : 'none',
                      }}
                    >
                      <polyline points="23 4 23 10 17 10" />
                      <polyline points="1 20 1 14 7 14" />
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                  </div>

                  <div className="mockup-icon-btn" title="Notifications">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span className="mockup-bell-badge" />
                  </div>
                  <span className="mockup-msg-text" style={{ fontSize: 12, fontWeight: 700, color: '#1f9d55', background: '#e6f7ee', padding: '3px 8px', borderRadius: 6 }}>
                    DSA #JR-4821
                  </span>
                  <div className="mockup-user-avatar">AR</div>
                </div>
              </div>

              {/* TAB 1: HOME OVERVIEW */}
              {activeTab === 'Home' && (
                <motion.div
                  key={`body-home-${animKey}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="mockup-body-grid"
                >
                  {/* Left Column: Commissions & Sparkline Chart */}
                  <div className="mockup-left-col">
                    <motion.div variants={cardItemVariants} className="mockup-earnings-row">
                      <div>
                        <span className="mockup-micro-label">COMMISSION EARNED</span>
                        <div className="mockup-big-number">
                          ₹{formatIndianCurrency(animatedTotal)}
                        </div>
                        <div className="mockup-return-label">
                          <strong className="green-text" style={{ fontSize: 12 }}>
                            {currentData.growthLabel}
                          </strong>
                          <span style={{ fontSize: 11.5, color: '#6b7280', marginLeft: 6 }}>
                            • {currentData.disbursedVolume} Disbursed
                          </span>
                        </div>
                      </div>

                      {/* Interactive Sparkline with Period Selector */}
                      <div className="mockup-chart-side">
                        <div className="mockup-time-tabs">
                          {(['1M', '3M', '6M', 'FY', 'ALL'] as Timeframe[]).map((tf) => (
                            <span
                              key={tf}
                              className={activeTimeframe === tf ? 'active' : ''}
                              onClick={() => {
                                setActiveTimeframe(tf)
                                setAnimKey((prev) => prev + 1)
                              }}
                            >
                              {tf}
                            </span>
                          ))}
                        </div>

                        <div className="sparkline-container">
                          <svg className="mockup-sparkline-svg" viewBox="0 0 260 55" fill="none">
                            <motion.path
                              key={`fill-${activeTimeframe}-${animKey}`}
                              d={currentData.fillPath}
                              fill="url(#sparkline-gradient)"
                              initial={shouldReduceMotion ? { opacity: 0.18 } : { opacity: 0 }}
                              animate={{ opacity: 0.18 }}
                              transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : 0.2 }}
                              className="sparkline-fill-area"
                            />

                            <motion.path
                              key={`stroke-${activeTimeframe}-${animKey}`}
                              d={currentData.path}
                              stroke="#1F9D55"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              fill="none"
                              initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{
                                duration: shouldReduceMotion ? 0 : 1.1,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="sparkline-stroke-animated"
                            />

                            <motion.circle
                              cx="258"
                              cy="4"
                              r="3.5"
                              fill="#1F9D55"
                              initial={shouldReduceMotion ? { scale: 1 } : { scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: shouldReduceMotion ? 0 : 0.9, duration: 0.25 }}
                              className="sparkline-beacon-center"
                            />
                            <circle
                              cx="258"
                              cy="4"
                              r="8"
                              stroke="#1F9D55"
                              strokeWidth="1.5"
                              fill="none"
                              className="sparkline-beacon-wave"
                            />

                            <defs>
                              <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#1F9D55" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#1F9D55" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      </div>
                    </motion.div>

                    {/* 4 Official Loan Products with Live Referral Cases */}
                    <motion.div variants={containerVariants} className="mockup-items-list">
                      {/* 1. Home Loan */}
                      <motion.div variants={cardItemVariants} className="mockup-list-item" onClick={onOpenModal}>
                        <div className="mockup-item-left">
                          <div className="mockup-cat-icon gold">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                              <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                          </div>
                          <div>
                            <div className="mockup-item-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span>Home Loan</span>
                              <span className="mockup-status-badge disbursed">✓ Disbursed</span>
                            </div>
                            <div className="mockup-item-sub">HDFC Bank • Rajesh Sharma • ₹75L Disbursed (Min ₹50L)</div>
                          </div>
                        </div>
                        <div className="mockup-item-right">
                          <div className="mockup-item-val">₹22,500.00</div>
                          <div className="mockup-item-profit">+0.3% Comm.</div>
                        </div>
                      </motion.div>

                      {/* 2. LAP */}
                      <motion.div variants={cardItemVariants} className="mockup-list-item" onClick={onOpenModal}>
                        <div className="mockup-item-left">
                          <div className="mockup-cat-icon orange">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="4" y="2" width="16" height="20" rx="2" />
                              <line x1="9" y1="6" x2="9" y2="6.01" />
                              <line x1="15" y1="6" x2="15" y2="6.01" />
                              <line x1="9" y1="10" x2="9" y2="10.01" />
                              <line x1="15" y1="10" x2="15" y2="10.01" />
                            </svg>
                          </div>
                          <div>
                            <div className="mockup-item-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span>Loan Against Property</span>
                              <span className="mockup-status-badge disbursed">✓ Disbursed</span>
                            </div>
                            <div className="mockup-item-sub">Bajaj Finserv • Mehta Ent. • ₹1.5 Cr Disbursed (Min ₹1 Cr)</div>
                          </div>
                        </div>
                        <div className="mockup-item-right">
                          <div className="mockup-item-val">₹75,000.00</div>
                          <div className="mockup-item-profit green">+0.5% Comm.</div>
                        </div>
                      </motion.div>

                      {/* 3. Business Loan */}
                      <motion.div variants={cardItemVariants} className="mockup-list-item" onClick={onOpenModal}>
                        <div className="mockup-item-left">
                          <div className="mockup-cat-icon purple">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                            </svg>
                          </div>
                          <div>
                            <div className="mockup-item-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span>Business Loan</span>
                              <span className="mockup-status-badge disbursed">✓ Disbursed</span>
                            </div>
                            <div className="mockup-item-sub">ICICI Bank • Apex Logistics • ₹25L Disbursed (Min ₹10L)</div>
                          </div>
                        </div>
                        <div className="mockup-item-right">
                          <div className="mockup-item-val">₹25,000.00</div>
                          <div className="mockup-item-profit">+1.0% Comm.</div>
                        </div>
                      </motion.div>

                      {/* 4. Personal Loan */}
                      <motion.div variants={cardItemVariants} className="mockup-list-item" onClick={onOpenModal}>
                        <div className="mockup-item-left">
                          <div className="mockup-cat-icon blue">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                            </svg>
                          </div>
                          <div>
                            <div className="mockup-item-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span>Personal Loan</span>
                              <span className="mockup-status-badge disbursed">✓ Disbursed</span>
                            </div>
                            <div className="mockup-item-sub">Axis Bank • Priya Verma • ₹10L Disbursed (Min ₹5L)</div>
                          </div>
                        </div>
                        <div className="mockup-item-right">
                          <div className="mockup-item-val">₹10,000.00</div>
                          <div className="mockup-item-profit">+1.0% Comm.</div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Right Column: Lead Sourcing & Payout Status */}
                  <div className="mockup-right-col">
                    {/* Card 1: Fast Lead Sourcing */}
                    <motion.div variants={cardItemVariants} className="mockup-refer-promo-box">
                      <div className="mockup-refer-tag" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>⚡ ZERO KYC REQUIRED</span>
                      </div>
                      <h4 className="mockup-refer-title" style={{ margin: '4px 0 6px', fontSize: 16 }}>Refer a Client in 30s</h4>
                      <p className="mockup-refer-desc" style={{ marginBottom: 12 }}>
                        Submit applicant name & loan requirement. Direct automated routing to 40+ lending institutions with top approval odds.
                      </p>
                      <div className="mockup-chip-tags">
                        <span className="mockup-chip-tag active">Home (0.3%)</span>
                        <span className="mockup-chip-tag active">LAP (0.5%)</span>
                        <span className="mockup-chip-tag active">Personal (1%)</span>
                        <span className="mockup-chip-tag active">Business (1%)</span>
                      </div>
                      <button
                        type="button"
                        className="mockup-refer-btn shimmer-btn"
                        onClick={onOpenModal}
                      >
                        <span>+ Submit Loan Referral →</span>
                      </button>
                    </motion.div>

                    {/* Card 2: Next Weekly Payout */}
                    <motion.div variants={cardItemVariants} className="mockup-stat-mini-box">
                      <span className="mini-box-label">NEXT WEEKLY PAYOUT</span>
                      <div className="mini-box-val">₹48,500.00</div>
                      <div className="mini-box-status">
                        <span className="live-status-pulse">
                          <span className="pulse-dot-core" />
                          <span className="pulse-dot-ring" />
                        </span>
                        <span>Scheduled for Friday • Auto IMPS/UPI</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                        <span>Direct Bank Credit</span>
                        <span style={{ color: '#1f9d55', fontWeight: 600 }}>Zero TDS Deducted</span>
                      </div>
                    </motion.div>

                    {/* Card 3: Live Application Funnel */}
                    <motion.div variants={cardItemVariants} className="mockup-pipeline-bar">
                      <div className="pipeline-step-item">
                        <span className="pipeline-step-num">3</span>
                        <span className="pipeline-step-name">In Login</span>
                      </div>
                      <span className="pipeline-divider">›</span>
                      <div className="pipeline-step-item">
                        <span className="pipeline-step-num" style={{ color: '#ea580c' }}>2</span>
                        <span className="pipeline-step-name">Underwriting</span>
                      </div>
                      <span className="pipeline-divider">›</span>
                      <div className="pipeline-step-item">
                        <span className="pipeline-step-num" style={{ color: '#2563eb' }}>2</span>
                        <span className="pipeline-step-name">Sanctioned</span>
                      </div>
                      <span className="pipeline-divider">›</span>
                      <div className="pipeline-step-item">
                        <span className="pipeline-step-num" style={{ color: '#1f9d55' }}>4</span>
                        <span className="pipeline-step-name">Disbursed</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: REFERRALS PIPELINE TABLE */}
              {activeTab === 'Referrals' && (
                <div className="mockup-table-view">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#111827' }}>Active Loan Referrals</h4>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6b7280' }}>Track live applicant cases across partner banks</p>
                    </div>
                    <button
                      type="button"
                      className="mockup-refer-btn"
                      style={{ width: 'auto', padding: '6px 14px', fontSize: 12 }}
                      onClick={onOpenModal}
                    >
                      + New Referral
                    </button>
                  </div>

                  <table className="mockup-table">
                    <thead>
                      <tr>
                        <th>Applicant</th>
                        <th>Loan Category</th>
                        <th>Bank Underwriter</th>
                        <th>Loan Amount</th>
                        <th>Commission</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Rajesh Sharma</strong><br /><span style={{ fontSize: 11, color: '#6b7280' }}>Mumbai</span></td>
                        <td>Home Loan</td>
                        <td>HDFC Bank</td>
                        <td>₹ 75,00,000</td>
                        <td style={{ color: '#1f9d55', fontWeight: 700 }}>₹ 22,500 (0.3%)</td>
                        <td><span className="mockup-status-badge disbursed">✓ Disbursed</span></td>
                      </tr>
                      <tr>
                        <td><strong>Mehta Enterprises</strong><br /><span style={{ fontSize: 11, color: '#6b7280' }}>Pune</span></td>
                        <td>Loan Against Property</td>
                        <td>Bajaj Finserv</td>
                        <td>₹ 1,50,00,000</td>
                        <td style={{ color: '#1f9d55', fontWeight: 700 }}>₹ 75,000 (0.5%)</td>
                        <td><span className="mockup-status-badge disbursed">✓ Disbursed</span></td>
                      </tr>
                      <tr>
                        <td><strong>Apex Logistics</strong><br /><span style={{ fontSize: 11, color: '#6b7280' }}>Delhi</span></td>
                        <td>Business Loan</td>
                        <td>ICICI Bank</td>
                        <td>₹ 25,00,000</td>
                        <td style={{ color: '#1f9d55', fontWeight: 700 }}>₹ 25,000 (1%)</td>
                        <td><span className="mockup-status-badge sanctioned">Sanctioned</span></td>
                      </tr>
                      <tr>
                        <td><strong>Priya Verma</strong><br /><span style={{ fontSize: 11, color: '#6b7280' }}>Bengaluru</span></td>
                        <td>Personal Loan</td>
                        <td>Axis Bank</td>
                        <td>₹ 10,00,000</td>
                        <td style={{ color: '#1f9d55', fontWeight: 700 }}>₹ 10,000 (1%)</td>
                        <td><span className="mockup-status-badge underwriting">Underwriting</span></td>
                      </tr>
                      <tr>
                        <td><strong>Kunal Mehta</strong><br /><span style={{ fontSize: 11, color: '#6b7280' }}>Ahmedabad</span></td>
                        <td>Home Loan</td>
                        <td>State Bank of India</td>
                        <td>₹ 60,00,000</td>
                        <td style={{ color: '#1f9d55', fontWeight: 700 }}>₹ 18,000 (0.3%)</td>
                        <td><span className="mockup-status-badge login">In Login</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 3: PAYOUTS & SETTLEMENTS */}
              {activeTab === 'Payouts' && (
                <div className="mockup-table-view">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#111827' }}>Commission Settlement Ledger</h4>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6b7280' }}>Direct bank settlements with zero KYC barriers</p>
                    </div>
                    <span style={{ fontSize: 12, color: '#1f9d55', fontWeight: 700, background: '#e6f7ee', padding: '4px 10px', borderRadius: 6 }}>
                      Linked: HDFC Bank A/c •••• 4912
                    </span>
                  </div>

                  <div className="mockup-payout-grid">
                    <div className="mockup-payout-card">
                      <span className="mockup-payout-card-label">TOTAL PAID OUT</span>
                      <strong className="mockup-payout-card-val" style={{ color: '#1f9d55' }}>₹ 84,000.00</strong>
                    </div>
                    <div className="mockup-payout-card">
                      <span className="mockup-payout-card-label">NEXT WEEKLY PAYOUT</span>
                      <strong className="mockup-payout-card-val" style={{ color: '#ea580c' }}>₹ 48,500.00</strong>
                    </div>
                    <div className="mockup-payout-card">
                      <span className="mockup-payout-card-label">LIFETIME COMMISSIONS</span>
                      <strong className="mockup-payout-card-val">₹ 1,32,500.00</strong>
                    </div>
                  </div>

                  <table className="mockup-table">
                    <thead>
                      <tr>
                        <th>Transfer Ref (UTR)</th>
                        <th>Settled Date</th>
                        <th>Payout Method</th>
                        <th>Amount Credited</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>UTR-8910482910</code></td>
                        <td>12 Oct 2026</td>
                        <td>HDFC Bank (IMPS)</td>
                        <td><strong>₹ 49,000.00</strong></td>
                        <td><span className="mockup-status-badge disbursed">✓ Completed</span></td>
                      </tr>
                      <tr>
                        <td><code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>UTR-7629104928</code></td>
                        <td>05 Oct 2026</td>
                        <td>HDFC Bank (IMPS)</td>
                        <td><strong>₹ 35,000.00</strong></td>
                        <td><span className="mockup-status-badge disbursed">✓ Completed</span></td>
                      </tr>
                      <tr>
                        <td><code style={{ background: '#fef3c7', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>CYCLE-OCT-W3</code></td>
                        <td>This Friday 4:00 PM</td>
                        <td>Auto IMPS Direct Credit</td>
                        <td><strong>₹ 48,500.00</strong></td>
                        <td><span className="mockup-status-badge underwriting">Processing ⏳</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mockup-footer-note">
                JustRefer Partner Platform. Commission structure: Home Loan 0.3%, LAP 0.5%, Personal Loan 1.0%, Business Loan 1.0% of disbursement. Zero KYC required.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
