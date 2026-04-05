import { CheckCircle2, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PlanCard({ plan, isRecommended, isCurrent, onSelect }) {
  const { id, name, price, period = 'week', features = [], tagline } = plan;

  return (
    <div className={`card p-6 flex flex-col gap-4 h-full relative ${
      isRecommended ? 'border-2 border-indigo-400 shadow-xl shadow-indigo-100' : 'border border-slate-200'
    } ${isCurrent ? 'ring-2 ring-offset-2 ring-indigo-400' : ''}`}>
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="badge badge-purple flex items-center gap-1 shadow-md">
            <Star className="w-3 h-3" /> Recommended
          </span>
        </div>
      )}

      <div className="relative z-10">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{name}</p>
        <div className="flex items-end gap-1">
          <span className="text-4xl font-black text-slate-800">{price}</span>
          <span className="text-xs font-bold text-slate-400 mb-1.5">/{period}</span>
        </div>
        {tagline && <p className="text-xs text-slate-500 mt-1">{tagline}</p>}
      </div>

      <div className="divider" />

      <ul className="relative z-10 space-y-2 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
            <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isRecommended ? 'text-indigo-500' : 'text-emerald-500'}`} />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect?.(id)}
        className={`relative z-10 w-full py-3 rounded-xl font-bold text-sm transition-all ${
          isCurrent
            ? 'bg-slate-100 text-slate-500 cursor-default'
            : isRecommended
              ? 'gradient-indigo text-white shadow-lg shadow-indigo-200 hover:opacity-90'
              : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
      >
        {isCurrent ? '✓ Current Plan' : `Upgrade to ${name}`}
      </button>
    </div>
  );
}
