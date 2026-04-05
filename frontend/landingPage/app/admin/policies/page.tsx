'use client'

import { useState } from 'react'
import {
  FileText, CheckCircle2, Clock, RefreshCw,
  Eye, Download, TrendingUp, Sliders, Users, AlertTriangle
} from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts'

// ─── TYPES ────────────────────────────────────────────────────────────────────

type PolicyStatus = 'active' | 'expired' | 'pending_renewal' | 'suspended'

interface Policy {
  policy_id: string
  worker_id: string
  worker_name: string
  city: string
  geo_zone_id: string
  plan_tier: 'Basic' | 'Standard' | 'Premium'
  weekly_premium: number
  events_used: number
  events_remaining: number
  renewal_count: number
  status: PolicyStatus
  trigger_log: string[]
  fraud_audit: { stage: string; result: string; detail: string }[]
  composite_score: number
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const mockPolicies: Policy[] = [
  {
    policy_id: 'POL-1041', worker_id: 'WRK-0391', worker_name: 'Rajan Pillai',
    city: 'Mumbai', geo_zone_id: 'MH-12', plan_tier: 'Standard', weekly_premium: 49,
    events_used: 4, events_remaining: 2, renewal_count: 3, status: 'active',
    trigger_log: ['Hydro Stress — 2025-03-18', 'Hydro Stress — 2025-02-28', 'AGENT SYNC — 2025-02-10'],
    composite_score: 0.87,
    fraud_audit: [
      { stage: 'S1 — Deterministic', result: 'Pass', detail: 'GPS and zone check passed' },
      { stage: 'S2 — LSTM', result: 'Pass', detail: 'Behavioral score 0.14' },
      { stage: 'S3 — Ring Graph', result: 'Pass', detail: 'No ring detected' },
      { stage: 'S4 — LLM Audit', result: 'Approved', detail: 'Claim approved. Corroborated by IMD data.' },
    ],
  },
  {
    policy_id: 'POL-1042', worker_id: 'WRK-0214', worker_name: 'Divya Krishnan',
    city: 'Delhi', geo_zone_id: 'DL-07', plan_tier: 'Premium', weekly_premium: 79,
    events_used: 2, events_remaining: 10, renewal_count: 7, status: 'active',
    trigger_log: ['Optical Blur — 2025-03-15', 'Kinetic Drag — 2025-01-22'],
    composite_score: 0.73,
    fraud_audit: [
      { stage: 'S1 — Deterministic', result: 'Pass', detail: 'Zone check OK' },
      { stage: 'S2 — LSTM', result: 'Flag', detail: 'Score 0.45 — GPS delta elevated' },
      { stage: 'S3 — Ring Graph', result: 'Pass', detail: 'No ring' },
      { stage: 'S4 — LLM Audit', result: 'Manual Review', detail: 'Borderline. Ops review queued.' },
    ],
  },
  {
    policy_id: 'POL-1043', worker_id: 'WRK-0578', worker_name: 'Suresh Nair',
    city: 'Bengaluru', geo_zone_id: 'KA-03', plan_tier: 'Basic', weekly_premium: 29,
    events_used: 3, events_remaining: 0, renewal_count: 1, status: 'pending_renewal',
    trigger_log: ['Kinetic Drag — 2025-03-10', 'Social Disruption — 2025-02-05', 'Hydro Stress — 2025-01-12'],
    composite_score: 0.61,
    fraud_audit: [
      { stage: 'S1 — Deterministic', result: 'Pass', detail: 'Zone OK' },
      { stage: 'S2 — LSTM', result: 'Flag', detail: 'Accelerometer variance 0.88' },
      { stage: 'S3 — Ring Graph', result: 'Alert', detail: 'Shared device_id ring detected' },
      { stage: 'S4 — LLM Audit', result: 'Hold', detail: 'Fraud ring suspected. Policy held.' },
    ],
  },
  {
    policy_id: 'POL-1044', worker_id: 'WRK-0099', worker_name: 'Kavitha Rao',
    city: 'Hyderabad', geo_zone_id: 'TS-04', plan_tier: 'Standard', weekly_premium: 49,
    events_used: 0, events_remaining: 6, renewal_count: 0, status: 'suspended',
    trigger_log: [],
    composite_score: 0.55,
    fraud_audit: [
      { stage: 'S1 — Deterministic', result: 'Fail', detail: 'GPS outside zone polygon' },
      { stage: 'S2 — LSTM', result: 'Flag', detail: 'Score 0.91' },
      { stage: 'S3 — Ring Graph', result: 'Alert', detail: 'Known fraud cluster' },
      { stage: 'S4 — LLM Audit', result: 'Rejected', detail: 'Policy suspended pending investigation.' },
    ],
  },
  {
    policy_id: 'POL-1045', worker_id: 'WRK-0322', worker_name: 'Arjun Mehta',
    city: 'Chennai', geo_zone_id: 'TN-06', plan_tier: 'Basic', weekly_premium: 29,
    events_used: 1, events_remaining: 2, renewal_count: 2, status: 'active',
    trigger_log: ['AGENT SYNC — 2025-03-05'],
    composite_score: 0.48,
    fraud_audit: [
      { stage: 'S1 — Deterministic', result: 'Pass', detail: 'All checks passed' },
      { stage: 'S2 — LSTM', result: 'Pass', detail: 'Score 0.08 — clean' },
      { stage: 'S3 — Ring Graph', result: 'Pass', detail: 'No association' },
      { stage: 'S4 — LLM Audit', result: 'Approved', detail: 'Clean claim. Approved.' },
    ],
  },
]

const policyStats = [
  { label: 'Active Policies', value: '3,840', gradient: 'gradient-indigo', icon: FileText },
  { label: 'Pending Renewal', value: '284', gradient: 'gradient-orange', icon: Clock },
  { label: 'Avg Renewal Count', value: '2.8', gradient: 'gradient-teal', icon: RefreshCw },
  { label: 'Events Remaining (avg)', value: '4.2', gradient: 'gradient-rose', icon: CheckCircle2 },
]

const radarData = [
  { axis: 'Hydro Stress', value: 0.87 },
  { axis: 'Thermal (AQI)', value: 0.62 },
  { axis: 'Optical Blur', value: 0.73 },
  { axis: 'Kinetic Drag', value: 0.55 },
  { axis: 'Traffic', value: 0.68 },
]

const triggerDist = [
  { name: 'Hydro Stress',      value: 38, color: '#6366f1' },
  { name: 'Optical Blur',      value: 22, color: '#14b8a6' },
  { name: 'Kinetic Drag',      value: 20, color: '#f97316' },
  { name: 'Social Disruption', value: 12, color: '#f43f5e' },
  { name: 'Agent Sync',        value: 8,  color: '#a855f7' },
]

const statusColors: Record<PolicyStatus, string> = {
  active:           'text-emerald-600 bg-emerald-50 border-emerald-200',
  pending_renewal:  'text-amber-600 bg-amber-50 border-amber-200',
  expired:          'text-slate-500 bg-slate-50 border-slate-200',
  suspended:        'text-rose-600 bg-rose-50 border-rose-200',
}

const planColors: Record<string, string> = {
  Basic:    'text-slate-600 bg-slate-50 border-slate-100',
  Standard: 'text-teal-600 bg-teal-50 border-teal-100',
  Premium:  'text-indigo-600 bg-indigo-50 border-indigo-100',
}

// ─── BULK RENEWAL PANEL ───────────────────────────────────────────────────────

function BulkRenewalPanel({ policies, onClose }: { policies: Policy[]; onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>(
    policies.filter(p => p.status === 'pending_renewal').map(p => p.policy_id)
  )
  const [done, setDone] = useState(false)

  const toggle = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const totalPremium = selected.reduce((sum, id) => {
    const p = policies.find(p => p.policy_id === id)
    return sum + (p?.weekly_premium ?? 0)
  }, 0)

  if (done) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] font-700 text-emerald-600">
        <CheckCircle2 size={13} /> {selected.length} policies renewed · ₹{totalPremium}/wk collected
      </div>
    )
  }

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <RefreshCw size={13} className="text-teal-500" />
        <span className="font-700 text-slate-800 text-[13px] uppercase tracking-tight">Bulk Renewal Panel</span>
        <span className="ml-auto text-[11px] font-700 text-teal-600">₹{totalPremium}/wk selected</span>
      </div>
      <div className="space-y-2 mb-4">
        {policies.map(p => (
          <label key={p.policy_id} className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-white transition-colors">
            <input
              type="checkbox"
              checked={selected.includes(p.policy_id)}
              onChange={() => toggle(p.policy_id)}
              className="accent-indigo-500"
            />
            <span className="flex-1 text-[11px] font-600 text-slate-700">{p.policy_id} · {p.worker_name}</span>
            <span className={`text-[10px] font-700 px-2 py-0.5 rounded-lg border ${statusColors[p.status]}`}>{p.status.replace('_', ' ')}</span>
            <span className="text-[11px] font-800 text-slate-600">₹{p.weekly_premium}/wk</span>
          </label>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => setDone(true)}
          disabled={selected.length === 0}
          className="flex-1 py-2.5 rounded-xl text-[11px] font-700 gradient-indigo text-white hover:opacity-90 disabled:opacity-40 transition-all uppercase tracking-wide"
        >
          Renew {selected.length} Policies
        </button>
        <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-[11px] font-700 bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
      </div>
    </div>
  )
}

