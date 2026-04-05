import { useState } from 'react';
import { X, CheckCircle2, Shield } from 'lucide-react';

export default function PremiumBreakdownModal({ plan, onClose }) {
  if (!plan) return null;

  const { name, price, features = [], breakdown = [] } = plan;

  const defaultBreakdown = [
    { item: 'Base Premium',          amount: price },
    { item: 'GST (18%)',             amount: `+₹${Math.round(parseInt(price.replace('₹','')) * 0.18)}` },
    { item: 'Platform Fee',          amount: '₹0' },
    { item: 'Total Weekly Charge',   amount: `₹${Math.round(parseInt(price.replace('₹','')) * 1.18)}`, bold: true },
  ];

  const items = breakdown.length ? breakdown : defaultBreakdown;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 shadow-2xl max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-lg font-black text-slate-800">{name} Breakdown</h3>
            <p className="text-xs text-slate-400 mt-0.5">Full cost & coverage details</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="space-y-2 mb-5">
          {items.map((row) => (
            <div key={row.item} className={`flex justify-between py-2.5 border-b border-slate-100 ${row.bold ? 'font-black text-slate-800 text-base' : 'text-sm text-slate-600'}`}>
              <span>{row.item}</span>
              <span className={row.bold ? 'text-indigo-600' : ''}>{row.amount}</span>
            </div>
          ))}
        </div>

        <div className="bg-indigo-50 rounded-xl p-4 mb-5">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">What's covered</p>
          <ul className="space-y-1.5">
            {features.slice(0, 4).map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />{f}
              </li>
            ))}
          </ul>
        </div>

        <button onClick={onClose} className="w-full py-3 rounded-xl gradient-indigo text-white font-bold text-sm shadow-lg shadow-indigo-200">
          Got it
        </button>
      </div>
    </>
  );
}
