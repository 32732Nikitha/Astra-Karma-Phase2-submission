const features = [
    { label: 'Weather payouts', current: '3 events/mo', pro: 'Unlimited', highlight: true },
    { label: 'AQI protection', current: '—', pro: 'Included', highlight: true },
    { label: 'Heat strike coverage', current: '—', pro: 'Included', highlight: true },
    { label: 'AI forecast', current: 'Basic', pro: '7-day Advanced', highlight: false },
];

export default function AIRecommendationCard() {
    return (
        <div className="relative pl-6 py-4">
            {/* Soft left accent line instead of a box */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600/30 rounded-full" />

            <div className="mb-6">
                <div className="inline-flex items-center gap-2 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-[pulse_3s_ease-in-out_infinite]" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-blue-600">Upgrade Path Suggested</span>
                </div>

                <h3 className="text-xl font-display font-medium text-slate-900 tracking-tight leading-snug mb-2">
                    Unlock Shield Pro
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                    Current conditions match your upgrade trigger. You've missed <strong className="text-slate-800 font-medium">₹960</strong> in AQI payouts this month natively covered by Pro.
                </p>
            </div>

            <div className="mb-6">
                <div className="grid grid-cols-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">
                    <span>Feature</span>
                    <span className="text-left">Current</span>
                    <span className="text-left text-blue-600">Pro</span>
                </div>

                <div className="space-y-3">
                    {features.map((f) => (
                        <div key={f.label} className="grid grid-cols-3 items-start text-xs">
                            <span className={`font-medium pr-2 ${f.highlight ? 'text-slate-800' : 'text-slate-500'}`}>
                                {f.label}
                            </span>
                            <span className="text-left text-slate-400">{f.current}</span>
                            <span className={`text-left font-bold ${f.highlight ? 'text-blue-600' : 'text-slate-600'}`}>
                                {f.pro}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <button className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-0.5 transition-all text-sm font-medium px-6 py-2.5 rounded-full shadow-lg shadow-slate-900/20">
                    Upgrade for ₹299/mo
                </button>
                <button className="text-[13px] font-medium text-slate-400 hover:text-slate-600 transition-colors">
                    Dismiss for now
                </button>
            </div>
        </div>
    );
}
