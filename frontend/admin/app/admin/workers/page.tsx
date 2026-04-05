'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import {
  Search, Filter, Download, ChevronRight, X,
  AlertTriangle, CheckCircle2, Clock, TrendingUp,
  User, MapPin, Smartphone, ShieldAlert, Sliders, History
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'

// ─── TYPES ────────────────────────────────────────────────────────────────────

type RiskLevel = 'high' | 'medium' | 'low'
type Platform = 'Swiggy' | 'Zomato' | 'Dunzo' | 'ONDC' | 'BigBasket'
type PlanTier = 'Basic' | 'Standard' | 'Premium'
type VehicleCategory = '2W' | '3W' | 'EV'

interface Worker {
  worker_id: string
  name: string
  city: string
  geo_zone_id: string
  platform: Platform
  category: VehicleCategory
  plan_tier: PlanTier
  status: 'Active' | 'Inactive'
  trigger: string
  risk: RiskLevel
  fraud_risk_score: number
  kyc_verified: boolean
  device_id: string
  automated_action: string
  fraud_history: { date: string; score: number; reason: string }[]
  risk_breakdown: { component: string; score: number; weight: number }[]
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const mockWorkers: Worker[] = [
  {
    worker_id: 'WRK-0391', name: 'Rajan Pillai', city: 'Mumbai', geo_zone_id: 'MH-12',
    platform: 'Swiggy', category: '2W', plan_tier: 'Standard', status: 'Active',
    trigger: 'Hydro Stress', risk: 'high', fraud_risk_score: 0.72, kyc_verified: true,
    device_id: 'DEV-A1B2C3', automated_action: 'Claim flagged for review',
    fraud_history: [
      { date: '2025-03-10', score: 0.65, reason: 'GPS cluster match' },
      { date: '2025-02-18', score: 0.71, reason: 'Shared device_id' },
    ],
    risk_breakdown: [
      { component: 'R_norm', score: 0.91, weight: 30 },
      { component: 'AQI_norm', score: 0.44, weight: 20 },
      { component: 'Traffic_norm', score: 0.78, weight: 20 },
      { component: 'Wind_norm', score: 0.62, weight: 15 },
      { component: 'Disruption', score: 0.80, weight: 15 },
    ],
  },
  {
    worker_id: 'WRK-0214', name: 'Divya Krishnan', city: 'Delhi', geo_zone_id: 'DL-07',
    platform: 'Zomato', category: '2W', plan_tier: 'Premium', status: 'Active',
    trigger: 'Optical Blur', risk: 'medium', fraud_risk_score: 0.38, kyc_verified: true,
    device_id: 'DEV-X9Y8Z7', automated_action: 'Monitoring',
    fraud_history: [],
    risk_breakdown: [
      { component: 'R_norm', score: 0.31, weight: 30 },
      { component: 'AQI_norm', score: 0.88, weight: 20 },
      { component: 'Traffic_norm', score: 0.55, weight: 20 },
      { component: 'Wind_norm', score: 0.40, weight: 15 },
      { component: 'Disruption', score: 0.20, weight: 15 },
    ],
  },
  {
    worker_id: 'WRK-0578', name: 'Suresh Nair', city: 'Bengaluru', geo_zone_id: 'KA-03',
    platform: 'Dunzo', category: 'EV', plan_tier: 'Basic', status: 'Active',
    trigger: 'Kinetic Drag', risk: 'medium', fraud_risk_score: 0.51, kyc_verified: false,
    device_id: 'DEV-P3Q2R1', automated_action: 'KYC pending alert',
    fraud_history: [
      { date: '2025-03-01', score: 0.48, reason: 'GPS-tower delta high' },
    ],
    risk_breakdown: [
      { component: 'R_norm', score: 0.22, weight: 30 },
      { component: 'AQI_norm', score: 0.35, weight: 20 },
      { component: 'Traffic_norm', score: 0.91, weight: 20 },
      { component: 'Wind_norm', score: 0.28, weight: 15 },
      { component: 'Disruption', score: 0.40, weight: 15 },
    ],
  },
  {
    worker_id: 'WRK-0099', name: 'Kavitha Rao', city: 'Hyderabad', geo_zone_id: 'TS-04',
    platform: 'ONDC', category: '3W', plan_tier: 'Standard', status: 'Inactive',
    trigger: 'Social Disruption', risk: 'low', fraud_risk_score: 0.12, kyc_verified: true,
    device_id: 'DEV-M7N6O5', automated_action: 'No action',
    fraud_history: [],
    risk_breakdown: [
      { component: 'R_norm', score: 0.18, weight: 30 },
      { component: 'AQI_norm', score: 0.29, weight: 20 },
      { component: 'Traffic_norm', score: 0.44, weight: 20 },
      { component: 'Wind_norm', score: 0.77, weight: 15 },
      { component: 'Disruption', score: 0.10, weight: 15 },
    ],
  },
  {
    worker_id: 'WRK-0322', name: 'Arjun Mehta', city: 'Chennai', geo_zone_id: 'TN-06',
    platform: 'BigBasket', category: '2W', plan_tier: 'Basic', status: 'Active',
    trigger: 'AGENT SYNC', risk: 'low', fraud_risk_score: 0.08, kyc_verified: true,
    device_id: 'DEV-S4T3U2', automated_action: 'No action',
    fraud_history: [],
    risk_breakdown: [
      { component: 'R_norm', score: 0.14, weight: 30 },
      { component: 'AQI_norm', score: 0.21, weight: 20 },
      { component: 'Traffic_norm', score: 0.33, weight: 20 },
      { component: 'Wind_norm', score: 0.55, weight: 15 },
      { component: 'Disruption', score: 0.05, weight: 15 },
    ],
  },
]

// (fleetStats is now computed from allWorkers inside the component)

const riskTrendData = [
  { week: 'W1', high: 120, medium: 340, low: 890 },
  { week: 'W2', high: 145, medium: 310, low: 920 },
  { week: 'W3', high: 98,  medium: 360, low: 960 },
  { week: 'W4', high: 175, medium: 290, low: 870 },
  { week: 'W5', high: 160, medium: 330, low: 910 },
  { week: 'W6', high: 130, medium: 380, low: 950 },
  { week: 'W7', high: 115, medium: 350, low: 990 },
  { week: 'W8', high: 188, medium: 300, low: 840 },
]

const riskColors: Record<RiskLevel, string> = {
  high:   'text-rose-600 bg-rose-50 border-rose-200',
  medium: 'text-amber-600 bg-amber-50 border-amber-200',
  low:    'text-emerald-600 bg-emerald-50 border-emerald-200',
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white/95 border border-slate-100 rounded-xl px-3 py-2 shadow-lg text-xs">
        <div className="font-700 text-slate-400 text-[10px] mb-1">{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-slate-600">
            <span className="w-2 h-2 rounded-full" style={{ background: p.stroke }} />
            <span>{p.name}: <b>{p.value}</b></span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// ─── WORKER PROFILE DRAWER ────────────────────────────────────────────────────

function WorkerProfileDrawer({ worker, onClose }: { worker: Worker; onClose: () => void }) {
  const [manualRisk, setManualRisk] = useState<RiskLevel>(worker.risk)
  const [overrideNote, setOverrideNote] = useState('')
  const [overrideSaved, setOverrideSaved] = useState(false)

  const compositeScore = worker.risk_breakdown.reduce(
    (sum, r) => sum + r.score * (r.weight / 100), 0
  ).toFixed(3)

  const handleOverride = () => {
    setOverrideSaved(true)
    setTimeout(() => setOverrideSaved(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-[480px] h-full overflow-y-auto shadow-2xl border-l border-slate-100 animate-slide-left">
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-6 py-4 border-b border-slate-50 flex items-center justify-between z-10">
          <div>
            <div className="font-800 text-slate-800 text-[14px]">{worker.name}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{worker.worker_id} · {worker.platform}</div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={16} className="text-slate-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'City', value: worker.city, icon: MapPin },
              { label: 'Geo Zone', value: worker.geo_zone_id, icon: MapPin },
              { label: 'Platform', value: worker.platform, icon: User },
              { label: 'Vehicle', value: worker.category, icon: TrendingUp },
              { label: 'Plan Tier', value: worker.plan_tier, icon: CheckCircle2 },
              { label: 'KYC', value: worker.kyc_verified ? 'Verified ✓' : 'Pending ✗', icon: ShieldAlert },
            ].map(item => (
              <div key={item.label} className="bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
                <div className="text-[9px] font-700 text-slate-400 uppercase tracking-wide">{item.label}</div>
                <div className={`text-[12px] font-700 mt-0.5 ${item.label === 'KYC' && !worker.kyc_verified ? 'text-rose-500' : 'text-slate-700'}`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Device ID */}
          <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-900 rounded-xl">
            <Smartphone size={12} className="text-slate-400" />
            <span className="text-[10px] font-mono text-slate-300">device_id: {worker.device_id}</span>
          </div>

          {/* Risk Score Breakdown */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sliders size={13} className="text-indigo-500" />
              <span className="font-700 text-slate-800 text-[12px] uppercase tracking-wide">Risk Score Breakdown</span>
              <span className="ml-auto text-[13px] font-900 text-indigo-600">composite: {compositeScore}</span>
            </div>
            <div className="space-y-2">
              {worker.risk_breakdown.map(r => (
                <div key={r.component}>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="font-700 text-slate-600">{r.component}</span>
                    <span className="text-slate-400">weight {r.weight}% → <b className="text-slate-700">{(r.score * r.weight / 100).toFixed(3)}</b></span>
                  </div>
                  <div className="bg-slate-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${r.score * 100}%`,
                        background: r.score > 0.7 ? '#f43f5e' : r.score > 0.4 ? '#f97316' : '#14b8a6',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fraud Risk Score */}
          <div className="flex items-center justify-between px-4 py-3 bg-rose-50 border border-rose-100 rounded-xl">
            <div>
              <div className="text-[10px] font-700 text-rose-500 uppercase tracking-wide">fraud_risk_score</div>
              <div className="text-[22px] font-900 text-rose-700 tabular-nums">{worker.fraud_risk_score.toFixed(2)}</div>
            </div>
            <ShieldAlert size={28} className="text-rose-200" />
          </div>

          {/* Fraud History Panel */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <History size={13} className="text-orange-500" />
              <span className="font-700 text-slate-800 text-[12px] uppercase tracking-wide">Fraud History</span>
            </div>
            {worker.fraud_history.length === 0 ? (
              <div className="text-[11px] text-slate-400 italic px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">No fraud incidents recorded.</div>
            ) : (
              <div className="space-y-2">
                {worker.fraud_history.map((h, i) => (
                  <div key={i} className="px-3 py-2.5 bg-orange-50 border border-orange-100 rounded-xl">
                    <div className="flex justify-between">
                      <span className="text-[11px] font-700 text-orange-700">{h.reason}</span>
                      <span className="text-[10px] font-800 text-rose-600">{h.score}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{h.date}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Manual Risk Override */}
          <div className="border border-violet-100 bg-violet-50 rounded-xl px-4 py-4">
            <div className="flex items-center gap-2 mb-3">
              <Sliders size={13} className="text-violet-500" />
              <span className="font-700 text-violet-700 text-[12px] uppercase tracking-wide">Manual Risk Override</span>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                {(['high', 'medium', 'low'] as RiskLevel[]).map(r => (
                  <button
                    key={r}
                    onClick={() => setManualRisk(r)}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-800 uppercase border transition-all
                      ${manualRisk === r
                        ? r === 'high' ? 'bg-rose-500 text-white border-rose-500'
                          : r === 'medium' ? 'bg-amber-400 text-white border-amber-400'
                          : 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-white text-slate-500 border-slate-200'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <textarea
                value={overrideNote}
                onChange={e => setOverrideNote(e.target.value)}
                placeholder="Override reason / note..."
                className="w-full px-3 py-2 text-[11px] text-slate-700 bg-white border border-violet-100 rounded-xl resize-none h-16 focus:outline-none focus:border-violet-300"
              />
              <button
                onClick={handleOverride}
                className={`w-full py-2 rounded-xl text-[11px] font-700 uppercase tracking-wide transition-all
                  ${overrideSaved ? 'bg-emerald-500 text-white' : 'gradient-indigo text-white hover:opacity-90'}`}
              >
                {overrideSaved ? 'Override Saved ✓' : 'Apply Override'}
              </button>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes slide-left {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .animate-slide-left { animation: slide-left 0.25s cubic-bezier(0.25,0.46,0.45,0.94) both; }
      `}</style>
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function WorkersPage() {
  const [search, setSearch] = useState('')
  const [filterPlatform, setFilterPlatform] = useState<string>('all')
  const [filterRisk, setFilterRisk] = useState<string>('all')
  const [filterKYC, setFilterKYC] = useState<string>('all')
  const [filterPlan, setFilterPlan] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null)
  const [allWorkers, setAllWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch real workers from backend
  const fetchWorkers = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/workers?limit=200')
      const raw = Array.isArray(res) ? res : (res as any)?.data ?? []
      // Map API shape to Worker interface
      const mapped: Worker[] = raw.map((w: any) => ({
        worker_id: w.worker_id,
        worker_id_int: w.worker_id_int,
        name: w.name,
        city: w.city,
        geo_zone_id: w.geo_zone_id,
        platform: w.platform as Platform,
        category: (w.vehicle_type || '2W') as VehicleCategory,
        plan_tier: (w.plan_tier || 'Basic') as PlanTier,
        status: w.status,
        trigger: w.trigger || 'None',
        risk: w.risk as RiskLevel,
        fraud_risk_score: w.fraud_risk_score,
        kyc_verified: w.kyc_verified,
        device_id: w.device_id || 'N/A',
        automated_action: w.fraud_risk_score > 0.6
          ? 'Claim flagged for review'
          : w.fraud_risk_score > 0.3
          ? 'Monitoring'
          : 'No action',
        fraud_history: [],
        risk_breakdown: [
          { component: 'Tabular ML Score', score: w.fraud_risk_score, weight: 40 },
          { component: 'Behavioral Pattern', score: w.fraud_risk_score * 0.8, weight: 30 },
          { component: 'Claim Frequency', score: w.fraud_risk_score * 0.6, weight: 20 },
          { component: 'GPS Consistency', score: w.fraud_risk_score * 0.5, weight: 10 },
        ],
      }))
      setAllWorkers(mapped)
    } catch (e) {
      console.error('Workers fetch error', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchWorkers() }, [fetchWorkers])

  const filtered = useMemo(() => {
    return allWorkers.filter(w => {
      const matchSearch = search === '' ||
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.worker_id.toLowerCase().includes(search.toLowerCase()) ||
        w.city.toLowerCase().includes(search.toLowerCase())
      const matchPlatform = filterPlatform === 'all' || w.platform === filterPlatform
      const matchRisk = filterRisk === 'all' || w.risk === filterRisk
      const matchKYC = filterKYC === 'all' || (filterKYC === 'verified' ? w.kyc_verified : !w.kyc_verified)
      const matchPlan = filterPlan === 'all' || w.plan_tier === filterPlan
      return matchSearch && matchPlatform && matchRisk && matchKYC && matchPlan
    })
  }, [allWorkers, search, filterPlatform, filterRisk, filterKYC, filterPlan])

  // Fleet stats computed from real data
  const fleetStats = useMemo(() => [
    { label: 'Total Workers', value: allWorkers.length.toLocaleString(), gradient: 'gradient-indigo', icon: User },
    { label: 'High Risk', value: allWorkers.filter(w => w.risk === 'high').length.toLocaleString(), gradient: 'gradient-rose', icon: AlertTriangle },
    { label: 'KYC Verified', value: allWorkers.filter(w => w.kyc_verified).length.toLocaleString(), gradient: 'gradient-teal', icon: CheckCircle2 },
    { label: 'Active Today', value: allWorkers.filter(w => w.status === 'Active').length.toLocaleString(), gradient: 'gradient-orange', icon: Clock },
  ], [allWorkers])

  const handleExport = () => {
    const header = 'worker_id,name,city,geo_zone_id,platform,category,plan_tier,risk,fraud_risk_score,kyc_verified,device_id'
    const rows = filtered.map(w =>
      `${w.worker_id},${w.name},${w.city},${w.geo_zone_id},${w.platform},${w.category},${w.plan_tier},${w.risk},${w.fraud_risk_score},${w.kyc_verified},${w.device_id}`
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'workers_export.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="animate-fade-up space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Worker Risk Monitoring</h1>
          <p className="text-slate-400 text-sm mt-1 font-400">Fleet registry with fraud_risk_score, plan_tier, kyc_verified, geo_zone_id</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-700 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
        >
          <Download size={13} /> Export Workers CSV
        </button>
      </div>

      {/* Fleet Stats */}
      <div className="grid grid-cols-4 gap-4">
        {fleetStats.map((s, i) => (
          <div key={i} className="card p-5">
            <div className={`w-10 h-10 rounded-2xl ${s.gradient} flex items-center justify-center mb-3`}>
              <s.icon size={16} className="text-white" />
            </div>
            <div className="stat-number">{s.value}</div>
            <div className="text-[11px] text-slate-400 font-500 mt-1 uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Risk Trend Chart */}
      <div className="card p-5">
        <div className="font-700 text-slate-800 text-[13px] uppercase tracking-tight mb-4">Risk Trend — 8 Weeks</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={riskTrendData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Line type="monotone" dataKey="high"   name="High Risk"   stroke="#f43f5e" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="medium" name="Medium Risk" stroke="#f97316" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="low"    name="Low Risk"    stroke="#14b8a6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            placeholder="Search by name, ID, city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-[12px] text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-300 placeholder:text-slate-300"
          />
        </div>
        <button
          onClick={() => setShowFilters(f => !f)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-700 border transition-all
            ${showFilters ? 'gradient-indigo text-white border-indigo-400' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200'}`}
        >
          <Filter size={12} /> Filters
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="card p-4 grid grid-cols-4 gap-4">
          {[
            { label: 'Platform', value: filterPlatform, setter: setFilterPlatform, options: ['all', 'Swiggy', 'Zomato', 'Dunzo', 'ONDC', 'BigBasket'] },
            { label: 'Risk Level', value: filterRisk, setter: setFilterRisk, options: ['all', 'high', 'medium', 'low'] },
            { label: 'KYC Status', value: filterKYC, setter: setFilterKYC, options: ['all', 'verified', 'pending'] },
            { label: 'Plan Tier', value: filterPlan, setter: setFilterPlan, options: ['all', 'Basic', 'Standard', 'Premium'] },
          ].map(f => (
            <div key={f.label}>
              <label className="text-[10px] font-700 text-slate-500 uppercase tracking-wide mb-1 block">{f.label}</label>
              <select
                value={f.value}
                onChange={e => f.setter(e.target.value)}
                className="w-full px-3 py-2 text-[11px] font-600 text-slate-700 bg-white border border-slate-200 rounded-xl"
              >
                {f.options.map(o => <option key={o} value={o}>{o === 'all' ? `All ${f.label}s` : o}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Worker Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead className="border-b border-slate-50">
              <tr className="text-slate-400 font-700 uppercase tracking-wide text-[10px]">
                {['Worker ID', 'Name', 'City', 'Geo Zone', 'Platform', 'Vehicle', 'Plan Tier', 'Status', 'Trigger', 'Risk', 'fraud_risk_score', 'KYC', 'Action', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(w => (
                <tr key={w.worker_id} className="border-t border-slate-50 hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-800 text-indigo-600">{w.worker_id}</td>
                  <td className="px-4 py-3 font-600 text-slate-800 whitespace-nowrap">{w.name}</td>
                  <td className="px-4 py-3 text-slate-500">{w.city}</td>
                  <td className="px-4 py-3 font-700 text-slate-600">{w.geo_zone_id}</td>
                  <td className="px-4 py-3 text-slate-500">{w.platform}</td>
                  <td className="px-4 py-3 text-slate-500">{w.category}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-700 px-2 py-0.5 rounded-lg border
                      ${w.plan_tier === 'Premium' ? 'text-indigo-600 bg-indigo-50 border-indigo-100'
                        : w.plan_tier === 'Standard' ? 'text-teal-600 bg-teal-50 border-teal-100'
                        : 'text-slate-600 bg-slate-50 border-slate-100'}`}>
                      {w.plan_tier}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-700 px-2 py-0.5 rounded-lg border
                      ${w.status === 'Active' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-slate-400 bg-slate-50 border-slate-100'}`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{w.trigger}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-700 px-2 py-0.5 rounded-lg border ${riskColors[w.risk]}`}>
                      {w.risk.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-slate-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${w.fraud_risk_score * 100}%`,
                            background: w.fraud_risk_score > 0.6 ? '#f43f5e' : w.fraud_risk_score > 0.3 ? '#f97316' : '#14b8a6',
                          }}
                        />
                      </div>
                      <span className="font-800 text-slate-700">{w.fraud_risk_score.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {w.kyc_verified
                      ? <CheckCircle2 size={14} className="text-emerald-500" />
                      : <AlertTriangle size={14} className="text-rose-400" />}
                  </td>
                  <td className="px-4 py-3 text-slate-400 italic whitespace-nowrap">{w.automated_action}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedWorker(w)}
                      className="flex items-center gap-1 text-[10px] font-700 text-indigo-500 hover:text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg"
                    >
                      Profile <ChevronRight size={10} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-slate-50 text-[10px] text-slate-400 font-600">
          Showing {filtered.length} of {allWorkers.length} workers
        </div>
      </div>

      {/* Profile Drawer */}
      {selectedWorker && (
        <WorkerProfileDrawer worker={selectedWorker} onClose={() => setSelectedWorker(null)} />
      )}

    </div>
  )
}