import { CloudRain, Wind, Zap, ShieldAlert, ArrowRight } from 'lucide-react';

const ICON_MAP = { Rain: CloudRain, AQI: Wind, Surge: Zap, Alert: ShieldAlert };

const STATUS_STYLE = {
  active:    { bg: 'bg-red-50',   border: 'border-red-200',   badge: 'badge-red',   text: 'text-red-600' },
  scheduled: { bg: 'bg-blue-50',  border: 'border-blue-200',  badge: 'badge-blue',  text: 'text-blue-600' },
  resolved:  { bg: 'bg-slate-50', border: 'border-slate-200', badge: 'badge-gray',  text: 'text-slate-500' },
};

export default function EventCard({ event, onClick }) {
  if (!event) return null;
  const { type = 'Rain', title, zone, status = 'active', time, payout, multiplier, description } = event;
  const TypeIcon = ICON_MAP[type] || Zap;
  const ss = STATUS_STYLE[status];

  return (
    <div
      className={`card p-5 flex flex-col gap-3 cursor-pointer border ${ss.border} ${ss.bg}`}
      onClick={() => onClick?.(event)}
    >
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm`}>
            <TypeIcon className={`w-5 h-5 ${ss.text}`} />
          </div>
          <div>
            <p className="text-sm font-black text-slate-800">{title}</p>
            <p className="text-xs text-slate-400">{zone}</p>
          </div>
        </div>
        <span className={`badge ${ss.badge} flex-shrink-0`}>{status}</span>
      </div>

      {description && (
        <p className="relative z-10 text-xs text-slate-500 leading-relaxed line-clamp-2">{description}</p>
      )}

      <div className="relative z-10 flex items-center justify-between pt-2 border-t border-slate-200/60">
        <p className="text-xs text-slate-400">{time}</p>
        <div className="flex items-center gap-2">
          {multiplier && <span className="badge badge-purple">{multiplier} bonus</span>}
          <span className="text-sm font-black text-slate-800">{payout}</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </div>
  );
}
