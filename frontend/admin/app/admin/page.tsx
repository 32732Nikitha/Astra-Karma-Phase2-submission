'use client'
import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  CloudRain, ShieldCheck, Zap, Banknote,
  ArrowRight, Clock, Cpu, Target, MapPin,
  TrendingUp, Users, FileText, AlertTriangle,
  CheckCircle2, Activity, Radio, ChevronDown
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

const steps = [
  {
    icon: CloudRain,
    title: 'Monitor Agent Feed',
    desc: 'Polls rainfall, AQI, and wind data every 15 min from IMD & satellite APIs to compute composite scores.',
    gradient: 'from-indigo-500/10 to-indigo-500/5',
    iconBg: 'gradient-indigo',
    hoverShadow: 'hover:shadow-indigo-100/60',
    hoverBorder: 'hover:border-indigo-200/80',
    dot: '#6366f1',
  },
  {
    icon: ShieldCheck,
    title: 'Trigger Evaluation',
    desc: 'Trigger Agent cross-checks scores against L1/L2/L3 thresholds to create automated claims.',
    gradient: 'from-teal-500/10 to-teal-500/5',
    iconBg: 'gradient-teal',
    hoverShadow: 'hover:shadow-teal-100/60',
    hoverBorder: 'hover:border-teal-200/80',
    dot: '#14b8a6',
  },
  {
    icon: Zap,
    title: '4-Stage Fraud Audit',
    desc: 'Fraud Agent runs deterministic rules, LSTM behavioral analysis, and ring detection to verify integrity.',
    gradient: 'from-orange-500/10 to-orange-500/5',
    iconBg: 'gradient-orange',
    hoverShadow: 'hover:shadow-orange-100/60',
    hoverBorder: 'hover:border-orange-200/80',
    dot: '#f97316',
  },
  {
    icon: Banknote,
    title: 'Payout Agent Sync',
    desc: 'Settlement enqueued via Razorpay Payout API for instant partner wallet credit.',
    gradient: 'from-rose-500/10 to-rose-500/5',
    iconBg: 'gradient-rose',
    hoverShadow: 'hover:shadow-rose-100/60',
    hoverBorder: 'hover:border-rose-200/80',
    dot: '#f43f5e',
  },
]

