'use client'

import { useState } from 'react'
import {
  Bell, Shield, Link2, Users, ChevronDown, ChevronUp,
  ToggleLeft, ToggleRight, Save, Plus, Trash2, RefreshCw,
  DollarSign, Sliders, Weight, Clock, AlertTriangle
} from 'lucide-react'

// ─── NOTIFICATION SETTINGS ────────────────────────────────────────────────────

const defaultToggles = {
  fraudAlerts: true,
  policyExpiry: true,
  claimApprovals: true,
  systemUpdates: false,
}

// ─── FRAUD THRESHOLDS ─────────────────────────────────────────────────────────

const defaultThresholds = {
  autoReject: 90,
  manualReview: 60,
  autoApprove: 20,
}

// ─── API INTEGRATIONS ─────────────────────────────────────────────────────────

const apiIntegrations = [
  { name: 'IMD (Rainfall Data)', key: 'imd', status: 'Connected', color: 'text-emerald-500' },
  { name: 'CPCB (Air Quality)', key: 'cpcb', status: 'Connected', color: 'text-emerald-500' },
  { name: 'OWM (Weather)', key: 'owm', status: 'Connected', color: 'text-emerald-500' },
  { name: 'Razorpay (Payouts)', key: 'razorpay', status: 'Connected', color: 'text-emerald-500' },
  { name: 'Google Maps', key: 'gmaps', status: 'Degraded', color: 'text-amber-500' },
]

// ─── ADMIN USERS ──────────────────────────────────────────────────────────────

const defaultAdmins = [
  { id: 1, name: 'Ravi Shankar', email: 'ravi@bhima.io', role: 'superadmin' },
  { id: 2, name: 'Priya Mehta', email: 'priya@bhima.io', role: 'analyst' },
  { id: 3, name: 'Arjun Das', email: 'arjun@bhima.io', role: 'ops' },
]

// ─── PLAN PRICING DATA ────────────────────────────────────────────────────────

const defaultPlans = [
  { tier: 'Basic', weeklyPremium: 29, coverageLimit: 2000, eventsAllowed: 3, renewalBonus: 0 },
  { tier: 'Standard', weeklyPremium: 49, coverageLimit: 5000, eventsAllowed: 6, renewalBonus: 5 },
  { tier: 'Premium', weeklyPremium: 79, coverageLimit: 10000, eventsAllowed: 12, renewalBonus: 10 },
]

// ─── COMPOSITE SCORE WEIGHTS ──────────────────────────────────────────────────

const defaultWeights = {
  R_norm: 30,      // Hydro Stress
  AQI_norm: 20,    // Optical Blur
  Traffic_norm: 20, // Kinetic Drag
  Wind_norm: 15,   // Social Disruption
  Disruption: 15,  // Agent Sync
}

// ─── INSIGHT AGENT SCHEDULE ───────────────────────────────────────────────────

const defaultSchedule = {
  cohortAnalysis: '02:00',
  lossRatioReport: '06:00',
  zoneRiskLeaderboard: '08:00',
  scenarioSimulation: '10:00',
  weeklyFraudReport: '00:00',
  cadenceMinutes: 15,
}

// ─── TRIGGER THRESHOLD CONFIG ─────────────────────────────────────────────────

const defaultTriggerThresholds = {
  hydroStress:      { l1: 25, l2: 50, l3: 75 },
  opticalBlur:      { l1: 30, l2: 55, l3: 80 },
  kineticDrag:      { l1: 20, l2: 45, l3: 70 },
  socialDisruption: { l1: 15, l2: 40, l3: 65 },
}

// ─── SECTION WRAPPER ──────────────────────────────────────────────────────────

