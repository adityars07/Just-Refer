export const tokens = {
  colors: {
    primaryDarkGreen: '#0F3D2E', // buttons, active sidebar item, dark cards, footer banners
    accentGreen: '#1F9D55',      // icons, positive values, "Approved" badges, chart line
    lightGreenTint: '#E6F4EC',   // icon tiles, chart fill, badge backgrounds
    pageBg: '#F8F6F0',           // warm off-white/cream
    cardBg: '#FFFFFF',           // pure white
    border: '#ECE9E1',           // 1px border
    headingText: '#0B1F18',      // headings 700-800
    bodyText: '#5F6B66',         // body 400-500
    mutedText: '#9AA39F',        // subtle hints
    status: {
      approved: { text: '#1F9D55', bg: '#E6F4EC' },
      inProgress: { text: '#F59E0B', bg: '#FEF3E2' },
      disbursed: { text: '#3B82F6', bg: '#E8F0FE' },
      rejected: { text: '#EF4444', bg: '#FDECEC' },
    },
  },
  shadows: {
    card: '0 4px 20px rgba(0,0,0,0.04)',
    hover: '0 10px 32px rgba(0,0,0,0.08)',
    buttonDark: '0 4px 14px rgba(15, 61, 46, 0.25)',
  },
  radii: {
    pill: '9999px',
    card: '18px',
    input: '12px',
    iconTile: '12px',
  },
}
