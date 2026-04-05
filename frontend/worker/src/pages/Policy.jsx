import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PolicyHeader         from '../components/worker/PolicyHeader';
import CoverageTable        from '../components/worker/CoverageTable';
import ExclusionsPanel      from '../components/worker/ExclusionsPanel';
import TriggerThresholdCard from '../components/worker/TriggerThresholdCard';
import EventCapIndicator    from '../components/worker/EventCapIndicator';
import DownloadPolicyButton from '../components/worker/DownloadPolicyButton';
import CancelPolicyButton   from '../components/worker/CancelPolicyButton';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } } };

const POLICY = {
  policy_number: 'BGS-2026-00412',
  plan_name: 'Standard',
  activation_date: '01 Apr 2026',
  expiry_date: '07 Apr 2026',
  policy_status: 'active',
};

export default function Policy() {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 xl:px-10 w-full max-w-[1400px] mx-auto relative z-10">
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-5">

        <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="section-title">Protection Policy</h1>
            <p className="text-sm text-slate-500 mt-1">Coverage details, triggers, and exclusions</p>
          </div>
          <button onClick={() => navigate('/plans')} className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            Upgrade Plan →
          </button>
        </motion.div>

        <motion.div variants={item}><PolicyHeader policy={POLICY} /></motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div variants={item} className="lg:col-span-2"><CoverageTable /></motion.div>
          <motion.div variants={item}>
            <div className="flex flex-col gap-4">
              <EventCapIndicator events_used={1} event_cap={3} payout_per_event={600} />
              <TriggerThresholdCard />
            </div>
          </motion.div>
        </div>

        <motion.div variants={item}><ExclusionsPanel /></motion.div>

        <motion.div variants={item} className="flex flex-wrap gap-3">
          <DownloadPolicyButton policyNumber={POLICY.policy_number} />
          <CancelPolicyButton onConfirm={() => console.log('Policy cancelled')} />
        </motion.div>

      </motion.div>
    </div>
  );
}
