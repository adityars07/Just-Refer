import { useState, useRef, useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Logo from './Logo'

interface HeroProps {
  onOpenModal: () => void
}

type Timeframe = '1D' | '1W' | '1M' | '1Y' | 'ALL'
type MockupTab = 'Home' | 'Referrals' | 'Payouts'

interface TimeframeData {
  totalNumber: number
  returnNumber: number
  percent: string
  path: string
  fillPath: string
}

const TIMEFRAME_DATA: Record<Timeframe, TimeframeData> = {
  '1D': {
    totalNumber: 8450.0,
    returnNumber: 950.0,
    percent: '(12.7%)',
    path: 'M2 38 Q 40 45, 75 30 T 135 25 T 195 15 T 235 12 T 258 4',
    fillPath: 'M2 38 Q 40 45, 75 30 T 135 25 T 195 15 T 235 12 T 258 4 L 258 55 L 2 55 Z',
  },
  '1W': {
    totalNumber: 34200.0,
    returnNumber: 4120.0,
    percent: '(13.7%)',
    path: 'M2 42 Q 35 30, 80 35 T 140 18 T 190 22 T 235 8 T 258 4',
    fillPath: 'M2 42 Q 35 30, 80 35 T 140 18 T 190 22 T 235 8 T 258 4 L 258 55 L 2 55 Z',
  },
  '1M': {
    totalNumber: 92850.5,
    returnNumber: 11400.0,
    percent: '(14.0%)',
    path: 'M2 46 Q 30 40, 70 28 T 130 32 T 185 14 T 230 16 T 258 4',
    fillPath: 'M2 46 Q 30 40, 70 28 T 130 32 T 185 14 T 230 16 T 258 4 L 258 55 L 2 55 Z',
  },
  '1Y': {
    totalNumber: 145600.0,
    returnNumber: 16300.0,
    percent: '(12.6%)',
    path: 'M2 48 Q 28 35, 65 38 T 120 22 T 180 20 T 225 10 T 258 4',
    fillPath: 'M2 48 Q 28 35, 65 38 T 120 22 T 180 20 T 225 10 T 258 4 L 258 55 L 2 55 Z',
  },
  'ALL': {
    totalNumber: 169283.44,
    returnNumber: 18508.13,
    percent: '(12.4%)',
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
  const animatedTotal = useAnimatedCount(currentData.totalNumber, animKey, 1200)
  const animatedProfit = useAnimatedCount(currentData.returnNumber, animKey, 1200)

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
            Turn your professional network into your greatest income stream.
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
                  {/* Re-play Animation Button */}
                  <div
                    className="mockup-icon-btn"
                    title="Re-play count-up animation"
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
                  <span className="mockup-msg-text">Messages</span>
                  <div className="mockup-user-avatar">AR</div>
                </div>
              </div>

              {/* Main Body Grid - Renders Immediately With Zero Delay */}
              <motion.div
                key={`body-${animKey}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mockup-body-grid"
              >
                {/* Left Column: Earnings & Dynamic Sparkline Chart */}
                <div className="mockup-left-col">
                  <motion.div variants={cardItemVariants} className="mockup-earnings-row">
                    <div>
                      <span className="mockup-micro-label">TOTAL EARNINGS</span>
                      <div className="mockup-big-number">
                        ₹{formatIndianCurrency(animatedTotal)}
                      </div>
                      <div className="mockup-return-label">
                        <span>ALL TIME RETURN</span>
                        <strong className="green-text">
                          +₹{formatIndianCurrency(animatedProfit)} {currentData.percent}
                        </strong>
                      </div>
                    </div>

                    {/* Interactive Sparkline with Left-to-Right Draw Animation */}
                    <div className="mockup-chart-side">
                      <div className="mockup-time-tabs">
                        {(['1D', '1W', '1M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
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
                          {/* Animated Gradient Fill */}
                          <motion.path
                            key={`fill-${activeTimeframe}-${animKey}`}
                            d={currentData.fillPath}
                            fill="url(#sparkline-gradient)"
                            initial={shouldReduceMotion ? { opacity: 0.18 } : { opacity: 0 }}
                            animate={{ opacity: 0.18 }}
                            transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : 0.2 }}
                            className="sparkline-fill-area"
                          />

                          {/* Performance Curve Drawing Line Left-to-Right */}
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

                          {/* Live Radar Beacon Ping at the end of the curve */}
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

                  {/* Loan Referral Products with Immediate Fade-in and Hover Lift */}
                  <motion.div variants={containerVariants} className="mockup-items-list">
                    <motion.div variants={cardItemVariants} className="mockup-list-item" onClick={onOpenModal}>
                      <div className="mockup-item-left">
                        <div className="mockup-cat-icon gold">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                          </svg>
                        </div>
                        <div>
                          <div className="mockup-item-title">Home Loan</div>
                          <div className="mockup-item-sub">HDFC Bank • ₹45L Disbursed</div>
                        </div>
                      </div>
                      <div className="mockup-item-right">
                        <div className="mockup-item-val">₹1,05,337.89</div>
                        <div className="mockup-item-profit">+₹6,534.20 (10.77%)</div>
                      </div>
                    </motion.div>

                    <motion.div variants={cardItemVariants} className="mockup-list-item" onClick={onOpenModal}>
                      <div className="mockup-item-left">
                        <div className="mockup-cat-icon purple">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                          </svg>
                        </div>
                        <div>
                          <div className="mockup-item-title">Business Loan</div>
                          <div className="mockup-item-sub">ICICI Bank • ₹25L Disbursed</div>
                        </div>
                      </div>
                      <div className="mockup-item-right">
                        <div className="mockup-item-val">₹51,003.52</div>
                        <div className="mockup-item-profit">+₹1,847.30 (10.45%)</div>
                      </div>
                    </motion.div>

                    <motion.div variants={cardItemVariants} className="mockup-list-item" onClick={onOpenModal}>
                      <div className="mockup-item-left">
                        <div className="mockup-cat-icon blue">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                          </svg>
                        </div>
                        <div>
                          <div className="mockup-item-title">Personal Loan</div>
                          <div className="mockup-item-sub">Axis Bank • ₹8L Disbursed</div>
                        </div>
                      </div>
                      <div className="mockup-item-right">
                        <div className="mockup-item-val">₹25,090.18</div>
                        <div className="mockup-item-profit">+₹750.00 (14.50%)</div>
                      </div>
                    </motion.div>

                    <motion.div variants={cardItemVariants} className="mockup-list-item" onClick={onOpenModal}>
                      <div className="mockup-item-left">
                        <div className="mockup-cat-icon orange">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="3" width="15" height="13" />
                            <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                            <circle cx="5.5" cy="18.5" r="2.5" />
                            <circle cx="18.5" cy="18.5" r="2.5" />
                          </svg>
                        </div>
                        <div>
                          <div className="mockup-item-title">Loan Against Property</div>
                          <div className="mockup-item-sub">Bajaj Finserv • ₹50L Disbursed</div>
                        </div>
                      </div>
                      <div className="mockup-item-right">
                        <div className="mockup-item-val">₹13,803.84</div>
                        <div className="mockup-item-profit green">+₹2,414.00 (17.5%)</div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Right Column: Refer & Earn Promo Card + Scheduled Payout */}
                <div className="mockup-right-col">
                  <motion.div variants={cardItemVariants} className="mockup-refer-promo-box">
                    <div className="mockup-refer-tag">EARN ₹1,000</div>
                    <h4 className="mockup-refer-title">Invite & Earn Cash</h4>
                    <p className="mockup-refer-desc">
                      Invite a friend or colleague to JustRefer and earn ₹1,000 in cash when their first loan is disbursed. Plus, they get zero processing fee — a win for both of you!
                    </p>
                    <button
                      type="button"
                      className="mockup-refer-btn shimmer-btn"
                      onClick={onOpenModal}
                    >
                      <span>Get Referral Link →</span>
                    </button>
                  </motion.div>

                  <motion.div variants={cardItemVariants} className="mockup-stat-mini-box">
                    <span className="mini-box-label">NEXT WEEKLY PAYOUT</span>
                    <div className="mini-box-val">₹48,500.00</div>
                    <div className="mini-box-status">
                      <span className="live-status-pulse">
                        <span className="pulse-dot-core" />
                        <span className="pulse-dot-ring" />
                      </span>
                      <span>Scheduled for Friday</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <div className="mockup-footer-note">
                Image is hypothetical and shown for demonstrative purposes. Actual results will vary based on individual referral volume and bank commission structures.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
