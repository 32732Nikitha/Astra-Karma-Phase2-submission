import { useState } from 'react';
import { Filter, Search } from 'lucide-react';

const FILTERS = ['All', 'Rain', 'AQI', 'Heat', 'Traffic'];
const STATUSES = ['All Status', 'Paid', 'Pending', 'Failed'];

export default function PayoutFilterBar({ onFilter }) {
  const [activeType, setActiveType] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All Status');
  const [search, setSearch] = useState('');

  const handleFilter = (type, status, q) => {
    onFilter?.({ type, status, query: q });
  };

  return (
    <div className="card p-4 relative z-10">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search payouts…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); handleFilter(activeType, activeStatus, e.target.value); }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        {/* Trigger type filter */}
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => { setActiveType(f); handleFilter(f, activeStatus, search); }}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                activeType === f
                  ? 'gradient-indigo text-white shadow-md'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <select
          value={activeStatus}
          onChange={(e) => { setActiveStatus(e.target.value); handleFilter(activeType, e.target.value, search); }}
          className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 outline-none focus:border-indigo-400 cursor-pointer"
        >
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );
}
