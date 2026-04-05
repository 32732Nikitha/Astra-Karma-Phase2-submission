const riskFactors = [
    { label: 'Rain', icon: '🌧', value: 72, unit: '%', detail: 'Heavy showers by 3 PM', level: 'high' },
    { label: 'AQI', icon: '💨', value: 148, unit: ' AQI', detail: 'Unhealthy for sensitive groups', level: 'medium' },
    { label: 'Traffic', icon: '🚦', value: 58, unit: '%', detail: 'Moderate congestion on NH-48', level: 'medium' },
    { label: 'Heat', icon: '🌡', value: 38, unit: '°C', detail: 'Peak heat 1–4 PM', level: 'high' },
];

const barColor = {
    safe: { track: 'bg-green-500', text: 'text-green-600', badge: 'text-green-700 bg-green-50' },
    medium: { track: 'bg-amber-500', text: 'text-amber-600', badge: 'text-amber-700 bg-amber-50' },
    high: { track: 'bg-red-500', text: 'text-red-600', badge: 'text-red-700 bg-red-50' },
};

function normalizeValue(factor) {
    if (factor.label === 'AQI') return Math.min((factor.value / 300) * 100, 100);
    if (factor.label === 'Heat') return Math.min(((factor.value - 20) / 25) * 100, 100);
    return factor.value;
}

export default function RiskRadar() {
    return (
        <div className="flex flex-col">
            {/* Header */}
            <div className="flex items-end justify-between mb-8 pb-4 border-b border-slate-100">
                <div>
                    <h2 className="text-2xl font-display font-medium text-slate-900 tracking-tight">Risk Radar</h2>
                    <p className="text-[13px] text-slate-500 mt-1">Live environmental metrics</p>
                </div>
                <div className="flex items-center gap-1.5 pb-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-[pulse_2s_ease-in-out_infinite]" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Live</span>
                </div>
            </div>

            {/* Factors List */}
            <div className="space-y-6 flex-1">
                {riskFactors.map((f) => {
                    const c = barColor[f.level];
                    const pct = normalizeValue(f);
                    return (
                        <div key={f.label} className="group">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl leading-none text-slate-700">{f.icon}</span>
                                    <p className="text-base font-medium text-slate-700">{f.label}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                        {f.level}
                                    </span>
                                    <span className={`text-base font-bold tabular-nums ${c.text}`}>
                                        {f.value}{f.unit}
                                    </span>
                                </div>
                            </div>

                            {/* Thicker horizontal bars for product-specific look */}
                            <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
                                <div
                                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ${c.track}`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-[12px] text-slate-400 transition-colors group-hover:text-slate-600">
                                    {f.detail}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
