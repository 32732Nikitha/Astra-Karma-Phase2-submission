import { useState } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

export default function CancelPolicyButton({ onConfirm }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-red-200 text-red-600 font-bold text-sm bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all"
      >
        <Trash2 className="w-4 h-4" /> Cancel Policy
      </button>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setOpen(false)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 shadow-2xl max-w-sm mx-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2">Cancel Policy?</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Cancelling will immediately remove all active coverage. Any ongoing events will not be paid out. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >Keep Policy</button>
              <button
                onClick={() => { onConfirm?.(); setOpen(false); }}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-sm text-white transition-colors"
              >Yes, Cancel</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
