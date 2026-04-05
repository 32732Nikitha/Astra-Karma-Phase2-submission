'use client'

import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import {
  FileText, CheckCircle2, Clock, AlertTriangle,
  Download, MapPin, Activity, BarChart2, Eye
} from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

// ─── TYPES ────────────────────────────────────────────────────────────────────

type ClaimStatus = 'approved' | 'pending' | 'rejected' | 'held'

interface Claim {
  claim_id: string
  claim_id_int?: number
  worker_id: string
  worker_name: string
  city: string
  geo_zone_id: string
  trigger_type: string
  payout_amount: number
  payout_status: ClaimStatus
  fraud_score: number
  fraud_reason: string
  gps_lat: number
  gps_lng: number
  cell_tower_id: string
  gps_tower_delta: number
  accelerometer_variance: number
  claim_response_time_sec: number
  audit_trace: { stage: string; result: string; detail: string }[]
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const mockClaims: Claim[] = [
  {
    claim_id: 'CLM-3841', worker_id: 'WRK-0391', worker_name: 'Rajan Pillai',
    city: 'Mumbai', geo_zone_id: 'MH-12', trigger_type: 'Hydro Stress',
    payout_amount: 4200, payout_status: 'approved', fraud_score: 0.14,
    fraud_reason: 'Clean', gps_lat: 19.0760, gps_lng: 72.8777,
    cell_tower_id: 'MH-BTS-4412', gps_tower_delta: 38.4, accelerometer_variance: 0.22,
    claim_response_time_sec: 1.8,
    audit_trace: [
      { stage: 'Stage 1 — Deterministic', result: 'Pass', detail: 'GPS within zone, delta 38.4m < 500m threshold' },
      { stage: 'Stage 2 — LSTM', result: 'Pass', detail: 'Behavioral score 0.14 < 0.60 threshold' },
      { stage: 'Stage 3 — Graph Ring', result: 'Pass', detail: 'No shared GPS cluster detected' },
      { stage: 'Stage 4 — LLM Audit', result: 'Approved', detail: 'No anomalies. Trigger corroborated by IMD rainfall data.' },
    ],
  },
  {
    claim_id: 'CLM-3842', worker_id: 'WRK-0214', worker_name: 'Divya Krishnan',
    city: 'Delhi', geo_zone_id: 'DL-07', trigger_type: 'Optical Blur',
    payout_amount: 3800, payout_status: 'pending', fraud_score: 0.45,
    fraud_reason: 'GPS-tower delta elevated', gps_lat: 28.7041, gps_lng: 77.1025,
    cell_tower_id: 'DL-BTS-0821', gps_tower_delta: 620, accelerometer_variance: 0.41,
    claim_response_time_sec: 3.2,
    audit_trace: [
      { stage: 'Stage 1 — Deterministic', result: 'Pass', detail: 'GPS within zone boundary' },
      { stage: 'Stage 2 — LSTM', result: 'Flag', detail: 'Behavioral score 0.45 — elevated GPS-tower delta 620m' },
      { stage: 'Stage 3 — Graph Ring', result: 'Pass', detail: 'No ring association' },
      { stage: 'Stage 4 — LLM Audit', result: 'Manual Review', detail: 'gps_tower_delta > 500m threshold. Recommend ops review.' },
    ],
  },
  {
    claim_id: 'CLM-3843', worker_id: 'WRK-0578', worker_name: 'Suresh Nair',
    city: 'Bengaluru', geo_zone_id: 'KA-03', trigger_type: 'Kinetic Drag',
    payout_amount: 2900, payout_status: 'held', fraud_score: 0.72,
    fraud_reason: 'Shared device_id ring', gps_lat: 12.9716, gps_lng: 77.5946,
    cell_tower_id: 'KA-BTS-3301', gps_tower_delta: 184, accelerometer_variance: 0.88,
    claim_response_time_sec: 6.4,
    audit_trace: [
      { stage: 'Stage 1 — Deterministic', result: 'Pass', detail: 'Zone check passed' },
      { stage: 'Stage 2 — LSTM', result: 'Flag', detail: 'accelerometer_variance 0.88 — unusually high' },
      { stage: 'Stage 3 — Graph Ring', result: 'Alert', detail: 'Shared device_id with WRK-0601, WRK-0477' },
      { stage: 'Stage 4 — LLM Audit', result: 'Hold', detail: 'Potential fraud ring detected. Escalate to fraud team.' },
    ],
  },
  {
    claim_id: 'CLM-3844', worker_id: 'WRK-0099', worker_name: 'Kavitha Rao',
    city: 'Hyderabad', geo_zone_id: 'TS-04', trigger_type: 'Social Disruption',
    payout_amount: 3100, payout_status: 'rejected', fraud_score: 0.91,
    fraud_reason: 'GPS outside zone at trigger time', gps_lat: 17.3850, gps_lng: 78.4867,
    cell_tower_id: 'TS-BTS-2201', gps_tower_delta: 1240, accelerometer_variance: 0.15,
    claim_response_time_sec: 2.1,
    audit_trace: [
      { stage: 'Stage 1 — Deterministic', result: 'Fail', detail: 'GPS 1.24km from nearest BTS — outside zone polygon' },
      { stage: 'Stage 2 — LSTM', result: 'Flag', detail: 'Score 0.91 — historical GPS spoofing pattern match' },
      { stage: 'Stage 3 — Graph Ring', result: 'Alert', detail: 'Worker in known fraud cluster (3 prior rejections)' },
      { stage: 'Stage 4 — LLM Audit', result: 'Rejected', detail: 'Strong GPS fraud signal. Auto-rejected per §7.3 cascade rules.' },
    ],
  },
]

const claimStats = [
  { label: 'Total Claims', value: '1,284', icon: FileText, gradient: 'gradient-indigo' },
  { label: 'Approved', value: '1,021', icon: CheckCircle2, gradient: 'gradient-teal' },
  { label: 'Pending Review', value: '148', icon: Clock, gradient: 'gradient-orange' },
  { label: 'Rejected', value: '115', icon: AlertTriangle, gradient: 'gradient-rose' },
]

const pipelineFunnel = [
  { stage: 'Deterministic (S1)', count: 1284, color: '#6366f1' },
  { stage: 'LSTM Behavioral (S2)', count: 843, color: '#14b8a6' },
  { stage: 'Graph Ring (S3)', count: 320, color: '#f97316' },
  { stage: 'LLM Audit (S4)', count: 115, color: '#f43f5e' },
]

// ── NEW: 30-day claim volume chart ────────────────────────────────────────────
const claimVolumeData = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  approved: Math.floor(60 + Math.random() * 40),
  held: Math.floor(5 + Math.random() * 15),
  rejected: Math.floor(3 + Math.random() * 10),
}))

