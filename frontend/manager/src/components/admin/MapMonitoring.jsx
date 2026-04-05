import React from "react";
import { mockWorkerLocations, mockRiskZones } from "../../data/mockData";

export default function MapMonitoring() {
  return (
    <div className="animate-fade-up space-y-4">
      <div className="card p-0 h-[500px] relative overflow-hidden bg-slate-900 shadow-2xl border-indigo-500/20">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(#6366f1 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
        
        {/* Map Header Overlay */}
        <div className="absolute top-4 left-4 z-20">
          <div className="card-glass p-4 border-white/20">
            <h3 className="section-title text-sm text-indigo-900 mb-1">Live Intelligence Map</h3>
            <p className="text-[10px] text-slate-500 font-600">HYDERABAD COMMAND CENTER</p>
          </div>
        </div>

        {/* Mock Map Entities */}
        <div className="absolute inset-0 flex items-center justify-center">
            {/* Risk Zone 1 */}
            <div className="absolute top-1/4 left-1/3 w-40 h-40 bg-rose-500/10 border-2 border-rose-500/40 rounded-full animate-pulse-slow flex items-center justify-center">
                <span className="badge badge-red scale-75">Curfew Zone</span>
            </div>

            {/* Workers */}
            {mockWorkerLocations.map((w, idx) => (
                <div key={w.id} className="absolute transition-all duration-1000" style={{ top: `${20 + idx * 15}%`, left: `${30 + idx * 10}%` }}>
                    <div className={`w-3 h-3 rounded-full ${w.status === 'In Risk Zone' ? 'bg-rose-500 animate-ping-slow' : 'bg-teal-400'} border-2 border-white shadow-lg`} />
                    <div className="card-glass mt-2 px-2 py-1 text-[9px] font-800 text-slate-700 whitespace-nowrap">
                        {w.name.split(' ')[0]}
                    </div>
                </div>
            ))}
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 right-4 z-20 flex gap-2">
            <div className="card-glass px-3 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-[10px] font-700 text-slate-600 uppercase">At Risk</span>
            </div>
            <div className="card-glass px-3 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-400" />
                <span className="text-[10px] font-700 text-slate-600 uppercase">Safe</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
            <div className="stat-number text-rose-500 text-xl">{mockRiskZones.length}</div>
            <div className="text-[10px] font-700 text-slate-400 uppercase tracking-tighter">Active Threats</div>
        </div>
        <div className="card p-4 text-center">
            <div className="stat-number text-indigo-500 text-xl">42</div>
            <div className="text-[10px] font-700 text-slate-400 uppercase tracking-tighter">Fleet Online</div>
        </div>
        <div className="card p-4 text-center">
            <div className="stat-number text-teal-500 text-xl">98%</div>
            <div className="text-[10px] font-700 text-slate-400 uppercase tracking-tighter">GPS Accuracy</div>
        </div>
      </div>
    </div>
  );
}