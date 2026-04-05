import { Download, FileText } from 'lucide-react';
import { useState } from 'react';

export default function DownloadPolicyButton({ policyNumber = 'BGS-2026-00412' }) {
  const [loading, setLoading] = useState(false);

  const handle = () => {
    setLoading(true);
    setTimeout(() => {
      const content = `BHIMA ASTRA Insurance Policy\nPolicy Number: ${policyNumber}\nGenerated: ${new Date().toLocaleString('en-IN')}\n\n[Full policy document would be here]`;
      const blob = new Blob([content], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gigshield-policy-${policyNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setLoading(false);
    }, 1000);
  };

  return (
    <button
      onClick={handle}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-3 rounded-xl gradient-indigo text-white font-bold text-sm shadow-lg shadow-indigo-200 hover:opacity-90 transition-all disabled:opacity-70"
    >
      {loading ? <FileText className="w-4 h-4 animate-pulse" /> : <Download className="w-4 h-4" />}
      {loading ? 'Generating PDF…' : 'Download Policy PDF'}
    </button>
  );
}
