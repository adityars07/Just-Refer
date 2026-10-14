/**
 * JustRefer Logo Component
 * Modern, minimal fintech logo with a referral-arrow icon mark + wordmark.
 * The icon is two overlapping rounded arrows forming a "connection" motif.
 */

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showWordmark?: boolean
  variant?: 'dark' | 'light'   // dark = dark icon on white bg, light = white icon on dark bg
  className?: string
}

const sizeMap = {
  sm: { icon: 24, font: 16, gap: 6 },
  md: { icon: 30, font: 20, gap: 8 },
  lg: { icon: 38, font: 26, gap: 10 },
}

const Logo = ({
  size = 'md',
  showWordmark = true,
  variant = 'dark',
  className = '',
}: LogoProps) => {
  const s = sizeMap[size]
  const iconColor = variant === 'dark' ? '#111827' : '#ffffff'
  const accentColor = '#1F9D55'
  const textColor = variant === 'dark' ? '#111827' : '#ffffff'

  return (
    <div
      className={`jr-logo ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${s.gap}px`,
        textDecoration: 'none',
      }}
    >
      {/* Icon Mark: Rounded square with abstract referral arrows */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Rounded square background */}
        <rect
          x="1"
          y="1"
          width="38"
          height="38"
          rx="10"
          fill={iconColor}
        />
        {/* Two referral arrows forming a continuous loop */}
        {/* Arrow 1: top-left to bottom-right */}
        <path
          d="M12 16L20 12L28 16"
          stroke={accentColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 12V22"
          stroke={accentColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Arrow 2: connection dots */}
        <circle cx="12" cy="16" r="2.5" fill={accentColor} />
        <circle cx="28" cy="16" r="2.5" fill={accentColor} />
        {/* Base path */}
        <path
          d="M12 16V24C12 26.2091 13.7909 28 16 28H24C26.2091 28 28 26.2091 28 24V16"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Central "J" letterform */}
        <path
          d="M22 18V26C22 27.1046 21.1046 28 20 28H18"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="22" cy="15" r="1.5" fill="#ffffff" />
      </svg>

      {/* Wordmark */}
      {showWordmark && (
        <span
          style={{
            fontSize: `${s.font}px`,
            fontWeight: 800,
            color: textColor,
            letterSpacing: '-0.6px',
            lineHeight: 1,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          JustRefer
        </span>
      )}
    </div>
  )
}

export default Logo
