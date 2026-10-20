import React from 'react'

/**
 * JustRefer Logo Component
 * Exact Carry.com style:
 * - Minimal, modern, geometric lowercase wordmark: "justrefer"
 * - Extra-bold typography (Plus Jakarta Sans, 800 weight)
 * - Signature Carry-style hover micro-interaction (subtle rotate on hover, active scale)
 * - Supports dark (black on white) and light (white on dark) variants
 */

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'dark' | 'light'
  className?: string
  onClick?: () => void
  showWordmark?: boolean
}

const sizeConfig = {
  xs: { font: 15, letterSpacing: '-0.6px' },
  sm: { font: 18, letterSpacing: '-0.8px' },
  md: { font: 24, letterSpacing: '-1.1px' },
  lg: { font: 30, letterSpacing: '-1.4px' },
}

const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'dark',
  className = '',
  onClick,
}) => {
  const cfg = sizeConfig[size] || sizeConfig.md
  const color = variant === 'dark' ? '#111827' : '#ffffff'

  return (
    <span
      className={`carry-wordmark-logo ${className}`}
      onClick={onClick}
      style={{
        fontSize: `${cfg.font}px`,
        fontWeight: 800,
        color,
        letterSpacing: cfg.letterSpacing,
        lineHeight: 1,
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
        userSelect: 'none',
        cursor: 'pointer',
      }}
    >
      justrefer
    </span>
  )
}

export default Logo
