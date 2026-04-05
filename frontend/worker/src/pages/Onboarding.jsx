import { useState } from "react";
import { appPath } from "../utils/appPath";

const plans = [
  {
    id: "basic",
    name: "Basic",
    premium: 49,
    payouts: { L1: 300, L2: 600 },
    events: 2,
    color: "border-gray-200",
    recommended: false,
    features: ["L1 Rain (>50mm): ₹300", "L2 Rain (>100mm): ₹600", "AQI L1 (>200): ₹300", "2 events/week"],
  },
  {
    id: "standard",
    name: "Standard",
    premium: 89,
    payouts: { L1: 400, L2: 800, L3: 1200 },
    events: 2,
    color: "border-purple-500",
    recommended: true,
    features: ["L1 Rain (>50mm): ₹400", "L2 Rain (>100mm): ₹800", "L3 Extreme (>150mm): ₹1,200", "AQI L1 & L2", "Heat wave trigger", "2 events/week"],
  },
  {
    id: "premium",
    name: "Premium",
    premium: 149,
    payouts: { L1: 600, L2: 1200, L3: 1800 },
    events: 3,
    color: "border-gray-200",
    recommended: false,
    features: ["L1 Rain (>50mm): ₹600", "L2 Rain (>100mm): ₹1,200", "L3 Extreme (>150mm): ₹1,800", "Full AQI + Heat wave", "Platform outage", "3 events/week"],
  },
];

const riskFactors = [
  { label: "Zone Risk", value: 72, color: "bg-orange-500", description: "Kondapur, Zone 4 — high disruption frequency" },
  { label: "Seasonal Risk", value: 65, color: "bg-yellow-500", description: "Pre-monsoon season · April–June" },
  { label: "Vehicle Exposure", value: 58, color: "bg-blue-500", description: "Bike — higher weather sensitivity" },
  { label: "Shift Exposure", value: 80, color: "bg-red-500", description: "Peak hours overlap with storm windows" },
];

