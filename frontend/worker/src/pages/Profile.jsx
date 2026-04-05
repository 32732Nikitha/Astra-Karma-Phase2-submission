import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { goToLanding } from '../utils/landingUrl';
import ProfileInfoForm      from '../components/worker/ProfileInfoForm';
import ZoneUpdateMap        from '../components/worker/ZoneUpdateMap';
import UPIManager           from '../components/worker/UPIManager';
import NotificationSettings from '../components/worker/NotificationSettings';
import LanguageSelector     from '../components/worker/LanguageSelector';
import FraudRiskBadge       from '../components/worker/FraudRiskBadge';
import AccountDeletion      from '../components/worker/AccountDeletion';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } } };

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => { logout(); goToLanding(); };

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 xl:px-10 w-full max-w-[1400px] mx-auto relative z-10">
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-5">

        {/* Header + avatar */}
        <motion.div variants={item} className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
            <img src="https://i.pravatar.cc/150?img=11" alt="Ravi Kumar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="section-title leading-tight">Ravi Kumar</h1>
            <p className="text-sm text-slate-500 mt-0.5">ravi.kumar@example.com · <span className="badge badge-purple">Standard Plan</span></p>
          </div>
        </motion.div>

        {/* Fraud risk */}
        <motion.div variants={item}>
          <FraudRiskBadge risk_level="low" score={12} />
        </motion.div>

        {/* 2-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="flex flex-col gap-5">
            <motion.div variants={item}><ProfileInfoForm /></motion.div>
            <motion.div variants={item}><ZoneUpdateMap currentZone="Whitefield" /></motion.div>
            <motion.div variants={item}><LanguageSelector current="en" /></motion.div>
          </div>
          <div className="flex flex-col gap-5">
            <motion.div variants={item}><UPIManager /></motion.div>
            <motion.div variants={item}><NotificationSettings /></motion.div>
            <motion.div variants={item}><AccountDeletion /></motion.div>
          </div>
        </div>

        {/* Logout */}
        <motion.div variants={item}>
          <button
            onClick={handleLogout}
            className="card w-full flex items-center justify-between p-4 hover:bg-red-50 group transition-colors"
          >
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                <LogOut className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-sm font-bold text-slate-800 group-hover:text-red-600 transition-colors">Log out securely</span>
            </div>
            <ArrowRight className="relative z-10 w-4 h-4 text-slate-300 group-hover:text-red-400 transition-colors" />
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
}
