import { useState } from 'react';
import { Trash2, X, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { goToLanding } from '../../utils/landingUrl';

export default function AccountDeletion() {
  const [step, setStep] = useState(0); // 0: idle, 1: confirm, 2: final
  const [typed, setTyped] = useState('');
  const { logout } = useAuthStore();

  const CONFIRM_WORD = 'DELETE';

  const handleDelete = () => {
    logout();
    goToLanding();
  };

  return (
    <div className="card p-5 flex flex-col gap-4 border-2 border-red-100">
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h3 className="font-black text-red-700">Danger Zone</h3>
          <p className="text-xs text-slate-400 mt-0.5">Irreversible account actions</p>
        </div>
        <Trash2 className="w-4 h-4 text-red-500" />
      </div>

      {step === 0 && (
        <div className="relative z-10 space-y-3">
          <p className="text-xs text-slate-500 leading-relaxed">
            Deleting your account will permanently erase all payout history, policy data, and profile information. This cannot be undone.
          </p>
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-red-200 text-red-600 font-bold text-sm bg-red-50 hover:bg-red-100 transition-all"
          >
            <Trash2 className="w-4 h-4" /> Request Account Deletion
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="relative z-10 space-y-3">
          <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 leading-relaxed font-medium">
              Type <b>DELETE</b> to confirm permanent account deletion. All data will be erased within 24 hours.
            </p>
          </div>
          <input
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value.toUpperCase())}
            placeholder="Type DELETE to confirm"
            className="w-full px-3 py-2.5 rounded-xl border-2 border-red-200 text-sm text-red-700 font-bold outline-none focus:border-red-400 transition-all bg-red-50 placeholder-red-300"
          />
          <div className="flex gap-2">
            <button
              disabled={typed !== CONFIRM_WORD}
              onClick={handleDelete}
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Permanently Delete
            </button>
            <button onClick={() => { setStep(0); setTyped(''); }} className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
