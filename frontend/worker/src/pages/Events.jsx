import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import EventSearch    from '../components/worker/EventSearch';
import EventTimeline  from '../components/worker/EventTimeline';
import EventCard      from '../components/worker/EventCard';
import ZoneMapOverlay from '../components/worker/ZoneMapOverlay';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } } };

const ALL_EVENTS = [
  { id: 1, type: 'Rain',   title: 'Heavy Monsoon Alert',  zone: 'Whitefield',  status: 'active',    time: 'Now',       multiplier: 'x1.8', payout: '₹600', description: 'Rainfall exceeds 32mm/hr. L2 trigger active. Payout guaranteed for shift loss.' },
  { id: 2, type: 'AQI',   title: 'AQI Hazard Warning',   zone: 'HSR Layout',  status: 'active',    time: '2h ago',    multiplier: null,    payout: '₹600', description: 'Air Quality Index 218. L1 health threshold breached. Payout processing.' },
  { id: 3, type: 'Surge', title: 'Weekend Peak Flow',    zone: 'Koramangala', status: 'scheduled', time: 'Sat 08:00', multiplier: 'x1.4', payout: '₹300', description: 'High demand surge expected. Earnings multiplier active for all shifts.' },
  { id: 4, type: 'Rain',  title: 'Drizzle Event Cleared', zone: 'Indiranagar', status: 'resolved',  time: 'Yesterday', multiplier: null,    payout: '₹450', description: 'Light rainfall event cleared. Payout of ₹450 processed successfully.' },
];

export default function Events() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = ALL_EVENTS.filter((e) =>
    !query ||
    e.title.toLowerCase().includes(query.toLowerCase()) ||
    e.zone.toLowerCase().includes(query.toLowerCase()) ||
    e.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 xl:px-10 w-full max-w-[1400px] mx-auto relative z-10">
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-5">

        <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="section-title">Active Events</h1>
            <p className="text-sm text-slate-500 mt-1">Dynamic zone scaling & surge multipliers</p>
          </div>
          <button onClick={() => navigate('/forecast')} className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            See Forecast →
          </button>
        </motion.div>

        <motion.div variants={item}><EventSearch onSearch={setQuery} /></motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Timeline */}
          <motion.div variants={item} className="lg:col-span-2 flex flex-col gap-4">
            <EventTimeline events={filtered} />

            {/* Event cards for active events */}
            <h2 className="font-black text-slate-800 text-sm uppercase tracking-widest mt-2">Event Details</h2>
            {filtered.map((ev) => (
              <EventCard key={ev.id} event={ev} onClick={setSelected} />
            ))}
            {filtered.length === 0 && (
              <div className="card p-8 text-center text-slate-400 text-sm">No events match "{query}"</div>
            )}
          </motion.div>

          {/* Zone map */}
          <motion.div variants={item}>
            <ZoneMapOverlay />
          </motion.div>
        </div>

        {/* Selected event detail drawer */}
        {selected && (
          <>
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setSelected(null)} />
            <div className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-3xl p-6 shadow-2xl max-h-[70vh] overflow-y-auto animate-slide-in">
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
              <EventCard event={selected} />
              <button onClick={() => setSelected(null)} className="mt-4 w-full py-3 rounded-xl gradient-indigo text-white font-bold text-sm">Close</button>
            </div>
          </>
        )}

      </motion.div>
    </div>
  );
}
