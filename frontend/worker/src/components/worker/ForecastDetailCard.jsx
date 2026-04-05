import { CloudRain, Wind, Thermometer, TrendingDown, TrendingUp } from 'lucide-react';

const TRIGGER_META = {
  Rain:    { icon: CloudRain,   color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100' },
  AQI:     { icon: Wind,        color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-100' },
  Heat:    { icon: Thermometer, color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-100' },
};

export default function ForecastDetailCard({ day, data }) {
  if (!day || !data) return null;

  const { rain, aqi, temp, earnings, risk } = data;
  const meta = TRIGGER_META;

  const metrics = [
    { label: 'Rainfall',   value: `${rain} mm`,  ...meta.Rain },
    { label: 'AQI',        value: aqi,            ...meta.AQI },
    { label: 'Temp',       value: `${temp}°C`,   ...meta.Heat },
  ];

  const earningsNum = parseInt(earnings.replace(/[₹,]/g,''));
  const baseline = 1400;
  const diff = earningsNum - baseline;
  const isUp = diff >= 0;

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Forecast Detail</p>
          <h3 className="font-black text-slate-800 text-lg">{day}</h3>
        </div>
        <span className={`badge ${risk === 'high' ? 'badge-red' : risk === 'medium' ? 'badge-yellow' : 'badge-green'}`}>
          {risk === 'high' ? 'High Risk' : risk === 'medium' ? 'Medium Risk' : 'Low Risk'}
        </span>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-2">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className={`${m.bg} border ${m.border} rounded-xl p-3 text-center`}>
              <Icon className={`w-4 h-4 ${m.color} mx-auto mb-1`} />
              <p className="text-sm font-black text-slate-800">{m.value}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">{m.label}</p>
            </div>
          );
        })}
      </div>

      <div className="relative z-10 bg-slate-50 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider">Est. Earnings</p>
          <p className="text-2xl font-black text-slate-800">{earnings}</p>
        </div>
        <div className={`flex items-center gap-1 text-sm font-bold ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
          {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {isUp ? '+' : ''}{diff.toLocaleString('en-IN')}
        </div>
      </div>
    </div>
  );
}
