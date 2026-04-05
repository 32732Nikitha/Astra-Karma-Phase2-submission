import { ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UpgradePlanNudge({ currentPlan = 'Basic', nextPlan = 'Standard', benefit = 'Get AQI coverage + 1 extra event/week' }) {
  const navigate = useNavigate();

  return (
    <div className="card p-5 gradient-indigo text-white overflow-hidden">
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-white/70 font-bold uppercase tracking-wider mb-0.5">Upgrade Nudge</p>
            <h3 className="font-black text-white">{currentPlan} → {nextPlan}</h3>
            <p className="text-xs text-white/70 mt-1 leading-relaxed">{benefit}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/plans')}
          className="flex-shrink-0 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all whitespace-nowrap border border-white/20"
        >
          Upgrade <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full" />
    </div>
  );
}
