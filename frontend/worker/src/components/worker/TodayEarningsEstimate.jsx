// src/components/worker/TodayEarningsEstimate.jsx

const earningsData = {
  predicted: 820,
  baseline: 950,
  actual: 610,
  orders: 14,
  shift: "10:00 AM – 8:00 PM",
  riskAdjustedFloor: 450,
  disrupted: true,
  incomeAtRisk: 340,
  platform: "Blinkit",
};

export default function TodayEarningsEstimate() {
  const { predicted, baseline, actual, orders, shift, riskAdjustedFloor, disrupted, incomeAtRisk, platform } = earningsData;

  const pct = Math.round((actual / predicted) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 w-full">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-bold text-gray-800">Today's Earnings</h3>
        <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-full">{platform}</span>
      </div>
      <p className="text-xs text-gray-400 mb-4">{shift}</p>

      {/* Main number */}
      <div className="flex items-end gap-3 mb-4">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Actual So Far</p>
          <p className="text-4xl font-black text-gray-900">₹{actual}</p>
        </div>
        <div className="mb-1.5 text-right">
          <p className="text-[10px] text-gray-400">AI Predicted</p>
          <p className="text-lg font-bold text-indigo-600">₹{predicted}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          <span>Progress toward predicted income</span>
          <span className="font-bold text-gray-600">{pct}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "Orders", val: orders },
          { label: "Baseline", val: `₹${baseline}` },
          { label: "Floor", val: `₹${riskAdjustedFloor}` },
        ].map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-xl p-2.5 text-center">
            <p className="text-sm font-bold text-gray-700">{s.val}</p>
            <p className="text-[10px] text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Risk alert */}
      {disrupted && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex gap-3 items-start">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div>
            <p className="text-xs font-bold text-amber-800">Disruption Detected</p>
            <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
              ₹{incomeAtRisk} income at risk today. If payout triggers, your policy covers the shortfall.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}