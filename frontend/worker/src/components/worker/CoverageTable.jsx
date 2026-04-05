import { CheckCircle2 } from 'lucide-react';

const COVERAGE = [
  { trigger: 'Rainfall',    threshold: '> 25 mm/hr',   payout: '₹600',  level: 'L2', covered: true },
  { trigger: 'AQI',         threshold: '> 200 AQI',     payout: '₹600',  level: 'L1', covered: true },
  { trigger: 'Heat Index',  threshold: '> 42°C',         payout: '₹600',  level: 'L1', covered: true },
  { trigger: 'Cyclone',     threshold: 'Category 2+',   payout: '₹1200', level: 'L3', covered: true },
  { trigger: 'Hailstorm',   threshold: '> 15 mm stones', payout: '₹600',  level: 'L2', covered: false },
];

const LEVEL_BADGE = { L1: 'badge-green', L2: 'badge-yellow', L3: 'badge-red' };

export default function CoverageTable() {
  return (
    <div className="card overflow-hidden">
      <div className="p-5 border-b border-slate-100 relative z-10">
        <h3 className="font-black text-slate-800">Coverage Triggers</h3>
        <p className="text-xs text-slate-400 mt-0.5">Conditions that activate your payout</p>
      </div>
      <div className="overflow-x-auto relative z-10">
        <table className="data-table">
          <thead>
            <tr>
              <th>Trigger</th>
              <th>Threshold</th>
              <th>Payout</th>
              <th>Level</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {COVERAGE.map((row) => (
              <tr key={row.trigger}>
                <td className="font-semibold text-slate-700">{row.trigger}</td>
                <td className="font-mono text-xs">{row.threshold}</td>
                <td className="font-black text-slate-800">{row.payout}</td>
                <td><span className={`badge ${LEVEL_BADGE[row.level]}`}>{row.level}</span></td>
                <td>
                  {row.covered
                    ? <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold"><CheckCircle2 className="w-3.5 h-3.5" />Covered</span>
                    : <span className="badge badge-gray">Not Included</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
