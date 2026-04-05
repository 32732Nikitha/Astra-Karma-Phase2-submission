import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, Shield, BarChart2, Wallet, Zap, Layers, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { goToLanding } from '../../utils/landingUrl';

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',  path: '/dashboard', icon: Home     },
  { id: 'protection',  label: 'Protection', path: '/policy',    icon: Shield   },
  { id: 'forecasts',   label: 'Forecasts',  path: '/forecast',  icon: BarChart2 },
  { id: 'payouts',     label: 'Payouts',    path: '/payouts',   icon: Wallet   },
  { id: 'events',      label: 'Events',     path: '/events',    icon: Zap      },
  { id: 'plans',       label: 'Plans',      path: '/plans',     icon: Layers   },
];

export default function MainLayout() {
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);

  const handleSignOut = () => {
    logout();
    goToLanding();
  };

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: '#f1f5f9', fontFamily: 'Outfit, sans-serif' }}
    >
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-30"
             style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-20"
             style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)' }} />
      </div>

      {/* ── Desktop Top Nav ── */}
      <header className="hidden lg:flex sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 w-full flex items-center justify-between h-16">

          {/* Brand */}
          <div className="flex items-center gap-2.5 w-56 cursor-default">
            <div className="w-9 h-9 rounded-xl gradient-indigo flex items-center justify-center shadow-lg shadow-indigo-200">
              <Shield className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-slate-800" style={{ fontFamily: 'Syne, sans-serif' }}>
                BHIMA
              </span>
              <span className="text-[10px] font-bold text-indigo-500 block leading-none -mt-0.5 tracking-widest">ASTRA</span>
            </div>
          </div>

          {/* Nav pills */}
          <nav className="flex items-center gap-1 bg-slate-100/70 p-1 rounded-2xl border border-slate-200/60">
            {NAV_ITEMS.map((navItem) => {
              const isActive = location.pathname.startsWith(navItem.path);
              const Icon = navItem.icon;
              return (
                <NavLink
                  key={navItem.id}
                  to={navItem.path}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all outline-none ${
                    isActive
                      ? 'text-white shadow-md gradient-indigo'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {navItem.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Profile + sign out */}
          <div className="w-56 flex justify-end items-center gap-2">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              Out
            </button>
            <NavLink to="/profile" className="outline-none">
              {({ isActive }) => (
                <div className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                  isActive
                    ? 'border-indigo-400 ring-2 ring-indigo-200'
                    : 'border-white shadow-md hover:border-indigo-200'
                }`}>
                  <img src="https://i.pravatar.cc/150?img=11" alt="Ravi Kumar" className="w-full h-full object-cover" />
                </div>
              )}
            </NavLink>
          </div>
        </div>
      </header>

      {/* ── Page Content (animated) ── */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-full pb-24 lg:pb-8"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-200/60 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] pb-safe">
        <ul className="flex items-center justify-around h-16 px-1">
          {[...NAV_ITEMS, { id: 'profile', label: 'Profile', path: '/profile', icon: User }].map((navItem) => {
            const isActive = location.pathname.startsWith(navItem.path);
            const Icon = navItem.icon;
            return (
              <li key={navItem.id} className="flex-1">
                <NavLink
                  to={navItem.path}
                  className="w-full h-full flex flex-col items-center justify-center gap-1 outline-none group"
                >
                  <div className={`flex items-center justify-center w-9 h-7 rounded-xl transition-all ${
                    isActive
                      ? 'gradient-indigo shadow-md shadow-indigo-200'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                  </div>
                  <span className={`text-[9px] font-black tracking-wide transition-colors ${
                    isActive ? 'text-indigo-600' : 'text-slate-400'
                  }`}>
                    {navItem.label}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
