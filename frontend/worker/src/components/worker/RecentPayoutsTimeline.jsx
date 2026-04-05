// src/components/worker/RecentPayoutsTimeline.jsx

const payouts = [
  {
    id: "CLM-001",
    triggerType: "Rain",
    triggerLevel: "L2",
    amount: 450,
    status: "completed",
    date: "Jun 12, 2025",
    time: "3:14 PM",
    icon: "🌧️",
    upiRef: "RZP2024061200123",
  },
  {
    id: "CLM-002",
    triggerType: "AQI",
    triggerLevel: "L1",
    amount: 300,
    status: "completed",
    date: "Jun 10, 2025",
    time: "11:02 AM",
    icon: "😮‍💨",
    upiRef: "RZP2024061000456",
  },
  {
    id: "CLM-003",
    triggerType: "Heat",
    triggerLevel: "L1",
    amount: 300,
    status: "held",
    date: "Jun 8, 2025",
    time: "1:45 PM",
    icon: "🌡️",
    upiRef: null,
  },
];

const statusConfig = {
  completed: { label: "Paid", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-400" },
  held: { label: "Under Review", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  failed: { label: "Failed", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-400" },
};

export default function RecentPayoutsTimeline() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-800">Recent Payouts</h3>
        <button className="text-xs text-indigo-600 font-semibold">View all →</button>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-5 bottom-5 w-px bg-gray-100" />

        <div className="space-y-4">
          {payouts.map((p, idx) => {
            const sc = statusConfig[p.status];
            return (
              <div key={p.id} className="flex gap-3 relative">
                {/* Icon bubble */}
                <div className="w-10 h-10 rounded-full bg-gray-50 border-2 border-white shadow-sm flex items-center justify-center text-lg flex-shrink-0 z-10">
                  {p.icon}
                </div>

                {/* Content card */}
                <div className="flex-1 bg-gray-50 rounded-xl p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-gray-800">{p.triggerType} Disruption</p>
                        <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                          {p.triggerLevel}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{p.date} · {p.time}</p>
                      {p.upiRef && (
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">Ref: {p.upiRef}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-black text-gray-800">₹{p.amount}</p>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                        <span className={`w-1 h-1 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-500">Total Recovered (Jun)</span>
        <span className="text-sm font-black text-indigo-700">₹750</span>
      </div>
    </div>
  );
}