import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SevenDayRiskCalendar from '../components/worker/SevenDayRiskCalendar';
import ForecastDetailCard   from '../components/worker/ForecastDetailCard';
import UpgradePlanNudge     from '../components/worker/UpgradePlanNudge';
import ConfidenceIndicator  from '../components/worker/ConfidenceIndicator';
import PastAccuracyBadge    from '../components/worker/PastAccuracyBadge';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } } };

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEK = [
  { risk: 'low',    rain: 5,  aqi: 80,  temp: 34, earnings: '₹1,400' },
  { risk: 'medium', rain: 18, aqi: 145, temp: 37, earnings: '₹1,100' },
  { risk: 'high',   rain: 38, aqi: 210, temp: 38, earnings: '₹620'   },
  { risk: 'low',    rain: 2,  aqi: 72,  temp: 33, earnings: '₹1,550' },
  { risk: 'medium', rain: 22, aqi: 168, temp: 36, earnings: '₹980'   },
  { risk: 'high',   rain: 45, aqi: 234, temp: 39, earnings: '₹480'   },
  { risk: 'low',    rain: 0,  aqi: 60,  temp: 32, earnings: '₹1,650' },
];

export default function Forecast() {
  const navigate = useNavigate();
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;
  const [selectedDay, setSelectedDay] = useState(todayIdx);

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 xl:px-10 w-full max-w-[1400px] mx-auto relative z-10">
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-5">

        <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="section-title">Predictive Forecasts</h1>
            <p className="text-sm text-slate-500 mt-1">Next 7 days earning potential & risk model</p>
          </div>
          <button onClick={() => navigate('/events')} className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            View Events →
          </button>
        </motion.div>

        {/* Accuracy + confidence */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ConfidenceIndicator confidence={87} />
          <PastAccuracyBadge accuracy={91} totalPredictions={48} correct={44} />
        </motion.div>

        {/* Upgrade nudge */}
        <motion.div variants={item}>
          <UpgradePlanNudge currentPlan="Basic" nextPlan="Standard" benefit="Unlock AQI coverage + 1 extra event/week for ₹40 more" />
        </motion.div>

        {/* Calendar + Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <motion.div variants={item} className="lg:col-span-2">
            <SevenDayRiskCalendar onSelect={(i) => setSelectedDay(i)} />
          </motion.div>
          <motion.div variants={item}>
            <ForecastDetailCard
              day={DAYS[selectedDay]}
              data={WEEK[selectedDay]}
            />
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}
