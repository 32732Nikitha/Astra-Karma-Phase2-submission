import { Target } from 'lucide-react';

export default function PastAccuracyBadge({ accuracy = 91, totalPredictions = 48, correct = 44 }) {
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl gradient-teal flex items-center justify-center flex-shrink-0 shadow-md">
        <Target className="w-6 h-6 text-white" />
      </div>
      <div className="relative z-10 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Model Accuracy</p>
          <span className="badge badge-green">{accuracy}%</span>
        </div>
        <p className="text-sm text-slate-500">{correct} of {totalPredictions} forecasts matched actual outcomes</p>
      </div>
    </div>
  );
}
