import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Zap, IndianRupee } from 'lucide-react';

export default function WeeklyCoverageCard({ data }) {
  const {
    events_used = 2,
    events_remaining = 3,
    payout_amount = 18500,
  } = data || {};

  const totalEvents = events_used + events_remaining;
  const usedPct = totalEvents > 0 ? (events_used / totalEvents) * 100 : 0;
  const daysRemaining = 4;

  const stats = [
    {
      icon: CalendarDays,
      label: 'Days Left',
      value: daysRemaining,
      suffix: 'days',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      icon: Zap,
      label: 'Events Used',
      value: `${events_used}/${totalEvents}`,
      suffix: '',
      color: 'text-brand-400',
      bg: 'bg-brand-500/10',
    },
    {
      icon: IndianRupee,
      label: 'Payout Left',
      value: `₹${payout_amount.toLocaleString('en-IN')}`,
      suffix: '',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="card flex flex-col gap-4 h-full hover:-translate-y-1 transition-transform duration-200"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Weekly Coverage
        </p>
        <span
          className="text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest"
          style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
        >
          Week 1
        </span>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
          <span>Events Used</span>
          <span>{events_used} of {totalEvents}</span>
        </div>
        <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${usedPct}%` }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-500 to-brand-400"
          />
        </div>
      </div>

      {/* 3 stat chips */}
      <div className="grid grid-cols-3 gap-2 mt-auto">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 rounded-xl p-2.5"
              style={{ background: 'var(--bg-elevated)' }}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${s.color}`} />
              </div>
              <p className={`text-sm font-extrabold font-display leading-none ${s.color}`}>{s.value}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-center" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
