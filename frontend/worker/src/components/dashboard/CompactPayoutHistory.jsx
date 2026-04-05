const payouts = [
    { id: 1, date: 'Apr 1', reason: 'Rain payout', amount: '+₹820', status: 'credited', icon: '🌧', trigger: 'Rainfall > 40mm' },
    { id: 2, date: 'Mar 31', reason: 'Traffic disruption', amount: '+₹340', status: 'credited', icon: '🚦', trigger: 'Delay > 45 min' },
    { id: 3, date: 'Mar 28', reason: 'AQI health break', amount: '+₹180', status: 'credited', icon: '💨', trigger: 'AQI > 150 · 2 hrs' },
    { id: 4, date: 'Mar 25', reason: 'Heat strike', amount: '+₹550', status: 'credited', icon: '🌡', trigger: 'Temp > 40°C · 3 hrs' },
    { id: 6, date: 'Mar 17', reason: 'Claim under review', amount: '₹480', status: 'pending', icon: '⏳', trigger: 'Verification in progress' },
];

export default function CompactPayoutHistory() {
    return (
        <div className="flex flex-col">
            <div className="flex items-end justify-between mb-8 pb-4 border-b border-slate-100">
                <div>
                    <h2 className="text-2xl font-display font-medium text-slate-900 tracking-tight">Recent Payouts</h2>
                </div>
                <div className="text-right pb-1">
                    <p className="text-xl font-display font-medium text-green-600 leading-none mb-1">₹2,710</p>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">This Month</p>
                </div>
            </div>

            <div className="flex flex-col w-full divide-y divide-slate-100/60">
                {payouts.map((p) => (
                    <div key={p.id} className="group flex flex-col sm:flex-row sm:items-center justify-between py-4 sm:py-5 px-2 hover:bg-slate-50 transition-colors rounded-lg gap-3 sm:gap-6">

                        <div className="flex items-center gap-4 flex-1">
                            <span className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity w-8 text-center">{p.icon}</span>
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <p className="text-sm font-semibold text-slate-800 tracking-wide">{p.reason}</p>
                                    {p.status === 'pending' && (
                                        <span className="text-[9px] font-bold uppercase tracking-widest bg-amber-100 text-amber-700 px-2 py-0.5 rounded-sm">
                                            Pending
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-slate-400">{p.trigger}</p>
                                    <span className="text-[10px] text-slate-300">•</span>
                                    <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{p.date}</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-left sm:text-right pl-12 sm:pl-0">
                            <p className={`text-base font-bold tabular-nums tracking-tight ${p.status === 'credited' ? 'text-green-600' : 'text-slate-500'}`}>
                                {p.amount}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center">
                <button className="text-[13px] font-semibold text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg px-6 py-2 transition-all hover:bg-slate-50 flex items-center gap-2 mx-auto">
                    Open Full Statement
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
