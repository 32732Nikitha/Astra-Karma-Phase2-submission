import { useState } from 'react';
import { MapPin, Navigation, CheckCircle2 } from 'lucide-react';

const ZONES = [
  'Whitefield', 'Koramangala', 'HSR Layout', 'Indiranagar',
  'Marathahalli', 'BTM Layout', 'Jayanagar', 'Banashankari',
  'Hebbal', 'Electronic City', 'Yelahanka', 'Rajajinagar',
];

export default function ZoneUpdateMap({ currentZone = 'Whitefield' }) {
  const [selected, setSelected] = useState(currentZone);
  const [saved, setSaved] = useState(false);

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="relative z-10 flex items-center justify-between">
        <h3 className="font-black text-slate-800">Zone Settings</h3>
        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600">
          <Navigation className="w-3.5 h-3.5" /> Bengaluru
        </div>
      </div>

      <p className="relative z-10 text-xs text-slate-500">Your zone determines which weather events affect your payout triggers.</p>

      {/* Zone chips */}
      <div className="relative z-10 flex flex-wrap gap-2">
        {ZONES.map((zone) => (
          <button
            key={zone}
            onClick={() => { setSelected(zone); setSaved(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              selected === zone
                ? 'gradient-indigo text-white border-transparent shadow-md'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {zone}
          </button>
        ))}
      </div>

      <div className="relative z-10 flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-3">
        <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
        <p className="text-sm font-bold text-indigo-700 flex-1">Selected: {selected}</p>
        {saved && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
      </div>

      <button
        onClick={() => setSaved(true)}
        className="relative z-10 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl gradient-teal text-white font-bold text-sm shadow-md hover:opacity-90 transition-all"
      >
        Update Zone
      </button>
    </div>
  );
}