// ── Step 1: Risk Score Reveal ──────────────────────────────────────────────
function StepRiskScore({ onNext }) {
  const [revealed, setRevealed] = useState(false);
  const score = 68;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
          style={{ color: '#7c3aed', background: '#f5f3ff' }}>
          Step 1 of 3
        </span>
        <h2 className="text-2xl font-black text-gray-900">Your Risk Profile</h2>
        <p className="text-sm text-gray-500 mt-1">AI-generated based on your zone, shift, and vehicle type</p>
      </div>

      {/* Score Gauge */}
      <div className="bg-white rounded-xl border shadow-sm p-6 flex flex-col items-center">
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 120 120" className="w-40 h-40 -rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#f3f4f6" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              stroke={score >= 65 ? "#f97316" : score >= 40 ? "#eab308" : "#22c55e"}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={revealed ? offset : circumference}
              style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-gray-900">{revealed ? score : "—"}</span>
            <span className="text-xs text-gray-500 font-medium">/ 100</span>
          </div>
        </div>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="mt-4 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
          >
            Reveal My Score
          </button>
        ) : (
          <div className="mt-4 text-center">
            <span className="inline-block text-sm font-bold px-4 py-1.5 rounded-full"
              style={{ color: '#92400e', background: '#fff7ed', border: '1px solid #fed7aa' }}>
              Moderate–High Risk Zone
            </span>
            <p className="text-xs text-gray-500 mt-2 max-w-xs">
              Your zone sees disruptions <strong>8–12 days/month</strong> during this season. Coverage is strongly recommended.
            </p>
          </div>
        )}
      </div>

      {/* Factor Breakdown */}
      {revealed && (
        <div className="bg-white rounded-xl border shadow-sm p-5 space-y-4">
          <p className="text-sm font-semibold text-gray-900">Score Breakdown</p>
          {riskFactors.map((f) => (
            <div key={f.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-700">{f.label}</span>
                <span className="text-xs font-bold text-gray-900">{f.value}/100</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                <div
                  className={`${f.color} rounded-full h-2 transition-all duration-700`}
                  style={{ width: `${f.value}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">{f.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Explanation */}
      {revealed && (
        <div className="rounded-xl p-4 flex gap-3" style={{ background: '#f5f3ff', border: '1px solid #ede9fe' }}>
          <span className="text-xl flex-shrink-0">💡</span>
          <p className="text-sm" style={{ color: '#4c1d95' }}>
            A score of <strong>68</strong> means there's a <strong>68% probability</strong> of at least one qualifying disruption event per week in your zone. BhimaAstra pays you automatically when thresholds are crossed — no claims needed.
          </p>
        </div>
      )}

      <button
        onClick={onNext}
        disabled={!revealed}
        className={`w-full py-4 rounded-xl text-sm font-bold transition-all ${
          revealed ? "text-white shadow-md" : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
        style={revealed ? { background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 14px rgba(124,58,237,0.3)' } : {}}
      >
        Choose My Plan →
      </button>
    </div>
  );
}

// ── Step 2: Plan Recommendation ────────────────────────────────────────────
function StepPlanRecommendation({ onNext }) {
  const [selected, setSelected] = useState("standard");
  const selectedPlan = plans.find((p) => p.id === selected);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
          style={{ color: '#7c3aed', background: '#f5f3ff' }}>
          Step 2 of 3
        </span>
        <h2 className="text-2xl font-black text-gray-900">Choose Your Plan</h2>
        <p className="text-sm text-gray-500 mt-1">Based on your risk score of 68, Standard is recommended</p>
      </div>

      {/* AI Banner */}
      <div className="rounded-xl p-4 flex items-center gap-3 text-white"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
          style={{ background: 'rgba(255,255,255,0.2)' }}>
          🤖
        </div>
        <div>
          <p className="text-sm font-bold">AI Recommends: Standard</p>
          <p className="text-xs mt-0.5" style={{ color: '#ddd6fe' }}>
            Best coverage-to-cost ratio for Zone 4 · 8–12 disruption days/month
          </p>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const isSelected = selected === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className="relative bg-white rounded-xl border-2 p-5 cursor-pointer transition-all"
              style={
                isSelected
                  ? plan.recommended
                    ? { borderColor: '#7c3aed', boxShadow: '0 8px 24px rgba(124,58,237,0.15)' }
                    : { borderColor: '#1f2937', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                  : { borderColor: '#e5e7eb' }
              }
            >
              {/* Badges */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  {plan.recommended && (
                    <span className="inline-block text-xs font-bold text-white px-2.5 py-0.5 rounded-full mb-1.5"
                      style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
                      ★ Recommended
                    </span>
                  )}
                  <p className="text-lg font-black text-gray-900">{plan.name}</p>
                </div>
                <div
                  className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors"
                  style={isSelected ? { borderColor: '#7c3aed', background: '#7c3aed' } : { borderColor: '#d1d5db' }}
                >
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-black text-gray-900">₹{plan.premium}</span>
                <span className="text-gray-400 text-sm">/week</span>
              </div>

              {/* Payout chips */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {Object.entries(plan.payouts).map(([level, amount]) => (
                  <span key={level} className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                    {level}: ₹{amount}
                  </span>
                ))}
              </div>

              {/* Features */}
              <div className="space-y-1.5">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-1.5">
                    <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-gray-600">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Plan Summary */}
      <div className="bg-gray-50 rounded-xl border p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Selected Plan</p>
          <p className="text-sm font-bold text-gray-900">{selectedPlan?.name} · ₹{selectedPlan?.premium}/week</p>
        </div>
        <span className="text-xs text-gray-400">Cancel anytime</span>
      </div>

      <button
        onClick={onNext}
        className="w-full py-4 text-white text-sm font-bold rounded-xl transition-colors"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 14px rgba(124,58,237,0.3)' }}
      >
        Continue with {selectedPlan?.name} →
      </button>
    </div>
  );
}

// ── Step 3: Policy Activation ──────────────────────────────────────────────
function StepActivation({ onActivate }) {
  const [activating, setActivating] = useState(false);
  const [done, setDone] = useState(false);

  const handleActivate = () => {
    setActivating(true);
    setTimeout(() => {
      setActivating(false);
      setDone(true);
      setTimeout(onActivate, 1800);
    }, 1600);
  };

  const coverageItems = [
    { icon: "🌧️", label: "Heavy Rain L1", value: "₹400 payout" },
    { icon: "⛈️", label: "Heavy Rain L2", value: "₹800 payout" },
    { icon: "🌊", label: "Extreme Rain L3", value: "₹1,200 payout" },
    { icon: "😷", label: "AQI Alert L1 & L2", value: "₹400 / ₹800" },
    { icon: "🌡️", label: "Heat Wave", value: "₹400 payout" },
  ];

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-5 text-center">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-black text-gray-900">You're Covered!</h3>
          <p className="text-sm text-gray-500 mt-1">BhimaAstra Standard is now active</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl px-6 py-4 text-center">
          <p className="text-xs text-green-700 font-medium">Policy ID</p>
          <p className="text-base font-mono font-bold text-green-800 mt-0.5">POL-2025-GS-004822</p>
        </div>
        <p className="text-xs text-gray-400">Redirecting to your dashboard…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
          style={{ color: '#7c3aed', background: '#f5f3ff' }}>
          Step 3 of 3
        </span>
        <h2 className="text-2xl font-black text-gray-900">Activate Your Policy</h2>
        <p className="text-sm text-gray-500 mt-1">Review your coverage before going live</p>
      </div>

      {/* Policy Summary Card */}
      <div className="rounded-xl p-5 text-white"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#ddd6fe' }}>Plan</p>
            <p className="text-2xl font-black">Standard</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black">₹89</p>
            <p className="text-sm" style={{ color: '#ddd6fe' }}>per week</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Coverage Start", value: "Today, 29 Mar" },
            { label: "Coverage End", value: "Sun, 4 Apr" },
            { label: "Max Events", value: "2 per week" },
            { label: "Max Payout", value: "₹2,400/week" },
          ].map((d) => (
            <div key={d.label} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <p className="text-xs" style={{ color: '#ddd6fe' }}>{d.label}</p>
              <p className="text-sm font-bold">{d.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <svg className="w-4 h-4" style={{ color: '#ddd6fe' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <p className="text-xs" style={{ color: '#ddd6fe' }}>Kondapur, Zone 4 · Hyderabad</p>
        </div>
      </div>

      {/* Coverage Details */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b">
          <p className="text-sm font-semibold text-gray-900">What's Covered</p>
        </div>
        <div className="divide-y">
          {coverageItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl border shadow-sm p-5">
        <p className="text-sm font-semibold text-gray-900 mb-4">How Payouts Work</p>
        <div className="space-y-4">
          {[
            { step: "1", icon: "📡", title: "We Watch", desc: "BhimaAstra monitors IMD, CPCB, and traffic data every 15 minutes for your zone." },
            { step: "2", icon: "⚡", title: "Auto Trigger", desc: "When a threshold is crossed, your claim is created instantly — no action needed from you." },
            { step: "3", icon: "💸", title: "UPI Payout", desc: "Money hits your UPI ID within 2 hours. You get a push notification immediately." },
          ].map((s) => (
            <div key={s.step} className="flex gap-4">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: '#f5f3ff' }}>
                {s.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Detail */}
      <div className="bg-gray-50 rounded-xl border p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Standard Plan</span>
          <span className="font-medium text-gray-900">₹89.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">GST (18%)</span>
          <span className="font-medium text-gray-900">₹16.02</span>
        </div>
        <div className="border-t pt-2 flex justify-between text-sm font-bold">
          <span className="text-gray-900">Total Due</span>
          <span className="text-gray-900">₹105.02</span>
        </div>
        <div className="flex items-center gap-1.5 pt-1">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-xs text-gray-400">Paid via UPI · ravi@upi</span>
        </div>
      </div>

      {/* Activate Button */}
      <button
        onClick={handleActivate}
        disabled={activating}
        className="w-full py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 text-white"
        style={
          activating
            ? { background: '#a78bfa', cursor: 'not-allowed' }
            : { background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 14px rgba(124,58,237,0.3)' }
        }
      >
        {activating ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Activating…
          </>
        ) : (
          "Activate Policy · ₹105.02"
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        By activating, you agree to BhimaAstra's{" "}
        <a href="#" style={{ color: '#7c3aed' }} className="hover:underline">Terms</a> and{" "}
        <a href="#" style={{ color: '#7c3aed' }} className="hover:underline">Privacy Policy</a>.
        IRDAI-compliant parametric insurance.
      </p>
    </div>
  );
}

// ── Main Onboarding Component ──────────────────────────────────────────────
export default function Onboarding() {
  const [step, setStep] = useState(0);

  const handleComplete = () => {
    window.location.href = appPath("/dashboard");
  };

  const stepLabels = ["Risk Score", "Plan", "Activate"];

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              <span className="text-white text-xs font-bold">G</span>
            </div>
            <span className="font-semibold text-gray-900 text-sm">BhimaAstra</span>
          </div>
          <span className="text-xs text-gray-400 font-medium">Setup {step + 1}/3</span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 h-1">
        <div
          className="h-1 transition-all duration-500"
          style={{ width: `${((step + 1) / 3) * 100}%`, background: 'linear-gradient(90deg, #7c3aed, #6d28d9)' }}
        />
      </div>

      {/* Step Indicators */}
      <div className="bg-white border-b">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center gap-2">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                    style={
                      i < step
                        ? { background: '#7c3aed', color: 'white' }
                        : i === step
                        ? { background: '#7c3aed', color: 'white', boxShadow: '0 0 0 4px rgba(124,58,237,0.15)' }
                        : { background: '#f3f4f6', color: '#9ca3af' }
                    }
                  >
                    {i < step ? (
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className="text-xs font-medium hidden sm:block"
                    style={{ color: i <= step ? '#7c3aed' : '#9ca3af' }}
                  >
                    {label}
                  </span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div className="w-8 md:w-16 h-0.5"
                    style={{ background: i < step ? '#7c3aed' : '#e5e7eb' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-6 max-w-2xl">
          {step === 0 && <StepRiskScore onNext={() => setStep(1)} />}
          {step === 1 && <StepPlanRecommendation onNext={() => setStep(2)} />}
          {step === 2 && <StepActivation onActivate={handleComplete} />}
        </div>
      </div>
    </div>
  );
}