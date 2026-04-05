import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function EventSearch({ onSearch }) {
  const [query, setQuery] = useState('');

  const handle = (val) => {
    setQuery(val);
    onSearch?.(val);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => handle(e.target.value)}
        placeholder="Search events by zone or type…"
        className="w-full pl-9 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
      />
      {query && (
        <button
          onClick={() => handle('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300 transition-colors"
        >
          <X className="w-3 h-3 text-slate-500" />
        </button>
      )}
    </div>
  );
}
