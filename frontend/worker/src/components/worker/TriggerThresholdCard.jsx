import { CloudRain, Wind, Thermometer } from 'lucide-react';

const THRESHOLDS = [
  { trigger: 'Rainfall',   icon: CloudRain,    current: 18, threshold: 25, unit: 'mm/hr', color: 'from-blue-400 to-cyan-400',   textColor: 'text-blue-600',   bg: 'bg-blue-50' },
  { trigger: 'AQI',        icon: Wind,         current: 142, threshold: 200, unit: 'AQI', color: 'from-amber-400 to-orange-400', textColor: 'text-amber-600',  bg: 'bg-amber-50' },
  { trigger: 'Heat Index', icon: Thermometer,  current: 36, threshold: 42, unit: '°C',   color: 'from-red-400 to-rose-400',     textColor: 'text-red-600',    bg: 'bg-red-50' },
];

export default function TriggerThresholdCard() {
  return (
    <div className="card p-5">
      <div className="relative z-10 flex items-center justify-between mb-4">
        <h3 className="font-black text-slate-800">Live Thresholds</h3>
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Data
        </span>
      </div>
      <div className="relative z-10 space-y-4">
        {THRESHOLDS.map((t) => {
          const Icon = t.icon;
          const pct = Math.min((t.current / t.threshold) * 100, 100);
          const nearTrigger = pct >= 80;
          return (
            <div key={t.trigger}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg ${t.bg} flex items-center justify-center`}>
                    <Icon className={`w-3.5 h-3.5 ${t.textColor}`} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{t.trigger}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-500">{t.current}/{t.threshold} {t.unit}</span>
                  {nearTrigger && <span className="badge badge-yellow text-[9px]">Near!</span>}
                </div>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${t.color} transition-all duration-1000`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
