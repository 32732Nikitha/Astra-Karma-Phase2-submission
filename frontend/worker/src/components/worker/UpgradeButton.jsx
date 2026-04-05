import { ArrowRight, Zap } from 'lucide-react';

export default function UpgradeButton({ fromPlan = 'Basic', toPlan = 'Standard', price = '₹89', onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-black text-sm text-white gradient-indigo shadow-lg shadow-indigo-200 hover:opacity-90 active:scale-98 transition-all"
    >
      <Zap className="w-4 h-4" />
      Upgrade to {toPlan} — {price}/week
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}
