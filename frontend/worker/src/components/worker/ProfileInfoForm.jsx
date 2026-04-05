import { useState } from 'react';
import { Save, User, Phone, Mail, MapPin } from 'lucide-react';

const FIELDS = [
  { key: 'full_name',  label: 'Full Name',     icon: User,    type: 'text',  placeholder: 'Ravi Kumar' },
  { key: 'phone',      label: 'Phone Number',  icon: Phone,   type: 'tel',   placeholder: '+91 98765 43210' },
  { key: 'email',      label: 'Email Address', icon: Mail,    type: 'email', placeholder: 'ravi.kumar@email.com' },
  { key: 'base_city',  label: 'Base City',     icon: MapPin,  type: 'text',  placeholder: 'Bengaluru' },
];

export default function ProfileInfoForm({ initialData = {} }) {
  const [form, setForm] = useState({
    full_name: 'Ravi Kumar',
    phone: '+91 98765 43210',
    email: 'ravi.kumar@example.com',
    base_city: 'Bengaluru',
    ...initialData,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="card p-5 flex flex-col gap-5">
      <div className="relative z-10 flex items-center justify-between">
        <h3 className="font-black text-slate-800">Personal Information</h3>
        {saved && <span className="badge badge-green animate-fade-up">Saved!</span>}
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {FIELDS.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.key}>
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                <Icon className="w-3 h-3" />{f.label}
              </label>
              <input
                type={f.type}
                value={form[f.key] || ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
              />
            </div>
          );
        })}
      </div>

      <button type="submit" className="relative z-10 flex items-center justify-center gap-2 w-full py-3 rounded-xl gradient-indigo text-white font-bold text-sm shadow-lg shadow-indigo-200 hover:opacity-90 transition-all">
        <Save className="w-4 h-4" /> Save Changes
      </button>
    </form>
  );
}
