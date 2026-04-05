import { useState } from 'react';
import { CreditCard, Plus, CheckCircle2, Trash2 } from 'lucide-react';

const SAVED_UPIS = [
  { id: 1, handle: 'ravi.kumar@okaxis',    primary: true },
  { id: 2, handle: 'ravi@ybl',             primary: false },
];

export default function UPIManager() {
  const [upis, setUpis] = useState(SAVED_UPIS);
  const [newUPI, setNewUPI] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const addUPI = () => {
    if (!newUPI.includes('@')) { setError('Enter a valid UPI ID (e.g. name@bank)'); return; }
    setUpis([...upis, { id: Date.now(), handle: newUPI, primary: false }]);
    setNewUPI('');
    setAdding(false);
    setError('');
  };

  const setPrimary = (id) => setUpis(upis.map((u) => ({ ...u, primary: u.id === id })));
  const remove = (id) => setUpis(upis.filter((u) => u.id !== id));

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="relative z-10 flex items-center justify-between">
        <h3 className="font-black text-slate-800">UPI Accounts</h3>
        <CreditCard className="w-4 h-4 text-indigo-500" />
      </div>

      <div className="relative z-10 space-y-2">
        {upis.map((u) => (
          <div key={u.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${u.primary ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}>
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-black text-indigo-600">UPI</span>
            </div>
            <p className="text-sm font-bold text-slate-700 flex-1 truncate">{u.handle}</p>
            {u.primary
              ? <span className="badge badge-green flex items-center gap-1 flex-shrink-0"><CheckCircle2 className="w-3 h-3" />Primary</span>
              : <button onClick={() => setPrimary(u.id)} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex-shrink-0">Set Primary</button>
            }
            {!u.primary && <button onClick={() => remove(u.id)} className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors flex-shrink-0"><Trash2 className="w-3 h-3 text-red-500" /></button>}
          </div>
        ))}
      </div>

      {adding ? (
        <div className="relative z-10 space-y-2">
          <input
            autoFocus
            type="text"
            value={newUPI}
            onChange={(e) => { setNewUPI(e.target.value); setError(''); }}
            placeholder="name@bank (e.g. ravi@okicici)"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2">
            <button onClick={addUPI} className="flex-1 py-2 rounded-xl gradient-indigo text-white font-bold text-sm">Add</button>
            <button onClick={() => { setAdding(false); setError(''); }} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="relative z-10 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-dashed border-indigo-200 text-indigo-600 font-bold text-sm hover:bg-indigo-50 transition-colors">
          <Plus className="w-4 h-4" /> Add UPI ID
        </button>
      )}
    </div>
  );
}
