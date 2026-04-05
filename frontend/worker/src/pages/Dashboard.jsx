import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Worker components
import PolicyStatusBanner    from '../components/worker/PolicyStatusBanner';
import WeeklyCoverageCard    from '../components/worker/WeeklyCoverageCard';
import CompositeScoreGauge   from '../components/worker/CompositeScoreGauge';
import LiveWeatherWidget     from '../components/worker/LiveWeatherWidget';
import TodayEarningsEstimate from '../components/worker/TodayEarningsEstimate';
import WeeklyForecastTeaser  from '../components/worker/WeeklyForecastTeaser';
import UpcomingRenewalNudge  from '../components/worker/UpcomingRenewalNudge';
import RecentPayoutsTimeline from '../components/worker/RecentPayoutsTimeline';
import HowItWorksSlide       from '../components/worker/HowItWorksSlide';
import PlanComparisonCard    from '../components/worker/PlanComparisonCard';
import FirstPaymentCTA       from '../components/worker/FirstPaymentCTA';
import PolicyActivatedScreen from '../components/worker/PolicyActivatedScreen';
import SupportFAB            from '../components/worker/SupportFAB';

// Staggered fade-up variants
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};
const hoverSpring = {
  scale: 1.02,
  y: -6,
  boxShadow: "0 20px 40px -12px rgba(99, 102, 241, 0.15)",
  transition: { type: 'spring', stiffness: 400, damping: 25 },
};

// Mock data
const POLICY_DATA = {
  policy_status: 'active',
  activation_date: '01 Apr 2026',
  last_active_date: '07 Apr 2026',
};

const COVERAGE_DATA = {
  events_used: 1,
  events_remaining: 2,
  payout_amount: 18500,
  days_remaining: 4,
};

const WEATHER_DATA = {
  rainfall: 18,
  temperature: 42, // Set to 42 to show the dynamic heat effect
  AQI: 142,
};

const SCORE_DATA = {
  composite_score: 62,
  composite_threshold: 70,
};

const MARQUEE_ITEMS = [
  "🎉 Ravi just received ₹600 for Rain Alert in HSR Layout",
  "⚡ Suraj triggered AQI Protection (+₹450) in Whitefield",
  "⛈️ Heavy rain predicted tomorrow — 85% confidence",
  "💸 Total payouts disbursed today: ₹1.2L+",
  "🛡️ 4,200 active policies in Bengaluru",
];

export default function Dashboard() {

  // Dynamic weather overlay logic based on state
  const renderWeatherOverlay = () => {
    if (WEATHER_DATA.rainfall > 80) {
      return (
        <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
           {/* Simple CSS rain simulation */}
           <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjIwIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxMyIgZmlsbD0iI2QyZDRmMiIvPjwvc3ZnPg==')] opacity-40 animate-[slideDown_0.6s_linear_infinite]" style={{ backgroundSize: '20px 40px' }} />
        </div>
      );
    }
    if (WEATHER_DATA.temperature > 40) {
      return (
        <motion.div 
          animate={{ opacity: [0.05, 0.15, 0.05], scale: [1, 1.05, 1] }} 
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} 
          className="fixed inset-0 pointer-events-none z-[5] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-400 via-transparent to-transparent" 
        />
      );
    }
    if (WEATHER_DATA.AQI > 200) {
      return (
        <div className="fixed inset-0 pointer-events-none z-[5] backdrop-blur-[2px] bg-slate-500/10 transition-all duration-1000" />
      );
    }
    return null;
  };

  return (
    <>
      {/* ─── FULL SCREEN VIDEO BACKGROUND ─── */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute min-w-full min-h-full object-cover opacity-30"
          src="https://cdn.pixabay.com/video/2023/07/04/170138-842603833_large.mp4"
        />
        {/* Light Glassmorphism Overlay to ensure light theme legibility */}
        <div className="absolute inset-0 bg-slate-50/85 backdrop-blur-[8px]" />
      </div>

      {renderWeatherOverlay()}

      <div className="px-4 py-8 md:px-6 lg:px-8 xl:px-10 w-full max-w-[1400px] mx-auto relative z-10">
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-6">

          {/* ─── ROW 0: Page title ─── */}
          <motion.div variants={item}>
            <h1 className="section-title text-slate-800">Worker Dashboard</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">BHIMA ASTRA — Ravi Kumar · Bengaluru</p>
          </motion.div>

          {/* ─── ROW 1: PolicyStatusBanner (full width) ─── */}
          <motion.div variants={item} whileHover={hoverSpring}>
            <PolicyStatusBanner data={POLICY_DATA} />
          </motion.div>

          {/* ─── ROW 2: 3 cards ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div variants={item} whileHover={hoverSpring} className="h-full">
              <WeeklyCoverageCard data={COVERAGE_DATA} />
            </motion.div>
            <motion.div variants={item} whileHover={hoverSpring} className="h-full">
              <CompositeScoreGauge score={SCORE_DATA.composite_score} />
            </motion.div>
            <motion.div variants={item} whileHover={hoverSpring} className="h-full">
              <LiveWeatherWidget />
            </motion.div>
          </div>

          {/* ─── ROW 3: 3 cards ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div variants={item} whileHover={hoverSpring} className="h-full">
              <TodayEarningsEstimate />
            </motion.div>
            <motion.div variants={item} whileHover={hoverSpring} className="h-full">
              <WeeklyForecastTeaser forecast_risk_level="medium" />
            </motion.div>
            <motion.div variants={item} whileHover={hoverSpring} className="h-full">
              <UpcomingRenewalNudge last_active_date="2026-04-02" />
            </motion.div>
          </div>

          {/* ─── ROW 4: 3 cards ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div variants={item} whileHover={hoverSpring} className="h-full">
              <RecentPayoutsTimeline />
            </motion.div>
            <motion.div variants={item} whileHover={hoverSpring} className="h-full">
              <HowItWorksSlide />
            </motion.div>
            <motion.div variants={item} whileHover={hoverSpring} className="h-full">
              <PlanComparisonCard currentPlan="standard" />
            </motion.div>
          </div>

          {/* ─── ROW 5: 2 cards ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={item} whileHover={hoverSpring} className="h-full">
              <FirstPaymentCTA weeklyPremium={89} planName="Standard" />
            </motion.div>
            <motion.div variants={item} whileHover={hoverSpring} className="h-full">
              <PolicyActivatedScreen />
            </motion.div>
          </div>

          {/* ─── MARQUEE (Auto-scrolling) ─── */}
          <motion.div variants={item} className="mt-8 mb-4 overflow-hidden rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-sm py-3 relative">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50/90 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50/90 to-transparent z-10" />
            
            <motion.div 
              className="flex whitespace-nowrap items-center gap-10 px-4"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 30, repeat: Infinity }}
            >
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((text, i) => (
                <span key={i} className="text-sm font-bold text-slate-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  {text}
                </span>
              ))}
            </motion.div>
          </motion.div>

        </motion.div>

        {/* ─── FLOATING: SupportFAB ─── */}
        <SupportFAB />
      </div>
    </>
  );
}
