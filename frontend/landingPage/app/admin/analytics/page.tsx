'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import {
  TrendingUp, Users, FileText, AlertTriangle, Download,
  Sliders, Play, BarChart2, Target, Map
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

// ─── DATA ─────────────────────────────────────────────────────────────────────

const kpiCardConfig = [
  { label: 'Active Policies', key: 'active_policies', format: (v: any) => v?.toLocaleString() ?? '—', change: '', icon: Users, gradient: 'gradient-indigo', positive: true },
  { label: 'Weekly Premium Inflow', key: 'total_premium', format: (v: any) => v ? `₹${(v/100000).toFixed(2)}L` : '—', change: '', icon: FileText, gradient: 'gradient-teal', positive: true },
  { label: 'Loss Ratio', key: 'loss_ratio', format: (v: any) => v != null ? `${(v*100).toFixed(1)}%` : '—', change: '', icon: AlertTriangle, gradient: 'gradient-orange', positive: true },
  { label: 'Total Payouts', key: 'total_payout', format: (v: any) => v ? `₹${(v/100000).toFixed(2)}L` : '—', change: '', icon: TrendingUp, gradient: 'gradient-rose', positive: false },
]

const actuarialData = [
  { month: 'Oct', premiumInflow: 840000, claims: 198000 },
  { month: 'Nov', premiumInflow: 920000, claims: 215000 },
  { month: 'Dec', premiumInflow: 870000, claims: 188000 },
  { month: 'Jan', premiumInflow: 1100000, claims: 265000 },
  { month: 'Feb', premiumInflow: 1240000, claims: 298000 },
  { month: 'Mar', premiumInflow: 1180000, claims: 252000 },
]

const quarterlyAdoption = [
  { quarter: 'Q2 FY24', basic: 320, standard: 210, premium: 80 },
  { quarter: 'Q3 FY24', basic: 410, standard: 290, premium: 120 },
  { quarter: 'Q4 FY24', basic: 520, standard: 380, premium: 160 },
  { quarter: 'Q1 FY25', basic: 680, standard: 490, premium: 210 },
]

const agentRadarData = [
  { agent: 'Monitor', score: 92 },
  { agent: 'Trigger', score: 88 },
  { agent: 'Fraud',   score: 79 },
  { agent: 'Payout',  score: 95 },
  { agent: 'Insight', score: 74 },
  { agent: 'Manager', score: 83 },
]

const lossBreakdown = [
  { name: 'Hydro Stress',      value: 38, color: '#6366f1' },
  { name: 'Optical Blur',      value: 22, color: '#14b8a6' },
  { name: 'Kinetic Drag',      value: 18, color: '#f97316' },
  { name: 'Social Disruption', value: 14, color: '#f43f5e' },
  { name: 'Agent Sync',        value: 8,  color: '#a855f7' },
]

// ── NEW: 8-week rolling loss ratio trend ─────────────────────────────────────
const lossRatioTrend = [
  { week: 'W1', ratio: 26.8 },
  { week: 'W2', ratio: 25.4 },
  { week: 'W3', ratio: 27.1 },
  { week: 'W4', ratio: 24.9 },
  { week: 'W5', ratio: 23.7 },
  { week: 'W6', ratio: 25.2 },
  { week: 'W7', ratio: 24.1 },
  { week: 'W8', ratio: 22.8 },
]

// ── NEW: Cohort Retention Matrix ──────────────────────────────────────────────
const cohortData = [
  { cohort: 'Oct', w1: 100, w2: 84, w3: 72, w4: 64, w5: 58, w6: 53, w7: 49, w8: 46 },
  { cohort: 'Nov', w1: 100, w2: 87, w3: 75, w4: 68, w5: 62, w6: 57, w7: 54, w8: null },
  { cohort: 'Dec', w1: 100, w2: 82, w3: 70, w4: 63, w5: 57, w6: 52, w7: null, w8: null },
  { cohort: 'Jan', w1: 100, w2: 89, w3: 78, w4: 71, w5: 65, w6: null, w7: null, w8: null },
  { cohort: 'Feb', w1: 100, w2: 91, w3: 80, w4: 74, w5: null, w6: null, w7: null, w8: null },
  { cohort: 'Mar', w1: 100, w2: 88, w3: 77, w4: null, w5: null, w6: null, w7: null, w8: null },
]

