import { AlertTriangle, RefreshCw } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

export default function UpcomingRenewalNudge({ last_active_date }) {
  const expiry = last_active_date ? parseISO(last_active_date) : new Date(Date.now() + 86400000);
  const daysLeft = differenceInDays(expiry, new Date());

  if (daysLeft >= 2) return null;

  const urgent = daysLeft <= 0;

  return (
    <div className={`card p-5 flex flex-col gap-4 h-full border-2 ${urgent ? 'border-red-300' : 'border-amber-200'}`}>
      <div className="relative z-10 flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${urgent ? 'bg-red-100' : 'bg-amber-100'}`}>
          <AlertTriangle className={`w-5 h-5 ${urgent ? 'text-red-600' : 'text-amber-600'}`} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Policy Renewal</p>
          <p className={`text-sm font-black ${urgent ? 'text-red-600' : 'text-amber-700'}`}>
            {urgent ? 'Expired Today!' : `Expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`}
          </p>
        </div>
      </div>

      <p className="relative z-10 text-xs text-slate-500 leading-relaxed">
        {urgent
          ? 'Your BhimaAstra policy has expired. Renew now to restore income protection immediately.'
          : 'Your weekly BhimaAstra policy expires soon. Renew to keep your income protection active.'}
      </p>

      <div className="relative z-10 rounded-xl overflow-hidden">
        <div className={`h-1.5 w-full rounded-full ${urgent ? 'bg-red-100' : 'bg-amber-100'}`}>
          <div
            className={`h-full rounded-full ${urgent ? 'bg-red-500' : 'bg-amber-400'} transition-all`}
            style={{ width: urgent ? '100%' : `${(1 - daysLeft / 7) * 100}%` }}
          />
        </div>
      </div>

      <button
        className={`relative z-10 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-white transition-all ${
          urgent
            ? 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-lg shadow-red-200'
            : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-200'
        }`}
      >
        <RefreshCw className="w-4 h-4" />
        Renew Now — ₹49/week
      </button>
    </div>
  );
}
