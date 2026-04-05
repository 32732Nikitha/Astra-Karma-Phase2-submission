import { Eye, Zap, IndianRupee, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    icon: Eye,
    step: '01',
    title: 'Watch',
    desc: 'Our AI monitors rainfall, AQI & heat in your zone 24/7',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: Zap,
    step: '02',
    title: 'Trigger',
    desc: 'If conditions cross your threshold, a payout is auto-triggered',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
  },
  {
    icon: IndianRupee,
    step: '03',
    title: 'Pay',
    desc: 'Money lands in your UPI account within minutes. No claims needed.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
];

export default function HowItWorksSlide() {
  return (
    <div className="card p-5 flex flex-col gap-5 h-full">
      <div className="relative z-10 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">How BhimaAstra Works</p>
        <span className="badge badge-purple">3 Steps</span>
      </div>

      <div className="relative z-10 flex flex-col gap-3">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.step} className="flex items-start gap-3">
              {/* Step icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${s.bg} ${s.border}`}>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[9px] font-black tracking-widest ${s.color}`}>{s.step}</span>
                  <p className="text-sm font-bold text-slate-800">{s.title}</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>

              {/* Arrow between steps */}
              {i < STEPS.length - 1 && (
                <div className="hidden" />
              )}
            </div>
          );
        })}
      </div>

      {/* Flow connector */}
      <div className="relative z-10 flex items-center gap-1 px-1">
        {STEPS.map((s, i) => (
          <div key={s.step} className="flex items-center gap-1 flex-1">
            <span className={`text-[10px] font-black ${s.color}`}>{s.title}</span>
            {i < STEPS.length - 1 && <ArrowRight className="w-3 h-3 text-slate-300 flex-shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
}
