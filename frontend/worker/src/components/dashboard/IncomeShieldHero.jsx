export default function IncomeShieldHero() {
    const protectedPct = 89.9;

    return (
        <div className="relative pt-6 lg:pt-10">
            {/* Floating AI Status - Truly floating absolute element */}
            <div className="absolute -top-2 right-4 lg:-top-4 lg:right-8 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] z-10 rotate-1 hover:rotate-0 transition-transform cursor-default">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[11px] font-bold tracking-widest text-slate-600 uppercase">AI Active</span>
            </div>

            {/* Main Left Aligned Content */}
            <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-3">
                    <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Your Income Shield</p>
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        April Cycle
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-10">
                    <div>
                        <h1 className="text-5xl sm:text-6xl font-display font-bold text-slate-900 tracking-tight leading-none mb-1">
                            ₹38,200
                        </h1>
                        <p className="text-sm font-medium text-slate-500">Protected Floor</p>
                    </div>
                    <div className="pb-1">
                        <p className="text-2xl sm:text-3xl font-display font-medium text-slate-300 leading-none mb-1">
                            / ₹42,500
                        </p>
                        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">Expected</p>
                    </div>
                </div>

                {/* Unique Signature Element */}
                <div className="mb-6 inline-flex flex-col">
                    <p className="text-sm font-medium text-blue-600 mb-1 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        AI watching your zone...
                    </p>
                </div>

                {/* Segmented Progress Meter */}
                <div className="mb-8 max-w-lg">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
                        <span>0%</span>
                        <span>Safe</span>
                        <span>Warn</span>
                        <span>Risk</span>
                        <span>100%</span>
                    </div>

                    <div className="relative h-2 bg-slate-100 rounded-full flex overflow-hidden">
                        {/* Markers */}
                        <div className="absolute left-[33%] top-0 bottom-0 w-[2px] bg-white z-10" />
                        <div className="absolute left-[66%] top-0 bottom-0 w-[2px] bg-white z-10" />

                        {/* Fill */}
                        <div
                            className="absolute top-0 left-0 h-full rounded-l-full bg-amber-500 transition-all duration-1000 ease-out"
                            style={{ width: `${protectedPct}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-between mt-3">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span className="text-[11px] font-bold uppercase tracking-widest">Medium Risk Zone</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{protectedPct}% Covered</span>
                    </div>
                </div>
            </div>

            {/* Inline AI Insight Strip (Not a standard card) */}
            <div className="mt-8 sm:mt-10 flex items-start gap-4 bg-blue-50/50 rounded-lg px-5 py-4 border-l-2 border-blue-400 max-w-3xl">
                <span className="text-xl leading-none pt-0.5">✨</span>
                <div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                        <span className="font-semibold text-slate-900">Shield Insight:</span> AQI is elevated in your zone and rain is forecast for Thursday. Your earnings may dip <strong className="text-blue-700">18–24%</strong> this week. Consider accepting longer-route orders before 10 AM.
                    </p>
                </div>
            </div>
        </div>
    );
}
