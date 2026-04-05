const days = [
    { day: 'Mon', date: 'Mar 30', income: '₹1,840', risk: 'safe', payout: null, orders: 14 },
    { day: 'Tue', date: 'Mar 31', income: '₹2,210', risk: 'safe', payout: null, orders: 17 },
    { day: 'Wed', date: 'Apr 1', income: '₹1,420', risk: 'medium', payout: '₹820', orders: 11, today: true },
    { day: 'Thu', date: 'Apr 2', income: '₹1,100', risk: 'high', payout: '~₹940', orders: 9, forecast: true },
    { day: 'Fri', date: 'Apr 3', income: '₹1,950', risk: 'medium', payout: null, orders: 15, forecast: true },
    { day: 'Sat', date: 'Apr 4', income: '₹2,600', risk: 'safe', payout: null, orders: 20, forecast: true },
    { day: 'Sun', date: 'Apr 5', income: '₹2,100', risk: 'safe', payout: null, orders: 16, forecast: true },
];

const riskStyle = {
    safe: { chip: 'border-slate-100 bg-slate-50', dot: 'bg-green-500', text: 'text-slate-900', label: 'text-green-600' },
    medium: { chip: 'border-amber-200 bg-amber-50 shadow-sm shadow-amber-100/50', dot: 'bg-amber-500', text: 'text-amber-900', label: 'text-amber-700' },
    high: { chip: 'border-red-200 bg-red-50 shadow-sm shadow-red-100/50', dot: 'bg-red-500', text: 'text-red-900', label: 'text-red-600' },
};

export default function WeeklyForecastStrip() {
    return (
        <div className="flex flex-col">
            {/* Header */}
            <div className="flex items-end justify-between mb-5 pb-2">
                <div>
                    <h2 className="text-2xl font-display font-medium text-slate-900 tracking-tight">Weekly Forecast</h2>
                </div>
            </div>

            {/* Horizontal Strip */}
            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-none items-end min-h-[220px]">
                {days.map((d) => {
                    const s = riskStyle[d.risk];
                    const isToday = d.today;

                    return (
                        <div
                            key={d.day}
                            className={`flex-shrink-0 snap-start flex flex-col justify-between rounded-lg border ${s.chip} transition-transform duration-300 hover:-translate-y-1 relative
                ${isToday ? 'w-[160px] h-[210px] p-6 shadow-md border-blue-200 bg-white ring-1 ring-blue-500/10' : 'w-[130px] h-[180px] p-4 opacity-90 hover:opacity-100'}
              `}
                        >
                            {/* Today Marker */}
                            {isToday && (
                                <div className="absolute -top-3 left-4 bg-blue-600 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full shadow-sm z-10 whitespace-nowrap">
                                    Today
                                </div>
                            )}
                            {/* Forecast Marker */}
                            {d.forecast && (
                                <div className="absolute top-3 right-3 text-slate-400 text-[9px] uppercase tracking-widest font-bold">
                                    FCST
                                </div>
                            )}

                            {/* Day / Date */}
                            <div className="text-left">
                                <p className={`font-semibold uppercase tracking-widest mb-0.5 ${isToday ? 'text-[15px] text-slate-700' : 'text-xs text-slate-500'}`}>{d.day}</p>
                                <p className={`font-medium tracking-wider ${isToday ? 'text-xs text-slate-500' : 'text-[10px] text-slate-400'}`}>{d.date}</p>
                            </div>

                            {/* Central Income Metric */}
                            <div className="text-left mt-auto mb-4">
                                <p className={`font-display font-medium tabular-nums ${s.text} leading-none mb-1 ${isToday ? 'text-3xl' : 'text-xl'}`}>
                                    {d.income}
                                </p>
                                <p className={`${isToday ? 'text-[12px]' : 'text-[10px]'} text-slate-400`}>{d.orders} orders</p>
                            </div>

                            {/* Risk Status */}
                            <div className="flex items-center gap-1.5 mt-auto">
                                <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${s.label}`}>
                                    {d.risk}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
