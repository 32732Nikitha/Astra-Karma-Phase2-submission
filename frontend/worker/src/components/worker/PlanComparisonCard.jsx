import { CheckCircle2, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: '₹49',
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    features: ['₹300/event', '2 events/week', 'Rain only'],
    recommended: false,
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '₹89',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-300',
    features: ['₹600/event', '3 events/week', 'Rain + AQI'],
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹149',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    features: ['₹1200/event', '5 events/week', 'All triggers'],
    recommended: false,
  },
];

export default function PlanComparisonCard({ currentPlan = 'standard' }) {
  const navigate = useNavigate();

  return (
    <div className="card p-5 flex flex-col gap-4 h-full">
      <div className="relative z-10 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Plans</p>
        <button
          onClick={() => navigate('/plans')}
          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider transition-colors"
        >
          Compare All →
        </button>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-2">
        {PLANS.map((plan) => {
          const isActive = plan.id === currentPlan;
          return (
            <div
              key={plan.id}
              className={`relative rounded-xl p-3 border-2 transition-all cursor-pointer ${
                plan.recommended
                  ? 'border-indigo-400 bg-indigo-50 shadow-md shadow-indigo-100'
                  : `border-transparent ${plan.bg} hover:border-slate-200`
              } ${isActive ? 'ring-2 ring-offset-1 ring-indigo-400' : ''}`}
              onClick={() => navigate('/plans')}
            >
              {plan.recommended && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="badge badge-purple text-[9px] px-1.5 py-0.5 flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5" /> Best
                  </span>
                </div>
              )}

              <p className={`text-xs font-black ${plan.color} mb-1`}>{plan.name}</p>
              <p className="text-lg font-black text-slate-800 leading-none">{plan.price}</p>
              <p className="text-[9px] text-slate-400 mb-2">/week</p>

              <div className="space-y-0.5">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-1">
                    <CheckCircle2 className={`w-2.5 h-2.5 flex-shrink-0 ${plan.recommended ? 'text-indigo-500' : 'text-slate-400'}`} />
                    <span className="text-[9px] text-slate-500 leading-tight">{f}</span>
                  </div>
                ))}
              </div>

              {isActive && (
                <div className="mt-2">
                  <span className="badge badge-green text-[9px]">Current</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
