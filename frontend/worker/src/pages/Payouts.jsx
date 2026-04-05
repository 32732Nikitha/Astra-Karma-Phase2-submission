import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EarningsSummaryBar  from '../components/worker/EarningsSummaryBar';
import PayoutFilterBar     from '../components/worker/PayoutFilterBar';
import PayoutCard          from '../components/worker/PayoutCard';
import TriggerDetailDrawer from '../components/worker/TriggerDetailDrawer';
import ExportCSVButton     from '../components/worker/ExportCSVButton';

const MOCK_PAYOUTS = [
  { id: 'CLM-001', trigger_type: 'Rain',  payout_amount: 600, payout_status: 'completed', payout_timestamp: '2026-04-01T15:30:00', trigger_level: 'L2', upi_ref: 'RZP20260401001', zone: 'Whitefield', trigger_value: '32 mm', threshold: '25 mm' },
  { id: 'CLM-002', trigger_type: 'AQI',   payout_amount: 600, payout_status: 'pending',   payout_timestamp: '2026-03-29T11:00:00', trigger_level: 'L1', upi_ref: null,              zone: 'HSR Layout',  trigger_value: '218 AQI', threshold: '200 AQI' },
  { id: 'CLM-003', trigger_type: 'Heat',  payout_amount: 600, payout_status: 'completed', payout_timestamp: '2026-03-25T13:45:00', trigger_level: 'L1', upi_ref: 'RZP20260325002', zone: 'Marathahalli', trigger_value: '43°C', threshold: '42°C' },
  { id: 'CLM-004', trigger_type: 'Rain',  payout_amount: 600, payout_status: 'failed',    payout_timestamp: '2026-03-20T09:15:00', trigger_level: 'L2', upi_ref: null,              zone: 'Indiranagar', trigger_value: '28 mm', threshold: '25 mm' },
];

const SUMMARY_DATA = { total_paid: 1200, total_pending: 600, events_triggered: 4, avg_payout: 600 };

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export default function Payouts() {
  const navigate = useNavigate();
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [filteredPayouts, setFilteredPayouts] = useState(MOCK_PAYOUTS);

  const handleFilter = ({ type, status, query }) => {
    setFilteredPayouts(MOCK_PAYOUTS.filter((p) => {
      const matchType   = type === 'All' || p.trigger_type === type;
      const matchStatus = status === 'All Status' || p.payout_status === status.toLowerCase();
      const matchQuery  = !query || p.trigger_type.toLowerCase().includes(query.toLowerCase()) || (p.upi_ref || '').includes(query);
      return matchType && matchStatus && matchQuery;
    }));
  };

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 xl:px-10 w-full max-w-[1400px] mx-auto relative z-10">
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-5">

        {/* Header */}
        <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="section-title">Vault & Payouts</h1>
            <p className="text-sm text-slate-500 mt-1">Secured earnings and protected balances</p>
          </div>
          <div className="flex items-center gap-3">
            <ExportCSVButton payouts={filteredPayouts} />
            <button onClick={() => navigate('/policy')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Shield className="w-4 h-4" /> Policy
            </button>
          </div>
        </motion.div>

        {/* Earnings summary */}
        <motion.div variants={item}>
          <EarningsSummaryBar data={SUMMARY_DATA} />
        </motion.div>

        {/* Vault banner */}
        <motion.div variants={item} className="card gradient-indigo p-6 text-white overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30">
                <Wallet className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Total Protected Balance</p>
                <p className="text-5xl font-black text-white tracking-tight">₹2,850</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full lg:w-auto">
              <div className="bg-white/15 rounded-xl px-4 py-3 border border-white/20">
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest block mb-0.5">Available</span>
                <span className="text-2xl font-black text-white">₹1,200</span>
              </div>
              <button className="bg-white text-indigo-600 hover:bg-indigo-50 text-sm font-bold px-6 py-3 rounded-xl shadow-lg transition-all">
                Withdraw to UPI
              </button>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-white/5 rounded-full" />
        </motion.div>

        {/* Filter bar */}
        <motion.div variants={item}>
          <PayoutFilterBar onFilter={handleFilter} />
        </motion.div>

        {/* Payout cards */}
        <motion.div variants={item} className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-slate-800">Recent Payouts</h2>
            <span className="badge badge-gray">{filteredPayouts.length} records</span>
          </div>
          {filteredPayouts.length === 0
            ? <div className="card p-8 text-center text-slate-400 text-sm">No payouts match your filters.</div>
            : filteredPayouts.map((p) => <PayoutCard key={p.id} payout={p} onClick={setSelectedPayout} />)
          }
        </motion.div>

      </motion.div>

      <TriggerDetailDrawer payout={selectedPayout} onClose={() => setSelectedPayout(null)} />
    </div>
  );
}
