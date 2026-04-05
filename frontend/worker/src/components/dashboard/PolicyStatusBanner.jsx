import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const STATUS_CONFIG = {
  active: {
    label: 'Active',
    icon: CheckCircle2,
    gradient: 'from-emerald-600/30 via-emerald-500/10 to-transparent',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  },
  expired: {
    label: 'Expired',
    icon: AlertCircle,
    gradient: 'from-red-600/30 via-red-500/10 to-transparent',
    border: 'border-red-500/30',
    dot: 'bg-red-400',
    text: 'text-red-400',
    badge: 'bg-red-500/20 text-red-300 border border-red-500/30',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    gradient: 'from-amber-600/30 via-amber-500/10 to-transparent',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
    text: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  },
};

export default function PolicyStatusBanner({ data }) {
  const { policy_status = 'active', activation_date, last_active_date } = data || {};
  const cfg = STATUS_CONFIG[policy_status] || STATUS_CONFIG.active;
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`relative w-full rounded-2xl border ${cfg.border} overflow-hidden`}
      style={{ background: 'var(--bg-card)' }}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${cfg.gradient} pointer-events-none`} />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20256%20256%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cfilter%20id%3D%22noise%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.9%22%20numOctaves%3D%224%22%20stitchTiles%3D%22stitch%22/%3E%3C/filter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23noise)%22/%3E%3C/svg%3E')]" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 md:p-6">
        {/* Left: branding + status */}
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'var(--bg-elevated)' }}
          >
            <Shield className="w-6 h-6 text-brand-400" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.15em] uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
              BHIMA ASTRA — GigShield
            </p>
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className={`inline-block w-2.5 h-2.5 rounded-full ${cfg.dot} shadow-lg`}
              />
              <span className={`text-xl font-extrabold font-display tracking-tight ${cfg.text}`}>
                Policy {cfg.label}
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${cfg.badge}`}>
                {cfg.label}
              </span>
            </div>
          </div>
        </div>

        {/* Right: dates */}
        <div className="flex flex-wrap gap-6 sm:gap-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              Activated
            </p>
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {activation_date || '01 Apr 2026'}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              Last Active
            </p>
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {last_active_date || '07 Apr 2026'}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              Policy ID
            </p>
            <p className="text-sm font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
              BGS-2026-00412
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
