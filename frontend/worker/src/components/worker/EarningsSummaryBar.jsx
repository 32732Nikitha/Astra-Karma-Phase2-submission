import { TrendingUp, TrendingDown, IndianRupee, Zap } from 'lucide-react';

const MOCK = { total_paid: 1350, total_pending: 300, events_triggered: 3, avg_payout: 450 };

export default function EarningsSummaryBar({ data = MOCK }) {
  const { total_paid = 0, total_pending = 0, events_triggered = 0, avg_payout = 0 } = data;

  const stats = [
    { label: 'Total Recovered',   value: `₹${total_paid.toLocaleString('en-IN')}`,   icon: IndianRupee,   badge: 'badge-green',  color: 'text-emerald-600' },
    { label: 'Pending Payout',    value: `₹${total_pending.toLocaleString('en-IN')}`, icon: TrendingUp,    badge: 'badge-yellow', color: 'text-amber-600' },
    { label: 'Events Triggered',  value: events_triggered,                            icon: Zap,            badge: 'badge-blue',   color: 'text-blue-600' },
    { label: 'Avg. Per Event',    value: `₹${avg_payout}`,                            icon: TrendingDown,  badge: 'badge-purple', color: 'text-violet-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="card p-4 flex flex-col gap-2">
            <div className="relative z-10 flex items-center justify-between">
              <Icon className={`w-4 h-4 ${s.color}`} />
              <span className={`badge ${s.badge} text-[9px]`}>This Week</span>
            </div>
            <div className="relative z-10">
              <p className="stat-number text-xl leading-tight">{s.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