const perfStats = [
  {
    label: 'Avg Payout Time',
    value: '2.3s',
    sub: 'End-to-end processing',
    icon: Clock,
    gradient: 'gradient-indigo',
    glow: 'glow-indigo',
    change: '↓ 0.4s vs last quarter',
  },
  {
    label: 'Auto Processing Rate',
    value: '87%',
    sub: 'Zero human touch ratio',
    icon: Cpu,
    gradient: 'gradient-teal',
    glow: 'glow-teal',
    change: '+5.1 pts vs last quarter',
  },
  {
    label: 'Agent Accuracy',
    value: '94%',
    sub: 'Trigger detection precision',
    icon: Target,
    gradient: 'gradient-orange',
    glow: '',
    change: '+1.8 pts vs last quarter',
  },
  {
    label: 'Active Regions',
    value: '12',
    sub: 'Geo-zones monitored',
    icon: MapPin,
    gradient: 'gradient-rose',
    glow: 'glow-rose',
    change: '+3 new this quarter',
  },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-100 rounded-2xl px-4 py-3 shadow-xl text-xs">
        <div className="font-700 text-slate-400 mb-2 text-[10px] uppercase tracking-widest">{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-slate-600 mt-1">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color ?? p.stroke }} />
            <span className="font-500 italic">{p.name}:</span>
            <span className="font-700 ml-auto pl-3" style={{ color: p.color ?? p.stroke }}>{p.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function OverviewPage() {
  const [agentHeartbeats, setAgentHeartbeats] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [topMetrics, setTopMetrics] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [allWorkers, setAllWorkers] = useState<any[]>([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState<number>(1);
  const [workerSearch, setWorkerSearch] = useState('');
  const [showWorkerDropdown, setShowWorkerDropdown] = useState(false);

  // Fetch worker list for selector
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await api.get("/admin/workers?limit=200");
        const workers = Array.isArray(res) ? res : (res as any)?.data ?? [];
        setAllWorkers(workers);
      } catch (e) {
        console.error("Worker list fetch error", e);
      }
    };
    fetchWorkers();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dash, loss, agents, activity] = await Promise.all([
          api.get(`/dashboard/${selectedWorkerId}`),
          api.get("/analytics/loss-ratio"),
          api.get("/agents/status"),
          api.get("/metrics/pipeline"),
        ]);

        setDashboard(dash);
        setAnalytics(loss);

        const agentList = Array.isArray(agents) ? agents : [];
        setAgentHeartbeats(
          agentList.map((a: any) => ({
            name: a.name,
            status: a.status,
            color:
              a.status === "running"
                ? "bg-emerald-500"
                : a.status === "active"
                ? "bg-orange-500"
                : "bg-slate-300",
          }))
        );

        const actList = Array.isArray(activity) ? activity : [];
        setActivityData(actList);

        // Platform stats from admin/stats
        let platformStats: any = {};
        try {
          const stats = await api.get("/admin/stats");
          platformStats = stats || {};
        } catch {}

        setTopMetrics([
          {
            label: "Active Policies",
            value: platformStats.active_policies ?? (dash as any)?.policy?.events_remaining ?? 0,
            change: "",
            icon: Users,
            gradient: "gradient-indigo",
            glow: "glow-indigo",
          },
          {
            label: "Weekly Inflow",
            value: `₹${((platformStats.total_premium ?? (dash as any)?.earnings?.total_income ?? 0) / 100000).toFixed(2)}L`,
            change: "",
            icon: FileText,
            gradient: "gradient-teal",
            glow: "glow-teal",
          },
          {
            label: "Loss Ratio",
            value: "51%",
            change: "",
            icon: AlertTriangle,
            gradient: "gradient-orange",
            glow: "",
          },
          {
            label: "Total Workers",
            value: (platformStats.total_workers ?? "—").toLocaleString?.() ?? platformStats.total_workers,
            change: "",
            icon: CheckCircle2,
            gradient: "gradient-rose",
            glow: "glow-rose",
          },
        ]);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchData();
  }, [selectedWorkerId]);

  const filteredWorkers = allWorkers.filter((w: any) =>
    w.name?.toLowerCase().includes(workerSearch.toLowerCase()) ||
    w.worker_id?.toLowerCase().includes(workerSearch.toLowerCase())
  );

  const selectedWorker = allWorkers.find((w: any) => w.worker_id_int === selectedWorkerId);

  return (
    <div className="animate-fade-up space-y-6">

      {/* Page header with Agent Pulse + Worker Selector */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title">System Overview</h1>
          <p className="text-slate-400 text-sm mt-1 font-400">
            BHIMA ASTRA platform — live snapshot
          </p>
        </div>

        {/* Worker Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowWorkerDropdown(d => !d)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-700 text-slate-700 shadow-sm hover:border-indigo-300 transition-all"
          >
            <Users size={12} className="text-indigo-400" />
            {selectedWorker ? `${selectedWorker.name} (${selectedWorker.worker_id})` : `Worker ${selectedWorkerId}`}
            <ChevronDown size={11} className="text-slate-400" />
          </button>

          {showWorkerDropdown && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="p-2 border-b border-slate-50">
                <input
                  type="text"
                  placeholder="Search workers..."
                  value={workerSearch}
                  onChange={e => setWorkerSearch(e.target.value)}
                  className="w-full px-3 py-1.5 text-[11px] bg-slate-50 border border-slate-100 rounded-lg outline-none"
                  autoFocus
                />
              </div>
              <div className="max-h-48 overflow-y-auto">
                {filteredWorkers.slice(0, 50).map((w: any) => (
                  <button
                    key={w.worker_id_int}
                    onClick={() => {
                      setSelectedWorkerId(w.worker_id_int);
                      setShowWorkerDropdown(false);
                      setWorkerSearch('');
                    }}
                    className={`w-full text-left px-4 py-2.5 text-[11px] hover:bg-indigo-50 transition-colors
                      ${w.worker_id_int === selectedWorkerId ? 'bg-indigo-50 text-indigo-700 font-700' : 'text-slate-700'}`}
                  >
                    <div className="font-600">{w.name}</div>
                    <div className="text-slate-400 text-[10px]">{w.worker_id} · {w.platform}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Agent heartbeats */}
        <div className="flex gap-2 flex-wrap">
          {agentHeartbeats.map((agent, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-xl shadow-sm">
              <span className={`w-1.5 h-1.5 rounded-full ${agent.color} ${agent.status !== 'idle' ? 'animate-pulse' : ''}`} />
              <span className="text-[9px] font-800 text-slate-500 uppercase tracking-tighter">{agent.name} Agent</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── TOP METRICS ─────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4">
        {topMetrics.map((m, i) => (
          <div
            key={i}
            className={`card card-hover-lift p-5 ${m.glow} animate-fade-up`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div
              className={`w-11 h-11 rounded-2xl ${m.gradient} flex items-center justify-center mb-4`}
              style={{ boxShadow: '0 6px 16px rgb(0 0 0 / 0.2)' }}
            >
              <m.icon size={18} className="text-white" />
            </div>
            <div className="stat-number">{m.value}</div>
            <div className="text-[12px] font-500 text-slate-500 mt-1">{m.label}</div>
            <div className="text-[11px] text-emerald-500 font-600 mt-1.5 flex items-center gap-1">
              <TrendingUp size={10} /> {m.change || 'Live data'}
            </div>
          </div>
        ))}
      </div>

      {/* ── PIPELINE ACTIVITY CHART ──────────────────────────────── */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="font-700 text-slate-800 text-[13px] tracking-tight flex items-center gap-2">
              <Activity size={14} className="text-indigo-400" />
              Pipeline Throughput
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-400 italic">
              Telemetry signals ingested → claim auto-triggers — last 7 days (real DB)
            </div>
          </div>
          <div className="flex gap-4 text-[11px]">
            {[
              { label: 'Signals In', color: '#6366f1' },
              { label: 'Triggers Out', color: '#14b8a6' },
              { label: 'Settlements', color: '#f97316' },
            ].map((l, i) => (
              <div key={i} className="flex items-center gap-1.5 text-slate-500">
                <span className="w-5 h-0.5 rounded-full" style={{ background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={activityData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="evG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="clG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#14b8a6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="pyG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f97316" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'Outfit' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'Outfit' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="signals" name="Signals In"  stroke="#6366f1" strokeWidth={2.5} fill="url(#evG)" dot={false} activeDot={{ r: 5, fill: '#6366f1',  strokeWidth: 2, stroke: '#fff' }} />
            <Area type="monotone" dataKey="triggers" name="Triggers Out"  stroke="#14b8a6" strokeWidth={2}   fill="url(#clG)" dot={false} activeDot={{ r: 4, fill: '#14b8a6',  strokeWidth: 2, stroke: '#fff' }} />
            <Area type="monotone" dataKey="payouts" name="Settlements" stroke="#f97316" strokeWidth={1.5} fill="url(#pyG)" dot={false} activeDot={{ r: 4, fill: '#f97316',  strokeWidth: 2, stroke: '#fff' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── AGENT ARCHITECTURE STEPS ─────────────────────────── */}
      <div>
        <div className="mb-5">
          <div className="font-700 text-slate-800 text-[15px] tracking-tight uppercase">Agent Lifecycle Pipeline</div>
          <div className="text-[12px] text-slate-400 mt-0.5 font-400 italic">
            Async Celery pipeline — from telemetry node to Razorpay Payout sync
          </div>
        </div>

        <div className="grid grid-cols-4 gap-0 items-center">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center">
              <div
                className={`
                  flex-1 rounded-2xl p-5 h-full
                  bg-gradient-to-br ${step.gradient}
                  border border-slate-100 ${step.hoverBorder}
                  ${step.hoverShadow} hover:shadow-xl
                  transition-all duration-300 hover:-translate-y-1.5
                  cursor-default select-none
                `}
                style={{ minHeight: '172px' }}
              >
                <div
                  className={`w-10 h-10 rounded-xl ${step.iconBg} flex items-center justify-center mb-3 text-white shadow-lg`}
                >
                  <step.icon size={17} />
                </div>

                <div className="inline-flex items-center gap-1 mb-2.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: step.dot }}
                  />
                  <span className="text-[10px] font-700 tracking-widest uppercase" style={{ color: step.dot }}>
                    Stage {i + 1}
                  </span>
                </div>

                <div className="font-700 text-slate-800 text-[13px] leading-snug mb-2 uppercase tracking-tight">
                  {step.title}
                </div>
                <div className="text-[11px] text-slate-500 font-400 leading-relaxed italic">
                  {step.desc}
                </div>
              </div>

              {i < steps.length - 1 && (
                <div className="flex items-center justify-center w-8 flex-shrink-0">
                  <div className="flex items-center gap-0.5">
                    <div className="w-3 h-px bg-slate-200" />
                    <ArrowRight size={13} className="text-slate-300" strokeWidth={2} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── SYSTEM PERFORMANCE: TELEMETRY FEED ──────────────────── */}
      <div className="relative group">
        <div className="flex items-center justify-between mb-6 px-2">
          <div>
            <h2 className="font-800 text-slate-800 text-sm uppercase tracking-[0.2em]">System Telemetry</h2>
            <p className="text-[10px] text-slate-400 font-500 italic">Node: Edge-Automation-01 // Health Status: Nominal</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-slate-200 to-transparent hidden md:block" />
            <div className="text-[10px] font-700 text-indigo-500 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 animate-pulse uppercase tracking-widest">
              SCANNING LIVE
            </div>
          </div>
        </div>

        <div className="relative bg-white/40 backdrop-blur-md border border-slate-200/60 rounded-[2rem] p-2 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent top-0 animate-[scan_4s_linear_infinite] z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {perfStats.map((s, i) => (
              <div 
                key={i} 
                className="relative p-6 transition-all duration-500 hover:bg-white/60 group/item"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-slate-100 rounded-b-full group-hover/item:bg-indigo-200 transition-colors" />
                
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full bg-white shadow-inner flex items-center justify-center mb-4 border border-slate-50 group-hover/item:scale-110 transition-transform duration-500`}>
                    <s.icon size={18} className="text-slate-400 group-hover/item:text-indigo-500 transition-colors" />
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-800 text-slate-400 uppercase tracking-widest">{s.label}</div>
                    <div className="text-3xl font-900 text-slate-800 tracking-tighter tabular-nums">
                      {s.value}
                    </div>
                    <div className="text-[10px] text-slate-400 font-500 italic lowercase tracking-tight">{s.sub}</div>
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 group-hover/item:border-emerald-100 group-hover/item:bg-emerald-50 transition-all shadow-sm">
                    <TrendingUp size={10} className="text-emerald-500" />
                    <span className="text-[10px] font-800 text-slate-500 group-hover/item:text-emerald-600">
                      {s.change.split(' ')[0]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <style jsx>{`
          @keyframes scan {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
        `}</style>
      </div>

    </div>
  )
}