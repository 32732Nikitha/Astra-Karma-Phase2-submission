import { useState } from 'react';
import { ChevronLeft, ChevronRight, CloudRain, Wind, Sun, Thermometer } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MOCK_WEEK = [
  { risk: 'low',    rain: 5,  aqi: 80,  temp: 34, earnings: '₹1,400' },
  { risk: 'medium', rain: 18, aqi: 145, temp: 37, earnings: '₹1,100' },
  { risk: 'high',   rain: 38, aqi: 210, temp: 38, earnings: '₹620'   },
  { risk: 'low',    rain: 2,  aqi: 72,  temp: 33, earnings: '₹1,550' },
  { risk: 'medium', rain: 22, aqi: 168, temp: 36, earnings: '₹980'   },
  { risk: 'high',   rain: 45, aqi: 234, temp: 39, earnings: '₹480'   },
  { risk: 'low',    rain: 0,  aqi: 60,  temp: 32, earnings: '₹1,650' },
];

const RISK_STYLE = {
  low:    { bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-700', icon: Sun,        label: 'Safe' },
  medium: { bg: 'bg-amber-100',   border: 'border-amber-300',   text: 'text-amber-700',   icon: Wind,       label: 'Watch' },
  high:   { bg: 'bg-red-100',     border: 'border-red-300',     text: 'text-red-700',     icon: CloudRain,  label: 'Risk' },
};

export default function SevenDayRiskCalendar({ onSelect }) {
  const today = new Date().getDay();
  const [selected, setSelected] = useState(today === 0 ? 6 : today - 1);

  return (
    <div className="card p-5">
      <div className="relative z-10 flex items-center justify-between mb-4">
        <h3 className="font-black text-slate-800">7-Day Risk Calendar</h3>
        <span className="badge badge-blue">This Week</span>
      </div>

      {/* Day grid */}
      <div className="relative z-10 grid grid-cols-7 gap-1.5 mb-4">
        {DAYS.map((day, i) => {
          const d = MOCK_WEEK[i];
          const rs = RISK_STYLE[d.risk];
          const Icon = rs.icon;
          const isToday = i === (today === 0 ? 6 : today - 1);
          return (
            <button
              key={day}
              onClick={() => { setSelected(i); onSelect?.(i, d); }}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                selected === i
                  ? `${rs.bg} ${rs.border} shadow-md`
                  : 'border-transparent bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <span className={`text-[9px] font-black uppercase tracking-wider ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>{day}</span>
              <Icon className={`w-4 h-4 ${selected === i ? rs.text : 'text-slate-400'}`} />
              <span className={`text-[9px] font-bold ${selected === i ? rs.text : 'text-slate-400'}`}>{rs.label}</span>
            </button>
          );
        })}
      </div>

      {/* Selected day detail */}
      {selected !== null && (
        <div className={`relative z-10 rounded-xl p-4 border ${RISK_STYLE[MOCK_WEEK[selected].risk].bg} ${RISK_STYLE[MOCK_WEEK[selected].risk].border}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{DAYS[selected]}'s Forecast</p>
              <p className={`text-xl font-black mt-0.5 ${RISK_STYLE[MOCK_WEEK[selected].risk].text}`}>
                {RISK_STYLE[MOCK_WEEK[selected].risk].label} Day
              </p>
            </div>
            <div className="text-right text-xs space-y-0.5">
              <p className="text-slate-500">Rain: <b>{MOCK_WEEK[selected].rain}mm</b></p>
              <p className="text-slate-500">AQI: <b>{MOCK_WEEK[selected].aqi}</b></p>
              <p className="text-slate-500">Heat: <b>{MOCK_WEEK[selected].temp}°C</b></p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200/50 flex justify-between items-center">
            <span className="text-xs text-slate-500">Est. Earnings</span>
            <span className="font-black text-slate-800">{MOCK_WEEK[selected].earnings}</span>
          </div>
        </div>
      )}
    </div>
  );
}
