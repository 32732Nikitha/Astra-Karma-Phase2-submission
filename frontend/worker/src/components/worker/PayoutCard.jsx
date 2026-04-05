import { CloudRain, Wind, Thermometer, Zap, CheckCircle2, Clock, XCircle } from 'lucide-react';

const TRIGGER_ICONS = { Rain: CloudRain, AQI: Wind, Heat: Thermometer, default: Zap };
const STATUS_CFG = {
  completed: { badge: 'badge-green', label: 'Paid',    Icon: CheckCircle2, color: 'text-emerald-500' },
  pending:   { badge: 'badge-yellow', label: 'Pending', Icon: Clock,        color: 'text-amber-500' },
  failed:    { badge: 'badge-red',    label: 'Failed',  Icon: XCircle,      color: 'text-red-500' },
};

export default function PayoutCard({ payout, onClick }) {
  const {
    trigger_type = 'Rain',
    payout_amount = 450,
    payout_status = 'completed',
    payout_timestamp = '2026-04-01T15:30:00',
    trigger_level = 'L2',
    upi_ref,
  } = payout || {};

  const TriggerIcon = TRIGGER_ICONS[trigger_type] || TRIGGER_ICONS.default;
  const sc = STATUS_CFG[payout_status] || STATUS_CFG.pending;
  const StatusIcon = sc.Icon;
  const date = new Date(payout_timestamp);
  const formatted = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const time = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className="card p-4 flex items-center gap-4 cursor-pointer"
      onClick={() => onClick?.(payout)}
    >
      {/* Trigger icon */}
      <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
        <TriggerIcon className="w-5 h-5 text-indigo-600" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 relative z-10">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-bold text-slate-800 truncate">{trigger_type} Disruption</p>
          <span className="badge badge-blue text-[9px] flex-shrink-0">{trigger_level}</span>
        </div>
        <p className="text-xs text-slate-400">{formatted} · {time}</p>
        {upi_ref && <p className="text-[10px] text-slate-400 font-mono mt-0.5">Ref: {upi_ref}</p>}
      </div>

      {/* Amount + status */}
      <div className="text-right flex-shrink-0 relative z-10">
        <p className="text-lg font-black text-slate-800">₹{payout_amount}</p>
        <span className={`badge ${sc.badge} text-[10px] flex items-center gap-1`}>
          <StatusIcon className={`w-2.5 h-2.5 ${sc.color}`} />
          {sc.label}
        </span>
      </div>
    </div>
  );
}
