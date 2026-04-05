import { Download, FileText } from 'lucide-react';
import { useState } from 'react';

export default function ExportCSVButton({ payouts = [] }) {
  const [loading, setLoading] = useState(false);

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => {
      const headers = ['Date', 'Trigger Type', 'Level', 'Amount', 'Status', 'UPI Ref'];
      const rows = payouts.map((p) => [
        p.payout_timestamp,
        p.trigger_type,
        p.trigger_level || '',
        p.payout_amount,
        p.payout_status,
        p.upi_ref || '',
      ]);
      const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gigshield-payouts-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setLoading(false);
    }, 800);
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-60 shadow-sm"
    >
      {loading ? (
        <><FileText className="w-4 h-4 animate-pulse" /> Exporting…</>
      ) : (
        <><Download className="w-4 h-4" /> Export CSV</>
      )}
    </button>
  );
}
