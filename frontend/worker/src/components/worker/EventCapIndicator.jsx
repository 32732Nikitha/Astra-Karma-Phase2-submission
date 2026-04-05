import { Zap } from 'lucide-react';

export default function EventCapIndicator({ events_used = 1, event_cap = 3, payout_per_event = 600 }) {
  const dots = Array.from({ length: event_cap }, (_, i) => i < events_used);

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="relative z-10 flex items-center justify-between">
        <h3 className="font-black text-slate-800">Event Cap</h3>
        <Zap className="w-4 h-4 text-indigo-500" />
      </div>

      {/* Dot indicators */}
      <div className="relative z-10 flex items-center gap-3">
        {dots.map((used, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${
              used
                ? 'gradient-indigo border-indigo-400 shadow-md shadow-indigo-200'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <Zap className={`w-5 h-5 ${used ? 'text-white' : 'text-slate-300'}`} />
            </div>
            <span className="text-[9px] font-bold text-slate-400">{used ? 'Used' : 'Left'}</span>
          </div>
        ))}
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-2">
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Used</p>
          <p className="text-xl font-black text-slate-800">{events_used}<span className="text-slate-400 font-normal text-sm">/{event_cap}</span></p>
        </div>
        <div className="bg-indigo-50 rounded-xl p-3">
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Max Payout</p>
          <p className="text-xl font-black text-indigo-700">₹{(event_cap * payout_per_event).toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
}
