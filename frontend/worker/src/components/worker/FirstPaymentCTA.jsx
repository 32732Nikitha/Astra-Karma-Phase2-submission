import { useState } from 'react';
import { Smartphone, Lock, CheckCircle2, Loader2 } from 'lucide-react';

export default function FirstPaymentCTA({ weeklyPremium = 89, planName = 'Standard' }) {
  const [state, setState] = useState('idle'); // idle | loading | success

  const handlePay = () => {
    setState('loading');
    setTimeout(() => setState('success'), 2000);
  };

  if (state === 'success') {
    return (
      <div className="card p-6 flex flex-col items-center justify-center gap-4 h-full text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center animate-scale-in">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <div className="relative z-10">
          <p className="text-lg font-black text-slate-800">Payment Successful!</p>
          <p className="text-xs text-slate-500 mt-1">Your BhimaAstra policy is now active</p>
        </div>
        <span className="badge badge-green relative z-10">Policy Activated</span>
      </div>
    );
  }

  return (
    <div className="card p-5 flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Activate Protection</p>
          <p className="text-lg font-black text-slate-800 mt-0.5">{planName} Plan</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-indigo-600">₹{weeklyPremium}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">/week</p>
        </div>
      </div>

      {/* Features */}
      <div className="relative z-10 bg-slate-50 rounded-xl p-3 space-y-1.5">
        {['Up to ₹600 per weather event', '3 covered events per week', 'Instant UPI payout'].map((f) => (
          <div key={f} className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span className="text-xs text-slate-600">{f}</span>
          </div>
        ))}
      </div>

      {/* UPI Button */}
      <button
        onClick={handlePay}
        disabled={state === 'loading'}
        className="relative z-10 flex items-center justify-center gap-3 w-full py-4 rounded-xl font-black text-white text-sm gradient-indigo shadow-lg shadow-indigo-200 hover:opacity-90 active:scale-98 transition-all disabled:opacity-70"
      >
        {state === 'loading' ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
        ) : (
          <><Smartphone className="w-4 h-4" /> Pay via Razorpay UPI</>
        )}
      </button>

      {/* Security note */}
      <div className="relative z-10 flex items-center justify-center gap-1.5">
        <Lock className="w-3 h-3 text-slate-400" />
        <p className="text-[10px] text-slate-400">Secured by Razorpay · 256-bit encryption</p>
      </div>
    </div>
  );
}