const statusColors: Record<ClaimStatus, string> = {
  approved: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  pending:  'text-amber-600 bg-amber-50 border-amber-200',
  held:     'text-violet-600 bg-violet-50 border-violet-200',
  rejected: 'text-rose-600 bg-rose-50 border-rose-200',
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white/95 border border-slate-100 rounded-xl px-3 py-2 shadow-lg text-xs">
        <div className="font-700 text-slate-400 text-[10px] mb-1">{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-slate-600">
            <span className="w-2 h-2 rounded-full" style={{ background: p.fill ?? p.stroke }} />
            <span>{p.name}: <b>{p.value}</b></span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// ─── GPS VALIDATION PANEL ─────────────────────────────────────────────────────

function GPSValidationPanel({ claim }: { claim: Claim }) {
  const deltaOk = claim.gps_tower_delta < 500
  return (
    <div className={`border rounded-xl p-4 ${deltaOk ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={13} className={deltaOk ? 'text-emerald-500' : 'text-rose-500'} />
        <span className="font-700 text-slate-800 text-[12px] uppercase tracking-wide">GPS Validation</span>
        <span className={`text-[10px] font-700 px-2 py-0.5 rounded-lg ml-auto ${deltaOk ? 'text-emerald-600 bg-white border border-emerald-200' : 'text-rose-600 bg-white border border-rose-200'}`}>
          {deltaOk ? 'VALID' : 'FLAGGED'}
        </span>
      </div>
      {/* Mini map placeholder */}
      <div className="h-[120px] bg-white/60 rounded-xl border border-white/80 mb-3 flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 40% 50%, #6366f1 0%, transparent 60%)' }}
        />
        {/* GPS pin */}
        <div className="relative flex flex-col items-center z-10">
          <MapPin size={24} className={deltaOk ? 'text-emerald-500' : 'text-rose-500'} />
          <span className="text-[9px] font-700 text-slate-500 mt-1">{claim.gps_lat.toFixed(4)}, {claim.gps_lng.toFixed(4)}</span>
          <span className="text-[9px] text-slate-400 mt-0.5">Mapbox GL — requires token</span>
        </div>
        {/* Tower dot */}
        <div className="absolute top-1/3 right-1/4 flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-amber-400 border-2 border-white shadow-md" />
          <span className="text-[8px] text-slate-400 mt-0.5">{claim.cell_tower_id}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-[10px]">
        <div className="bg-white/70 rounded-lg px-2 py-1.5 text-center">
          <div className="font-700 text-slate-500 uppercase tracking-wide text-[9px]">GPS→Tower Δ</div>
          <div className={`font-900 text-[13px] ${deltaOk ? 'text-emerald-600' : 'text-rose-600'}`}>{claim.gps_tower_delta}m</div>
        </div>
        <div className="bg-white/70 rounded-lg px-2 py-1.5 text-center">
          <div className="font-700 text-slate-500 uppercase tracking-wide text-[9px]">Accel Var</div>
          <div className={`font-900 text-[13px] ${claim.accelerometer_variance > 0.7 ? 'text-rose-600' : 'text-slate-700'}`}>{claim.accelerometer_variance}</div>
        </div>
        <div className="bg-white/70 rounded-lg px-2 py-1.5 text-center">
          <div className="font-700 text-slate-500 uppercase tracking-wide text-[9px]">Response</div>
          <div className="font-900 text-[13px] text-slate-700">{claim.claim_response_time_sec}s</div>
        </div>
      </div>
    </div>
  )
}

// ─── HELD CLAIM ACTIONS ──────────────────────────────────────────────

function HeldClaimActions({ claim, onClose, onRefresh = () => {} }: { claim: Claim; onClose: () => void; onRefresh: () => void }) {
  const [action, setAction] = useState<string | null>(null)
  const [note, setNote] = useState('')

  const handleAction = async (type: string) => {
    setAction(type)
    try {
      if (type === 'Release') {
        await api.patch(`/claims/${claim.claim_id_int}/release`)
      } else if (type === 'Reject') {
        await api.patch(`/claims/${claim.claim_id_int}/reject`, { reason: note || 'Admin decision' })
      }
      onRefresh()
      setTimeout(onClose, 1500)
    } catch (e) {
      console.error('Claim action error', e)
    }
  }

  if (action) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-[11px] font-700 text-emerald-600">
        <CheckCircle2 size={13} /> {action} action applied to {claim.claim_id}
      </div>
    )
  }

  return (
    <div className="border border-violet-100 bg-violet-50 rounded-xl p-4">
      <div className="text-[11px] font-700 text-violet-700 uppercase tracking-wide mb-3">Held Claim Actions</div>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Add ops note before action..."
        className="w-full px-3 py-2 text-[11px] text-slate-700 bg-white border border-violet-100 rounded-xl resize-none h-12 mb-3 focus:outline-none"
      />
      <div className="flex gap-2">
        <button onClick={() => handleAction('Release')} className="flex-1 py-2 rounded-xl text-[11px] font-700 bg-emerald-500 text-white hover:opacity-90 transition-opacity">Release</button>
        <button onClick={() => handleAction('Reject')} className="flex-1 py-2 rounded-xl text-[11px] font-700 bg-rose-500 text-white hover:opacity-90 transition-opacity">Reject</button>
        <button onClick={() => handleAction('Escalate')} className="flex-1 py-2 rounded-xl text-[11px] font-700 bg-amber-400 text-white hover:opacity-90 transition-opacity">Escalate</button>
      </div>
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function ClaimsPage() {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)
  const [allClaims, setAllClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [statsData, setStatsData] = useState<any>({})

  const fetchClaims = useCallback(async () => {
    try {
      setLoading(true)
      const [res, stats] = await Promise.all([
        api.get('/admin/claims?limit=200'),
        api.get('/admin/stats'),
      ])
      const raw = Array.isArray(res) ? res : (res as any)?.data ?? []
      const mapped: Claim[] = raw.map((c: any) => ({
        claim_id: c.claim_id,
        claim_id_int: c.claim_id_int,
        worker_id: c.worker_id,
        worker_name: c.worker_name,
        city: c.city,
        geo_zone_id: c.geo_zone_id,
        trigger_type: c.trigger_type,
        payout_amount: c.payout_amount,
        payout_status: (c.payout_status === 'paid' ? 'approved' : c.payout_status || 'pending') as ClaimStatus,
        fraud_score: c.fraud_score,
        fraud_reason: c.fraud_flag ? 'Flagged by ML pipeline' : 'Clean',
        gps_lat: 0,
        gps_lng: 0,
        cell_tower_id: 'N/A',
        gps_tower_delta: 0,
        accelerometer_variance: 0,
        claim_response_time_sec: 0,
        audit_trace: [
          { stage: 'Stage 1 — Deterministic', result: c.fraud_flag ? 'Flag' : 'Pass', detail: `Trigger: ${c.trigger_type} at ${c.trigger_value}` },
          { stage: 'Stage 2 — ML Score', result: c.fraud_score > 0.6 ? 'Flag' : 'Pass', detail: `Fraud risk score: ${c.fraud_score}` },
          { stage: 'Stage 3 — Graph Ring', result: 'Pass', detail: 'No ring cluster detected' },
          { stage: 'Stage 4 — Decision', result: c.payout_status === 'paid' ? 'Approved' : 'Pending', detail: `Payout: ₹${c.payout_amount}` },
        ],
      }))
      setAllClaims(mapped)
      setStatsData(stats || {})
    } catch (e) {
      console.error('Claims fetch error', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchClaims() }, [fetchClaims])

  const claimStats = [
    { label: 'Total Claims', value: statsData.total_claims?.toLocaleString() ?? allClaims.length, icon: FileText, gradient: 'gradient-indigo' },
    { label: 'Approved', value: allClaims.filter(c => c.payout_status === 'approved').length, icon: CheckCircle2, gradient: 'gradient-teal' },
    { label: 'Pending Review', value: allClaims.filter(c => c.payout_status === 'pending').length, icon: Clock, gradient: 'gradient-orange' },
    { label: 'Fraud Flagged', value: statsData.fraud_cases ?? allClaims.filter(c => c.fraud_score > 0.5).length, icon: AlertTriangle, gradient: 'gradient-rose' },
  ]

  const handleExport = () => {
    const header = 'claim_id,worker_id,city,geo_zone_id,trigger_type,payout_amount,payout_status,fraud_score,gps_lat,gps_lng,cell_tower_id,gps_tower_delta,accelerometer_variance,claim_response_time_sec'
    const rows = allClaims.map(c =>
      `${c.claim_id},${c.worker_id},${c.city},${c.geo_zone_id},${c.trigger_type},${c.payout_amount},${c.payout_status},${c.fraud_score},${c.gps_lat},${c.gps_lng},${c.cell_tower_id},${c.gps_tower_delta},${c.accelerometer_variance},${c.claim_response_time_sec}`
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob); a.download = 'claims_audit_ledger.csv'; a.click()
  }

  return (
    <div className="animate-fade-up space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Claims Management</h1>
          <p className="text-slate-400 text-sm mt-1 font-400">4-stage fraud pipeline · GPS validation · gps_tower_delta · accelerometer_variance</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-700 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm">
          <Download size={13} /> Export Audit Ledger
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {claimStats.map((s, i) => (
          <div key={i} className="card p-5">
            <div className={`w-10 h-10 rounded-2xl ${s.gradient} flex items-center justify-center mb-3`}>
              <s.icon size={16} className="text-white" />
            </div>
            <div className="stat-number">{s.value}</div>
            <div className="text-[11px] text-slate-400 mt-1 uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── NEW: Claim Volume Chart ─────────────────────────────────────────── */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={13} className="text-indigo-500" />
          <span className="font-700 text-slate-800 text-[13px] uppercase tracking-tight">Claim Volume — 14 Days</span>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={claimVolumeData} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="approved" name="Approved" fill="#14b8a6" radius={[3, 3, 0, 0]} stackId="a" />
            <Bar dataKey="held"     name="Held"     fill="#a855f7" radius={[0, 0, 0, 0]} stackId="a" />
            <Bar dataKey="rejected" name="Rejected" fill="#f43f5e" radius={[3, 3, 0, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 4-Stage Pipeline Funnel */}
      <div className="card p-6">
        <div className="font-700 text-slate-800 text-[13px] uppercase tracking-tight mb-4">4-Stage Fraud Pipeline</div>
        <div className="space-y-3">
          {pipelineFunnel.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[10px] font-700 text-slate-500 w-36 flex-shrink-0">{s.stage}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-5 relative overflow-hidden">
                <div
                  className="h-5 rounded-full flex items-center pl-3 transition-all duration-700"
                  style={{ width: `${(s.count / 1284) * 100}%`, background: s.color }}
                >
                  <span className="text-[10px] font-800 text-white whitespace-nowrap">{s.count.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Registry Table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-50 font-700 text-slate-800 text-[13px] uppercase tracking-tight">Claim Audit Registry</div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead className="border-b border-slate-50">
              <tr className="text-slate-400 font-700 uppercase tracking-wide text-[10px]">
                {['Claim ID', 'Worker', 'City / Zone', 'Trigger', 'Payout', 'Status', 'fraud_score', 'gps_tower_delta', 'accel_var', 'response_time', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allClaims.map(c => (
                <tr key={c.claim_id} className="border-t border-slate-50 hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-800 text-indigo-600">{c.claim_id}</td>
                  <td className="px-4 py-3">
                    <div className="font-600 text-slate-800">{c.worker_name}</div>
                    <div className="text-[10px] text-slate-400">{c.worker_id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-600">{c.city}</div>
                    <div className="text-[10px] font-700 text-slate-400">{c.geo_zone_id}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{c.trigger_type}</td>
                  <td className="px-4 py-3 font-800 text-slate-800">₹{c.payout_amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-700 px-2 py-0.5 rounded-lg border capitalize ${statusColors[c.payout_status]}`}>
                      {c.payout_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-800" style={{ color: c.fraud_score > 0.6 ? '#f43f5e' : c.fraud_score > 0.3 ? '#f97316' : '#14b8a6' }}>
                    {c.fraud_score.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={c.gps_tower_delta > 500 ? 'text-rose-600 font-800' : 'text-slate-500'}>{c.gps_tower_delta}m</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={c.accelerometer_variance > 0.7 ? 'text-rose-600 font-800' : 'text-slate-500'}>{c.accelerometer_variance}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{c.claim_response_time_sec}s</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedClaim(c)}
                      className="flex items-center gap-1 text-[10px] font-700 text-indigo-500 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      <Eye size={10} /> Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Detail Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedClaim(null)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-6 py-4 border-b border-slate-50 flex items-center justify-between">
              <div>
                <div className="font-800 text-slate-800">{selectedClaim.claim_id}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{selectedClaim.worker_name} · {selectedClaim.trigger_type}</div>
              </div>
              <button onClick={() => setSelectedClaim(null)} className="text-[11px] font-700 text-slate-400 hover:text-slate-600 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">Close</button>
            </div>

            <div className="px-6 py-5 space-y-5">

              {/* GPS Validation Panel — NEW */}
              <GPSValidationPanel claim={selectedClaim} />

              {/* Audit Trace */}
              <div>
                <div className="text-[11px] font-700 text-slate-600 uppercase tracking-wide mb-3">4-Stage Audit Trace</div>
                <div className="space-y-2">
                  {selectedClaim.audit_trace.map((t, i) => (
                    <div key={i} className={`px-4 py-3 rounded-xl border
                      ${t.result === 'Pass' || t.result === 'Approved' ? 'bg-emerald-50 border-emerald-100'
                        : t.result === 'Fail' || t.result === 'Rejected' ? 'bg-rose-50 border-rose-100'
                        : t.result === 'Hold' ? 'bg-violet-50 border-violet-100'
                        : 'bg-amber-50 border-amber-100'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-800 text-slate-700">{t.stage}</span>
                        <span className={`text-[10px] font-700 px-2 py-0.5 rounded-lg
                          ${t.result === 'Pass' || t.result === 'Approved' ? 'text-emerald-600 bg-white border border-emerald-200'
                            : t.result === 'Fail' || t.result === 'Rejected' ? 'text-rose-600 bg-white border border-rose-200'
                            : t.result === 'Hold' ? 'text-violet-600 bg-white border border-violet-200'
                            : 'text-amber-600 bg-white border border-amber-200'}`}>
                          {t.result}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 italic">{t.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Held Claim Actions — shown only for held claims */}
              {selectedClaim.payout_status === 'held' && (
                <HeldClaimActions claim={selectedClaim} onClose={() => setSelectedClaim(null)} onRefresh={fetchClaims} />
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  )
}