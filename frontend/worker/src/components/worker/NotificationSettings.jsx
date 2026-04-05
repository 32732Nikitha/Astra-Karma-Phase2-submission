import { useState } from 'react';
import { Bell, MessageCircle, Mail, Smartphone } from 'lucide-react';

const SETTINGS = [
  { key: 'payout_alerts',    label: 'Payout Alerts',        desc: 'Notify when a payout is triggered',          icon: Bell,          defaultOn: true },
  { key: 'whatsapp',         label: 'WhatsApp Notifications',desc: 'Receive updates on WhatsApp',                icon: MessageCircle, defaultOn: true },
  { key: 'email_digest',     label: 'Weekly Email Digest',  desc: 'Summary of earnings & events every Monday',  icon: Mail,          defaultOn: false },
  { key: 'sms',              label: 'SMS Alerts',            desc: 'Critical alerts via SMS',                    icon: Smartphone,    defaultOn: false },
];

export default function NotificationSettings() {
  const [prefs, setPrefs] = useState(
    Object.fromEntries(SETTINGS.map((s) => [s.key, s.defaultOn]))
  );

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="relative z-10 flex items-center justify-between">
        <h3 className="font-black text-slate-800">Notifications</h3>
        <Bell className="w-4 h-4 text-indigo-500" />
      </div>
      <div className="relative z-10 space-y-3">
        {SETTINGS.map((s) => {
          const Icon = s.icon;
          const on = prefs[s.key];
          return (
            <div key={s.key} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${on ? 'bg-indigo-100' : 'bg-slate-200'}`}>
                <Icon className={`w-4 h-4 ${on ? 'text-indigo-600' : 'text-slate-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800">{s.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
              </div>
              <button
                onClick={() => toggle(s.key)}
                className={`w-11 h-6 rounded-full relative flex-shrink-0 transition-all duration-300 ${on ? 'gradient-indigo' : 'bg-slate-300'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${on ? 'left-5.5' : 'left-0.5'}`} style={{ left: on ? '22px' : '2px' }} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
