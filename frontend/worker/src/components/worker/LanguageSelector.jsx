import { useState } from 'react';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', name: 'English',    native: 'English' },
  { code: 'hi', name: 'Hindi',      native: 'हिंदी' },
  { code: 'kn', name: 'Kannada',    native: 'ಕನ್ನಡ' },
  { code: 'te', name: 'Telugu',     native: 'తెలుగు' },
  { code: 'ta', name: 'Tamil',      native: 'தமிழ்' },
  { code: 'mr', name: 'Marathi',    native: 'मराठी' },
];

export default function LanguageSelector({ current = 'en' }) {
  const [selected, setSelected] = useState(current);

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="relative z-10 flex items-center justify-between">
        <h3 className="font-black text-slate-800">Language</h3>
        <Globe className="w-4 h-4 text-indigo-500" />
      </div>
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setSelected(lang.code)}
            className={`flex flex-col items-start px-3 py-2.5 rounded-xl border transition-all text-left ${
              selected === lang.code
                ? 'gradient-indigo text-white border-transparent shadow-md'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className={`text-xs font-black ${selected === lang.code ? 'text-white' : 'text-slate-800'}`}>{lang.native}</span>
            <span className={`text-[10px] ${selected === lang.code ? 'text-white/70' : 'text-slate-400'}`}>{lang.name}</span>
          </button>
        ))}
      </div>
      <p className="relative z-10 text-[10px] text-slate-400">Language change takes effect on next app reload.</p>
    </div>
  );
}
