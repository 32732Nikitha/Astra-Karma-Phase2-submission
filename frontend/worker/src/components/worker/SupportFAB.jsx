import { useState } from 'react';
import { MessageCircle, X, Phone, MessageSquare } from 'lucide-react';

const OPTIONS = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: '💬',
    desc: 'Chat on WhatsApp',
    action: () => window.open('https://wa.me/919999999999?text=Hi%2C%20I%20need%20help%20with%20my%20GigShield%20policy', '_blank'),
    bg: 'bg-emerald-500 hover:bg-emerald-600',
  },
  {
    id: 'chat',
    label: 'Live Chat',
    icon: '🎧',
    desc: 'Chat with support',
    action: () => alert('Live chat coming soon!'),
    bg: 'bg-indigo-500 hover:bg-indigo-600',
  },
  {
    id: 'call',
    label: 'Call Us',
    icon: '📞',
    desc: '1800-XXX-XXXX',
    action: () => window.open('tel:1800000000', '_self'),
    bg: 'bg-violet-500 hover:bg-violet-600',
  },
];

export default function SupportFAB() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-5 lg:bottom-8 lg:right-8 z-50 flex flex-col items-end gap-3">
      {/* Option pills */}
      {open && (
        <div className="flex flex-col items-end gap-2 animate-fade-up">
          {OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => { opt.action(); setOpen(false); }}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl ${opt.bg} text-white shadow-xl transition-all hover:-translate-y-0.5 text-sm font-bold`}
            >
              <span className="text-base">{opt.icon}</span>
              <div className="text-left">
                <p className="text-sm font-bold leading-none">{opt.label}</p>
                <p className="text-[10px] text-white/70 mt-0.5">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
          open
            ? 'bg-slate-800 text-white rotate-90'
            : 'gradient-indigo text-white animate-float'
        }`}
        aria-label="Support"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
