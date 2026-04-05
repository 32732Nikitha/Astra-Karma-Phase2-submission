import { ShieldCheck, Download, CalendarRange, Zap } from 'lucide-react';

const MOCK = {
  policy_number: 'BGS-2026-00412',
  plan_name: 'Standard',
  activation_date: '01 Apr 2026',
  expiry_date: '07 Apr 2026',
  event_cap: 3,
  payout_per_event: 600,
  triggers: ['Rainfall > 25mm', 'AQI > 200', 'Heat Index > 42°C'],
};

export default function PolicyActivatedScreen({ data = MOCK }) {
  const {
    policy_number,
    plan_name,
    activation_date,
    expiry_date,
    event_cap,
    payout_per_event,
    triggers,
  } = data;

  return (
    <div className="card p-5 flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl gradient-emerald flex items-center justify-center shadow-md flex-shrink-0">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Active Policy</p>
          <p className="font-black text-slate-800 font-mono text-sm">{policy_number}</p>
        </div>
        <div className="ml-auto">
          <span className="badge badge-green">Active</span>
        </div>
      </div>

      <div className="divider" />

      {/* Coverage dates */}
      <div className="relative z-10 flex items-start gap-2">
        <CalendarRange className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1 flex justify-between text-xs">
          <div>
            <p className="text-slate-400 font-semibold">Activation</p>
            <p className="text-slate-800 font-bold">{activation_date}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 font-semibold">Expires</p>
            <p className="text-slate-800 font-bold">{expiry_date}</p>
          </div>
        </div>
      </div>

      {/* Event cap */}
      <div className="relative z-10 grid grid-cols-2 gap-2">
        <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
          <Zap className="w-4 h-4 text-indigo-500 mb-1" />
          <p className="text-xl font-black text-indigo-700">{event_cap}</p>
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Event Cap</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
          <span className="text-lg">₹</span>
          <p className="text-xl font-black text-emerald-700">{payout_per_event}</p>
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Per Event</p>
        </div>
      </div>

      {/* Triggers */}
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Covered Triggers</p>
        <div className="flex flex-wrap gap-1.5">
          {triggers.map((t) => (
            <span key={t} className="badge badge-blue text-[10px]">{t}</span>
          ))}
        </div>
      </div>

      {/* Download */}
      <button className="relative z-10 mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors">
        <Download className="w-3.5 h-3.5" /> Download Policy PDF
      </button>
    </div>
  );
}
