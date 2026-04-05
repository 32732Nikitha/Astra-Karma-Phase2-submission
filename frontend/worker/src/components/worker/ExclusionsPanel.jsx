import { XCircle } from 'lucide-react';

const EXCLUSIONS = [
  { title: 'Scheduled Maintenance', desc: 'Planned platform downtime not covered' },
  { title: 'Personal Illness',      desc: 'Health-related income loss excluded' },
  { title: 'Voluntary Offline',     desc: 'Self-initiated offline shifts excluded' },
  { title: 'Fraud Activity',        desc: 'Any payout linked to fraudulent activity voided' },
  { title: 'Acts of War',           desc: 'Political or civil unrest related losses' },
];

export default function ExclusionsPanel() {
  return (
    <div className="card p-5">
      <div className="relative z-10 flex items-center justify-between mb-4">
        <h3 className="font-black text-slate-800">Exclusions</h3>
        <span className="badge badge-red">{EXCLUSIONS.length} items</span>
      </div>
      <div className="relative z-10 space-y-3">
        {EXCLUSIONS.map((ex) => (
          <div key={ex.title} className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-slate-700">{ex.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{ex.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
