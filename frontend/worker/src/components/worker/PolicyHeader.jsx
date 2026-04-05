import { ShieldCheck, Calendar, Hash } from 'lucide-react';

const STATUS_CFG = {
  active:  { badge: 'badge-green',  label: 'Active' },
  expired: { badge: 'badge-red',    label: 'Expired' },
  pending: { badge: 'badge-yellow', label: 'Pending' },
};

export default function PolicyHeader({ policy = {} }) {
  const {
    policy_number = 'BGS-2026-00412',
    plan_name = 'Standard',
    activation_date = '01 Apr 2026',
    expiry_date = '07 Apr 2026',
    policy_status = 'active',
  } = policy;

  const sc = STATUS_CFG[policy_status] || STATUS_CFG.active;

  return (
    <div className="card gradient-indigo p-6 text-white overflow-hidden">
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`badge ${sc.badge}`}>{sc.label}</span>
              <span className="text-white/60 text-xs font-bold">{plan_name} Plan</span>
            </div>
            <h2 className="text-2xl font-black text-white leading-tight">GigShield Policy</h2>
            <p className="text-white/60 text-xs font-mono mt-0.5">{policy_number}</p>
          </div>
        </div>
        <div className="flex gap-6 sm:gap-8">
          <div>
            <div className="flex items-center gap-1 text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">
              <Calendar className="w-3 h-3" /> Activated
            </div>
            <p className="text-white font-bold text-sm">{activation_date}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">
              <Calendar className="w-3 h-3" /> Expires
            </div>
            <p className="text-white font-bold text-sm">{expiry_date}</p>
          </div>
        </div>
      </div>
      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full" />
      <div className="absolute -right-2 -bottom-12 w-24 h-24 bg-white/5 rounded-full" />
    </div>
  );
}
