// src/components/ui/IconBadge.jsx
// Replaces all emojis with consistent soft-UI SVG icon badges

export const COLOR_MAP = {
  rain:     { bg: '#f5f3ff', icon: '#7c3aed' },
  aqi:      { bg: '#fdf2f8', icon: '#db2777' },
  temp:     { bg: '#fff7ed', icon: '#ea580c' },
  payout:   { bg: '#f0fdf4', icon: '#16a34a' },
  alert:    { bg: '#fef2f2', icon: '#dc2626' },
  info:     { bg: '#eff6ff', icon: '#2563eb' },
  home:     { bg: '#f5f3ff', icon: '#7c3aed' },
  policy:   { bg: '#f0fdf4', icon: '#16a34a' },
  events:   { bg: '#fff7ed', icon: '#ea580c' },
  profile:  { bg: '#f5f3ff', icon: '#7c3aed' },
  flood:    { bg: '#eff6ff', icon: '#2563eb' },
  curfew:   { bg: '#fef2f2', icon: '#dc2626' },
  outage:   { bg: '#fdf2f8', icon: '#db2777' },
  forecast: { bg: '#f0fdf4', icon: '#16a34a' },
  fraud:    { bg: '#fef9c3', icon: '#ca8a04' },
  zone:     { bg: '#eff6ff', icon: '#2563eb' },
}

const ICONS = {
  rain: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/>
      <line x1="12" y1="15" x2="12" y2="23"/>
      <path d="M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25"/>
    </svg>
  ),
  aqi: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 7.5a2.5 2.5 0 015 0v1A2.5 2.5 0 019 8.5V7.5z"/>
      <path d="M3 12h18M3 17h18M3 7h3m12 0h3"/>
    </svg>
  ),
  temp: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/>
    </svg>
  ),
  payout: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  ),
  alert: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  info: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  home: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  policy: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  events: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  profile: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  flood: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18c0-2 1.5-3 3-3s3 1 3 3 1.5 3 3 3 3-1 3-3 1.5-3 3-3"/>
      <path d="M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25"/>
    </svg>
  ),
  curfew: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
    </svg>
  ),
  outage: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      <line x1="2" y1="2" x2="22" y2="22"/>
    </svg>
  ),
  forecast: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  fraud: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  zone: (c) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="10" r="3"/>
      <path d="M12 2a8 8 0 018 8c0 5.25-8 14-8 14S4 15.25 4 10a8 8 0 018-8z"/>
    </svg>
  ),
}

export default function IconBadge({ type = 'info', size = 'md' }) {
  const cfg = COLOR_MAP[type] || COLOR_MAP.info
  const renderIcon = ICONS[type] || ICONS.info
  const dim = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9'
  return (
    <div
      className={`${dim} rounded-xl flex items-center justify-center flex-shrink-0`}
      style={{ background: cfg.bg }}
    >
      {renderIcon(cfg.icon)}
    </div>
  )
}
