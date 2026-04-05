import { MapPin, Navigation } from 'lucide-react';

const ZONES = [
  { id: 1, name: 'Whitefield',   risk: 'high',   active: true  },
  { id: 2, name: 'Koramangala',  risk: 'medium', active: true  },
  { id: 3, name: 'HSR Layout',   risk: 'high',   active: true  },
  { id: 4, name: 'Indiranagar',  risk: 'low',    active: false },
  { id: 5, name: 'BTM Layout',   risk: 'medium', active: false },
  { id: 6, name: 'Marathahalli', risk: 'low',    active: true  },
];

const RISK_COLOR = { high: 'bg-red-500', medium: 'bg-amber-400', low: 'bg-emerald-400' };
const RISK_BADGE = { high: 'badge-red', medium: 'badge-yellow', low: 'badge-green' };

export default function ZoneMapOverlay() {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="relative z-10 flex items-center justify-between">
        <h3 className="font-black text-slate-800">Zone Map Overlay</h3>
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
          <Navigation className="w-3.5 h-3.5" />
          Bengaluru
        </div>
      </div>

      {/* Simplified SVG zone map */}
      <div className="relative z-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl overflow-hidden h-40 border border-blue-100 flex items-center justify-center">
        <svg viewBox="0 0 300 160" className="w-full h-full">
          {/* Road grid */}
          <line x1="0" y1="80" x2="300" y2="80" stroke="#c7d2fe" strokeWidth="1.5" />
          <line x1="150" y1="0" x2="150" y2="160" stroke="#c7d2fe" strokeWidth="1.5" />
          <line x1="0" y1="40" x2="300" y2="40" stroke="#e0e7ff" strokeWidth="0.8" />
          <line x1="0" y1="120" x2="300" y2="120" stroke="#e0e7ff" strokeWidth="0.8" />
          <line x1="80" y1="0" x2="80" y2="160" stroke="#e0e7ff" strokeWidth="0.8" />
          <line x1="220" y1="0" x2="220" y2="160" stroke="#e0e7ff" strokeWidth="0.8" />

          {/* Zone dots */}
          <circle cx="220" cy="50"  r="14" fill="rgba(239,68,68,0.15)"  stroke="#ef4444" strokeWidth="1.5" />
          <circle cx="150" cy="90"  r="12" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" strokeWidth="1.5" />
          <circle cx="80"  cy="110" r="14" fill="rgba(239,68,68,0.15)"  stroke="#ef4444" strokeWidth="1.5" />
          <circle cx="220" cy="120" r="10" fill="rgba(34,197,94,0.15)"  stroke="#22c55e" strokeWidth="1.5" />
          <circle cx="80"  cy="50"  r="10" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" strokeWidth="1.5" />

          {/* Your zone marker */}
          <circle cx="150" cy="90" r="4" fill="#6366f1" />
          <circle cx="150" cy="90" r="8" fill="none" stroke="#6366f1" strokeWidth="1.5" opacity="0.5" />

          {/* Labels */}
          <text x="220" y="38" textAnchor="middle" fontSize="7" fill="#475569" fontWeight="600">Whitefield</text>
          <text x="148" y="78" textAnchor="middle" fontSize="7" fill="#4338ca" fontWeight="700">◉ Your Zone</text>
          <text x="80"  y="100" textAnchor="middle" fontSize="7" fill="#475569" fontWeight="600">HSR Layout</text>
          <text x="220" y="137" textAnchor="middle" fontSize="7" fill="#475569" fontWeight="600">Indiranagar</text>
          <text x="80"  y="38" textAnchor="middle" fontSize="7" fill="#475569" fontWeight="600">Koramangala</text>
        </svg>
      </div>

      {/* Zone legend */}
      <div className="relative z-10 grid grid-cols-2 gap-2">
        {ZONES.slice(0, 4).map((z) => (
          <div key={z.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${RISK_COLOR[z.risk]}`} />
            <span className="text-xs font-semibold text-slate-700 flex-1 truncate">{z.name}</span>
            <span className={`badge ${RISK_BADGE[z.risk]} text-[9px]`}>{z.risk}</span>
          </div>
        ))}
      </div>

      <div className="relative z-10 flex gap-3 text-[10px] font-bold text-slate-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />High</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" />Medium</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" />Low</span>
      </div>
    </div>
  );
}
