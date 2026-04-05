import { format, formatDistanceToNow, parseISO } from 'date-fns'

// Currency formatting
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

// Date formatting
export const formatDate = (dateStr, fmt = 'dd MMM yyyy') => {
  if (!dateStr) return '—'
  try {
    return format(typeof dateStr === 'string' ? parseISO(dateStr) : dateStr, fmt)
  } catch {
    return dateStr
  }
}

export const formatDateTime = (dateStr) =>
  formatDate(dateStr, 'dd MMM, h:mm a')

export const timeAgo = (dateStr) => {
  if (!dateStr) return '—'
  try {
    return formatDistanceToNow(
      typeof dateStr === 'string' ? parseISO(dateStr) : dateStr,
      { addSuffix: true }
    )
  } catch {
    return dateStr
  }
}

// Risk level helpers
export const getRiskLevel = (score) => {
  if (score === null || score === undefined) return 'unknown'
  if (score < 35) return 'low'
  if (score < 65) return 'medium'
  return 'high'
}

export const getRiskColor = (score) => {
  const level = getRiskLevel(score)
  const map = { low: '#22c55e', medium: '#eab308', high: '#ef4444', unknown: '#6b7280' }
  return map[level]
}

export const getRiskLabel = (score) => {
  const level = getRiskLevel(score)
  const map = { low: 'Low Risk', medium: 'Moderate', high: 'High Risk', unknown: 'Unknown' }
  return map[level]
}

// Composite score description
export const getScoreDescription = (score) => {
  if (score < 35) return 'Great conditions for delivery today'
  if (score < 65) return 'Some disruptions possible in your zone'
  return 'High disruption risk — stay safe'
}

// Trigger type icons and labels
export const TRIGGER_CONFIG = {
  rainfall: { icon: '🌧️', label: 'Heavy Rain', color: '#3b82f6' },
  heat: { icon: '🌡️', label: 'Heat Wave', color: '#f97316' },
  aqi: { icon: '💨', label: 'Poor Air Quality', color: '#8b5cf6' },
  flood: { icon: '🌊', label: 'Flood Alert', color: '#06b6d4' },
  platform_outage: { icon: '📵', label: 'Platform Outage', color: '#ec4899' },
  curfew: { icon: '🚫', label: 'Curfew / Shutdown', color: '#ef4444' },
  strike: { icon: '✊', label: 'Strike', color: '#f59e0b' },
  zone_shutdown: { icon: '⛔', label: 'Zone Shutdown', color: '#ef4444' },
}

export const getTriggerConfig = (type) =>
  TRIGGER_CONFIG[type] || { icon: '⚡', label: type, color: '#6b7280' }

// Plan tier config
export const PLAN_CONFIG = {
  basic: {
    name: 'Basic',
    color: '#6b7280',
    payout: 300,
    premium: 29,
    maxEvents: 2,
    target: 'Part-time riders',
  },
  standard: {
    name: 'Standard',
    color: '#f97316',
    payout: 600,
    premium: 49,
    maxEvents: 2,
    target: 'Full-time riders',
  },
  premium: {
    name: 'Premium',
    color: '#fbbf24',
    payout: 1000,
    premium: 79,
    maxEvents: 2,
    target: 'High-income riders',
  },
}

// Phone validation
export const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''))

// Payout status config
export const getPayoutStatusConfig = (status) => {
  const map = {
    completed: { label: 'Paid', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    pending: { label: 'Processing', color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
    held: { label: 'Under Review', color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
    failed: { label: 'Failed', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  }
  return map[status] || { label: status, color: '#6b7280', bg: 'rgba(107,114,128,0.12)' }
}

// Platform logos (emoji fallback)
export const PLATFORM_CONFIG = {
  blinkit: { name: 'Blinkit', emoji: '🟡', color: '#f9e000' },
  zepto: { name: 'Zepto', emoji: '🔴', color: '#ff3b3b' },
  swiggy_instamart: { name: 'Swiggy Instamart', emoji: '🟠', color: '#fc8019' },
  bigbasket_now: { name: 'BigBasket Now', emoji: '🟢', color: '#84c225' },
  flipkart_minutes: { name: 'Flipkart Minutes', emoji: '🔵', color: '#0456c8' },
  amazon_now: { name: 'Amazon Now', emoji: '📦', color: '#ff9900' },
  freshtohome_express: { name: 'FreshToHome Express', emoji: '🥩', color: '#e83e8c' },
}

export const getPlatformConfig = (platform) =>
  PLATFORM_CONFIG[platform?.toLowerCase()] || { name: platform, emoji: '📦', color: '#6b7280' }

// Days remaining
export const daysRemaining = (endDateStr) => {
  if (!endDateStr) return 0
  const end = typeof endDateStr === 'string' ? parseISO(endDateStr) : endDateStr
  const diff = Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

// clsx shorthand
export const cn = (...classes) => classes.filter(Boolean).join(' ')