/**
 * JustRefer Official Brand Logo Component
 * Combines the iconic referral-arrow connection emblem with the modern lowercase "justrefer" wordmark.
 */

export interface LogoOptions {
  /** Size preset or custom icon pixel size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | number;
  /** Color theme variant: 'dark' (on light backgrounds) or 'light' (on dark backgrounds) */
  variant?: 'dark' | 'light';
  /** Whether to render the wordmark alongside the mark */
  showWordmark?: boolean;
  /** Optional wrapper href link */
  href?: string | null;
  /** Extra CSS class for the wrapper */
  className?: string;
  /** Extra CSS class for the wordmark */
  wordmarkClass?: string;
}

const SIZE_CONFIGS = {
  xs: { icon: 20, font: 15, gap: 6, radius: 5 },
  sm: { icon: 24, font: 18, gap: 7, radius: 6 },
  md: { icon: 28, font: 22, gap: 8, radius: 7 },
  lg: { icon: 34, font: 26, gap: 10, radius: 9 },
};

/**
 * Returns the standalone SVG emblem mark for JustRefer
 */
export function renderLogoIcon(size: number = 28, variant: 'dark' | 'light' = 'dark'): string {
  const isDark = variant === 'dark';
  const bgFill = isDark ? '#111827' : '#FFFFFF';
  const fgStroke = isDark ? '#FFFFFF' : '#111827';
  const greenAccent = '#1F9D55';

  return `
    <svg
      class="jr-logo__mark"
      width="${size}"
      height="${size}"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style="display: block; flex-shrink: 0;"
    >
      <!-- Squircle Background -->
      <rect x="0.5" y="0.5" width="39" height="39" rx="10" fill="${bgFill}"/>
      
      <!-- Referral Chevron & Connection Hub in Vibrant Emerald -->
      <path d="M12 16L20 12L28 16" stroke="${greenAccent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M20 12V22" stroke="${greenAccent}" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="12" cy="16" r="2.5" fill="${greenAccent}"/>
      <circle cx="28" cy="16" r="2.5" fill="${greenAccent}"/>
      
      <!-- Referral Loop Network Path -->
      <path d="M12 16V24C12 26.2091 13.7909 28 16 28H24C26.2091 28 28 26.2091 28 24V16" stroke="${fgStroke}" stroke-width="2" stroke-linecap="round" opacity="0.45"/>
      
      <!-- Stylized Monogram "J" & Focal Node -->
      <path d="M22 18V26C22 27.1046 21.1046 28 20 28H18" stroke="${fgStroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="22" cy="14" r="1.75" fill="${fgStroke}"/>
    </svg>
  `.trim();
}

/**
 * Renders the full JustRefer Logo (Emblem + Wordmark)
 */
export function renderLogo(options: LogoOptions = {}): string {
  const {
    size = 'md',
    variant = 'dark',
    showWordmark = true,
    href = null,
    className = '',
    wordmarkClass = '',
  } = options;

  let cfg = typeof size === 'string' && SIZE_CONFIGS[size]
    ? SIZE_CONFIGS[size]
    : typeof size === 'number'
      ? { icon: size, font: Math.round(size * 0.8), gap: Math.round(size * 0.28), radius: Math.round(size * 0.25) }
      : SIZE_CONFIGS.md;

  const textColor = variant === 'dark' ? '#111827' : '#FFFFFF';
  const tag = href !== null ? 'a' : 'div';
  const hrefAttr = href !== null ? `href="${href}"` : '';

  const markSvg = renderLogoIcon(cfg.icon, variant);
  const wordmarkHtml = showWordmark
    ? `<span class="jr-logo__wordmark ${wordmarkClass}" style="font-size: ${cfg.font}px; font-weight: 800; letter-spacing: -0.04em; color: ${textColor}; line-height: 1; user-select: none;">justrefer</span>`
    : '';

  return `
    <${tag} ${hrefAttr} class="jr-logo ${className}" style="display: inline-flex; align-items: center; gap: ${cfg.gap}px; text-decoration: none; cursor: pointer;">
      ${markSvg}
      ${wordmarkHtml}
    </${tag}>
  `.trim();
}

