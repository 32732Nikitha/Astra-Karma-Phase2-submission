export default function ConfidenceIndicator({ confidence = 87, label = 'Prediction Confidence' }) {
  const color = confidence >= 80 ? 'from-emerald-400 to-teal-400' : confidence >= 60 ? 'from-amber-400 to-orange-400' : 'from-red-400 to-rose-400';
  const textColor = confidence >= 80 ? 'text-emerald-600' : confidence >= 60 ? 'text-amber-600' : 'text-red-500';
  const badge = confidence >= 80 ? 'badge-green' : confidence >= 60 ? 'badge-yellow' : 'badge-red';
  const badgeLabel = confidence >= 80 ? 'High' : confidence >= 60 ? 'Medium' : 'Low';

  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="relative z-10 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
        <span className={`badge ${badge}`}>{badgeLabel}</span>
      </div>
      <div className="relative z-10 flex items-center gap-3">
        <p className={`text-3xl font-black ${textColor}`}>{confidence}%</p>
        <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
      <p className="relative z-10 text-xs text-slate-400">Based on 30-day historical weather model + IMD data</p>
    </div>
  );
}
