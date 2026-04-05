import React from 'react'
import { getPayoutStatusConfig } from '../../utils/helpers'

export function StatusBadge({ status, size = 'sm' }) {
  const cfg = getPayoutStatusConfig(status)
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1'}`}
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}
    >
      {cfg.label}
    </span>
  )
}

export function PolicyStatusBadge({ status }) {
  const map = {
    active: { label: 'Active', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    expired: { label: 'Expired', color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
    cancelled: { label: 'Cancelled', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    pending_payment: { label: 'Pending', color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
  }
  const cfg = map[status] || { label: status, color: '#6b7280', bg: 'rgba(107,114,128,0.12)' }
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full text-xs font-semibold px-2.5 py-0.5"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 status-dot-live" />}
      {cfg.label}
    </span>
  )
}