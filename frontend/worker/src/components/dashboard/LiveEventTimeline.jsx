const events = [
    {
        id: 1,
        time: '8:41 PM',
        type: 'payout',
        title: 'Auto-payout triggered',
        detail: '₹820 deposited — rain threshold crossed',
        icon: '💸',
        color: 'text-green-600 bg-green-50 border-green-200',
        dot: 'bg-green-500',
    },
    {
        id: 2,
        time: '6:15 PM',
        type: 'alert',
        title: 'High AQI alert issued',
        detail: 'AQI crossed 150 in Whitefield zone',
        icon: '⚠️',
        color: 'text-amber-600 bg-amber-50 border-amber-200',
        dot: 'bg-amber-500',
    },
    {
        id: 3,
        time: '3:02 PM',
        type: 'system',
        title: 'Shield renewed',
        detail: 'Monthly protection plan auto-renewed',
        icon: '🔄',
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        dot: 'bg-blue-500',
    },
    {
        id: 4,
        time: '12:30 PM',
        type: 'payout',
        title: 'Traffic payout: ₹340',
        detail: 'Congestion on ORR delayed 3 orders',
        icon: '🚦',
        color: 'text-green-600 bg-green-50 border-green-200',
        dot: 'bg-green-500',
    },
    {
        id: 5,
        time: '9:10 AM',
        type: 'insight',
        title: 'Morning surge captured',
        detail: 'You earned ₹2,140 in first 2 hours',
        icon: '📈',
        color: 'text-purple-600 bg-purple-50 border-purple-200',
        dot: 'bg-purple-500',
    },
    {
        id: 6,
        time: '7:00 AM',
        type: 'system',
        title: 'Day started — monitoring active',
        detail: 'AI Shield began tracking your session',
        icon: '🛡',
        color: 'text-slate-600 bg-slate-50 border-slate-200',
        dot: 'bg-slate-500',
    },
];

export default function LiveEventTimeline() {
    return (
        <div className="flex flex-col">
            {/* Header */}
            <div className="flex items-end justify-between mb-8 pb-4 border-b border-slate-100">
                <div>
                    <h2 className="text-2xl font-display font-medium text-slate-900 tracking-tight">Today's Activity</h2>
                    <p className="text-[13px] text-slate-500 mt-1">Live event timeline</p>
                </div>
            </div>

            {/* Timeline */}
            <div className="relative pt-2">
                {/* Continuous thin vertical line aligned slightly closer to icons */}
                <div className="absolute left-[34px] top-6 bottom-4 w-[2px] bg-slate-100" />

                <div className="space-y-10 relative">  {/* Increased uneven spacing scale */}
                    {events.map((ev, i) => (
                        <div key={ev.id} className="flex gap-5 sm:gap-6 items-start group">
                            {/* Event specific visual */}
                            <div className="relative">
                                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border ${ev.color} flex items-center justify-center text-xl sm:text-2xl z-10 relative bg-white shadow-sm transition-transform group-hover:scale-105 duration-300`}>
                                    {ev.icon}
                                </div>
                            </div>

                            {/* Content with uneven margins per node via group structure */}
                            <div className={`flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start justify-between gap-2 mt-1 ${i % 2 === 0 ? 'pb-2' : ''}`}>
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900 mb-0.5 tracking-wide">{ev.title}</h3>
                                    <p className="text-[13px] sm:text-sm text-slate-500 font-normal leading-relaxed">{ev.detail}</p>
                                </div>

                                {/* Right Aligned Timestamp */}
                                <div className="flex items-center sm:items-start gap-1.5 flex-shrink-0 text-right mt-1 sm:mt-0">
                                    <span className={`w-1.5 h-1.5 rounded-full mt-[5px] hidden sm:block ${ev.dot}`} />
                                    <span className="text-[11px] font-bold text-slate-400 tracking-wider">
                                        {ev.time}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-10 mb-2">
                <button className="text-[12px] font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest pl-[5.5rem] flex items-center gap-1">
                    Load Previous Days
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
