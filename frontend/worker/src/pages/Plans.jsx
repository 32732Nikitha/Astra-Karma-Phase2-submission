import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PlanCard             from '../components/worker/PlanCard';
import AIRecommendBadge     from '../components/worker/AIRecommendBadge';
import PremiumBreakdownModal from '../components/worker/PremiumBreakdownModal';
import PlanFAQ              from '../components/worker/PlanFAQ';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } } };

const PLANS = [
  {
    id: 'basic', name: 'Basic', price: '₹49', tagline: 'Part-time gig workers',
    features: ['₹300 per weather event', '2 events per week', 'Rain trigger only', 'Standard support'],
  },
  {
    id: 'standard', name: 'Standard', price: '₹89', tagline: 'Best for 3–5 shift/week workers',
    features: ['₹600 per weather event', '3 events per week', 'Rain + AQI triggers', 'WhatsApp alerts', 'Priority support'],
  },
  {
    id: 'premium', name: 'Premium', price: '₹149', tagline: 'Full-time power workers',
    features: ['₹1200 per weather event', '5 events per week', 'All triggers (Rain, AQI, Heat)', 'Zero UPI fees', 'Dedicated manager'],
  },
];

export default function Plans() {
  const [currentPlan] = useState('standard');
  const [modalPlan, setModalPlan] = useState(null);

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 xl:px-10 w-full max-w-[1400px] mx-auto relative z-10">
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-6">

        <motion.div variants={item} className="text-center max-w-2xl mx-auto">
          <h1 className="section-title">Protection Plans</h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Choose the right income shield for your weekly gig schedule. Upgrade or downgrade anytime.
          </p>
        </motion.div>

        <motion.div variants={item}>
          <AIRecommendBadge planName="Standard" reason="Based on your 4-day work week in Whitefield zone — Standard covers Rain + AQI for optimal payout coverage." />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
          {PLANS.map((plan) => (
            <motion.div key={plan.id} variants={item} className="animate-fade-up">
              <PlanCard
                plan={plan}
                isRecommended={plan.id === 'standard'}
                isCurrent={plan.id === currentPlan}
                onSelect={(id) => {
                  const p = PLANS.find((x) => x.id === id);
                  if (p && p.id !== currentPlan) setModalPlan(p);
                }}
              />
              <button
                onClick={() => setModalPlan(plan)}
                className="mt-2 w-full text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors py-1"
              >
                View full breakdown →
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div variants={item}>
          <PlanFAQ />
        </motion.div>

      </motion.div>

      <PremiumBreakdownModal plan={modalPlan} onClose={() => setModalPlan(null)} />
    </div>
  );
}