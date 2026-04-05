import { X, CloudRain, Wind, Thermometer, Zap, ExternalLink } from 'lucide-react';

const TRIGGER_ICONS = { Rain: CloudRain, AQI: Wind, Heat: Thermometer, default: Zap };

export default function TriggerDetailDrawer({ payout, onClose }) {
  if (!payout) return null;

  const {
    trigger_type = 'Rain',
    payout_amount = 450,
    payout_status = 'completed',
    payout_timestamp,
    trigger_level = 'L2',
    upi_ref,
    zone = 'Whitefield, Bengaluru',
    trigger_value = '32 mm',
    threshold = '25 mm',
  } = payout;

  const TriggerIcon = TRIGGER_ICONS[trigger_type] || TRIGGER_ICONS.default;
  const isPaid = payout_status === 'completed';

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto animate-slide-in">
        {/* Handle */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
              <TriggerIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-black text-slate-800">{trigger_type} Disruption</h3>
              <p className="text-xs text-slate-400">{zone}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Payout amount */}
        <div className={`rounded-2xl p-5 mb-5 ${isPaid ? 'bg-emerald-50 border border-emerald-100' : 'bg-amber-50 border border-amber-100'}`}>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Payout Amount</p>
          <p className="text-4xl font-black text-slate-800">₹{payout_amount}</p>
          <span className={`badge mt-2 ${isPaid ? 'badge-green' : 'badge-yellow'}`}>{isPaid ? 'Paid to UPI' : 'Under Review'}</span>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: 'Trigger Level', value: trigger_level },
            { label: 'Observed Value', value: trigger_value },
            { label: 'Threshold', value: threshold },
            { label: 'Status', value: payout_status },
          ].map((d) => (
            <div key={d.label} className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{d.label}</p>
              <p className="text-sm font-bold text-slate-800 capitalize">{d.value}</p>
            </div>
          ))}
        </div>

        {/* UPI ref */}
        {upi_ref && (
          <div className="bg-slate-50 rounded-xl p-3 mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">UPI Reference</p>
              <p className="text-sm font-mono text-slate-700">{upi_ref}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-indigo-400" />
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl gradient-indigo text-white font-bold text-sm"
        >
          Close
        </button>
      </div>
    </>
  );
}
