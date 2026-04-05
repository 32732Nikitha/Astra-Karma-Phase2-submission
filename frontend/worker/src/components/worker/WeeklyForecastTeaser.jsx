import { useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowRight, CloudRain, Wind, Sun } from 'lucide-react';

const RISK_CONFIG = {
  low:    { label: 'Low Risk',    badge: 'badge-green',  icon: Sun,       color: 'text-emerald-600', bg: 'bg-emerald-50',  bar: 'from-emerald-400 to-teal-400',   pct: 22 },
  medium: { label: 'Medium Risk', badge: 'badge-yellow', icon: Wind,      color: 'text-amber-600',   bg: 'bg-amber-50',    bar: 'from-amber-400 to-orange-400',   pct: 55 },
  high:   { label: 'High Risk',   badge: 'badge-red',    icon: CloudRain, color: 'text-red-600',     bg: 'bg-red-50',      bar: 'from-red-500 to-rose-500',       pct: 82 },
};

export default function WeeklyForecastTeaser({ forecast_risk_level = 'medium' }) {
  const navigate = useNavigate();
  const risk = RISK_CONFIG[forecast_risk_level] || RISK_CONFIG.medium;
  const Icon = risk.icon;

  return (
    <div className="card p-5 flex flex-col gap-4 h-full cursor-pointer" onClick={() => navigate('/forecast')}>
      <div className="relative z-10 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Tomorrow's Forecast</p>
        <TrendingUp className="w-4 h-4 text-slate-400" />
      </div>

      <div className={`relative z-10 flex items-center gap-3 rounded-xl p-4 ${risk.bg}`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${risk.bg} border border-current/10`}>
          <Icon className={`w-6 h-6 ${risk.color}`} />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-0.5">Risk Level</p>
          <p className={`text-xl font-black ${risk.color}`}>{risk.label}</p>
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
          <span>Risk Index</span>
          <span>{risk.pct}/100</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${risk.bar} transition-all duration-1000`}
            style={{ width: `${risk.pct}%` }}
          />
        </div>
      </div>

      <button
        className="relative z-10 mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
        onClick={(e) => { e.stopPropagation(); navigate('/forecast'); }}
      >
        View Full Forecast <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
