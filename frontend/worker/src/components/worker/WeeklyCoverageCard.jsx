import { CalendarDays, Zap, IndianRupee } from 'lucide-react';

const mock = { events_used: 2, events_remaining: 3, payout_amount: 18500, days_remaining: 4 };

export default function WeeklyCoverageCard({ data = mock }) {
  const { events_used, events_remaining, payout_amount, days_remaining } = data;
  const total = events_used + events_remaining;
  const pct = total > 0 ? Math.round((events_used / total) * 100) : 0;

  return (
    <div className="card p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between relative z-10">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Weekly Coverage</p>
        <span className="badge badge-blue">Week Active</span>
      </div>

      {/* Days Circle */}
      <div className="relative z-10 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl gradient-indigo flex flex-col items-center justify-center shadow-lg flex-shrink-0">
          <span className="text-2xl font-black text-white leading-none">{days_remaining}</span>
          <span className="text-[9px] text-white/70 font-bold uppercase tracking-wider">days left</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            <span>Events</span>
            <span>{events_used}/{total} used</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">{events_remaining} events remaining</p>
        </div>
      </div>

      <div className="divider" />

      {/* Payout remaining */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Payout Pool</p>
            <p className="stat-number text-lg leading-none">₹{payout_amount.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <span className="badge badge-green">Available</span>
      </div>
    </div>
  );
}
