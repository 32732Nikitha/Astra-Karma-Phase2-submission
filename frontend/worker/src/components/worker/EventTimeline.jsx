import { CloudRain, Wind, Zap, ShieldAlert, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const ICON_MAP = { Rain: CloudRain, AQI: Wind, Surge: Zap, Alert: ShieldAlert };
const STATUS_CFG = {
  active:    { badge: 'badge-red',    label: 'Live',     Icon: AlertTriangle },
  scheduled: { badge: 'badge-blue',   label: 'Upcoming', Icon: Clock },
  resolved:  { badge: 'badge-green',  label: 'Resolved', Icon: CheckCircle2 },
};

const MOCK_EVENTS = [
  { id: 1, type: 'Rain',   title: 'Heavy Monsoon Alert',      zone: 'Whitefield',    status: 'active',    time: 'Now',         multiplier: 'x1.8', payout: '₹600' },
  { id: 2, type: 'AQI',   title: 'AQI Hazard Warning',       zone: 'HSR Layout',    status: 'active',    time: '2h ago',      multiplier: null,    payout: '₹600' },
  { id: 3, type: 'Surge', title: 'Weekend Peak Flow',        zone: 'Koramangala',   status: 'scheduled', time: 'Sat 08:00',   multiplier: 'x1.4', payout: '₹300' },
  { id: 4, type: 'Rain',  title: 'Drizzle Event Cleared',    zone: 'Indiranagar',   status: 'resolved',  time: 'Yesterday',   multiplier: null,    payout: '₹450' },
];

export default function EventTimeline({ events = MOCK_EVENTS }) {
  return (
    <div className="card p-5">
      <div className="relative z-10 flex items-center justify-between mb-5">
        <h3 className="font-black text-slate-800">Event Timeline</h3>
        <span className="badge badge-red flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          {events.filter(e => e.status === 'active').length} Live
        </span>
      </div>

      <div className="relative z-10 space-y-3">
        {events.map((ev, i) => {
          const TypeIcon = ICON_MAP[ev.type] || Zap;
          const sc = STATUS_CFG[ev.status];
          const StatusIcon = sc.Icon;
          return (
            <div key={ev.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-200 transition-all group">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                ev.status === 'active' ? 'bg-red-100' : ev.status === 'scheduled' ? 'bg-blue-100' : 'bg-slate-100'
              }`}>
                <TypeIcon className={`w-4 h-4 ${
                  ev.status === 'active' ? 'text-red-600' : ev.status === 'scheduled' ? 'text-blue-600' : 'text-slate-500'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-bold text-slate-800 truncate">{ev.title}</p>
                  <span className={`badge ${sc.badge} flex items-center gap-1 text-[9px] flex-shrink-0`}>
                    <StatusIcon className="w-2.5 h-2.5" />{sc.label}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{ev.zone} · {ev.time}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-black text-slate-800">{ev.payout}</p>
                {ev.multiplier && <span className="badge badge-purple text-[9px]">{ev.multiplier}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
