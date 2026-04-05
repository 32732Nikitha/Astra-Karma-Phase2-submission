import { Sparkles } from 'lucide-react';

export default function AIRecommendBadge({ planName = 'Standard', reason = 'Best fit for 3–5 shift days/week in your zone' }) {
  return (
    <div className="card p-4 flex items-start gap-3 bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-200">
      <div className="w-10 h-10 rounded-xl gradient-indigo flex items-center justify-center flex-shrink-0 shadow-md">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-black text-slate-800">AI Recommends: {planName}</p>
          <span className="badge badge-purple text-[9px]">AI Pick</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{reason}</p>
      </div>
    </div>
  );
}