// ── NEW: Zone Risk Leaderboard ────────────────────────────────────────────────
const zoneLeaderboard = [
  { zone: 'MH-12', city: 'Mumbai', composite: 0.87, lossRatio: 31.2, activePolicies: 1240, trend: 'up' },
  { zone: 'DL-07', city: 'Delhi', composite: 0.73, lossRatio: 27.8, activePolicies: 980, trend: 'up' },
  { zone: 'KA-03', city: 'Bengaluru', composite: 0.61, lossRatio: 22.4, activePolicies: 870, trend: 'stable' },
  { zone: 'TS-04', city: 'Hyderabad', composite: 0.55, lossRatio: 19.6, activePolicies: 430, trend: 'down' },
  { zone: 'TN-06', city: 'Chennai', composite: 0.48, lossRatio: 17.1, activePolicies: 320, trend: 'down' },
]

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white/95 border border-slate-100 rounded-xl px-3 py-2 shadow-lg text-xs">
        <div className="font-700 text-slate-400 text-[10px] mb-1">{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-slate-600">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color ?? p.fill ?? p.stroke }} />
            <span>{p.name}: <b>{typeof p.value === 'number' && p.value > 1000
              ? `₹${(p.value / 100000).toFixed(2)}L`
              : p.value}</b></span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// ─── SCENARIO SIMULATOR ★ ─────────────────────────────────────────────────────

function ScenarioSimulator() {
  const [params, setParams] = useState({
    adoptionRate: 65,
    disruptionDays: 8,
    avgPayout: 3200,
    premiumMixBasic: 40,
    premiumMixStandard: 40,
    premiumMixPremium: 20,
  })

  const totalWorkers = 12480
  const activeWorkers = Math.round(totalWorkers * params.adoptionRate / 100)
  const premiumWeekly = activeWorkers * (
    (params.premiumMixBasic / 100) * 29 +
    (params.premiumMixStandard / 100) * 49 +
    (params.premiumMixPremium / 100) * 79
  )
  const claimsExpected = Math.round(activeWorkers * (params.disruptionDays / 30) * 0.15)
  const payoutTotal = claimsExpected * params.avgPayout
  const lossRatio = premiumWeekly > 0 ? ((payoutTotal / (premiumWeekly * 4)) * 100).toFixed(1) : '—'

  const set = (k: keyof typeof params) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setParams(p => ({ ...p, [k]: +e.target.value }))

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-5">
        <Play size={14} className="text-violet-500" />
        <span className="font-700 text-slate-800 text-[13px] uppercase tracking-tight">Actuarial Scenario Simulator</span>
        <span className="text-[10px] text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-lg font-700 ml-auto">★ New Feature §10.2</span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Sliders */}
        <div className="space-y-4">
          {[
            { key: 'adoptionRate',      label: 'Adoption Rate',          unit: '%',  min: 10,  max: 100 },
            { key: 'disruptionDays',    label: 'Disruption Days / Month', unit: 'd',  min: 0,   max: 30 },
            { key: 'avgPayout',         label: 'Avg Payout per Claim',   unit: '₹',  min: 500, max: 10000, step: 100 },
            { key: 'premiumMixBasic',   label: 'Plan Mix: Basic',        unit: '%',  min: 0,   max: 100 },
            { key: 'premiumMixStandard',label: 'Plan Mix: Standard',     unit: '%',  min: 0,   max: 100 },
            { key: 'premiumMixPremium', label: 'Plan Mix: Premium',      unit: '%',  min: 0,   max: 100 },
          ].map(s => (
            <div key={s.key}>
              <div className="flex justify-between mb-1">
                <span className="text-[10px] font-700 text-slate-600 uppercase tracking-wide">{s.label}</span>
                <span className="text-[12px] font-800 text-indigo-600 tabular-nums">
                  {s.unit === '₹' ? `₹${params[s.key as keyof typeof params].toLocaleString()}` : `${params[s.key as keyof typeof params]}${s.unit}`}
                </span>
              </div>
              <input
                type="range" min={s.min} max={s.max} step={(s as any).step ?? 1}
                value={params[s.key as keyof typeof params]}
                onChange={set(s.key as keyof typeof params)}
                className="w-full h-1.5 accent-indigo-500"
              />
            </div>
          ))}
        </div>

        {/* Live Output */}
        <div className="space-y-3">
          <div className="text-[10px] font-700 text-slate-500 uppercase tracking-wide mb-2">Live Output</div>
          {[
            { label: 'Active Workers',     value: activeWorkers.toLocaleString(), color: 'text-indigo-600' },
            { label: 'Weekly Premium Pool', value: `₹${(premiumWeekly / 100000).toFixed(2)}L`, color: 'text-teal-600' },
            { label: 'Expected Claims',     value: claimsExpected.toLocaleString(), color: 'text-orange-600' },
            { label: 'Total Payout',        value: `₹${(payoutTotal / 100000).toFixed(2)}L`, color: 'text-rose-600' },
          ].map(o => (
            <div key={o.label} className="flex justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] font-600 text-slate-600">{o.label}</span>
              <span className={`text-[14px] font-900 tabular-nums ${o.color}`}>{o.value}</span>
            </div>
          ))}
          <div className={`flex justify-between px-4 py-4 rounded-xl border-2 ${+lossRatio < 25 ? 'bg-emerald-50 border-emerald-200' : +lossRatio < 35 ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200'}`}>
            <span className="text-[12px] font-800 text-slate-700 uppercase tracking-wide">Projected Loss Ratio</span>
            <span className={`text-[22px] font-900 tabular-nums ${+lossRatio < 25 ? 'text-emerald-600' : +lossRatio < 35 ? 'text-amber-600' : 'text-rose-600'}`}>{lossRatio}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── COHORT RETENTION MATRIX ──────────────────────────────────────────────────

function CohortRetentionMatrix() {
  const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']
  const getColor = (val: number | null) => {
    if (val === null) return 'bg-slate-50 text-slate-200'
    if (val >= 85) return 'bg-emerald-100 text-emerald-700'
    if (val >= 70) return 'bg-teal-50 text-teal-600'
    if (val >= 55) return 'bg-amber-50 text-amber-600'
    return 'bg-rose-50 text-rose-500'
  }
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 size={13} className="text-teal-500" />
        <span className="font-700 text-slate-800 text-[13px] uppercase tracking-tight">Cohort Retention Matrix</span>
        <span className="text-[10px] text-slate-400 italic ml-2">% of cohort still active</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[10px]">
          <thead>
            <tr>
              <th className="text-left text-slate-400 font-700 uppercase tracking-wide pr-3 pb-2">Cohort</th>
              {weeks.map(w => <th key={w} className="text-center text-slate-400 font-700 uppercase tracking-wide px-1 pb-2 min-w-[52px]">{w}</th>)}
            </tr>
          </thead>
          <tbody>
            {cohortData.map(row => (
              <tr key={row.cohort}>
                <td className="font-800 text-slate-600 pr-3 py-1">{row.cohort}</td>
                {weeks.map(w => {
                  const val = (row as any)[w.toLowerCase()] as number | null
                  return (
                    <td key={w} className="px-1 py-1 text-center">
                      <span className={`inline-block w-10 py-1 rounded-lg text-[10px] font-800 ${getColor(val)}`}>
                        {val !== null ? `${val}%` : '—'}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── ZONE RISK LEADERBOARD ────────────────────────────────────────────────────

function ZoneRiskLeaderboard() {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Map size={13} className="text-rose-500" />
        <span className="font-700 text-slate-800 text-[13px] uppercase tracking-tight">Zone Risk Leaderboard</span>
      </div>
      <div className="space-y-2">
        {zoneLeaderboard.map((z, i) => (
          <div key={z.zone} className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white transition-colors">
            <span className="text-[12px] font-900 text-slate-300 w-4">{i + 1}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-800 text-slate-700 text-[12px]">{z.zone}</span>
                <span className="text-[10px] text-slate-400">{z.city}</span>
              </div>
              <div className="flex items-center gap-3 mt-0.5 text-[10px] text-slate-400">
                <span>composite: <b className="text-indigo-500">{z.composite}</b></span>
                <span>loss ratio: <b className={z.lossRatio > 25 ? 'text-rose-500' : 'text-emerald-500'}>{z.lossRatio}%</b></span>
                <span>policies: <b className="text-slate-600">{z.activePolicies}</b></span>
              </div>
            </div>
            <div className="w-20 bg-slate-100 rounded-full h-1.5">
              <div className="h-1.5 rounded-full bg-indigo-500 transition-all" style={{ width: `${z.composite * 100}%` }} />
            </div>
            <span className={`text-[10px] font-700 ${z.trend === 'up' ? 'text-rose-400' : z.trend === 'down' ? 'text-emerald-500' : 'text-slate-400'}`}>
              {z.trend === 'up' ? '↑' : z.trend === 'down' ? '↓' : '→'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [statsData, setStatsData] = useState<any>({})
  const [lossRatioData, setLossRatioData] = useState<any>({})
  const [zoneData, setZoneData] = useState<any[]>([])

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [stats, lossRatio, zones] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/analytics/loss-ratio'),
          api.get('/analytics/zone-risk'),
        ])
        setStatsData(stats || {})
        setLossRatioData(lossRatio || {})
        setZoneData(Array.isArray(zones) ? zones : [])
      } catch (e) {
        console.error('Analytics fetch error', e)
      }
    }
    fetchAll()
  }, [])

  const kpiCards = kpiCardConfig.map(cfg => ({
    ...cfg,
    value: cfg.format(
      cfg.key === 'loss_ratio' ? lossRatioData.loss_ratio : statsData[cfg.key]
    ),
  }))

  const handleExport = () => {
    const csv = [
      'month,premiumInflow,claims',
      ...actuarialData.map(r => `${r.month},${r.premiumInflow},${r.claims}`)
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'analytics_report.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="animate-fade-up space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Business Intelligence</h1>
          <p className="text-slate-400 text-sm mt-1 font-400">Actuarial performance, agent health, zone risk & scenario simulation</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-700 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
        >
          <Download size={13} /> Export Report CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpiCards.map((k, i) => (
          <div key={i} className="card p-5">
            <div className={`w-10 h-10 rounded-2xl ${k.gradient} flex items-center justify-center mb-3`}>
              <k.icon size={16} className="text-white" />
            </div>
            <div className="stat-number">{k.value}</div>
            <div className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wide">{k.label}</div>
            <div className={`text-[10px] font-700 mt-1 ${k.positive ? 'text-emerald-500' : 'text-rose-500'}`}>{k.change}</div>
          </div>
        ))}
      </div>

      {/* Actuarial Performance */}
      <div className="card p-6">
        <div className="font-700 text-slate-800 text-[13px] uppercase tracking-tight mb-1">Actuarial Performance</div>
        <div className="text-[11px] text-slate-400 italic mb-4">Premium inflow vs claims — rolling 6 months</div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={actuarialData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="piG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="clG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 100000).toFixed(1)}L`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="premiumInflow" name="Premium Inflow" stroke="#6366f1" strokeWidth={2.5} fill="url(#piG)" dot={false} />
            <Area type="monotone" dataKey="claims" name="Claims" stroke="#f43f5e" strokeWidth={2} fill="url(#clG)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Loss Ratio Trend (8-week rolling) — NEW */}
      <div className="card p-6">
        <div className="font-700 text-slate-800 text-[13px] uppercase tracking-tight mb-1 flex items-center gap-2">
          <TrendingUp size={13} className="text-rose-400" />
          Loss Ratio Trend — Rolling 8 Weeks
        </div>
        <div className="text-[11px] text-slate-400 italic mb-4">Weekly loss ratio % — target &lt; 25%</div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={lossRatioTrend} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis domain={[15, 35]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            {/* Target line at 25% */}
            <Line type="monotone" dataKey="ratio" name="Loss Ratio" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }} />
          </LineChart>
        </ResponsiveContainer>
        <div className="text-[10px] text-slate-400 mt-2 italic">Target threshold: 25% — dashed reference</div>
      </div>

      {/* Bottom 3-column grid */}
      <div className="grid grid-cols-3 gap-5">

        {/* Agent Health Radar */}
        <div className="card p-5">
          <div className="font-700 text-slate-800 text-[13px] uppercase tracking-tight mb-4">Agent Health Scorecard</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={agentRadarData}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis dataKey="agent" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Quarterly Adoption */}
        <div className="card p-5">
          <div className="font-700 text-slate-800 text-[13px] uppercase tracking-tight mb-4">Platform Adoption by Quarter</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={quarterlyAdoption} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="quarter" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="basic" name="Basic" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="standard" name="Standard" fill="#14b8a6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="premium" name="Premium" fill="#6366f1" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Loss by Trigger Type */}
        <div className="card p-5">
          <div className="font-700 text-slate-800 text-[13px] uppercase tracking-tight mb-4">Loss by Trigger Type</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={lossBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                {lossBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(val: any) => `${val}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {lossBreakdown.map(l => (
              <div key={l.name} className="flex items-center gap-2 text-[10px] text-slate-500">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: l.color }} />
                {l.name}: <b className="text-slate-700">{l.value}%</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cohort Retention Matrix — NEW */}
      <CohortRetentionMatrix />

      {/* Zone Risk Leaderboard — NEW */}
      <ZoneRiskLeaderboard />

      {/* Scenario Simulator ★ — NEW */}
      <ScenarioSimulator />

    </div>
  )
}