const insights = [
    { id: 1, type: 'warning', time: '2m', title: 'Earnings dip detected', body: 'Rate dropped 22% vs last Tue. Rain cancellations likely.', icon: '📉' },
    { id: 2, type: 'info', time: '18m', title: 'Surge zone identified', body: 'Koramangala 1.9x surge. Head there to recover ₹420.', icon: '📍' },
    { id: 3, type: 'success', time: '1h', title: 'Protection threshold cleared', body: 'Passed ₹1,200 min. Income fully shielded today.', icon: '✅' },
];

const dotColor = {
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
    success: 'bg-green-500',
};

export default function AIMonitoringPanel() {
    return (
        <div className="flex flex-col h-full rounded-lg bg-slate-50/50 p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h2 className="text-xl font-display font-medium text-slate-900 tracking-tight">Live Monitoring</h2>
                    <div className="flex items-center gap-1.5 mt-1.5">
                        <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <p className="text-[11px] font-semibold tracking-widest text-blue-600 uppercase">ShieldAI Engine Active</p>
                    </div>
                </div>
            </div>

            {/* Insights list - soft separation, no harsh lines */}
            <div className="space-y-6 flex-1">
                {insights.map((ins) => (
                    <div key={ins.id} className="group relative pl-4">
                        {/* Soft vertical marker */}
                        <div className={`absolute left-0 top-1 bottom-1 w-[3px] rounded bg-slate-200 transition-colors ${dotColor[ins.type].replace('bg-', 'group-hover:bg-')}`} />

                        <div className="flex gap-3">
                            <span className="text-xl leading-none mt-0.5 opacity-80">{ins.icon}</span>
                            <div className="min-w-0 pr-4">
                                <div className="flex items-baseline justify-between gap-2 mb-1">
                                    <p className="text-sm font-semibold text-slate-800 tracking-wide">{ins.title}</p>
                                    <span className="text-[10px] font-bold text-slate-400">{ins.time}</span>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed font-normal">{ins.body}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200/60">
                <button className="text-[13px] font-medium text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1">
                    View 5 older insights
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