// ─── PREMIUM ADJUST TOOL ──────────────────────────────────────────────────────

function PremiumAdjustTool({ policies }: { policies: Policy[] }) {
  const [adjustPct, setAdjustPct] = useState(0)
  const [tier, setTier] = useState<string>('all')
  const [applied, setApplied] = useState(false)

  const basePrices: Record<string, number> = { Basic: 29, Standard: 49, Premium: 79 }
  const affected = policies.filter(p => tier === 'all' || p.plan_tier === tier)
  const preview = Object.entries(basePrices).map(([t, base]) => ({
    tier: t,
    current: base,
    adjusted: Math.round(base * (1 + adjustPct / 100)),
  }))

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sliders size={13} className="text-amber-500" />
        <span className="font-700 text-slate-800 text-[13px] uppercase tracking-tight">Premium Adjust Tool</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-700 text-slate-500 uppercase tracking-wide mb-1 block">Apply to Tier</label>
            <select value={tier} onChange={e => setTier(e.target.value)} className="w-full px-3 py-2 text-[11px] font-600 text-slate-700 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="all">All Tiers</option>
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[10px] font-700 text-slate-500 uppercase tracking-wide">Adjustment</span>
              <span className={`text-[12px] font-900 tabular-nums ${adjustPct > 0 ? 'text-rose-500' : adjustPct < 0 ? 'text-emerald-500' : 'text-slate-500'}`}>
                {adjustPct > 0 ? '+' : ''}{adjustPct}%
              </span>
            </div>
            <input
              type="range" min={-30} max={30} value={adjustPct}
              onChange={e => setAdjustPct(+e.target.value)}
              className="w-full h-1.5 accent-indigo-500"
            />
          </div>
          <div className="text-[10px] text-slate-400 italic">
            {affected.length} policies affected
          </div>
          <button
            onClick={() => setApplied(true)}
            className={`w-full py-2.5 rounded-xl text-[11px] font-700 uppercase tracking-wide transition-all
              ${applied ? 'bg-emerald-500 text-white' : 'gradient-indigo text-white hover:opacity-90'}`}
          >
            {applied ? 'Applied ✓' : 'Apply Adjustment'}
          </button>
        </div>
        <div className="space-y-2">
          <div className="text-[10px] font-700 text-slate-500 uppercase tracking-wide mb-2">Preview</div>
          {preview.filter(p => tier === 'all' || p.tier === tier).map(p => (
            <div key={p.tier} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className={`text-[10px] font-700 px-2 py-0.5 rounded-lg border ${planColors[p.tier]}`}>{p.tier}</span>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-slate-400 line-through">₹{p.current}</span>
                <span className="font-900 text-slate-800">₹{p.adjusted}</span>
                <span className="text-[9px] text-slate-400">/wk</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function PoliciesPage() {
  const [activeStatus, setActiveStatus] = useState<PolicyStatus | 'all'>('all')
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [showBulkRenewal, setShowBulkRenewal] = useState(false)

  const filtered = mockPolicies.filter(p => activeStatus === 'all' || p.status === activeStatus)

  const handleExport = () => {
    const header = 'policy_id,worker_id,worker_name,city,geo_zone_id,plan_tier,weekly_premium,events_used,events_remaining,renewal_count,status'
    const rows = mockPolicies.map(p =>
      `${p.policy_id},${p.worker_id},${p.worker_name},${p.city},${p.geo_zone_id},${p.plan_tier},${p.weekly_premium},${p.events_used},${p.events_remaining},${p.renewal_count},${p.status}`
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'policies_export.csv'; a.click()
  }

  return (
    <div className="animate-fade-up space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Climate Policy Engine</h1>
          <p className="text-slate-400 text-sm mt-1 font-400">plan_tier · weekly_premium · events_used/remaining · renewal_count</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowBulkRenewal(b => !b)} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-700 text-slate-600 hover:border-teal-300 hover:text-teal-600 transition-all shadow-sm">
            <RefreshCw size={13} /> Bulk Renewal
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-700 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm">
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {policyStats.map((s, i) => (
          <div key={i} className="card p-5">
            <div className={`w-10 h-10 rounded-2xl ${s.gradient} flex items-center justify-center mb-3`}>
              <s.icon size={16} className="text-white" />
            </div>
            <div className="stat-number">{s.value}</div>
            <div className="text-[11px] text-slate-400 mt-1 uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bulk Renewal Panel */}
      {showBulkRenewal && (
        <BulkRenewalPanel policies={mockPolicies} onClose={() => setShowBulkRenewal(false)} />
      )}

      {/* Premium Adjust Tool */}
      <PremiumAdjustTool policies={mockPolicies} />

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-5">
        <div className="card p-5">
          <div className="font-700 text-slate-800 text-[13px] uppercase tracking-tight mb-4">Environmental Pulse — Composite Scores</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Radar name="Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <div className="font-700 text-slate-800 text-[13px] uppercase tracking-tight mb-4">Trigger Distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={triggerDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {triggerDist.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v: any) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {triggerDist.map(t => (
              <div key={t.name} className="flex items-center gap-1 text-[10px] text-slate-500">
                <span className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                {t.name}: <b className="text-slate-700">{t.value}%</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── POLICY STATUS TABS ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        {([
          { key: 'all', label: 'All', count: mockPolicies.length },
          { key: 'active', label: 'Active', count: mockPolicies.filter(p => p.status === 'active').length },
          { key: 'pending_renewal', label: 'Pending Renewal', count: mockPolicies.filter(p => p.status === 'pending_renewal').length },
          { key: 'suspended', label: 'Suspended', count: mockPolicies.filter(p => p.status === 'suspended').length },
          { key: 'expired', label: 'Expired', count: mockPolicies.filter(p => p.status === 'expired').length },
        ] as { key: PolicyStatus | 'all'; label: string; count: number }[]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveStatus(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-700 border transition-all
              ${activeStatus === tab.key ? 'gradient-indigo text-white border-indigo-400' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
          >
            {tab.label}
            <span className={`text-[9px] font-800 px-1.5 py-0.5 rounded-lg ${activeStatus === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Policy Registry Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead className="border-b border-slate-50">
              <tr className="text-slate-400 font-700 uppercase tracking-wide text-[10px]">
                {['Policy ID', 'Worker', 'City / Zone', 'Plan Tier', '₹/wk', 'Events Used', 'Events Left', 'Renewals', 'Status', 'composite', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.policy_id} className="border-t border-slate-50 hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-800 text-indigo-600">{p.policy_id}</td>
                  <td className="px-4 py-3">
                    <div className="font-600 text-slate-800">{p.worker_name}</div>
                    <div className="text-[10px] text-slate-400">{p.worker_id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-600">{p.city}</div>
                    <div className="text-[10px] font-700 text-slate-400">{p.geo_zone_id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-700 px-2 py-0.5 rounded-lg border ${planColors[p.plan_tier]}`}>{p.plan_tier}</span>
                  </td>
                  <td className="px-4 py-3 font-800 text-slate-700">₹{p.weekly_premium}</td>
                  <td className="px-4 py-3 font-700 text-slate-600">{p.events_used}</td>
                  <td className="px-4 py-3">
                    <span className={`font-800 ${p.events_remaining === 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{p.events_remaining}</span>
                  </td>
                  <td className="px-4 py-3 font-700 text-slate-600">{p.renewal_count}×</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-700 px-2 py-0.5 rounded-lg border capitalize ${statusColors[p.status]}`}>
                      {p.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-800 text-indigo-500">{p.composite_score}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedPolicy(p)}
                      className="flex items-center gap-1 text-[10px] font-700 text-indigo-500 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      <Eye size={10} /> Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Policy Detail Modal — full trigger log + fraud audit */}
      {selectedPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPolicy(null)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-6 py-4 border-b border-slate-50 flex items-center justify-between">
              <div>
                <div className="font-800 text-slate-800">{selectedPolicy.policy_id} — {selectedPolicy.worker_name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {selectedPolicy.plan_tier} · ₹{selectedPolicy.weekly_premium}/wk · {selectedPolicy.renewal_count} renewals
                </div>
              </div>
              <button onClick={() => setSelectedPolicy(null)} className="text-[11px] font-700 text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">Close</button>
            </div>

            <div className="px-6 py-5 space-y-5">

              {/* Key fields */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'events_used', value: selectedPolicy.events_used, color: 'text-orange-600' },
                  { label: 'events_remaining', value: selectedPolicy.events_remaining, color: selectedPolicy.events_remaining === 0 ? 'text-rose-600' : 'text-emerald-600' },
                  { label: 'renewal_count', value: `${selectedPolicy.renewal_count}×`, color: 'text-indigo-600' },
                  { label: 'geo_zone_id', value: selectedPolicy.geo_zone_id, color: 'text-slate-700' },
                  { label: 'composite_score', value: selectedPolicy.composite_score, color: 'text-indigo-600' },
                  { label: 'weekly_premium', value: `₹${selectedPolicy.weekly_premium}`, color: 'text-teal-600' },
                ].map(f => (
                  <div key={f.label} className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                    <div className="text-[9px] font-700 text-slate-400 uppercase tracking-wide">{f.label}</div>
                    <div className={`text-[15px] font-900 mt-0.5 tabular-nums ${f.color}`}>{f.value}</div>
                  </div>
                ))}
              </div>

              {/* Trigger log */}
              <div>
                <div className="text-[11px] font-700 text-slate-600 uppercase tracking-wide mb-2">Trigger Log</div>
                {selectedPolicy.trigger_log.length === 0
                  ? <div className="text-[11px] text-slate-400 italic px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">No triggers recorded.</div>
                  : (
                    <div className="space-y-1.5">
                      {selectedPolicy.trigger_log.map((t, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
                          <span className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
                          <span className="text-[11px] font-600 text-indigo-700">{t}</span>
                        </div>
                      ))}
                    </div>
                  )
                }
              </div>

              {/* Fraud audit trace */}
              <div>
                <div className="text-[11px] font-700 text-slate-600 uppercase tracking-wide mb-2">4-Stage Fraud Audit</div>
                <div className="space-y-2">
                  {selectedPolicy.fraud_audit.map((a, i) => (
                    <div key={i} className={`px-4 py-3 rounded-xl border
                      ${a.result === 'Pass' || a.result === 'Approved' ? 'bg-emerald-50 border-emerald-100'
                        : a.result === 'Fail' || a.result === 'Rejected' ? 'bg-rose-50 border-rose-100'
                        : a.result === 'Hold' ? 'bg-violet-50 border-violet-100'
                        : 'bg-amber-50 border-amber-100'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-800 text-slate-700">{a.stage}</span>
                        <span className={`text-[10px] font-700 px-2 py-0.5 rounded-lg bg-white border
                          ${a.result === 'Pass' || a.result === 'Approved' ? 'text-emerald-600 border-emerald-200'
                            : a.result === 'Fail' || a.result === 'Rejected' ? 'text-rose-600 border-rose-200'
                            : a.result === 'Hold' ? 'text-violet-600 border-violet-200'
                            : 'text-amber-600 border-amber-200'}`}>
                          {a.result}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 italic">{a.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}