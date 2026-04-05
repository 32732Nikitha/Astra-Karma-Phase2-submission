import { ShieldCheck, AlertTriangle, Info } from 'lucide-react';

const FRAUD_CONFIG = {
  low:    { badge: 'badge-green',  icon: ShieldCheck,    label: 'Low Risk',    desc: 'Your account shows no suspicious activity.',          color: 'text-emerald-600', bg: 'bg-emerald-50' },
  medium: { badge: 'badge-yellow', icon: AlertTriangle,  label: 'Medium Risk', desc: 'Some unusual patterns detected. Review your activity.', color: 'text-amber-600',   bg: 'bg-amber-50' },
  high:   { badge: 'badge-red',    icon: AlertTriangle,  label: 'High Risk',   desc: 'Suspicious activity flagged. Contact support.',        color: 'text-red-600',     bg: 'bg-red-50' },
};

export default function FraudRiskBadge({ risk_level = 'low', score = 12 }) {
  const cfg = FRAUD_CONFIG[risk_level] || FRAUD_CONFIG.low;
  const Icon = cfg.icon;

  return (
    <div className={`card p-4 flex items-start gap-3 ${cfg.bg} border border-current/10`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm`}>
        <Icon className={`w-5 h-5 ${cfg.color}`} />
      </div>
      <div className="relative z-10 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-black text-slate-800">Fraud Risk Score</p>
          <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-2xl font-black ${cfg.color}`}>{score}</span>
          <span className="text-xs text-slate-400">/100</span>
        </div>
        <p className="text-xs text-slate-500">{cfg.desc}</p>
      </div>
    </div>
  );
}
