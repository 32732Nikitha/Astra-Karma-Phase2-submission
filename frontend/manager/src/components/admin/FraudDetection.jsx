import React, { useState } from "react";
import { mockPayouts } from "../../data/mockData";

export default function FraudDetection() {
  return (
    <div className="animate-fade-up">
      <div className="mb-6">
        <h2 className="section-title">Claim Verification</h2>
        <p className="text-slate-400 text-sm">Validating risk compensation via GPS Match & Payout Proof</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 stagger-children">
        {mockPayouts.map(pay => (
          <div key={pay.id} className="card p-0 glow-indigo flex flex-col md:flex-row overflow-hidden group">
            {/* Visual Proof */}
            <div className="w-full md:w-48 h-48 md:h-auto relative overflow-hidden bg-slate-200">
              <img src={pay.proofImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Proof" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <span className="text-white font-jetbrains text-xs">GPS: {pay.gpsCoordinates.lat.toFixed(2)}</span>
              </div>
            </div>

            {/* Claim Content */}
            <div className="flex-1 p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-800 text-slate-800 text-lg">{pay.workerName}</h4>
                  <p className="text-xs text-slate-400 font-500 uppercase tracking-widest">{pay.deliveryLocation}</p>
                </div>
                <div className="text-right">
                  <div className="stat-number !text-2xl text-teal-600">₹{pay.amount}</div>
                  <span className={`badge ${pay.fraudScore > 50 ? 'badge-red' : 'badge-green'}`}>
                    Score: {pay.fraudScore}%
                  </span>
                </div>
              </div>

              {/* Progress Bar Shimmer */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-700 text-slate-400 uppercase">
                  <span>Confidence Level</span>
                  <span>{100 - pay.fraudScore}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full gradient-teal progress-bar-animated" 
                    style={{ width: `${100 - pay.fraudScore}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 py-2 rounded-xl gradient-indigo text-white font-700 text-xs shadow-lg hover:shadow-indigo-300 transition-all">
                  Approve Claim
                </button>
                <button className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-700 text-xs hover:bg-rose-50 hover:text-rose-600 transition-all">
                  Flag
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}