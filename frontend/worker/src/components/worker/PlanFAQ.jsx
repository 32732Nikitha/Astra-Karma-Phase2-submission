import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  { q: 'When is a payout triggered?', a: 'A payout is automatically triggered when a weather event (rain, AQI, heat) crosses your plan\'s threshold in your registered zone. No manual claim needed.' },
  { q: 'How fast do I receive the payout?', a: 'Payouts are credited to your registered UPI ID within 15–30 minutes of trigger confirmation.' },
  { q: 'Can I change my plan mid-week?', a: 'Plan upgrades take effect from the next weekly cycle (Monday 00:00). Downgrades are processed at the end of the current cycle.' },
  { q: 'What if I miss a trigger notification?', a: 'All triggered events and payouts are logged in your Payouts tab. You\'ll also receive a WhatsApp notification automatically.' },
  { q: 'Is there a waitlist period?', a: 'No! Coverage starts immediately after your first weekly payment is confirmed.' },
];

export default function PlanFAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div className="card p-5">
      <div className="relative z-10 mb-4">
        <h3 className="font-black text-slate-800">Frequently Asked Questions</h3>
      </div>
      <div className="relative z-10 space-y-2">
        {FAQS.map((faq, i) => (
          <div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm font-bold text-slate-700 pr-4">{faq.q}</span>
              {open === i ? <ChevronUp className="w-4 h-4 text-indigo-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3 animate-fade-up">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
