'use client'

import { useState, useEffect, useRef } from 'react'
import {
  ShieldAlert, AlertTriangle, CheckCircle2, XCircle,
  Download, Eye, Zap, TrendingUp, BarChart2, FileText, Bell
} from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface FraudCase {
  case_id: string
  worker_id: string
  worker_name: string
  fraud_score: number
  fraud_flag: boolean
  fraud_reason: string
  status: 'Confirmed' | 'Under Review' | 'Cleared'
  stage_trace: { stage: string; result: string; detail: string }[]
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const statCards = [
  { label: 'Total Flagged', value: '284', gradient: 'gradient-rose', icon: ShieldAlert },
  { label: 'Confirmed Fraud', value: '47', gradient: 'gradient-orange', icon: AlertTriangle },
  { label: 'Under Review', value: '112', gradient: 'gradient-indigo', icon: Eye },
  { label: 'Cleared', value: '125', gradient: 'gradient-teal', icon: CheckCircle2 },
]

const cascadeData = [
  { stage: 'S1 — Rules',      cases: 284, color: '#6366f1' },
  { stage: 'S2 — LSTM',       cases: 178, color: '#f97316' },
  { stage: 'S3 — Ring Graph', cases: 89,  color: '#f43f5e' },
  { stage: 'S4 — LLM Audit',  cases: 47,  color: '#a855f7' },
]

const lstmTrend = [
  { day: 'Mon', score: 0.41 },
  { day: 'Tue', score: 0.55 },
  { day: 'Wed', score: 0.38 },
  { day: 'Thu', score: 0.72 },
  { day: 'Fri', score: 0.68 },
  { day: 'Sat', score: 0.44 },
  { day: 'Sun', score: 0.61 },
]

// ── LSTM Score Histogram data ─────────────────────────────────────────────────
const lstmHistogramData = [
  { bucket: '0.0–0.1', count: 420 },
  { bucket: '0.1–0.2', count: 380 },
  { bucket: '0.2–0.3', count: 290 },
  { bucket: '0.3–0.4', count: 210 },
  { bucket: '0.4–0.5', count: 160 },
  { bucket: '0.5–0.6', count: 118 },
  { bucket: '0.6–0.7', count: 89  },
  { bucket: '0.7–0.8', count: 62  },
  { bucket: '0.8–0.9', count: 38  },
  { bucket: '0.9–1.0', count: 24  },
]

const highRiskCases: FraudCase[] = [
  {
    case_id: 'FRD-0041', worker_id: 'WRK-0578', worker_name: 'Suresh Nair',
    fraud_score: 0.92, fraud_flag: true, fraud_reason: 'Shared device_id ring (3 workers)',
    status: 'Confirmed',
    stage_trace: [
      { stage: 'S1 — Deterministic Rules', result: 'Flag', detail: 'device_id DEV-P3Q2R1 linked to 3 claims in 24h' },
      { stage: 'S2 — LSTM Score', result: 'Flag', detail: 'Behavioral score 0.88 — velocity anomaly pattern' },
      { stage: 'S3 — Graph Ring', result: 'Alert', detail: 'Ring cluster: WRK-0578, WRK-0601, WRK-0477 — shared GPS centroid' },
      { stage: 'S4 — LLM Audit', result: 'Confirmed', detail: 'High confidence fraud ring. All 3 claims rejected. Block recommended.' },
    ],
  },
  {
    case_id: 'FRD-0039', worker_id: 'WRK-0099', worker_name: 'Kavitha Rao',
    fraud_score: 0.87, fraud_flag: true, fraud_reason: 'GPS outside zone at trigger time',
    status: 'Confirmed',
    stage_trace: [
      { stage: 'S1 — Deterministic Rules', result: 'Flag', detail: 'gps_tower_delta 1.24km — far exceeds 500m threshold' },
      { stage: 'S2 — LSTM Score', result: 'Flag', detail: 'Score 0.87 — GPS spoofing pattern match from training data' },
      { stage: 'S3 — Graph Ring', result: 'Pass', detail: 'No ring association' },
      { stage: 'S4 — LLM Audit', result: 'Confirmed', detail: 'GPS fraud. Claim auto-rejected.' },
    ],
  },
  {
    case_id: 'FRD-0038', worker_id: 'WRK-0214', worker_name: 'Divya Krishnan',
    fraud_score: 0.45, fraud_flag: false, fraud_reason: 'GPS-tower delta elevated',
    status: 'Under Review',
    stage_trace: [
      { stage: 'S1 — Deterministic Rules', result: 'Pass', detail: 'Within zone boundary' },
      { stage: 'S2 — LSTM Score', result: 'Flag', detail: 'Score 0.45 — gps_tower_delta 620m moderately elevated' },
      { stage: 'S3 — Graph Ring', result: 'Pass', detail: 'No ring association' },
      { stage: 'S4 — LLM Audit', result: 'Review', detail: 'Inconclusive. Manual ops review required.' },
    ],
  },
]

// ── Sudden spike alerts ───────────────────────────────────────────────────────
const spikeAlerts = [
  { zone: 'MH-12', city: 'Mumbai', spike: '+340%', detail: '18 fraud flags in 2h vs 3h rolling avg of 4', severity: 'critical' },
  { zone: 'KA-03', city: 'Bengaluru', spike: '+180%', detail: '7 ring detections today vs weekly avg of 2.5', severity: 'high' },
]

// ── Weekly fraud report data ──────────────────────────────────────────────────
const weeklyFraudReport = {
  period: 'Mar 15–21, 2025',
  totalFlagged: 284,
  confirmedFraud: 47,
  estimatedSavings: 141000,
  topReason: 'GPS spoofing (41%)',
  topZone: 'MH-12 Mumbai',
  avgFraudScore: 0.71,
}

// ── Fraud rules ───────────────────────────────────────────────────────────────
const defaultRules = [
  { id: 1, name: 'GPS Tower Delta Threshold', field: 'gps_tower_delta', operator: '>', value: 500, unit: 'm', active: true },
  { id: 2, name: 'Accelerometer Variance', field: 'accelerometer_variance', operator: '>', value: 0.75, unit: '', active: true },
  { id: 3, name: 'Claims per Device / 24h', field: 'device_claims_24h', operator: '>', value: 2, unit: '', active: true },
  { id: 4, name: 'Shared GPS Cluster Radius', field: 'gps_cluster_radius_m', operator: '<', value: 100, unit: 'm', active: false },
  { id: 5, name: 'LSTM Auto-Reject Threshold', field: 'lstm_score', operator: '>', value: 0.85, unit: '', active: true },
]

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

// ─── D3 RING DETECTION GRAPH ──────────────────────────────────────────────────

function RingDetectionGraph() {
  const svgRef = useRef<SVGSVGElement>(null)

  // Deterministic positions for a stable force layout simulation
  const nodes = [
    { id: 'WRK-0578', x: 200, y: 160, fraud: 0.92, ring: true },
    { id: 'WRK-0601', x: 280, y: 220, fraud: 0.88, ring: true },
    { id: 'WRK-0477', x: 140, y: 230, fraud: 0.79, ring: true },
    { id: 'WRK-0391', x: 360, y: 130, fraud: 0.14, ring: false },
    { id: 'WRK-0214', x: 100, y: 100, fraud: 0.45, ring: false },
    { id: 'WRK-0099', x: 310, y: 300, fraud: 0.87, ring: false },
    { id: 'WRK-0322', x: 420, y: 250, fraud: 0.08, ring: false },
    { id: 'WRK-0711', x: 50, y: 300, fraud: 0.21, ring: false },
  ]

  const edges = [
    { source: 'WRK-0578', target: 'WRK-0601', type: 'device_id' },
    { source: 'WRK-0601', target: 'WRK-0477', type: 'gps_cluster' },
    { source: 'WRK-0477', target: 'WRK-0578', type: 'gps_cluster' },
    { source: 'WRK-0578', target: 'WRK-0391', type: 'ip' },
    { source: 'WRK-0099', target: 'WRK-0601', type: 'ip' },
  ]

  const getNode = (id: string) => nodes.find(n => n.id === id)!

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={13} className="text-rose-500" />
        <span className="font-700 text-slate-800 text-[13px] uppercase tracking-tight">Ring Detection Graph</span>
        <span className="text-[10px] text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-lg font-700 ml-auto">§4.5 D3 Force Graph</span>
      </div>

      <div className="relative bg-slate-900 rounded-2xl overflow-hidden" style={{ height: 360 }}>
        <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 480 360" className="block">
          <defs>
            <radialGradient id="ringGlow">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ring cluster glow */}
          <circle cx="210" cy="203" r="90" fill="url(#ringGlow)" />

          {/* Edges */}
          {edges.map((e, i) => {
            const s = getNode(e.source)
            const t = getNode(e.target)
            const isRingEdge = e.type === 'device_id' || (e.type === 'gps_cluster')
            return (
              <line key={i}
                x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                stroke={isRingEdge ? '#f43f5e' : '#334155'}
                strokeWidth={isRingEdge ? 2 : 1}
                strokeDasharray={e.type === 'ip' ? '4 3' : ''}
                opacity={isRingEdge ? 0.7 : 0.4}
              />
            )
          })}

          {/* Edge labels */}
          {edges.map((e, i) => {
            const s = getNode(e.source)
            const t = getNode(e.target)
            const mx = (s.x + t.x) / 2
            const my = (s.y + t.y) / 2
            return (
              <text key={`lbl-${i}`} x={mx} y={my} textAnchor="middle" fontSize={7}
                fill={e.type === 'device_id' ? '#f43f5e' : e.type === 'gps_cluster' ? '#f97316' : '#64748b'}
                fontFamily="monospace"
              >
                {e.type.replace('_', ' ')}
              </text>
            )
          })}

          {/* Nodes */}
          {nodes.map(n => {
            const r = n.ring ? 16 : 12
            const fill = n.fraud > 0.7 ? '#f43f5e' : n.fraud > 0.4 ? '#f97316' : '#14b8a6'
            return (
              <g key={n.id} transform={`translate(${n.x},${n.y})`} filter={n.ring ? 'url(#glow)' : ''}>
                <circle r={r} fill={fill} opacity={0.9} stroke={n.ring ? '#fff' : '#1e293b'} strokeWidth={n.ring ? 2 : 1} />
                <text textAnchor="middle" y={r + 12} fontSize={8} fill="#94a3b8" fontFamily="monospace">
                  {n.id}
                </text>
                <text textAnchor="middle" y={4} fontSize={8} fill="#fff" fontWeight="bold">
                  {n.fraud.toFixed(2)}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-3 left-4 flex flex-col gap-1.5">
          {[
            { color: '#f43f5e', label: 'High fraud (ring member)', ring: true },
            { color: '#f97316', label: 'Medium fraud' },
            { color: '#14b8a6', label: 'Low fraud' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full border-2" style={{ background: l.color, borderColor: l.ring ? '#fff' : 'transparent' }} />
              <span className="text-[9px] text-slate-400">{l.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-5 h-px bg-rose-500" />
            <span className="text-[9px] text-slate-400">shared device_id/GPS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 border-t border-dashed border-slate-500" />
            <span className="text-[9px] text-slate-400">shared IP</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── LSTM SCORE HISTOGRAM ─────────────────────────────────────────────────────

function LSTMScoreHistogram() {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 size={13} className="text-indigo-500" />
        <span className="font-700 text-slate-800 text-[13px] uppercase tracking-tight">LSTM Score Distribution</span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={lstmHistogramData} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="bucket" tick={{ fontSize: 8, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" name="Claims" radius={[3, 3, 0, 0]}>
            {lstmHistogramData.map((entry, i) => (
              <rect key={i} fill={parseFloat(entry.bucket.split('–')[0]) >= 0.6 ? '#f43f5e' : '#6366f1'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="text-[10px] text-slate-400 mt-2 italic">Red buckets = LSTM score ≥ 0.6 (flag threshold)</div>
    </div>
  )
}

// ─── FRAUD RULE EDITOR ────────────────────────────────────────────────────────

function FraudRuleEditor() {
  const [rules, setRules] = useState(defaultRules)
  const [saved, setSaved] = useState(false)

  const toggle = (id: number) => setRules(r => r.map(rl => rl.id === id ? { ...rl, active: !rl.active } : rl))
  const updateVal = (id: number, val: number) => setRules(r => r.map(rl => rl.id === id ? { ...rl, value: val } : rl))

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert size={13} className="text-orange-500" />
        <span className="font-700 text-slate-800 text-[13px] uppercase tracking-tight">Fraud Rule Editor</span>
        <button
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}
          className={`ml-auto text-[10px] font-700 px-3 py-1.5 rounded-xl transition-all
            ${saved ? 'bg-emerald-500 text-white' : 'gradient-indigo text-white hover:opacity-90'}`}
        >
          {saved ? 'Saved ✓' : 'Save Rules'}
        </button>
      </div>
      <div className="space-y-2">
        {rules.map(r => (
          <div key={r.id} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-colors
            ${r.active ? 'bg-slate-50 border-slate-100' : 'bg-slate-50/40 border-slate-50 opacity-50'}`}>
            <button onClick={() => toggle(r.id)} className={`w-4 h-4 rounded border-2 flex-shrink-0 transition-colors
              ${r.active ? 'bg-indigo-500 border-indigo-500' : 'bg-white border-slate-300'}`}>
              {r.active && <span className="block w-2 h-2 bg-white rounded-sm m-auto" />}
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-700 text-slate-700 truncate">{r.name}</div>
              <div className="text-[10px] text-slate-400 font-mono">{r.field} {r.operator}</div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <input
                type="number" value={r.value} disabled={!r.active}
                onChange={e => updateVal(r.id, +e.target.value)}
                className="w-16 px-2 py-1 text-[11px] font-700 text-slate-700 bg-white border border-slate-200 rounded-lg text-right disabled:opacity-50"
              />
              {r.unit && <span className="text-[10px] text-slate-400">{r.unit}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function FraudPage() {
  const [selectedCase, setSelectedCase] = useState<FraudCase | null>(null)
  const [activeTab, setActiveTab] = useState<'cases' | 'rules' | 'histogram' | 'report'>('cases')
  const [realCases, setRealCases] = useState<FraudCase[]>([])
  const [fraudSummary, setFraudSummary] = useState<any>({})
  const [loadingCases, setLoadingCases] = useState(true)

  useEffect(() => {
    const fetchFraudData = async () => {
      try {
        setLoadingCases(true)
        // Need to import api — add at top of file
        const { default: api } = await import('@/lib/api')
        const [cases, summary] = await Promise.all([
          api.get('/fraud/cases?limit=50'),
          api.get('/fraud/summary'),
        ])
        const rawCases = Array.isArray(cases) ? cases : (cases as any)?.data ?? []
        const mapped: FraudCase[] = rawCases.map((c: any) => ({
          case_id: c.case_id,
          worker_id: c.worker_id,
          worker_name: c.worker_name,
          fraud_score: c.fraud_score,
          fraud_flag: c.fraud_flag,
          fraud_reason: c.fraud_reason || 'Unknown',
          status: (c.status || 'Under Review') as FraudCase['status'],
          stage_trace: [
            { stage: 'S1 — Deterministic Rules', result: c.fraud_flag ? 'Flag' : 'Pass', detail: `Trigger: ${c.trigger_type || 'Unknown'}` },
            { stage: 'S2 — ML Tabular Score', result: c.fraud_score > 0.6 ? 'Flag' : 'Pass', detail: `Score: ${c.fraud_score}` },
            { stage: 'S3 — Graph Ring', result: 'Pending', detail: 'Graph analysis result' },
            { stage: 'S4 — Decision', result: c.status, detail: `Payout status: ${c.payout_status}` },
          ],
        }))
        setRealCases(mapped)
        setFraudSummary((summary as any) || {})
      } catch (e) {
        console.error('Fraud data fetch error', e)
        // Fall back to mock data on error
        setRealCases(highRiskCases)
      } finally {
        setLoadingCases(false)
      }
    }
    fetchFraudData()
  }, [])

  const displayStatCards = [
    { label: 'Total Flagged', value: fraudSummary.total_flagged ?? statCards[0].value, gradient: 'gradient-rose', icon: ShieldAlert },
    { label: 'Confirmed Fraud', value: fraudSummary.confirmed_fraud ?? statCards[1].value, gradient: 'gradient-orange', icon: AlertTriangle },
    { label: 'Under Review', value: fraudSummary.under_review ?? statCards[2].value, gradient: 'gradient-indigo', icon: Eye },
    { label: 'Cleared', value: fraudSummary.cleared ?? statCards[3].value, gradient: 'gradient-teal', icon: CheckCircle2 },
  ]

  const displayCases = realCases.length > 0 ? realCases : highRiskCases

  const handleExportReport = () => {
    const txt = `WEEKLY FRAUD REPORT — ${weeklyFraudReport.period}
Total Flagged: ${fraudSummary.total_flagged ?? weeklyFraudReport.totalFlagged}
Confirmed Fraud: ${fraudSummary.confirmed_fraud ?? weeklyFraudReport.confirmedFraud}
Estimated Savings: ₹${weeklyFraudReport.estimatedSavings.toLocaleString()}
Top Reason: ${weeklyFraudReport.topReason}
Top Zone: ${weeklyFraudReport.topZone}
Avg Fraud Score: ${weeklyFraudReport.avgFraudScore}`
    const blob = new Blob([txt], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob); a.download = 'weekly_fraud_report.txt'; a.click()
  }

  return (
    <div className="animate-fade-up space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Fraud Detection Console</h1>
          <p className="text-slate-400 text-sm mt-1 font-400">4-stage cascade · ring detection graph · LSTM histogram · rule editor</p>
        </div>
        <button onClick={handleExportReport} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-700 text-slate-600 hover:border-rose-300 hover:text-rose-600 transition-all shadow-sm">
          <Download size={13} /> Weekly Fraud Report
        </button>
      </div>

      {/* ── SUDDEN SPIKE ALERTS ─────────────────────────────────────────────── */}
      {spikeAlerts.map(alert => (
        <div key={alert.zone} className={`flex items-start gap-3 px-4 py-3 rounded-xl border
          ${alert.severity === 'critical' ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'}`}>
          <Bell size={14} className={alert.severity === 'critical' ? 'text-rose-500 mt-0.5' : 'text-amber-500 mt-0.5'} />
          <div>
            <div className={`text-[11px] font-800 ${alert.severity === 'critical' ? 'text-rose-700' : 'text-amber-700'}`}>
              Sudden Spike Alert — {alert.zone} {alert.city} <span className="font-900">{alert.spike}</span>
            </div>
            <div className="text-[10px] text-slate-500 italic mt-0.5">{alert.detail}</div>
          </div>
          <span className={`ml-auto text-[10px] font-700 px-2 py-0.5 rounded-lg border
            ${alert.severity === 'critical' ? 'text-rose-600 bg-rose-100 border-rose-200' : 'text-amber-600 bg-amber-100 border-amber-200'}`}>
            {alert.severity.toUpperCase()}
          </span>
        </div>
      ))}

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {displayStatCards.map((s, i) => (
          <div key={i} className="card p-5">
            <div className={`w-10 h-10 rounded-2xl ${s.gradient} flex items-center justify-center mb-3`}>
              <s.icon size={16} className="text-white" />
            </div>
            <div className="stat-number">{s.value}</div>
            <div className="text-[11px] text-slate-400 mt-1 uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 4-Stage Cascade Chart */}
      <div className="card p-5">
        <div className="font-700 text-slate-800 text-[13px] uppercase tracking-tight mb-4">4-Stage Cascade — Case Volume</div>
        <div className="space-y-3">
          {cascadeData.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[10px] font-700 text-slate-500 w-36 flex-shrink-0">{s.stage}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                <div
                  className="h-5 rounded-full flex items-center pl-3 transition-all duration-700"
                  style={{ width: `${(s.cases / 284) * 100}%`, background: s.color }}
                >
                  <span className="text-[10px] font-800 text-white">{s.cases}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LSTM Trend */}
      <div className="card p-5">
        <div className="font-700 text-slate-800 text-[13px] uppercase tracking-tight mb-1">Avg LSTM Score — 7-Day Trend</div>
        <div className="text-[11px] text-slate-400 italic mb-4">Daily average behavioral fraud score</div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={lstmTrend} margin={{ top: 0, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 1]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="score" name="LSTM Score" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── D3 RING DETECTION GRAPH ★ ───────────────────────────────────────── */}
      <RingDetectionGraph />

      {/* Tab bar: Cases / Histogram / Rule Editor / Weekly Report */}
      <div className="card overflow-hidden">
        <div className="flex border-b border-slate-50">
          {[
            { key: 'cases', label: 'High-Risk Cases', icon: AlertTriangle },
            { key: 'histogram', label: 'LSTM Histogram', icon: BarChart2 },
            { key: 'rules', label: 'Fraud Rule Editor', icon: ShieldAlert },
            { key: 'report', label: 'Weekly Report', icon: FileText },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-1.5 px-5 py-3.5 text-[11px] font-700 uppercase tracking-wide transition-colors
                ${activeTab === tab.key ? 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/40' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <tab.icon size={11} /> {tab.label}
            </button>
          ))}
        </div>

        {/* High-Risk Cases */}
        {activeTab === 'cases' && (
          <div className="divide-y divide-slate-50">
            {loadingCases ? (
              <div className="px-5 py-8 text-center text-[12px] text-slate-400 italic">Loading fraud cases…</div>
            ) : displayCases.length === 0 ? (
              <div className="px-5 py-8 text-center text-[12px] text-slate-400 italic">No fraud cases found.</div>
            ) : null}
            {displayCases.map(c => (
              <div key={c.case_id} className="px-5 py-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {/* Fraud score ring */}
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.9" fill="none"
                          stroke={c.fraud_score > 0.7 ? '#f43f5e' : c.fraud_score > 0.4 ? '#f97316' : '#14b8a6'}
                          strokeWidth="3"
                          strokeDasharray={`${c.fraud_score * 100} 100`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-900 text-slate-800">
                        {c.fraud_score.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-800 text-slate-800 text-[13px]">{c.case_id}</span>
                        <span className={`text-[10px] font-700 px-2 py-0.5 rounded-lg border
                          ${c.status === 'Confirmed' ? 'text-rose-600 bg-rose-50 border-rose-200'
                            : c.status === 'Under Review' ? 'text-amber-600 bg-amber-50 border-amber-200'
                            : 'text-emerald-600 bg-emerald-50 border-emerald-200'}`}>
                          {c.status}
                        </span>
                        {c.fraud_flag && <span className="text-[9px] font-800 text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">FLAGGED</span>}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">{c.worker_id} · {c.worker_name}</div>
                      <div className="text-[11px] text-slate-400 italic mt-0.5">{c.fraud_reason}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCase(c)}
                    className="flex items-center gap-1 text-[10px] font-700 text-rose-500 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl hover:bg-rose-100 transition-colors flex-shrink-0"
                  >
                    <Eye size={10} /> Audit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LSTM Histogram */}
        {activeTab === 'histogram' && (
          <div className="p-5">
            <LSTMScoreHistogram />
          </div>
        )}

        {/* Fraud Rule Editor */}
        {activeTab === 'rules' && (
          <div className="p-5">
            <FraudRuleEditor />
          </div>
        )}

        {/* Weekly Fraud Report */}
        {activeTab === 'report' && (
          <div className="p-5 space-y-3">
            <div className="text-[11px] font-700 text-slate-500 uppercase tracking-wide">Week: {weeklyFraudReport.period}</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Flagged', value: weeklyFraudReport.totalFlagged, color: 'text-rose-600' },
                { label: 'Confirmed Fraud', value: weeklyFraudReport.confirmedFraud, color: 'text-orange-600' },
                { label: 'Estimated Savings', value: `₹${(weeklyFraudReport.estimatedSavings / 1000).toFixed(0)}K`, color: 'text-emerald-600' },
              ].map(s => (
                <div key={s.label} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                  <div className="text-[10px] font-700 text-slate-400 uppercase tracking-wide">{s.label}</div>
                  <div className={`text-[22px] font-900 tabular-nums mt-0.5 ${s.color}`}>{s.value}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Top Reason', value: weeklyFraudReport.topReason },
                { label: 'Top Risk Zone', value: weeklyFraudReport.topZone },
                { label: 'Avg Fraud Score', value: weeklyFraudReport.avgFraudScore },
              ].map(s => (
                <div key={s.label} className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="text-[10px] font-700 text-slate-400 uppercase tracking-wide">{s.label}</div>
                  <div className="text-[12px] font-800 text-slate-700 mt-0.5">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Audit Trail Viewer Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCase(null)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-6 py-4 border-b border-slate-50 flex items-center justify-between">
              <div>
                <div className="font-800 text-slate-800">{selectedCase.case_id} — Audit Trail</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{selectedCase.worker_name} · fraud_score: <b className="text-rose-500">{selectedCase.fraud_score}</b></div>
              </div>
              <button onClick={() => setSelectedCase(null)} className="text-[11px] font-700 text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">Close</button>
            </div>
            <div className="px-6 py-5 space-y-3">
              {/* SHAP attribution note */}
              <div className="px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-[10px] text-indigo-600 font-600">
                SHAP Attribution: gps_tower_delta contributes 38% · accelerometer_variance 24% · device_id_match 22% · velocity 16%
              </div>
              {selectedCase.stage_trace.map((t, i) => (
                <div key={i} className={`px-4 py-3 rounded-xl border
                  ${t.result === 'Pass' ? 'bg-emerald-50 border-emerald-100'
                    : t.result.includes('Flag') || t.result === 'Alert' ? 'bg-amber-50 border-amber-100'
                    : t.result === 'Confirmed' || t.result === 'Rejected' ? 'bg-rose-50 border-rose-100'
                    : 'bg-violet-50 border-violet-100'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-800 text-slate-700">{t.stage}</span>
                    <span className={`text-[10px] font-700 px-2 py-0.5 rounded-lg
                      ${t.result === 'Pass' ? 'text-emerald-600 bg-white border border-emerald-200'
                        : t.result.includes('Flag') || t.result === 'Alert' ? 'text-amber-600 bg-white border border-amber-200'
                        : 'text-rose-600 bg-white border border-rose-200'}`}>
                      {t.result}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 italic">{t.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}