function Section({ title, icon: Icon, children, accent = 'indigo' }: any) {
  const [open, setOpen] = useState(true)
  const accents: Record<string, string> = {
    indigo: 'text-indigo-500 bg-indigo-50 border-indigo-100',
    teal: 'text-teal-500 bg-teal-50 border-teal-100',
    orange: 'text-orange-500 bg-orange-50 border-orange-100',
    rose: 'text-rose-500 bg-rose-50 border-rose-100',
    violet: 'text-violet-500 bg-violet-50 border-violet-100',
    cyan: 'text-cyan-500 bg-cyan-50 border-cyan-100',
    amber: 'text-amber-500 bg-amber-50 border-amber-100',
    slate: 'text-slate-500 bg-slate-50 border-slate-100',
  }
  return (
    <div className="card overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50/60 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-3">
          <span className={`w-8 h-8 rounded-xl border flex items-center justify-center ${accents[accent]}`}>
            <Icon size={15} />
          </span>
          <span className="font-700 text-slate-800 text-[13px] uppercase tracking-wide">{title}</span>
        </div>
        {open ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
      </button>
      {open && <div className="px-6 pb-6 pt-2 border-t border-slate-50">{children}</div>}
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [toggles, setToggles] = useState(defaultToggles)
  const [thresholds, setThresholds] = useState(defaultThresholds)
  const [admins, setAdmins] = useState(defaultAdmins)
  const [plans, setPlans] = useState(defaultPlans)
  const [weights, setWeights] = useState(defaultWeights)
  const [schedule, setSchedule] = useState(defaultSchedule)
  const [triggerThresholds, setTriggerThresholds] = useState(defaultTriggerThresholds)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)

  return (
    <div className="animate-fade-up space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Settings</h1>
          <p className="text-slate-400 text-sm mt-1 font-400">Platform configuration, thresholds, integrations & agent schedules</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-700 uppercase tracking-wide transition-all shadow-sm
            ${saved ? 'bg-emerald-500 text-white' : 'gradient-indigo text-white hover:opacity-90'}`}
        >
          <Save size={13} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* ── 1. NOTIFICATIONS ─────────────────────────────────────────────────── */}
      <Section title="Notifications" icon={Bell} accent="indigo">
        <div className="grid grid-cols-2 gap-3 mt-2">
          {(Object.entries(toggles) as [keyof typeof toggles, boolean][]).map(([key, val]) => {
            const labels: Record<string, string> = {
              fraudAlerts: 'Fraud Alerts',
              policyExpiry: 'Policy Expiry Reminders',
              claimApprovals: 'Claim Approval Notifications',
              systemUpdates: 'System Update Alerts',
            }
            return (
              <div key={key} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[12px] font-600 text-slate-700">{labels[key]}</span>
                <button onClick={() => setToggles(t => ({ ...t, [key]: !val }))}>
                  {val
                    ? <ToggleRight size={22} className="text-indigo-500" />
                    : <ToggleLeft size={22} className="text-slate-300" />}
                </button>
              </div>
            )
          })}
        </div>
      </Section>

      {/* ── 2. FRAUD THRESHOLDS ──────────────────────────────────────────────── */}
      <Section title="Fraud Thresholds — 4-Stage Cascade" icon={Shield} accent="rose">
        <div className="space-y-5 mt-2">
          {(Object.entries(thresholds) as [keyof typeof thresholds, number][]).map(([key, val]) => {
            const meta: Record<string, { label: string; color: string }> = {
              autoReject: { label: 'Auto-Reject Threshold', color: '#f43f5e' },
              manualReview: { label: 'Manual Review Threshold', color: '#f97316' },
              autoApprove: { label: 'Auto-Approve Threshold', color: '#14b8a6' },
            }
            return (
              <div key={key}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[11px] font-700 text-slate-600 uppercase tracking-wide">{meta[key].label}</span>
                  <span className="text-[12px] font-800 tabular-nums" style={{ color: meta[key].color }}>{val}%</span>
                </div>
                <input
                  type="range" min={0} max={100} value={val}
                  onChange={e => setThresholds(t => ({ ...t, [key]: +e.target.value }))}
                  className="w-full accent-indigo-500 h-1.5"
                  style={{ accentColor: meta[key].color }}
                />
                <div className="flex justify-between text-[9px] text-slate-300 mt-0.5">
                  <span>0%</span><span>50%</span><span>100%</span>
                </div>
              </div>
            )
          })}
          <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5 text-[10px] text-rose-600 flex items-center gap-2 mt-1">
            <AlertTriangle size={12} />
            Stage cascade: Auto-Approve → Manual Review → Auto-Reject. Ensure Auto-Reject &gt; Manual Review &gt; Auto-Approve.
          </div>
        </div>
      </Section>

      {/* ── 3. API INTEGRATIONS ──────────────────────────────────────────────── */}
      <Section title="API Integrations" icon={Link2} accent="teal">
        <div className="space-y-2 mt-2">
          {apiIntegrations.map(api => (
            <div key={api.key} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[12px] font-600 text-slate-700">{api.name}</span>
              <div className="flex items-center gap-3">
                <span className={`text-[11px] font-700 ${api.color}`}>{api.status}</span>
                <button className="text-[10px] font-700 text-indigo-500 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1">
                  <RefreshCw size={10} /> Test
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 4. ADMIN USERS ───────────────────────────────────────────────────── */}
      <Section title="Admin Users — JWT Role Management" icon={Users} accent="violet">
        <div className="space-y-2 mt-2">
          {admins.map(admin => (
            <div key={admin.id} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <div className="text-[12px] font-700 text-slate-800">{admin.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{admin.email}</div>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={admin.role}
                  onChange={e => setAdmins(a => a.map(u => u.id === admin.id ? { ...u, role: e.target.value } : u))}
                  className="text-[11px] font-700 text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1.5 rounded-lg"
                >
                  <option value="superadmin">Superadmin</option>
                  <option value="analyst">Analyst</option>
                  <option value="ops">Ops</option>
                  <option value="readonly">Read-only</option>
                </select>
                <button
                  onClick={() => setAdmins(a => a.filter(u => u.id !== admin.id))}
                  className="text-rose-400 hover:text-rose-600 transition-colors p-1"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => setAdmins(a => [...a, { id: Date.now(), name: 'New User', email: 'user@bhima.io', role: 'readonly' }])}
            className="flex items-center gap-2 text-[11px] font-700 text-indigo-500 hover:text-indigo-700 mt-2 transition-colors"
          >
            <Plus size={13} /> Add Admin User
          </button>
        </div>
      </Section>

      {/* ── 5. PLAN PRICING EDITOR ★ ─────────────────────────────────────────── */}
      <Section title="Plan Pricing Editor" icon={DollarSign} accent="cyan">
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="text-slate-400 font-700 uppercase tracking-wide text-[10px]">
                <th className="text-left pb-3 pr-4">Tier</th>
                <th className="text-left pb-3 pr-4">Weekly Premium (₹)</th>
                <th className="text-left pb-3 pr-4">Coverage Limit (₹)</th>
                <th className="text-left pb-3 pr-4">Events Allowed</th>
                <th className="text-left pb-3">Renewal Bonus (%)</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {plans.map((plan, idx) => (
                <tr key={plan.tier} className="border-t border-slate-50">
                  <td className="py-2.5 pr-4">
                    <span className="font-800 text-slate-700 text-[12px]">{plan.tier}</span>
                  </td>
                  {(['weeklyPremium', 'coverageLimit', 'eventsAllowed', 'renewalBonus'] as const).map(field => (
                    <td key={field} className="py-2.5 pr-4">
                      <input
                        type="number"
                        value={plan[field]}
                        onChange={e => setPlans(p => p.map((pl, i) => i === idx ? { ...pl, [field]: +e.target.value } : pl))}
                        className="w-24 px-2 py-1.5 text-[11px] font-600 text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-300"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── 6. TRIGGER THRESHOLD CONFIG ★ ───────────────────────────────────── */}
      <Section title="Trigger Threshold Config — L1 / L2 / L3 Levels" icon={Sliders} accent="orange">
        <div className="grid grid-cols-2 gap-4 mt-3">
          {(Object.entries(triggerThresholds) as [keyof typeof triggerThresholds, { l1: number; l2: number; l3: number }][]).map(([key, levels]) => {
            const labels: Record<string, string> = {
              hydroStress: 'Hydro Stress',
              opticalBlur: 'Optical Blur',
              kineticDrag: 'Kinetic Drag',
              socialDisruption: 'Social Disruption',
            }
            return (
              <div key={key} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                <div className="text-[11px] font-800 text-slate-700 uppercase tracking-wide mb-3">{labels[key]}</div>
                <div className="space-y-2">
                  {(['l1', 'l2', 'l3'] as const).map(lvl => (
                    <div key={lvl} className="flex items-center gap-3">
                      <span className={`text-[10px] font-800 w-6 ${lvl === 'l1' ? 'text-amber-500' : lvl === 'l2' ? 'text-orange-500' : 'text-rose-500'}`}>
                        {lvl.toUpperCase()}
                      </span>
                      <input
                        type="range" min={0} max={100} value={levels[lvl]}
                        onChange={e => setTriggerThresholds(t => ({
                          ...t,
                          [key]: { ...t[key], [lvl]: +e.target.value }
                        }))}
                        className="flex-1 h-1.5"
                        style={{ accentColor: lvl === 'l1' ? '#f59e0b' : lvl === 'l2' ? '#f97316' : '#f43f5e' }}
                      />
                      <span className="text-[11px] font-700 text-slate-600 w-8 text-right tabular-nums">{levels[lvl]}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* ── 7. COMPOSITE WEIGHT SLIDERS ★ ───────────────────────────────────── */}
      <Section title="Composite Score Weight Sliders" icon={Weight} accent="amber">
        <div className="mt-3 space-y-4">
          <div className={`flex items-center gap-2 text-[11px] font-700 px-3 py-2 rounded-xl border ${totalWeight === 100 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-amber-600 bg-amber-50 border-amber-100'}`}>
            <AlertTriangle size={12} />
            Total weight: {totalWeight}% {totalWeight !== 100 ? '— must sum to 100%' : '— ✓ balanced'}
          </div>
          {(Object.entries(weights) as [keyof typeof weights, number][]).map(([key, val]) => {
            const meta: Record<string, { label: string; color: string; desc: string }> = {
              R_norm:       { label: 'R_norm (Hydro Stress)',      color: '#6366f1', desc: 'Rainfall normalised score' },
              AQI_norm:     { label: 'AQI_norm (Optical Blur)',    color: '#14b8a6', desc: 'Air quality index score' },
              Traffic_norm: { label: 'Traffic_norm (Kinetic Drag)',color: '#f97316', desc: 'Traffic disruption score' },
              Wind_norm:    { label: 'Wind_norm (Social Disr.)',   color: '#a855f7', desc: 'Wind velocity score' },
              Disruption:   { label: 'Disruption (Agent Sync)',    color: '#f43f5e', desc: 'Manager disruption flag' },
            }
            return (
              <div key={key}>
                <div className="flex justify-between mb-1">
                  <div>
                    <span className="text-[11px] font-700 text-slate-700">{meta[key].label}</span>
                    <span className="text-[10px] text-slate-400 ml-2 italic">{meta[key].desc}</span>
                  </div>
                  <span className="text-[12px] font-800 tabular-nums" style={{ color: meta[key].color }}>{val}%</span>
                </div>
                <input
                  type="range" min={0} max={60} value={val}
                  onChange={e => setWeights(w => ({ ...w, [key]: +e.target.value }))}
                  className="w-full h-1.5"
                  style={{ accentColor: meta[key].color }}
                />
              </div>
            )
          })}
        </div>
      </Section>

      {/* ── 8. INSIGHT AGENT SCHEDULE ★ ─────────────────────────────────────── */}
      <Section title="Insight Agent Schedule" icon={Clock} accent="slate">
        <div className="mt-3 space-y-3">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[12px] font-600 text-slate-700">Monitor Agent Polling Cadence</span>
            <div className="flex items-center gap-2">
              <input
                type="number" min={5} max={60} value={schedule.cadenceMinutes}
                onChange={e => setSchedule(s => ({ ...s, cadenceMinutes: +e.target.value }))}
                className="w-16 px-2 py-1 text-[11px] font-700 text-slate-700 bg-white border border-slate-200 rounded-lg text-right"
              />
              <span className="text-[11px] text-slate-400">min</span>
            </div>
          </div>

          {([
            ['cohortAnalysis',      'Cohort Retention Analysis'],
            ['lossRatioReport',     'Loss Ratio Weekly Report'],
            ['zoneRiskLeaderboard', 'Zone Risk Leaderboard Refresh'],
            ['scenarioSimulation',  'Actuarial Scenario Simulation'],
            ['weeklyFraudReport',   'Weekly Fraud Report Export'],
          ] as [keyof typeof schedule, string][]).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[12px] font-600 text-slate-700">{label}</span>
              <input
                type="time"
                value={schedule[key] as string}
                onChange={e => setSchedule(s => ({ ...s, [key]: e.target.value }))}
                className="text-[11px] font-700 text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1"
              />
            </div>
          ))}
        </div>
      </Section>

    </div>
  )
}