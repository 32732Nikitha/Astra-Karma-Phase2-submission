'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import api from '@/lib/api'
import {
  Droplets, Eye, Zap, Users, RefreshCw, Play, Pause,
  CheckCircle2, XCircle, Clock, TrendingUp, Activity,
  AlertTriangle, MapPin, Database, BarChart2, Terminal, Wifi, ChevronDown
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend
} from 'recharts'

// ─── TYPES ────────────────────────────────────────────────────────────────────

type RiskLevel = 'critical' | 'high' | 'medium' | 'low'

interface Trigger {
  id: string
  type: string
  composite_score: number
  city: string
  geo_zone_id: string
  risk: RiskLevel
  status: 'live' | 'paused'
  timestamp: string
  R_norm: number
  AQI_norm: number
  Traffic_norm: number
  Wind_norm: number
  disruption_flag: boolean
  curfew_flag: boolean
  strike_flag: boolean
  automated_action: string
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const TRIGGER_TYPES = ['Hydro Stress', 'Optical Blur', 'Kinetic Drag', 'Social Disruption', 'AGENT SYNC']

const mockTriggers: Trigger[] = [
  { id: 'TRG-001', type: 'Hydro Stress', composite_score: 0.87, city: 'Mumbai', geo_zone_id: 'MH-12', risk: 'critical', status: 'live', timestamp: '2025-03-21 08:14', R_norm: 0.91, AQI_norm: 0.44, Traffic_norm: 0.78, Wind_norm: 0.62, disruption_flag: true, curfew_flag: false, strike_flag: false, automated_action: 'Claim auto-raised' },
  { id: 'TRG-002', type: 'Optical Blur', composite_score: 0.73, city: 'Delhi', geo_zone_id: 'DL-07', risk: 'high', status: 'live', timestamp: '2025-03-21 07:52', R_norm: 0.31, AQI_norm: 0.88, Traffic_norm: 0.55, Wind_norm: 0.40, disruption_flag: false, curfew_flag: false, strike_flag: false, automated_action: 'Manual review queued' },
  { id: 'TRG-003', type: 'Kinetic Drag', composite_score: 0.61, city: 'Bengaluru', geo_zone_id: 'KA-03', risk: 'medium', status: 'live', timestamp: '2025-03-21 07:30', R_norm: 0.22, AQI_norm: 0.35, Traffic_norm: 0.91, Wind_norm: 0.28, disruption_flag: false, curfew_flag: false, strike_flag: true, automated_action: 'Alert sent' },
  { id: 'TRG-004', type: 'Social Disruption', composite_score: 0.55, city: 'Hyderabad', geo_zone_id: 'TS-04', risk: 'medium', status: 'paused', timestamp: '2025-03-21 06:45', R_norm: 0.18, AQI_norm: 0.29, Traffic_norm: 0.44, Wind_norm: 0.77, disruption_flag: true, curfew_flag: true, strike_flag: false, automated_action: 'Paused by ops' },
  { id: 'TRG-005', type: 'AGENT SYNC', composite_score: 0.48, city: 'Chennai', geo_zone_id: 'TN-06', risk: 'low', status: 'live', timestamp: '2025-03-21 06:10', R_norm: 0.14, AQI_norm: 0.21, Traffic_norm: 0.33, Wind_norm: 0.55, disruption_flag: false, curfew_flag: false, strike_flag: false, automated_action: 'No action' },
]

const riskSummary = { critical: 1, high: 3, medium: 8, low: 14, total: 26 }

const systemPulse = [
  'Monitor Agent polled IMD at 08:15 — R_norm: 0.91 (MH-12)',
  'Trigger Agent fired: TRG-001 composite_score=0.87 — claim auto-raised',
  'Fraud Agent queued: TRG-001 → Stage 1 deterministic pass',
  'AQI_norm spike detected in DL-07 — Optical Blur threshold crossed',
  'AGENT SYNC: Manager disruption_flag set for TN-06',
  'Payout Agent: ₹4,200 settled for WRK-0391 (Mumbai)',
]

const compositeScoreData = [
  { zone: 'MH-12', R_norm: 0.91, AQI_norm: 0.44, Traffic_norm: 0.78, Wind_norm: 0.62, composite: 0.87 },
  { zone: 'DL-07', R_norm: 0.31, AQI_norm: 0.88, Traffic_norm: 0.55, Wind_norm: 0.40, composite: 0.73 },
  { zone: 'KA-03', R_norm: 0.22, AQI_norm: 0.35, Traffic_norm: 0.91, Wind_norm: 0.28, composite: 0.61 },
  { zone: 'TS-04', R_norm: 0.18, AQI_norm: 0.29, Traffic_norm: 0.44, Wind_norm: 0.77, composite: 0.55 },
  { zone: 'TN-06', R_norm: 0.14, AQI_norm: 0.21, Traffic_norm: 0.33, Wind_norm: 0.55, composite: 0.48 },
]

const historyData = [
  { hour: '00:00', hydro: 2, optical: 1, kinetic: 0, social: 1, agent: 0 },
  { hour: '02:00', hydro: 1, optical: 2, kinetic: 1, social: 0, agent: 1 },
  { hour: '04:00', hydro: 3, optical: 1, kinetic: 2, social: 2, agent: 0 },
  { hour: '06:00', hydro: 5, optical: 3, kinetic: 2, social: 3, agent: 1 },
  { hour: '08:00', hydro: 8, optical: 4, kinetic: 5, social: 2, agent: 2 },
  { hour: '10:00', hydro: 6, optical: 5, kinetic: 4, social: 1, agent: 1 },
  { hour: '12:00', hydro: 4, optical: 6, kinetic: 3, social: 4, agent: 2 },
]

const apiHealth = [
  { name: 'IMD', latency: 142, status: 'healthy' },
  { name: 'CPCB', latency: 218, status: 'healthy' },
  { name: 'OWM', latency: 89, status: 'healthy' },
  { name: 'Razorpay', latency: 334, status: 'degraded' },
  { name: 'GMaps', latency: 512, status: 'degraded' },
]

const liveDataFeed = {
  rainfall: 38.4,
  aqi: 187,
  traffic: 74,
  wind: 22,
}

const riskColors: Record<RiskLevel, string> = {
  critical: 'text-rose-600 bg-rose-50 border-rose-200',
  high: 'text-orange-600 bg-orange-50 border-orange-200',
  medium: 'text-amber-600 bg-amber-50 border-amber-200',
  low: 'text-emerald-600 bg-emerald-50 border-emerald-200',
}

const typeIcons: Record<string, any> = {
  'Hydro Stress': Droplets,
  'Optical Blur': Eye,
  'Kinetic Drag': Zap,
  'Social Disruption': Users,
  'AGENT SYNC': RefreshCw,
}

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white/95 border border-slate-100 rounded-xl px-3 py-2 shadow-lg text-xs">
        <div className="font-700 text-slate-400 text-[10px] mb-1">{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-slate-600">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color ?? p.fill }} />
            <span>{p.name}: <b>{p.value}</b></span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// ─── ZONE TRIGGER MAP PLACEHOLDER ────────────────────────────────────────────

function ZoneTriggerMap() {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-indigo-400" />
          <span className="font-700 text-slate-800 text-[13px] uppercase tracking-tight">Zone Trigger Map</span>
        </div>
        <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg font-700">Mapbox GL — requires MAPBOX_TOKEN env</span>
      </div>
      <div className="h-[280px] bg-gradient-to-br from-slate-100 to-slate-50 flex flex-col items-center justify-center gap-3 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 40%, #6366f1 0%, transparent 50%), radial-gradient(circle at 70% 60%, #f43f5e 0%, transparent 50%)',
          }}
        />
        {/* Mock zone dots */}
        {mockTriggers.map((t, i) => (
          <div key={t.id}
            className="absolute flex items-center justify-center"
            style={{
              left: `${20 + i * 15}%`, top: `${30 + (i % 3) * 15}%`,
            }}
          >
            <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md animate-pulse
              ${t.risk === 'critical' ? 'bg-rose-500' : t.risk === 'high' ? 'bg-orange-400' : t.risk === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'}`}
            />
            <span className="absolute -bottom-4 text-[9px] font-700 text-slate-500 whitespace-nowrap">{t.geo_zone_id}</span>
          </div>
        ))}
        <MapPin size={28} className="text-slate-300 relative z-10" />
        <span className="text-[11px] font-600 text-slate-400 relative z-10">Mapbox GL map loads with valid API token</span>
        <span className="text-[10px] text-slate-300 relative z-10">geo_zone_id fields: MH-12, DL-07, KA-03, TS-04, TN-06</span>
      </div>
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function TriggersPage() {
  const [feedLive, setFeedLive] = useState(true)
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all')
  const [pulseIdx, setPulseIdx] = useState(0)
  const [simType, setSimType] = useState('Hydro Stress')
  const [simScore, setSimScore] = useState(75)
  const [simResult, setSimResult] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'feed' | 'composite' | 'history'>('feed')
  const pulseRef = useRef<NodeJS.Timeout | null>(null)

  // ── Worker Selector ────────────────────────────────────────────────────────
  const [workerList, setWorkerList] = useState<{ worker_id: number; name: string }[]>([])
  const [selectedWorkerId, setSelectedWorkerId] = useState<number>(1)
  const [loadingWorkers, setLoadingWorkers] = useState(false)

  // ── Live Triggers from API ─────────────────────────────────────────────────
  const [liveTrigger, setLiveTrigger] = useState<any>(null)
  const [triggerHistory, setTriggerHistory] = useState<any[]>([])
  const [apiLoading, setApiLoading] = useState(false)
  const [simLoading, setSimLoading] = useState(false)

  // Fetch worker list for selector
  const fetchWorkers = useCallback(async () => {
    setLoadingWorkers(true)
    try {
      const res = await api.get('/admin/workers?limit=50')
      const raw = Array.isArray(res) ? res : (res as any)?.data ?? []
      setWorkerList(raw.map((w: any) => ({ worker_id: w.worker_id_int ?? w.worker_id, name: w.name })))
      if (raw.length > 0) setSelectedWorkerId(raw[0].worker_id_int ?? raw[0].worker_id)
    } catch (e) {
      console.error('Failed to fetch workers', e)
    } finally {
      setLoadingWorkers(false)
    }
  }, [])

  // Fetch live trigger data for selected worker
  const fetchLiveData = useCallback(async (wid: number) => {
    setApiLoading(true)
    try {
      const [liveRes, histRes] = await Promise.allSettled([
        api.get(`/triggers/live/${wid}`),
        api.get(`/triggers/history/${wid}`),
      ])
      if (liveRes.status === 'fulfilled') setLiveTrigger(liveRes.value)
      if (histRes.status === 'fulfilled') setTriggerHistory(Array.isArray(histRes.value) ? histRes.value : [])
    } catch (e) {
      console.error('Trigger fetch error', e)
    } finally {
      setApiLoading(false)
    }
  }, [])

  useEffect(() => { fetchWorkers() }, [fetchWorkers])
  useEffect(() => { fetchLiveData(selectedWorkerId) }, [selectedWorkerId, fetchLiveData])

  // System pulse animation
  useEffect(() => {
    if (feedLive) {
      pulseRef.current = setInterval(() => setPulseIdx(i => (i + 1) % systemPulse.length), 5000)
    }
    return () => { if (pulseRef.current) clearInterval(pulseRef.current) }
  }, [feedLive])

  const filtered = mockTriggers.filter(t => riskFilter === 'all' || t.risk === riskFilter)

  const handleSimulate = async () => {
    setSimLoading(true); setSimResult(null)
    try {
      const res = await api.post(`/triggers/simulate/${selectedWorkerId}`, {
        rainfall: simScore > 60 ? 40 : 10,
        temperature: 32,
        aqi: simScore > 70 ? 200 : 80,
        traffic_index: simScore > 50 ? 0.8 : 0.3,
      })
      const action = simScore >= 85 ? 'Auto-Reject (High Fraud Risk)'
        : simScore >= 60 ? 'Manual Review Queued'
        : simScore >= 20 ? 'Claim Auto-Raised'
        : 'No Action'
      setSimResult(`[API] composite_score=${(simScore / 100).toFixed(2)} → ${action}`)
      // Refresh live data after simulate
      fetchLiveData(selectedWorkerId)
    } catch {
      // Fallback to local calculation if API fails
      const action = simScore >= 85 ? 'Auto-Reject (Fraud)' : simScore >= 60 ? 'Manual Review Queued' : simScore >= 20 ? 'Claim Auto-Raised' : 'No Action'
      setSimResult(`[Local] composite_score=${(simScore / 100).toFixed(2)} → ${action}`)
    } finally {
      setSimLoading(false)
    }
  }

  return (
    <div className="animate-fade-up space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Live Triggers</h1>
          <p className="text-slate-400 text-sm mt-1 font-400">Real-time parametric event feed — composite_score per zone</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Worker Selector */}
          <div className="relative">
            <select
              id="triggers-worker-selector"
              value={selectedWorkerId}
              onChange={e => setSelectedWorkerId(Number(e.target.value))}
              disabled={loadingWorkers}
              className="appearance-none pl-3 pr-8 py-2 text-[11px] font-700 text-slate-700 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none hover:border-indigo-300 transition-all cursor-pointer disabled:opacity-50"
            >
              {workerList.length === 0 && <option value={1}>Worker #1</option>}
              {workerList.map(w => (
                <option key={w.worker_id} value={w.worker_id}>{w.name} (#{w.worker_id})</option>
              ))}
            </select>
            <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <div className="text-[10px] font-700 text-slate-400 bg-white border border-slate-100 px-3 py-1.5 rounded-xl">
            Auto-refresh: {feedLive ? '5s' : 'Paused'}
          </div>
          <button
            onClick={() => setFeedLive(f => !f)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-700 uppercase tracking-wide transition-all
              ${feedLive ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            {feedLive ? <><Pause size={12} /> Live</> : <><Play size={12} /> Paused</>}
          </button>
        </div>
      </div>

      {/* ── RISK SUMMARY BAR ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Total', val: riskSummary.total, color: 'text-slate-600', bg: 'bg-slate-50 border-slate-100' },
          { label: 'Critical', val: riskSummary.critical, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' },
          { label: 'High', val: riskSummary.high, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100' },
          { label: 'Medium', val: riskSummary.medium, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
          { label: 'Low', val: riskSummary.low, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
        ].map(s => (
          <div key={s.label} className={`card p-4 border ${s.bg}`}>
            <div className={`text-2xl font-900 tabular-nums ${s.color}`}>{s.val}</div>
            <div className="text-[10px] font-700 text-slate-400 uppercase tracking-wide mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── SYSTEM PULSE TICKER ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900 rounded-xl overflow-hidden">
        <Activity size={12} className="text-emerald-400 flex-shrink-0 animate-pulse" />
        <span className="text-[11px] font-500 text-emerald-300 transition-all duration-700 truncate font-mono">
          {systemPulse[pulseIdx]}
        </span>
      </div>

      {/* ── LIVE DATA FEED ──────────────────────────────────────────────────── */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Database size={13} className="text-teal-500" />
          <span className="font-700 text-slate-800 text-[13px] uppercase tracking-tight">Live Data Feed</span>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg font-700 ml-auto">
            {apiLoading ? 'Loading…' : `Worker #${selectedWorkerId}`}
          </span>
          {liveTrigger?.disruption_flag && (
            <span className="text-[10px] text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-lg font-700 animate-pulse">
              ⚠ DISRUPTION ACTIVE
            </span>
          )}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Rainfall', val: liveTrigger ? `${(liveTrigger.rainfall ?? liveDataFeed.rainfall).toFixed(1)} mm/hr` : `${liveDataFeed.rainfall} mm/hr`, sub: 'IMD live', color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-100' },
            { label: 'AQI', val: liveTrigger ? (liveTrigger.aqi ?? liveDataFeed.aqi) : liveDataFeed.aqi, sub: 'CPCB PM2.5', color: 'text-orange-500', bg: 'bg-orange-50 border-orange-100' },
            { label: 'Temperature', val: liveTrigger ? `${(liveTrigger.temperature ?? 30).toFixed(1)}°C` : '—', sub: 'OpenWeather', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100' },
            { label: 'Traffic Index', val: liveTrigger ? `${((liveTrigger.traffic_index ?? 0.74) * 100).toFixed(0)}%` : `${liveDataFeed.traffic}%`, sub: 'congestion', color: 'text-teal-500', bg: 'bg-teal-50 border-teal-100' },
          ].map(f => (
            <div key={f.label} className={`border rounded-xl px-4 py-3 ${f.bg}`}>
              <div className={`text-xl font-900 tabular-nums ${f.color}`}>{f.val}</div>
              <div className="text-[10px] font-700 text-slate-500 uppercase tracking-wide mt-0.5">{f.label}</div>
              <div className="text-[9px] text-slate-400 italic mt-0.5">{f.sub}</div>
            </div>
          ))}
        </div>
        {liveTrigger && (
          <div className="mt-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-500 font-500 flex items-center gap-4">
            <span>composite_score: <b className="text-indigo-600">{(liveTrigger.composite_score ?? 0).toFixed(3)}</b></span>
            <span>disruption_flag: <b className={liveTrigger.disruption_flag ? 'text-rose-500' : 'text-emerald-500'}>{liveTrigger.disruption_flag ? 'TRUE' : 'FALSE'}</b></span>
          </div>
        )}
      </div>

      {/* ── ZONE TRIGGER MAP ────────────────────────────────────────────────── */}
      <ZoneTriggerMap />

      {/* ── RISK FILTER ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {(['all', 'critical', 'high', 'medium', 'low'] as const).map(f => (
          <button
            key={f}
            onClick={() => setRiskFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-800 uppercase tracking-wide transition-all border
              ${riskFilter === f
                ? f === 'all' ? 'gradient-indigo text-white border-indigo-400'
                  : f === 'critical' ? 'bg-rose-500 text-white border-rose-500'
                  : f === 'high' ? 'bg-orange-500 text-white border-orange-500'
                  : f === 'medium' ? 'bg-amber-400 text-white border-amber-400'
                  : 'bg-emerald-500 text-white border-emerald-500'
                : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── TABS: FEED / COMPOSITE TABLE / HISTORY ─────────────────────────── */}
      <div className="card overflow-hidden">
        <div className="flex border-b border-slate-50">
          {[
            { key: 'feed', label: 'Trigger Feed', icon: Activity },
            { key: 'composite', label: 'Composite Score Table', icon: BarChart2 },
            { key: 'history', label: 'Trigger History Chart', icon: TrendingUp },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-5 py-3.5 text-[11px] font-700 uppercase tracking-wide transition-colors
                ${activeTab === tab.key ? 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/40' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* TRIGGER FEED */}
        {activeTab === 'feed' && (
          <div className="divide-y divide-slate-50">
            {filtered.map(t => {
              const Icon = typeIcons[t.type] ?? Zap
              return (
                <div key={t.id} className="px-5 py-4 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl gradient-indigo flex items-center justify-center flex-shrink-0">
                        <Icon size={15} className="text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-800 text-slate-800 text-[13px]">{t.id}</span>
                          <span className={`text-[10px] font-700 px-2 py-0.5 rounded-lg border ${riskColors[t.risk]}`}>{t.risk.toUpperCase()}</span>
                          {t.disruption_flag && <span className="text-[9px] font-700 text-violet-600 bg-violet-50 border border-violet-100 px-1.5 py-0.5 rounded">DISRUPTION</span>}
                          {t.curfew_flag && <span className="text-[9px] font-700 text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded">CURFEW</span>}
                          {t.strike_flag && <span className="text-[9px] font-700 text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded">STRIKE</span>}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {t.type} · {t.city} · <span className="font-700 text-slate-600">{t.geo_zone_id}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400">
                          <span>R_norm: <b className="text-indigo-500">{t.R_norm}</b></span>
                          <span>AQI_norm: <b className="text-orange-500">{t.AQI_norm}</b></span>
                          <span>Traffic: <b className="text-amber-500">{t.Traffic_norm}</b></span>
                          <span>Wind: <b className="text-teal-500">{t.Wind_norm}</b></span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="text-[13px] font-900 text-slate-800 tabular-nums">
                        {t.composite_score.toFixed(2)}
                        <span className="text-[10px] font-500 text-slate-400 ml-1">composite</span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock size={10} /> {t.timestamp}
                      </div>
                      <div className="text-[10px] font-700 text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-lg">
                        {t.automated_action}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button className="text-[10px] font-700 text-indigo-500 hover:text-indigo-700 px-2 py-1 bg-indigo-50 rounded-lg border border-indigo-100">Inspect</button>
                        <button className="text-[10px] font-700 text-rose-500 hover:text-rose-700 px-2 py-1 bg-rose-50 rounded-lg border border-rose-100">Pause</button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* COMPOSITE SCORE TABLE */}
        {activeTab === 'composite' && (
          <div className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="text-slate-400 font-700 uppercase tracking-wide text-[10px] border-b border-slate-50">
                    {['Zone', 'R_norm', 'AQI_norm', 'Traffic_norm', 'Wind_norm', 'composite_score'].map(h => (
                      <th key={h} className="text-left py-2 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compositeScoreData.map(row => (
                    <tr key={row.zone} className="border-b border-slate-50 hover:bg-slate-50/60">
                      <td className="py-2.5 pr-4 font-800 text-slate-700">{row.zone}</td>
                      <td className="py-2.5 pr-4"><span style={{ color: `hsl(${(1 - row.R_norm) * 120}, 70%, 45%)` }}>{row.R_norm}</span></td>
                      <td className="py-2.5 pr-4"><span style={{ color: `hsl(${(1 - row.AQI_norm) * 120}, 70%, 45%)` }}>{row.AQI_norm}</span></td>
                      <td className="py-2.5 pr-4"><span style={{ color: `hsl(${(1 - row.Traffic_norm) * 120}, 70%, 45%)` }}>{row.Traffic_norm}</span></td>
                      <td className="py-2.5 pr-4"><span style={{ color: `hsl(${(1 - row.Wind_norm) * 120}, 70%, 45%)` }}>{row.Wind_norm}</span></td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-1.5 max-w-[80px]">
                            <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${row.composite * 100}%` }} />
                          </div>
                          <span className="font-900 text-slate-800">{row.composite}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TRIGGER HISTORY CHART */}
        {activeTab === 'history' && (
          <div className="p-5">
            <div className="text-[11px] text-slate-400 italic mb-4">24h trigger volume by type</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={historyData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="hydro"   name="Hydro Stress"      stroke="#6366f1" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="optical" name="Optical Blur"      stroke="#14b8a6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="kinetic" name="Kinetic Drag"      stroke="#f97316" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="social"  name="Social Disruption" stroke="#f43f5e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="agent"   name="Agent Sync"        stroke="#a855f7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ── MANUAL TRIGGER SIMULATOR ────────────────────────────────────────── */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Terminal size={13} className="text-violet-500" />
          <span className="font-700 text-slate-800 text-[13px] uppercase tracking-tight">Manual Trigger Simulator</span>
          <span className="text-[10px] text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-lg font-700 ml-2">Testing Only</span>
        </div>
        <div className="flex items-end gap-4 flex-wrap">
          <div>
            <label className="text-[10px] font-700 text-slate-500 uppercase tracking-wide mb-1 block">Trigger Type</label>
            <select
              value={simType}
              onChange={e => setSimType(e.target.value)}
              className="px-3 py-2 text-[12px] font-600 text-slate-700 bg-slate-50 border border-slate-200 rounded-xl"
            >
              {TRIGGER_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-700 text-slate-500 uppercase tracking-wide mb-1 block">
              composite_score: <span className="text-indigo-600">{(simScore / 100).toFixed(2)}</span>
            </label>
            <input
              type="range" min={0} max={100} value={simScore}
              onChange={e => setSimScore(+e.target.value)}
              className="w-full h-1.5 accent-indigo-500"
            />
          </div>
          <button
            onClick={handleSimulate}
            disabled={simLoading}
            className="gradient-indigo text-white px-4 py-2 rounded-xl text-[11px] font-700 uppercase tracking-wide hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
          >
            {simLoading ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} />}
            {simLoading ? 'Simulating…' : `Simulate → Worker #${selectedWorkerId}`}
          </button>
        </div>
        {simResult && (
          <div className="mt-3 px-4 py-2.5 bg-slate-900 rounded-xl text-[11px] font-mono text-emerald-300">
            $ trigger_sim --type &quot;{simType}&quot; → {simResult}
          </div>
        )}
      </div>

      {/* ── API HEALTH INDICATORS ───────────────────────────────────────────── */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Wifi size={13} className="text-teal-500" />
          <span className="font-700 text-slate-800 text-[13px] uppercase tracking-tight">API Health Indicators</span>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {apiHealth.map(api => (
            <div key={api.name} className={`border rounded-xl px-4 py-3 text-center ${api.status === 'healthy' ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
              <div className={`text-[18px] font-900 tabular-nums ${api.status === 'healthy' ? 'text-emerald-600' : 'text-amber-600'}`}>{api.latency}<span className="text-[10px] font-500 ml-0.5">ms</span></div>
              <div className="text-[11px] font-800 text-slate-700 mt-1">{api.name}</div>
              <div className={`text-[9px] font-700 mt-0.5 uppercase ${api.status === 'healthy' ? 'text-emerald-500' : 'text-amber-500'}`}>{api.status}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}