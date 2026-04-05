// src/components/worker/PolicyStatusBanner.jsx

const policy = {
  status: "active",
  policyId: "GSP-2024-00892",
  planTier: "Standard",
  daysRemaining: 4,
  eventsUsed: 1,
  eventsTotal: 2,
  coverageAmount: "₹600",
  renewalDate: "Jun 17, 2025",
};

const tierColors = {
  Basic: "from-slate-400 to-slate-600",
  Standard: "from-indigo-500 to-violet-600",
  Premium: "from-amber-400 to-orange-500",
};

const statusConfig = {
  active: { label: "Active", dot: "bg-green-400", text: "text-green-700", bg: "bg-green-50" },
  expired: { label: "Expired", dot: "bg-red-400", text: "text-red-700", bg: "bg-red-50" },
  pending: { label: "Payment Pending", dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50" },
};

export default function PolicyStatusBanner() {
  const { status, policyId, planTier, daysRemaining, eventsUsed, eventsTotal, coverageAmount, renewalDate } = policy;
  const sc = statusConfig[status];
  const gradient = tierColors[planTier] || tierColors.Standard;

  return (
    <div className={`bg-gradient-to-r ${gradient} rounded-2xl p-5 text-white shadow-lg w-full`}>
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${sc.bg} mb-2`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            <span className={`text-[10px] font-bold ${sc.text}`}>{sc.label}</span>
          </div>
          <h2 className="text-white font-bold text-lg">{planTier} Plan</h2>
          <p className="text-white/60 text-xs">{policyId}</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
          <p className="text-2xl font-black text-white leading-none">{daysRemaining}</p>
          <p className="text-white/70 text-[10px]">days left</p>
        </div>
      </div>

      {/* Event usage */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-white/70 mb-1.5">
          <span>Events Used</span>
          <span className="font-semibold text-white">{eventsUsed} / {eventsTotal}</span>
        </div>
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${(eventsUsed / eventsTotal) * 100}%` }}
          />
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/60 text-[10px]">Max Coverage</p>
          <p className="text-white font-bold">{coverageAmount} / event</p>
        </div>
        <div className="text-right">
          <p className="text-white/60 text-[10px]">Renews</p>
          <p className="text-white font-bold text-sm">{renewalDate}</p>
        </div>
      </div>
    </div>
  );
}